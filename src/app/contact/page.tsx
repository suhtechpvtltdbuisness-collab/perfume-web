import type { Metadata } from "next";

import { ContactForm } from "@/components/contact/contact-form";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = { title: "Contact & Appointments" };

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-ink pb-24 pt-32 sm:pb-32 sm:pt-40">
      <Container className="grid gap-16 lg:grid-cols-2 lg:gap-28">
        <div>
          <p className="text-[0.68rem] uppercase tracking-luxury text-gold-300">Client services</p>
          <h1 className="mt-5 text-balance font-display text-6xl leading-[0.9] tracking-[-0.05em] sm:text-8xl xl:text-9xl">
            Speak with the maison.
          </h1>
          <p className="mt-8 max-w-md text-base leading-7 text-mist/80">
            From finding your signature to caring for an order, our private client team is here to assist.
          </p>
          <div className="mt-12 grid gap-8 border-t border-white/10 pt-8 sm:grid-cols-2">
            <div>
              <p className="text-[0.6rem] uppercase tracking-luxury text-gold-400">Email</p>
              <a href="mailto:care@autoroma.com" className="mt-3 inline-block text-sm text-mist/85 transition hover:text-gold-300">
                care@autoroma.com
              </a>
            </div>
            <div>
              <p className="text-[0.6rem] uppercase tracking-luxury text-gold-400">Hours</p>
              <p className="mt-3 text-sm leading-6 text-mist/85">Mon–Sat<br />10:00–19:00 IST</p>
            </div>
            <div>
              <p className="text-[0.6rem] uppercase tracking-luxury text-gold-400">Address</p>
              <address className="mt-3 text-sm not-italic leading-6 text-mist/85">
                Noida 201301, India
              </address>
            </div>
            <div>
              <p className="text-[0.6rem] uppercase tracking-luxury text-gold-400">Phone</p>
              <a href="tel:+917061261991" className="mt-3 inline-block text-sm text-mist/85 transition hover:text-gold-300">
                +91 70612 61991
              </a>
            </div>
          </div>
        </div>
        <ContactForm />
      </Container>
    </div>
  );
}
