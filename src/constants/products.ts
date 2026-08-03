import type { Product } from "@/types/product";

export const products: Product[] = [
  {
    id: "autoroma-001",
    slug: "nocturne-oud",
    name: "Nocturne Oud",
    subtitle: "Extrait de Parfum",
    family: "Woody · Amber",
    price: 18500,
    size: "75 ml",
    description:
      "A deep composition of smoked oud, saffron and mineral amber, softened by a quiet trace of rose.",
    notes: ["Saffron", "Laotian Oud", "Mineral Amber"],
    accent: "bg-[#8b5a3c]",
    featured: true,
  },
  {
    id: "autoroma-002",
    slug: "lumiere-rose",
    name: "Lumière Rose",
    subtitle: "Eau de Parfum",
    family: "Floral · Musk",
    price: 14200,
    size: "75 ml",
    description:
      "Rose centifolia illuminated by pink pepper, iris and a cloud of clean white musk.",
    notes: ["Pink Pepper", "Centifolia Rose", "White Musk"],
    accent: "bg-[#b97f79]",
    featured: true,
  },
  {
    id: "autoroma-003",
    slug: "santal-velours",
    name: "Santal Velours",
    subtitle: "Extrait de Parfum",
    family: "Woody · Creamy",
    price: 16800,
    size: "75 ml",
    description:
      "Creamy sandalwood wrapped in fig milk, orris butter and the warmth of tonka bean.",
    notes: ["Fig Milk", "Sandalwood", "Tonka Bean"],
    accent: "bg-[#9c8662]",
    featured: true,
  },
  {
    id: "autoroma-004",
    slug: "ambre-celeste",
    name: "Ambre Céleste",
    subtitle: "Eau de Parfum",
    family: "Amber · Spicy",
    price: 15600,
    size: "75 ml",
    description:
      "An incandescent amber cut with bergamot, incense and a smooth ribbon of vanilla.",
    notes: ["Bergamot", "Incense", "Madagascan Vanilla"],
    accent: "bg-[#b47c36]",
  },
  {
    id: "autoroma-005",
    slug: "iris-minuit",
    name: "Iris Minuit",
    subtitle: "Extrait de Parfum",
    family: "Powdery · Leather",
    price: 19200,
    size: "75 ml",
    description:
      "Precious iris meets violet leaf and supple suede in a composition of restrained intensity.",
    notes: ["Violet Leaf", "Florentine Iris", "Suede"],
    accent: "bg-[#625c78]",
  },
  {
    id: "autoroma-006",
    slug: "fleur-de-sel",
    name: "Fleur de Sel",
    subtitle: "Eau de Parfum",
    family: "Marine · Floral",
    price: 13800,
    size: "75 ml",
    description:
      "Salt air, neroli and sun-warmed skin—a luminous memory of the Mediterranean coast.",
    notes: ["Neroli", "Sea Salt", "Skin Musk"],
    accent: "bg-[#64868a]",
  },
];

export const getProduct = (slug: string) =>
  products.find((product) => product.slug === slug);

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
