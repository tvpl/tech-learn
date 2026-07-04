import React from "react";
import type { Timeline } from "@/core/timeline";
import { FORMATS, WORLD } from "@/schema/formats";
import { Caption } from "./Caption";
import { ElementBody, type RenderCtx } from "./elements";
import { toneVar } from "./tones";
import "./stage.css";

/** Margem extra ao redor do mundo — conectores/câmera podem sair um pouco da moldura. */
const SVG_PAD = 400;
const svgBox = {
  x: -SVG_PAD,
  y: -SVG_PAD,
  w: WORLD.w + SVG_PAD * 2,
  h: WORLD.h + SVG_PAD * 2,
};

export interface StageProps {
  timeline: Timeline;
  tMs: number;
  theme?: "dark" | "light";
  interactive?: boolean;
  /** true dentro do Remotion — desliga cursor/hover, mostra watermark. */
  exporting?: boolean;
}

/**
 * Renderizador PURO: (explainer compilado, tMs) → JSX. Sem estado próprio,
 * sem efeitos, sem relógio — o player web e o Remotion chamam isto com o
 * mesmo `timeline` e o `tMs` que cada um controla à sua maneira.
 */
export function Stage({ timeline, tMs, theme = "dark", interactive = true, exporting = false }: StageProps) {
  const { explainer: ex, format } = timeline;
  const spec = FORMATS[format];
  const state = timeline.getState(tMs);
  const ctx: RenderCtx = { theme, glossary: ex.glossary, interactive };

  const camScale = state.camera.scale;
  const stageRegion = spec.regions.stage;
  const camTransform = `translate(${stageRegion.x + stageRegion.w / 2}px, ${stageRegion.y + stageRegion.h / 2}px) scale(${camScale}) translate(${-state.camera.cx}px, ${-state.camera.cy}px)`;

  const visibleEntries = [...state.elements.values()].filter((s) => s.visible && s.rect);

  return (
    <div
      className={`tl-stage tl-theme-${theme}${exporting ? " tl-exporting" : ""}`}
      style={{ width: spec.canvas.w, height: spec.canvas.h }}
      data-scene={state.scene.def.id}
    >
      <div className="tl-title-region" style={rectStyle(spec.regions.title)}>
        <span className="tl-title-text">{ex.title}</span>
        <span className="tl-title-scene">{state.scene.def.title}</span>
      </div>

      <div className="tl-camera" style={{ transform: camTransform }}>
        <svg
          className="tl-svg-under"
          style={svgOverlayStyle}
          viewBox={`${svgBox.x} ${svgBox.y} ${svgBox.w} ${svgBox.h}`}
        >
          {ex.elements
            .filter((el) => el.kind === "connector")
            .map((el) => {
              const st = state.elements.get(el.id)!;
              const geom = timeline.pathOf(el.id);
              if (!st.visible || !geom || el.kind !== "connector") return null;
              return <ConnectorSvg key={el.id} el={el} st={st} geom={geom} />;
            })}
        </svg>

        {visibleEntries
          .filter((s) => s.def.kind !== "connector" && s.def.kind !== "flow")
          .map((s) => (
            <div
              key={s.def.id}
              className={`tl-el tl-el-${s.def.kind}${s.highlight > 0.05 ? " tl-highlighted" : ""}`}
              style={elementStyle(s)}
            >
              <ElementBody st={s} ctx={ctx} />
            </div>
          ))}

        <svg
          className="tl-svg-over"
          style={svgOverlayStyle}
          viewBox={`${svgBox.x} ${svgBox.y} ${svgBox.w} ${svgBox.h}`}
        >
          {state.particles.map((p) => (
            <circle key={p.key} cx={p.x} cy={p.y} r={p.size} fill={toneVar(p.tone)} opacity={p.opacity} />
          ))}
        </svg>
      </div>

      {state.caption ? (
        <Caption
          cap={state.caption.def}
          progress={state.caption.progress}
          anchorRect={
            spec.regions.caption
              ? null // formato usa card fixo, não flutuante
              : anchorRectOnScreen(state, stageRegion)
          }
          fixedRegion={spec.regions.caption}
          glossary={ex.glossary}
          interactive={interactive}
        />
      ) : null}

      {exporting ? (
        <div className="tl-watermark" style={rectStyle(spec.regions.watermark)}>
          tech-learn.dev · {ex.slug}
        </div>
      ) : null}
    </div>
  );
}

