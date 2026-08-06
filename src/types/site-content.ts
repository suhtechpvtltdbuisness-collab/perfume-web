import type { Product } from "@/types/product";

export interface LandingStat {
  value: string;
  label: string;
}

export interface LandingIngredient {
  name: string;
  description: string;
}

export interface LandingTestimonial {
  quote: string;
  author: string;
}

export interface LandingContent {
  heroEyebrow: string;
  heroTitleLead: string;
  heroTitleHighlight: string;
  heroPrimaryCtaLabel: string;
  heroPrimaryCtaHref: string;
  heroScrollHint: string;
  heroSprayEyebrow: string;
  heroSprayTitle: string;
  heroSprayDescription: string;
  heroFinalEyebrow: string;
  heroFinalTitle: string;
  heroFinalCtaLabel: string;
  heroFinalCtaHref: string;

  announcement: string;

  signatureEyebrow: string;
  signatureTitle: string;
  signatureDescription: string;
  signatureBottleName: string;
  signatureBottleCaption: string;
  signatureStats: LandingStat[];

  collectionEyebrow: string;
  collectionTitle: string;
  collectionCtaLabel: string;
  collectionCtaHref: string;
  collectionEmptyMessage: string;

  storyEyebrow: string;
  storyImageUrl: string;
  storyImageAlt: string;
  storyImageEyebrow: string;
  storyImageTitle: string;
  storyQuote: string;
  storyDescription: string;
  storyCtaLabel: string;
  storyCtaHref: string;
  storyFooterNote: string;

  ingredientsEyebrow: string;
  ingredientsTitle: string;
  ingredientsDescription: string;
  ingredients: LandingIngredient[];

  experienceEyebrow: string;
  experienceTitle: string;
  experienceDescription: string;
  experienceCtaLabel: string;
  experienceCtaHref: string;

  testimonials: LandingTestimonial[];

  newsletterEyebrow: string;
  newsletterTitle: string;
  newsletterDescription: string;
  newsletterPlaceholder: string;
}

export type LandingTextKey = {
  [K in keyof LandingContent]: LandingContent[K] extends string ? K : never;
}[keyof LandingContent];

export type LandingListKey = {
  [K in keyof LandingContent]: LandingContent[K] extends string ? never : K;
}[keyof LandingContent];

export interface ManagedSiteContent {
  landing: LandingContent;
  products: Product[];
}
