/** Prefixa uma URL com o basePath do Next (vazio localmente, "/tech-learn/v2" no Pages). */
export function withBase(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  if (!path.startsWith("/")) return path;
  return `${base}${path}`;
}
