"use client";

import Link from "next/link";
import { Check, Layers, Sparkles } from "lucide-react";

import { useSiteContent } from "@/components/providers/site-content-provider";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { ProductCard } from "@/components/product/product-card";
import { ProductThumbnail } from "@/components/product/product-thumbnail";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { formatPrice } from "@/constants/products";
import { ProductMediaGallery } from "@/components/product/product-media-gallery";
import { ProductCoupons } from "@/components/coupon/product-coupons";
import type { Product } from "@/types/product";

export function ProductDetailView({ slug }: { slug: string }) {
  const { products } = useSiteContent();
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
        <p className="font-display text-5xl">This fragrance is no longer available.</p>
        <Button href="/shop" className="mt-8">Return to collection</Button>
      </div>
    );
  }

  const bundledProducts = (product.comboItems ?? [])
    .map((item) => ({
      ...item,
      details: products.find((p) => p.id === item.productId),
    }))
    .filter((item): item is typeof item & { details: Product } => Boolean(item.details));

  const hasDiscount = Boolean(product.originalPrice && product.originalPrice > product.price);
  const discountPercent = hasDiscount
    ? Math.round(
        (((product.originalPrice as number) - product.price) /
          (product.originalPrice as number)) *
          100,
      )
    : 0;

  return (
    <div className="bg-ink pb-24 pt-24 sm:pb-32">
      <Container className="grid max-w-[1480px] gap-12 py-10 sm:py-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(23rem,0.9fr)] lg:items-center lg:gap-14 xl:gap-20">
        <ProductMediaGallery product={product} />
        <div className="mx-auto w-full max-w-xl lg:mx-0">
          <div className="flex items-center gap-2">
            <p className="text-[0.68rem] uppercase tracking-luxury text-gold-300">{product.family}</p>
            {product.isCombo && (
              <span className="inline-flex items-center gap-1 rounded border border-gold-300/40 bg-gold-300/10 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider text-gold-300">
                <Layers className="size-3" /> Curated Combo Set
              </span>
            )}
          </div>
          <h1 className="mt-4 text-balance font-display text-5xl leading-[0.9] tracking-[-0.045em] sm:text-6xl xl:text-7xl">{product.name}</h1>
          <p className="mt-4 text-[0.62rem] uppercase leading-5 tracking-luxury text-mist/70">{product.subtitle} · {product.size}</p>
          <p className="mt-6 max-w-lg text-base leading-7 text-mist/80 sm:mt-7">{product.description}</p>

          {/* Combo Bundled Items Section */}
          {product.isCombo && bundledProducts.length > 0 && (
            <div className="mt-7 rounded-xl border border-gold-300/30 bg-gold-300/[0.04] p-5">
              <div className="flex items-center justify-between pb-3 border-b border-gold-300/20">
                <span className="text-[0.65rem] font-semibold uppercase tracking-luxury text-gold-300 flex items-center gap-1.5">
                  <Sparkles className="size-3.5" /> What&apos;s inside this set
                </span>
                <span className="text-xs text-mist/70">
                  {bundledProducts.length} full-size fragrances
                </span>
              </div>
              <div className="mt-4 space-y-3">
                {bundledProducts.map(({ details, quantity }) => (
                  <div
                    key={details.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/40 p-3 text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="size-12 shrink-0 overflow-hidden rounded border border-white/10 bg-black">
                        <ProductThumbnail product={details} />
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/products/${details.slug}`}
                          className="font-display text-sm text-ivory hover:text-gold-300 transition truncate block"
                        >
                          {details.name}
                        </Link>
                        <p className="text-[0.65rem] text-mist/70 uppercase tracking-editorial">
                          {quantity > 1 ? `${quantity}x · ` : ""}{details.subtitle} · {details.size}
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 text-right text-xs font-medium text-ivory/80">
                      {formatPrice(details.price * quantity)}
                    </span>
                  </div>
                ))}
              </div>
              {hasDiscount && (
                <div className="mt-4 pt-3 border-t border-gold-300/20 flex items-center justify-between text-xs">
                  <span className="text-mist/75">Combined Value:</span>
                  <span className="text-mist/60 line-through">
                    {formatPrice(product.originalPrice as number)}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="mt-7 border-y border-white/10 py-6 sm:mt-8">
            <p className="text-[0.62rem] uppercase tracking-luxury text-gold-400">
              {product.isCombo ? "Key Fragrance Notes" : "Olfactory notes"}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {product.notes.map((note, index) => <span key={`${note}-${index}`} className="border border-white/10 px-3.5 py-2 text-[0.65rem] uppercase tracking-editorial text-mist/85">{note}</span>)}
            </div>
          </div>
          <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-baseline gap-3">
              {hasDiscount && (
                <span className="text-xl text-mist/55 line-through">
                  {formatPrice(product.originalPrice as number)}
                </span>
              )}
              <p className="font-display text-3xl text-ivory">{formatPrice(product.price)}</p>
              {hasDiscount && (
                <span className="rounded bg-gold-300 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-black">
                  Save {discountPercent}%
                </span>
              )}
            </div>
            <AddToCartButton product={product} />
          </div>
          <ProductCoupons product={product} />
          <ul className="mt-7 space-y-3 text-[0.65rem] uppercase leading-5 tracking-editorial text-mist/75">
            <li className="flex items-center gap-3"><Check className="size-3 text-gold-300" /> Complimentary delivery across India</li>
            <li className="flex items-center gap-3"><Check className="size-3 text-gold-300" /> Two samples with every order</li>
          </ul>
        </div>
      </Container>
      <Container className="max-w-[1480px] pt-20 sm:pt-24">
        <p className="text-[0.68rem] uppercase tracking-luxury text-gold-300">You may also like</p>
        <div className="mt-8 grid auto-rows-fr grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
          {products.filter((item) => item.id !== product.id).slice(0, 3).map((item) => <ProductCard key={item.id} product={item} />)}
        </div>
      </Container>
    </div>
  );
}
