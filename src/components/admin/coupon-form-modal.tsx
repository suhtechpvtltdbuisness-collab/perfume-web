"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Check, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Coupon, CouponApplicability, CouponInput } from "@/types/coupon";
import type { Product } from "@/types/product";

const fieldClass =
  "mt-2 h-14 w-full border border-white/25 bg-black/40 px-4 text-base text-ivory outline-none transition focus:border-gold-300";
const labelClass =
  "block text-xs font-semibold uppercase tracking-luxury text-ivory";

function toDateInput(value?: string) {
  return value ? new Date(value).toISOString().slice(0, 10) : "";
}

function initialInput(coupon?: Coupon | null): CouponInput {
  return coupon
    ? {
        name: coupon.name,
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minimumOrderAmount: coupon.minimumOrderAmount,
        maximumDiscount: coupon.maximumDiscount,
        usageLimit: coupon.usageLimit,
        perUserLimit: coupon.perUserLimit,
        validFrom: toDateInput(coupon.validFrom),
        validUntil: toDateInput(coupon.validUntil),
        status: coupon.status,
        applicableOn: coupon.applicableOn,
        productIds: coupon.productIds,
        categories: coupon.categories,
        brands: coupon.brands,
      }
    : {
        name: "",
        code: "",
        description: "",
        discountType: "percentage",
        discountValue: 10,
        minimumOrderAmount: 0,
        maximumDiscount: null,
        usageLimit: 100,
        perUserLimit: 1,
        validFrom: new Date().toISOString().slice(0, 10),
        validUntil: "",
        status: "active",
        applicableOn: "entire_store",
        productIds: [],
        categories: [],
        brands: [],
      };
}

