import { z } from "zod";
import { RefSchema, RectSchema, ToneSchema } from "./elements";

/** Easings nomeados — implementados em core/interpolate (forma fechada, determinística). */
export const EasingSchema = z.enum(["linear", "in", "out", "inOut", "spring"]);
export type Easing = z.infer<typeof EasingSchema>;

/** Transição de entrada de um elemento quando é adicionado à cena. */
export const TransitionSchema = z.object({
  type: z.enum(["fade", "slide", "pop", "draw", "typewriter", "wipe"]).default("fade"),
  /** Direção do slide/wipe. */
  dir: z.enum(["up", "down", "left", "right"]).default("up"),
  duration: z.number().positive().default(600),
  /** Atraso entre itens quando o alvo é "@grupo" (cascata). */
  stagger: z.number().min(0).default(0),
  delay: z.number().min(0).default(0),
});
export type Transition = z.infer<typeof TransitionSchema>;

/** Entrada em `scene.add`: id/"@grupo" puro ou com transição customizada. */
export const AddSpecSchema = z.union([
  z.string(),
  z.object({ id: z.string(), enter: TransitionSchema.partial().optional() }),
]);
export type AddSpec = z.infer<typeof AddSpecSchema>;

const cueBase = {
  /** Offset em ms desde o início da cena. */
  at: z.number().min(0).default(0),
  duration: z.number().positive().optional(),
  easing: EasingSchema.optional(),
  /** Id de elemento ou "@grupo". */
  target: z.string(),
};

/** Cues: animações locais da cena (escopo = a cena; nada vaza). */
export const CueSchema = z.discriminatedUnion("do", [
  // Move o alvo (deslocamento relativo `by` ou posição absoluta `to`, coords do mundo)
  z.object({ ...cueBase, do: z.literal("move"), by: z.object({ x: z.number(), y: z.number() }).optional(), to: z.object({ x: z.number(), y: z.number() }).optional() }),
  // Destaque/atenuação a partir de `at` até o fim da cena
  z.object({ ...cueBase, do: z.literal("highlight") }),
  z.object({ ...cueBase, do: z.literal("dim") }),
  // Pulso (escala senoidal amortecida)
  z.object({ ...cueBase, do: z.literal("pulse"), times: z.number().int().positive().default(2) }),
  // Partículas fluindo ao longo de um connector
  z.object({
    ...cueBase,
    do: z.literal("flow"),
    count: z.number().int().positive().default(5),
    tone: ToneSchema.optional(),
    /** Voltas completas por segundo de cada partícula. */
    speed: z.number().positive().default(0.45),
    size: z.number().positive().default(7),
  }),
  // Reanima o traçado do connector
  z.object({ ...cueBase, do: z.literal("draw") }),
  // Interpola os valores de um `bars`
  z.object({ ...cueBase, do: z.literal("setBars"), values: z.array(z.number().min(0).max(1)) }),
  // Acende células de um `matrix` em cascata
  z.object({
    ...cueBase,
    do: z.literal("lightCells"),
    cells: z.array(z.tuple([z.number().int().min(0), z.number().int().min(0)])),
    stagger: z.number().min(0).default(90),
  }),
  // Foca um intervalo de linhas num `code` (demais linhas esmaecem)
  z.object({ ...cueBase, do: z.literal("focusLines"), lines: z.tuple([z.number().int().min(1), z.number().int().min(1)]) }),
  // Anima o `counter` de from→to
  z.object({ ...cueBase, do: z.literal("count") }),
  // Troca o texto com efeito typewriter (label/token/text)
  z.object({ ...cueBase, do: z.literal("morphText"), to: z.string() }),
  // Revela/oculta só nesta cena (equivalente declarativo do enter(ctx) da v1)
  z.object({ ...cueBase, do: z.literal("show") }),
  z.object({ ...cueBase, do: z.literal("hide") }),
]);
export type Cue = z.infer<typeof CueSchema>;

/** Câmera autoral: enquadra elementos (ou um rect do mundo) na região stage. */
export const CameraSchema = z.object({
  /** Ids/"@grupos" a enquadrar, "all" (tudo visível) ou rect explícito do mundo. */
  fit: z.union([z.literal("all"), z.array(z.string()), RectSchema]).default("all"),
  /** Multiplicador de zoom sobre o fit calculado. */
  zoom: z.number().positive().default(1),
  /** Padding proporcional em volta do fit (0.1 = 10%). */
  pad: z.number().min(0).default(0.1),
  at: z.number().min(0).default(0),
  duration: z.number().min(0).default(700),
});
export type CameraCue = z.infer<typeof CameraSchema>;

export const QuizSchema = z.object({
  question: z.string(),
  options: z.array(z.string()).min(2),
  answer: z.number().int().min(0),
  explain: z.string(),
});
export type Quiz = z.infer<typeof QuizSchema>;

/** O balão sagrado da v1: o quê (text) + por quê (why). */
export const CaptionSchema = z.object({
  anchor: RefSchema.optional(),
  placement: z.enum(["top", "right", "bottom", "left"]).default("bottom"),
  text: z.string(),
  why: z.string().optional(),
});
export type Caption = z.infer<typeof CaptionSchema>;
