export interface ProductMedia {
  id: string;
  name: string;
  type: "image" | "video";
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  family: string;
  price: number;
  size: string;
  description: string;
  notes: string[];
  accent: string;
  featured?: boolean;
  media?: ProductMedia[];
}
