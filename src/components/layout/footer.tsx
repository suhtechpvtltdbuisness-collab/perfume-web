import Link from "next/link";
import { MapPin, Phone } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Wordmark } from "@/components/ui/wordmark";

const footerLinks = [
  ["Explore", [["Collection", "/shop"], ["Our Story", "/story"], ["Contact", "/contact"]]],
  ["Client care", [["Shipping & returns", "/contact"], ["FAQ", "/faq"]]],
] as const;

export function Footer() {
  return (
    <footer className="border-t border-white/15 bg-[#070707]">
      <Container className="grid gap-x-12 gap-y-14 py-20 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.9fr_1fr] lg:py-24">
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
        <div>
          <p className="text-xs font-semibold uppercase tracking-luxury text-gold-300">Contact</p>
          <div className="mt-7 space-y-6">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-gold-300" aria-hidden="true" />
              <div>
                <p className="text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-ivory/50">Address</p>
                <address className="mt-2 text-sm not-italic leading-6 text-ivory/85">
                  Noida 201301<br />India
                </address>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-gold-300" aria-hidden="true" />
              <div>
                <p className="text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-ivory/50">Phone</p>
                <a href="tel:+917061261991" className="mt-2 inline-block text-sm text-ivory/85 transition hover:text-gold-300">
                  +91 70612 61991
                </a>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <Container className="flex flex-col gap-4 border-t border-white/15 py-7 text-xs font-medium uppercase tracking-luxury text-ivory/75 sm:flex-row sm:justify-between">
        <p>© 2026 Autoroma</p>
        <p>Privacy · Terms · India</p>
      </Container>
    </footer>
  );
}
