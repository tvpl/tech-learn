/* ============================================================================
 * tools/screenshots.mjs — Gera um PNG de cada explicador (preview p/ README)
 * ----------------------------------------------------------------------------
 * Precisa do Playwright (não vem por padrão p/ manter o CI leve):
 *   npm i -D playwright && npx playwright install chromium
 *   npm run screenshots          # gera em ./screenshots/*.png
 *
 * No CI, o workflow screenshots.yml faz isso e sobe os PNGs como artefato.
 * ==========================================================================*/
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "assets", "preview");   // pasta versionada (usada por OG/README)
fs.mkdirSync(OUT, { recursive: true });

// lista: a vitrine (home) + cada explicador
const targets = [
  { name: "home", file: "index.html" },
  ...fs.readdirSync(path.join(ROOT, "explainers"))
    .filter((f) => f.endsWith(".html")).sort()
    .map((f) => ({ name: f.replace(/\.html$/, ""), file: path.join("explainers", f) })),
];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 860 }, deviceScaleFactor: 2 });

for (const t of targets) {
  const page = await ctx.newPage();
  await page.goto("file://" + path.join(ROOT, t.file) + (t.name === "home" ? "" : "#cena=1"));
  await page.waitForTimeout(1400);             // deixa a 1ª cena animar
  await page.screenshot({ path: path.join(OUT, t.name + ".png") });
  await page.close();
  console.log("📸", t.name + ".png");
}

await browser.close();
console.log("\n✔ screenshots em ./assets/preview/");
