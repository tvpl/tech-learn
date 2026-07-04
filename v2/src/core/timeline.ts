/**
 * O coração da v2: compila um Explainer num timeline determinístico.
 *
 *   const tl = compileTimeline(explainer, "wide");
 *   const state = tl.getState(tMs);   // função PURA: mesmo t → mesmo estado
 *
 * O player web só controla o relógio; o Remotion chama getState(frame/fps*1000).
 * É essa pureza que dá paridade pixel-a-pixel entre site e vídeo social.
 *
 * Semântica:
 *  - `add`/`remove` acumulam entre cenas (o diagrama "cresce"), resolvidos aqui
 *    — nada de mutação em runtime como o enter(ctx) da v1;
 *  - `set` é um keyframe persistente aplicado no início da cena;
 *  - `cues` têm escopo LOCAL à cena: ao sair da cena, seus efeitos somem.
 */
import type { Explainer, Scene, Settable } from "@/schema/explainer";
import type { Caption, Cue, Transition } from "@/schema/directives";
import type { ElementDef, Tone } from "@/schema/elements";
import { FORMATS, type FormatId, type Rect } from "@/schema/formats";
import { boundsOf, fitCamera, resolveLayout, type CameraState, type ResolvedLayout } from "./layout";

/** Janela (ms) antes do fim de uma cena com quiz em que a pergunta já fica visível. */
export const QUIZ_GUARD_MS = 90;
import { clamp01, ease, lerp, pulseScale, springOut, windowProgress } from "./interpolate";
import { stableRandoms } from "./prng";
import type { PathGeom } from "./connectors";

export interface ElementState {
  def: ElementDef;
  rect?: Rect;
  visible: boolean;
  opacity: number;
  dx: number;
  dy: number;
  scale: number;
  /** 0..1 — progresso de traçado (connector) ou wipe (demais). */
  drawProgress: number;
  /** 0..1 — fração de caracteres visíveis (typewriter/morphText). */
  typeProgress: number;
  textOverride?: string;
  highlight: number;
  dim: number;
  values?: number[];
  litCells: { r: number; c: number; p: number }[];
  focusLines: [number, number] | null;
  counterProgress: number;
  toneOverride?: Tone;
}

export interface Particle {
  x: number;
  y: number;
  size: number;
  tone: Tone;
  opacity: number;
  key: string;
}

export interface CompiledScene {
  def: Scene;
  index: number;
  startMs: number;
  endMs: number;
  visible: Set<string>;
  enters: Map<string, { tr: Transition; delay: number }>;
  /** overrides persistentes acumulados até esta cena (inclusive). */
  setAcc: Map<string, Settable>;
  cameraTarget: CameraState;
  /**
   * Offset (ms desde startMs) em que todas as entradas desta cena já terminaram.
   * Reprodução em tempo real ainda passa por 0 normalmente.
   */
  settleMs: number;
  /**
   * Offset (ms desde startMs) para onde a navegação DIRETA (sidebar, deep-link,
   * retomar) deve pular: depois que as entradas terminaram e, se a cena tem quiz,
   * já dentro da janela em que a pergunta aparece — sem isso o usuário cairia
   * numa cena de quiz e precisaria esperar a duração inteira para ver a pergunta.
   */
  revealMs: number;
}

export interface StageState {
  t: number;
  sceneIndex: number;
  scene: CompiledScene;
  local: number;
  elements: Map<string, ElementState>;
  camera: CameraState;
  caption: { def: Caption; progress: number } | null;
  particles: Particle[];
}

export interface Timeline {
  explainer: Explainer;
  format: FormatId;
  layout: ResolvedLayout;
  scenes: CompiledScene[];
  totalMs: number;
  sceneAt(t: number): number;
  getState(t: number): StageState;
  pathOf(id: string): PathGeom | undefined;
}

const DEFAULT_TR: Transition = { type: "fade", dir: "up", duration: 600, stagger: 0, delay: 0 };

