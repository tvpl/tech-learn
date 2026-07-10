import { z } from "zod";
import type { FormatId, Rect } from "./formats";

/** Tons semânticos — mapeiam para variáveis CSS do tema (nunca hex no conteúdo). */
export const ToneSchema = z.enum(["accent", "accent2", "good", "warn", "hot", "neutral"]);
export type Tone = z.infer<typeof ToneSchema>;

export const RectSchema = z.object({
  x: z.number(),
  y: z.number(),
  w: z.number(),
  h: z.number(),
});

const PointSchema = z.object({ x: z.number(), y: z.number() });
export type Point = z.infer<typeof PointSchema>;

/** Referência: id de elemento ou ponto do mundo. */
export const RefSchema = z.union([z.string(), PointSchema]);
export type Ref = z.infer<typeof RefSchema>;

/** Campos comuns a todo elemento. */
const base = {
  id: z.string().min(1),
  /** Grupo lógico — referenciável como "@nome" em add/remove/cues. */
  group: z.string().optional(),
  /** Posição base no mundo 1600×900. Opcional para connector (geometria derivada). */
  at: RectSchema.optional(),
  /** Override de posição por formato (vertical/feed). */
  layout: z.record(z.enum(["wide", "vertical", "feed"]), RectSchema).optional(),
  tone: ToneSchema.optional(),
  /** Ignorado pelo auto-enquadramento da câmera (fundos, decoração). */
  noFit: z.boolean().optional(),
  z: z.number().optional(),
};

export const ElementSchema = z.discriminatedUnion("kind", [
  // Caixa: o bloco de diagrama clássico (label + sublabel + ícone opcional)
  z.object({
    ...base,
    kind: z.literal("box"),
    label: z.string().optional(),
    sub: z.string().optional(),
    icon: z.string().optional(),
    variant: z.enum(["solid", "outline", "ghost"]).default("outline"),
  }),
  // Token: pílula pequena (palavras, pacotes, chaves…)
  z.object({ ...base, kind: z.literal("token"), text: z.string(), mono: z.boolean().optional() }),
  // Rótulo de texto curto
  z.object({
    ...base,
    kind: z.literal("label"),
    text: z.string(),
    size: z.number().optional(),
    align: z.enum(["start", "center", "end"]).default("center"),
    muted: z.boolean().optional(),
  }),
  // Parágrafo com markdown leve (**negrito**, `code`, {{termo-do-glossário}})
  z.object({
    ...base,
    kind: z.literal("text"),
    md: z.string(),
    size: z.number().optional(),
    align: z.enum(["start", "center", "end"]).default("start"),
  }),
  // Conector auto-roteado entre elementos (ou pontos)
  z.object({
    ...base,
    kind: z.literal("connector"),
    from: RefSchema,
    to: RefSchema,
    route: z.enum(["line", "elbow", "curve"]).default("line"),
    arrow: z.boolean().default(true),
    dashed: z.boolean().optional(),
    label: z.string().optional(),
    thickness: z.number().optional(),
  }),
  // Bloco de código com syntax highlight (shiki)
  z.object({
    ...base,
    kind: z.literal("code"),
    lang: z.string(),
    source: z.string(),
    title: z.string().optional(),
    fontSize: z.number().optional(),
  }),
  // Fórmula LaTeX (katex, síncrono)
  z.object({ ...base, kind: z.literal("formula"), latex: z.string(), size: z.number().optional() }),
  // Barras verticais 0..1 (embeddings, distribuições…)
  z.object({
    ...base,
    kind: z.literal("bars"),
    values: z.array(z.number().min(0).max(1)),
    labels: z.array(z.string()).optional(),
  }),
  // Grade de células (matriz de atenção…)
  z.object({
    ...base,
    kind: z.literal("matrix"),
    rows: z.number().int().positive(),
    cols: z.number().int().positive(),
    rowLabels: z.array(z.string()).optional(),
    colLabels: z.array(z.string()).optional(),
  }),
  // Ícone (lucide)
  z.object({ ...base, kind: z.literal("icon"), name: z.string(), strokeWidth: z.number().optional() }),
  // Imagem estática
  z.object({ ...base, kind: z.literal("image"), src: z.string(), rounded: z.boolean().optional() }),
  // Grupo com layout automático: distribui os filhos dentro de `at`
  z.object({
    ...base,
    kind: z.literal("flow"),
    children: z.array(z.string()).min(1),
    direction: z.enum(["row", "col", "grid"]).default("row"),
    gap: z.number().default(16),
    cols: z.number().int().positive().optional(),
  }),
  // Contador numérico animável
  z.object({
    ...base,
    kind: z.literal("counter"),
    from: z.number().default(0),
    to: z.number(),
    decimals: z.number().int().min(0).default(0),
    prefix: z.string().optional(),
    suffix: z.string().optional(),
    size: z.number().optional(),
  }),
]);

export type ElementDef = z.infer<typeof ElementSchema>;
export type ElementKind = ElementDef["kind"];

/** `at` efetivo de um elemento num formato (override > base). */
export function effectiveRect(el: ElementDef, format: FormatId): Rect | undefined {
  return el.layout?.[format] ?? el.at;
}
