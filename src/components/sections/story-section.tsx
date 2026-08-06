"use client";

import Image from "next/image";

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { useSiteContent } from "@/components/providers/site-content-provider";
import { Reveal } from "@/components/animations/reveal";

export function StorySection() {
  const { landing } = useSiteContent();
  return (
    <section className="relative overflow-hidden bg-[#ded8ca] py-20 text-ink sm:py-28 lg:py-32">
      <div className="pointer-events-none absolute -right-40 -top-40 size-[36rem] rounded-full border border-black/[0.07]" />
      <Container className="relative grid items-stretch gap-0 lg:grid-cols-[0.85fr_1.15fr]">
        <Reveal className="relative z-10">
          <div className="relative min-h-[30rem] overflow-hidden rounded-2xl bg-ink shadow-[0_35px_100px_rgba(35,27,16,0.28)] sm:min-h-[38rem] lg:h-full">
            <Image
              src={landing.storyImageUrl}
              alt={landing.storyImageAlt}
              fill
              sizes="(min-width: 1024px) 42vw, 100vw"
              unoptimized={!landing.storyImageUrl.startsWith("/")}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-black/20" />
            <div className="absolute inset-5 rounded-xl border border-white/15" />
            <div className="absolute inset-x-8 bottom-8 flex items-end justify-between text-white sm:inset-x-10 sm:bottom-10">
              <div>
                <p className="text-[0.6rem] uppercase tracking-[0.4em] text-white/55">{landing.storyImageEyebrow}</p>
                <p className="mt-3 max-w-xs font-display text-3xl leading-none sm:text-4xl">{landing.storyImageTitle}</p>
              </div>
              <span className="hidden size-12 items-center justify-center rounded-full border border-white/25 font-display text-xl italic sm:flex">A</span>
            </div>
          </div>
        </Reveal>

        <div className="relative flex items-center py-12 lg:-ml-8 lg:py-16 lg:pl-24">
          <div className="absolute left-0 top-1/2 hidden h-px w-16 bg-black/20 lg:block" />
          <Reveal delay={0.12}>
            <div>
              <div className="flex items-center gap-4">
                <span className="h-px w-10 bg-[#c81424]" />
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.4em] text-black/70">{landing.storyEyebrow}</p>
              </div>
              <blockquote className="mt-8 text-balance font-display text-5xl leading-[0.94] tracking-[-0.04em] sm:text-6xl xl:text-7xl">
                “{landing.storyQuote}”
              </blockquote>
              <p className="mt-8 max-w-lg text-base leading-7 text-black/75">
                {landing.storyDescription}
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-6">
                <Button href={landing.storyCtaHref} variant="outline" showArrow className="border-black/20 text-ink hover:border-black hover:text-ink">
                  {landing.storyCtaLabel}
                </Button>
                <p className="text-[0.62rem] uppercase tracking-[0.28em] text-black/65">{landing.storyFooterNote}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
