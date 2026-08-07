import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      introduction="This policy explains how Autoroma collects, uses and protects information when you browse our website, create an account, contact us or place an order."
      sections={[
        {
          title: "Information we collect",
          content: <p>We may collect your name, email address, phone number, delivery and billing address, account details, order history, enquiries, and technical information such as browser type and device data.</p>,
        },
        {
          title: "How we use information",
          content: <p>We use your information to process and deliver orders, provide customer support, manage accounts, prevent fraud, improve our services, and send marketing communications only where permitted.</p>,
        },
        {
          title: "Payments and service providers",
          content: <p>Payments may be handled by secure third-party payment providers. We may share only the information necessary with delivery, technology, analytics and customer-service partners that help us operate the store.</p>,
        },
        {
          title: "Cookies and local storage",
          content: <p>We may use cookies and similar browser storage to keep your bag and session working, remember preferences, understand site performance and improve your experience.</p>,
        },
        {
          title: "Retention and security",
          content: <p>We retain information only as long as reasonably necessary for the purposes described here or to meet legal obligations. We use reasonable safeguards, but no online system can be guaranteed completely secure.</p>,
        },
        {
          title: "Your choices",
          content: <p>You may ask to access, correct or delete eligible personal information, withdraw marketing consent, or raise a privacy question by contacting our client-care team.</p>,
        },
        {
          title: "Contact us",
          content: <p>Email care@autoroma.com or call +91 70612 61991. Our correspondence address is Noida 201301, India.</p>,
        },
      ]}
    />
  );
}
