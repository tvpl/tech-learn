import type { Settable, SceneInput } from "../../src/schema/explainer";
import { cueDurationEstimate } from "../../src/schema/explainer";
import type { AddSpec, Cue } from "../../src/schema/directives";
import type { ElementKind } from "../../src/schema/elements";
import type { RawStep, Scale, TraceEvent, Warning } from "./types";
import { htmlToMd } from "./glossary";
import { sx, sy } from "./mapElements";

function expandIds(list: string[] | undefined, groups: Map<string, string[]>): string[] {
  const out: string[] = [];
  for (const id of list ?? []) {
    if (id[0] === "@") out.push(...(groups.get(id.slice(1)) ?? []));
    else out.push(id);
  }
  return out;
}

export interface MapStepResult {
  scene: SceneInput;
  warnings: Warning[];
  /** Conjunto acumulado de ids visíveis DEPOIS desta cena — repasse como
   * `accumulatedVisible` da próxima chamada (mesma acumulação da v1). */
  accumulatedVisible: Set<string>;
}

export function mapStep(opts: {
  step: RawStep;
  idx: number;
  isFirstScene: boolean;
  baseIds: string[];
  /** Ids já visíveis ANTES desta cena (acumulado de show/hide de cenas
   * anteriores) — essencial para o dedupe: um `ctx.show(id)` no `enter()`
   * que mira algo já visível há cenas (comum na v1, onde é um no-op seguro)
   * NÃO pode virar uma cue "show", senão a opacidade zera até `cue.at`. */
  accumulatedVisible: Set<string>;
  trace: TraceEvent[];
  groups: Map<string, string[]>;
  kindOf: (id: string) => ElementKind | undefined;
  scale: Scale;
  autoplayMs: number;
  glossary: Record<string, string>;
  slug: string;
}): MapStepResult {
  const { step, idx, isFirstScene, baseIds, accumulatedVisible, trace, groups, kindOf, scale, autoplayMs, glossary, slug } = opts;
  const warnings: Warning[] = [];
  const warn = (message: string) => warnings.push({ slug, severity: "info", message });

  const stepShowExpanded = new Set(expandIds(step.show, groups));
  const stepHideExpanded = new Set(expandIds(step.hide, groups));
  // dedupe do "show": considera visível tanto o que ESTA cena adiciona quanto
  // tudo que já vinha acumulado de cenas anteriores — um `ctx.show(id)` no
  // `enter()` mirando algo já visível há cenas é um no-op seguro na v1, mas
  // virar uma cue "show" na v2 zeraria a opacidade até `cue.at` (bug real
  // encontrado ao migrar "kubernetes"). Dedupe do "hide" só olha o próprio
  // step porque uma cue "hide" redundante num elemento já invisível é inócua
  // (Stage só renderiza elementos com `visible:true`).
  const alreadyVisible = new Set([...accumulatedVisible, ...stepShowExpanded]);

  const add: AddSpec[] = [...(isFirstScene ? baseIds : []), ...(step.show ?? [])];
  const remove: string[] = [...(step.hide ?? [])];

  const cues: Cue[] = [];
  const set: Record<string, Settable> = {};
  const pulsedByTrace = new Set<string>();
  // show/hide do MESMO id no mesmo enter() (idioma v1 "esconde tudo, mostra
  // só o relevante") não podem virar DUAS cues: elas multiplicam opacidade
  // no motor v2 (não se sobrescrevem), e um hide+show do mesmo alvo zeraria
  // a opacidade final. Guarda só a última ocorrência por id (ordem do trace
  // = ordem de execução real) e emite uma cue por id, no fim.
  const visibilityByTarget = new Map<string, { at: number; call: "show" | "hide" }>();

  for (const ev of trace) {
    switch (ev.call) {
      case "show":
      case "hide":
        visibilityByTarget.set(ev.target, { at: ev.at, call: ev.call });
        break;
      case "moveTo": {
        const args = ev.args as { x: number; y: number };
        cues.push({ at: ev.at, target: ev.target, do: "move", by: { x: sx(args.x, scale), y: sy(args.y, scale) } });
        break;
      }
      case "drawArrow":
        if (kindOf(ev.target) !== "connector") {
          warn(`cue "draw" mira "${ev.target}" que não é connector na v2 — descartada, revisar manualmente`);
          break;
        }
        cues.push({ at: ev.at, target: ev.target, do: "draw" });
        break;
      case "setBars": {
        const args = ev.args as { vals: number[] };
        cues.push({ at: ev.at, target: ev.target, do: "setBars", values: args.vals });
        break;
      }
      case "lightCells": {
        const args = ev.args as { cells: Array<[number, number, number?]> };
        if (args.cells.some((c) => c[2] !== undefined)) {
          warn(`lightCells em "${ev.target}": opacidade customizada por célula descartada (v2 só aceita [r,c])`);
        }
        cues.push({
          at: ev.at,
          target: ev.target,
          do: "lightCells",
          cells: args.cells.map(([r, c]) => [r, c] as [number, number]),
          stagger: 90,
        });
        break;
      }
      case "pulse":
        cues.push({ at: ev.at, target: ev.target, do: "pulse", times: 2 });
        pulsedByTrace.add(ev.target);
        break;
      case "setLabel": {
        const args = ev.args as { text: string };
        const field = kindOf(ev.target) === "box" ? "label" : "text";
        set[ev.target] = { ...set[ev.target], [field]: args.text };
        break;
      }
      case "UNSUPPORTED_DOM_ACCESS":
        warn(`"${ev.target}": acesso DOM não suportado automaticamente (ctx.el/svgEl) — revisar manualmente`);
        break;
    }
  }

  // emite a cue final de show/hide por alvo (última ocorrência no trace vence)
  for (const [target, ev] of visibilityByTarget) {
    if (ev.call === "show") {
      if (!alreadyVisible.has(target)) cues.push({ at: ev.at, target, do: "show" });
    } else {
      if (!stepHideExpanded.has(target)) cues.push({ at: ev.at, target, do: "hide" });
    }
  }

  // highlight/dim/pulse no nível do step (v1: não acumulam, valem só nesta cena)
  for (const id of expandIds(step.highlight, groups)) cues.push({ at: 0, target: id, do: "highlight" });
  for (const id of expandIds(step.dim, groups)) cues.push({ at: 0, target: id, do: "dim" });
  for (const id of expandIds(step.pulse, groups)) {
    if (!pulsedByTrace.has(id)) cues.push({ at: 0, target: id, do: "pulse", times: 2 });
  }

  const maxCueEnd = cues.reduce((max, c) => Math.max(max, c.at + cueDurationEstimate(c)), 0);
  const duration = Math.max(autoplayMs, maxCueEnd + 500);

  const scene: SceneInput = {
    id: `s${idx + 1}`,
    title: step.title ?? `Cena ${idx + 1}`,
    duration,
    add,
    remove,
    set,
    cues,
  };

  if (step.balloon && (step.balloon.text || step.balloon.why)) {
    scene.caption = {
      anchor: step.balloon.anchor,
      placement: step.balloon.placement ?? "bottom",
      text: htmlToMd(step.balloon.text, glossary, warn) ?? "",
      why: htmlToMd(step.balloon.why, glossary, warn),
    };
  }

  if (step.quiz) {
    scene.quiz = {
      question: htmlToMd(step.quiz.question, glossary, warn) ?? step.quiz.question,
      options: step.quiz.options.map((o) => htmlToMd(o, glossary, warn) ?? o),
      answer: step.quiz.answer,
      explain: htmlToMd(step.quiz.explain, glossary, warn) ?? step.quiz.explain ?? "",
    };
  }

  const nextAccumulated = new Set(accumulatedVisible);
  for (const id of stepShowExpanded) nextAccumulated.add(id);
  for (const id of stepHideExpanded) nextAccumulated.delete(id);
  if (isFirstScene) for (const id of baseIds) nextAccumulated.add(id);

  return { scene, warnings, accumulatedVisible: nextAccumulated };
}
