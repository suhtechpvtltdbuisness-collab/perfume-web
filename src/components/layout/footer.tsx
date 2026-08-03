import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Wordmark } from "@/components/ui/wordmark";

const footerLinks = [
  ["Explore", [["Collection", "/shop"], ["Our Story", "/story"], ["Contact", "/contact"]]],
  ["Client care", [["Shipping & returns", "/contact"], ["FAQ", "/contact"], ["Account", "/login"]]],
] as const;

export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#050505]">
      <Container className="grid gap-16 py-20 lg:grid-cols-[1.5fr_1fr_1fr] lg:py-28">
        <div>
          <Wordmark className="w-fit items-start" />
          <p className="mt-7 max-w-sm text-sm leading-7 text-mist/55">
            Rare materials, exacting craft and fragrances designed to live close to the skin.
          </p>
        </div>
        {footerLinks.map(([title, links]) => (
          <div key={title}>
            <p className="text-[0.58rem] uppercase tracking-luxury text-gold-400">{title}</p>
            <ul className="mt-6 space-y-4">
              {links.map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-mist/65 transition hover:text-ivory">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>
      <Container className="flex flex-col gap-4 border-t border-white/[0.06] py-7 text-[0.52rem] uppercase tracking-luxury text-mist/35 sm:flex-row sm:justify-between">
        <p>© 2026 Autoroma</p>
        <p>Privacy · Terms · India</p>
      </Container>
    </footer>
  );
}
