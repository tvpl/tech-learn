import { z } from "zod";
import { ElementSchema, RectSchema, type ElementDef } from "./elements";
import { AddSpecSchema, CameraSchema, CaptionSchema, CueSchema, QuizSchema } from "./directives";

/** Propriedades que `scene.set` pode sobrescrever de forma PERSISTENTE (keyframe). */
export const SettableSchema = z
  .object({
    at: RectSchema.partial(),
    opacity: z.number().min(0).max(1),
    tone: z.enum(["accent", "accent2", "good", "warn", "hot", "neutral"]),
    text: z.string(),
    label: z.string(),
    sub: z.string(),
    values: z.array(z.number().min(0).max(1)),
    dimmed: z.boolean(),
  })
  .partial();
export type Settable = z.infer<typeof SettableSchema>;

export const SceneSchema = z.object({
  id: z.string().min(1),
  title: z.string(),
  /** Duração da cena em ms (relógio do autoplay e do vídeo). */
  duration: z.number().positive().default(8000),
  /** Papel especial no export social (capa / call-to-action). */
  role: z.enum(["normal", "cover", "cta"]).default("normal"),
  /** Visibilidade acumulativa: entram aqui e permanecem até um `remove`. */
  add: z.array(AddSpecSchema).default([]),
  remove: z.array(z.string()).default([]),
  /** Overrides persistentes por elemento (aplicados no início da cena). */
  set: z.record(z.string(), SettableSchema).default({}),
  /** Animações locais da cena (escopo: a cena — nada vaza). */
  cues: z.array(CueSchema).default([]),
  camera: CameraSchema.optional(),
  caption: CaptionSchema.optional(),
  /** Roteiro/legenda para o vídeo (e TTS futuro). */
  narration: z.string().optional(),
  quiz: QuizSchema.optional(),
  /** Momento (ms) do frame-herói desta cena no carrossel. Default: 90% da cena. */
  posterAt: z.number().min(0).optional(),
});
export type Scene = z.infer<typeof SceneSchema>;

export const ExplainerSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string(),
  subtitle: z.string().optional(),
  category: z.string(),
  tags: z.array(z.string()).default([]),
  level: z.enum(["intro", "medio", "avancado"]).default("intro"),
  /** termo → definição (tooltips {{termo}} nos textos). */
  glossary: z.record(z.string(), z.string()).default({}),
  elements: z.array(ElementSchema),
  scenes: z.array(SceneSchema).min(1),
});
export type Explainer = z.infer<typeof ExplainerSchema>;

/** Input types (antes dos defaults do zod) — é o que os autores escrevem. */
export type ExplainerInput = z.input<typeof ExplainerSchema>;

export class ContentError extends Error {}

/**
 * Valida um explainer: schema (zod) + checagens semânticas que o zod não vê
 * (referências existem, cues dentro da duração, quiz bem formado…).
 * Usado no build (falha o deploy) e no `npm test`.
 */
