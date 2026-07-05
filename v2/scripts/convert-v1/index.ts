import fs from "node:fs";
import path from "node:path";
import type { ElementDef, ElementKind } from "../../src/schema/elements";
import type { ExplainerInput, SceneInput } from "../../src/schema/explainer";
import { validateExplainer } from "../../src/schema/explainer";
import { loadDiagram } from "./loadV1";
import { normalizeLegacyDiagram } from "./normalizeLegacy";
import { buildGroups, traceStep } from "./traceEnter";
import { computeScale, mapElement } from "./mapElements";
import { mapStep } from "./mapScenes";
import { metaFor } from "./meta";
import { emit, toCamelSlug, tryFormat } from "./emit";
import { printReport, type ConvertResult } from "./report";
import type { Warning } from "./types";

const V1_ROOT = path.resolve(__dirname, "../../..");
const V2_ROOT = path.resolve(__dirname, "../..");

export async function convertOne(slug: string, opts?: { dryRun?: boolean }): Promise<ConvertResult> {
  const warnings: Warning[] = [];
  try {
    const meta = metaFor(slug); // lança se faltar entrada em meta.ts

    const { window, diagram: rawDiagram } = loadDiagram(V1_ROOT, slug);
    const { diagram, warnings: legacyWarnings } = normalizeLegacyDiagram(rawDiagram, slug);
    warnings.push(...legacyWarnings);

    const scale = computeScale(diagram.width, diagram.height);
    const groups = buildGroups(diagram.elements);

    const elements: ElementDef[] = [];
    for (const v1el of diagram.elements) {
      const { elements: mapped, warnings: w } = mapElement(v1el, scale, slug);
      elements.push(...mapped);
      warnings.push(...w);
    }
    const kindOf = (id: string): ElementKind | undefined => elements.find((e) => e.id === id)?.kind;

    const baseIds = diagram.elements.filter((e) => e.base).map((e) => e.id);
    const glossary: Record<string, string> = {};
    const scenes: SceneInput[] = [];
    let accumulatedVisible = new Set<string>();

    for (let idx = 0; idx < diagram.steps.length; idx++) {
      const step = diagram.steps[idx];
      const trace = traceStep(window, step, groups);
      const { scene, warnings: w, accumulatedVisible: next } = mapStep({
        step,
        idx,
        isFirstScene: idx === 0,
        baseIds,
        accumulatedVisible,
        trace,
        groups,
        kindOf,
        scale,
        autoplayMs: diagram.autoplayMs ?? 6500,
        glossary,
        slug,
      });
      scenes.push(scene);
      warnings.push(...w);
      accumulatedVisible = next;
    }

    const input: ExplainerInput = {
      slug,
      title: diagram.title,
      subtitle: diagram.subtitle,
      category: meta.category,
      tags: meta.tags,
      level: meta.level,
      glossary,
      elements,
      scenes,
    };

    validateExplainer(input); // lança ContentError se algo estiver inconsistente

    const camelName = toCamelSlug(slug);
    let source = emit(input, slug, camelName);
    source = await tryFormat(source);

    const outFile = path.join(V2_ROOT, "src/content", `${slug}.ts`);
    if (!opts?.dryRun) fs.writeFileSync(outFile, source, "utf8");

    return {
      slug,
      ok: true,
      warnings,
      outFile,
      registry: { title: input.title, subtitle: input.subtitle ?? "", category: input.category, level: input.level ?? "medio", camelName },
    };
  } catch (e) {
    return { slug, ok: false, warnings, error: e instanceof Error ? e.message : String(e) };
  }
}

export async function convertAll(slugs: string[], opts?: { dryRun?: boolean }): Promise<ConvertResult[]> {
  const results: ConvertResult[] = [];
  for (const slug of slugs) results.push(await convertOne(slug, opts));
  return results;
}

export { printReport };
export type { ConvertResult };
