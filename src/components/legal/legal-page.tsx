import type { ReactNode } from "react";

import { Container } from "@/components/ui/container";

interface LegalSection {
  title: string;
  content: ReactNode;
}

export function LegalPage({
  eyebrow,
  title,
  introduction,
  sections,
}: {
  eyebrow: string;
  title: string;
  introduction: string;
  sections: LegalSection[];
}) {
  return (
    <div className="min-h-screen bg-ink pb-24 pt-32 sm:pb-32 sm:pt-40">
      <Container className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-24">
        <header className="lg:sticky lg:top-36 lg:self-start">
          <p className="text-[0.68rem] uppercase tracking-luxury text-gold-300">{eyebrow}</p>
          <h1 className="mt-5 text-balance font-display text-6xl leading-[0.9] tracking-[-0.045em] sm:text-8xl">
            {title}
          </h1>
          <p className="mt-7 text-xs uppercase tracking-editorial text-mist/55">
            Last updated: 7 August 2026
          </p>
        </header>

        <div>
          <p className="border-b border-white/10 pb-10 text-lg leading-8 text-mist/85">
            {introduction}
          </p>
          <div className="divide-y divide-white/10">
            {sections.map((section, index) => (
              <section key={section.title} className="grid gap-4 py-9 sm:grid-cols-[3rem_1fr] sm:gap-6">
                <span className="font-display text-2xl text-gold-300/70">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h2 className="font-display text-3xl text-ivory">{section.title}</h2>
                  <div className="mt-4 space-y-4 text-sm leading-7 text-mist/75">{section.content}</div>
                </div>
              </section>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
