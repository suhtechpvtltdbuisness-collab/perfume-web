import type { Metadata } from "next";
import Image from "next/image";

import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "The Story Behind AutoRoma | Our Story",
  description:
    "It Started With a Thought. It Became a Vision. Discover the story, journey, and philosophy behind AutoRoma luxury car fragrances.",
};

const timeline = [
  {
    year: "2022",
    title: "A Thought is Born",
    copy: "The idea behind AutoRoma began in 2022, when I first started thinking about building something of my own in the automobile industry. Initially, I explored the world of automotive accessories, but somewhere along the way, I found myself drawn to something more specific — fragrance. I noticed that car fragrances were often treated as just another accessory, rather than something that could shape the entire driving experience. I wanted to change that.",
  },
  {
    year: "Early 2023",
    title: "Research & Experimentation",
    copy: "In 2023, I began researching, experimenting, and turning that thought into something real. I wanted to create a brand that brought together the world of automobiles and the art of fragrance — something distinctive, refined, and accessible to people who appreciate the finer details.",
  },
  {
    year: "21 July 2023",
    title: "AutoRoma Gets Its Name",
    copy: "On 21 July 2023, AutoRoma got its name. What followed was a journey of learning, building, testing, and believing in an idea before it became what it is today.",
  },
  {
    year: "Today",
    title: "Shaping the Vision",
    copy: "Building a brand from scratch isn’t always easy. There are lessons you learn along the way, challenges you never anticipate, and moments when you have to trust the vision you started with. Every step has been a part of shaping AutoRoma into the brand I imagined.",
  },
] as const;

export default function StoryPage() {
  return (
    <div className="bg-ink text-ivory">
      {/* HERO SECTION */}
      <section className="border-b border-white/10 pb-16 pt-32 sm:pb-20 sm:pt-36 lg:pb-24">
        <Container className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 xl:gap-24">
          <div className="py-4 lg:py-8">
            <p className="text-[0.68rem] uppercase tracking-[0.44em] text-gold-300">
              The Story Behind AutoRoma
            </p>
            <h1 className="mt-6 max-w-4xl text-balance font-display text-4xl leading-[0.92] tracking-[-0.05em] min-[380px]:text-5xl sm:text-7xl lg:text-[5.5rem] xl:text-[6.8rem]">
              It Started With a Thought. It Became a Vision.
            </h1>
            <p className="mt-8 font-display text-xl italic text-gold-200/90 sm:text-2xl">
              “I’ve always believed that the smallest details can make the biggest difference.”
            </p>
            <div className="mt-6 space-y-4 max-w-xl text-base leading-7 text-mist/85">
              <p>
                The idea behind AutoRoma began in 2022, when I first started thinking about
                building something of my own in the automobile industry. Initially, I explored the
                world of automotive accessories, but somewhere along the way, I found myself drawn
                to something more specific — fragrance.
              </p>
              <p>
                I noticed that car fragrances were often treated as just another accessory, rather
                than something that could shape the entire driving experience. I wanted to change
                that.
              </p>
            </div>
          </div>

          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-white/10 bg-obsidian shadow-[0_30px_100px_rgba(0,0,0,0.55)] lg:max-h-[44rem]">
            <Image
              src="/images/autoroma_story.jpeg"
              alt="AutoRoma luxury car fragrance inside vehicle interior"
              fill
              priority
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/[0.03]" />
            <div className="pointer-events-none absolute inset-5 rounded-xl border border-gold-300/15" />
          </div>
        </Container>
      </section>

      {/* PHILOSOPHY SECTION (CREAM BACKGROUND) */}
      <section className="relative overflow-hidden bg-[#ded8ca] py-24 text-ink sm:py-32">
        <div className="pointer-events-none absolute -bottom-52 -left-40 size-[32rem] rounded-full border border-black/[0.06] sm:size-[42rem]" />
        <div className="pointer-events-none absolute -bottom-28 -left-12 size-[20rem] rounded-full border border-black/[0.06] sm:size-[28rem]" />
        <Container className="relative grid items-center gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div>
            <p className="text-[0.68rem] uppercase tracking-luxury text-black/65">Our Philosophy</p>
            <div className="mt-8 max-w-sm border-l-2 border-black/20 pl-6 sm:mt-12 sm:pl-8">
              <p className="text-[0.68rem] uppercase tracking-[0.3em] text-black/60">Core Belief</p>
              <p className="mt-4 font-display text-2xl leading-snug sm:text-3xl text-black">
                Your car should feel as good as it looks, and every drive deserves its own signature.
              </p>
              <p className="mt-6 font-display text-lg italic text-black/80">
                AutoRoma — Luxury Fragrance for Every Drive.
              </p>
              <p className="mt-2 text-xs uppercase tracking-luxury text-black/60">
                — The Founder, AutoRoma
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
            <blockquote className="font-display text-3xl leading-tight sm:text-5xl lg:text-6xl text-black">
              “This is not just a business I started. It’s an idea I’ve spent years bringing to
              life, one fragrance at a time.”
            </blockquote>
            <p className="mt-8 font-display text-2xl text-black/80 italic sm:text-3xl">
              And this is only the beginning.
            </p>
            <div className="mt-10 flex items-center gap-5 border-t border-black/10 pt-6">
              <span className="text-[0.6rem] uppercase tracking-[0.32em] text-black/65">Scent</span>
              <span className="size-1 rounded-full bg-black/25" />
              <span className="text-[0.6rem] uppercase tracking-[0.32em] text-black/65">Automobile</span>
              <span className="size-1 rounded-full bg-black/25" />
              <span className="text-[0.6rem] uppercase tracking-[0.32em] text-black/65">Experience</span>
            </div>
          </div>
        </Container>
      </section>

      {/* CHRONOLOGY & JOURNEY SECTION */}
      <section className="py-28 sm:py-36">
        <Container>
          <SectionHeading
            eyebrow="Chronology"
            title="The Journey So Far."
            description="From a spark in 2022 to crafting signature driving scents that linger."
          />
          <div className="mt-16 sm:mt-20">
            {timeline.map(({ year, title, copy }) => (
              <article
                key={year}
                className="grid gap-6 border-t border-white/10 py-10 lg:grid-cols-[0.4fr_0.6fr_1.1fr] lg:items-baseline"
              >
                <p className="font-display text-3xl text-gold-300 sm:text-4xl">{year}</p>
                <h2 className="font-display text-2xl text-ivory sm:text-3xl">{title}</h2>
                <p className="max-w-xl text-base leading-7 text-mist/80">{copy}</p>
              </article>
            ))}
          </div>

          {/* SIGNATURE CLOSING BANNER */}
          <div className="mt-20 rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center sm:p-14">
            <p className="text-[0.68rem] uppercase tracking-[0.4em] text-gold-300">AutoRoma</p>
            <h3 className="mt-4 font-display text-3xl text-ivory sm:text-5xl">
              Luxury Fragrance for Every Drive.
            </h3>
            <p className="mt-4 text-xs uppercase tracking-luxury text-mist/65">
              — The Founder, AutoRoma
            </p>
            <div className="mt-8 flex justify-center">
              <Button href="/shop" showArrow>
                Discover the collection
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
