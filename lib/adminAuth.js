/**
 * Server-side admin secret. Set ADMIN_BLOG_TOKEN in .env.local (no quotes).
 * If unset or blank, development default is "wrapify-admin".
 */
export function getExpectedAdminToken() {
  const raw = process.env.ADMIN_BLOG_TOKEN;
  if (raw === undefined || raw === null) {
    return "wrapify-admin";
  }
  const trimmed = String(raw).trim();
  if (trimmed === "") {
    return "wrapify-admin";
  }
  return trimmed;
}

/** Read token from request: JSON body (POST), then x-admin-token header. Values are trimmed. */
export async function readAdminTokenFromRequest(req) {
  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      const body = await req.json();
      const fromBody = body?.token ?? body?.password;
      if (fromBody != null && String(fromBody).trim() !== "") {
        return String(fromBody).trim();
      }
    } catch {
      /* ignore */
    }
  }
  const header = req.headers.get("x-admin-token");
  return header ? header.trim() : "";
}

export function isAdminAuthorized(req) {
  const token = req.headers.get("x-admin-token")?.trim() ?? "";
  const expected = getExpectedAdminToken();
  return Boolean(expected && token === expected);
}

export function tokenMatchesExpected(token) {
  const t = token != null ? String(token).trim() : "";
  const expected = getExpectedAdminToken();
  return Boolean(t && expected && t === expected);
}
