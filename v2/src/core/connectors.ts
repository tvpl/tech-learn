/**
 * Roteamento geométrico de conectores — 100% analítico (nada de getPointAtLength
 * do DOM, que não é puro). Cada conector vira um `PathGeom` com:
 *   - `d`      → path SVG
 *   - `length` → comprimento aproximado (amostragem)
 *   - `pointAt(u)` → ponto no parâmetro normalizado 0..1 (para partículas)
 */
import type { Rect } from "@/schema/formats";
import type { Point } from "@/schema/elements";
import { lerp } from "./interpolate";

export interface PathGeom {
  d: string;
  length: number;
  pointAt: (u: number) => Point;
  mid: Point;
}

const SAMPLES = 64;

function sampledGeom(f: (u: number) => Point, d: string): PathGeom {
  const pts: Point[] = [];
  const cum: number[] = [0];
  let len = 0;
  for (let i = 0; i <= SAMPLES; i++) pts.push(f(i / SAMPLES));
  for (let i = 1; i <= SAMPLES; i++) {
    len += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    cum.push(len);
  }
  const pointAt = (u: number): Point => {
    const target = Math.min(1, Math.max(0, u)) * len;
    let lo = 0, hi = SAMPLES;
    while (lo < hi) {
      const midI = (lo + hi) >> 1;
      if (cum[midI] < target) lo = midI + 1;
      else hi = midI;
    }
    const i = Math.max(1, lo);
    const seg = cum[i] - cum[i - 1] || 1;
    const k = (target - cum[i - 1]) / seg;
    return { x: lerp(pts[i - 1].x, pts[i].x, k), y: lerp(pts[i - 1].y, pts[i].y, k) };
  };
  return { d, length: len, pointAt, mid: pointAt(0.5) };
}

/** Ponto de ancoragem na borda de um rect, na direção do outro extremo. */
export function anchorOnRect(r: Rect, towards: Point): Point {
  const cx = r.x + r.w / 2;
  const cy = r.y + r.h / 2;
  const dx = towards.x - cx;
  const dy = towards.y - cy;
  if (dx === 0 && dy === 0) return { x: cx, y: cy };
  // escolhe a borda dominante
  if (Math.abs(dx) * r.h > Math.abs(dy) * r.w) {
    return { x: cx + (dx > 0 ? r.w / 2 : -r.w / 2), y: cy };
  }
  return { x: cx, y: cy + (dy > 0 ? r.h / 2 : -r.h / 2) };
}

export function routeLine(a: Point, b: Point): PathGeom {
  return sampledGeom((u) => ({ x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u) }), `M ${a.x} ${a.y} L ${b.x} ${b.y}`);
}

/** Cotovelo ortogonal simples (H→V ou V→H conforme a dominância). */
export function routeElbow(a: Point, b: Point): PathGeom {
  const horizFirst = Math.abs(b.x - a.x) >= Math.abs(b.y - a.y);
  const m: Point = horizFirst ? { x: b.x, y: a.y } : { x: a.x, y: b.y };
  const d = `M ${a.x} ${a.y} L ${m.x} ${m.y} L ${b.x} ${b.y}`;
  return sampledGeom((u) => {
    const l1 = Math.hypot(m.x - a.x, m.y - a.y);
    const l2 = Math.hypot(b.x - m.x, b.y - m.y);
    const total = l1 + l2 || 1;
    const s = u * total;
    if (s <= l1) {
      const k = l1 ? s / l1 : 0;
      return { x: lerp(a.x, m.x, k), y: lerp(a.y, m.y, k) };
    }
    const k = l2 ? (s - l1) / l2 : 0;
    return { x: lerp(m.x, b.x, k), y: lerp(m.y, b.y, k) };
  }, d);
}

/** Curva cúbica suave com controles perpendiculares ao eixo dominante. */
export function routeCurve(a: Point, b: Point): PathGeom {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const horiz = Math.abs(dx) >= Math.abs(dy);
  const c1: Point = horiz ? { x: a.x + dx * 0.45, y: a.y } : { x: a.x, y: a.y + dy * 0.45 };
  const c2: Point = horiz ? { x: b.x - dx * 0.45, y: b.y } : { x: b.x, y: b.y - dy * 0.45 };
  const d = `M ${a.x} ${a.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${b.x} ${b.y}`;
  const bez = (p0: number, p1: number, p2: number, p3: number, u: number) => {
    const v = 1 - u;
    return v * v * v * p0 + 3 * v * v * u * p1 + 3 * v * u * u * p2 + u * u * u * p3;
  };
  return sampledGeom((u) => ({ x: bez(a.x, c1.x, c2.x, b.x, u), y: bez(a.y, c1.y, c2.y, b.y, u) }), d);
}

export function routeConnector(route: "line" | "elbow" | "curve", a: Point, b: Point): PathGeom {
  switch (route) {
    case "elbow": return routeElbow(a, b);
    case "curve": return routeCurve(a, b);
    default: return routeLine(a, b);
  }
}
