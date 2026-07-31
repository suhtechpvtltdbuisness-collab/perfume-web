import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { ShopGrid } from "@/components/shop/shop-grid";

export const metadata: Metadata = {
  title: "The Collection",
  description: "Discover the complete Maison Aurélia fragrance collection.",
};

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-ink pb-32 pt-36 sm:pt-44">
      <Container>
        <div className="grid gap-8 pb-16 lg:grid-cols-[1fr_0.55fr] lg:items-end">
          <div>
            <p className="text-[0.58rem] uppercase tracking-[0.42em] text-gold-300">La collection</p>
            <h1 className="mt-5 font-display text-7xl leading-[0.84] tracking-[-0.05em] sm:text-9xl">
              The art of <span className="italic text-gold-300">scent.</span>
            </h1>
          </div>
          <p className="max-w-md text-sm leading-7 text-mist/60 lg:justify-self-end">
            Six compositions built from exceptional materials. Presented here as demo products, ready to be replaced with your final catalogue.
          </p>
        </div>
        <ShopGrid />
      </Container>
    </div>
  );
}
