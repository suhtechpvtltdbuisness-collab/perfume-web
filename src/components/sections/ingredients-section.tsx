"use client";

import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { useSiteContent } from "@/components/providers/site-content-provider";
import { Reveal } from "@/components/animations/reveal";

export function IngredientsSection() {
  const { landing } = useSiteContent();
  return (
    <section className="bg-obsidian py-28 sm:py-36 lg:py-48">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow={landing.ingredientsEyebrow}
            title={landing.ingredientsTitle}
            description={landing.ingredientsDescription}
          />
        </Reveal>
        <div className="mt-16 grid gap-px bg-white/10 md:grid-cols-2">
          {landing.ingredients.map((ingredient, index) => (
            <Reveal key={`${ingredient.name}-${index}`} delay={(index % 2) * 0.08}>
              <article className="group min-h-72 bg-obsidian p-8 transition-colors duration-700 hover:bg-white/[0.035] sm:p-12">
                <span className="text-[0.6rem] tracking-luxury text-gold-400">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-16 font-display text-4xl text-ivory transition-transform duration-700 group-hover:translate-x-2 sm:text-5xl">
                  {ingredient.name}
                </h3>
                <p className="mt-5 max-w-sm text-sm leading-6 text-mist/75">{ingredient.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
