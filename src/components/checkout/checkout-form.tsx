"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, LockKeyhole } from "lucide-react";

import { useCart } from "@/components/providers/cart-provider";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/constants/products";

export function CheckoutForm() {
  const { items, subtotal, clearCart } = useCart();
  const [complete, setComplete] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearCart();
    setComplete(true);
  };

  if (complete) {
    return (
      <div className="mx-auto max-w-2xl py-16 text-center">
        <CheckCircle2 className="mx-auto size-12 text-gold-300" />
        <h2 className="mt-7 font-display text-6xl">Thank you.</h2>
        <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-mist/60">
          Your demo order has been placed. Payment and order APIs can be connected when your commerce backend is ready.
        </p>
        <Button href="/shop" className="mt-9">Return to collection</Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="font-display text-4xl">Add a fragrance before checkout.</p>
        <Button href="/shop" className="mt-7">Explore collection</Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-14 lg:grid-cols-[1fr_22rem]">
      <div className="space-y-12">
        <CheckoutSection title="Contact">
          <Field id="checkout-email" label="Email address" type="email" wide />
        </CheckoutSection>
        <CheckoutSection title="Delivery address">
          <Field id="first-name" label="First name" />
          <Field id="last-name" label="Last name" />
          <Field id="address" label="Address" wide />
          <Field id="city" label="City" />
          <Field id="postal-code" label="Postal code" />
          <Field id="phone" label="Phone" type="tel" wide />
        </CheckoutSection>
        <CheckoutSection title="Payment">
          <div className="col-span-full flex items-center gap-3 border border-white/10 bg-white/[0.025] p-4 text-xs text-mist/60">
            <LockKeyhole className="size-4 text-gold-300" />
            Secure demo payment form
          </div>
          <Field id="card" label="Card number" wide />
          <Field id="expiry" label="Expiry date" />
          <Field id="cvv" label="CVV" />
        </CheckoutSection>
      </div>
      <aside className="h-fit border border-white/10 bg-white/[0.025] p-7 lg:sticky lg:top-32">
        <h2 className="font-display text-3xl">Your order</h2>
        <div className="mt-6 divide-y divide-white/10 border-y border-white/10">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="flex justify-between gap-4 py-4 text-xs">
              <span className="text-mist/65">{product.name} × {quantity}</span>
              <span>{formatPrice(product.price * quantity)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between py-6 font-display text-xl"><span>Total</span><span>{formatPrice(subtotal)}</span></div>
        <Button type="submit" className="w-full">Place order</Button>
      </aside>
    </form>
  );
}

function CheckoutSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="font-display text-3xl">{title}</legend>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

function Field({ id, label, type = "text", wide = false }: { id: string; label: string; type?: string; wide?: boolean }) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <label htmlFor={id} className="mb-2 block text-[0.5rem] uppercase tracking-luxury text-mist/50">{label}</label>
      <input id={id} name={id} type={type} required className="h-14 w-full border border-white/10 bg-white/[0.025] px-4 text-sm outline-none transition focus:border-gold-300/60" />
    </div>
  );
}
