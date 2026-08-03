"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { X } from "lucide-react";

import { MediaUploader } from "@/components/admin/media-uploader";
import { Button } from "@/components/ui/button";
import { BottleArt } from "@/components/ui/bottle-art";
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

const SIZES = ["30 ml", "50 ml", "75 ml", "100 ml"] as const;

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
    <div className="fixed inset-0 z-[160] flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <form
        onSubmit={submit}
        data-lenis-prevent
        className="relative z-10 flex max-h-[92dvh] w-full max-w-4xl flex-col overflow-hidden border border-white/10 bg-obsidian shadow-2xl sm:max-h-[88vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="perfume-modal-title"
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-white/10 px-5 py-5 sm:px-8">
          <div>
            <p className="text-[0.5rem] uppercase tracking-luxury text-gold-300">
              {isNew ? "New fragrance" : "Edit fragrance"}
            </p>
            <h2 id="perfume-modal-title" className="mt-2 font-display text-3xl sm:text-4xl">
              {isNew ? "Add perfume" : draft.name || "Edit perfume"}
            </h2>
            <p className="mt-2 max-w-xl text-xs leading-5 text-mist/45">
              Fields match the shop card and product page: family, concentration, size, olfactory notes, story, and gallery.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="border border-white/10 p-2.5 text-mist/50 transition hover:border-gold-300/40 hover:text-ivory"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </header>

        <div className="min-h-0 flex-1 touch-pan-y overflow-y-auto overscroll-contain px-5 py-6 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_14rem]">
            <div className="space-y-8">
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
                  <label className="flex items-end gap-3 pb-4 text-xs text-mist/60">
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

              <Section number="04" title="Visuals" help="Accent colours the bottle placeholder. Gallery media becomes the shop cover.">
                <div className="mb-5">
                  <p className="mb-3 text-[0.5rem] uppercase tracking-luxury text-mist/50">Bottle accent</p>
                  <div className="flex flex-wrap gap-2">
                    {ACCENTS.map((accent) => (
                      <button
                        key={accent.value}
                        type="button"
                        onClick={() => setField("accent", accent.value)}
                        className={cn(
                          "flex items-center gap-2 border px-3 py-2 text-[0.48rem] uppercase tracking-editorial transition",
                          draft.accent === accent.value
                            ? "border-gold-300 text-gold-300"
                            : "border-white/10 text-mist/45 hover:border-white/25 hover:text-ivory",
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

            <aside className="hidden lg:block">
              <div className="sticky top-0 space-y-4">
                <p className="text-[0.5rem] uppercase tracking-luxury text-mist/45">Live preview</p>
                <BottleArt
                  accent={draft.accent || ACCENTS[0].value}
                  name={draft.name || "New scent"}
                  className="border border-white/10 bg-black/40"
                />
                <div className="border border-white/10 bg-white/[0.02] p-4">
                  <p className="text-[0.48rem] uppercase tracking-luxury text-gold-300">
                    {draft.family || "Family"}
                  </p>
                  <p className="mt-2 font-display text-2xl leading-none">
                    {draft.name || "Fragrance name"}
                  </p>
                  <p className="mt-2 text-[0.48rem] uppercase tracking-editorial text-mist/40">
                    {draft.subtitle || "Eau de Parfum"} · {draft.size || "75 ml"}
                  </p>
                  {draft.price > 0 && (
                    <p className="mt-4 font-display text-xl text-ivory">
                      ₹{draft.price.toLocaleString("en-IN")}
                    </p>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>

        <footer className="flex shrink-0 flex-col gap-3 border-t border-white/10 bg-obsidian/95 px-5 py-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-8">
          {error ? <p className="text-xs text-red-300">{error}</p> : <span className="text-xs text-mist/35">Esc to close</span>}
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : isNew ? "Add perfume" : "Save changes"}
            </Button>
          </div>
        </footer>
      </form>
    </div>
  );
}

const inputClass =
  "h-12 w-full border border-white/10 bg-black/40 px-4 text-sm text-ivory outline-none transition focus:border-gold-300/60";

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
    <section className="border border-white/10 bg-white/[0.018] p-5 sm:p-6">
      <div className="mb-5 flex items-baseline gap-3">
        <span className="text-[0.5rem] tracking-luxury text-gold-300">{number}</span>
        <div>
          <h3 className="font-display text-2xl">{title}</h3>
          <p className="mt-1 text-xs text-mist/40">{help}</p>
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
      <span className="mb-2 block text-[0.5rem] uppercase tracking-luxury text-mist/50">{label}</span>
      {children}
      {help && <span className="mt-2 block text-[0.65rem] text-mist/30">{help}</span>}
    </label>
  );
}
