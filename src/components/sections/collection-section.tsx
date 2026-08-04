"use client";

import { Container } from "@/components/ui/container";
import { ProductCard } from "@/components/product/product-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { useSiteContent } from "@/components/providers/site-content-provider";
import { Reveal } from "@/components/animations/reveal";

export function CollectionSection() {
  const { products, productsLoading } = useSiteContent();

  return (
    <section id="collection" className="bg-ink py-28 sm:py-36 lg:py-44">
      <Container>
        <Reveal>
          <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading eyebrow="The collection" title="Scent, as an object of desire." />
            <Button href="/shop" variant="outline" showArrow>View all fragrances</Button>
          </div>
        </Reveal>

        {productsLoading ? (
          <p className="mt-16 text-sm text-mist/50">Loading fragrances…</p>
        ) : products.length === 0 ? (
          <p className="mt-16 max-w-md text-sm leading-7 text-mist/55">
            The catalogue is empty. Publish fragrances from the admin dashboard to feature them here.
          </p>
        ) : (
          <div className="mt-16 grid auto-rows-fr gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
