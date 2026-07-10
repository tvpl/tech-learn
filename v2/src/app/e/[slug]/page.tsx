import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { REGISTRY, loaderFor } from "@/content/index";
import { withBase } from "@/lib/basePath";
import { Player } from "@/player/Player";

export function generateStaticParams() {
  return REGISTRY.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const meta = REGISTRY.find((e) => e.slug === slug);
  if (!meta) return {};
  const image = withBase(`/preview/${slug}.png`);
  return {
    title: `${meta.title} · tech-learn`,
    description: meta.subtitle,
    openGraph: { title: meta.title, description: meta.subtitle, images: [image] },
    twitter: { card: "summary_large_image", title: meta.title, description: meta.subtitle, images: [image] },
  };
}

export default async function ExplainerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const loader = loaderFor(slug);
  if (!loader) notFound();
  const explainer = await loader();
  return <Player explainer={explainer} />;
}
