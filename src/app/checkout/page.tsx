import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = { title: "Secure Checkout" };

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-ink pb-32 pt-36">
      <Container>
        <p className="text-[0.58rem] uppercase tracking-luxury text-gold-300">Secure checkout</p>
        <h1 className="mb-14 mt-4 font-display text-6xl sm:text-8xl">Complete your order.</h1>
        <CheckoutForm />
      </Container>
    </div>
  );
}
