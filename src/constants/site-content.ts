import { products } from "@/constants/products";
import type { LandingContent, ManagedSiteContent } from "@/types/site-content";

export const defaultLandingContent: LandingContent = {
  heroEyebrow: "The new olfactory signature",
  heroTitleLead: "Every drop",
  heroTitleHighlight: "defines elegance.",
  heroPrimaryCtaLabel: "Explore collection",
  heroPrimaryCtaHref: "/shop",
  heroScrollHint: "Scroll to unveil",
  heroSprayEyebrow: "The awakening",
  heroSprayTitle: "A thousand luminous molecules.",
  heroSprayDescription:
    "Scroll slowly. The cap lifts, the atomizer presses, and scent becomes light.",
  heroFinalEyebrow: "Autoroma",
  heroFinalTitle: "Crafted to remain.",
  heroFinalCtaLabel: "Discover the scents",
  heroFinalCtaHref: "/shop",

  announcement: "Complimentary delivery across India",

  signatureEyebrow: "Our signature",
  signatureTitle: "Intensity, held in perfect restraint.",
  signatureDescription:
    "Built around precious oud and saffron, our signature balances shadow and light. Each formula is rested until every note moves as one.",
  signatureBottleName: "Nocturne Oud",
  signatureBottleCaption: "House signature · 01",
  signatureStats: [
    { value: "27", label: "Rare materials" },
    { value: "18", label: "Months maturation" },
    { value: "34%", label: "Parfum concentration" },
  ],

  collectionEyebrow: "The collection",
  collectionTitle: "Scent, as an object of desire.",
  collectionCtaLabel: "View all fragrances",
  collectionCtaHref: "/shop",
  collectionEmptyMessage:
    "The catalogue is empty. Publish fragrances from the admin dashboard to feature them here.",

  storyEyebrow: "On the road · Since 1927",
  storyImageUrl: "/images/autoroma-car-fragrance-story.png",
  storyImageAlt: "Autoroma car fragrance in a premium interior",
  storyImageEyebrow: "Designed for motion",
  storyImageTitle: "A signature for every journey.",
  storyQuote: "Perfume begins where memory refuses to end.",
  storyDescription:
    "Four generations of perfumers have pursued one idea: emotion can be distilled, refined and worn.",
  storyCtaLabel: "Read our story",
  storyCtaHref: "/story",
  storyFooterNote: "Scent · Motion · Memory",

  ingredientsEyebrow: "The palette",
  ingredientsTitle: "The rarest materials. Nothing superfluous.",
  ingredientsDescription:
    "We work with growers, distillers and extractors whose materials have character before they enter a formula.",
  ingredients: [
    { name: "Oud Assafi", description: "A dark, resinous material aged for decades before extraction." },
    { name: "Iris Pallida", description: "Cultivated in Florence and rested for six years for its buttery depth." },
    { name: "Rose Centifolia", description: "Hand-picked at dawn in Grasse, when its aroma is most vivid." },
    { name: "Sandalwood", description: "Creamy, meditative and sourced through regenerative plantations." },
  ],

  experienceEyebrow: "Private consultation",
  experienceTitle: "Find the scent that feels inevitable.",
  experienceDescription:
    "An intimate discovery of materials, memories and the fragrance that belongs to you.",
  experienceCtaLabel: "Book an appointment",
  experienceCtaHref: "/contact",

  testimonials: [
    { quote: "Nocturne Oud feels less like fragrance and more like a beautifully kept secret.", author: "Verified client" },
    { quote: "The packaging, service and scent are considered down to the smallest detail.", author: "Verified client" },
    { quote: "Lumière Rose changes through the day and somehow becomes more personal.", author: "Verified client" },
  ],

  newsletterEyebrow: "The private list",
  newsletterTitle: "Letters from the maison.",
  newsletterDescription:
    "New compositions, private releases and rituals from our perfumers. Sent with restraint.",
  newsletterPlaceholder: "Your email address",
};

export const defaultSiteContent: ManagedSiteContent = {
  landing: defaultLandingContent,
  products,
};
