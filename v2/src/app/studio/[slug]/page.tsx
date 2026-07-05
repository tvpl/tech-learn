import { notFound } from "next/navigation";
import { REGISTRY, loaderFor } from "@/content/index";
import { StudioView } from "@/studio/StudioView";

export function generateStaticParams() {
  return REGISTRY.map((e) => ({ slug: e.slug }));
}

export default async function StudioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const loader = loaderFor(slug);
  if (!loader) notFound();
  const explainer = await loader();
  return <StudioView explainer={explainer} />;
}
