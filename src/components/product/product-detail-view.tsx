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
    <div className="bg-ink pb-32 pt-24">
      <Container className="grid min-h-[calc(100vh-6rem)] gap-12 py-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <ProductMediaGallery product={product} />
        <div className="lg:px-10">
          <p className="text-[0.58rem] uppercase tracking-luxury text-gold-300">{product.family}</p>
          <h1 className="mt-5 font-display text-6xl leading-[0.9] tracking-[-0.045em] sm:text-8xl">{product.name}</h1>
          <p className="mt-4 text-xs uppercase tracking-luxury text-mist/45">{product.subtitle} · {product.size}</p>
          <p className="mt-8 max-w-lg text-sm leading-7 text-mist/65">{product.description}</p>
          <div className="mt-9 border-y border-white/10 py-7">
            <p className="text-[0.52rem] uppercase tracking-luxury text-gold-400">Olfactory notes</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {product.notes.map((note) => <span key={note} className="border border-white/10 px-4 py-2 text-[0.58rem] uppercase tracking-editorial text-mist/70">{note}</span>)}
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-display text-3xl text-ivory">{formatPrice(product.price)}</p>
            <AddToCartButton product={product} />
          </div>
          <ul className="mt-8 space-y-3 text-[0.6rem] uppercase tracking-editorial text-mist/50">
            <li className="flex items-center gap-3"><Check className="size-3 text-gold-300" /> Complimentary delivery across India</li>
            <li className="flex items-center gap-3"><Check className="size-3 text-gold-300" /> Two samples with every order</li>
          </ul>
        </div>
      </Container>
      <Container className="pt-24">
        <p className="text-[0.58rem] uppercase tracking-luxury text-gold-300">You may also like</p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {products.filter((item) => item.id !== product.id).slice(0, 3).map((item) => <ProductCard key={item.id} product={item} />)}
        </div>
      </Container>
    </div>
  );
}
