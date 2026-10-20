export interface ProductMedia {
  id: string;
  name: string;
  type: "image" | "video";
  url?: string;
}

export interface ComboItem {
  productId: string;
  quantity: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  family: string;
  price: number;
  originalPrice?: number;
  size: string;
  description: string;
  notes: string[];
  accent: string;
  featured?: boolean;
  media?: ProductMedia[];
  isCombo?: boolean;
  comboItems?: ComboItem[];
}

