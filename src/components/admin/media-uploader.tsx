"use client";

import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { Film, GripVertical, ImageIcon, Trash2, UploadCloud } from "lucide-react";
import Image from "next/image";

import { deleteMediaBlob, saveMediaBlob } from "@/lib/media-store";
import { useMediaUrl } from "@/hooks/use-media-url";
import type { ProductMedia } from "@/types/product";
import { cn } from "@/lib/utils";

export function MediaUploader({
  value,
  onChange,
}: {
  value: ProductMedia[];
  onChange: (media: ProductMedia[]) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const processFiles = async (files: File[]) => {
    setMessage(null);
    setUploading(true);
    const accepted: ProductMedia[] = [];

    for (const file of files) {
      const type = file.type.startsWith("image/")
        ? "image"
        : file.type.startsWith("video/")
          ? "video"
          : null;
      const limit = type === "video" ? 100 * 1024 * 1024 : 15 * 1024 * 1024;
      if (!type || file.size > limit) {
        setMessage(`${file.name} skipped. Images: 15 MB max, videos: 100 MB max.`);
        continue;
      }
      const id = crypto.randomUUID();
      await saveMediaBlob(id, file);
      accepted.push({ id, name: file.name, type });
    }

    onChange([...value, ...accepted]);
    setUploading(false);
  };

  const onInput = (event: ChangeEvent<HTMLInputElement>) => {
    void processFiles(Array.from(event.target.files ?? []));
    event.target.value = "";
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    void processFiles(Array.from(event.dataTransfer.files));
  };

  const remove = async (asset: ProductMedia) => {
    await deleteMediaBlob(asset.id);
    onChange(value.filter((item) => item.id !== asset.id));
  };

  const makeCover = (asset: ProductMedia) => {
    onChange([asset, ...value.filter((item) => item.id !== asset.id)]);
  };

  return (
    <div className="sm:col-span-2">
      <div className="mb-3">
        <p className="text-[0.5rem] uppercase tracking-luxury text-mist/60">Product gallery</p>
        <p className="mt-1 text-xs leading-5 text-mist/35">
          Multiple images or videos select karo. Pehli image collection cover hogi.
        </p>
      </div>
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "flex min-h-40 cursor-pointer flex-col items-center justify-center border border-dashed p-7 text-center transition",
          dragging ? "border-gold-300 bg-gold-300/[0.08]" : "border-white/15 bg-black/30 hover:border-gold-300/50",
        )}
        onClick={() => input.current?.click()}
      >
        <UploadCloud className="size-8 text-gold-300" />
        <p className="mt-4 text-sm text-ivory">{uploading ? "Uploading media…" : "Drop images/videos here"}</p>
        <p className="mt-2 text-[0.52rem] uppercase tracking-editorial text-mist/35">or click to browse · JPG, PNG, WebP, MP4, WebM</p>
        <input ref={input} type="file" multiple accept="image/*,video/*" onChange={onInput} className="hidden" />
      </div>
      {message && <p className="mt-3 text-xs text-amber-200">{message}</p>}
      {value.length > 0 && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {value.map((asset, index) => (
            <AdminMediaItem
              key={asset.id}
              asset={asset}
              cover={index === 0}
              onCover={() => makeCover(asset)}
              onRemove={() => void remove(asset)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function AdminMediaItem({
  asset,
  cover,
  onCover,
  onRemove,
}: {
  asset: ProductMedia;
  cover: boolean;
  onCover: () => void;
  onRemove: () => void;
}) {
  const url = useMediaUrl(asset.id);
  return (
    <div className="group relative flex items-center gap-3 border border-white/10 bg-black/40 p-3">
      <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden bg-white/[0.04]">
        {url && asset.type === "image" && <Image src={url} alt="" fill unoptimized className="object-cover" />}
        {url && asset.type === "video" && <video src={url} muted className="size-full object-cover" />}
        {!url && (asset.type === "image" ? <ImageIcon className="size-5 text-mist/30" /> : <Film className="size-5 text-mist/30" />)}
        {cover && <span className="absolute left-1 top-1 bg-gold-300 px-1.5 py-0.5 text-[0.4rem] uppercase tracking-wider text-ink">Cover</span>}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs text-mist/70">{asset.name}</p>
        {!cover && <button type="button" onClick={onCover} className="mt-2 text-[0.46rem] uppercase tracking-editorial text-gold-300">Make cover</button>}
      </div>
      <GripVertical className="size-4 text-mist/20" />
      <button type="button" aria-label={`Remove ${asset.name}`} onClick={onRemove} className="p-2 text-mist/35 hover:text-red-300"><Trash2 className="size-3.5" /></button>
    </div>
  );
}
