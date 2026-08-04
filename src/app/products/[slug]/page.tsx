import type { Metadata } from "next";

import { ProductDetailView } from "@/components/product/product-detail-view";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const slug = (await params).slug;
  const title = slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    title: title || "Fragrance",
    description: "Discover this Autoroma car fragrance.",
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  return <ProductDetailView slug={(await params).slug} />;
}
