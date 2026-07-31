import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = { title: "Create Account" };

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center bg-ink py-36">
      <Container>
        <div className="mx-auto max-w-md">
          <p className="text-center text-[0.58rem] uppercase tracking-luxury text-gold-300">Join the maison</p>
          <h1 className="mb-10 mt-4 text-center font-display text-6xl">Create account.</h1>
          <AuthForm mode="register" />
        </div>
      </Container>
    </div>
  );
}
