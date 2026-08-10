import { ApiError } from "@/lib/auth-api";
import type { CreateOrderInput, CreateOrderResponse, Order } from "@/types/order";

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

export async function createOrder(
  input: CreateOrderInput,
  token?: string | null,
): Promise<CreateOrderResponse> {
  return request<CreateOrderResponse>(
    "/api/orders",
    { method: "POST", body: JSON.stringify(input) },
    token,
  );
}

export async function verifyPayment(
  payload: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  },
  token?: string | null,
): Promise<Order> {
  const data = await request<{ order: Order }>(
    "/api/orders/verify",
    { method: "POST", body: JSON.stringify(payload) },
    token,
  );
  return data.order;
}

export async function markOrderFailed(razorpayOrderId: string): Promise<void> {
  await request<{ message: string }>("/api/orders/failed", {
    method: "POST",
    body: JSON.stringify({ razorpayOrderId }),
  });
}

export async function getMyOrders(token: string): Promise<Order[]> {
  const data = await request<{ orders: Order[] }>(
    "/api/orders/me",
    {},
    token,
  );
  return data.orders;
}

export async function getAllOrders(token: string): Promise<Order[]> {
  const data = await request<{ orders: Order[] }>(
    "/api/orders/admin",
    {},
    token,
  );
  return data.orders;
}

export const orderApi = {
  create: createOrder,
  verify: verifyPayment,
  markFailed: markOrderFailed,
  mine: getMyOrders,
  all: getAllOrders,
};
