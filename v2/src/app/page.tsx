"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Check, Search, Sparkles, Wand2 } from "lucide-react";
import { REGISTRY } from "@/content/index";
import { getItem, visitedKey } from "@/lib/storage";

export default function Home() {
  const [query, setQuery] = useState("");
  const [visited, setVisited] = useState<Set<string>>(new Set());

  useEffect(() => {
    const v = new Set<string>();
    for (const item of REGISTRY) if (getItem(visitedKey(item.slug))) v.add(item.slug);
    setVisited(v);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return REGISTRY;
    return REGISTRY.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q),
    );
  }, [query]);

  const byCategory = new Map<string, typeof REGISTRY>();
  for (const item of filtered) {
    const list = byCategory.get(item.category) ?? [];
    list.push(item);
    byCategory.set(item.category, list);
  }

  return (
    <main className="min-h-screen bg-[#0b0e14] px-6 py-14 text-[#eef1f8]">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 flex items-center gap-2 text-sm font-semibold text-[#5b9dff]">
          <Sparkles size={16} />
          tech-learn v2 (beta)
        </div>
        <h1 className="mb-3 text-4xl font-bold tracking-tight">Explainers animados</h1>
        <p className="mb-8 max-w-2xl text-[#a7b0c4]">
          Motor de explicação dirigido por tempo: a mesma cena roda no player interativo e vira
          vídeo vertical, feed ou carrossel para redes sociais — sem duplicar nada.
        </p>

        <div className="mb-12 flex items-center gap-2 rounded-xl border border-[#232a3d] bg-[#131826] px-4 py-2.5">
          <Search size={16} className="text-[#6b7690]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por tema, categoria…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-[#6b7690]"
          />
        </div>

        {[...byCategory.entries()].map(([category, items]) => (
          <section key={category} className="mb-10">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[#a7b0c4]">{category}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {items.map((item) => (
                <div
                  key={item.slug}
                  className="group relative rounded-2xl border border-[#232a3d] bg-[#131826] p-5 transition hover:border-[#5b9dff]"
                >
                  <Link href={`/e/${item.slug}/`} className="block">
                    <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase text-[#6b7690]">
                      {item.level}
                      {visited.has(item.slug) ? (
                        <span className="inline-flex items-center gap-1 text-[#34d399]">
                          <Check size={12} /> visto
                        </span>
                      ) : null}
                    </div>
                    <h3 className="mb-1 text-lg font-bold">{item.title}</h3>
                    <p className="text-sm text-[#a7b0c4]">{item.subtitle}</p>
                  </Link>
                  <Link
                    href={`/studio/${item.slug}/`}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-[#5b9dff] opacity-0 transition group-hover:opacity-100"
                  >
                    <Wand2 size={12} /> ver formatos de export
                  </Link>
                </div>
              ))}
            </div>
          </section>
        ))}

        {filtered.length === 0 ? <p className="text-sm text-[#6b7690]">Nenhum explainer encontrado.</p> : null}
      </div>
    </main>
  );
}
