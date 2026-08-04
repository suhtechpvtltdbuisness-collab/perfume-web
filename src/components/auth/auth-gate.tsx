"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/providers/auth-provider";

export function AuthGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, isReady, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isReady || !isAuthenticated || !user) return;
    router.replace(user.role === "admin" ? "/admin" : "/shop");
  }, [isAuthenticated, isReady, router, user]);

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink text-sm text-mist/75">
        Checking session…
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink text-sm text-mist/75">
        Redirecting…
      </div>
    );
  }

  return <>{children}</>;
}
