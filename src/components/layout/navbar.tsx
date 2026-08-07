"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { navigationItems } from "@/constants/navigation";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { MenuButton } from "@/components/ui/menu-button";
import { Wordmark } from "@/components/ui/wordmark";
import { useCart } from "@/components/providers/cart-provider";
import { AccountMenu } from "@/components/layout/account-menu";
import { useAuth } from "@/components/providers/auth-provider";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const scrollDirection = useScrollDirection();
  const { itemCount } = useCart();
  const { isAuthenticated, isReady, logout, user } = useAuth();
  const isAdmin = isReady && isAuthenticated && user?.role === "admin";
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isOpen);
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-ink/60 backdrop-blur-xl transition-transform duration-700 ease-luxury",
        scrollDirection === "down" && !isOpen && "-translate-y-full",
      )}
    >
      <Container className="flex h-20 items-center justify-between sm:h-24">
        <nav aria-label="Primary navigation" className="hidden flex-1 xl:block">
          <ul className="flex items-center gap-9">
            {navigationItems.slice(1, 3).map((item) => (
              <li key={item.href}>
                <NavLink href={item.href}>{item.label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <Wordmark className="xl:absolute xl:left-1/2 xl:-translate-x-1/2" />

        <nav aria-label="Secondary navigation" className="hidden flex-1 xl:block">
          <ul className="flex items-center justify-end gap-7">
            {navigationItems.slice(3).map((item) => (
              <li key={item.href}>
                <NavLink href={item.href}>{item.label}</NavLink>
              </li>
            ))}
            {isAdmin && (
              <li>
                <Link
                  href="/admin"
                  className="border border-gold-300/40 px-4 py-2 text-[0.6rem] font-semibold uppercase tracking-luxury text-gold-300 transition hover:border-gold-300 hover:bg-gold-300 hover:text-ink"
                >
                  Admin dashboard
                </Link>
              </li>
            )}
            <li>
              <AccountMenu />
            </li>
            <li>
              <Link href="/cart" aria-label={`Shopping bag with ${itemCount} items`} className="relative block p-2 text-ivory/95 transition hover:text-gold-300">
                <ShoppingBag className="size-4" />
                {itemCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-gold-300 text-[0.62rem] font-bold text-ink">
                    {itemCount}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-2 xl:hidden">
          <Link
            href="/cart"
            onClick={closeMenu}
            aria-label={`Open shopping bag with ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
            className="group relative flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-ivory outline-none transition-colors duration-500 hover:border-gold-400/40 hover:text-gold-300 focus-visible:ring-1 focus-visible:ring-gold-400"
          >
            <ShoppingBag className="size-[1.15rem] stroke-[1.5]" aria-hidden="true" />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-1 flex min-w-5 items-center justify-center rounded-full bg-gold-300 px-1 text-[0.62rem] font-bold leading-5 text-ink shadow-[0_0_0_3px_rgba(10,9,8,0.9)]">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>
          <MenuButton isOpen={isOpen} onClick={() => setIsOpen((value) => !value)} />
        </div>
      </Container>

      <div
        id="mobile-navigation"
        className={cn(
          "fixed inset-x-0 top-20 h-[calc(100dvh-5rem)] overflow-y-auto bg-ink/95 backdrop-blur-2xl transition-[opacity,visibility] duration-500 sm:top-24 sm:h-[calc(100dvh-6rem)] xl:hidden",
          isOpen ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        <Container className="flex min-h-full flex-col justify-center py-10 sm:py-14">
          <nav aria-label="Mobile navigation">
            <ul className="space-y-3">
              {navigationItems.map((item, index) => (
                <li
                  key={item.href}
                  className={cn(
                    "translate-y-4 opacity-0 transition duration-700 ease-luxury",
                    isOpen && "translate-y-0 opacity-100",
                    index === 1 && "delay-75",
                    index === 2 && "delay-150",
                    index === 3 && "delay-200",
                  )}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="group flex items-baseline gap-5 border-b border-white/10 py-4 font-display text-4xl text-ivory outline-none transition-colors hover:text-gold-300 focus-visible:text-gold-300 sm:text-5xl"
                  >
                    <span className="font-sans text-[0.6rem] tracking-luxury text-gold-400">
                      0{index + 1}
                    </span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <p className="mt-14 text-[0.6rem] uppercase tracking-luxury text-mist/75">
            Paris · Grasse · Since 1927
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            {isAdmin && (
              <Link
                href="/admin"
                onClick={closeMenu}
                className="border border-gold-300/40 px-4 py-2 text-[0.68rem] uppercase tracking-luxury text-gold-300"
              >
                Admin dashboard
              </Link>
            )}
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => {
                  closeMenu();
                  void logout();
                }}
                className="text-[0.68rem] uppercase tracking-luxury text-gold-300"
              >
                Log out
              </button>
            ) : (
              <Link href="/login" onClick={closeMenu} className="text-[0.68rem] uppercase tracking-luxury text-gold-300">
                Account
              </Link>
            )}
            <Link href="/cart" onClick={closeMenu} className="text-[0.68rem] uppercase tracking-luxury text-gold-300">
              Bag ({itemCount})
            </Link>
          </div>
        </Container>
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      className="group relative py-2 text-[0.7rem] font-semibold uppercase tracking-luxury text-ivory/95 outline-none transition-colors duration-300 hover:text-gold-300 focus-visible:text-gold-300"
    >
      {children}
      <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gold-400 transition-transform duration-500 ease-luxury group-hover:scale-x-100 group-focus-visible:scale-x-100" />
    </Link>
  );
}