export function CouponFormModal({
  coupon,
  products,
  onClose,
  onSave,
}: {
  coupon?: Coupon | null;
  products: Product[];
  onClose: () => void;
  onSave: (input: CouponInput) => void;
}) {
  const [draft, setDraft] = useState(() => initialInput(coupon));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [productSearch, setProductSearch] = useState("");
  const categories = useMemo(
    () => [...new Set(products.map((product) => product.family))],
    [products],
  );
  const visibleProducts = products.filter((product) =>
    product.name.toLowerCase().includes(productSearch.toLowerCase()),
  );
  const set = <K extends keyof CouponInput>(key: K, value: CouponInput[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));
  const toggleArray = (
    key: "productIds" | "categories" | "brands",
    value: string,
  ) =>
    set(
      key,
      draft[key].includes(value)
        ? draft[key].filter((item) => item !== value)
        : [...draft[key], value],
    );

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!draft.name.trim()) nextErrors.name = "Coupon name is required.";
    if (!/^[A-Z0-9_-]{3,24}$/.test(draft.code.trim().toUpperCase()))
      nextErrors.code = "Use 3–24 letters, numbers, - or _.";
    if (draft.discountValue <= 0)
      nextErrors.discountValue = "Discount must be greater than zero.";
    if (draft.discountType === "percentage" && draft.discountValue > 100)
      nextErrors.discountValue = "Percentage cannot exceed 100%.";
    if (!draft.validFrom || !draft.validUntil)
      nextErrors.dates = "Start and end dates are required.";
    if (
      draft.validFrom &&
      draft.validUntil &&
      new Date(draft.validUntil) <= new Date(draft.validFrom)
    )
      nextErrors.dates = "End date must be after start date.";
    if (draft.usageLimit < 1 || draft.perUserLimit < 1)
      nextErrors.limits = "Usage limits must be at least 1.";
    if (draft.perUserLimit > draft.usageLimit)
      nextErrors.limits = "Per-user limit cannot exceed total limit.";
    if (draft.applicableOn === "selected_products" && !draft.productIds.length)
      nextErrors.applicability = "Select at least one product.";
    if (
      draft.applicableOn === "selected_categories" &&
      !draft.categories.length
    )
      nextErrors.applicability = "Select at least one category.";
    if (draft.applicableOn === "selected_brands" && !draft.brands.length)
      nextErrors.applicability = "Select at least one brand.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    onSave({
      ...draft,
      name: draft.name.trim(),
      code: draft.code.trim().toUpperCase(),
      description: draft.description.trim(),
      validFrom: new Date(`${draft.validFrom}T00:00:00`).toISOString(),
      validUntil: new Date(`${draft.validUntil}T23:59:59`).toISOString(),
    });
  };

  return (
    <div
      className="fixed inset-0 z-[120] overflow-y-auto bg-black/85 p-3 backdrop-blur-sm sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="coupon-form-title"
    >
      <form
        onSubmit={submit}
        className="mx-auto w-full max-w-6xl border border-white/25 bg-[#151515] shadow-2xl"
      >
        <header className="sticky top-0 z-20 flex items-start justify-between border-b border-white/20 bg-[#151515]/95 p-5 backdrop-blur sm:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-luxury text-gold-300">
              {coupon ? "Edit coupon" : "New coupon"}
            </p>
            <h2
              id="coupon-form-title"
              className="mt-2 font-display text-4xl text-ivory sm:text-5xl"
            >
              {coupon?.name ?? "Create coupon"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="border border-white/25 p-3 text-ivory hover:border-gold-300"
            aria-label="Close coupon form"
          >
            <X />
          </button>
        </header>

        <div className="grid gap-6 p-5 sm:p-8 lg:grid-cols-2">
          <FormSection
            number="01"
            title="Coupon details"
            className="lg:col-span-2"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Coupon name" error={errors.name}>
                <input
                  value={draft.name}
                  onChange={(e) => set("name", e.target.value)}
                  className={fieldClass}
                />
              </Field>
              <Field label="Coupon code" error={errors.code}>
                <input
                  value={draft.code}
                  onChange={(e) => set("code", e.target.value.toUpperCase())}
                  className={`${fieldClass} uppercase tracking-editorial`}
                />
              </Field>
              <Field label="Description" className="sm:col-span-2">
                <textarea
                  rows={3}
                  value={draft.description}
                  onChange={(e) => set("description", e.target.value)}
                  className="mt-2 w-full border border-white/25 bg-black/40 p-4 text-base text-ivory outline-none focus:border-gold-300"
                />
              </Field>
              <Field label="Discount type">
                <select
                  value={draft.discountType}
                  onChange={(e) =>
                    set(
                      "discountType",
                      e.target.value as CouponInput["discountType"],
                    )
                  }
                  className={fieldClass}
                >
                  <option value="percentage">Percentage</option>
                  <option value="flat">Flat</option>
                </select>
              </Field>
              <Field label="Discount value" error={errors.discountValue}>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={draft.discountValue}
                  onChange={(e) => set("discountValue", Number(e.target.value))}
                  className={fieldClass}
                />
              </Field>
              <Field label="Minimum order amount">
                <input
                  type="number"
                  min="0"
                  value={draft.minimumOrderAmount}
                  onChange={(e) =>
                    set("minimumOrderAmount", Number(e.target.value))
                  }
                  className={fieldClass}
                />
              </Field>
              <Field label="Maximum discount">
                <input
                  type="number"
                  min="0"
                  value={draft.maximumDiscount ?? ""}
                  placeholder="No maximum"
                  onChange={(e) =>
                    set(
                      "maximumDiscount",
                      e.target.value ? Number(e.target.value) : null,
                    )
                  }
                  className={fieldClass}
                />
              </Field>
            </div>
          </FormSection>

          <FormSection number="02" title="Limits & validity">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Usage limit">
                <input
                  type="number"
                  min="1"
                  value={draft.usageLimit}
                  onChange={(e) => set("usageLimit", Number(e.target.value))}
                  className={fieldClass}
                />
              </Field>
              <Field label="Per user limit">
                <input
                  type="number"
                  min="1"
                  value={draft.perUserLimit}
                  onChange={(e) => set("perUserLimit", Number(e.target.value))}
                  className={fieldClass}
                />
              </Field>
              <Field label="Start date">
                <input
                  type="date"
                  value={toDateInput(draft.validFrom)}
                  onChange={(e) => set("validFrom", e.target.value)}
                  className={fieldClass}
                />
              </Field>
              <Field label="End date">
                <input
                  type="date"
                  value={toDateInput(draft.validUntil)}
                  onChange={(e) => set("validUntil", e.target.value)}
                  className={fieldClass}
                />
              </Field>
              <Field label="Status" className="sm:col-span-2">
                <select
                  value={draft.status}
                  onChange={(e) =>
                    set("status", e.target.value as CouponInput["status"])
                  }
                  className={fieldClass}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </Field>
            </div>
            {(errors.dates || errors.limits) && (
              <p className="mt-4 text-sm text-red-300">
                {errors.dates ?? errors.limits}
              </p>
            )}
          </FormSection>

          <FormSection number="03" title="Applicable on">
            <div className="grid gap-2">
              {(
                [
                  "entire_store",
                  "selected_products",
                  "selected_categories",
                  "selected_brands",
                ] as CouponApplicability[]
              ).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => set("applicableOn", value)}
                  className={cn(
                    "flex items-center justify-between border px-4 py-4 text-left text-sm capitalize",
                    draft.applicableOn === value
                      ? "border-gold-300 bg-gold-300/10 text-gold-200"
                      : "border-white/20 text-ivory",
                  )}
                >
                  <span>{value.replaceAll("_", " ")}</span>
                  {draft.applicableOn === value && <Check className="size-4" />}
                </button>
              ))}
            </div>
            {draft.applicableOn === "selected_products" && (
              <div className="mt-5">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ivory/70" />
                  <input
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search products"
                    className={`${fieldClass} mt-0 pl-11`}
                  />
                </div>
                <div className="mt-3 max-h-64 overflow-y-auto border border-white/20">
                  {visibleProducts.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => toggleArray("productIds", product.id)}
                      className="flex w-full items-center justify-between border-b border-white/10 p-4 text-left last:border-0"
                    >
                      <span>
                        <span className="block font-display text-xl text-ivory">
                          {product.name}
                        </span>
                        <span className="text-xs text-ivory/75">
                          {product.family} · ₹{product.price}
                        </span>
                      </span>
                      <span
                        className={cn(
                          "grid size-5 place-items-center border",
                          draft.productIds.includes(product.id)
                            ? "border-gold-300 bg-gold-300 text-ink"
                            : "border-white/30",
                        )}
                      >
                        {draft.productIds.includes(product.id) && (
                          <Check className="size-3" />
                        )}
                      </span>
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-ivory/75">
                  {draft.productIds.length} product(s) selected
                </p>
              </div>
            )}
            {draft.applicableOn === "selected_categories" && (
              <div className="mt-5 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    type="button"
                    key={category}
                    onClick={() => toggleArray("categories", category)}
                    className={cn(
                      "border px-4 py-3 text-xs uppercase tracking-editorial",
                      draft.categories.includes(category)
                        ? "border-gold-300 bg-gold-300 text-ink"
                        : "border-white/25 text-ivory",
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
            {draft.applicableOn === "selected_brands" && (
              <button
                type="button"
                onClick={() => toggleArray("brands", "Autoroma")}
                className={cn(
                  "mt-5 border px-4 py-3 text-xs uppercase tracking-editorial",
                  draft.brands.includes("Autoroma")
                    ? "border-gold-300 bg-gold-300 text-ink"
                    : "border-white/25 text-ivory",
                )}
              >
                Autoroma
              </button>
            )}
            {errors.applicability && (
              <p className="mt-4 text-sm text-red-300">
                {errors.applicability}
              </p>
            )}
          </FormSection>
        </div>

        <footer className="sticky bottom-0 z-20 flex flex-col-reverse gap-3 border-t border-white/20 bg-[#151515]/95 p-5 backdrop-blur sm:flex-row sm:justify-end sm:p-6">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {coupon ? "Save changes" : "Create coupon"}
          </Button>
        </footer>
      </form>
    </div>
  );
}

function FormSection({
  number,
  title,
  children,
  className,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "border border-white/25 bg-white/[0.055] p-5 sm:p-7",
        className,
      )}
    >
      <div className="mb-6 flex items-baseline gap-4">
        <span className="text-xs font-semibold tracking-luxury text-gold-300">
          {number}
        </span>
        <h3 className="font-display text-3xl text-ivory">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={className}>
      <span className={labelClass}>{label}</span>
      {children}
      {error && (
        <span className="mt-2 block text-sm text-red-300">{error}</span>
      )}
    </label>
  );
}
