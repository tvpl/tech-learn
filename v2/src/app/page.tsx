import Link from "next/link";
import { Sparkles } from "lucide-react";
import { REGISTRY } from "@/content/index";

export default function Home() {
  const byCategory = new Map<string, typeof REGISTRY>();
  for (const item of REGISTRY) {
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
        <p className="mb-12 max-w-2xl text-[#a7b0c4]">
          Motor de explicação dirigido por tempo: a mesma cena roda no player interativo e vira
          vídeo vertical, feed ou carrossel para redes sociais — sem duplicar nada.
        </p>

        {[...byCategory.entries()].map(([category, items]) => (
          <section key={category} className="mb-10">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[#a7b0c4]">{category}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {items.map((item) => (
                <Link
                  key={item.slug}
                  href={`/e/${item.slug}/`}
                  className="rounded-2xl border border-[#232a3d] bg-[#131826] p-5 transition hover:border-[#5b9dff]"
                >
                  <div className="mb-2 text-xs font-medium uppercase text-[#6b7690]">{item.level}</div>
                  <h3 className="mb-1 text-lg font-bold">{item.title}</h3>
                  <p className="text-sm text-[#a7b0c4]">{item.subtitle}</p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
