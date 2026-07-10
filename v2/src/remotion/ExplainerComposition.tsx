import React, { useEffect, useMemo, useRef, useState } from "react";
import { AbsoluteFill, Audio, continueRender, delayRender, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { compileTimeline, type Timeline } from "@/core/timeline";
import type { Explainer } from "@/schema/explainer";
import { FORMATS, type FormatId } from "@/schema/formats";
import { Stage } from "@/stage/Stage";
import { prepareExplainer } from "@/stage/highlight";

/**
 * Props "de entrada" (slug/format/theme) são as mesmas antes E depois do
 * `calculateMetadata` — o Remotion exige que as duas fases compartilhem o
 * mesmo tipo. `explainer` nasce ausente e é preenchido pelo calculateMetadata
 * (ver Root.tsx) antes de qualquer frame ser de fato renderizado.
 *
 * `audio` é opcional (mapa sceneId → caminho absoluto do mp3 cacheado por
 * `npm run tts`, montado em Node por `scripts/render.ts` — nunca calculado
 * aqui, já que este componente roda no Chromium headless do Remotion, sem
 * `node:fs`). Ausente/vazio = comportamento de sempre, sem áudio.
 */
export type ExplainerCompositionProps = {
  slug: string;
  format: FormatId;
  theme?: "dark" | "light";
  explainer?: Explainer;
  audio?: Record<string, string>;
};

/**
 * Composição Remotion: renderiza EXATAMENTE o mesmo <Stage/> do player web,
 * só que dirigido por `useCurrentFrame()` em vez do relógio do usuário — é
 * essa reutilização que garante paridade pixel-a-pixel entre site e vídeo.
 */
export function ExplainerComposition({ explainer, format, theme = "dark", audio }: ExplainerCompositionProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const timeline = useMemo(() => (explainer ? compileTimeline(explainer, format) : null), [explainer, format]);
  const [ready, setReady] = useState(false);
  const handleRef = useRef<number | null>(null);

  useEffect(() => {
    if (!explainer) return;
    handleRef.current = delayRender("shiki highlight");
    let alive = true;
    prepareExplainer(explainer).then(() => {
      if (!alive) return;
      setReady(true);
      if (handleRef.current !== null) continueRender(handleRef.current);
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [explainer]);

  if (!ready || !timeline) return <AbsoluteFill style={{ background: "#0b0e14" }} />;

  const tMs = (frame / fps) * 1000;
  const spec = FORMATS[format];
  const scale = spec.render.w / spec.canvas.w;

  return (
    <AbsoluteFill style={{ background: "#0b0e14" }}>
      <div style={{ width: spec.canvas.w, height: spec.canvas.h, transform: `scale(${scale})`, transformOrigin: "top left" }}>
        <Stage timeline={timeline} tMs={tMs} theme={theme} interactive={false} exporting />
      </div>
      {audio ? <NarrationTracks timeline={timeline} audio={audio} fps={fps} /> : null}
    </AbsoluteFill>
  );
}

/** Uma <Sequence>+<Audio> por cena com narração cacheada — silenciosa fora da própria janela. */
function NarrationTracks({
  timeline,
  audio,
  fps,
}: {
  timeline: Timeline;
  audio: Record<string, string>;
  fps: number;
}) {
  return (
    <>
      {timeline.scenes.map((scene) => {
        const src = audio[scene.def.id];
        if (!src) return null;
        const from = Math.round((scene.startMs / 1000) * fps);
        const durationInFrames = Math.max(1, Math.round(((scene.endMs - scene.startMs) / 1000) * fps));
        return (
          <Sequence key={scene.def.id} from={from} durationInFrames={durationInFrames}>
            <Audio src={src} />
          </Sequence>
        );
      })}
    </>
  );
}
