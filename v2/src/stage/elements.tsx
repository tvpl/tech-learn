import React from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import type { ElementState } from "@/core/timeline";
import type { Tone } from "@/schema/elements";
import { getHighlight } from "./highlight";
import { ICONS } from "./icons";
import { richText, typewriterSlice } from "./richtext";
import { toneVar } from "./tones";

export interface RenderCtx {
  theme: "dark" | "light";
  glossary: Record<string, string>;
  interactive: boolean;
}

/** Conteúdo interno de um elemento HTML (posicionamento fica no Stage). */
export function ElementBody({ st, ctx }: { st: ElementState; ctx: RenderCtx }): React.ReactNode {
  const el = st.def;
  const tone: Tone | undefined = st.toneOverride ?? el.tone;
  const tv = toneVar(tone);

  switch (el.kind) {
    case "box": {
      const label = st.textOverride ?? el.label;
      const Icon = el.icon ? ICONS[el.icon] : undefined;
      return (
        <div className={`tl-box tl-box-${el.variant}`} style={{ "--tone": tv } as React.CSSProperties}>
          {Icon ? <Icon className="tl-box-icon" aria-hidden /> : null}
          <div className="tl-box-texts">
            {label ? <div className="tl-box-label">{richText(applyType(label, st), ctx.glossary, ctx.interactive)}</div> : null}
            {el.sub ? <div className="tl-box-sub">{richText(el.sub, ctx.glossary, ctx.interactive)}</div> : null}
          </div>
        </div>
      );
    }
    case "token": {
      const text = st.textOverride ?? el.text;
      return (
        <div className={`tl-token${el.mono ? " tl-mono" : ""}`} style={{ "--tone": tv } as React.CSSProperties}>
          {applyType(text, st)}
        </div>
      );
    }
    case "label": {
      const text = st.textOverride ?? el.text;
      return (
        <div
          className={`tl-label${el.muted ? " tl-muted" : ""}`}
          style={{ fontSize: el.size ?? 22, textAlign: cssAlign(el.align), "--tone": tv } as React.CSSProperties}
        >
          {richText(applyType(text, st), ctx.glossary, ctx.interactive)}
        </div>
      );
    }
    case "text": {
      const md = st.textOverride ?? el.md;
      return (
        <div className="tl-text" style={{ fontSize: el.size ?? 20, textAlign: cssAlign(el.align) }}>
          {richText(applyType(md, st), ctx.glossary, ctx.interactive)}
        </div>
      );
    }
    case "code":
      return <CodeBody st={st} ctx={ctx} />;
    case "formula":
      return <FormulaBody latex={el.latex} size={el.size} />;
    case "bars": {
      const values = st.values ?? el.values;
      return (
        <div className="tl-bars" style={{ "--tone": tv } as React.CSSProperties}>
          <div className="tl-bars-track">
            {values.map((v, i) => (
              <div key={i} className="tl-bar-col">
                <div className="tl-bar" style={{ height: `${Math.round(v * 100)}%` }} />
              </div>
            ))}
          </div>
          {el.labels ? (
            <div className="tl-bars-labels">
              {el.labels.map((l, i) => (
                <span key={i}>{l}</span>
              ))}
            </div>
          ) : null}
        </div>
      );
    }
    case "matrix": {
      const lit = new Map(st.litCells.map((c) => [`${c.r}:${c.c}`, c.p]));
      return (
        <div className="tl-matrix" style={{ "--tone": tv, "--cols": el.cols } as React.CSSProperties}>
          {el.colLabels ? (
            <div className="tl-matrix-collabels">
              {el.colLabels.map((l, i) => (
                <span key={i}>{l}</span>
              ))}
            </div>
          ) : null}
          <div className="tl-matrix-body">
            {el.rowLabels ? (
              <div className="tl-matrix-rowlabels">
                {el.rowLabels.map((l, i) => (
                  <span key={i}>{l}</span>
                ))}
              </div>
            ) : null}
            <div className="tl-matrix-grid">
              {Array.from({ length: el.rows * el.cols }, (_, i) => {
                const r = Math.floor(i / el.cols);
                const c = i % el.cols;
                const p = lit.get(`${r}:${c}`) ?? 0;
                return <div key={i} className="tl-cell" style={{ "--lit": p } as React.CSSProperties} />;
              })}
            </div>
          </div>
        </div>
      );
    }
    case "icon": {
      const Icon = ICONS[el.name] ?? ICONS.sparkles;
      return (
        <div className="tl-icon" style={{ "--tone": tv } as React.CSSProperties}>
          <Icon strokeWidth={el.strokeWidth ?? 1.75} />
        </div>
      );
    }
    case "image":
      // eslint-disable-next-line @next/next/no-img-element
      return <img className={`tl-image${el.rounded ? " tl-rounded" : ""}`} src={el.src} alt="" />;
    case "counter": {
      const v = el.from + (el.to - el.from) * st.counterProgress;
      return (
        <div className="tl-counter" style={{ fontSize: el.size ?? 44, "--tone": tv } as React.CSSProperties}>
          {el.prefix}
          {v.toFixed(el.decimals)}
          {el.suffix}
        </div>
      );
    }
    default:
      return null; // connector/flow são renderizados fora (SVG / filhos)
  }
}

function applyType(text: string, st: ElementState): string {
  return st.typeProgress < 1 ? typewriterSlice(text, st.typeProgress) : text;
}

function cssAlign(a: "start" | "center" | "end"): "left" | "center" | "right" {
  return a === "start" ? "left" : a === "end" ? "right" : "center";
}

function CodeBody({ st, ctx }: { st: ElementState; ctx: RenderCtx }) {
  const el = st.def;
  if (el.kind !== "code") return null;
  const lines = getHighlight(el.lang, el.source, ctx.theme);
  const plain = el.source.split("\n");
  const total = plain.length;
  const focus = st.focusLines;
  return (
    <div className="tl-codeblock">
      {el.title ? <div className="tl-code-title">{el.title}</div> : null}
      <pre className="tl-code" style={{ fontSize: el.fontSize ?? 16 }}>
        {Array.from({ length: total }, (_, i) => {
          const n = i + 1;
          const dimmed = focus ? n < focus[0] || n > focus[1] : false;
          return (
            <div key={i} className={`tl-code-line${dimmed ? " tl-code-dim" : ""}`}>
              <span className="tl-code-ln">{n}</span>
              <span>
                {lines
                  ? lines[i]?.tokens.map((t, k) => (
                      <span key={k} style={t.color ? { color: t.color } : undefined}>
                        {t.content}
                      </span>
                    ))
                  : plain[i]}
              </span>
            </div>
          );
        })}
      </pre>
    </div>
  );
}

function FormulaBody({ latex, size }: { latex: string; size?: number }) {
  // katex é síncrono e determinístico — seguro para Remotion
  const html = katex.renderToString(latex, { throwOnError: false, displayMode: true });
  return <div className="tl-formula" style={{ fontSize: size ?? 26 }} dangerouslySetInnerHTML={{ __html: html }} />;
}
