import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

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
  themeColor: "#5a3825",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className="bg-primary">
      <body className={` ${poppins.variable} antialiased bg-primary`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
