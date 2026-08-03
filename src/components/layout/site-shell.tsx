import type { ReactNode } from "react";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { AuthProvider } from "@/components/providers/auth-provider";
import { CartProvider } from "@/components/providers/cart-provider";
import { ExperienceProvider } from "@/components/providers/experience-provider";
import { SiteContentProvider } from "@/components/providers/site-content-provider";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <ExperienceProvider>
      <SiteContentProvider>
        <AuthProvider>
          <CartProvider>
            <a
              href="#main-content"
              className="fixed left-4 top-4 z-[100] -translate-y-24 bg-ivory px-4 py-3 text-xs font-semibold uppercase tracking-widest text-ink transition-transform focus:translate-y-0"
            >
              Skip to content
            </a>
            <Navbar />
            <main id="main-content">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </SiteContentProvider>
    </ExperienceProvider>
  );
}
