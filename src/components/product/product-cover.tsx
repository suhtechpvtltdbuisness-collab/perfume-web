"use client";

import Image from "next/image";
import { Play } from "lucide-react";

import { useMediaUrl } from "@/hooks/use-media-url";
import type { Product } from "@/types/product";
import { BottleArt } from "@/components/ui/bottle-art";

export function ProductCover({ product, className }: { product: Product; className?: string }) {
  const cover = product.media?.[0];
  const localUrl = useMediaUrl(cover?.url ? undefined : cover?.id);
  const url = cover?.url ?? localUrl;

  if (!cover || !url) {
    return <BottleArt accent={product.accent} name={product.name} className={className} />;
  }

  return (
    <div className={`relative aspect-[4/5] overflow-hidden bg-[#080808] ${className ?? ""}`}>
      {cover.type === "image" ? (
        <Image
          src={url}
          alt={product.name}
          fill
          unoptimized
          className="object-cover transition-transform duration-1000 ease-luxury group-hover:scale-105"
        />
      ) : (
        <>
          <video src={url} muted playsInline className="size-full object-cover" />
          <span className="absolute left-1/2 top-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/30 backdrop-blur">
            <Play className="size-4 fill-white" />
          </span>
        </>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-white/[0.04]" />
    </div>
  );
}
