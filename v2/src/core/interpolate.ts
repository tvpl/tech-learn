/**
 * Interpolação determinística em forma fechada.
 * REGRA DE PUREZA: nada aqui (nem em core/ ou stage/) pode usar Date.now(),
 * Math.random() ou estado mutável — é o que garante que o frame N do Remotion
 * é idêntico ao instante N do player web.
 */
import type { Easing } from "@/schema/directives";

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const easeInCubic = (t: number) => t * t * t;
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Spring em forma fechada (oscilador harmônico sub-amortecido normalizado).
 * Mapeia progresso linear 0..1 → 0..~1 com overshoot suave; puro, sem estado.
 */
export const springOut = (t: number) => {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  const zeta = 0.55; // amortecimento
  const omega = 9;
  const decay = Math.exp(-zeta * omega * t);
  const freq = omega * Math.sqrt(1 - zeta * zeta);
  return 1 - decay * (Math.cos(freq * t) + (zeta * omega / freq) * Math.sin(freq * t));
};

export function ease(name: Easing | undefined, t: number): number {
  const v = clamp01(t);
  switch (name) {
    case "in": return easeInCubic(v);
    case "inOut": return easeInOutCubic(v);
    case "spring": return springOut(v);
    case "linear": return v;
    case "out":
    default: return easeOutCubic(v);
  }
}

/** Progresso 0..1 de uma janela [start, start+duration] no instante t. */
export function windowProgress(t: number, start: number, duration: number): number {
  if (duration <= 0) return t >= start ? 1 : 0;
  return clamp01((t - start) / duration);
}

/** Pulso amortecido: 1 no repouso, pico ~1+amp; `times` oscilações na janela. */
export function pulseScale(p: number, times: number, amp = 0.12): number {
  if (p <= 0 || p >= 1) return 1;
  return 1 + amp * Math.sin(p * times * Math.PI) * (1 - p * 0.5);
}
