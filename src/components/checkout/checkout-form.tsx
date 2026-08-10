"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, LockKeyhole } from "lucide-react";

import { useAuth } from "@/components/providers/auth-provider";
import { useCart } from "@/components/providers/cart-provider";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/constants/products";
import { CouponPanel } from "@/components/coupon/coupon-panel";
import { PriceSummary } from "@/components/cart/price-summary";
import { useCoupons } from "@/components/providers/coupon-provider";
import { orderApi } from "@/lib/order-api";
import { loadRazorpay } from "@/lib/razorpay";
import type { Order } from "@/types/order";

export function CheckoutForm() {
  const { items, subtotal, clearCart } = useCart();
  const { accessToken, user } = useAuth();
  const { appliedCoupon, completeCouponRedemption } = useCoupons();
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (processing) return;

    const form = new FormData(event.currentTarget);
    const read = (name: string) => String(form.get(name) ?? "").trim();

    const customer = {
      email: read("checkout-email"),
      firstName: read("first-name"),
      lastName: read("last-name"),
      phone: read("phone"),
    };
    const shippingAddress = {
      address: read("address"),
      city: read("city"),
      postalCode: read("postal-code"),
    };

    setProcessing(true);
    setError(null);

    try {
      const { order, razorpay } = await orderApi.create(
        {
          items: items.map(({ product, quantity }) => ({
            perfumeId: product.id,
            quantity,
          })),
          couponCode: appliedCoupon?.code ?? null,
          customer,
          shippingAddress,
        },
        accessToken,
      );

      const Razorpay = await loadRazorpay();
      const checkout = new Razorpay({
        key: razorpay.key,
        amount: razorpay.amount,
        currency: razorpay.currency,
        name: "Autoroma",
        description: `Order ${order.id}`,
        order_id: razorpay.orderId,
        prefill: {
          name: `${customer.firstName} ${customer.lastName}`.trim(),
          email: customer.email,
          contact: customer.phone,
        },
        theme: { color: "#c8a96b" },
        handler: (response) => {
          void (async () => {
            try {
              const paid = await orderApi.verify(
                {
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                },
                accessToken,
              );
              await completeCouponRedemption(true);
              clearCart();
              setPlacedOrder(paid);
            } catch (verifyError) {
              setError(
                verifyError instanceof Error
                  ? verifyError.message
                  : "We could not confirm your payment. Please contact support.",
              );
            } finally {
              setProcessing(false);
            }
          })();
        },
        modal: {
          ondismiss: () => {
            void orderApi.markFailed(razorpay.orderId).catch(() => {});
            setProcessing(false);
            setError("Payment was cancelled before completion.");
          },
        },
      });

      checkout.on("payment.failed", () => {
        void orderApi.markFailed(razorpay.orderId).catch(() => {});
        setProcessing(false);
        setError("Payment failed. Please try another payment method.");
      });

      checkout.open();
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : "Something went wrong. Please try again.",
      );
      setProcessing(false);
    }
  };

  if (placedOrder) {
    return (
      <div className="mx-auto max-w-2xl py-16 text-center">
        <CheckCircle2 className="mx-auto size-12 text-gold-300" />
        <h2 className="mt-7 font-display text-6xl">Thank you.</h2>
        <p className="mx-auto mt-5 max-w-md text-base leading-7 text-mist/80">
          Your payment of {formatPrice(placedOrder.total)} was received. A
          confirmation is on its way to {placedOrder.customer.email}.
        </p>
        <p className="mt-4 text-[0.62rem] uppercase tracking-luxury text-mist/70">
          Payment ID · {placedOrder.razorpayPaymentId}
        </p>
        <Button href="/shop" className="mt-9">
          Return to collection
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="font-display text-4xl">Add a fragrance before checkout.</p>
        <Button href="/shop" className="mt-7">
          Explore collection
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-14 lg:grid-cols-[1fr_22rem]">
      <div className="space-y-12">
        <CheckoutSection title="Contact">
          <Field
            id="checkout-email"
            label="Email address"
            type="email"
            defaultValue={user?.email}
            wide
          />
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
          <div className="col-span-full flex items-center gap-3 border border-white/10 bg-white/[0.025] p-4 text-xs text-mist/80">
            <LockKeyhole className="size-4 text-gold-300" />
            You will be redirected to Razorpay to pay securely by UPI, card, net
            banking, or wallet.
          </div>
        </CheckoutSection>
      </div>
      <aside className="h-fit border border-white/10 bg-white/[0.025] p-7 lg:sticky lg:top-32">
        <h2 className="font-display text-3xl">Your order</h2>
        <div className="mt-6 divide-y divide-white/10 border-y border-white/10">
          {items.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="flex justify-between gap-4 py-4 text-xs"
            >
              <span className="text-mist/80">
                {product.name} × {quantity}
              </span>
              <span>{formatPrice(product.price * quantity)}</span>
            </div>
          ))}
        </div>
        <PriceSummary subtotal={subtotal} />
        <div className="my-6">
          <CouponPanel compact />
        </div>
        {error ? (
          <p className="mb-4 border border-red-400/40 bg-red-500/5 px-4 py-3 text-xs text-red-200">
            {error}
          </p>
        ) : null}
        <Button type="submit" className="w-full" disabled={processing}>
          {processing ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              Processing
            </span>
          ) : (
            "Pay securely"
          )}
        </Button>
      </aside>
    </form>
  );
}

function CheckoutSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset>
      <legend className="font-display text-3xl">{title}</legend>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

function Field({
  id,
  label,
  type = "text",
  wide = false,
  defaultValue,
}: {
  id: string;
  label: string;
  type?: string;
  wide?: boolean;
  defaultValue?: string;
}) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <label
        htmlFor={id}
        className="mb-2 block text-[0.6rem] uppercase tracking-luxury text-mist/75"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        defaultValue={defaultValue}
        required
        className="h-14 w-full border border-white/10 bg-white/[0.025] px-4 text-sm outline-none transition focus:border-gold-300/60"
      />
    </div>
  );
}
