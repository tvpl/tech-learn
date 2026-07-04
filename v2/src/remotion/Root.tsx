import React from "react";
import { Composition, type CalculateMetadataFunction } from "remotion";
import { compileTimeline, fpsOf } from "@/core/timeline";
import { FORMATS, type FormatId } from "@/schema/formats";
import { loaderFor } from "@/content/index";
import { ExplainerComposition, type ExplainerCompositionProps } from "./ExplainerComposition";

function makeMetadataFn(format: FormatId): CalculateMetadataFunction<ExplainerCompositionProps> {
  return async ({ props }) => {
    const loader = loaderFor(props.slug);
    if (!loader) throw new Error(`Explainer desconhecido: "${props.slug}"`);
    const explainer = await loader();
    const timeline = compileTimeline(explainer, format);
    const fps = fpsOf(format);
    const spec = FORMATS[format];
    return {
      props: { ...props, explainer, format },
      durationInFrames: Math.max(1, Math.ceil((timeline.totalMs / 1000) * fps)),
      fps,
      width: spec.render.w,
      height: spec.render.h,
    };
  };
}

const PLACEHOLDER_SLUG = "como-um-llm-funciona";

function defaultPropsFor(format: FormatId): ExplainerCompositionProps {
  return { slug: PLACEHOLDER_SLUG, format };
}

export function RemotionRoot() {
  return (
    <>
      <Composition
        id="Explainer-wide"
        component={ExplainerComposition}
        durationInFrames={300}
        fps={30}
        width={FORMATS.wide.render.w}
        height={FORMATS.wide.render.h}
        defaultProps={defaultPropsFor("wide")}
        calculateMetadata={makeMetadataFn("wide")}
      />
      <Composition
        id="Explainer-vertical"
        component={ExplainerComposition}
        durationInFrames={300}
        fps={30}
        width={FORMATS.vertical.render.w}
        height={FORMATS.vertical.render.h}
        defaultProps={defaultPropsFor("vertical")}
        calculateMetadata={makeMetadataFn("vertical")}
      />
      <Composition
        id="Explainer-feed"
        component={ExplainerComposition}
        durationInFrames={300}
        fps={30}
        width={FORMATS.feed.render.w}
        height={FORMATS.feed.render.h}
        defaultProps={defaultPropsFor("feed")}
        calculateMetadata={makeMetadataFn("feed")}
      />
    </>
  );
}
