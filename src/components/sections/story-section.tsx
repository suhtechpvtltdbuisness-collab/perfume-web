"use client";

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { useSiteContent } from "@/components/providers/site-content-provider";
import { Reveal } from "@/components/animations/reveal";

export function StorySection() {
  const { landing } = useSiteContent();
  return (
    <section className="relative overflow-hidden bg-[#ded8ca] py-32 text-ink sm:py-44 lg:py-56">
      <div className="absolute -right-20 top-1/2 size-[34rem] -translate-y-1/2 rounded-full border border-black/10" />
      <Container className="relative grid gap-14 lg:grid-cols-[0.7fr_1.3fr]">
        <p className="text-[0.58rem] font-semibold uppercase tracking-[0.4em] text-black/50">
          Paris · 1927
        </p>
        <Reveal>
        <div>
          <blockquote className="text-balance font-display text-5xl leading-[0.98] tracking-[-0.035em] sm:text-7xl lg:text-8xl">
            “{landing.storyQuote}”
          </blockquote>
          <p className="mt-9 max-w-lg text-sm leading-7 text-black/60">
            {landing.storyDescription}
          </p>
          <Button href="/story" variant="outline" showArrow className="mt-9 border-black/20 text-ink hover:border-black hover:text-ink">
            Read our story
          </Button>
        </div>
        </Reveal>
      </Container>
    </section>
  );
}
