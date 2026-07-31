import type { Product } from "@/types/product";

export interface LandingContent {
  announcement: string;
  signatureEyebrow: string;
  signatureTitle: string;
  signatureDescription: string;
  storyQuote: string;
  storyDescription: string;
  newsletterTitle: string;
  newsletterDescription: string;
}

export interface ManagedSiteContent {
  landing: LandingContent;
  products: Product[];
}
