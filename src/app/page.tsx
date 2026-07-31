import { CinematicHero } from "@/components/sections/cinematic-hero";
import { SignatureSection } from "@/components/sections/signature-section";
import { CollectionSection } from "@/components/sections/collection-section";
import { StorySection } from "@/components/sections/story-section";
import { IngredientsSection } from "@/components/sections/ingredients-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { NewsletterSection } from "@/components/sections/newsletter-section";

export default function Home() {
  return (
    <>
      <CinematicHero />
      <SignatureSection />
      <CollectionSection />
      <StorySection />
      <IngredientsSection />
      <ExperienceSection />
      <TestimonialsSection />
      <NewsletterSection />
    </>
  );
}
