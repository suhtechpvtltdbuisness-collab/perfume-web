"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import Lenis from "lenis";

import { cn } from "@/lib/utils";
export function ExperienceProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => setLoading(false), reduced ? 50 : 1500);
    if (reduced) return () => window.clearTimeout(timer);

    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = window.requestAnimationFrame(raf);
    };
    frame = window.requestAnimationFrame(raf);

    return () => {
      window.clearTimeout(timer);
      window.cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-[200] flex items-center justify-center bg-ink transition-[opacity,visibility] duration-700",
          loading ? "visible opacity-100" : "invisible opacity-0",
        )}
        aria-hidden={!loading}
      >
        <div className="text-center">
          <div className="relative mx-auto h-28 w-64 sm:h-32 sm:w-72">
            <Image
              src="/images/autoroma-logo-compact.png"
              alt="Autoroma"
              fill
              priority
              sizes="288px"
              className="object-contain"
            />
          </div>
          <div className="mx-auto mt-3 h-px w-32 overflow-hidden bg-white/10">
            <div className="h-full origin-left animate-line-in bg-gold-300" />
          </div>
        </div>
      </div>
      {children}
    </>
  );
}
