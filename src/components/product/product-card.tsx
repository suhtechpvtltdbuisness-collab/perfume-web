import Link from "next/link";
import { Plus } from "lucide-react";

import type { Product } from "@/types/product";
import { formatPrice } from "@/constants/products";
import { ProductCover } from "@/components/product/product-cover";
import { AddToCartButton } from "@/components/product/add-to-cart-button";

export function ProductCard({ product }: { product: Product }) {
  const hasDiscount =
    Boolean(product.originalPrice && product.originalPrice > product.price);
  const discountPercent = hasDiscount
    ? Math.round(
        (((product.originalPrice as number) - product.price) /
          (product.originalPrice as number)) *
          100,
      )
    : 0;

  return (
    <article className="group flex h-full min-w-0 flex-col">
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[4/5] w-full shrink-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0a0a] transition-colors duration-700 hover:border-gold-400/30"
      >
        <ProductCover product={product} className="h-full w-full" />
        <span className="absolute left-4 top-4 max-w-[75%] bg-black/40 px-2.5 py-1.5 text-[0.62rem] uppercase tracking-luxury text-mist/90 backdrop-blur-sm sm:left-5 sm:top-5">
          {product.isCombo ? "Combo Set" : product.family}
        </span>
        {hasDiscount && (
          <span className="absolute right-4 top-4 rounded bg-gold-300 px-2 py-1 text-[0.58rem] font-bold uppercase tracking-wider text-black shadow-md sm:right-5 sm:top-5">
            Save {discountPercent}%
          </span>
        )}
        <span className="absolute bottom-5 right-5 flex size-11 items-center justify-center rounded-full border border-white/10 bg-black/40 opacity-0 backdrop-blur transition duration-500 group-hover:opacity-100">
          <Plus className="size-4" />
        </span>
      </Link>
      <div className="grid flex-1 grid-cols-1 gap-3 border-b border-white/[0.08] pb-5 pt-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-4 sm:pb-6 sm:pt-5">
        <div className="min-w-0">
          <Link href={`/products/${product.slug}`} className="line-clamp-1 font-display text-xl text-ivory transition-colors hover:text-gold-300 sm:text-3xl">
            {product.name}
          </Link>
          <p className="mt-2 line-clamp-1 text-[0.62rem] uppercase tracking-[0.18em] text-mist/75">
            {product.subtitle} · {product.size}
          </p>
        </div>
        <div className="flex min-w-0 items-center justify-between gap-2 sm:min-w-[5.5rem] sm:flex-col sm:items-end sm:text-right">
          <div className="flex items-baseline gap-1.5 sm:flex-col sm:items-end sm:gap-0">
            {hasDiscount && (
              <span className="text-[0.68rem] text-mist/60 line-through">
                {formatPrice(product.originalPrice as number)}
              </span>
            )}
            <p className="whitespace-nowrap text-xs text-ivory/80 font-medium">{formatPrice(product.price)}</p>
          </div>
          <AddToCartButton product={product} compact />
        </div>
      </div>
    </article>
  );
}
