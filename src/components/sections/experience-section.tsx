"use client";

import Image from "next/image";

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { useSiteContent } from "@/components/providers/site-content-provider";
import { Reveal } from "@/components/animations/reveal";

export function ExperienceSection() {
  const { landing } = useSiteContent();
  return (
    <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-black py-24 sm:min-h-[80vh] sm:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(174,121,47,0.26),transparent_46%)]" />
      <Container className="relative grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(24rem,0.92fr)] lg:gap-16">
        <Reveal>
          <p className="text-[0.68rem] uppercase tracking-[0.42em] text-gold-300">
            {landing.experienceEyebrow}
          </p>
          <h2 className="mt-6 max-w-3xl text-balance font-display text-5xl leading-[0.92] tracking-[-0.045em] sm:text-7xl lg:text-8xl xl:text-9xl">
            {landing.experienceTitle}
          </h2>
          <p className="mt-8 max-w-md text-base leading-7 text-mist/80">
            {landing.experienceDescription}
          </p>
          <Button
            href={landing.experienceCtaHref}
            variant="outline"
            showArrow
            className="mt-9"
          >
            {landing.experienceCtaLabel}
          </Button>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="relative mx-auto aspect-square w-full max-w-2xl overflow-hidden border border-white/10 bg-black shadow-[0_40px_120px_rgba(85,0,0,0.32)]">
            <Image
              src="/images/autoroma-four-fragrances.png"
              alt="Four Autoroma car perfume fragrances"
              fill
              sizes="(min-width: 1024px) 44vw, 92vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
