"use client";

import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Plus,
  Power,
  Search,
  Trash2,
  X,
} from "lucide-react";

import { CouponFormModal } from "@/components/admin/coupon-form-modal";
import { useCoupons } from "@/components/providers/coupon-provider";
import { Button } from "@/components/ui/button";
import {
  couponDiscountLabel,
  formatCouponDate,
  formatCurrency,
} from "@/lib/coupon-utils";
import { cn } from "@/lib/utils";
import type { Coupon, CouponInput } from "@/types/coupon";
import type { Product } from "@/types/product";

const pageSize = 8;

export function CouponAdminView({ products }: { products: Product[] }) {
  const { coupons, createCoupon, updateCoupon, deleteCoupon, toggleCoupon } =
    useCoupons();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [expiry, setExpiry] = useState("all");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Coupon | "new" | null>(null);
  const [viewing, setViewing] = useState<Coupon | null>(null);
  const [currentTime] = useState(() => Date.now());
  const filtered = useMemo(
    () =>
      coupons.filter((coupon) => {
        const query = search.trim().toLowerCase();
        const matchesSearch =
          !query ||
          coupon.name.toLowerCase().includes(query) ||
          coupon.code.toLowerCase().includes(query);
        const matchesStatus = status === "all" || coupon.status === status;
        const expired = new Date(coupon.validUntil).getTime() < currentTime;
        const matchesExpiry =
          expiry === "all" || (expiry === "expired" ? expired : !expired);
        return matchesSearch && matchesStatus && matchesExpiry;
      }),
    [coupons, currentTime, expiry, search, status],
  );
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const rows = filtered.slice(
    (Math.min(page, pages) - 1) * pageSize,
    Math.min(page, pages) * pageSize,
  );
  const resetPage = () => setPage(1);

  const save = async (input: CouponInput) => {
    try {
      if (editing === "new") await createCoupon(input);
      else if (editing) await updateCoupon(editing.id, input);
      setEditing(null);
    } catch (error) {
      window.alert(
        error instanceof Error ? error.message : "Failed to save coupon",
      );
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-luxury text-gold-300">
            Promotions
          </p>
          <h1 className="mt-3 font-display text-5xl text-ivory sm:text-6xl">
            Coupons
          </h1>
          <p className="mt-4 text-base text-ivory/90">
            Create, schedule and monitor storefront offers.
          </p>
        </div>
        <Button onClick={() => setEditing("new")}>
          <Plus className="size-4" /> Add coupon
        </Button>
      </div>
      <div className="mt-9 grid gap-3 border border-white/20 bg-white/[0.05] p-4 md:grid-cols-[1fr_12rem_12rem]">
        <label className="relative">
          <span className="sr-only">Search coupons</span>
          <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ivory/70" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              resetPage();
            }}
            placeholder="Search name or code"
            className="h-13 w-full border border-white/25 bg-black/40 py-3 pl-11 pr-4 text-sm text-ivory outline-none focus:border-gold-300"
          />
        </label>
        <select
          aria-label="Filter by status"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            resetPage();
          }}
          className="border border-white/25 bg-black/40 px-4 py-3 text-sm text-ivory outline-none"
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select
          aria-label="Filter by expiry"
          value={expiry}
          onChange={(e) => {
            setExpiry(e.target.value);
            resetPage();
          }}
          className="border border-white/25 bg-black/40 px-4 py-3 text-sm text-ivory outline-none"
        >
          <option value="all">All validity</option>
          <option value="valid">Not expired</option>
          <option value="expired">Expired</option>
        </select>
      </div>
      <div className="mt-5 overflow-x-auto border border-white/20">
        <table className="w-full min-w-[1760px] text-left text-sm">
          <thead className="border-b border-white/20 bg-white/[0.065] text-[0.68rem] uppercase tracking-editorial text-ivory">
            <tr>
              {[
                "Coupon name",
                "Coupon code",
                "Discount type",
                "Discount value",
                "Minimum order",
                "Maximum discount",
                "Usage limit",
                "Used count",
                "Valid from",
                "Valid until",
                "Status",
                "Actions",
              ].map((heading) => (
                <th key={heading} className="whitespace-nowrap p-4">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {rows.map((coupon) => {
              const expired =
                new Date(coupon.validUntil).getTime() < currentTime;
              return (
                <tr
                  key={coupon.id}
                  className="text-ivory/95 hover:bg-white/[0.035]"
                >
                  <td className="p-4 font-display text-xl text-ivory">
                    {coupon.name}
                  </td>
                  <td className="p-4">
                    <span className="border border-gold-300/40 bg-gold-300/5 px-3 py-2 font-semibold tracking-editorial text-gold-200">
                      {coupon.code}
                    </span>
                  </td>
                  <td className="p-4 capitalize">{coupon.discountType}</td>
                  <td className="p-4">{couponDiscountLabel(coupon)}</td>
                  <td className="p-4">
                    {formatCurrency(coupon.minimumOrderAmount)}
                  </td>
                  <td className="p-4">
                    {coupon.maximumDiscount
                      ? formatCurrency(coupon.maximumDiscount)
                      : "—"}
                  </td>
                  <td className="p-4">{coupon.usageLimit}</td>
                  <td className="p-4">{coupon.usedCount}</td>
                  <td className="p-4">{formatCouponDate(coupon.validFrom)}</td>
                  <td className={cn("p-4", expired && "text-red-300")}>
                    {formatCouponDate(coupon.validUntil)}
                    {expired && (
                      <span className="ml-2 text-[0.6rem] uppercase">
                        Expired
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <span
                      className={cn(
                        "inline-flex items-center gap-2 text-xs uppercase tracking-editorial",
                        coupon.status === "active" && !expired
                          ? "text-emerald-300"
                          : "text-ivory/70",
                      )}
                    >
                      <span className="size-1.5 rounded-full bg-current" />
                      {coupon.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Action label="View" onClick={() => setViewing(coupon)}>
                        <Eye />
                      </Action>
                      <Action label="Edit" onClick={() => setEditing(coupon)}>
                        <Pencil />
                      </Action>
                      <Action
                        label={
                          coupon.status === "active" ? "Disable" : "Enable"
                        }
                        onClick={() => {
                          void toggleCoupon(coupon.id).catch((error) =>
                            window.alert(
                              error instanceof Error
                                ? error.message
                                : "Failed to update coupon",
                            ),
                          );
                        }}
                      >
                        <Power />
                      </Action>
                      <Action
                        label="Delete"
                        danger
                        onClick={() => {
                          if (!window.confirm(`Delete coupon ${coupon.code}?`))
                            return;
                          void deleteCoupon(coupon.id).catch((error) =>
                            window.alert(
                              error instanceof Error
                                ? error.message
                                : "Failed to delete coupon",
                            ),
                          );
                        }}
                      >
                        <Trash2 />
                      </Action>
                    </div>
                  </td>
                </tr>
              );
            })}
            {!rows.length && (
              <tr>
                <td
                  colSpan={12}
                  className="p-12 text-center text-base text-ivory/75"
                >
                  No coupons match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col gap-4 border-x border-b border-white/20 px-4 py-4 text-sm text-ivory/80 sm:flex-row sm:items-center sm:justify-between">
        <span>
          Showing {rows.length} of {filtered.length} coupons
        </span>
        <div className="flex items-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((value) => value - 1)}
            className="border border-white/25 p-2 disabled:opacity-30"
            aria-label="Previous page"
          >
            <ChevronLeft />
          </button>
          <span className="px-3">
            Page {Math.min(page, pages)} of {pages}
          </span>
          <button
            disabled={page >= pages}
            onClick={() => setPage((value) => value + 1)}
            className="border border-white/25 p-2 disabled:opacity-30"
            aria-label="Next page"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
      {editing && (
        <CouponFormModal
          coupon={editing === "new" ? null : editing}
          products={products}
          onClose={() => setEditing(null)}
          onSave={save}
        />
      )}
      {viewing && (
        <CouponDetails
          coupon={viewing}
          products={products}
          onClose={() => setViewing(null)}
        />
      )}
    </>
  );
}

function Action({
  label,
  onClick,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={cn(
        "border border-white/25 p-2.5 text-ivory hover:border-gold-300 hover:text-gold-300 [&_svg]:size-4",
        danger && "hover:border-red-400 hover:text-red-300",
      )}
    >
      {children}
    </button>
  );
}

function CouponDetails({
  coupon,
  products,
  onClose,
}: {
  coupon: Coupon;
  products: Product[];
  onClose: () => void;
}) {
  const values = [
    ["Code", coupon.code],
    ["Discount", couponDiscountLabel(coupon)],
    ["Minimum order", formatCurrency(coupon.minimumOrderAmount)],
    [
      "Maximum discount",
      coupon.maximumDiscount
        ? formatCurrency(coupon.maximumDiscount)
        : "No cap",
    ],
    ["Usage", `${coupon.usedCount} / ${coupon.usageLimit}`],
    ["Per user", String(coupon.perUserLimit)],
    ["Valid from", formatCouponDate(coupon.validFrom)],
    ["Valid until", formatCouponDate(coupon.validUntil)],
    ["Status", coupon.status],
    ["Applicable on", coupon.applicableOn.replaceAll("_", " ")],
  ];
  const selectedNames = coupon.productIds
    .map((id) => products.find((product) => product.id === id)?.name)
    .filter(Boolean);
  return (
    <div
      className="fixed inset-0 z-[130] grid place-items-center overflow-y-auto bg-black/85 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-3xl border border-white/25 bg-[#151515] p-6 sm:p-9">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-luxury text-gold-300">
              Coupon details
            </p>
            <h2 className="mt-3 font-display text-4xl text-ivory sm:text-5xl">
              {coupon.name}
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-ivory/85">
              {coupon.description || "No description provided."}
            </p>
          </div>
          <button onClick={onClose} className="border border-white/25 p-3">
            <X />
          </button>
        </div>
        <dl className="mt-8 grid border-l border-t border-white/15 sm:grid-cols-2">
          {values.map(([label, value]) => (
            <div key={label} className="border-b border-r border-white/15 p-4">
              <dt className="text-[0.65rem] uppercase tracking-editorial text-gold-300">
                {label}
              </dt>
              <dd className="mt-2 text-base capitalize text-ivory">{value}</dd>
            </div>
          ))}
        </dl>
        {selectedNames.length > 0 && (
          <div className="mt-6">
            <p className="text-xs uppercase tracking-editorial text-gold-300">
              Selected products
            </p>
            <p className="mt-2 text-ivory">{selectedNames.join(", ")}</p>
          </div>
        )}
        <div className="mt-7 flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}
