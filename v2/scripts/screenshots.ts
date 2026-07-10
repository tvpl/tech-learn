#!/usr/bin/env tsx
/**
 * Gera 1 PNG de preview (formato wide) por explainer registrado, para
 * og:image/twitter:image — equivalente ao tools/screenshots.mjs da v1, mas
 * resolvendo o frame exato via a timeline compilada (posterTimeOf) em vez de
 * um `waitForTimeout` cego.
 *
 *   npm run screenshots [-- --only slug1,slug2]
 */
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { compileTimeline, fpsOf, posterTimeOf } from "../src/core/timeline";
import { REGISTRY } from "../src/content/index";

const ROOT = path.resolve(__dirname, "..");
const ENTRY = path.join(ROOT, "src/remotion/index.ts");
const OUT_DIR = path.join(ROOT, "public/preview");

async function main() {
  const args = process.argv.slice(2);
  const onlyIdx = args.indexOf("--only");
  const only = onlyIdx >= 0 ? new Set(args[onlyIdx + 1]?.split(",")) : null;

  mkdirSync(OUT_DIR, { recursive: true });

  const targets = REGISTRY.filter((e) => !only || only.has(e.slug));
  for (const { slug, loader } of targets) {
    const explainer = await loader();
    const timeline = compileTimeline(explainer, "wide");
    const fps = fpsOf("wide");
    const ms = posterTimeOf(timeline, 0); // frame "herói" da cena de introdução
    const frame = Math.max(0, Math.round((ms / 1000) * fps));
    const out = path.join(OUT_DIR, `${slug}.png`);

    console.log(`📸 ${slug} (frame ${frame})`);
    execFileSync(
      "npx",
      ["remotion", "still", ENTRY, "Explainer-wide", out, `--props=${JSON.stringify({ slug })}`, `--frame=${frame}`, "--overwrite"],
      { stdio: "inherit", cwd: ROOT },
    );
  }

  console.log(`\n✓ ${targets.length} preview(s) em ${OUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
