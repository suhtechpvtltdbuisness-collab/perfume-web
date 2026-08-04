import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Wordmark } from "@/components/ui/wordmark";

const footerLinks = [
  ["Explore", [["Collection", "/shop"], ["Our Story", "/story"], ["Contact", "/contact"]]],
  ["Client care", [["Shipping & returns", "/contact"], ["FAQ", "/faq"]]],
] as const;

export function Footer() {
  return (
    <footer className="border-t border-white/15 bg-[#070707]">
      <Container className="grid gap-16 py-20 lg:grid-cols-[1.5fr_1fr_1fr] lg:py-28">
        <div>
          <Wordmark size="large" />
          <p className="mt-7 max-w-sm text-base font-medium leading-8 text-ivory/85">
            Rare materials, exacting craft and fragrances designed to live close to the skin.
          </p>
        </div>
        {footerLinks.map(([title, links]) => (
          <div key={title}>
            <p className="text-xs font-semibold uppercase tracking-luxury text-gold-300">{title}</p>
            <ul className="mt-7 space-y-5">
              {links.map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-base font-medium text-ivory/85 transition hover:text-gold-300">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>
      <Container className="flex flex-col gap-4 border-t border-white/15 py-7 text-xs font-medium uppercase tracking-luxury text-ivory/75 sm:flex-row sm:justify-between">
        <p>© 2026 Autoroma</p>
        <p>Privacy · Terms · India</p>
      </Container>
    </footer>
  );
}
