import { products } from "@/constants/products";
import type { ManagedSiteContent } from "@/types/site-content";

export const defaultSiteContent: ManagedSiteContent = {
  landing: {
    announcement: "Complimentary delivery across India",
    signatureEyebrow: "Our signature",
    signatureTitle: "Intensity, held in perfect restraint.",
    signatureDescription:
      "Built around precious oud and saffron, our signature balances shadow and light. Each formula is rested until every note moves as one.",
    storyQuote: "Perfume begins where memory refuses to end.",
    storyDescription:
      "Four generations of perfumers have pursued one idea: emotion can be distilled, refined and worn.",
    newsletterTitle: "Letters from the maison.",
    newsletterDescription:
      "New compositions, private releases and rituals from our perfumers. Sent with restraint.",
  },
  products,
};
