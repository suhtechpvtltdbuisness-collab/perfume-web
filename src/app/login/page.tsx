import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthGate } from "@/components/auth/auth-gate";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = { title: "Sign In" };

export default function LoginPage() {
  return (
    <AuthGate>
      <div className="flex min-h-screen items-center bg-ink py-28 sm:py-36">
        <Container>
          <div className="mx-auto max-w-md">
            <p className="text-center text-[0.58rem] uppercase tracking-luxury text-gold-300">Private client</p>
            <h1 className="mb-10 mt-4 text-center font-display text-5xl sm:text-6xl">Welcome back.</h1>
            <AuthForm mode="login" />
          </div>
        </Container>
      </div>
    </AuthGate>
  );
}
