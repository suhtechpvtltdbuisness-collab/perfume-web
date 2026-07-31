import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/animations/reveal";

const ingredients = [
  ["01", "Oud Assafi", "A dark, resinous material aged for decades before extraction."],
  ["02", "Iris Pallida", "Cultivated in Florence and rested for six years for its buttery depth."],
  ["03", "Rose Centifolia", "Hand-picked at dawn in Grasse, when its aroma is most vivid."],
  ["04", "Sandalwood", "Creamy, meditative and sourced through regenerative plantations."],
] as const;

export function IngredientsSection() {
  return (
    <section className="bg-obsidian py-28 sm:py-36 lg:py-48">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="The palette"
            title="The rarest materials. Nothing superfluous."
            description="We work with growers, distillers and extractors whose materials have character before they enter a formula."
          />
        </Reveal>
        <div className="mt-16 grid gap-px bg-white/10 md:grid-cols-2">
          {ingredients.map(([number, name, description], index) => (
            <Reveal key={name} delay={(index % 2) * 0.08}>
              <article className="group min-h-72 bg-obsidian p-8 transition-colors duration-700 hover:bg-white/[0.035] sm:p-12">
                <span className="text-[0.5rem] tracking-luxury text-gold-400">{number}</span>
                <h3 className="mt-16 font-display text-4xl text-ivory transition-transform duration-700 group-hover:translate-x-2 sm:text-5xl">
                  {name}
                </h3>
                <p className="mt-5 max-w-sm text-xs leading-6 text-mist/55">{description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
