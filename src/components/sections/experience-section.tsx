import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/animations/reveal";

export function ExperienceSection() {
  return (
    <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-black py-24 sm:min-h-[80vh] sm:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(174,121,47,0.26),transparent_46%)]" />
      <div className="absolute -right-20 top-1/2 h-[28rem] w-44 -translate-y-1/2 rounded-t-full border border-gold-300/15 bg-gradient-to-b from-white/10 via-amber-900/10 to-black opacity-60 shadow-[0_0_120px_rgba(191,139,61,0.18)] sm:right-[8%] sm:h-[36rem] sm:w-56 sm:opacity-100" />
      <Container className="relative">
        <Reveal>
        <p className="text-[0.68rem] uppercase tracking-[0.42em] text-gold-300">Private consultation</p>
        <h2 className="mt-6 max-w-3xl text-balance font-display text-5xl leading-[0.92] tracking-[-0.045em] sm:text-7xl lg:text-9xl">
          Find the scent that feels inevitable.
        </h2>
        <p className="mt-8 max-w-md text-base leading-7 text-mist/80">
          An intimate discovery of materials, memories and the fragrance that belongs to you.
        </p>
        <Button href="/contact" variant="outline" showArrow className="mt-9">Book an appointment</Button>
        </Reveal>
      </Container>
    </section>
  );
}
