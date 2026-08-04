import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { CartView } from "@/components/cart/cart-view";

export const metadata: Metadata = { title: "Your Bag" };

export default function CartPage() {
  return (
    <div className="min-h-screen bg-ink pb-24 pt-32 sm:pb-32 sm:pt-44">
      <Container>
        <p className="text-[0.58rem] uppercase tracking-luxury text-gold-300">Your selection</p>
        <h1 className="mb-10 mt-4 font-display text-5xl sm:mb-14 sm:text-8xl">Shopping bag</h1>
        <CartView />
      </Container>
    </div>
  );
}
