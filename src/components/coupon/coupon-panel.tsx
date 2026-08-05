"use client";

import { useState } from "react";
import { Check, Tag, X } from "lucide-react";

import { CouponCard } from "@/components/coupon/coupon-card";
import { useCoupons } from "@/components/providers/coupon-provider";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/coupon-utils";

export function CouponPanel({ compact = false }: { compact?: boolean }) {
  const {
    availableCoupons,
    appliedCoupon,
    couponDiscount,
    applyCoupon,
    removeCoupon,
    validationError,
    loading,
  } = useCoupons();
  const [code, setCode] = useState("");
  const submit = () => {
    const result = applyCoupon(code);
    if (result.valid) setCode("");
  };
  return (
    <section
      className="border border-white/15 bg-white/[0.025] p-5 sm:p-6"
      aria-labelledby="coupon-panel-title"
    >
      <div className="flex items-center gap-3">
        <Tag className="size-4 text-gold-300" />
        <h2
          id="coupon-panel-title"
          className="font-display text-2xl text-ivory sm:text-3xl"
        >
          Coupons
        </h2>
      </div>
      {appliedCoupon ? (
        <div className="mt-5 flex flex-col gap-4 border border-gold-300/35 bg-gold-300/[0.07] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 grid size-6 place-items-center rounded-full bg-gold-300 text-ink">
              <Check className="size-3.5" />
            </span>
            <div>
              <p className="font-semibold tracking-editorial text-gold-200">
                {appliedCoupon.code}
              </p>
              <p className="mt-1 text-sm text-ivory">
                You save {formatCurrency(couponDiscount)}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={removeCoupon}
            className="flex items-center gap-2 self-start text-xs uppercase tracking-editorial text-mist hover:text-ivory"
          >
            <X className="size-4" /> Remove
          </button>
        </div>
      ) : null}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <label
          className="sr-only"
          htmlFor={`coupon-code-${compact ? "compact" : "full"}`}
        >
          Coupon code
        </label>
        <input
          id={`coupon-code-${compact ? "compact" : "full"}`}
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              submit();
            }
          }}
          placeholder="Enter coupon code"
          className="h-12 min-w-0 flex-1 border border-white/20 bg-black/30 px-4 text-sm uppercase tracking-editorial text-ivory outline-none placeholder:normal-case placeholder:tracking-normal focus:border-gold-300"
        />
        <Button
          type="button"
          onClick={submit}
          disabled={!code.trim() || loading}
        >
          {appliedCoupon ? "Change" : "Apply"}
        </Button>
      </div>
      {validationError && (
        <p className="mt-3 text-sm text-red-300" role="alert">
          {validationError}
        </p>
      )}
      {availableCoupons.length > 0 && (
        <div className="mt-7">
          <p className="text-[0.65rem] uppercase tracking-luxury text-gold-300">
            Available for your {compact ? "order" : "bag"}
          </p>
          <div
            className={`mt-4 grid gap-3 ${compact ? "grid-cols-1" : "sm:grid-cols-2"}`}
          >
            {availableCoupons.map((coupon) => (
              <CouponCard
                key={coupon.id}
                coupon={coupon}
                compact={compact}
                applied={appliedCoupon?.id === coupon.id}
                onApply={(item) => applyCoupon(item.code)}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
