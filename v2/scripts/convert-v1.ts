#!/usr/bin/env tsx
/**
 * CLI do conversor v1 → v2.
 *
 *   npm run convert-v1 -- --only recursao,git [--dry-run]
 *
 * Ver v2/scripts/convert-v1/index.ts para a implementação e o plano de
 * migração (README.md / AGENTS.md da v2) para o contexto completo.
 */
import path from "node:path";
import { convertAll, printReport } from "./convert-v1/index";
import { registerEntries } from "./convert-v1/registerContent";

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const register = args.includes("--register");
  const onlyIdx = args.indexOf("--only");
  const only = onlyIdx >= 0 ? args[onlyIdx + 1]?.split(",") : undefined;

  if (!only || only.length === 0) {
    console.error("Uso: npm run convert-v1 -- --only slug1,slug2 [--dry-run] [--register]");
    process.exit(1);
  }

  const results = await convertAll(only, { dryRun });
  printReport(results);

  if (register && !dryRun) {
    const entries = results.filter((r) => r.ok && r.registry).map((r) => ({ slug: r.slug, ...r.registry! }));
    if (entries.length > 0) {
      registerEntries(path.resolve(__dirname, ".."), entries);
      console.log(`\n✓ ${entries.length} slug(s) registrados em src/content/index.ts`);
    }
  }

  if (results.some((r) => !r.ok)) process.exit(1);
}

main();
