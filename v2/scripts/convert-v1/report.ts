import type { Warning } from "./types";

export interface ConvertResult {
  slug: string;
  ok: boolean;
  warnings: Warning[];
  error?: string;
  outFile?: string;
  registry?: { title: string; subtitle: string; category: string; level: "intro" | "medio" | "avancado"; camelName: string };
}

export function printReport(results: ConvertResult[]): void {
  const ok = results.filter((r) => r.ok);
  const failed = results.filter((r) => !r.ok);

  console.log(`\n${"=".repeat(70)}`);
  console.log(`Conversão v1 → v2: ${ok.length}/${results.length} arquivo(s) OK`);
  console.log("=".repeat(70));

  for (const r of results) {
    const warn = r.warnings.filter((w) => w.severity === "warn");
    const info = r.warnings.filter((w) => w.severity === "info");
    if (!r.ok) {
      console.log(`\n✗ ${r.slug} — FALHOU: ${r.error}`);
      continue;
    }
    const flag = warn.length > 0 ? "⚠" : "✓";
    console.log(`\n${flag} ${r.slug} → ${r.outFile} (${warn.length} avisos importantes, ${info.length} informativos)`);
    for (const w of warn) console.log(`   ⚠ ${w.message}`);
    for (const w of info) console.log(`   · ${w.message}`);
  }

  console.log(`\n${"=".repeat(70)}`);
  if (failed.length > 0) {
    console.log(`${failed.length} arquivo(s) FALHARAM: ${failed.map((f) => f.slug).join(", ")}`);
  }
  const needsReview = ok.filter((r) => r.warnings.some((w) => w.severity === "warn"));
  if (needsReview.length > 0) {
    console.log(`${needsReview.length} arquivo(s) com avisos que pedem revisão visual: ${needsReview.map((r) => r.slug).join(", ")}`);
  }
}
