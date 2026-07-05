"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Pause, Play } from "lucide-react";
import { compileTimeline } from "@/core/timeline";
import type { Explainer } from "@/schema/explainer";
import { FORMATS, type FormatId } from "@/schema/formats";
import { Stage } from "@/stage/Stage";
import { prepareExplainer } from "@/stage/highlight";
import { useClock } from "@/player/useClock";

const PANELS: { format: FormatId; label: string; ratio: string; commands: string[] }[] = [
  { format: "wide", label: "16:9 · Web / YouTube", ratio: "16/9", commands: ["--format=wide"] },
  { format: "vertical", label: "9:16 · Reels / Stories", ratio: "9/16", commands: ["--format=reels"] },
  { format: "feed", label: "4:5 · Feed LinkedIn/Instagram", ratio: "4/5", commands: ["--format=feed", "--format=carousel"] },
];

export function StudioView({ explainer }: { explainer: Explainer }) {
  const [ready, setReady] = useState(false);
  const timelines = useMemo(
    () => Object.fromEntries(PANELS.map((p) => [p.format, compileTimeline(explainer, p.format)])) as Record<
      FormatId,
      ReturnType<typeof compileTimeline>
    >,
    [explainer],
  );
  const totalMs = timelines.wide.totalMs;
  const clock = useClock(totalMs);

  useEffect(() => {
    // pousa depois que as entradas da 1ª cena terminam — senão o relógio fica
    // parado em t=0, no meio do fade-in (tudo com opacidade 0).
    clock.seek(timelines.wide.scenes[0]?.settleMs ?? 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [explainer]);

  useEffect(() => {
    prepareExplainer(explainer).then(() => setReady(true));
  }, [explainer]);

  return (
    <main className="min-h-screen bg-[#0b0e14] px-6 py-10 text-[#eef1f8]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#5b9dff]">Studio · export social</div>
        <h1 className="mb-1 text-3xl font-bold">{explainer.title}</h1>
        <p className="mb-8 text-sm text-[#a7b0c4]">
          O mesmo conteúdo, nos 3 formatos de exportação — a câmera se reenquadra automaticamente por formato.
        </p>

        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={clock.toggle}
            className="flex items-center gap-2 rounded-full bg-[#5b9dff] px-4 py-2 text-sm font-medium text-white"
          >
            {clock.playing ? <Pause size={14} /> : <Play size={14} />}
            {clock.playing ? "Pausar prévia" : "Reproduzir prévia"}
          </button>
          <input
            type="range"
            min={0}
            max={Math.max(totalMs - 1, 0)}
            value={clock.t}
            onChange={(e) => clock.seek(Number(e.target.value))}
            className="h-1 flex-1 accent-[#5b9dff]"
          />
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {PANELS.map((p) => (
            <div key={p.format}>
              <div className="mb-2 flex items-baseline justify-between">
                <span className="text-sm font-semibold">{p.label}</span>
              </div>
              <div
                className="overflow-hidden rounded-xl border border-[#232a3d] bg-black"
                style={{ aspectRatio: p.ratio, containerType: "inline-size" }}
              >
                {ready ? (
                  <div
                    style={{
                      width: FORMATS[p.format].canvas.w,
                      height: FORMATS[p.format].canvas.h,
                      transform: `scale(calc(100cqw / ${FORMATS[p.format].canvas.w}px))`,
                      transformOrigin: "top left",
                    }}
                  >
                    <PanelStage timeline={timelines[p.format]} tMs={clock.t} />
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-[#6b7690]">preparando…</div>
                )}
              </div>
              <div className="mt-3 space-y-1.5">
                {p.commands.map((cmd) => (
                  <code key={cmd} className="block truncate rounded-lg bg-[#131826] px-3 py-2 text-xs text-[#a7b0c4]">
                    npm run render -- {explainer.slug} {cmd}
                  </code>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-xl border border-[#232a3d] bg-[#131826] p-5 text-sm text-[#a7b0c4]">
          <div className="mb-2 font-semibold text-[#eef1f8]">Gerar tudo de uma vez</div>
          <code className="block rounded-lg bg-[#0b0e14] px-3 py-2 text-xs">
            npm run render -- {explainer.slug} --format=all
          </code>
          <p className="mt-3">
            Gera MP4 (wide/reels/feed), GIF teaser e o carrossel (PNGs + PDF pronto para o LinkedIn) em{" "}
            <code>v2/out/{explainer.slug}/</code>.
          </p>
        </div>
      </div>
    </main>
  );
}

function PanelStage({ timeline, tMs }: { timeline: ReturnType<typeof compileTimeline>; tMs: number }) {
  return <Stage timeline={timeline} tMs={tMs} interactive={false} />;
}
