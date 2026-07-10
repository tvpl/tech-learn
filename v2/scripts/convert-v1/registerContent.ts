import fs from "node:fs";
import path from "node:path";

export interface RegistryEntry {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  level: "intro" | "medio" | "avancado";
  camelName: string;
}

/**
 * Insere entradas novas em `src/content/index.ts` (antes do fechamento do
 * array `REGISTRY`), evitando duplicar slugs já presentes. Edição por texto
 * (não AST) — o arquivo é simples e previsível o bastante para isso.
 */
export function registerEntries(v2Root: string, entries: RegistryEntry[]): void {
  const indexPath = path.join(v2Root, "src/content/index.ts");
  let source = fs.readFileSync(indexPath, "utf8");

  const toAdd = entries.filter((e) => !source.includes(`slug: "${e.slug}"`));
  if (toAdd.length === 0) return;

  const block = toAdd
    .map(
      (e) => `  {
    slug: "${e.slug}",
    title: ${JSON.stringify(e.title)},
    subtitle: ${JSON.stringify(e.subtitle)},
    category: ${JSON.stringify(e.category)},
    level: "${e.level}",
    loader: async () => (await import("./${e.slug}")).${e.camelName},
  },
`,
    )
    .join("");

  const marker = "];\n\nexport const SLUGS";
  if (!source.includes(marker)) throw new Error("registerContent: marcador do fim de REGISTRY não encontrado em index.ts");
  source = source.replace(marker, `${block}];\n\nexport const SLUGS`);
  fs.writeFileSync(indexPath, source, "utf8");
}
