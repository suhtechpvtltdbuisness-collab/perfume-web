"use client";

import { Container } from "@/components/ui/container";
import { ProductCard } from "@/components/product/product-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { useSiteContent } from "@/components/providers/site-content-provider";
import { Reveal } from "@/components/animations/reveal";

export function CollectionSection() {
  const { landing, products, productsLoading } = useSiteContent();

  return (
    <section id="collection" className="bg-ink py-28 sm:py-36 lg:py-44">
      <Container>
        <Reveal>
          <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading eyebrow={landing.collectionEyebrow} title={landing.collectionTitle} />
            <Button href={landing.collectionCtaHref} variant="outline" showArrow>{landing.collectionCtaLabel}</Button>
          </div>
        </Reveal>

        {productsLoading ? (
          <p className="mt-16 text-sm text-mist/75">Loading fragrances…</p>
        ) : products.length === 0 ? (
          <p className="mt-16 max-w-md text-base leading-7 text-mist/75">
            {landing.collectionEmptyMessage}
          </p>
        ) : (
          <div className="mt-16 grid auto-rows-fr grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-6 sm:gap-y-14 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product, index) => (
              <Reveal key={product.id} delay={(index % 4) * 0.08} className="h-full">
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
