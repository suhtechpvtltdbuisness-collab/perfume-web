"use client";

import { CouponCard } from "@/components/coupon/coupon-card";
import { useCoupons } from "@/components/providers/coupon-provider";
import type { Product } from "@/types/product";

export function ProductCoupons({ product }: { product: Product }) {
  const { couponsForProduct, appliedCoupon, applyCoupon } = useCoupons();
  const coupons = couponsForProduct(product.id, product.family);
  if (!coupons.length) return null;
  return (
    <section className="mt-8 border-t border-white/10 pt-7">
      <p className="text-[0.65rem] uppercase tracking-luxury text-gold-300">
        Available coupons
      </p>
      <div className="mt-4 grid gap-3">
        {coupons.map((coupon) => (
          <CouponCard
            key={coupon.id}
            coupon={coupon}
            compact
            applied={appliedCoupon?.id === coupon.id}
            onApply={(item) =>
              applyCoupon(item.code, {
                subtotal: product.price,
                productIds: [product.id],
                categories: [product.family],
                brands: ["Autoroma"],
              })
            }
          />
        ))}
      </div>
    </section>
  );
}
