import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms & Conditions"
      introduction="These terms govern your use of the Autoroma website and purchases made through it. By using the site or placing an order, you agree to these terms."
      sections={[
        {
          title: "Using this website",
          content: <p>You must use this website lawfully and provide accurate information when creating an account, contacting us or placing an order. You are responsible for keeping your account credentials secure.</p>,
        },
        {
          title: "Products and availability",
          content: <p>We aim to present product descriptions, imagery and availability accurately. Colours and packaging may vary slightly by screen or production batch. Products remain subject to availability.</p>,
        },
        {
          title: "Prices and payment",
          content: <p>Prices are displayed in Indian rupees unless stated otherwise. Applicable charges are shown before checkout. An order is accepted only after payment is confirmed and we issue an order confirmation.</p>,
        },
        {
          title: "Delivery",
          content: <p>Delivery estimates are indicative and may be affected by location, courier operations or events outside our reasonable control. Please provide a complete and serviceable delivery address.</p>,
        },
        {
          title: "Returns and damaged orders",
          content: <p>For return eligibility or an item received damaged, contact client care promptly with your order details and supporting photographs. Hygiene, safety and product-condition requirements may apply.</p>,
        },
        {
          title: "Intellectual property",
          content: <p>The Autoroma name, branding, website design, text, images and other content are owned by or licensed to Autoroma and may not be copied or commercially used without permission.</p>,
        },
        {
          title: "Liability and changes",
          content: <p>Nothing in these terms excludes rights that cannot legally be excluded. We may update the website or these terms from time to time; the latest version and update date will appear on this page.</p>,
        },
        {
          title: "Contact",
          content: <p>For questions, email care@autoroma.com, call +91 70612 61991, or write to us at Noida 201301, India.</p>,
        },
      ]}
    />
  );
}
