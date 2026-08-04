"use client";

import { Check } from "lucide-react";

import { useSiteContent } from "@/components/providers/site-content-provider";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { formatPrice } from "@/constants/products";
import { ProductMediaGallery } from "@/components/product/product-media-gallery";

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

  return (
    <div className="bg-ink pb-24 pt-24 sm:pb-32">
      <Container className="grid max-w-[1480px] gap-12 py-10 sm:py-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(23rem,0.9fr)] lg:items-center lg:gap-14 xl:gap-20">
        <ProductMediaGallery product={product} />
        <div className="mx-auto w-full max-w-xl lg:mx-0">
          <p className="text-[0.58rem] uppercase tracking-luxury text-gold-300">{product.family}</p>
          <h1 className="mt-4 text-balance font-display text-5xl leading-[0.9] tracking-[-0.045em] sm:text-6xl xl:text-7xl">{product.name}</h1>
          <p className="mt-4 text-[0.62rem] uppercase leading-5 tracking-luxury text-mist/45">{product.subtitle} · {product.size}</p>
          <p className="mt-6 max-w-lg text-sm leading-7 text-mist/65 sm:mt-7">{product.description}</p>
          <div className="mt-7 border-y border-white/10 py-6 sm:mt-8">
            <p className="text-[0.52rem] uppercase tracking-luxury text-gold-400">Olfactory notes</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {product.notes.map((note, index) => <span key={`${note}-${index}`} className="border border-white/10 px-3.5 py-2 text-[0.55rem] uppercase tracking-editorial text-mist/70">{note}</span>)}
            </div>
          </div>
          <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-display text-3xl text-ivory">{formatPrice(product.price)}</p>
            <AddToCartButton product={product} />
          </div>
          <ul className="mt-7 space-y-3 text-[0.55rem] uppercase leading-5 tracking-editorial text-mist/50">
            <li className="flex items-center gap-3"><Check className="size-3 text-gold-300" /> Complimentary delivery across India</li>
            <li className="flex items-center gap-3"><Check className="size-3 text-gold-300" /> Two samples with every order</li>
          </ul>
        </div>
      </Container>
      <Container className="max-w-[1480px] pt-20 sm:pt-24">
        <p className="text-[0.58rem] uppercase tracking-luxury text-gold-300">You may also like</p>
        <div className="mt-8 grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.filter((item) => item.id !== product.id).slice(0, 3).map((item) => <ProductCard key={item.id} product={item} />)}
        </div>
      </Container>
    </div>
  );
}
