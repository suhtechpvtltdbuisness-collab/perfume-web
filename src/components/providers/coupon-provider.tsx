"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Check, X } from "lucide-react";

import { useAuth } from "@/components/providers/auth-provider";
import { useCart } from "@/components/providers/cart-provider";
import { couponApi } from "@/lib/coupon-api";
import {
  calculateCouponDiscount,
  isCouponApplicable,
  validateCouponForContext,
} from "@/lib/coupon-utils";
import type {
  Coupon,
  CouponContextInput,
  CouponInput,
  CouponValidationResult,
} from "@/types/coupon";

interface ToastState {
  type: "success" | "error";
  message: string;
}

interface CouponContextValue {
  coupons: Coupon[];
  availableCoupons: Coupon[];
  selectedCoupon: Coupon | null;
  appliedCoupon: Coupon | null;
  couponDiscount: number;
  loading: boolean;
  validationError: string | null;
  createCoupon: (input: CouponInput) => Promise<Coupon>;
  updateCoupon: (id: string, input: CouponInput) => Promise<void>;
  deleteCoupon: (id: string) => Promise<void>;
  toggleCoupon: (id: string) => Promise<void>;
  selectCoupon: (coupon: Coupon | null) => void;
  applyCoupon: (
    code: string,
    override?: CouponContextInput,
  ) => CouponValidationResult;
  removeCoupon: () => void;
  completeCouponRedemption: () => Promise<void>;
  couponsForProduct: (productId: string, category?: string) => Coupon[];
  notify: (message: string, type?: "success" | "error") => void;
}

const CouponContext = createContext<CouponContextValue | null>(null);
const appliedStorageKey = "autoroma-applied-coupon";
const redeemedStorageKey = "autoroma-redeemed-coupons";

