import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";

import { SiteShell } from "@/components/layout/site-shell";
import { NoiseLayer } from "@/components/ui/noise-layer";

import "@/styles/globals.css";

const displayFont = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const sansFont = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://maisonaurelia.com"),
  title: {
    default: "Maison Aurélia — Haute Parfumerie",
    template: "%s | Maison Aurélia",
  },
  description:
    "An olfactory house devoted to rare materials, timeless rituals, and the art of quiet luxury.",
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${displayFont.variable} ${sansFont.variable}`}>
      <body className="bg-ink font-sans text-ivory antialiased">
        <SiteShell>{children}</SiteShell>
        <NoiseLayer />
      </body>
    </html>
  );
}
