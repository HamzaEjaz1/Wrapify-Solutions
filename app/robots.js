import { getSiteUrl } from "../lib/siteUrl";

export default function robots() {
  const base = getSiteUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"]
      }
    ],
    sitemap: `${base}/sitemap.xml`
  };
}
