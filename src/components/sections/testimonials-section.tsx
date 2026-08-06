"use client";

import { useSiteContent } from "@/components/providers/site-content-provider";

export function TestimonialsSection() {
  const { landing } = useSiteContent();
  if (landing.testimonials.length === 0) return null;

  return (
    <section className="overflow-hidden border-y border-white/[0.08] bg-[#080808] py-20">
      <div className="flex w-max animate-marquee gap-6 pl-6">
        {[...landing.testimonials, ...landing.testimonials].map((testimonial, index) => (
          <blockquote key={`${testimonial.quote}-${index}`} className="w-[80vw] max-w-xl border border-white/10 bg-white/[0.025] p-8 backdrop-blur sm:p-10">
            <p className="text-gold-300">★★★★★</p>
            <p className="mt-6 font-display text-2xl leading-snug text-ivory sm:text-3xl">“{testimonial.quote}”</p>
            <footer className="mt-7 text-[0.6rem] uppercase tracking-luxury text-mist/70">{testimonial.author}</footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
