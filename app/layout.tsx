import type { Metadata } from "next";
import "../styles/globals.css";
import { RootShell } from "../components/RootShell";

export const metadata: Metadata = {
  title: "Pessoas Desaparecidas - MT",
  description:
    "Sistema oficial de busca por pessoas desaparecidas da Polícia Civil do MT",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <RootShell>{children}</RootShell>
      </body>
    </html>
  );
}
