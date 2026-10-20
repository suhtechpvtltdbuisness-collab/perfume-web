"use client";

import Link from "next/link";
import { Layers, Minus, Plus, Trash2 } from "lucide-react";

import { useCart } from "@/components/providers/cart-provider";
import { useSiteContent } from "@/components/providers/site-content-provider";
import { ProductThumbnail } from "@/components/product/product-thumbnail";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/constants/products";
import { CouponPanel } from "@/components/coupon/coupon-panel";
import { PriceSummary } from "@/components/cart/price-summary";

export function CartView() {
  const { items, subtotal, removeItem, updateQuantity } = useCart();
  const { products } = useSiteContent();

  if (items.length === 0) {
    return (
      <div className="border-y border-white/10 py-24 text-center">
        <p className="font-display text-4xl text-ivory">Your bag is beautifully empty.</p>
        <p className="mt-4 text-sm text-mist/75">Discover a fragrance made to remain.</p>
        <Button href="/shop" className="mt-8">Explore the collection</Button>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-14">
      <div>
      <div className="divide-y divide-white/10 border-y border-white/10">
        {items.map(({ product, quantity }) => {
          const hasDiscount = Boolean(product.originalPrice && product.originalPrice > product.price);
          const bundledNames = (product.comboItems ?? [])
            .map((item) => {
              const p = products.find((prod) => prod.id === item.productId);
              return p ? `${item.quantity > 1 ? `${item.quantity}x ` : ""}${p.name}` : null;
            })
            .filter(Boolean);

          return (
            <article key={product.id} className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-4 py-6 min-[380px]:grid-cols-[7rem_minmax(0,1fr)] min-[380px]:gap-5 sm:grid-cols-[10rem_minmax(0,1fr)_auto] sm:items-center sm:py-7">
              <Link href={`/products/${product.slug}`} className="block border border-white/10">
                <ProductThumbnail product={product} />
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-[0.62rem] uppercase tracking-luxury text-gold-300">{product.family}</p>
                  {product.isCombo && (
                    <span className="inline-flex items-center gap-1 rounded border border-gold-300/40 bg-gold-300/10 px-1.5 py-0.5 text-[0.58rem] font-semibold uppercase tracking-wider text-gold-300">
                      <Layers className="size-2.5" /> Combo Set
                    </span>
                  )}
                </div>
                <Link href={`/products/${product.slug}`} className="mt-2 block font-display text-2xl hover:text-gold-300 sm:text-3xl">
                  {product.name}
                </Link>
                <p className="mt-2 text-[0.62rem] uppercase tracking-luxury text-mist/70">
                  {product.subtitle} · {product.size}
                </p>
                {product.isCombo && bundledNames.length > 0 ? (
                  <p className="mt-2 text-xs text-mist/75">
                    <span className="text-gold-300/80 font-medium">Includes: </span>
                    {bundledNames.join(" + ")}
                  </p>
                ) : product.notes?.length > 0 ? (
                  <p className="mt-3 line-clamp-1 text-xs text-mist/75">
                    {product.notes.filter(Boolean).join(" · ")}
                  </p>
                ) : null}
                <div className="mt-4 flex items-baseline gap-2">
                  {hasDiscount && (
                    <span className="text-xs text-mist/60 line-through">
                      {formatPrice((product.originalPrice as number) * quantity)}
                    </span>
                  )}
                  <p className="text-sm text-ivory/80 font-medium">{formatPrice(product.price * quantity)}</p>
                </div>
              </div>
              <div className="col-span-2 flex items-center justify-between gap-5 sm:col-span-1 sm:flex-col sm:items-end">
                <div className="flex items-center border border-white/10">
                  <button aria-label="Decrease quantity" onClick={() => updateQuantity(product.id, quantity - 1)} className="p-3 text-mist hover:text-ivory"><Minus className="size-3" /></button>
                  <span className="min-w-8 text-center text-xs">{quantity}</span>
                  <button aria-label="Increase quantity" onClick={() => updateQuantity(product.id, quantity + 1)} className="p-3 text-mist hover:text-ivory"><Plus className="size-3" /></button>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-sm text-ivory/70">{formatPrice(product.price * quantity)}</p>
                  <button aria-label={`Remove ${product.name}`} onClick={() => removeItem(product.id)} className="p-2 text-mist/70 hover:text-ivory">
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <div className="mt-8"><CouponPanel /></div>
      </div>
      <aside className="h-fit border border-white/10 bg-white/[0.025] p-7">
        <h2 className="font-display text-3xl">Order summary</h2>
        <PriceSummary subtotal={subtotal} />
        <Button href="/checkout" className="w-full">Proceed to checkout</Button>
        <p className="mt-5 text-center text-[0.6rem] uppercase tracking-editorial text-mist/75">Secure encrypted checkout</p>
      </aside>
    </div>
  );
}
