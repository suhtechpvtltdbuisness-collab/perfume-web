import type { Coupon, CouponContextInput, CouponValidationResult } from "@/types/coupon";

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCouponDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function couponDiscountLabel(coupon: Coupon) {
  return coupon.discountType === "percentage"
    ? `${coupon.discountValue}% off`
    : `${formatCurrency(coupon.discountValue)} off`;
}

export function calculateCouponDiscount(coupon: Coupon, subtotal: number) {
  const raw =
    coupon.discountType === "percentage"
      ? (subtotal * coupon.discountValue) / 100
      : coupon.discountValue;
  const capped = coupon.maximumDiscount ? Math.min(raw, coupon.maximumDiscount) : raw;
  return Math.max(0, Math.min(Math.round(capped), subtotal));
}

export function isCouponApplicable(coupon: Coupon, context: CouponContextInput) {
  if (coupon.applicableOn === "entire_store") return true;
  if (coupon.applicableOn === "selected_products") {
    return context.productIds.some((id) => coupon.productIds.includes(id));
  }
  if (coupon.applicableOn === "selected_categories") {
    return context.categories.some((category) => coupon.categories.includes(category));
  }
  return context.brands.some((brand) => coupon.brands.includes(brand));
}

export function validateCouponForContext(
  coupon: Coupon | undefined,
  context: CouponContextInput,
  redeemedCodes: string[] = [],
): CouponValidationResult {
  if (!coupon) return { valid: false, discount: 0, code: "invalid", message: "This coupon code is invalid." };
  if (coupon.status !== "active") return { valid: false, discount: 0, code: "inactive", message: "This coupon is currently inactive." };
  const now = Date.now();
  if (new Date(coupon.validFrom).getTime() > now) return { valid: false, discount: 0, code: "not_started", message: "This coupon is not active yet." };
  if (new Date(coupon.validUntil).getTime() < now) return { valid: false, discount: 0, code: "expired", message: "This coupon has expired." };
  if (coupon.usedCount >= coupon.usageLimit) return { valid: false, discount: 0, code: "usage_exceeded", message: "This coupon has reached its maximum usage limit." };
  if (redeemedCodes.includes(coupon.code)) return { valid: false, discount: 0, code: "already_used", message: "You have already used this coupon." };
  if (context.subtotal < coupon.minimumOrderAmount) return { valid: false, discount: 0, code: "minimum_not_reached", message: `Add ${formatCurrency(coupon.minimumOrderAmount - context.subtotal)} more to use ${coupon.code}.` };
  if (!isCouponApplicable(coupon, context)) return { valid: false, discount: 0, code: "not_applicable", message: "This coupon is not applicable to the products in your cart." };
  return { valid: true, coupon, discount: calculateCouponDiscount(coupon, context.subtotal) };
}
