import type { Product } from "@/types/product";

// Products are managed exclusively from the admin panel.
export const products: Product[] = [];

export const getProduct = (slug: string) =>
  products.find((product) => product.slug === slug);

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
