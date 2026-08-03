import Link from "next/link";

import { cn } from "@/lib/utils";

interface WordmarkProps {
  className?: string;
  onClick?: () => void;
}

export function Wordmark({ className, onClick }: WordmarkProps) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className={cn(
        "group flex flex-col items-center text-ivory outline-none focus-visible:ring-1 focus-visible:ring-gold-400",
        className,
      )}
      aria-label="Autoroma — home"
    >
      <span className="font-display text-xl leading-none tracking-[0.18em] sm:text-2xl">
        AUTOROMA
      </span>
      <span className="mt-1 text-[0.42rem] font-medium uppercase tracking-[0.48em] text-gold-300/70">
        Luxury Fragrances
      </span>
    </Link>
  );
}
