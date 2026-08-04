import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";

interface WordmarkProps {
  className?: string;
  onClick?: () => void;
  size?: "default" | "large";
}

export function Wordmark({ className, onClick, size = "default" }: WordmarkProps) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className={cn(
        "group relative block shrink-0 overflow-hidden outline-none focus-visible:ring-1 focus-visible:ring-gold-400",
        size === "default" ? "h-14 w-36 sm:h-16 sm:w-44" : "h-24 w-60 sm:h-28 sm:w-72",
        className,
      )}
      aria-label="Autoroma — home"
    >
      <Image
        src="/images/autoroma-logo-compact.png"
        alt="Autoroma"
        fill
        priority
        sizes={size === "default" ? "176px" : "288px"}
        className="object-contain transition-opacity duration-300 group-hover:opacity-90"
      />
    </Link>
  );
}
