import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Cacau Show - Desenhe e Ganhe",
  description:
    "Campanha de Páscoa da Cacau Show - Desenhe um ovo de Páscoa e desbloqueie seu presente!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={` ${poppins.variable} antialiased`}>{children}</body>
    </html>
  );
}
