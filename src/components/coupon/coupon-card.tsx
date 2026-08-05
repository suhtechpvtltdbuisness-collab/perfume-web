"use client";

import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCoupons } from "@/components/providers/coupon-provider";
import {
  couponDiscountLabel,
  formatCouponDate,
  formatCurrency,
} from "@/lib/coupon-utils";
import type { Coupon } from "@/types/coupon";

export function CouponCard({
  coupon,
  onApply,
  applied = false,
  compact = false,
}: {
  coupon: Coupon;
  onApply: (coupon: Coupon) => void;
  applied?: boolean;
  compact?: boolean;
}) {
  const { notify } = useCoupons();
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(coupon.code);
      notify(`${coupon.code} copied.`);
    } catch {
      notify("Could not copy the coupon. Please copy it manually.", "error");
    }
  };
  return (
    <article className="border border-white/15 bg-white/[0.035] p-4 sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-semibold tracking-editorial text-gold-200">
            {coupon.code}
          </p>
          <p className="mt-2 font-display text-2xl text-ivory">
            {couponDiscountLabel(coupon)}
          </p>
        </div>
        <button
          type="button"
          onClick={copy}
          className="flex items-center gap-2 border border-white/15 px-3 py-2 text-[0.62rem] uppercase tracking-editorial text-mist hover:border-gold-300 hover:text-gold-300"
          aria-label={`Copy ${coupon.code}`}
          title="Copy coupon"
        >
          <Copy className="size-3.5" /> Copy
        </button>
      </div>
      {!compact && (
        <p className="mt-3 text-sm leading-6 text-mist/80">
          {coupon.description}
        </p>
      )}
      <dl className="mt-4 grid gap-2 text-xs text-mist/75 sm:grid-cols-2">
        <div>
          <dt className="sr-only">Minimum order</dt>
          <dd>Min. order {formatCurrency(coupon.minimumOrderAmount)}</dd>
        </div>
        {coupon.maximumDiscount && (
          <div>
            <dt className="sr-only">Maximum discount</dt>
            <dd>Max. saving {formatCurrency(coupon.maximumDiscount)}</dd>
          </div>
        )}
        <div>
          <dt className="sr-only">Expiry</dt>
          <dd>Expires {formatCouponDate(coupon.validUntil)}</dd>
        </div>
      </dl>
      <Button
        type="button"
        variant={applied ? "outline" : "gold"}
        onClick={() => onApply(coupon)}
        disabled={applied}
        className="mt-5 w-full"
      >
        {applied ? (
          <>
            <Check className="size-4" /> Applied
          </>
        ) : (
          "Apply coupon"
        )}
      </Button>
    </article>
  );
}
