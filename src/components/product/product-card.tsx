import Link from "next/link";
import { Plus } from "lucide-react";

import type { Product } from "@/types/product";
import { formatPrice } from "@/constants/products";
import { ProductCover } from "@/components/product/product-cover";
import { AddToCartButton } from "@/components/product/add-to-cart-button";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group">
      <Link
        href={`/products/${product.slug}`}
        className="relative block overflow-hidden border border-white/[0.08] bg-[#0a0a0a] transition-colors duration-700 hover:border-gold-400/30"
      >
        <ProductCover product={product} />
        <span className="absolute left-5 top-5 text-[0.52rem] uppercase tracking-luxury text-mist/60">
          {product.family}
        </span>
        <span className="absolute bottom-5 right-5 flex size-11 items-center justify-center rounded-full border border-white/10 bg-black/40 opacity-0 backdrop-blur transition duration-500 group-hover:opacity-100">
          <Plus className="size-4" />
        </span>
      </Link>
      <div className="flex items-start justify-between gap-4 pt-5">
        <div>
          <Link href={`/products/${product.slug}`} className="font-display text-2xl text-ivory hover:text-gold-300">
            {product.name}
          </Link>
          <p className="mt-1 text-[0.58rem] uppercase tracking-luxury text-mist/50">
            {product.subtitle} · {product.size}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-ivory/80">{formatPrice(product.price)}</p>
          <AddToCartButton product={product} compact />
        </div>
      </div>
    </article>
  );
}
