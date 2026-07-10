/**
 * Interface plugável de narração por voz. Um `TTSProvider` recebe o texto de
 * `scene.narration` e devolve o áudio como Buffer (mp3) — quem chama decide
 * onde gravar (ver `scripts/tts.ts`). Nenhum provider é chamado no caminho
 * do player web nem do Remotion: geração é sempre um passo prévio, offline.
 */
export interface TTSOptions {
  voice?: string;
}

export type TTSProvider = (text: string, opts?: TTSOptions) => Promise<Buffer>;

export type TTSProviderId = "openai";

const PROVIDERS: Record<TTSProviderId, () => Promise<TTSProvider>> = {
  openai: async () => (await import("./openai")).openaiTTS,
};

/**
 * Resolve o provider configurado via `TTS_PROVIDER` (default: "openai").
 * Só lança erro quando efetivamente USADO sem a chave certa — importar este
 * módulo nunca falha, então o resto do app (player, Remotion) pode depender
 * dele sem exigir nenhuma variável de ambiente.
 */
export async function getProvider(id: TTSProviderId = (process.env.TTS_PROVIDER as TTSProviderId) || "openai"): Promise<TTSProvider> {
  const factory = PROVIDERS[id];
  if (!factory) throw new Error(`Provider de TTS desconhecido: "${id}". Disponíveis: ${Object.keys(PROVIDERS).join(", ")}`);
  return factory();
}
