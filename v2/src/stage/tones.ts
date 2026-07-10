import type { Tone } from "@/schema/elements";

/** Tons semânticos → variáveis CSS do tema (definidas em stage.css). */
export const toneVar = (tone: Tone | undefined): string => `var(--tl-${tone ?? "neutral"})`;
