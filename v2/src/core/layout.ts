/**
 * Resolução de layout:
 *  1. `at` efetivo por formato (element.layout.<formato> > element.at);
 *  2. grupos `flow` distribuem os filhos dentro do próprio rect (row/col/grid);
 *  3. conectores ganham geometria a partir dos rects resolvidos;
 *  4. câmera: fit de um rect do mundo dentro da região stage do formato.
 */
import { FORMATS, rectCenter, rectUnion, WORLD, type FormatId, type Rect } from "@/schema/formats";
import { effectiveRect, type ElementDef, type Point, type Ref } from "@/schema/elements";
import type { Explainer } from "@/schema/explainer";
import { anchorOnRect, routeConnector, type PathGeom } from "./connectors";
import { clamp } from "./interpolate";

export interface ResolvedLayout {
  /** rect final de cada elemento com `at` (inclui filhos de flow reposicionados). */
  rects: Map<string, Rect>;
  /** geometria de cada connector. */
  paths: Map<string, PathGeom>;
}

export function resolveLayout(ex: Explainer, format: FormatId): ResolvedLayout {
  const rects = new Map<string, Rect>();
  for (const el of ex.elements) {
    const at = effectiveRect(el, format);
    if (at) rects.set(el.id, at);
  }

  // flow: redistribui filhos dentro do rect do grupo
  for (const el of ex.elements) {
    if (el.kind !== "flow") continue;
    const box = effectiveRect(el, format);
    if (!box) continue;
    const kids = el.children;
    const n = kids.length;
    if (el.direction === "grid") {
      const cols = el.cols ?? Math.ceil(Math.sqrt(n));
      const rows = Math.ceil(n / cols);
      const cw = (box.w - el.gap * (cols - 1)) / cols;
      const ch = (box.h - el.gap * (rows - 1)) / rows;
      kids.forEach((id, i) => {
        const r = Math.floor(i / cols);
        const c = i % cols;
        rects.set(id, { x: box.x + c * (cw + el.gap), y: box.y + r * (ch + el.gap), w: cw, h: ch });
      });
    } else if (el.direction === "col") {
      const ch = (box.h - el.gap * (n - 1)) / n;
      kids.forEach((id, i) => rects.set(id, { x: box.x, y: box.y + i * (ch + el.gap), w: box.w, h: ch }));
    } else {
      const cw = (box.w - el.gap * (n - 1)) / n;
      kids.forEach((id, i) => rects.set(id, { x: box.x + i * (cw + el.gap), y: box.y, w: cw, h: box.h }));
    }
  }

  // conectores
  const paths = new Map<string, PathGeom>();
  const refPoint = (ref: Ref, towards: Point): Point => {
    if (typeof ref !== "string") return ref;
    const r = rects.get(ref);
    if (!r) return { x: WORLD.w / 2, y: WORLD.h / 2 };
    return anchorOnRect(r, towards);
  };
  const refCenter = (ref: Ref): Point => {
    if (typeof ref !== "string") return ref;
    const r = rects.get(ref);
    return r ? rectCenter(r) : { x: WORLD.w / 2, y: WORLD.h / 2 };
  };
  for (const el of ex.elements) {
    if (el.kind !== "connector") continue;
    const a = refPoint(el.from, refCenter(el.to));
    const b = refPoint(el.to, refCenter(el.from));
    const geom = routeConnector(el.route, a, b);
    paths.set(el.id, geom);
    // rect envolvente para câmera/anchoring
    rects.set(el.id, {
      x: Math.min(a.x, b.x),
      y: Math.min(a.y, b.y),
      w: Math.abs(b.x - a.x) || 2,
      h: Math.abs(b.y - a.y) || 2,
    });
  }

  return { rects, paths };
}

export interface CameraState {
  cx: number;
  cy: number;
  scale: number;
}

/** Enquadra `target` (coords do mundo) na região stage do formato. */
export function fitCamera(target: Rect, format: FormatId, pad = 0.1, zoom = 1): CameraState {
  const stage = FORMATS[format].regions.stage;
  const w = Math.max(target.w, 40) * (1 + pad * 2);
  const h = Math.max(target.h, 40) * (1 + pad * 2);
  const scale = clamp(Math.min(stage.w / w, stage.h / h) * zoom, 0.2, 3.2);
  const c = rectCenter(target);
  return { cx: c.x, cy: c.y, scale };
}

/** União dos rects de um conjunto de ids (fallback: mundo inteiro). */
export function boundsOf(ids: string[], layout: ResolvedLayout, elements: ElementDef[]): Rect {
  const byId = new Map(elements.map((e) => [e.id, e]));
  const rs: Rect[] = [];
  for (const id of ids) {
    const el = byId.get(id);
    if (el?.noFit) continue;
    const r = layout.rects.get(id);
    if (r) rs.push(r);
  }
  return rectUnion(rs);
}
