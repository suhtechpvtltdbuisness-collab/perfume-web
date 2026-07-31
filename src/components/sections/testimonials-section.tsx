const testimonials = [
  "Nocturne Oud feels less like fragrance and more like a beautifully kept secret.",
  "The packaging, service and scent are considered down to the smallest detail.",
  "Lumière Rose changes through the day and somehow becomes more personal.",
] as const;

export function TestimonialsSection() {
  return (
    <section className="overflow-hidden border-y border-white/[0.08] bg-[#080808] py-20">
      <div className="flex w-max animate-marquee gap-6 pl-6">
        {[...testimonials, ...testimonials].map((quote, index) => (
          <blockquote key={`${quote}-${index}`} className="w-[80vw] max-w-xl border border-white/10 bg-white/[0.025] p-8 backdrop-blur sm:p-10">
            <p className="text-gold-300">★★★★★</p>
            <p className="mt-6 font-display text-2xl leading-snug text-ivory sm:text-3xl">“{quote}”</p>
            <footer className="mt-7 text-[0.5rem] uppercase tracking-luxury text-mist/45">Verified client</footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
