#!/usr/bin/env tsx
/**
 * Pré-gera o áudio de narração de um explainer via o provider de TTS
 * configurado (ver src/tts/provider.ts) e cacheia em `.tts-cache/<slug>/`.
 * Precisa rodar ANTES de `npm run render`, já que o Remotion não pode chamar
 * uma API HTTP durante o render de frames — ele só lê o cache do disco
 * (ver render.ts/readAudioMap).
 *
 * Uso:
 *   npm run tts -- <slug> [--voice=alloy] [--force]
 *
 * Sem OPENAI_API_KEY (ou o provider escolhido), falha com uma mensagem clara
 * — é esperado nesta rodada, já que só o plumbing foi construído, sem chave
 * disponível para testar geração real.
 */
import { existsSync, writeFileSync } from "node:fs";
import { getProvider } from "../src/tts/provider";
import { loaderFor, SLUGS } from "../src/content/index";
import { ensureTtsCacheDir, ttsCachePath } from "./tts-cache";

async function main() {
  const [slug, ...rest] = process.argv.slice(2);
  const force = rest.includes("--force");
  const voice = rest.find((a) => a.startsWith("--voice="))?.slice("--voice=".length);

  if (!slug) {
    console.error("Uso: npm run tts -- <slug> [--voice=alloy] [--force]");
    console.error(`Slugs disponíveis: ${SLUGS.join(", ")}`);
    process.exit(1);
  }
  if (!SLUGS.includes(slug)) {
    console.error(`Slug desconhecido: "${slug}". Disponíveis: ${SLUGS.join(", ")}`);
    process.exit(1);
  }

  const loader = loaderFor(slug);
  const explainer = await loader!();
  const scenesWithNarration = explainer.scenes.filter((s) => s.narration?.trim());

  if (scenesWithNarration.length === 0) {
    console.log(`"${slug}" não tem nenhuma cena com \`narration\` — nada a gerar.`);
    return;
  }

  ensureTtsCacheDir(slug);
  const provider = await getProvider();

  for (const scene of scenesWithNarration) {
    const out = ttsCachePath(slug, scene.id);
    if (existsSync(out) && !force) {
      console.log(`↷ ${scene.id} (já em cache, use --force para regerar)`);
      continue;
    }
    console.log(`🔊 ${scene.id}: "${scene.narration!.slice(0, 60)}${scene.narration!.length > 60 ? "…" : ""}"`);
    const audio = await provider(scene.narration!, { voice });
    writeFileSync(out, audio);
  }

  console.log(`\n✓ narração de "${slug}" em .tts-cache/${slug}/`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
