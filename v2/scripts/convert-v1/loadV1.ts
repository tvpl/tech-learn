import fs from "node:fs";
import path from "node:path";
import { JSDOM } from "jsdom";
import type { RawDiagram } from "./types";

/**
 * Carrega um `explainers/<slug>.data.js` da v1 e devolve o objeto do diagrama
 * já totalmente resolvido (variáveis/loops/helpers do próprio arquivo já
 * computados pelo V8 do Node — só falta o `enter` de cada step, que continua
 * como função de verdade, tratado em `traceEnter.ts`).
 *
 * Não precisamos carregar `engine/explainer.js`: os arquivos de dados não
 * referenciam a classe `Explainer` (confirmado por grep) — só atribuem
 * `window.<NOME>_DIAGRAM = {...}`.
 */
export interface LoadedDiagram {
  /** A janela jsdom que avaliou o arquivo — `enter(ctx)` foi definido aqui,
   * então qualquer `setTimeout` dentro dele resolve para `window.setTimeout`
   * (não o do processo Node). `traceEnter.ts` precisa patchar ESTA janela. */
  window: JSDOM["window"];
  diagram: RawDiagram;
}

export function loadDiagram(v1Root: string, slug: string): LoadedDiagram {
  const file = path.join(v1Root, "explainers", `${slug}.data.js`);
  const source = fs.readFileSync(file, "utf8");

  const dom = new JSDOM("<!DOCTYPE html><body></body>", {
    url: "https://example.com/",
    pretendToBeVisual: true,
    runScripts: "outside-only",
  });
  const { window } = dom;

  window.eval(source);

  const gname = Object.keys(window).find((k) => /_DIAGRAM$/.test(k) && (window as any)[k]?.steps);
  if (!gname) throw new Error(`${slug}: nenhum objeto *_DIAGRAM exposto por ${file}`);
  return { window, diagram: (window as any)[gname] as RawDiagram };
}
