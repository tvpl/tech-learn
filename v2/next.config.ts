import path from "node:path";
import type { NextConfig } from "next";

// No GitHub Pages o site é servido em /<repo>/v2/ — o basePath só entra no CI
// (ou quando NEXT_PUBLIC_BASE_PATH for definido manualmente para testar local).
const basePath =
  process.env.NEXT_PUBLIC_BASE_PATH ??
  (process.env.GITHUB_ACTIONS ? "/tech-learn/v2" : "");

const nextConfig: NextConfig = {
  output: "export",
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  // v2/ é um pacote independente, mas o lockfile da v1 na raiz do repo faz o
  // Next inferir errado a raiz do "workspace" — fixamos explicitamente.
  outputFileTracingRoot: path.resolve(__dirname),
};

export default nextConfig;
