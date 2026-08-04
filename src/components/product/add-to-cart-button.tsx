"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";

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
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const timer = window.setTimeout(() => setAdded(false), 1600);
    return () => window.clearTimeout(timer);
  }, [added]);

  const add = () => {
    addItem(product);
    setAdded(true);
  };

  if (compact) {
    return (
      <>
        <button
          type="button"
          onClick={add}
          aria-label={added ? `${product.name} added to bag` : `Add ${product.name} to bag`}
          className="mt-2 inline-flex min-h-7 items-center gap-1.5 text-[0.52rem] uppercase tracking-luxury text-gold-300/70 transition-colors hover:text-gold-300"
        >
          {added && <Check className="size-3" />}
          {added ? "Added" : "Add to bag"}
        </button>
        <CartToast productName={product.name} visible={added} />
      </>
    );
  }

  return (
    <>
      <Button type="button" onClick={add} className="w-full sm:w-auto" aria-label={added ? `${product.name} added to bag` : undefined}>
        {added && <Check className="size-3.5" />}
        {added ? "Added to bag" : "Add to bag"}
      </Button>
      <CartToast productName={product.name} visible={added} />
    </>
  );
}

function CartToast({ productName, visible }: { productName: string; visible: boolean }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-none fixed bottom-5 left-1/2 z-[180] w-[calc(100%-2.5rem)] max-w-sm -translate-x-1/2 transition-all duration-500 sm:bottom-8 sm:left-auto sm:right-8 sm:w-auto sm:min-w-80 sm:translate-x-0 ${
        visible ? "translate-y-0 opacity-100" : "invisible translate-y-4 opacity-0"
      }`}
    >
      <div className="flex items-center gap-4 rounded-xl border border-gold-300/30 bg-obsidian/95 px-5 py-4 shadow-[0_20px_70px_rgba(0,0,0,0.65)] backdrop-blur-xl">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gold-300 text-ink">
          <Check className="size-4" />
        </span>
        <span className="min-w-0">
          <span className="block truncate font-display text-lg text-ivory">{productName}</span>
          <span className="mt-0.5 block text-[0.5rem] uppercase tracking-luxury text-gold-300/70">Added to your bag</span>
        </span>
      </div>
    </div>
  );
}
