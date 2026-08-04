import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  href?: string;
  variant?: "gold" | "outline" | "ghost";
  showArrow?: boolean;
}

const styles = {
  gold: "border-gold-300 bg-gold-300 text-ink hover:bg-ivory",
  outline: "border-white/20 bg-white/[0.02] text-ivory hover:border-gold-300/60 hover:text-gold-300",
  ghost: "border-transparent text-ivory hover:text-gold-300",
};

export function Button({
  children,
  href,
  variant = "gold",
  showArrow = false,
  className,
  ...props
}: ButtonProps) {
  const classes = cn(
    "group inline-flex min-h-12 items-center justify-center gap-3 border px-5 text-center text-[0.58rem] font-semibold uppercase tracking-luxury outline-none transition-all duration-500 ease-luxury hover:-translate-y-0.5 focus-visible:ring-1 focus-visible:ring-gold-300 disabled:pointer-events-none disabled:opacity-50 sm:px-7 sm:text-[0.62rem]",
    styles[variant],
    className,
  );

  const content = (
    <>
      {children}
      {showArrow && (
        <ArrowUpRight className="size-3.5 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {content}
    </button>
  );
}
