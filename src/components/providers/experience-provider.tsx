"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";

import { cn } from "@/lib/utils";
import { SportsCarLoader } from "@/components/ui/sports-car-loader";

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const cursor = useRef<HTMLDivElement>(null);

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

    const moveX = cursor.current ? gsap.quickTo(cursor.current, "x", { duration: 0.35, ease: "power3" }) : null;
    const moveY = cursor.current ? gsap.quickTo(cursor.current, "y", { duration: 0.35, ease: "power3" }) : null;
    const onMove = (event: PointerEvent) => {
      moveX?.(event.clientX);
      moveY?.(event.clientY);
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      window.clearTimeout(timer);
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
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
        <SportsCarLoader />
      </div>
      <div
        ref={cursor}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[120] hidden size-7 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold-300/50 bg-gold-300/5 mix-blend-screen md:block"
      />
      {children}
    </>
  );
}
