import type { RawElement, Scale, Warning } from "./types";
import type { ElementDef, Tone } from "../../src/schema/elements";
import { WORLD } from "../../src/schema/formats";

export function computeScale(v1Width: number | undefined, v1Height: number | undefined): Scale {
  const w = v1Width ?? 1280;
  const h = v1Height ?? 720;
  return { sx: WORLD.w / w, sy: WORLD.h / h };
}

export function sx(v: number, scale: Scale): number {
  return Math.round(v * scale.sx);
}
export function sy(v: number, scale: Scale): number {
  return Math.round(v * scale.sy);
}

const TONE_BY_VAR: Record<string, Tone> = {
  "var(--accent)": "accent",
  "var(--accent-2)": "accent2",
  "var(--good)": "good",
  "var(--warn)": "warn",
  "var(--hot)": "hot",
};

/** Só tons semânticos exatos migram; qualquer hex/cor solta vira "neutral" + aviso. */
export function mapTone(color: string | undefined, slug: string, elId: string, warnings: Warning[]): Tone | undefined {
  if (!color) return undefined;
  const tone = TONE_BY_VAR[color.trim()];
  if (tone) return tone;
  warnings.push({
    slug,
    severity: "info",
    message: `elemento "${elId}": cor customizada "${color}" sem tom semântico correspondente — virou neutral`,
  });
  return undefined;
}

/** Extrai só o 1º e o último ponto de um `path` SVG (M/L/C) — perde a curva exata. */
function extractEndpoints(d: string): { from: { x: number; y: number }; to: { x: number; y: number } } | null {
  const nums = d.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? [];
  const commands = d.match(/[MLC][^MLC]*/gi) ?? [];
  if (commands.length === 0 || nums.length < 4) return null;
  const firstPair = nums.slice(0, 2);
  const lastPair = nums.slice(-2);
  return {
    from: { x: firstPair[0], y: firstPair[1] },
    to: { x: lastPair[0], y: lastPair[1] },
  };
}

export interface MapElementResult {
  elements: ElementDef[]; // pode gerar >1 (ex.: legenda de "vector" vira label irmão)
  warnings: Warning[];
}

export function mapElement(v1el: RawElement, scale: Scale, slug: string): MapElementResult {
  const warnings: Warning[] = [];
  const kind = v1el.type ?? "box";
  const tone = mapTone(v1el.color ?? v1el.fill ?? v1el.stroke, slug, v1el.id, warnings);
  const at =
    v1el.x !== undefined && v1el.y !== undefined && v1el.w !== undefined && v1el.h !== undefined
      ? { x: sx(v1el.x, scale), y: sy(v1el.y, scale), w: sx(v1el.w, scale), h: sy(v1el.h, scale) }
      : undefined;

  const base = { id: v1el.id, group: v1el.group, tone } as const;

  switch (kind) {
    case "box": {
      const lines = Array.isArray(v1el.label) ? v1el.label : v1el.label ? [v1el.label] : [];
      if (lines.length >= 3) {
        warnings.push({ slug, severity: "info", message: `box "${v1el.id}": label com ${lines.length} linhas — só a 1ª virou "label", resto juntou em "sub"` });
      }
      return {
        elements: [{ ...base, kind: "box", at, label: lines[0], sub: lines.slice(1).join(" · ") || undefined, variant: "outline" }],
        warnings,
      };
    }
    case "token":
      return {
        elements: [{ ...base, kind: "token", at, text: firstLine(v1el.label) ?? "", mono: v1el.mono }],
        warnings,
      };
    case "label": {
      if (v1el.sub) {
        warnings.push({ slug, severity: "info", message: `label "${v1el.id}": campo "sub" (booleano) virou "muted" — checar se o estilo bate` });
      }
      const text = firstLine(v1el.label) ?? "";
      // labels da v1 costumam só ter x,y (ponto na baseline do texto, sem w/h
      // — não desenham caixa); v2 exige `at`, então sintetizamos um rect em
      // volta do ponto, largura estimada pelo tamanho do texto.
      const labelAt =
        at ??
        (() => {
          const size = v1el.size ?? 15;
          const w = Math.max(60, text.length * size * 0.62);
          const h = size * 2.2;
          const x0 = v1el.x ?? 0;
          const y0 = v1el.y ?? 0;
          const left = v1el.anchor === "start" ? x0 : v1el.anchor === "end" ? x0 - w : x0 - w / 2;
          return { x: sx(left, scale), y: sy(y0 - h / 2, scale), w: sx(w, scale), h: sy(h, scale) };
        })();
      return {
        elements: [
          {
            ...base,
            kind: "label",
            at: labelAt,
            text,
            size: v1el.size,
            align: v1el.anchor === "start" ? "start" : v1el.anchor === "end" ? "end" : "center",
            muted: v1el.sub,
          },
        ],
        warnings,
      };
    }
    case "arrow": {
      if (v1el.path) {
        const endpoints = extractEndpoints(v1el.path);
        warnings.push({
          slug,
          severity: "warn",
          message: `arrow "${v1el.id}": tinha "path" customizado (curva à mão) — virou connector com route:"curve" aproximado pelos pontos inicial/final. Revisar visual.`,
        });
        const from = endpoints ? { x: sx(endpoints.from.x, scale), y: sy(endpoints.from.y, scale) } : { x: 0, y: 0 };
        const to = endpoints ? { x: sx(endpoints.to.x, scale), y: sy(endpoints.to.y, scale) } : { x: 100, y: 100 };
        return {
          elements: [{ ...base, kind: "connector", from, to, route: "curve", arrow: !v1el.noHead, dashed: v1el.dashed }],
          warnings,
        };
      }
      const from = { x: sx(v1el.x1 ?? 0, scale), y: sy(v1el.y1 ?? 0, scale) };
      const to = { x: sx(v1el.x2 ?? 0, scale), y: sy(v1el.y2 ?? 0, scale) };
      return {
        elements: [{ ...base, kind: "connector", from, to, route: "line", arrow: !v1el.noHead, dashed: v1el.dashed }],
        warnings,
      };
    }
    case "vector": {
      const els: ElementDef[] = [{ ...base, kind: "bars", at, values: v1el.values ?? [] }];
      return { elements: els, warnings };
    }
    case "matrix": {
      const cell = v1el.cell ?? 40;
      const rows = v1el.rows ?? 1;
      const cols = v1el.cols ?? 1;
      const derivedAt = at ?? {
        x: sx(v1el.x ?? 0, scale),
        y: sy(v1el.y ?? 0, scale),
        w: sx(cols * cell + 12, scale),
        h: sy(rows * cell + 12, scale),
      };
      return { elements: [{ ...base, kind: "matrix", at: derivedAt, rows, cols }], warnings };
    }
    default:
      warnings.push({ slug, severity: "warn", message: `elemento "${v1el.id}": tipo "${kind}" desconhecido — ignorado` });
      return { elements: [], warnings };
  }
}

function firstLine(label: string | string[] | undefined): string | undefined {
  if (Array.isArray(label)) return label[0];
  return label;
}
