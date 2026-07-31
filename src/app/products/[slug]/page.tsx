import type { Metadata } from "next";

import { getProduct, products } from "@/constants/products";
import { ProductDetailView } from "@/components/product/product-detail-view";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = getProduct((await params).slug);
  return product
    ? { title: product.name, description: product.description }
    : { title: "Fragrance not found" };
}

export default async function ProductPage({ params }: ProductPageProps) {
  return <ProductDetailView slug={(await params).slug} />;
}
