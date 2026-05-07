import "./globals.css";
import SiteChrome from "../components/SiteChrome";
import { getSiteUrl } from "../lib/siteUrl";
import VisitorTracker from "./VisitorTracker";

const site = getSiteUrl();
const defaultDescription = "We wrap idea in to digital solutions.";

export const metadata = {
  metadataBase: new URL(site),
  title: {
    default: "Wrapify Solutions",
    template: "%s | Wrapify Solutions"
  },
  description: defaultDescription,
  keywords: [
    "web development",
    "app development",
    "AI automation",
    "chatbot development",
    "UI UX design",
    "digital transformation",
    "USA",
    "MENA",
    "Pakistan",
    "Qatar",
    "Saudi Arabia"
  ],
  authors: [{ name: "Wrapify Solutions", url: site }],
  creator: "Wrapify Solutions",
  publisher: "Wrapify Solutions",
  formatDetection: { email: false, address: false, telephone: false },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 }
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: site,
    siteName: "Wrapify Solutions",
    title: "Wrapify Solutions",
    description: defaultDescription,
    images: [{ url: "/wrapify-logo.png", width: 512, height: 512, alt: "Wrapify Solutions logo" }]
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png"
  },
  twitter: {
    card: "summary_large_image",
    title: "Wrapify Solutions",
    description: defaultDescription,
    images: ["/wrapify-logo.png"]
  },
  category: "technology"
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Wrapify Solutions",
  url: site,
  logo: `${site}/wrapify-logo.png`,
  email: "wrapifysolutions@gmail.com",
  telephone: "+92-343-9024736",
  address: {
    "@type": "PostalAddress",
    streetAddress: "G11 Markaz",
    addressLocality: "Islamabad",
    addressCountry: "PK"
  },
  sameAs: [
    "https://www.facebook.com/profile.php?id=61581415486409",
    "https://www.linkedin.com/company/wrapifysolutions",
    "https://www.instagram.com/wrapifysolutions",
    "https://www.youtube.com/@wrapifysolutions",
    "https://x.com/wrapifysolution"
  ],
  founder: {
    "@type": "Person",
    name: "Hamza Ejaz",
    jobTitle: "CEO"
  }
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Wrapify Solutions",
  url: site,
  publisher: { "@type": "Organization", name: "Wrapify Solutions" }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <VisitorTracker />
        <SiteChrome>{children}</SiteChrome>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </body>
    </html>
  );
}
