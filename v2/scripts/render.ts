#!/usr/bin/env tsx
/**
 * Pipeline de export social: gera MP4 (wide/reels/feed), GIF e carrossel
 * (PNGs + PDF) a partir do MESMO conteúdo que roda no player web.
 *
 * Uso:
 *   npm run render -- <slug> --format=reels|feed|wide|gif|carousel|all
 *
 * Delega a renderização em si para o CLI oficial do Remotion (`npx remotion
 * render/still`), que cuida de bundling/cache/Chromium headless — este script
 * só decide COMO chamá-lo por formato e monta o PDF do carrossel no final.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { PDFDocument } from "pdf-lib";
import { compileTimeline, fpsOf, posterTimeOf } from "../src/core/timeline";
import { loaderFor, SLUGS } from "../src/content/index";
import { FORMATS, type FormatId } from "../src/schema/formats";

const ROOT = path.resolve(__dirname, "..");
const ENTRY = path.join(ROOT, "src/remotion/index.ts");

type ExportFormat = "wide" | "reels" | "feed" | "gif" | "carousel" | "all";
const COMPOSITION_OF: Record<Exclude<ExportFormat, "gif" | "carousel" | "all">, string> = {
  wide: "Explainer-wide",
  reels: "Explainer-vertical",
  feed: "Explainer-feed",
};

function run(cmd: string, args: string[]) {
  console.log(`$ ${cmd} ${args.join(" ")}`);
  execFileSync(cmd, args, { stdio: "inherit", cwd: ROOT });
}

function renderVideo(slug: string, fmt: "wide" | "reels" | "feed", outDir: string) {
  const compId = COMPOSITION_OF[fmt];
  const out = path.join(outDir, `${fmt}.mp4`);
  run("npx", [
    "remotion", "render", ENTRY, compId, out,
    `--props=${JSON.stringify({ slug })}`,
    "--codec=h264", "--crf=18", "--overwrite",
  ]);
}

function renderGif(slug: string, outDir: string) {
  const out = path.join(outDir, "teaser.gif");
  run("npx", [
    "remotion", "render", ENTRY, "Explainer-feed", out,
    `--props=${JSON.stringify({ slug })}`,
    "--codec=gif", "--every-nth-frame=2", "--scale=0.5", "--overwrite",
  ]);
}

async function renderCarousel(slug: string, outDir: string) {
  const loader = loaderFor(slug);
  if (!loader) throw new Error(`Explainer desconhecido: "${slug}"`);
  const explainer = await loader();
  const format: FormatId = "feed";
  const timeline = compileTimeline(explainer, format);
  const fps = fpsOf(format);

  const framesDir = path.join(outDir, "carousel");
  mkdirSync(framesDir, { recursive: true });

  const pngPaths: string[] = [];
  timeline.scenes.forEach((scene, i) => {
    const ms = posterTimeOf(timeline, i);
    const frame = Math.max(0, Math.round((ms / 1000) * fps));
    const out = path.join(framesDir, `${String(i + 1).padStart(2, "0")}-${scene.def.id}.png`);
    run("npx", [
      "remotion", "still", ENTRY, "Explainer-feed", out,
      `--props=${JSON.stringify({ slug })}`,
      `--frame=${frame}`, "--overwrite",
    ]);
    pngPaths.push(out);
  });

  // monta o PDF do carrossel (formato pronto para upload no LinkedIn)
  const pdf = await PDFDocument.create();
  const spec = FORMATS[format];
  for (const p of pngPaths) {
    const png = await pdf.embedPng(readFileSync(p));
    const page = pdf.addPage([spec.render.w, spec.render.h]);
    page.drawImage(png, { x: 0, y: 0, width: spec.render.w, height: spec.render.h });
  }
  const pdfBytes = await pdf.save();
  const pdfPath = path.join(outDir, "carousel.pdf");
  await import("node:fs/promises").then((fs) => fs.writeFile(pdfPath, pdfBytes));
  console.log(`✓ carrossel: ${pngPaths.length} slides → ${pdfPath}`);
}

async function main() {
  const [slug, ...rest] = process.argv.slice(2);
  const formatArg = rest.find((a) => a.startsWith("--format="))?.slice("--format=".length) as
    | ExportFormat
    | undefined;

  if (!slug || !formatArg) {
    console.error("Uso: npm run render -- <slug> --format=reels|feed|wide|gif|carousel|all");
    console.error(`Slugs disponíveis: ${SLUGS.join(", ")}`);
    process.exit(1);
  }
  if (!SLUGS.includes(slug)) {
    console.error(`Slug desconhecido: "${slug}". Disponíveis: ${SLUGS.join(", ")}`);
    process.exit(1);
  }

  const outDir = path.join(ROOT, "out", slug);
  mkdirSync(outDir, { recursive: true });

  const todo: Exclude<ExportFormat, "all">[] =
    formatArg === "all" ? ["wide", "reels", "feed", "gif", "carousel"] : [formatArg];

  for (const fmt of todo) {
    if (fmt === "gif") renderGif(slug, outDir);
    else if (fmt === "carousel") await renderCarousel(slug, outDir);
    else renderVideo(slug, fmt, outDir);
  }

  console.log(`\nPronto — arquivos em ${outDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
