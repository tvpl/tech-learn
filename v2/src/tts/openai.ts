import type { TTSProvider } from "./provider";

const OPENAI_TTS_URL = "https://api.openai.com/v1/audio/speech";

/**
 * Implementação real via REST da API de TTS da OpenAI (sem SDK extra — só
 * `fetch`). Só roda se `OPENAI_API_KEY` estiver no ambiente; do contrário
 * lança erro claro em vez de silenciosamente gerar áudio vazio. Não foi
 * testada ponta-a-ponta nesta rodada (sem chave disponível) — só o plumbing.
 */
export const openaiTTS: TTSProvider = async (text, opts = {}) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY não definida. Configure-a para gerar narração via OpenAI TTS (ver v2/README.md, seção TTS).",
    );
  }

  const res = await fetch(OPENAI_TTS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "tts-1",
      voice: opts.voice ?? "alloy",
      input: text,
      response_format: "mp3",
    }),
  });

  if (!res.ok) {
    throw new Error(`OpenAI TTS falhou (${res.status}): ${await res.text()}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
};
