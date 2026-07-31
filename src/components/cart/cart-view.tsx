"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";

import { useCart } from "@/components/providers/cart-provider";
import { BottleArt } from "@/components/ui/bottle-art";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/constants/products";

export function CartView() {
  const { items, subtotal, removeItem, updateQuantity } = useCart();

  if (items.length === 0) {
    return (
      <div className="border-y border-white/10 py-24 text-center">
        <p className="font-display text-4xl text-ivory">Your bag is beautifully empty.</p>
        <p className="mt-4 text-sm text-mist/55">Discover a fragrance made to remain.</p>
        <Button href="/shop" className="mt-8">Explore the collection</Button>
      </div>
    );
  }

  return (
    <div className="grid gap-14 lg:grid-cols-[1fr_22rem]">
      <div className="divide-y divide-white/10 border-y border-white/10">
        {items.map(({ product, quantity }) => (
          <article key={product.id} className="grid grid-cols-[7rem_1fr] gap-5 py-7 sm:grid-cols-[10rem_1fr]">
            <BottleArt accent={product.accent} name={product.name} className="bg-[#080808]" />
            <div className="flex flex-col justify-between sm:flex-row sm:items-center">
              <div>
                <Link href={`/products/${product.slug}`} className="font-display text-2xl hover:text-gold-300">
                  {product.name}
                </Link>
                <p className="mt-2 text-[0.52rem] uppercase tracking-luxury text-mist/45">{product.size}</p>
                <p className="mt-4 text-xs text-ivory/75">{formatPrice(product.price)}</p>
              </div>
              <div className="mt-5 flex items-center gap-5 sm:mt-0">
                <div className="flex items-center border border-white/10">
                  <button aria-label="Decrease quantity" onClick={() => updateQuantity(product.id, quantity - 1)} className="p-3 text-mist hover:text-ivory"><Minus className="size-3" /></button>
                  <span className="min-w-8 text-center text-xs">{quantity}</span>
                  <button aria-label="Increase quantity" onClick={() => updateQuantity(product.id, quantity + 1)} className="p-3 text-mist hover:text-ivory"><Plus className="size-3" /></button>
                </div>
                <button aria-label={`Remove ${product.name}`} onClick={() => removeItem(product.id)} className="p-2 text-mist/45 hover:text-ivory">
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      <aside className="h-fit border border-white/10 bg-white/[0.025] p-7">
        <h2 className="font-display text-3xl">Order summary</h2>
        <div className="mt-7 space-y-4 border-y border-white/10 py-6 text-xs text-mist/65">
          <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
          <div className="flex justify-between"><span>Delivery</span><span>Complimentary</span></div>
        </div>
        <div className="flex justify-between py-6 font-display text-xl"><span>Total</span><span>{formatPrice(subtotal)}</span></div>
        <Button href="/checkout" className="w-full">Proceed to checkout</Button>
        <p className="mt-5 text-center text-[0.5rem] uppercase tracking-editorial text-mist/35">Secure encrypted checkout</p>
      </aside>
    </div>
  );
}
