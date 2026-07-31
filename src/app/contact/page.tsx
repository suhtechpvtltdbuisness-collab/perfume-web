import type { Metadata } from "next";

import { ContactForm } from "@/components/contact/contact-form";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = { title: "Contact & Appointments" };

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-ink pb-32 pt-40">
      <Container className="grid gap-16 lg:grid-cols-2 lg:gap-28">
        <div>
          <p className="text-[0.58rem] uppercase tracking-luxury text-gold-300">Client services</p>
          <h1 className="mt-5 font-display text-7xl leading-[0.88] tracking-[-0.05em] sm:text-9xl">
            Speak with the maison.
          </h1>
          <p className="mt-8 max-w-md text-sm leading-7 text-mist/60">
            From finding your signature to caring for an order, our private client team is here to assist.
          </p>
          <div className="mt-12 grid gap-8 border-t border-white/10 pt-8 sm:grid-cols-2">
            <div>
              <p className="text-[0.5rem] uppercase tracking-luxury text-gold-400">Email</p>
              <p className="mt-3 text-sm text-mist/70">care@maisonaurelia.com</p>
            </div>
            <div>
              <p className="text-[0.5rem] uppercase tracking-luxury text-gold-400">Hours</p>
              <p className="mt-3 text-sm leading-6 text-mist/70">Mon–Sat<br />10:00–19:00 IST</p>
            </div>
          </div>
        </div>
        <ContactForm />
      </Container>
    </div>
  );
}