function safeRead<T>(key: string, fallback: T): T {
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function CouponProvider({ children }: { children: ReactNode }) {
  const { accessToken } = useAuth();
  const { items, subtotal } = useCart();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [redeemedCodes, setRedeemedCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime] = useState(() => Date.now());
  const [validationError, setValidationError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    setAppliedCode(safeRead<string | null>(appliedStorageKey, null));
    setRedeemedCodes(safeRead<string[]>(redeemedStorageKey, []));
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    void couponApi
      .list(accessToken)
      .then((list) => {
        if (!active) return;
        setCoupons(list);
      })
      .catch(() => {
        if (!active) return;
        setCoupons([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [accessToken]);

  useEffect(() => {
    if (appliedCode)
      window.localStorage.setItem(
        appliedStorageKey,
        JSON.stringify(appliedCode),
      );
    else window.localStorage.removeItem(appliedStorageKey);
  }, [appliedCode]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const cartContext = useMemo<CouponContextInput>(
    () => ({
      subtotal,
      productIds: items.map((item) => item.product.id),
      categories: [...new Set(items.map((item) => item.product.family))],
      brands: items.length ? ["Autoroma"] : [],
    }),
    [items, subtotal],
  );

  const appliedCoupon = useMemo(
    () => coupons.find((coupon) => coupon.code === appliedCode) ?? null,
    [appliedCode, coupons],
  );

  const couponDiscount = useMemo(() => {
    if (!appliedCoupon || subtotal <= 0) return 0;
    const result = validateCouponForContext(appliedCoupon, cartContext);
    return result.valid ? calculateCouponDiscount(appliedCoupon, subtotal) : 0;
  }, [appliedCoupon, cartContext, subtotal]);

  const availableCoupons = useMemo(
    () =>
      coupons.filter((coupon) => {
        return (
          coupon.status === "active" &&
          new Date(coupon.validFrom).getTime() <= currentTime &&
          new Date(coupon.validUntil).getTime() >= currentTime &&
          coupon.usedCount < coupon.usageLimit &&
          (items.length === 0 || isCouponApplicable(coupon, cartContext))
        );
      }),
    [cartContext, coupons, currentTime, items.length],
  );

  const notify = useCallback(
    (message: string, type: "success" | "error" = "success") => {
      setToast({ message, type });
    },
    [],
  );

  const applyCoupon = useCallback(
    (rawCode: string, override?: CouponContextInput) => {
      const code = rawCode.trim().toUpperCase();
      const coupon = coupons.find((item) => item.code.toUpperCase() === code);
      const result = validateCouponForContext(
        coupon,
        override ?? cartContext,
        redeemedCodes,
      );
      if (!result.valid || !coupon) {
        const message = result.message ?? "Coupon could not be applied.";
        setValidationError(message);
        notify(message, "error");
        return result;
      }
      setValidationError(null);
      setSelectedCoupon(coupon);
      setAppliedCode(coupon.code);
      notify(`${coupon.code} applied. You saved ₹${result.discount}.`);
      return result;
    },
    [cartContext, coupons, notify, redeemedCodes],
  );

  const removeAppliedCoupon = useCallback(() => {
    const code = appliedCode;
    setAppliedCode(null);
    setSelectedCoupon(null);
    setValidationError(null);
    if (code) notify(`${code} removed from your order.`);
  }, [appliedCode, notify]);

  const createCouponFn = useCallback(
    async (input: CouponInput) => {
      if (!accessToken) throw new Error("Admin authentication required");
      const coupon = await couponApi.create(input, accessToken);
      setCoupons((current) => [coupon, ...current]);
      notify(`${coupon.code} created.`);
      return coupon;
    },
    [accessToken, notify],
  );

  const updateCouponFn = useCallback(
    async (id: string, input: CouponInput) => {
      if (!accessToken) throw new Error("Admin authentication required");
      const saved = await couponApi.update(id, input, accessToken);
      setCoupons((current) =>
        current.map((coupon) => (coupon.id === id ? saved : coupon)),
      );
      notify("Coupon updated.");
    },
    [accessToken, notify],
  );

  const deleteCouponFn = useCallback(
    async (id: string) => {
      if (!accessToken) throw new Error("Admin authentication required");
      await couponApi.remove(id, accessToken);
      setCoupons((current) => current.filter((coupon) => coupon.id !== id));
      if (appliedCoupon?.id === id) setAppliedCode(null);
      notify("Coupon deleted.");
    },
    [accessToken, appliedCoupon?.id, notify],
  );

  const toggleCouponFn = useCallback(
    async (id: string) => {
      if (!accessToken) throw new Error("Admin authentication required");
      const existing = coupons.find((coupon) => coupon.id === id);
      if (!existing) return;
      const input: CouponInput = {
        name: existing.name,
        code: existing.code,
        description: existing.description,
        discountType: existing.discountType,
        discountValue: existing.discountValue,
        minimumOrderAmount: existing.minimumOrderAmount,
        maximumDiscount: existing.maximumDiscount,
        usageLimit: existing.usageLimit,
        perUserLimit: existing.perUserLimit,
        validFrom: existing.validFrom,
        validUntil: existing.validUntil,
        status: existing.status === "active" ? "inactive" : "active",
        applicableOn: existing.applicableOn,
        productIds: existing.productIds,
        categories: existing.categories,
        brands: existing.brands,
      };
      const saved = await couponApi.update(id, input, accessToken);
      setCoupons((current) =>
        current.map((coupon) => (coupon.id === id ? saved : coupon)),
      );
      notify("Coupon status updated.");
    },
    [accessToken, coupons, notify],
  );

  const completeCouponRedemption = useCallback(async () => {
    if (!appliedCoupon) return;
    const next = [...new Set([...redeemedCodes, appliedCoupon.code])];
    setRedeemedCodes(next);
    window.localStorage.setItem(redeemedStorageKey, JSON.stringify(next));
    try {
      const redeemed = await couponApi.redeem(appliedCoupon.code);
      setCoupons((current) =>
        current.map((coupon) =>
          coupon.id === redeemed.id ? redeemed : coupon,
        ),
      );
    } catch {
      setCoupons((current) =>
        current.map((coupon) =>
          coupon.id === appliedCoupon.id
            ? { ...coupon, usedCount: coupon.usedCount + 1 }
            : coupon,
        ),
      );
    }
    setAppliedCode(null);
    setSelectedCoupon(null);
  }, [appliedCoupon, redeemedCodes]);

  const value = useMemo<CouponContextValue>(
    () => ({
      coupons,
      availableCoupons,
      selectedCoupon,
      appliedCoupon,
      couponDiscount,
      loading,
      validationError,
      createCoupon: createCouponFn,
      updateCoupon: updateCouponFn,
      deleteCoupon: deleteCouponFn,
      toggleCoupon: toggleCouponFn,
      selectCoupon: setSelectedCoupon,
      applyCoupon,
      removeCoupon: removeAppliedCoupon,
      completeCouponRedemption,
      couponsForProduct: (productId, category) =>
        coupons.filter((coupon) => {
          const productContext: CouponContextInput = {
            subtotal: Number.MAX_SAFE_INTEGER,
            productIds: [productId],
            categories: category ? [category] : [],
            brands: ["Autoroma"],
          };
          return (
            coupon.status === "active" &&
            new Date(coupon.validFrom).getTime() <= currentTime &&
            new Date(coupon.validUntil).getTime() >= currentTime &&
            isCouponApplicable(coupon, productContext)
          );
        }),
      notify,
    }),
    [
      appliedCoupon,
      applyCoupon,
      availableCoupons,
      completeCouponRedemption,
      couponDiscount,
      coupons,
      createCouponFn,
      currentTime,
      deleteCouponFn,
      loading,
      notify,
      removeAppliedCoupon,
      selectedCoupon,
      toggleCouponFn,
      updateCouponFn,
      validationError,
    ],
  );

  return (
    <CouponContext.Provider value={value}>
      {children}
      {toast ? (
        <div
          className={`fixed bottom-5 left-1/2 z-[200] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center gap-3 border px-5 py-4 text-sm shadow-2xl sm:left-auto sm:right-6 sm:translate-x-0 ${toast.type === "success" ? "border-gold-300/40 bg-ink text-ivory" : "border-red-400/50 bg-[#261313] text-red-100"}`}
          role="status"
        >
          {toast.type === "success" ? (
            <Check className="h-4 w-4 text-gold-300" />
          ) : (
            <X className="h-4 w-4 text-red-300" />
          )}
          <span className="flex-1">{toast.message}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            aria-label="Dismiss message"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : null}
    </CouponContext.Provider>
  );
}

export function useCoupons() {
  const context = useContext(CouponContext);
  if (!context)
    throw new Error("useCoupons must be used inside CouponProvider");
  return context;
}
