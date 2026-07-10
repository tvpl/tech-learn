/** Tipos "crus" da v1 (JSDoc em engine/explainer.types.js) — só o que o conversor lê. */

export interface RawElement {
  id: string;
  type?: "box" | "token" | "label" | "arrow" | "vector" | "matrix";
  base?: boolean;
  group?: string;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  rx?: number;
  label?: string | string[];
  fill?: string;
  stroke?: string;
  mono?: boolean;
  sub?: boolean;
  size?: number;
  anchor?: "start" | "middle" | "end";
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  path?: string;
  color?: string;
  noHead?: boolean;
  dashed?: boolean;
  values?: number[];
  rows?: number;
  cols?: number;
  cell?: number;
  // dialeto "morto" (achado 0 — nunca lido pelo motor real)
  text?: string;
  style?: string;
}

export interface RawBalloon {
  anchor?: string | { x: number; y: number };
  placement?: "top" | "right" | "bottom" | "left";
  text?: string;
  why?: string;
}

export interface RawQuiz {
  question: string;
  options: string[];
  answer: number;
  explain?: string;
}

export interface RawStep {
  title?: string;
  balloon?: RawBalloon;
  quiz?: RawQuiz;
  show?: string[];
  hide?: string[];
  highlight?: string[];
  dim?: string[];
  pulse?: string[];
  enter?: (ctx: unknown) => void;
  // dialeto "morto" (achado 0)
  text?: string;
  why?: string;
  balloonAnchor?: string;
  placement?: string;
}

export interface RawDiagram {
  title: string;
  subtitle?: string;
  width?: number;
  height?: number;
  autoplayMs?: number;
  elements: RawElement[];
  steps: RawStep[];
}

export type TraceCall =
  | "show"
  | "hide"
  | "moveTo"
  | "drawArrow"
  | "setBars"
  | "setLabel"
  | "lightCells"
  | "pulse"
  | "UNSUPPORTED_DOM_ACCESS";

export interface TraceEvent {
  at: number;
  call: TraceCall;
  target: string;
  args?: Record<string, unknown>;
}

export type Severity = "info" | "warn";

export interface Warning {
  slug: string;
  severity: Severity;
  message: string;
}

export interface Scale {
  sx: number;
  sy: number;
}
