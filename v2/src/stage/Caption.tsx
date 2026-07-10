import React from "react";
import type { Caption as CaptionDef } from "@/schema/directives";
import type { Rect } from "@/schema/formats";
import { richText } from "./richtext";

/**
 * O balão sagrado da v1: text ("o quê") + why ("por quê"), sempre os dois.
 * Em `wide` flutua ancorado perto do elemento; em vertical/feed vira card fixo
 * na região `caption` do formato (ver Stage.tsx).
 */
export function Caption({
  cap,
  progress,
  anchorRect,
  fixedRegion,
  glossary,
  interactive,
}: {
  cap: CaptionDef;
  progress: number;
  anchorRect: Rect | null;
  fixedRegion: Rect | null;
  glossary: Record<string, string>;
  interactive: boolean;
}) {
  const style: React.CSSProperties = fixedRegion
    ? { left: fixedRegion.x, top: fixedRegion.y, width: fixedRegion.w, height: fixedRegion.h }
    : anchorRect
      ? floatingStyle(anchorRect, cap.placement)
      : { left: "50%", top: "50%", transform: "translate(-50%,-50%)" };

  return (
    <div
      className={`tl-caption tl-caption-${fixedRegion ? "fixed" : "float"} tl-place-${cap.placement}`}
      style={{ ...style, opacity: progress, "--rise": `${(1 - progress) * 10}px` } as React.CSSProperties}
    >
      <div className="tl-caption-text">{richText(cap.text, glossary, interactive)}</div>
      {cap.why ? (
        <div className="tl-caption-why">
          <span className="tl-caption-why-label">Por quê?</span> {richText(cap.why, glossary, interactive)}
        </div>
      ) : null}
    </div>
  );
}

function floatingStyle(anchor: Rect, placement: CaptionDef["placement"]): React.CSSProperties {
  const cx = anchor.x + anchor.w / 2;
  const cy = anchor.y + anchor.h / 2;
  const gap = 26;
  switch (placement) {
    case "top":
      return { left: cx, top: anchor.y - gap, transform: "translate(-50%,-100%)" };
    case "left":
      return { left: anchor.x - gap, top: cy, transform: "translate(-100%,-50%)" };
    case "right":
      return { left: anchor.x + anchor.w + gap, top: cy, transform: "translate(0,-50%)" };
    case "bottom":
    default:
      return { left: cx, top: anchor.y + anchor.h + gap, transform: "translate(-50%,0)" };
  }
}
