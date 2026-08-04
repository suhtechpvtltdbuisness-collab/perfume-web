"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, UserRound } from "lucide-react";

import { useAuth } from "@/components/providers/auth-provider";
import { cn } from "@/lib/utils";

export function AccountMenu({
  onNavigate,
  className,
}: {
  onNavigate?: () => void;
  className?: string;
}) {
  const router = useRouter();
  const { user, isReady, isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!isReady) {
    return (
      <span className={cn("block p-2 text-ivory/30", className)} aria-hidden>
        <UserRound className="size-4" />
      </span>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <Link
        href="/login"
        aria-label="Account"
        onClick={onNavigate}
        className={cn("block p-2 text-ivory/95 transition hover:text-gold-300", className)}
      >
        <UserRound className="size-4" />
      </Link>
    );
  }

  const signOut = async () => {
    setOpen(false);
    onNavigate?.();
    await logout();
    router.push("/login");
  };

  return (
    <div ref={root} className={cn("relative", className)}>
      <button
        type="button"
        aria-label="Account menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="block p-2 text-ivory/95 transition hover:text-gold-300"
      >
        <UserRound className="size-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 min-w-[12rem] border border-white/10 bg-obsidian/95 p-2 shadow-2xl backdrop-blur-xl">
          <p className="truncate px-3 py-2 text-[0.65rem] uppercase tracking-editorial text-mist/70">
            {user.name || user.email}
          </p>
          {isAuthenticated && user.role === "admin" && (
            <Link
              href="/admin"
              onClick={() => {
                setOpen(false);
                onNavigate?.();
              }}
              className="block px-3 py-2.5 text-[0.68rem] uppercase tracking-luxury text-ivory/90 transition hover:bg-white/[0.04] hover:text-gold-300"
            >
              Admin dashboard
            </Link>
          )}
          <button
            type="button"
            onClick={() => void signOut()}
            className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-[0.68rem] uppercase tracking-luxury text-ivory/90 transition hover:bg-white/[0.04] hover:text-gold-300"
          >
            <LogOut className="size-3.5" />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
