import Link from "next/link";
import LegalQuickNav from "../../components/LegalQuickNav";
import { getSiteUrl } from "../../lib/siteUrl";

const base = getSiteUrl();

export const metadata = {
  title: "Privacy Policy | Wrapify Solutions",
  description: "How Wrapify Solutions collects, uses, and protects your personal information.",
  alternates: { canonical: `${base}/privacy` },
  robots: { index: true, follow: true }
};

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <div className="container legal-inner">
        <LegalQuickNav current="privacy" />
        <p className="eyebrow">Legal</p>
        <h1>Privacy Policy</h1>
        <p className="legal-updated">Last updated: May 7, 2026</p>
        <p className="section-intro">
          This policy describes how Wrapify Solutions (&quot;we&quot;, &quot;us&quot;) handles information when you use our website
          and services. By using the site, you agree to this policy.
        </p>

        <h2>Information we collect</h2>
        <p>
          We may collect information you provide directly, such as your name, email address, phone number, and project
          details when you contact us or submit forms. We may also collect technical data automatically (for example
          browser type, device information, and general usage data) to keep the site secure and improve performance.
        </p>

        <h2>How we use information</h2>
        <p>We use your information to:</p>
        <ul className="legal-list">
          <li>Respond to inquiries and deliver our services</li>
          <li>Operate, secure, and improve our website</li>
          <li>Comply with legal obligations where applicable</li>
        </ul>

        <h2>Sharing</h2>
        <p>
          We do not sell your personal information. We may share data with trusted service providers who assist us
          (such as hosting or email delivery) under appropriate safeguards, or when required by law.
        </p>

        <h2>Retention</h2>
        <p>
          We retain information only as long as needed for the purposes described above or as required by law, unless a
          longer period is agreed with you for an ongoing engagement.
        </p>

        <h2>Your choices</h2>
        <p>
          You may contact us to request access, correction, or deletion of your personal information where applicable.
          See our <Link href="/cookies">Cookie Policy</Link> for choices about cookies.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about this policy:{" "}
          <a href="mailto:wrapifysolutions@gmail.com">wrapifysolutions@gmail.com</a>
        </p>

        <p className="legal-back">
          <Link href="/">← Back to home</Link>
        </p>
      </div>
    </main>
  );
}
