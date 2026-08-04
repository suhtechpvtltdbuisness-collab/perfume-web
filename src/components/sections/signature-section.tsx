"use client";

import { Container } from "@/components/ui/container";
import { BottleArt } from "@/components/ui/bottle-art";
import { SectionHeading } from "@/components/ui/section-heading";
import { useSiteContent } from "@/components/providers/site-content-provider";
import { Reveal } from "@/components/animations/reveal";

const details = [
  ["27", "Rare materials"],
  ["18", "Months maturation"],
  ["34%", "Parfum concentration"],
] as const;

export function SignatureSection() {
  const { landing } = useSiteContent();
  return (
    <section className="relative bg-obsidian py-28 sm:py-36 lg:py-48">
      <div className="absolute inset-x-0 top-0 border-y border-gold-300/10 bg-gold-300/[0.035] px-5 py-3 text-center text-[0.58rem] uppercase leading-5 tracking-[0.26em] text-gold-300/90 sm:text-[0.62rem] sm:tracking-[0.38em]">
        {landing.announcement}
      </div>
      <Container className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
        <Reveal>
          <div className="relative border border-white/[0.08] bg-black shadow-[0_50px_140px_rgba(0,0,0,0.65)]">
            <BottleArt accent="bg-[#93601f]" name="Nocturne Oud" />
            <span className="absolute bottom-7 left-7 text-[0.6rem] uppercase tracking-luxury text-mist/70">
              House signature · 01
            </span>
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <SectionHeading
            eyebrow={landing.signatureEyebrow}
            title={landing.signatureTitle}
            description={landing.signatureDescription}
          />
          <div className="mt-12 grid grid-cols-3 gap-2 border-t border-white/10 pt-8 sm:gap-3">
            {details.map(([value, label]) => (
              <div key={label}>
                <p className="font-display text-2xl text-gold-300 min-[380px]:text-3xl sm:text-5xl">{value}</p>
                <p className="mt-2 text-[0.62rem] uppercase leading-4 tracking-editorial text-mist/70">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
