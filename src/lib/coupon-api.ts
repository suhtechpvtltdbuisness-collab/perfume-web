import { ApiError } from "@/lib/auth-api";
import type {
  Coupon,
  CouponContextInput,
  CouponInput,
  CouponValidationResult,
} from "@/types/coupon";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = (await res.json().catch(() => ({}))) as { message?: string };

  if (!res.ok) {
    throw new ApiError(data.message ?? "Request failed", res.status);
  }

  return data as T;
}

function toBody(input: CouponInput) {
  return {
    name: input.name,
    code: input.code,
    description: input.description,
    discountType: input.discountType,
    discountValue: input.discountValue,
    minimumOrderAmount: input.minimumOrderAmount,
    maximumDiscount: input.maximumDiscount,
    usageLimit: input.usageLimit,
    perUserLimit: input.perUserLimit,
    validFrom: input.validFrom,
    validUntil: input.validUntil,
    status: input.status,
    applicableOn: input.applicableOn,
    productIds: input.productIds,
    categories: input.categories,
    brands: input.brands,
  };
}

export async function getCoupons(token?: string | null): Promise<Coupon[]> {
  const data = await request<{ coupons: Coupon[] }>(
    "/api/coupons",
    {},
    token,
  );
  return data.coupons;
}

export async function getCouponById(
  id: string,
  token?: string | null,
): Promise<Coupon | null> {
  try {
    const data = await request<{ coupon: Coupon }>(
      `/api/coupons/${encodeURIComponent(id)}`,
      {},
      token,
    );
    return data.coupon;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export async function createCoupon(
  input: CouponInput,
  token: string,
): Promise<Coupon> {
  const data = await request<{ coupon: Coupon }>(
    "/api/coupons",
    { method: "POST", body: JSON.stringify(toBody(input)) },
    token,
  );
  return data.coupon;
}

export async function updateCoupon(
  id: string,
  input: CouponInput,
  token: string,
): Promise<Coupon> {
  const data = await request<{ coupon: Coupon }>(
    `/api/coupons/${encodeURIComponent(id)}`,
    { method: "PUT", body: JSON.stringify(toBody(input)) },
    token,
  );
  return data.coupon;
}

export async function deleteCoupon(id: string, token: string): Promise<void> {
  await request<{ message: string }>(
    `/api/coupons/${encodeURIComponent(id)}`,
    { method: "DELETE" },
    token,
  );
}

export async function validateCoupon(
  code: string,
  context: CouponContextInput & { redeemedCodes?: string[] },
): Promise<CouponValidationResult> {
  return request<CouponValidationResult>("/api/coupons/validate", {
    method: "POST",
    body: JSON.stringify({
      code,
      subtotal: context.subtotal,
      productIds: context.productIds,
      categories: context.categories,
      brands: context.brands,
      redeemedCodes: context.redeemedCodes ?? [],
    }),
  });
}

export async function redeemCoupon(code: string): Promise<Coupon> {
  const data = await request<{ coupon: Coupon }>("/api/coupons/redeem", {
    method: "POST",
    body: JSON.stringify({ code }),
  });
  return data.coupon;
}

export const couponApi = {
  list: getCoupons,
  getById: getCouponById,
  create: createCoupon,
  update: updateCoupon,
  remove: deleteCoupon,
  validate: validateCoupon,
  redeem: redeemCoupon,
};
