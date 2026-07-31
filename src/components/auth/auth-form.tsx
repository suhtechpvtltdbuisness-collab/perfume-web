"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const [submitted, setSubmitted] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="border border-gold-300/30 bg-gold-300/[0.05] p-8 text-center">
        <p className="font-display text-3xl text-gold-300">Welcome to the maison.</p>
        <p className="mt-4 text-sm leading-6 text-mist/60">
          Demo authentication is working at the interface level. Connect your preferred auth provider when backend credentials are available.
        </p>
        <Button href="/shop" variant="outline" className="mt-7">Continue shopping</Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      {mode === "register" && <Field id="name" label="Full name" type="text" />}
      <Field id="email" label="Email address" type="email" />
      <Field id="password" label="Password" type="password" />
      {mode === "login" && (
        <div className="text-right">
          <button type="button" className="text-[0.55rem] uppercase tracking-editorial text-gold-300 hover:text-ivory">
            Forgot password?
          </button>
        </div>
      )}
      <Button type="submit" className="w-full">
        {mode === "login" ? "Sign in" : "Create account"}
      </Button>
      <p className="pt-3 text-center text-xs text-mist/50">
        {mode === "login" ? "New to Maison Aurélia?" : "Already have an account?"}{" "}
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
