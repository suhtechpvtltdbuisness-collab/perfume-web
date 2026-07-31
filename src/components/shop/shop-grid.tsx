"use client";

import { useMemo, useState } from "react";

import { ProductCard } from "@/components/product/product-card";
import { cn } from "@/lib/utils";
import { useSiteContent } from "@/components/providers/site-content-provider";

const filters = ["All", "Woody", "Floral", "Amber", "Marine"] as const;

export function ShopGrid() {
  const [active, setActive] = useState<(typeof filters)[number]>("All");
  const { products } = useSiteContent();
  const visible = useMemo(
    () =>
      active === "All"
        ? products
        : products.filter((product) => product.family.includes(active)),
    [active, products],
  );

  return (
    <>
      <div className="flex flex-wrap gap-2 border-y border-white/10 py-5">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActive(filter)}
            className={cn(
              "border px-5 py-2.5 text-[0.52rem] uppercase tracking-luxury transition",
              active === filter
                ? "border-gold-300 bg-gold-300 text-ink"
                : "border-white/10 text-mist/55 hover:border-white/30 hover:text-ivory",
            )}
          >
            {filter}
          </button>
        ))}
      </div>
      <div className="mt-12 grid gap-x-6 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
    </>
  );
}
