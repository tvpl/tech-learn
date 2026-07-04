import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "tech-learn v2",
  description: "Explainers animados — motor dirigido por tempo, web + vídeo social",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
