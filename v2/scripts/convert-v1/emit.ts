import type { ExplainerInput } from "../../src/schema/explainer";

/**
 * Serializa o `ExplainerInput` já montado para um arquivo `.ts` — usa
 * `JSON.stringify` (os dados, neste ponto, são 100% JSON-serializáveis: os
 * `enter()` da v1 já viraram cues declarativas na Fase 2/5). Chaves entre
 * aspas são válidas em TS, só menos "bonitas" que o estilo escrito à mão dos
 * 2 demos — `prettier` (best-effort) cuida da indentação; não tenta
 * des-quotar chaves.
 */
export function emit(input: ExplainerInput, slug: string, camelName: string): string {
  const json = JSON.stringify(input, null, 2);
  return `import { validateExplainer, type ExplainerInput } from "@/schema/explainer";

// Gerado por v2/scripts/convert-v1.ts a partir de explainers/${slug}.data.js (v1).
// Câmera usa o default do schema (fit:"all") — sem ajuste fino de enquadramento
// por cena. Revise o relatório do conversor para avisos específicos deste arquivo.
const data: ExplainerInput = ${json};

export const ${camelName} = validateExplainer(data);
`;
}

export async function tryFormat(source: string): Promise<string> {
  try {
    const prettier = await import("prettier");
    return await prettier.format(source, { parser: "typescript", printWidth: 110 });
  } catch {
    return source; // prettier ausente ou erro de parse — devolve sem formatar
  }
}

export function toCamelSlug(slug: string): string {
  return slug.replace(/-([a-z0-9])/g, (_m, c: string) => c.toUpperCase());
}
