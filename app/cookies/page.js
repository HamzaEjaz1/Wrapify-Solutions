import Link from "next/link";
import LegalQuickNav from "../../components/LegalQuickNav";
import { getSiteUrl } from "../../lib/siteUrl";

const base = getSiteUrl();

export const metadata = {
  title: "Cookie Policy | Wrapify Solutions",
  description: "How Wrapify Solutions uses cookies and similar technologies on this website.",
  alternates: { canonical: `${base}/cookies` },
  robots: { index: true, follow: true }
};

export default function CookiesPage() {
  return (
    <main className="legal-page">
      <div className="container legal-inner">
        <LegalQuickNav current="cookies" />
        <p className="eyebrow">Legal</p>
        <h1>Cookie Policy</h1>
        <p className="legal-updated">Last updated: May 7, 2026</p>
        <p className="section-intro">
          This policy explains how we use cookies and similar technologies, and how you can control them.
        </p>

        <h2>What are cookies?</h2>
        <p>
          Cookies are small text files stored on your device when you visit a website. They help the site function,
          remember preferences, and understand how visitors use the site.
        </p>

        <h2>How we use cookies</h2>
        <p>We may use cookies to:</p>
        <ul className="legal-list">
          <li>Remember essential preferences (for example theme or session needs)</li>
          <li>Maintain security and prevent abuse</li>
          <li>Measure basic usage to improve performance and content</li>
        </ul>

        <h2>Third-party cookies</h2>
        <p>
          Some pages may include embedded content or tools from third parties. Those providers may set their own
          cookies. We do not control third-party cookies; please review their policies.
        </p>

        <h2>Managing cookies</h2>
        <p>
          You can block or delete cookies through your browser settings. If you disable cookies, parts of the site may
          not work as intended (for example saved preferences).
        </p>

        <h2>Updates</h2>
        <p>We may update this policy when our practices change. The &quot;Last updated&quot; date will be revised accordingly.</p>

        <h2>Contact</h2>
        <p>
          Questions: <a href="mailto:wrapifysolutions@gmail.com">wrapifysolutions@gmail.com</a>
        </p>
        <p>
          Related: <Link href="/privacy">Privacy Policy</Link>
        </p>

        <p className="legal-back">
          <Link href="/">← Back to home</Link>
        </p>
      </div>
    </main>
  );
}
