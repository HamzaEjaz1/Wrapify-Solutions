function normalizeBase(url) {
  const u = String(url || "")
    .trim()
    .replace(/\/$/, "");
  return u || null;
}

export function getSiteUrl() {
  const fromEnv = normalizeBase(process.env.NEXT_PUBLIC_SITE_URL);
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL) {
    return normalizeBase(`https://${process.env.VERCEL_URL}`);
  }
  return "https://www.wrapifysolutions.com";
}
