"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { useSiteContent } from "@/components/providers/site-content-provider";

const PerfumeBottleCanvas = dynamic(
  () =>
    import("@/components/three/perfume-bottle-canvas").then(
      (module) => module.PerfumeBottleCanvas,
    ),
  { ssr: false },
);

export function CinematicHero() {
  const { landing } = useSiteContent();
  const section = useRef<HTMLElement>(null);
  const intro = useRef<HTMLDivElement>(null);
  const sprayCopy = useRef<HTMLDivElement>(null);
  const finalCopy = useRef<HTMLDivElement>(null);
  const progress = useRef(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.35,
        onUpdate: (self) => {
          progress.current = self.progress;
        },
      });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: section.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
          },
        })
        .to(
          intro.current,
          { opacity: 0, y: -50, duration: 0.14 },
          0.08,
        )
        .fromTo(
          sprayCopy.current,
          { opacity: 0, x: 50 },
          { opacity: 1, x: 0, duration: 0.13 },
          0.14,
        )
        .to(sprayCopy.current, { opacity: 0, x: -35, duration: 0.1 }, 0.5)
        .fromTo(
          finalCopy.current,
          { opacity: 0, y: 45 },
          { opacity: 1, y: 0, duration: 0.16 },
          0.56,
        );
    }, section);
    return () => context.revert();
  }, []);

  return (
    <section
      ref={section}
      className="relative h-[270vh] bg-black sm:h-[310vh] lg:h-[340vh]"
    >
      <div className="sticky top-0 h-screen overflow-hidden bg-black">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[url('/images/hero-feather-pattern.svg')] bg-[length:94px_86px] opacity-[0.38] sm:bg-[length:118px_108px] lg:bg-[length:141px_129px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/25 to-black/55" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(181,132,60,0.16),transparent_42%)]" />
        <div className="absolute inset-0 bg-transparent">
          <PerfumeBottleCanvas progress={progress} />
        </div>

        <Container className="pointer-events-none relative z-10 h-full">
          <div
            ref={intro}
            className="absolute inset-x-5 top-[15%] text-center sm:inset-x-8 sm:top-[14%] lg:top-[12%]"
          >
            <p className="mb-5 mt-[max(0px,6rem_-_15vh)] text-[0.68rem] uppercase tracking-[0.46em] text-gold-300/95 sm:mt-[max(0px,7rem_-_14vh)] lg:mt-[max(0px,7rem_-_12vh)]">
              {landing.heroEyebrow}
            </p>
            <h1 className="mx-auto max-w-5xl text-balance font-display text-[13.5vw] leading-[0.84] tracking-[-0.045em] text-ivory sm:text-[6rem] lg:text-[7rem] xl:text-[7.5rem]">
              {landing.heroTitleLead}
              <span className="flex flex-wrap justify-center gap-x-[0.3em] italic text-gold-300">
                {landing.heroTitleHighlight.split(" ").map((word, index) => (
                  <span key={`${word}-${index}`}>{word}</span>
                ))}
              </span>
            </h1>
            <div className="pointer-events-auto absolute left-1/2 top-[67vh] -translate-x-1/2 sm:top-[70vh] lg:top-[72vh]">
              <Button
                href={landing.heroPrimaryCtaHref}
                showArrow
                className="whitespace-nowrap shadow-[0_18px_60px_rgba(0,0,0,0.55)]"
              >
                {landing.heroPrimaryCtaLabel}
              </Button>
            </div>
          </div>

          <div
            ref={sprayCopy}
            className="absolute right-5 top-[18%] max-w-xs opacity-0 sm:right-10 lg:right-20 lg:top-1/3"
          >
            <p className="text-[0.68rem] uppercase tracking-luxury text-gold-300">
              {landing.heroSprayEyebrow}
            </p>
            <h2 className="mt-4 font-display text-5xl leading-none text-ivory sm:text-6xl">
              {landing.heroSprayTitle}
            </h2>
            <p className="mt-5 text-sm leading-6 text-mist/80">
              {landing.heroSprayDescription}
            </p>
          </div>

          <div
            ref={finalCopy}
            className="absolute left-5 top-1/3 max-w-sm opacity-0 sm:left-10 lg:left-20"
          >
            <p className="text-[0.68rem] uppercase tracking-luxury text-gold-300">
              {landing.heroFinalEyebrow}
            </p>
            <h2 className="mt-4 font-display text-5xl leading-none text-ivory sm:text-7xl">
              {landing.heroFinalTitle}
            </h2>
            <div className="pointer-events-auto mt-8">
              <Button
                href={landing.heroFinalCtaHref}
                variant="outline"
                showArrow
              >
                {landing.heroFinalCtaLabel}
              </Button>
            </div>
          </div>
        </Container>

        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-center text-mist/70">
          <ChevronDown className="mx-auto size-4 animate-bounce" />
          <span className="mt-2 block text-[0.62rem] uppercase tracking-luxury">
            {landing.heroScrollHint}
          </span>
        </div>
      </div>
    </section>
  );
}
