import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { ShopGrid } from "@/components/shop/shop-grid";

export const metadata: Metadata = {
  title: "The Collection",
  description: "Discover the complete Autoroma fragrance collection.",
};

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-ink pb-24 pt-32 sm:pb-32 sm:pt-44">
      <Container>
        <div className="grid gap-8 pb-16 lg:grid-cols-[1fr_0.55fr] lg:items-end">
          <div>
            <p className="text-[0.58rem] uppercase tracking-[0.42em] text-gold-300">La collection</p>
            <h1 className="mt-5 text-balance font-display text-6xl leading-[0.88] tracking-[-0.05em] sm:text-8xl xl:text-9xl">
              The art of <span className="italic text-gold-300">scent.</span>
            </h1>
          </div>
          <p className="max-w-md text-sm leading-7 text-mist/60 lg:justify-self-end">
            Every composition from the maison, drawn live from the catalogue. Filter by olfactory family and discover the scent that remains.
          </p>
        </div>
        <ShopGrid />
      </Container>
    </div>
  );
}
