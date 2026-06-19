/* ============================================================================
 * tools/checklinks.mjs — Verificações estruturais baratas (sem navegador)
 * ----------------------------------------------------------------------------
 * Pega erros de digitação antes do deploy:
 *   - todo explainers/<x>.data.js tem o par <x>.html (e vice-versa);
 *   - cada <x>.html referencia o motor, o CSS e o seu <x>.data.js;
 *   - todo card do index.html aponta para um arquivo que existe.
 *
 * Uso:  node tools/checklinks.mjs   (roda junto no `npm test`)
 * ==========================================================================*/
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");
const exists = (p) => fs.existsSync(path.join(ROOT, p));
const errors = [];

// 1) pares .html <-> .data.js em explainers/
const dir = "explainers";
const all = fs.readdirSync(path.join(ROOT, dir));
const datas = all.filter((f) => f.endsWith(".data.js")).map((f) => f.replace(".data.js", ""));
const htmls = all.filter((f) => f.endsWith(".html")).map((f) => f.replace(".html", ""));

for (const base of datas) {
  if (!htmls.includes(base)) errors.push(`${dir}/${base}.data.js não tem o par ${base}.html`);
}
for (const base of htmls) {
  if (!datas.includes(base)) errors.push(`${dir}/${base}.html não tem o par ${base}.data.js`);
  const html = read(`${dir}/${base}.html`);
  if (!html.includes(`${base}.data.js`)) errors.push(`${dir}/${base}.html não referencia ${base}.data.js`);
  if (!html.includes("engine/explainer.js")) errors.push(`${dir}/${base}.html não referencia o motor (engine/explainer.js)`);
  if (!html.includes("engine/explainer.css")) errors.push(`${dir}/${base}.html não referencia o CSS (engine/explainer.css)`);
  if (!/new Explainer\(\s*window\.[A-Z0-9_]+\s*\)/.test(html)) errors.push(`${dir}/${base}.html não instancia new Explainer(window.XXX)`);
}

// 2) cards do index.html apontam para arquivos existentes
const index = read("index.html");
const hrefs = [...index.matchAll(/href="(explainers\/[^"]+\.html)"/g)].map((m) => m[1]);
if (hrefs.length === 0) errors.push("index.html não tem nenhum link para explainers/*.html");
for (const href of hrefs) {
  if (!exists(href)) errors.push(`index.html aponta para ${href}, que não existe`);
}
// todo explicador deveria estar listado na vitrine
for (const base of htmls) {
  if (!hrefs.includes(`${dir}/${base}.html`)) errors.push(`index.html não lista o explicador ${base}`);
}

if (errors.length) {
  console.log(`❌ checklinks: ${errors.length} problema(s):`);
  errors.forEach((e) => console.log("  · " + e));
  process.exit(1);
}
console.log(`✅ checklinks: ${htmls.length} explicadores, ${hrefs.length} cards — tudo consistente`);
