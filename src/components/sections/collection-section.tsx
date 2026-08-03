"use client";

import { Container } from "@/components/ui/container";
import { ProductCard } from "@/components/product/product-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { useSiteContent } from "@/components/providers/site-content-provider";
import { Reveal } from "@/components/animations/reveal";

export function CollectionSection() {
  const { products } = useSiteContent();
  const featured = products.filter((product) => product.featured);
  const visible = (featured.length >= 4 ? featured : products).slice(0, 4);

  return (
    <section id="collection" className="bg-ink py-28 sm:py-36 lg:py-44">
      <Container>
        <Reveal>
          <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading eyebrow="The collection" title="Scent, as an object of desire." />
            <Button href="/shop" variant="outline" showArrow>View all fragrances</Button>
          </div>
        </Reveal>
        <div className="mt-16 grid gap-x-6 gap-y-14 md:grid-cols-2 xl:grid-cols-4">
          {visible.map((product, index) => (
            <Reveal key={product.id} delay={index * 0.1}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