export function compileTimeline(ex: Explainer, format: FormatId): Timeline {
  const layout = resolveLayout(ex, format);
  const byId = new Map(ex.elements.map((e) => [e.id, e]));
  const groupMembers = (g: string) => ex.elements.filter((e) => e.group === g).map((e) => e.id);
  const expand = (target: string): string[] =>
    target.startsWith("@") ? groupMembers(target.slice(1)) : [target];

  // --- passo 1: visibilidade acumulada + enters + set acumulado ---
  const scenes: CompiledScene[] = [];
  let cursor = 0;
  let visible = new Set<string>();
  let setAcc = new Map<string, Settable>();

  for (let i = 0; i < ex.scenes.length; i++) {
    const sc = ex.scenes[i];
    visible = new Set(visible);
    setAcc = new Map(setAcc);
    const enters = new Map<string, { tr: Transition; delay: number }>();

    for (const spec of sc.add) {
      const id = typeof spec === "string" ? spec : spec.id;
      const tr: Transition = { ...DEFAULT_TR, ...(typeof spec === "string" ? {} : spec.enter) };
      const ids = expand(id);
      ids.forEach((elId, k) => {
        visible.add(elId);
        enters.set(elId, { tr, delay: tr.delay + k * tr.stagger });
      });
    }
    for (const id of sc.remove) for (const elId of expand(id)) visible.delete(elId);
    for (const [id, patch] of Object.entries(sc.set)) {
      setAcc.set(id, { ...setAcc.get(id), ...patch });
    }

    const cap = sc.duration > 0 ? sc.duration - 1 : 0;
    const settleMs = Math.min(
      cap,
      [...enters.values()].reduce((max, e) => Math.max(max, e.delay + e.tr.duration), 0),
    );
    const revealMs = sc.quiz ? Math.max(settleMs, Math.min(cap, sc.duration - QUIZ_GUARD_MS)) : settleMs;

    scenes.push({
      def: sc,
      index: i,
      startMs: cursor,
      endMs: cursor + sc.duration,
      visible,
      enters,
      setAcc,
      cameraTarget: { cx: 0, cy: 0, scale: 1 }, // preenchido no passo 2
      settleMs,
      revealMs,
    });
    cursor += sc.duration;
  }
  const totalMs = cursor;

  // --- passo 2: câmera por cena (depende da visibilidade resolvida) ---
  for (const cs of scenes) {
    const cam = cs.def.camera;
    let target: Rect;
    if (cam && !Array.isArray(cam.fit) && typeof cam.fit === "object") {
      target = cam.fit;
    } else if (cam && Array.isArray(cam.fit)) {
      const ids = cam.fit.flatMap(expand);
      target = boundsOf(ids, layout, ex.elements);
    } else {
      target = boundsOf([...cs.visible], layout, ex.elements);
    }
    cs.cameraTarget = fitCamera(target, format, cam?.pad ?? 0.1, cam?.zoom ?? 1);
  }

  const sceneAt = (t: number): number => {
    if (t <= 0) return 0;
    if (t >= totalMs) return scenes.length - 1;
    let lo = 0, hi = scenes.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (scenes[mid].endMs <= t) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  };

  // --- passo 3: getState ---
  const getState = (rawT: number): StageState => {
    const t = Math.min(Math.max(rawT, 0), Math.max(totalMs - 1, 0));
    const idx = sceneAt(t);
    const cs = scenes[idx];
    const local = t - cs.startMs;
    const elements = new Map<string, ElementState>();

    // estado base de cada elemento
    for (const el of ex.elements) {
      const patch = cs.setAcc.get(el.id) ?? {};
      const baseRect = layout.rects.get(el.id);
      const rect = baseRect
        ? { ...baseRect, ...(patch.at ?? {}) }
        : undefined;
      const st: ElementState = {
        def: el,
        rect,
        visible: cs.visible.has(el.id),
        opacity: patch.opacity ?? 1,
        dx: 0,
        dy: 0,
        scale: 1,
        drawProgress: 1,
        typeProgress: 1,
        textOverride: patch.text ?? patch.label,
        highlight: 0,
        dim: patch.dimmed ? 1 : 0,
        values: patch.values ?? (el.kind === "bars" ? el.values : undefined),
        litCells: [],
        focusLines: null,
        counterProgress: 1,
        toneOverride: patch.tone,
      };

      // transição de entrada (só anima na cena em que o elemento entrou)
      const enter = cs.enters.get(el.id);
      if (enter && st.visible) {
        const p = ease(enter.tr.type === "pop" ? "spring" : "out", windowProgress(local, enter.delay, enter.tr.duration));
        const linP = windowProgress(local, enter.delay, enter.tr.duration);
        switch (enter.tr.type) {
          case "fade":
            st.opacity *= p;
            break;
          case "slide": {
            st.opacity *= Math.min(1, linP * 1.6);
            const off = 34 * (1 - p);
            if (enter.tr.dir === "up") st.dy += off;
            else if (enter.tr.dir === "down") st.dy -= off;
            else if (enter.tr.dir === "left") st.dx += off;
            else st.dx -= off;
            break;
          }
          case "pop":
            st.opacity *= Math.min(1, linP * 2.2);
            st.scale *= 0.5 + 0.5 * springOut(linP);
            break;
          case "draw":
            st.drawProgress = ease("inOut", linP);
            st.opacity *= linP > 0 ? 1 : 0;
            break;
          case "wipe":
            st.drawProgress = ease("out", linP);
            break;
          case "typewriter":
            st.typeProgress = linP;
            st.opacity *= linP > 0 ? 1 : 0;
            break;
        }
        if (linP <= 0) st.opacity = 0;
      }
      elements.set(el.id, st);
    }

    // cues (escopo local da cena)
    const particles: Particle[] = [];
    for (let c = 0; c < cs.def.cues.length; c++) {
      const cue = cs.def.cues[c] as Cue;
      const ids = expand(cue.target);
      for (const id of ids) {
        const st = elements.get(id);
        if (!st) continue;
        const dur = cue.duration ?? defaultCueDuration(cue);
        const lin = windowProgress(local, cue.at, dur);
        const p = ease(cue.easing ?? "out", lin);
        switch (cue.do) {
          case "move": {
            const from = st.rect;
            let ox = 0, oy = 0;
            if (cue.by) { ox = cue.by.x; oy = cue.by.y; }
            else if (cue.to && from) { ox = cue.to.x - from.x; oy = cue.to.y - from.y; }
            st.dx += ox * p;
            st.dy += oy * p;
            break;
          }
          case "highlight":
            st.highlight = Math.max(st.highlight, windowProgress(local, cue.at, 300));
            break;
          case "dim":
            st.dim = Math.max(st.dim, windowProgress(local, cue.at, 300));
            break;
          case "pulse":
            st.scale *= pulseScale(lin, cue.times);
            break;
          case "draw":
            if (local >= cue.at) st.drawProgress = Math.min(st.drawProgress, ease("inOut", lin));
            break;
          case "setBars": {
            const from = st.values ?? [];
            st.values = cue.values.map((v, k) => lerp(from[k] ?? 0, v, p));
            break;
          }
          case "lightCells":
            cue.cells.forEach(([r, cIdx], k) => {
              const cp = windowProgress(local, cue.at + k * cue.stagger, 350);
              if (cp > 0) st.litCells.push({ r, c: cIdx, p: cp });
            });
            break;
          case "focusLines":
            if (local >= cue.at) st.focusLines = cue.lines;
            break;
          case "count":
            st.counterProgress = local < cue.at ? 0 : p;
            break;
          case "morphText":
            if (local >= cue.at) {
              st.textOverride = cue.to;
              st.typeProgress = p;
            }
            break;
          case "show":
            st.visible = true;
            st.opacity *= windowProgress(local, cue.at, 400);
            break;
          case "hide":
            st.opacity *= 1 - windowProgress(local, cue.at, 400);
            break;
          case "flow": {
            const geom = layout.paths.get(id);
            if (!geom) break;
            const active = local >= cue.at && (cue.duration === undefined || local <= cue.at + cue.duration);
            if (!active) break;
            const jit = stableRandoms(`${ex.slug}:${cs.def.id}:${c}:${id}`, cue.count);
            const winEnd = cue.duration !== undefined ? cue.at + cue.duration : cs.def.duration;
            const fadeIn = windowProgress(local, cue.at, 350);
            const fadeOut = 1 - windowProgress(local, winEnd - 350, 350);
            for (let k = 0; k < cue.count; k++) {
              const u = ((local - cue.at) / 1000) * cue.speed + k / cue.count + jit[k] * 0.08;
              const pos = geom.pointAt(u - Math.floor(u));
              particles.push({
                x: pos.x,
                y: pos.y,
                size: cue.size * (0.8 + jit[k] * 0.4),
                tone: cue.tone ?? "accent",
                opacity: Math.min(fadeIn, fadeOut),
                key: `${cs.def.id}-${c}-${k}`,
              });
            }
            break;
          }
        }
      }
    }

    // se algo está destacado, o resto do palco atenua levemente
    const anyHl = [...elements.values()].some((s) => s.visible && s.highlight > 0.05);
    if (anyHl) {
      for (const s of elements.values()) {
        if (s.visible && s.highlight <= 0.05 && s.dim === 0) s.dim = 0.35;
      }
    }

    // câmera: interpola da cena anterior para a atual
    const cam = cs.def.camera;
    const camAt = cam?.at ?? 0;
    const camDur = cam?.duration ?? 700;
    let camera: CameraState;
    if (idx === 0) {
      camera = cs.cameraTarget;
    } else {
      const prev = scenes[idx - 1].cameraTarget;
      const cur = cs.cameraTarget;
      const p = ease("inOut", windowProgress(local, camAt, camDur));
      camera = { cx: lerp(prev.cx, cur.cx, p), cy: lerp(prev.cy, cur.cy, p), scale: lerp(prev.scale, cur.scale, p) };
    }

    // caption com fade-in
    const caption = cs.def.caption
      ? { def: cs.def.caption, progress: ease("out", windowProgress(local, 350, 450)) }
      : null;

    return { t, sceneIndex: idx, scene: cs, local, elements, camera, caption, particles };
  };

  return {
    explainer: ex,
    format,
    layout,
    scenes,
    totalMs,
    sceneAt,
    getState,
    pathOf: (id) => layout.paths.get(id),
  };
}

function defaultCueDuration(cue: Cue): number {
  switch (cue.do) {
    case "pulse": return 900;
    case "move": return 700;
    case "setBars": return 800;
    case "draw": return 650;
    case "count": return 1200;
    case "morphText": return 600;
    default: return 400;
  }
}

/** Frame do carrossel: momento "herói" de uma cena (posterAt ou 90%). */
export function posterTimeOf(tl: Timeline, sceneIndex: number): number {
  const cs = tl.scenes[sceneIndex];
  const rel = cs.def.posterAt ?? cs.def.duration * 0.9;
  return cs.startMs + Math.min(rel, cs.def.duration - 1);
}

export function fpsOf(format: FormatId): number {
  return FORMATS[format].fps;
}
