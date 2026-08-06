import { ApiError } from "@/lib/auth-api";
import type { LandingContent } from "@/types/site-content";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";

type LandingResponse = {
  message?: string;
  landing: LandingContent;
};

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

export const landingApi = {
  get: () => request<LandingResponse>("/api/landing", { cache: "no-store" }),

  update: (landing: LandingContent, token: string) =>
    request<LandingResponse>(
      "/api/landing",
      { method: "PUT", body: JSON.stringify(landing) },
      token,
    ),

  reset: (token: string) =>
    request<LandingResponse>("/api/landing/reset", { method: "POST" }, token),
};
