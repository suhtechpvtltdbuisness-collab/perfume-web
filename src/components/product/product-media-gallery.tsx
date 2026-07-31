"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Play, Sparkles } from "lucide-react";
import { useState } from "react";

import { useMediaUrl } from "@/hooks/use-media-url";
import type { Product, ProductMedia } from "@/types/product";
import { BottleArt } from "@/components/ui/bottle-art";
import { cn } from "@/lib/utils";

export function ProductMediaGallery({ product }: { product: Product }) {
  const media = product.media ?? [];
  const [selected, setSelected] = useState(0);
  const active = media[selected];

  if (media.length === 0) {
    return (
      <div className="relative border border-white/[0.08] bg-[#090909]">
        <BottleArt accent={product.accent} name={product.name} className="max-h-[76vh]" />
        <div className="pointer-events-none absolute inset-6 border border-gold-300/[0.06]" />
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-[5.5rem_1fr]">
      <div className="order-2 flex gap-3 overflow-x-auto sm:order-1 sm:flex-col">
        {media.map((asset, index) => (
          <GalleryThumbnail
            key={asset.id}
            asset={asset}
            active={selected === index}
            onClick={() => setSelected(index)}
          />
        ))}
      </div>
      <div className="order-1 relative aspect-[4/5] overflow-hidden border border-white/10 bg-[#070707] sm:order-2">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(199,163,93,0.12),transparent_55%)]" />
        <AnimatePresence mode="wait">
          {active && <GalleryStage key={active.id} asset={active} productName={product.name} />}
        </AnimatePresence>
        <div className="pointer-events-none absolute inset-5 border border-white/[0.06]" />
        <div className="absolute bottom-7 left-7 flex items-center gap-2 text-[0.48rem] uppercase tracking-luxury text-white/50">
          <Sparkles className="size-3 text-gold-300" />
          {selected + 1} / {media.length}
        </div>
      </div>
    </div>
  );
}

function GalleryStage({ asset, productName }: { asset: ProductMedia; productName: string }) {
  const url = useMediaUrl(asset.id);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.035, filter: "blur(8px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.985 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0"
    >
      {url && asset.type === "image" && (
        <Image src={url} alt={`${productName} — ${asset.name}`} fill unoptimized priority className="object-cover" />
      )}
      {url && asset.type === "video" && (
        <video src={url} controls playsInline autoPlay muted loop className="size-full object-cover" />
      )}
      {!url && <div className="size-full animate-pulse bg-white/[0.03]" />}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/[0.035]" />
    </motion.div>
  );
}

function GalleryThumbnail({ asset, active, onClick }: { asset: ProductMedia; active: boolean; onClick: () => void }) {
  const url = useMediaUrl(asset.id);
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`View ${asset.name}`}
      className={cn(
        "relative aspect-square w-20 shrink-0 overflow-hidden border bg-[#090909] transition sm:w-full",
        active ? "border-gold-300" : "border-white/10 opacity-55 hover:opacity-100",
      )}
    >
      {url && asset.type === "image" && <Image src={url} alt="" fill unoptimized className="object-cover" />}
      {url && asset.type === "video" && (
        <>
          <video src={url} muted className="size-full object-cover" />
          <Play className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 fill-white" />
        </>
      )}
    </button>
  );
}
