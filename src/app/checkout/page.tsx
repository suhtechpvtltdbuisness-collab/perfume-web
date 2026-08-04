import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = { title: "Secure Checkout" };

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-ink pb-24 pt-32 sm:pb-32 sm:pt-36">
      <Container>
        <p className="text-[0.68rem] uppercase tracking-luxury text-gold-300">Secure checkout</p>
        <h1 className="mb-10 mt-4 text-balance font-display text-5xl sm:mb-14 sm:text-8xl">Complete your order.</h1>
        <CheckoutForm />
      </Container>
    </div>
  );
}
