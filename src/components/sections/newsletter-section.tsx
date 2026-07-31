"use client";

import { ArrowRight } from "lucide-react";

import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { useSiteContent } from "@/components/providers/site-content-provider";
import { Reveal } from "@/components/animations/reveal";

export function NewsletterSection() {
  const { landing } = useSiteContent();
  return (
    <section className="bg-ink py-28 sm:py-36">
      <Container>
        <Reveal>
          <SectionHeading
          eyebrow="The private list"
          title={landing.newsletterTitle}
          description={landing.newsletterDescription}
          align="center"
          />
        </Reveal>
        <form className="mx-auto mt-12 flex max-w-xl border-b border-white/25 focus-within:border-gold-300">
          <label htmlFor="newsletter-email" className="sr-only">Email address</label>
          <input id="newsletter-email" type="email" required placeholder="Your email address" className="min-w-0 flex-1 bg-transparent py-5 text-sm text-ivory outline-none placeholder:text-mist/35" />
          <button type="submit" aria-label="Subscribe" className="px-3 text-gold-300 transition hover:translate-x-1">
            <ArrowRight className="size-5" />
          </button>
        </form>
      </Container>
    </section>
  );
}
