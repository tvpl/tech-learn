import type { RawDiagram, Warning } from "./types";

/**
 * 8 arquivos da v1 (`iso8583`, `kubernetes`, `eks`, `rds`, `ingress`,
 * `virtual-threads`, `async-redis-kafka`, `rate-limit`) usam um dialeto que o
 * motor `engine/explainer.js` NUNCA leu de verdade: `type:"label",
 * text:"..."` (o motor só lê `.label`), `style:"fill:...;..."` (o motor nunca
 * lê `.style`) e campos soltos no step (`text`/`why`/`balloonAnchor`) em vez
 * de `balloon:{...}` (o motor só lê `.balloon`). Nesses arquivos, hoje, na v1
 * real, os labels aparecem vazios, as cores nunca aplicam e os balões nunca
 * aparecem — é código morto.
 *
 * Esta função recupera esses campos ANTES do mapeamento — mas como esse
 * conteúdo nunca foi visto renderizado de verdade, cada recuperação gera um
 * aviso pedindo revisão visual manual.
 */
export function normalizeLegacyDiagram(diagram: RawDiagram, slug: string): { diagram: RawDiagram; warnings: Warning[] } {
  const warnings: Warning[] = [];

  const elements = diagram.elements.map((el) => {
    const copy = { ...el };
    if (copy.label == null && copy.text != null) {
      copy.label = copy.text;
      warnings.push({
        slug,
        severity: "warn",
        message: `elemento "${copy.id}": campo "text" (nunca lido pelo motor v1) recuperado como label — nunca renderizou de verdade na v1 original, conferir visualmente`,
      });
    }
    if (copy.style) {
      const parsed = parseCssStyle(copy.style);
      if (parsed.fill) copy.fill = parsed.fill;
      if (parsed.stroke) copy.stroke = parsed.stroke;
      if (parsed["stroke-dasharray"] && copy.type === "arrow") copy.dashed = true;
      warnings.push({
        slug,
        severity: "warn",
        message: `elemento "${copy.id}": campo "style" (nunca lido pelo motor v1) parseado para fill/stroke/dashed — conferir visualmente`,
      });
    }
    return copy;
  });

  const steps = diagram.steps.map((step) => {
    const copy = { ...step };
    if (copy.balloon == null && (copy.text || copy.balloonAnchor)) {
      copy.balloon = {
        anchor: copy.balloonAnchor,
        placement: (copy.placement as "top" | "right" | "bottom" | "left" | undefined) ?? "bottom",
        text: copy.text,
        why: copy.why,
      };
      warnings.push({
        slug,
        severity: "warn",
        message: `step "${copy.title ?? idxLabel(diagram.steps, copy)}": balão sintetizado a partir de campos soltos (text/why/balloonAnchor) — nunca apareceu na v1 original, conferir visualmente`,
      });
    }
    return copy;
  });

  return { diagram: { ...diagram, elements, steps }, warnings };
}

function parseCssStyle(style: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const m of style.matchAll(/([\w-]+)\s*:\s*([^;]+)/g)) out[m[1]] = m[2].trim();
  return out;
}

function idxLabel(steps: unknown[], step: unknown): string {
  return `#${steps.indexOf(step) + 1}`;
}
