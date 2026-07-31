"use client";

import type { Product } from "@/types/product";
import { useCart } from "@/components/providers/cart-provider";
import { Button } from "@/components/ui/button";

export function AddToCartButton({
  product,
  compact = false,
}: {
  product: Product;
  compact?: boolean;
}) {
  const { addItem } = useCart();

  if (compact) {
    return (
      <button
        type="button"
        onClick={() => addItem(product)}
        className="mt-2 text-[0.52rem] uppercase tracking-luxury text-gold-300/70 transition-colors hover:text-gold-300"
      >
        Add to bag
      </button>
    );
  }

  return (
    <Button type="button" onClick={() => addItem(product)} className="w-full sm:w-auto">
      Add to bag
    </Button>
  );
}
