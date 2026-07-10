/**
 * Caminhos do cache local de áudio de narração (`v2/.tts-cache/`, gitignored).
 * Só usado por scripts Node (`tts.ts`, `render.ts`) — NUNCA importar isto de
 * `src/remotion/*` ou `src/tts/*`, que também rodam dentro do bundle do
 * Remotion (browser via Chromium headless), onde `node:fs` não existe.
 */
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(__dirname, "..");
export const TTS_CACHE_DIR = path.join(ROOT, ".tts-cache");

export function ttsCacheDirFor(slug: string): string {
  return path.join(TTS_CACHE_DIR, slug);
}

export function ttsCachePath(slug: string, sceneId: string): string {
  return path.join(ttsCacheDirFor(slug), `${sceneId}.mp3`);
}

export function ensureTtsCacheDir(slug: string): string {
  const dir = ttsCacheDirFor(slug);
  mkdirSync(dir, { recursive: true });
  return dir;
}

/** Mapa sceneId → caminho absoluto do mp3 cacheado, só para as cenas que JÁ têm áudio gerado. */
export function readAudioMap(slug: string, sceneIds: string[]): Record<string, string> {
  const map: Record<string, string> = {};
  for (const id of sceneIds) {
    const p = ttsCachePath(slug, id);
    if (existsSync(p)) map[id] = p;
  }
  return map;
}
