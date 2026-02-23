import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Human Sauce Lab | Domine as Ferramentas que Geram Resultado",
  description:
    "Curso de automação de design e faturamento rápido. Aprenda a dominar ferramentas que transformam seu negócio.",
  keywords: ["design", "automação", "faturamento", "curso", "human sauce lab"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="font-sans antialiased bg-black text-white overflow-hidden">
        {children}
      </body>
    </html>
  );
}
