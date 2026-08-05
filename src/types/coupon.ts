export type CouponDiscountType = "percentage" | "flat";
export type CouponStatus = "active" | "inactive";
export type CouponApplicability =
  | "entire_store"
  | "selected_products"
  | "selected_categories"
  | "selected_brands";

export interface Coupon {
  id: string;
  name: string;
  code: string;
  description: string;
  discountType: CouponDiscountType;
  discountValue: number;
  minimumOrderAmount: number;
  maximumDiscount: number | null;
  usageLimit: number;
  perUserLimit: number;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  status: CouponStatus;
  applicableOn: CouponApplicability;
  productIds: string[];
  categories: string[];
  brands: string[];
  createdAt: string;
  updatedAt: string;
}

export type CouponInput = Omit<Coupon, "id" | "usedCount" | "createdAt" | "updatedAt">;

export type CouponValidationCode =
  | "invalid"
  | "expired"
  | "already_used"
  | "minimum_not_reached"
  | "not_applicable"
  | "usage_exceeded"
  | "inactive"
  | "not_started";

export interface CouponValidationResult {
  valid: boolean;
  coupon?: Coupon;
  discount: number;
  code?: CouponValidationCode;
  message?: string;
}

export interface CouponContextInput {
  subtotal: number;
  productIds: string[];
  categories: string[];
  brands: string[];
}
