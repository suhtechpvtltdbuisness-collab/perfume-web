"use client";

import { useCoupons } from "@/components/providers/coupon-provider";
import { formatPrice } from "@/constants/products";

export function PriceSummary({ subtotal }: { subtotal: number }) {
  const { couponDiscount } = useCoupons();
  const grandTotal = Math.max(0, subtotal - couponDiscount);
  return (
    <div className="mt-6 border-y border-white/10 py-5 text-sm">
      <div className="space-y-3 text-mist/85">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>Complimentary</span>
        </div>
        <div className="flex justify-between text-gold-200">
          <span>Coupon discount</span>
          <span>
            {couponDiscount
              ? `−${formatPrice(couponDiscount)}`
              : formatPrice(0)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>Included</span>
        </div>
      </div>
      <div className="mt-5 flex justify-between border-t border-white/10 pt-5 font-display text-xl text-ivory">
        <span>Grand total</span>
        <span>{formatPrice(grandTotal)}</span>
      </div>
    </div>
  );
}
