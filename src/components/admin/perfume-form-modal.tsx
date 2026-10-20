"use client";

import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Check, Layers, Minus, Package, Plus, Search, Sparkles, Trash2, X } from "lucide-react";

import { MediaUploader } from "@/components/admin/media-uploader";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ComboItem, Product } from "@/types/product";
import { formatPrice } from "@/constants/products";

const SUBTITLES = [
  "Eau de Parfum",
  "Eau de Toilette",
  "Extrait de Parfum",
  "Parfum",
  "Cologne",
  "Curated Duo",
  "Curated Trio",
  "Discovery Set",
  "Gift Set",
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
  "Curated Combo",
] as const;

const SIZES = [
  "10 ml",
  "30 ml",
  "50 ml",
  "75 ml",
  "100 ml",
  "Set of 2",
  "Set of 3",
  "Set of 4",
  "2 x 50 ml",
  "3 x 50 ml",
  "2 x 100 ml",
  "3 x 10 ml",
] as const;

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
  products = [],
  onClose,
  onSave,
}: {
  product: Product;
  products?: Product[];
  onClose: () => void;
  onSave: (product: Product) => void | Promise<void>;
}) {
  const isNew = !product.name;
  const [draft, setDraft] = useState<Product>(product);
  const [slugTouched, setSlugTouched] = useState(Boolean(product.slug));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [productSearch, setProductSearch] = useState("");

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

  // Available single products to bundle (exclude self and other combos)
  const availableSingleProducts = useMemo(() => {
    const search = productSearch.toLowerCase().trim();
    return products.filter((p) => {
      if (p.id === draft.id || p.isCombo) return false;
      if (!search) return true;
      return (
        p.name.toLowerCase().includes(search) ||
        p.family.toLowerCase().includes(search) ||
        p.subtitle.toLowerCase().includes(search)
      );
    });
  }, [products, draft.id, productSearch]);

  // Compute combined original price of items in combo
  const computedOriginalPrice = useMemo(() => {
    if (!draft.comboItems || draft.comboItems.length === 0) return 0;
    return draft.comboItems.reduce((total, item) => {
      const found = products.find((p) => p.id === item.productId);
      return total + (found?.price ?? 0) * item.quantity;
    }, 0);
  }, [draft.comboItems, products]);

  const addComboItem = (productId: string) => {
    const existing = draft.comboItems ?? [];
    const itemIndex = existing.findIndex((item) => item.productId === productId);
    let next: ComboItem[];
    if (itemIndex >= 0) {
      next = existing.map((item, idx) =>
        idx === itemIndex ? { ...item, quantity: item.quantity + 1 } : item,
      );
    } else {
      next = [...existing, { productId, quantity: 1 }];
    }
    setField("comboItems", next);

    // Update originalPrice automatically
    const newOriginalPrice = next.reduce((total, item) => {
      const found = products.find((p) => p.id === item.productId);
      return total + (found?.price ?? 0) * item.quantity;
    }, 0);
    setField("originalPrice", newOriginalPrice);

    // If price hasn't been set yet, set a sensible 20% discount combo price
    if (!draft.price || draft.price <= 0) {
      setField("price", Math.round(newOriginalPrice * 0.8));
    }
  };

  const removeComboItem = (productId: string) => {
    const next = (draft.comboItems ?? []).filter((item) => item.productId !== productId);
    setField("comboItems", next);
    const newOriginalPrice = next.reduce((total, item) => {
      const found = products.find((p) => p.id === item.productId);
      return total + (found?.price ?? 0) * item.quantity;
    }, 0);
    setField("originalPrice", newOriginalPrice);
  };

  const updateComboItemQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeComboItem(productId);
      return;
    }
    const next = (draft.comboItems ?? []).map((item) =>
      item.productId === productId ? { ...item, quantity } : item,
    );
    setField("comboItems", next);
    const newOriginalPrice = next.reduce((total, item) => {
      const found = products.find((p) => p.id === item.productId);
      return total + (found?.price ?? 0) * item.quantity;
    }, 0);
    setField("originalPrice", newOriginalPrice);
  };

  const applyDiscountPercent = (percent: number) => {
    const base = computedOriginalPrice || draft.originalPrice || 0;
    if (base <= 0) return;
    const discounted = Math.round(base * (1 - percent / 100));
    setField("originalPrice", base);
    setField("price", discounted);
  };

  const autoPopulateCombo = () => {
    const items = draft.comboItems ?? [];
    if (items.length === 0) return;

    const matchedProducts = items
      .map((item) => products.find((p) => p.id === item.productId))
      .filter((p): p is Product => Boolean(p));

    if (matchedProducts.length === 0) return;

    const names = matchedProducts.map((p) => p.name);
    const suffix = matchedProducts.length === 2 ? "Duo" : matchedProducts.length === 3 ? "Trio" : "Collection";
    const suggestedName = `${names.slice(0, 2).join(" & ")} ${suffix}`;

    setName(suggestedName);
    setField("subtitle", matchedProducts.length === 2 ? "Curated Duo" : "Discovery Set");
    setField("size", `Set of ${matchedProducts.length}`);
    setField("family", "Curated Combo");

    // Gather notes from the included products
    const collectedNotes: string[] = [];
    matchedProducts.forEach((p) => {
      if (p.notes?.[0]) collectedNotes.push(p.notes[0]);
      if (p.notes?.[1]) collectedNotes.push(p.notes[1]);
    });
    const uniqueNotes = Array.from(new Set(collectedNotes)).slice(0, 3);
    while (uniqueNotes.length < 3) uniqueNotes.push("Amber & Musk");
    setField("notes", uniqueNotes);

    setField(
      "description",
      `An exceptional luxury fragrance set uniting ${names.join(" and ")}. Masterfully crafted to be worn individually or layered for an evocative, personal signature.`,
    );

    const totalVal = computedOriginalPrice || matchedProducts.reduce((sum, p) => sum + p.price, 0);
    setField("originalPrice", totalVal);
    if (!draft.price || draft.price >= totalVal) {
      setField("price", Math.round(totalVal * 0.8));
    }
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const name = draft.name.trim();
    const slug = (draft.slug || slugify(name)).trim();
    const description = draft.description.trim();
    const notes = draft.notes.map((note) => note.trim()).filter(Boolean);

    if (draft.isCombo && (!draft.comboItems || draft.comboItems.length < 2)) {
      setError("Please select at least 2 perfumes from the catalogue to create a combo set.");
      return;
    }
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
        subtitle: draft.subtitle.trim() || (draft.isCombo ? "Curated Duo" : "Eau de Parfum"),
        family: draft.family.trim() || (draft.isCombo ? "Curated Combo" : "Woody · Amber"),
        size: draft.size.trim() || (draft.isCombo ? "Set of 2" : "75 ml"),
        description,
        notes,
        accent: draft.accent || ACCENTS[0].value,
        media: draft.media ?? [],
        isCombo: Boolean(draft.isCombo),
        comboItems: draft.isCombo ? (draft.comboItems ?? []) : undefined,
        originalPrice: draft.isCombo
          ? draft.originalPrice || computedOriginalPrice || undefined
          : undefined,
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
              {isNew ? (draft.isCombo ? "New combo set" : "New fragrance") : "Edit fragrance"}
            </p>
            <h2 id="perfume-modal-title" className="mt-2 truncate font-display text-3xl sm:text-4xl">
              {isNew
                ? draft.isCombo
                  ? "Create combo product"
                  : "Add perfume"
                : draft.name || "Edit perfume"}
            </h2>
            <p className="mt-2 hidden max-w-2xl text-sm leading-6 text-ivory/85 sm:block">
              {draft.isCombo
                ? "Bundle existing fragrances into a discounted luxury combo or discovery set."
                : "Fields match the shop card and product page: family, concentration, size, olfactory notes, story, and gallery."}
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
              {/* Product Type Segmented Toggle */}
              <div className="grid grid-cols-2 rounded-xl border border-white/25 bg-black/40 p-1.5 shadow-inner">
                <button
                  type="button"
                  onClick={() => setField("isCombo", false)}
                  className={cn(
                    "flex items-center justify-center gap-2.5 rounded-lg py-3 text-xs font-semibold uppercase tracking-luxury transition",
                    !draft.isCombo
                      ? "bg-gold-300 text-ink shadow-md"
                      : "text-ivory/70 hover:text-ivory",
                  )}
                >
                  <Package className="size-4" /> Single Fragrance
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setField("isCombo", true);
                    if (!draft.subtitle || draft.subtitle === "Eau de Parfum") {
                      setField("subtitle", "Curated Duo");
                    }
                    if (!draft.family || draft.family === "Woody · Amber") {
                      setField("family", "Curated Combo");
                    }
                    if (!draft.size || draft.size === "75 ml") {
                      setField("size", "Set of 2");
                    }
                  }}
                  className={cn(
                    "flex items-center justify-center gap-2.5 rounded-lg py-3 text-xs font-semibold uppercase tracking-luxury transition",
                    draft.isCombo
                      ? "bg-gold-300 text-ink shadow-md"
                      : "text-ivory/70 hover:text-ivory",
                  )}
                >
                  <Layers className="size-4" /> Combo / Bundle Set
                </button>
              </div>

              {/* SECTION: Combo Product Bundler (Only shown if isCombo) */}
              {draft.isCombo && (
                <Section
                  number="✦"
                  title="Bundled Fragrances"
                  help="Select 2 or more existing perfumes from your catalogue to include in this combo set."
                >
                  {/* Selected products inside the combo */}
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-xs font-semibold uppercase tracking-luxury text-gold-300">
                        Included Scents ({draft.comboItems?.length ?? 0})
                      </p>
                      {draft.comboItems && draft.comboItems.length > 0 && (
                        <button
                          type="button"
                          onClick={autoPopulateCombo}
                          className="flex items-center gap-1.5 text-xs text-gold-300 hover:text-gold-200 transition underline underline-offset-4"
                        >
                          <Sparkles className="size-3.5" /> Auto-fill details from scents
                        </button>
                      )}
                    </div>

                    {(!draft.comboItems || draft.comboItems.length === 0) ? (
                      <div className="border border-dashed border-white/20 p-6 text-center text-sm text-mist/75">
                        No fragrances added yet. Pick at least 2 perfumes from the catalogue below.
                      </div>
                    ) : (
                      <div className="divide-y divide-white/10 rounded-lg border border-white/20 bg-black/40">
                        {draft.comboItems.map((item) => {
                          const p = products.find((prod) => prod.id === item.productId);
                          if (!p) return null;
                          return (
                            <div
                              key={item.productId}
                              className="flex items-center justify-between gap-3 p-3 text-sm"
                            >
                              <div className="min-w-0">
                                <p className="font-display text-base text-ivory truncate">{p.name}</p>
                                <p className="text-[0.68rem] uppercase tracking-editorial text-mist/70">
                                  {p.size} · {formatPrice(p.price)} each
                                </p>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="flex items-center border border-white/20 bg-black/60">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      updateComboItemQuantity(item.productId, item.quantity - 1)
                                    }
                                    className="p-1.5 text-mist hover:text-ivory"
                                    aria-label="Decrease quantity"
                                  >
                                    <Minus className="size-3" />
                                  </button>
                                  <span className="min-w-7 text-center text-xs font-semibold text-ivory">
                                    {item.quantity}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      updateComboItemQuantity(item.productId, item.quantity + 1)
                                    }
                                    className="p-1.5 text-mist hover:text-ivory"
                                    aria-label="Increase quantity"
                                  >
                                    <Plus className="size-3" />
                                  </button>
                                </div>
                                <span className="min-w-[4.5rem] text-right text-xs font-semibold text-ivory">
                                  {formatPrice(p.price * item.quantity)}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => removeComboItem(item.productId)}
                                  className="p-1.5 text-mist/60 hover:text-red-300 transition"
                                  aria-label="Remove item"
                                >
                                  <Trash2 className="size-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Value Calculation & Quick Discount Helper */}
                    {computedOriginalPrice > 0 && (
                      <div className="rounded-lg border border-gold-300/30 bg-gold-300/[0.08] p-4 text-xs">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <span className="text-mist/80 uppercase tracking-luxury text-[0.62rem]">
                              Combined Retail Value
                            </span>
                            <p className="font-display text-xl text-ivory mt-0.5">
                              {formatPrice(computedOriginalPrice)}
                            </p>
                          </div>
                          {draft.price > 0 && draft.price < computedOriginalPrice && (
                            <div className="sm:text-right">
                              <span className="text-gold-300 uppercase tracking-luxury text-[0.62rem]">
                                Customer Savings
                              </span>
                              <p className="font-display text-base text-gold-300 mt-0.5">
                                Save {formatPrice(computedOriginalPrice - draft.price)} (
                                {Math.round(
                                  ((computedOriginalPrice - draft.price) /
                                    computedOriginalPrice) *
                                    100,
                                )}
                                % OFF)
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="mt-3 pt-3 border-t border-gold-300/20 flex flex-wrap items-center gap-2">
                          <span className="text-[0.65rem] uppercase tracking-luxury text-mist/80">
                            Quick bundle discount:
                          </span>
                          {[10, 15, 20, 25, 30].map((pct) => (
                            <button
                              key={pct}
                              type="button"
                              onClick={() => applyDiscountPercent(pct)}
                              className="border border-gold-300/40 bg-black/40 px-2.5 py-1 text-[0.65rem] uppercase tracking-wider text-gold-300 hover:bg-gold-300 hover:text-ink transition"
                            >
                              {pct}% off
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Catalogue Picker / Search */}
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="text-xs font-semibold uppercase tracking-luxury text-ivory mb-2">
                        Add Fragrance from Catalogue
                      </p>
                      <div className="relative mb-3">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-mist/60" />
                        <input
                          type="text"
                          value={productSearch}
                          onChange={(e) => setProductSearch(e.target.value)}
                          placeholder="Search fragrances by name or family…"
                          className="h-10 w-full border border-white/20 bg-black/50 pl-9 pr-4 text-xs text-ivory outline-none focus:border-gold-300"
                        />
                      </div>
                      <div className="max-h-48 overflow-y-auto divide-y divide-white/10 border border-white/20 bg-black/30 rounded-lg">
                        {availableSingleProducts.length === 0 ? (
                          <p className="p-4 text-center text-xs text-mist/75">
                            {productSearch ? "No matching single fragrances found." : "No single fragrances available."}
                          </p>
                        ) : (
                          availableSingleProducts.map((p) => {
                            const isIncluded = draft.comboItems?.some((ci) => ci.productId === p.id);
                            return (
                              <div
                                key={p.id}
                                className="flex items-center justify-between gap-3 p-3 text-xs"
                              >
                                <div className="min-w-0">
                                  <p className="font-medium text-ivory truncate">{p.name}</p>
                                  <p className="text-[0.62rem] text-mist/70">
                                    {p.family} · {p.size} · {formatPrice(p.price)}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => addComboItem(p.id)}
                                  className={cn(
                                    "flex items-center gap-1 border px-3 py-1 text-[0.65rem] uppercase tracking-luxury transition",
                                    isIncluded
                                      ? "border-gold-300/60 bg-gold-300/10 text-gold-300 hover:bg-gold-300/20"
                                      : "border-white/20 text-ivory hover:border-gold-300/60 hover:text-gold-300",
                                  )}
                                >
                                  {isIncluded ? <Check className="size-3" /> : <Plus className="size-3" />}
                                  {isIncluded ? "Add more" : "Add to set"}
                                </button>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                </Section>
              )}

              {/* SECTION 01: Identity */}
              <Section
                number="01"
                title="Identity"
                help="Shown on cards, detail page, and bottle label."
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label={draft.isCombo ? "Combo set name" : "Fragrance name"} wide>
                    <input
                      required
                      value={draft.name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder={draft.isCombo ? "Nocturne & Amber Duo" : "Nocturne Oud"}
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
                      placeholder={draft.isCombo ? "nocturne-amber-duo" : "nocturne-oud"}
                      className={inputClass}
                    />
                  </Field>
                  <Field label={draft.isCombo ? "Set edition / Subtitle" : "Concentration"}>
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
                  <Field label={draft.isCombo ? "Set size / Count" : "Bottle size"}>
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

              {/* SECTION 02: Olfactory profile */}
              <Section
                number="02"
                title="Olfactory profile"
                help="Family drives shop filters. Notes appear on the product page."
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Fragrance family"
                    wide
                    help="Must include Woody, Floral, Amber, Marine, or Curated Combo for shop filters."
                  >
                    <select
                      value={
                        FAMILIES.includes(draft.family as (typeof FAMILIES)[number])
                          ? draft.family
                          : "__custom"
                      }
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

              {/* SECTION 03: Story & pricing */}
              <Section
                number="03"
                title="Story & pricing"
                help="Description and price on the product detail page."
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label={draft.isCombo ? "Combo Selling Price (INR)" : "Price (INR)"}
                    help={
                      draft.isCombo && computedOriginalPrice > 0
                        ? `Retail value is ${formatPrice(computedOriginalPrice)}`
                        : undefined
                    }
                  >
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

                  {draft.isCombo ? (
                    <Field
                      label="Original Value (INR)"
                      help="Original combined price shown crossed out."
                    >
                      <input
                        type="number"
                        min={1}
                        step={1}
                        value={draft.originalPrice || computedOriginalPrice || ""}
                        onChange={(event) =>
                          setField("originalPrice", Number(event.target.value))
                        }
                        placeholder="16000"
                        className={inputClass}
                      />
                    </Field>
                  ) : (
                    <div />
                  )}

                  <label className="flex items-end gap-3 pb-4 text-xs text-ivory/95 sm:col-span-2">
                    <input
                      type="checkbox"
                      checked={draft.featured ?? false}
                      onChange={(event) => setField("featured", event.target.checked)}
                      className="size-4 accent-[#c4a574]"
                    />
                    Feature on homepage collection
                  </label>

                  <Field
                    label={draft.isCombo ? "Combo set story" : "Fragrance story"}
                    wide
                    help="2–4 lines describing the composition and mood."
                  >
                    <textarea
                      required
                      rows={4}
                      value={draft.description}
                      onChange={(event) => setField("description", event.target.value)}
                      placeholder={
                        draft.isCombo
                          ? "A curated pairing of two signature perfumes crafted to be experienced together or layered."
                          : "A nocturnal composition of resinous oud and warm amber, composed for evenings that linger."
                      }
                      className={cn(inputClass, "h-auto py-4")}
                    />
                  </Field>
                </div>
              </Section>

              {/* SECTION 04: Visuals */}
              <Section
                number="04"
                title="Visuals"
                help="Accent adds a subtle glow to product images and colours the fallback bottle. The first gallery asset becomes the shop cover."
              >
                <div className="mb-5">
                  <p className="mb-3 text-[0.68rem] uppercase tracking-luxury text-ivory">
                    Product accent
                  </p>
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

            {/* Live Preview Sidebar */}
            <aside className="hidden xl:block">
              <div className="sticky top-0 space-y-4">
                <p className="text-[0.68rem] uppercase tracking-luxury text-ivory">Live preview</p>
                <div className="pointer-events-none rounded-2xl border border-white/15 bg-black/30 p-3">
                  <ProductCard
                    product={{
                      ...draft,
                      name:
                        draft.name || (draft.isCombo ? "Curated Combo Set" : "Fragrance name"),
                      slug: draft.slug || "preview",
                      subtitle:
                        draft.subtitle || (draft.isCombo ? "Curated Duo" : "Eau de Parfum"),
                      family:
                        draft.family || (draft.isCombo ? "Curated Combo" : "Fragrance family"),
                      size: draft.size || (draft.isCombo ? "Set of 2" : "75 ml"),
                      price: draft.price || 0,
                      originalPrice:
                        draft.originalPrice || computedOriginalPrice || undefined,
                      accent: draft.accent || ACCENTS[0].value,
                      isCombo: draft.isCombo,
                      comboItems: draft.comboItems,
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
          {error ? (
            <p className="mb-3 text-sm text-red-300 sm:mb-0">{error}</p>
          ) : (
            <span className="hidden text-sm text-ivory/80 sm:block">Esc to close</span>
          )}
          <div className="grid grid-cols-2 gap-3 sm:flex">
            <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="w-full sm:w-auto">
              {saving
                ? "Saving…"
                : isNew
                  ? draft.isCombo
                    ? "Publish combo set"
                    : "Add perfume"
                  : "Save changes"}
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
      <span className="mb-2 block text-xs font-semibold uppercase tracking-luxury text-ivory">
        {label}
      </span>
      {children}
      {help && <span className="mt-2 block text-sm leading-6 text-ivory/85">{help}</span>}
    </label>
  );
}
