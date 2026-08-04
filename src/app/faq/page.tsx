import type { Metadata } from "next";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Answers about Autoroma car fragrances, delivery, use and care.",
};

const faqGroups = [
  {
    title: "Product & use",
    questions: [
      ["How do I use an Autoroma car fragrance?", "Remove the wooden cap, take out the inner stopper, close the cap firmly, and gently tilt the bottle for a few seconds so the fragrance reaches the wood. Hang it securely from the rear-view mirror without blocking your view."],
      ["How long does one bottle last?", "Usage varies with temperature, airflow and how often the bottle is tilted. Under normal conditions, a 10 ml car fragrance typically lasts several weeks."],
      ["Can the fragrance spill?", "Keep the bottle upright and ensure the wooden cap is tightly closed. Avoid prolonged tilting and do not allow the liquid to touch the dashboard, plastic, leather or fabric surfaces."],
      ["Is the fragrance intensity adjustable?", "Yes. For a stronger scent, briefly tilt the bottle to refresh the wooden cap. For a softer experience, tilt it less frequently and keep direct airflow away from the bottle."],
    ],
  },
  {
    title: "Orders & delivery",
    questions: [
      ["Where do you deliver?", "We deliver across serviceable locations in India. Availability and estimated delivery time are confirmed during checkout."],
      ["How can I track my order?", "Once your order is dispatched, tracking details are sent to the email address or phone number provided at checkout."],
      ["Can I change or cancel an order?", "Contact our client-care team as soon as possible. We can update or cancel an order only before it has been packed or dispatched."],
      ["What if my order arrives damaged?", "Photograph the outer package and product, then contact us within 48 hours of delivery. Our team will review the issue and arrange the appropriate resolution."],
    ],
  },
  {
    title: "Returns & support",
    questions: [
      ["Can I return an opened fragrance?", "For hygiene and safety reasons, opened or used fragrance products cannot normally be returned. Unopened products may be eligible under our return policy."],
      ["How should I store the bottle?", "Store it upright in a cool, dry place away from direct sunlight, heat and children. Do not leave a loose or open bottle inside a parked car."],
      ["How do I contact Autoroma?", "Use our contact page for product guidance, order support or any other enquiry. Our client-care team aims to reply within one working day."],
    ],
  },
] as const;

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-ink pb-24 pt-32 sm:pb-32 sm:pt-40">
      <Container className="max-w-[1320px]">
        <div className="grid gap-10 border-b border-white/10 pb-14 lg:grid-cols-[1fr_0.7fr] lg:items-end">
          <div>
            <p className="text-[0.58rem] uppercase tracking-[0.4em] text-gold-300">Client care</p>
            <h1 className="mt-5 text-balance font-display text-6xl leading-[0.88] tracking-[-0.05em] sm:text-8xl lg:text-9xl">
              Questions, answered.
            </h1>
          </div>
          <p className="max-w-md text-sm leading-7 text-mist/60 lg:justify-self-end">
            Everything you need to know about using, caring for and ordering your Autoroma car fragrance.
          </p>
        </div>

        <div className="mt-16 grid gap-16 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-24">
          <aside>
            <p className="text-[0.52rem] uppercase tracking-luxury text-gold-400">Need more help?</p>
            <p className="mt-5 text-sm leading-7 text-mist/55">Our team can help with product selection, usage and order support.</p>
            <Button href="/contact" variant="outline" showArrow className="mt-7">Contact us</Button>
          </aside>

          <div className="space-y-14">
            {faqGroups.map((group) => (
              <section key={group.title}>
                <h2 className="font-display text-3xl text-ivory sm:text-4xl">{group.title}</h2>
                <div className="mt-6 border-b border-white/10">
                  {group.questions.map(([question, answer], index) => (
                    <details key={question} className="group border-t border-white/10">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-sm text-ivory outline-none transition-colors hover:text-gold-300 focus-visible:text-gold-300 sm:text-base">
                        <span className="flex items-start gap-4">
                          <span className="mt-0.5 text-[0.5rem] tracking-luxury text-gold-400">{String(index + 1).padStart(2, "0")}</span>
                          {question}
                        </span>
                        <ChevronDown className="size-4 shrink-0 text-mist/45 transition-transform duration-300 group-open:rotate-180" />
                      </summary>
                      <p className="max-w-2xl pb-7 pl-10 pr-8 text-sm leading-7 text-mist/60">{answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
