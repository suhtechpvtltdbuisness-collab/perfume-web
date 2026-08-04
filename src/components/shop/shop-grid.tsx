"use client";

import { useMemo, useState } from "react";

import { ProductCard } from "@/components/product/product-card";
import { cn } from "@/lib/utils";
import { useSiteContent } from "@/components/providers/site-content-provider";
import { Button } from "@/components/ui/button";

const baseFilters = ["All", "Woody", "Floral", "Amber", "Marine"] as const;

export function ShopGrid() {
  const [active, setActive] = useState<string>("All");
  const { products, productsLoading } = useSiteContent();

  const filters = useMemo(() => {
    const present = new Set<string>();
    for (const product of products) {
      for (const label of baseFilters.slice(1)) {
        if (product.family.includes(label)) present.add(label);
      }
    }
    return ["All", ...baseFilters.slice(1).filter((label) => present.has(label))];
  }, [products]);

  const visible = useMemo(
    () =>
      active === "All"
        ? products
        : products.filter((product) => product.family.includes(active)),
    [active, products],
  );

  if (productsLoading) {
    return (
      <div className="border-y border-white/10 py-24 text-center text-sm text-mist/50">
        Loading the collection…
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="border-y border-white/10 py-24 text-center">
        <p className="font-display text-4xl text-ivory">The collection is being composed.</p>
        <p className="mt-4 text-sm text-mist/55">New fragrances will appear here once published from the admin dashboard.</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-5 border-y border-white/10 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
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
        <p className="shrink-0 text-[0.52rem] uppercase tracking-luxury text-mist/40">
          {visible.length} {visible.length === 1 ? "fragrance" : "fragrances"}
        </p>
      </div>

      {visible.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-sm text-mist/55">No fragrances in this family yet.</p>
          <Button type="button" variant="outline" className="mt-6" onClick={() => setActive("All")}>
            View all
          </Button>
        </div>
      ) : (
        <div className="mt-10 grid auto-rows-fr gap-x-5 gap-y-12 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-7 xl:gap-y-16">
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  );
}
