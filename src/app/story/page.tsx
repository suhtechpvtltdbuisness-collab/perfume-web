import type { Metadata } from "next";

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
      <section className="flex min-h-screen items-end border-b border-white/10 pb-24 pt-40">
        <Container>
          <p className="text-[0.58rem] uppercase tracking-[0.44em] text-gold-300">The House</p>
          <h1 className="mt-6 max-w-6xl text-balance font-display text-[16vw] leading-[0.75] tracking-[-0.06em] sm:text-[9rem] lg:text-[11rem]">
            A century in pursuit of the invisible.
          </h1>
        </Container>
      </section>
      <section className="bg-[#ded8ca] py-28 text-ink sm:py-40">
        <Container className="grid gap-14 lg:grid-cols-2">
          <p className="text-[0.58rem] uppercase tracking-luxury text-black/45">Our philosophy</p>
          <p className="font-display text-4xl leading-tight sm:text-6xl">
            We do not begin with trends. We begin with a material worth remembering.
          </p>
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
                <p className="max-w-lg text-sm leading-7 text-mist/60">{copy}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
