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
const OUT = path.join(ROOT, "screenshots");
fs.mkdirSync(OUT, { recursive: true });

const pages = fs.readdirSync(path.join(ROOT, "explainers")).filter((f) => f.endsWith(".html")).sort();

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 860 }, deviceScaleFactor: 2 });

for (const p of pages) {
  const name = p.replace(/\.html$/, "");
  const page = await ctx.newPage();
  const url = "file://" + path.join(ROOT, "explainers", p) + "#cena=1";
  await page.goto(url);
  await page.waitForTimeout(1400);             // deixa a 1ª cena animar
  await page.screenshot({ path: path.join(OUT, name + ".png") });
  await page.close();
  console.log("📸", name + ".png");
}

await browser.close();
console.log("\n✔ screenshots em ./screenshots/");
