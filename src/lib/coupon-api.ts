import { demoCoupons } from "@/constants/coupons";
import type {
  Coupon,
  CouponContextInput,
  CouponInput,
  CouponValidationResult,
} from "@/types/coupon";

// Frontend transport placeholders. Replace only these bodies when coupon APIs are ready.
export async function getCoupons(): Promise<Coupon[]> {
  return Promise.resolve(demoCoupons);
}

export async function getCouponById(id: string): Promise<Coupon | null> {
  return Promise.resolve(
    demoCoupons.find((coupon) => coupon.id === id) ?? null,
  );
}

export async function createCoupon(input: CouponInput): Promise<Coupon> {
  const now = new Date().toISOString();
  return Promise.resolve({
    ...input,
    id: `coupon-${Date.now()}`,
    usedCount: 0,
    createdAt: now,
    updatedAt: now,
  });
}

export async function updateCoupon(
  id: string,
  input: CouponInput,
): Promise<Coupon> {
  const existing = demoCoupons.find((coupon) => coupon.id === id);
  const now = new Date().toISOString();
  return Promise.resolve({
    ...input,
    id,
    usedCount: existing?.usedCount ?? 0,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  });
}

export async function deleteCoupon(_id: string): Promise<void> {
  void _id;
  return Promise.resolve();
}

export async function validateCoupon(
  _code: string,
  _context: CouponContextInput,
): Promise<CouponValidationResult> {
  void _code;
  void _context;
  return Promise.resolve({
    valid: false,
    discount: 0,
    code: "invalid",
    message: "Connect the coupon validation API.",
  });
}

export async function applyCoupon(_code: string): Promise<void> {
  void _code;
  return Promise.resolve();
}

export async function removeCoupon(_code: string): Promise<void> {
  void _code;
  return Promise.resolve();
}
