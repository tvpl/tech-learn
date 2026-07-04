import type { Explainer } from "@/schema/explainer";

export interface ContentMeta {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  level: "intro" | "medio" | "avancado";
  loader: () => Promise<Explainer>;
}

/**
 * Registro central: metadados leves (para a home, sem puxar o conteúdo todo)
 * + carregador dynamic import (code-split — só baixa o explainer que o usuário abrir).
 */
export const REGISTRY: ContentMeta[] = [
  {
    slug: "como-um-llm-funciona",
    title: "Como um LLM funciona",
    subtitle: "Do texto ao próximo token, passo a passo",
    category: "IA & Agentes",
    level: "medio",
    loader: async () => (await import("./como-um-llm-funciona")).comoUmLlmFunciona,
  },
  {
    slug: "tls-1-3-na-pratica",
    title: "TLS 1.3 na prática",
    subtitle: "O aperto de mão que protege toda conexão HTTPS",
    category: "Segurança & Autenticação",
    level: "avancado",
    loader: async () => (await import("./tls-1-3-na-pratica")).tls13NaPratica,
  },
];

export const SLUGS = REGISTRY.map((e) => e.slug);

export function loaderFor(slug: string): (() => Promise<Explainer>) | undefined {
  return REGISTRY.find((e) => e.slug === slug)?.loader;
}
