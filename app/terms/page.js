import Link from "next/link";
import LegalQuickNav from "../../components/LegalQuickNav";
import { getSiteUrl } from "../../lib/siteUrl";

const base = getSiteUrl();

export const metadata = {
  title: "Terms & Conditions | Wrapify Solutions",
  description: "Terms governing use of the Wrapify Solutions website and engagement with our services.",
  alternates: { canonical: `${base}/terms` },
  robots: { index: true, follow: true }
};

export default function TermsPage() {
  return (
    <main className="legal-page">
      <div className="container legal-inner">
        <LegalQuickNav current="terms" />
        <p className="eyebrow">Legal</p>
        <h1>Terms &amp; Conditions</h1>
        <p className="legal-updated">Last updated: May 7, 2026</p>
        <p className="section-intro">
          These terms govern your use of the Wrapify Solutions website. Separate written agreements apply to specific
          client projects and deliverables.
        </p>

        <h2>Use of the website</h2>
        <p>
          You agree to use the site lawfully and not to interfere with its security or availability. Content on this site
          is provided for general information and may change without notice.
        </p>

        <h2>Intellectual property</h2>
        <p>
          Unless otherwise stated, branding, text, graphics, and other materials on this site are owned by Wrapify
          Solutions or its licensors. You may not copy or reuse them for commercial purposes without permission.
        </p>

        <h2>Services and proposals</h2>
        <p>
          Descriptions of services on the website are illustrative. Scope, timelines, fees, and deliverables for any
          engagement are defined only in a signed statement of work or contract between you and Wrapify Solutions.
        </p>

        <h2>Disclaimer</h2>
        <p>
          The site is provided &quot;as is&quot; without warranties of any kind, to the fullest extent permitted by law.
          We are not liable for indirect or consequential damages arising from your use of the site.
        </p>

        <h2>Links</h2>
        <p>
          Third-party links may appear on the site for convenience. We are not responsible for third-party content or
          practices.
        </p>

        <h2>Changes</h2>
        <p>We may update these terms from time to time. Continued use of the site after changes constitutes acceptance.</p>

        <h2>Contact</h2>
        <p>
          For questions: <a href="mailto:wrapifysolutions@gmail.com">wrapifysolutions@gmail.com</a>
        </p>

        <p className="legal-back">
          <Link href="/">← Back to home</Link>
        </p>
      </div>
    </main>
  );
}
