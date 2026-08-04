import type { Metadata } from "next";
import Image from "next/image";

import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = { title: "Our Story" };

const timeline = [
  ["1927", "A house is born", "Our founder opens a small laboratory in Paris, combining the discipline of Grasse with a modern instinct."],
  ["1964", "The language of materials", "The maison begins direct partnerships with growers of rose, iris, sandalwood and citrus."],
  ["1998", "A new generation", "A third generation strips the collection back to six signatures, each matured at extrait concentration."],
  ["Today", "Quietly uncompromising", "The same philosophy continues: fewer fragrances, better materials, and no composition released before it feels inevitable."],
] as const;

export default function StoryPage() {
  return (
    <div className="bg-ink">
      <section className="border-b border-white/10 pb-16 pt-32 sm:pb-20 sm:pt-36 lg:pb-24">
        <Container className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 xl:gap-24">
          <div className="py-4 lg:py-10">
            <p className="text-[0.68rem] uppercase tracking-[0.44em] text-gold-300">The House</p>
            <h1 className="mt-6 max-w-4xl text-balance font-display text-5xl leading-[0.88] tracking-[-0.055em] min-[380px]:text-6xl sm:text-8xl lg:text-[7rem] xl:text-[8.5rem]">
              A century in pursuit of the invisible.
            </h1>
            <p className="mt-8 max-w-md text-base leading-7 text-mist/80">
              Fragrance created for the road—turning every drive into a place worth remembering.
            </p>
          </div>
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-white/10 bg-obsidian shadow-[0_30px_100px_rgba(0,0,0,0.55)] lg:max-h-[42rem]">
            <Image
              src="/images/autoroma-car-fragrance-story.png"
              alt="Amber car fragrance hanging inside a premium vehicle"
              fill
              priority
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-white/[0.03]" />
            <div className="pointer-events-none absolute inset-5 rounded-xl border border-gold-300/10" />
          </div>
        </Container>
      </section>
      <section className="relative overflow-hidden bg-[#ded8ca] py-24 text-ink sm:py-32">
        <div className="pointer-events-none absolute -bottom-52 -left-40 size-[32rem] rounded-full border border-black/[0.06] sm:size-[42rem]" />
        <div className="pointer-events-none absolute -bottom-28 -left-12 size-[20rem] rounded-full border border-black/[0.06] sm:size-[28rem]" />
        <Container className="relative grid items-center gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <div>
            <p className="text-[0.68rem] uppercase tracking-luxury text-black/65">Our philosophy</p>
            <div className="mt-10 max-w-sm border-l border-black/15 pl-6 sm:mt-14 sm:pl-8">
              <div className="flex items-center gap-4">
                <span className="flex size-12 items-center justify-center rounded-full border border-black/15 font-display text-xl italic">A</span>
                <span className="h-px flex-1 bg-black/15" />
                <span className="text-[0.6rem] uppercase tracking-[0.3em] text-black/65">Est. 1927</span>
              </div>
              <p className="mt-8 font-display text-3xl leading-tight sm:text-4xl">
                Crafted for the journey, not just the destination.
              </p>
              <p className="mt-5 max-w-xs text-base leading-7 text-black/75">
                Each blend is designed to unfold gently inside your car—present, personal, and never overpowering.
              </p>
              <div className="mt-9 flex items-center gap-3">
                <span className="size-1.5 rounded-full bg-black/50" />
                <span className="h-px w-12 bg-black/20" />
                <span className="size-1.5 rounded-full border border-black/35" />
                <span className="h-px w-20 bg-black/20" />
                <span className="size-2.5 rounded-full border border-black/35" />
              </div>
            </div>
          </div>
          <div className="lg:border-l lg:border-black/10 lg:pl-16">
            <p className="font-display text-4xl leading-tight sm:text-6xl lg:text-7xl">
              We do not begin with trends. We begin with a material worth remembering.
            </p>
            <div className="mt-10 flex items-center gap-5 border-t border-black/10 pt-6">
              <span className="text-[0.6rem] uppercase tracking-[0.32em] text-black/65">Scent</span>
              <span className="size-1 rounded-full bg-black/25" />
              <span className="text-[0.6rem] uppercase tracking-[0.32em] text-black/65">Motion</span>
              <span className="size-1 rounded-full bg-black/25" />
              <span className="text-[0.6rem] uppercase tracking-[0.32em] text-black/65">Memory</span>
            </div>
          </div>
        </Container>
      </section>
      <section className="py-28 sm:py-40">
        <Container>
          <SectionHeading eyebrow="Chronology" title="Four moments. One enduring idea." />
          <div className="mt-20">
            {timeline.map(([year, title, copy]) => (
              <article key={year} className="grid gap-6 border-t border-white/10 py-10 lg:grid-cols-[0.35fr_0.65fr_1fr]">
                <p className="font-display text-4xl text-gold-300">{year}</p>
                <h2 className="font-display text-3xl">{title}</h2>
                <p className="max-w-lg text-base leading-7 text-mist/80">{copy}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
