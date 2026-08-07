"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { X } from "lucide-react";

import { MediaUploader } from "@/components/admin/media-uploader";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

const SUBTITLES = [
  "Eau de Parfum",
  "Eau de Toilette",
  "Extrait de Parfum",
  "Parfum",
  "Cologne",
] as const;

const FAMILIES = [
  "Woody · Amber",
  "Woody · Spicy",
  "Floral · Soft",
  "Floral · Oriental",
  "Amber · Gourmand",
  "Amber · Resinous",
  "Marine · Citrus",
  "Marine · Fresh",
] as const;

const SIZES = ["10 ml", "30 ml", "50 ml", "75 ml", "100 ml"] as const;

const ACCENTS = [
  { label: "Oud amber", value: "bg-[#8b5a3c]" },
  { label: "Gold resin", value: "bg-[#93601f]" },
  { label: "Rose blush", value: "bg-[#9a4d5c]" },
  { label: "Marine mist", value: "bg-[#3d5a6c]" },
  { label: "Violet dusk", value: "bg-[#5c4a7a]" },
  { label: "Green leaf", value: "bg-[#4a6b4f]" },
  { label: "Ivory musk", value: "bg-[#8a8070]" },
  { label: "Crimson spice", value: "bg-[#7a3030]" },
] as const;

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function PerfumeFormModal({
  product,
  onClose,
  onSave,
}: {
  product: Product;
  onClose: () => void;
  onSave: (product: Product) => void | Promise<void>;
}) {
  const isNew = !product.name;
  const [draft, setDraft] = useState<Product>(product);
  const [slugTouched, setSlugTouched] = useState(Boolean(product.slug));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const setField = <K extends keyof Product>(key: K, value: Product[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const setName = (name: string) => {
    setDraft((current) => ({
      ...current,
      name,
      slug: slugTouched ? current.slug : slugify(name),
    }));
  };

  const setNote = (index: 0 | 1 | 2, value: string) => {
    const notes = [...draft.notes];
    while (notes.length < 3) notes.push("");
    notes[index] = value;
    setField("notes", notes);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const name = draft.name.trim();
    const slug = (draft.slug || slugify(name)).trim();
    const description = draft.description.trim();
    const notes = draft.notes.map((note) => note.trim()).filter(Boolean);

    if (!name) {
      setError("Fragrance name is required.");
      return;
    }
    if (!slug) {
      setError("URL slug is required.");
      return;
    }
    if (!draft.family.trim()) {
      setError("Olfactory family is required.");
      return;
    }
    if (!Number.isFinite(draft.price) || draft.price <= 0) {
      setError("Enter a valid price in INR.");
      return;
    }
    if (!description) {
      setError("Add a short fragrance story.");
      return;
    }
    if (notes.length < 3) {
      setError("Add top, heart, and base notes.");
      return;
    }

    setSaving(true);
    try {
      await onSave({
        ...draft,
        name,
        slug,
        subtitle: draft.subtitle.trim() || "Eau de Parfum",
        family: draft.family.trim(),
        size: draft.size.trim() || "75 ml",
        description,
        notes,
        accent: draft.accent || ACCENTS[0].value,
        media: draft.media ?? [],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save perfume");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[160] flex items-end justify-center sm:items-center sm:p-4 lg:p-6">
      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <form
        onSubmit={submit}
        data-lenis-prevent
        className="relative z-10 flex max-h-[100dvh] w-full flex-col overflow-hidden rounded-t-2xl border border-white/20 bg-obsidian shadow-2xl sm:max-h-[92dvh] sm:max-w-5xl sm:rounded-2xl xl:max-w-6xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="perfume-modal-title"
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-white/20 px-4 py-4 sm:px-7 sm:py-5 lg:px-8">
          <div className="min-w-0">
            <p className="text-[0.68rem] uppercase tracking-luxury text-gold-300">
              {isNew ? "New fragrance" : "Edit fragrance"}
            </p>
            <h2 id="perfume-modal-title" className="mt-2 truncate font-display text-3xl sm:text-4xl">
              {isNew ? "Add perfume" : draft.name || "Edit perfume"}
            </h2>
            <p className="mt-2 hidden max-w-2xl text-sm leading-6 text-ivory/85 sm:block">
              Fields match the shop card and product page: family, concentration, size, olfactory notes, story, and gallery.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 border border-white/20 p-2.5 text-ivory transition hover:border-gold-300/40 hover:text-ivory"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </header>

        <div className="min-h-0 flex-1 touch-pan-y overflow-y-auto overflow-x-hidden overscroll-contain px-4 py-5 sm:px-7 sm:py-6 lg:px-8">
          <div className="grid min-w-0 gap-8 xl:grid-cols-[minmax(0,1fr)_18rem]">
            <div className="min-w-0 space-y-6 sm:space-y-8">
              <Section number="01" title="Identity" help="Shown on cards, detail page, and bottle label.">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Fragrance name" wide>
                    <input
                      required
                      value={draft.name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Nocturne Oud"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="URL slug" help="Used in /products/your-slug">
                    <input
                      required
                      value={draft.slug}
                      onChange={(event) => {
                        setSlugTouched(true);
                        setField("slug", slugify(event.target.value));
                      }}
                      placeholder="nocturne-oud"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Concentration">
                    <select
                      value={draft.subtitle}
                      onChange={(event) => setField("subtitle", event.target.value)}
                      className={inputClass}
                    >
                      {SUBTITLES.map((item) => (
                        <option key={item} value={item} className="bg-ink text-ivory">
                          {item}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Bottle size">
                    <select
                      value={draft.size}
                      onChange={(event) => setField("size", event.target.value)}
                      className={inputClass}
                    >
                      {SIZES.map((item) => (
                        <option key={item} value={item} className="bg-ink text-ivory">
                          {item}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
              </Section>

              <Section number="02" title="Olfactory profile" help="Family drives shop filters. Notes appear on the product page.">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Fragrance family" wide help="Must include Woody, Floral, Amber, or Marine for shop filters.">
                    <select
                      value={FAMILIES.includes(draft.family as (typeof FAMILIES)[number]) ? draft.family : "__custom"}
                      onChange={(event) => {
                        if (event.target.value === "__custom") setField("family", "");
                        else setField("family", event.target.value);
                      }}
                      className={inputClass}
                    >
                      {FAMILIES.map((item) => (
                        <option key={item} value={item} className="bg-ink text-ivory">
                          {item}
                        </option>
                      ))}
                      <option value="__custom" className="bg-ink text-ivory">
                        Custom family…
                      </option>
                    </select>
                  </Field>
                  {!FAMILIES.includes(draft.family as (typeof FAMILIES)[number]) && (
                    <Field label="Custom family" wide>
                      <input
                        required
                        value={draft.family}
                        onChange={(event) => setField("family", event.target.value)}
                        placeholder="Woody · Amber"
                        className={inputClass}
                      />
                    </Field>
                  )}
                  <Field label="Top note">
                    <input
                      required
                      value={draft.notes[0] ?? ""}
                      onChange={(event) => setNote(0, event.target.value)}
                      placeholder="Bergamot, saffron"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Heart note">
                    <input
                      required
                      value={draft.notes[1] ?? ""}
                      onChange={(event) => setNote(1, event.target.value)}
                      placeholder="Rose absolute, incense"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Base note" wide>
                    <input
                      required
                      value={draft.notes[2] ?? ""}
                      onChange={(event) => setNote(2, event.target.value)}
                      placeholder="Oud, amber, musk"
                      className={inputClass}
                    />
                  </Field>
                </div>
              </Section>

              <Section number="03" title="Story & pricing" help="Description and price on the product detail page.">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Price (INR)">
                    <input
                      required
                      type="number"
                      min={1}
                      step={1}
                      value={draft.price || ""}
                      onChange={(event) => setField("price", Number(event.target.value))}
                      placeholder="12500"
                      className={inputClass}
                    />
                  </Field>
                  <label className="flex items-end gap-3 pb-4 text-xs text-ivory/95">
                    <input
                      type="checkbox"
                      checked={draft.featured ?? false}
                      onChange={(event) => setField("featured", event.target.checked)}
                      className="size-4 accent-[#c4a574]"
                    />
                    Feature on homepage collection
                  </label>
                  <Field label="Fragrance story" wide help="2–4 lines describing the composition and mood.">
                    <textarea
                      required
                      rows={4}
                      value={draft.description}
                      onChange={(event) => setField("description", event.target.value)}
                      placeholder="A nocturnal composition of resinous oud and warm amber, composed for evenings that linger."
                      className={cn(inputClass, "h-auto py-4")}
                    />
                  </Field>
                </div>
              </Section>

              <Section number="04" title="Visuals" help="Accent adds a subtle glow to product images and colours the fallback bottle. The first gallery asset becomes the shop cover.">
                <div className="mb-5">
                  <p className="mb-3 text-[0.68rem] uppercase tracking-luxury text-ivory">Product accent</p>
                  <div className="flex flex-wrap gap-2">
                    {ACCENTS.map((accent) => (
                      <button
                        key={accent.value}
                        type="button"
                        onClick={() => setField("accent", accent.value)}
                        className={cn(
                          "flex items-center gap-2 border px-3 py-2 text-[0.62rem] uppercase tracking-editorial transition",
                          draft.accent === accent.value
                            ? "border-gold-300 text-gold-300"
                            : "border-white/20 text-ivory hover:border-white/25 hover:text-ivory",
                        )}
                      >
                        <span className={cn("size-3 rounded-full", accent.value)} />
                        {accent.label}
                      </button>
                    ))}
                  </div>
                </div>
                <MediaUploader
                  value={draft.media ?? []}
                  onChange={(media) => setField("media", media)}
                />
              </Section>
            </div>

            <aside className="hidden xl:block">
              <div className="sticky top-0 space-y-4">
                <p className="text-[0.68rem] uppercase tracking-luxury text-ivory">Live preview</p>
                <div className="pointer-events-none rounded-2xl border border-white/15 bg-black/30 p-3">
                  <ProductCard
                    product={{
                      ...draft,
                      name: draft.name || "Fragrance name",
                      slug: draft.slug || "preview",
                      subtitle: draft.subtitle || "Eau de Parfum",
                      family: draft.family || "Fragrance family",
                      size: draft.size || "75 ml",
                      price: draft.price || 0,
                      accent: draft.accent || ACCENTS[0].value,
                    }}
                  />
                </div>
                <p className="text-sm leading-6 text-ivory/75">
                  This is the same card customers will see in the collection.
                </p>
              </div>
            </aside>
          </div>
        </div>

        <footer className="shrink-0 border-t border-white/20 bg-obsidian/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 backdrop-blur sm:flex sm:items-center sm:justify-between sm:gap-4 sm:px-7 lg:px-8">
          {error ? <p className="mb-3 text-sm text-red-300 sm:mb-0">{error}</p> : <span className="hidden text-sm text-ivory/80 sm:block">Esc to close</span>}
          <div className="grid grid-cols-2 gap-3 sm:flex">
            <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="w-full sm:w-auto">
              {saving ? "Saving…" : isNew ? "Add perfume" : "Save changes"}
            </Button>
          </div>
        </footer>
      </form>
    </div>
  );
}

const inputClass =
  "h-14 w-full border border-white/30 bg-black/50 px-4 text-base text-ivory outline-none transition focus:border-gold-300";

function Section({
  number,
  title,
  help,
  children,
}: {
  number: string;
  title: string;
  help: string;
  children: ReactNode;
}) {
  return (
    <section className="min-w-0 border border-white/30 bg-white/[0.075] p-4 sm:p-6">
      <div className="mb-5 flex items-start gap-3">
        <span className="text-xs font-semibold tracking-luxury text-gold-300">{number}</span>
        <div className="min-w-0">
          <h3 className="font-display text-3xl text-ivory">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-ivory/90">{help}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  help,
  wide,
  children,
}: {
  label: string;
  help?: string;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <label className={cn("block", wide && "sm:col-span-2")}>
      <span className="mb-2 block text-xs font-semibold uppercase tracking-luxury text-ivory">{label}</span>
      {children}
      {help && <span className="mt-2 block text-sm leading-6 text-ivory/85">{help}</span>}
    </label>
  );
}