/**
 * O balão flutuante é renderizado FORA de `.tl-camera` (para não ter seu texto/
 * padding esticados pelo zoom da câmera). Por isso sua âncora precisa ser
 * projetada manualmente do espaço-mundo para o espaço de tela, usando a MESMA
 * transformação (translate+scale) aplicada à `.tl-camera` — senão o balão
 * "descola" do elemento que ele aponta assim que a câmera dá zoom/pan.
 */
function anchorRectOnScreen(
  state: ReturnType<Timeline["getState"]>,
  stageRegion: { x: number; y: number; w: number; h: number },
): { x: number; y: number; w: number; h: number } | null {
  const anchor = state.caption?.def.anchor;
  if (!anchor) return null;
  const world =
    typeof anchor === "string" ? state.elements.get(anchor)?.rect : { x: anchor.x, y: anchor.y, w: 0, h: 0 };
  if (!world) return null;
  const { cx, cy, scale } = state.camera;
  const originX = stageRegion.x + stageRegion.w / 2;
  const originY = stageRegion.y + stageRegion.h / 2;
  return {
    x: originX + (world.x - cx) * scale,
    y: originY + (world.y - cy) * scale,
    w: world.w * scale,
    h: world.h * scale,
  };
}

function rectStyle(r: { x: number; y: number; w: number; h: number }): React.CSSProperties {
  return { position: "absolute", left: r.x, top: r.y, width: r.w, height: r.h };
}

const svgOverlayStyle: React.CSSProperties = {
  position: "absolute",
  left: svgBox.x,
  top: svgBox.y,
  width: svgBox.w,
  height: svgBox.h,
  overflow: "visible",
  pointerEvents: "none",
};

function elementStyle(s: { rect?: { x: number; y: number; w: number; h: number }; opacity: number; dx: number; dy: number; scale: number; dim: number }): React.CSSProperties {
  if (!s.rect) return { display: "none" };
  return {
    position: "absolute",
    left: s.rect.x,
    top: s.rect.y,
    width: s.rect.w,
    height: s.rect.h,
    opacity: s.opacity * (1 - s.dim * 0.65),
    transform: `translate(${s.dx}px, ${s.dy}px) scale(${s.scale})`,
  };
}

function ConnectorSvg({
  el,
  st,
  geom,
}: {
  el: Extract<import("@/schema/elements").ElementDef, { kind: "connector" }>;
  st: import("@/core/timeline").ElementState;
  geom: import("@/core/connectors").PathGeom;
}) {
  const dash = geom.length;
  const offset = dash * (1 - st.drawProgress);
  const color = toneVar(st.toneOverride ?? el.tone ?? "neutral");
  const markerId = `tl-arrow-${el.id}`;
  return (
    <g opacity={st.opacity * (1 - st.dim * 0.65)}>
      <defs>
        <marker id={markerId} markerWidth={10} markerHeight={10} refX={8} refY={5} orient="auto">
          <path d="M0,0 L10,5 L0,10 Z" fill={color} />
        </marker>
      </defs>
      <path
        d={geom.d}
        fill="none"
        stroke={color}
        strokeWidth={el.thickness ?? 3}
        strokeDasharray={el.dashed ? "8 6" : dash}
        strokeDashoffset={el.dashed ? undefined : offset}
        markerEnd={el.arrow ? `url(#${markerId})` : undefined}
      />
      {el.label ? (
        <text x={geom.mid.x} y={geom.mid.y - 10} textAnchor="middle" className="tl-connector-label">
          {el.label}
        </text>
      ) : null}
    </g>
  );
}
