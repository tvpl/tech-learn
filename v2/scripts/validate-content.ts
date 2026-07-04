/**
 * Valida todo o conteúdo em src/content (zod + checagens semânticas).
 * Roda em `npm test` e dentro de `npm run build` — falha o build se algo
 * estiver quebrado (referência inexistente, quiz malformado, etc.).
 */
import { REGISTRY } from "../src/content/index";

async function main() {
  let failed = false;
  for (const { slug, loader } of REGISTRY) {
    try {
      const ex = await loader();
      if (ex.slug !== slug) {
        throw new Error(`slug do módulo ("${ex.slug}") não bate com o registro ("${slug}")`);
      }
      console.log(`✓ ${slug} — ${ex.scenes.length} cenas, ${ex.elements.length} elementos`);
    } catch (err) {
      failed = true;
      console.error(`✗ ${slug}`);
      console.error(err instanceof Error ? err.message : err);
    }
  }
  if (failed) {
    console.error("\nValidação de conteúdo falhou.");
    process.exit(1);
  }
  console.log(`\n${REGISTRY.length} explainer(s) válidos.`);
}

main();