export function validateExplainer(input: unknown): Explainer {
  const ex = ExplainerSchema.parse(input);
  const problems: string[] = [];

  // Passagem 1: coleta ids/grupos de TODO o array antes de validar referências —
  // uma referência pode apontar para um elemento definido mais adiante (ex.: um
  // grupo "flow" que lista filhos declarados depois dele no array).
  const ids = new Set<string>();
  const groups = new Set<string>();
  for (const el of ex.elements) {
    if (ids.has(el.id)) problems.push(`elemento duplicado: "${el.id}"`);
    ids.add(el.id);
    if (el.group) groups.add(el.group);
  }

  function hasRef(target: string): boolean {
    if (target.startsWith("@")) return groups.has(target.slice(1));
    return ids.has(target);
  }

  // Passagem 2: validações que dependem do conjunto completo de ids/grupos.
  for (const el of ex.elements) {
    if (el.kind !== "connector" && el.kind !== "flow" && !el.at) {
      problems.push(`elemento "${el.id}" (${el.kind}) precisa de \`at\``);
    }
    if (el.kind === "flow") {
      if (!el.at) problems.push(`flow "${el.id}" precisa de \`at\``);
      for (const c of el.children) if (!hasRef(c)) problems.push(`flow "${el.id}" referencia filho inexistente "${c}"`);
    }
    if (el.kind === "connector") {
      for (const rf of [el.from, el.to]) {
        if (typeof rf === "string" && !hasRef(rf)) problems.push(`connector "${el.id}" referencia "${rf}" inexistente`);
      }
    }
    if (el.kind === "bars" && el.labels && el.labels.length !== el.values.length) {
      problems.push(`bars "${el.id}": labels e values com tamanhos diferentes`);
    }
  }

  ex.scenes.forEach((sc, i) => {
    const where = `cena ${i + 1} ("${sc.id}")`;
    for (const a of sc.add) {
      const id = typeof a === "string" ? a : a.id;
      if (!hasRef(id)) problems.push(`${where}: add de "${id}" inexistente`);
    }
    for (const id of sc.remove) if (!hasRef(id)) problems.push(`${where}: remove de "${id}" inexistente`);
    for (const id of Object.keys(sc.set)) if (!ids.has(id)) problems.push(`${where}: set de "${id}" inexistente`);
    for (const cue of sc.cues) {
      if (!hasRef(cue.target)) problems.push(`${where}: cue "${cue.do}" mira "${cue.target}" inexistente`);
      if (cue.at >= sc.duration) problems.push(`${where}: cue "${cue.do}" em at=${cue.at} fora da duração (${sc.duration})`);
      if (cue.do === "flow") {
        const conn = ex.elements.find((e) => e.id === cue.target);
        if (conn && conn.kind !== "connector") problems.push(`${where}: flow mira "${cue.target}" que não é connector`);
      }
      if (cue.do === "setBars") {
        const el = ex.elements.find((e) => e.id === cue.target);
        if (el && el.kind === "bars" && el.values.length !== cue.values.length) {
          problems.push(`${where}: setBars em "${cue.target}" com nº de valores diferente`);
        }
      }
      if (cue.do === "lightCells") {
        const el = ex.elements.find((e) => e.id === cue.target);
        if (el && el.kind === "matrix") {
          for (const [r, c] of cue.cells) {
            if (r >= el.rows || c >= el.cols) problems.push(`${where}: lightCells célula [${r},${c}] fora de "${cue.target}" (${el.rows}×${el.cols})`);
          }
        }
      }
    }
    if (sc.camera && Array.isArray(sc.camera.fit)) {
      for (const id of sc.camera.fit) if (!hasRef(id)) problems.push(`${where}: camera.fit referencia "${id}" inexistente`);
    }
    if (sc.caption?.anchor && typeof sc.caption.anchor === "string" && !ids.has(sc.caption.anchor)) {
      problems.push(`${where}: caption.anchor "${sc.caption.anchor}" inexistente`);
    }
    if (sc.quiz && sc.quiz.answer >= sc.quiz.options.length) {
      problems.push(`${where}: quiz.answer fora do intervalo`);
    }
    if (sc.posterAt !== undefined && sc.posterAt > sc.duration) {
      problems.push(`${where}: posterAt além da duração`);
    }
  });

  const sceneIds = new Set<string>();
  for (const sc of ex.scenes) {
    if (sceneIds.has(sc.id)) problems.push(`cena duplicada: "${sc.id}"`);
    sceneIds.add(sc.id);
  }

  if (problems.length > 0) {
    throw new ContentError(`Explainer "${ex.slug}" inválido:\n  - ${problems.join("\n  - ")}`);
  }
  return ex;
}

/** Açúcar de autoria. */
export const r = (x: number, y: number, w: number, h: number) => ({ x, y, w, h });
export type { ElementDef };
