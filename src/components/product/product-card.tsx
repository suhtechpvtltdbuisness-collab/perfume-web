import Link from "next/link";
import { Plus } from "lucide-react";

import type { Product } from "@/types/product";
import { formatPrice } from "@/constants/products";
import { ProductCover } from "@/components/product/product-cover";
import { AddToCartButton } from "@/components/product/add-to-cart-button";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex h-full min-w-0 flex-col">
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[4/5] w-full shrink-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0a0a] transition-colors duration-700 hover:border-gold-400/30"
      >
        <ProductCover product={product} className="h-full w-full" />
        <span className="absolute left-4 top-4 max-w-[75%] bg-black/30 px-2.5 py-1.5 text-[0.62rem] uppercase tracking-luxury text-mist/75 backdrop-blur-sm sm:left-5 sm:top-5">
          {product.family}
        </span>
        <span className="absolute bottom-5 right-5 flex size-11 items-center justify-center rounded-full border border-white/10 bg-black/40 opacity-0 backdrop-blur transition duration-500 group-hover:opacity-100">
          <Plus className="size-4" />
        </span>
      </Link>
      <div className="grid flex-1 grid-cols-[minmax(0,1fr)_auto] gap-4 border-b border-white/[0.08] pb-6 pt-5">
        <div className="min-w-0">
          <Link href={`/products/${product.slug}`} className="line-clamp-1 font-display text-2xl text-ivory transition-colors hover:text-gold-300 sm:text-3xl">
            {product.name}
          </Link>
          <p className="mt-2 line-clamp-1 text-[0.62rem] uppercase tracking-[0.18em] text-mist/75">
            {product.subtitle} · {product.size}
          </p>
        </div>
        <div className="flex min-w-[5.5rem] flex-col items-end justify-between text-right">
          <p className="whitespace-nowrap text-xs text-ivory/80">{formatPrice(product.price)}</p>
          <AddToCartButton product={product} compact />
        </div>
      </div>
    </article>
  );
}
