import React, { useEffect, useMemo, useRef, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, useCurrentFrame, useVideoConfig } from "remotion";
import { compileTimeline } from "@/core/timeline";
import type { Explainer } from "@/schema/explainer";
import { FORMATS, type FormatId } from "@/schema/formats";
import { Stage } from "@/stage/Stage";
import { prepareExplainer } from "@/stage/highlight";

/**
 * Props "de entrada" (slug/format/theme) são as mesmas antes E depois do
 * `calculateMetadata` — o Remotion exige que as duas fases compartilhem o
 * mesmo tipo. `explainer` nasce ausente e é preenchido pelo calculateMetadata
 * (ver Root.tsx) antes de qualquer frame ser de fato renderizado.
 */
export type ExplainerCompositionProps = {
  slug: string;
  format: FormatId;
  theme?: "dark" | "light";
  explainer?: Explainer;
};

/**
 * Composição Remotion: renderiza EXATAMENTE o mesmo <Stage/> do player web,
 * só que dirigido por `useCurrentFrame()` em vez do relógio do usuário — é
 * essa reutilização que garante paridade pixel-a-pixel entre site e vídeo.
 */
export function ExplainerComposition({ explainer, format, theme = "dark" }: ExplainerCompositionProps) {
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
    </AbsoluteFill>
  );
}
