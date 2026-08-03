export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "customer" | "admin";
};

export type AuthResponse = {
  message: string;
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const data = (await res.json().catch(() => ({}))) as {
    message?: string;
  };

  if (!res.ok) {
    throw new ApiError(data.message ?? "Request failed", res.status);
  }

  return data as T;
}

export const authApi = {
  register: (body: { name: string; email: string; password: string }) =>
    request<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  login: (body: { email: string; password: string }) =>
    request<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  adminLogin: (body: { email?: string; password: string }) =>
    request<AuthResponse>("/api/auth/admin/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  me: (token: string) =>
    request<{ user: AuthUser }>("/api/auth/me", { method: "GET" }, token),

  logout: (token?: string | null) =>
    request<{ message: string }>(
      "/api/auth/logout",
      { method: "POST" },
      token,
    ),

  forgotPassword: (email: string) =>
    request<{ message: string }>("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
};
