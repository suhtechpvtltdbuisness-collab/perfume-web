"use client";

import { useEffect, useState } from "react";

type ScrollDirection = "up" | "down";

export function useScrollDirection(threshold = 10) {
  const [direction, setDirection] = useState<ScrollDirection>("up");

  useEffect(() => {
    let previousY = window.scrollY;
    let ticking = false;

    const updateDirection = () => {
      const currentY = window.scrollY;
      const delta = currentY - previousY;

      if (Math.abs(delta) >= threshold) {
        setDirection(delta > 0 && currentY > 96 ? "down" : "up");
        previousY = currentY;
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateDirection);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return direction;
}
