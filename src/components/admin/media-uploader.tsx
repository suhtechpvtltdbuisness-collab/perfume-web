"use client";

import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { ArrowLeft, ArrowRight, Film, GripVertical, ImageIcon, Trash2, UploadCloud } from "lucide-react";
import Image from "next/image";

import { useAuth } from "@/components/providers/auth-provider";
import { deleteMediaBlob, saveMediaBlob } from "@/lib/media-store";
import { perfumeApi } from "@/lib/perfume-api";
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
  const { accessToken } = useAuth();
  const [dragging, setDragging] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
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

      try {
        if (accessToken) {
          accepted.push(await perfumeApi.upload(file, accessToken));
        } else {
          const id = crypto.randomUUID();
          await saveMediaBlob(id, file);
          accepted.push({ id, name: file.name, type });
        }
      } catch (error) {
        setMessage(error instanceof Error ? error.message : `Failed to upload ${file.name}`);
      }
    }

    if (accepted.length) onChange([...value, ...accepted]);
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
    if (!asset.url) await deleteMediaBlob(asset.id);
    onChange(value.filter((item) => item.id !== asset.id));
  };

  const makeCover = (asset: ProductMedia) => {
    onChange([asset, ...value.filter((item) => item.id !== asset.id)]);
  };

  const move = (from: number, to: number) => {
    if (from === to || to < 0 || to >= value.length) return;
    const next = [...value];
    const [asset] = next.splice(from, 1);
    if (!asset) return;
    next.splice(to, 0, asset);
    onChange(next);
  };

  return (
    <div className="sm:col-span-2">
      <div className="mb-3">
        <p className="text-[0.68rem] uppercase tracking-luxury text-ivory/95">Product gallery</p>
        <p className="mt-1 text-sm leading-6 text-ivory/95">
          Images upload to cloud storage. The first asset becomes the collection cover.
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
          dragging ? "border-gold-300 bg-gold-300/[0.08]" : "border-white/20 bg-black/30 hover:border-gold-300/50",
        )}
        onClick={() => input.current?.click()}
      >
        <UploadCloud className="size-8 text-gold-300" />
        <p className="mt-4 text-sm text-ivory">{uploading ? "Uploading media…" : "Drop images/videos here"}</p>
        <p className="mt-2 text-[0.6rem] uppercase tracking-editorial text-ivory/95">or click to browse · JPG, PNG, WebP, MP4, WebM</p>
        <input ref={input} type="file" multiple accept="image/*,video/*" onChange={onInput} className="hidden" />
      </div>
      {message && <p className="mt-3 text-xs text-amber-200">{message}</p>}
      {value.length > 0 && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {value.map((asset, index) => (
            <AdminMediaItem
              key={asset.id}
              asset={asset}
              index={index}
              total={value.length}
              cover={index === 0}
              dragging={draggedIndex === index}
              onCover={() => makeCover(asset)}
              onRemove={() => void remove(asset)}
              onMoveBackward={() => move(index, index - 1)}
              onMoveForward={() => move(index, index + 1)}
              onDragStart={() => setDraggedIndex(index)}
              onDragEnd={() => setDraggedIndex(null)}
              onDropAt={() => {
                if (draggedIndex !== null) move(draggedIndex, index);
                setDraggedIndex(null);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function AdminMediaItem({
  asset,
  index,
  total,
  cover,
  dragging,
  onCover,
  onRemove,
  onMoveBackward,
  onMoveForward,
  onDragStart,
  onDragEnd,
  onDropAt,
}: {
  asset: ProductMedia;
  index: number;
  total: number;
  cover: boolean;
  dragging: boolean;
  onCover: () => void;
  onRemove: () => void;
  onMoveBackward: () => void;
  onMoveForward: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDropAt: () => void;
}) {
  const localUrl = useMediaUrl(asset.url ? undefined : asset.id);
  const url = asset.url ?? localUrl;

  return (
    <div
      draggable
      onDragStart={(event) => {
        event.dataTransfer.effectAllowed = "move";
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      onDragOver={(event) => {
        event.preventDefault();
        event.stopPropagation();
        event.dataTransfer.dropEffect = "move";
      }}
      onDrop={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onDropAt();
      }}
      className={cn(
        "group relative flex items-center gap-3 border bg-black/40 p-3 transition",
        dragging ? "border-gold-300 opacity-55" : "border-white/20",
      )}
    >
      <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden bg-white/[0.06]">
        {url && asset.type === "image" && <Image src={url} alt="" fill unoptimized className="object-cover" />}
        {url && asset.type === "video" && <video src={url} muted className="size-full object-cover" />}
        {!url && (asset.type === "image" ? <ImageIcon className="size-5 text-ivory" /> : <Film className="size-5 text-ivory" />)}
        {cover && <span className="absolute left-1 top-1 bg-gold-300 px-1.5 py-0.5 text-[0.5rem] uppercase tracking-wider text-ink">Cover</span>}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs text-ivory">{asset.name}</p>
        {!cover && <button type="button" onClick={onCover} className="mt-2 text-[0.62rem] uppercase tracking-editorial text-gold-300">Make cover</button>}
      </div>
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          aria-label={`Move ${asset.name} backward`}
          onClick={onMoveBackward}
          disabled={index === 0}
          className="p-1.5 text-ivory/80 hover:text-gold-300 disabled:pointer-events-none disabled:opacity-20 sm:hidden"
        >
          <ArrowLeft className="size-3.5" />
        </button>
        <span title="Drag to reorder" aria-label="Drag to reorder" className="cursor-grab p-1.5 text-ivory/80 active:cursor-grabbing">
          <GripVertical className="size-4" />
        </span>
        <button
          type="button"
          aria-label={`Move ${asset.name} forward`}
          onClick={onMoveForward}
          disabled={index === total - 1}
          className="p-1.5 text-ivory/80 hover:text-gold-300 disabled:pointer-events-none disabled:opacity-20 sm:hidden"
        >
          <ArrowRight className="size-3.5" />
        </button>
      </div>
      <button type="button" aria-label={`Remove ${asset.name}`} onClick={onRemove} className="p-2 text-ivory/95 hover:text-red-300"><Trash2 className="size-3.5" /></button>
    </div>
  );
}
