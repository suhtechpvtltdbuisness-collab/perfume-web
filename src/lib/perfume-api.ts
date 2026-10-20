import { ApiError } from "@/lib/auth-api";
import type { Product, ProductMedia } from "@/types/product";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";

type PerfumeResponse = {
  message?: string;
  perfume: Product;
};

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<T> {
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = (await res.json().catch(() => ({}))) as { message?: string };

  if (!res.ok) {
    throw new ApiError(data.message ?? "Request failed", res.status);
  }

  return data as T;
}

function toCreateBody(product: Product) {
  return {
    name: product.name,
    slug: product.slug,
    subtitle: product.subtitle,
    family: product.family,
    price: product.price,
    originalPrice: product.originalPrice ?? null,
    size: product.size,
    description: product.description,
    notes: product.notes,
    accent: product.accent,
    featured: Boolean(product.featured),
    isCombo: Boolean(product.isCombo),
    comboItems: product.comboItems ?? [],
    media: (product.media ?? [])
      .filter((item) => Boolean(item.url))
      .map((item) => ({
        url: item.url as string,
        name: item.name,
        type: item.type,
      })),
  };
}

export const perfumeApi = {
  list: () => request<{ perfumes: Product[] }>("/api/perfumes"),

  getBySlug: (slug: string) =>
    request<{ perfume: Product }>(`/api/perfumes/${encodeURIComponent(slug)}`),

  create: (product: Product, token: string) =>
    request<PerfumeResponse>(
      "/api/perfumes",
      { method: "POST", body: JSON.stringify(toCreateBody(product)) },
      token,
    ),

  update: (id: string, product: Product, token: string) =>
    request<PerfumeResponse>(
      `/api/perfumes/${id}`,
      { method: "PUT", body: JSON.stringify(toCreateBody(product)) },
      token,
    ),

  remove: (id: string, token: string) =>
    request<{ message: string }>(
      `/api/perfumes/${id}`,
      { method: "DELETE" },
      token,
    ),

  upload: async (file: File, token: string): Promise<ProductMedia> => {
    const form = new FormData();
    form.append("file", file);
    const data = await request<{ media: ProductMedia }>(
      "/api/perfumes/upload",
      { method: "POST", body: form },
      token,
    );
    return data.media;
  },
};
