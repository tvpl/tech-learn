/* ============================================================================
 * tools/smoke.mjs — Teste de fumaça dos explicadores (sem navegador real)
 * ----------------------------------------------------------------------------
 * Carrega o motor + cada explainers/*.data.js dentro do jsdom, monta o
 * diagrama e percorre TODAS as cenas (ida e volta, disparando enter()),
 * validando:
 *   - 0 erros de runtime;
 *   - 0 âncoras de balão inexistentes;
 *   - 0 referências (show/hide/highlight/dim/pulse) a ids inexistentes;
 *   - quizzes bem formados (options[] + answer válido) e que renderizam UI.
 *
 * Uso:  npm test   (ou  node tools/smoke.mjs)
 * Sai com código != 0 se qualquer diagrama falhar (bom para CI).
 * ==========================================================================*/
import fs from "node:fs";
import path from "node:path";
import { JSDOM } from "jsdom";

const ROOT = process.cwd();
const ENGINE = fs.readFileSync(path.join(ROOT, "engine/explainer.js"), "utf8");
const DIR = path.join(ROOT, "explainers");
const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".data.js")).sort();

let totalFail = 0;

for (const file of files) {
  const dom = new JSDOM(`<!DOCTYPE html><body><div id="app"></div></body>`, {
    pretendToBeVisual: true, runScripts: "outside-only", url: "https://example.com/",
  });
  const { window } = dom;

  // stubs p/ APIs do SVG/layout que o jsdom não implementa
  window.SVGElement.prototype.getBBox = function () {
    return { x: +(this.getAttribute("x") || 0), y: +(this.getAttribute("y") || 0), width: 100, height: 40 };
  };
  window.SVGElement.prototype.getTotalLength = () => 200;
  window.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0);
  Object.defineProperty(window.HTMLElement.prototype, "offsetWidth", { get: () => 300, configurable: true });
  Object.defineProperty(window.HTMLElement.prototype, "offsetHeight", { get: () => 120, configurable: true });
  window.Element.prototype.getBoundingClientRect = () => ({ width: 900, height: 700, left: 0, top: 0, right: 900, bottom: 700 });
  window.Element.prototype.scrollIntoView = () => {};

  const errors = [];
  window.console.error = (...a) => errors.push(a.join(" "));

  try {
    window.eval(ENGINE);
    window.eval(fs.readFileSync(path.join(DIR, file), "utf8"));
  } catch (e) {
    console.log(`❌ ${file}: erro ao carregar — ${e.message}`);
    totalFail++; continue;
  }

  // descobre o objeto do diagrama exposto em window.XXX_DIAGRAM
  const gname = Object.keys(window).find((k) => /_DIAGRAM$/.test(k) && window[k] && window[k].steps);
  const diagram = gname && window[gname];
  if (!diagram) { console.log(`❌ ${file}: nenhum objeto *_DIAGRAM exposto`); totalFail++; continue; }

  const xp = new window.Explainer(diagram).mount("#app");

  // percorre todas as cenas, ida e volta (dispara os enter())
  for (let i = 0; i < xp.steps.length; i++) xp.go(i);
  for (let i = xp.steps.length - 1; i >= 0; i--) xp.go(i);

  // regressão: avançar rápido (sem esperar o fade) não pode empilhar balões —
  // após várias trocas síncronas deve haver no máximo 1 balão "vivo".
  xp.go(0); xp.go(Math.min(1, xp.steps.length - 1)); xp.go(Math.min(2, xp.steps.length - 1));
  const liveBalloons = xp.balloons.querySelectorAll(".xp-balloon:not([data-leaving])").length;
  if (liveBalloons > 1) errors.push(`balões empilhados: ${liveBalloons} visíveis ao mesmo tempo`);

  // regressão: elemento com "text" em vez de "label" renderiza <text> vazio
  // sem erro de runtime — pega isso explicitamente (ver AGENTS.md/README).
  let badLabel = 0;
  for (const el of diagram.elements) {
    const t = el.type || "box";
    if (["box", "token", "label"].includes(t) && el.text != null && el.label == null) {
      badLabel++; errors.push(`elemento "${el.id}": tem "text" mas não "label" (renderiza vazio)`);
    }
  }

  // valida referências
  const ids = new Set([...xp.nodes.keys()]);
  const expand = (list) => xp._ids(list);
  let badAnchor = 0, badRef = 0, badQuiz = 0, quizSteps = 0, exSteps = 0, badEx = 0;
  for (const s of xp.steps) {
    const a = s.balloon && s.balloon.anchor;
    if (typeof a === "string" && !ids.has(a)) { badAnchor++; errors.push("âncora inexistente: " + a); }
    for (const key of ["show", "hide", "highlight", "dim", "pulse"])
      for (const id of expand(s[key])) if (!ids.has(id)) { badRef++; errors.push(`ref ${key}: ${id}`); }
    if (s.quiz) {
      quizSteps++;
      const q = s.quiz;
      if (!Array.isArray(q.options) || q.options.length < 2 || q.answer == null || q.answer < 0 || q.answer >= q.options.length)
        { badQuiz++; errors.push("quiz malformado"); }
    }
    if (Array.isArray(s.exercises)) s.exercises.forEach((ex, j) => {
      exSteps++;
      const w = xp._validateExercise(ex);
      if (w) { badEx++; errors.push(`exercício ${j + 1} (${ex && ex.kind || "?"}) malformado: ${w}`); }
    });
  }

  // confere que pelo menos um quiz realmente renderiza UI
  const quizIdx = xp.steps.findIndex((s) => s.quiz);
  if (quizIdx >= 0) {
    xp.go(quizIdx);
    if (!xp.balloons.querySelector(".xp-quiz-opt")) { badQuiz++; errors.push("quiz não renderizou opções"); }
  }

  // confere que pelo menos um exercício realmente renderiza UI
  const exIdx = xp.steps.findIndex((s) => Array.isArray(s.exercises) && s.exercises.length);
  if (exIdx >= 0) {
    xp.go(exIdx);
    if (!xp.balloons.querySelector(".xp-ex")) { badEx++; errors.push("exercício não renderizou UI"); }
  }

  const ok = errors.length === 0 && badAnchor === 0 && badRef === 0 && badQuiz === 0 && badEx === 0 && badLabel === 0;
  console.log(
    `${ok ? "✅" : "❌"} ${gname.padEnd(20)} cenas:${String(xp.steps.length).padStart(2)} ` +
    `elems:${String(xp.nodes.size).padStart(3)} quizzes:${quizSteps} exercicios:${exSteps} ` +
    `ancoras_bad:${badAnchor} refs_bad:${badRef} erros:${errors.length}`
  );
  if (!ok) { errors.slice(0, 10).forEach((e) => console.log("    ·", e)); totalFail++; }
}

// dá tempo para os timeouts dos enter() rodarem antes do veredito
setTimeout(() => {
  console.log(totalFail === 0 ? `\n✅ TODOS OS ${files.length} DIAGRAMAS PASSARAM` : `\n❌ ${totalFail} diagrama(s) com falha`);
  process.exit(totalFail ? 1 : 0);
}, 1500);
