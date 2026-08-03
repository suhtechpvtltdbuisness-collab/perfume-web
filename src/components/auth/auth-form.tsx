"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { ApiError, authApi } from "@/lib/auth-api";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const { login, register } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setResetMessage(null);
    setLoading(true);

    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");
    const name = String(data.get("name") ?? "").trim();

    try {
      if (mode === "register") await register(name, email, password);
      else await login(email, password);
      router.push("/shop");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async () => {
    const emailInput = document.getElementById("email") as HTMLInputElement | null;
    const email = emailInput?.value?.trim() ?? "";
    if (!email) {
      setError("Enter your email first");
      return;
    }
    setError(null);
    try {
      const res = await authApi.forgotPassword(email);
      setResetMessage(res.message);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      {mode === "register" && <Field id="name" label="Full name" type="text" />}
      <Field id="email" label="Email address" type="email" />
      <Field id="password" label="Password" type="password" />
      {mode === "login" && (
        <div className="text-right">
          <button
            type="button"
            onClick={forgotPassword}
            className="text-[0.55rem] uppercase tracking-editorial text-gold-300 hover:text-ivory"
          >
            Forgot password?
          </button>
        </div>
      )}
      {error && <p className="text-xs text-red-300">{error}</p>}
      {resetMessage && <p className="text-xs text-gold-300">{resetMessage}</p>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading
          ? mode === "login"
            ? "Signing in…"
            : "Creating account…"
          : mode === "login"
            ? "Sign in"
            : "Create account"}
      </Button>
      <p className="pt-3 text-center text-xs text-mist/50">
        {mode === "login" ? "New to Autoroma?" : "Already have an account?"}{" "}
        <Link href={mode === "login" ? "/register" : "/login"} className="text-gold-300 hover:text-ivory">
          {mode === "login" ? "Create an account" : "Sign in"}
        </Link>
      </p>
    </form>
  );
}

function Field({ id, label, type }: { id: string; label: string; type: string }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[0.52rem] uppercase tracking-luxury text-mist/55">{label}</label>
      <input id={id} name={id} type={type} required className="h-14 w-full border border-white/10 bg-white/[0.025] px-4 text-sm text-ivory outline-none transition focus:border-gold-300/60" />
    </div>
  );
}
