import { NextResponse } from "next/server";
import { isAdminAuthorized } from "../../../lib/adminAuth";
import { getSiteContent, saveSiteContent } from "../../../lib/siteContentStore";
import { DEFAULT_SITE_CONTENT } from "../../../lib/siteContentDefaults";

function validateShape(body) {
  if (!body || typeof body !== "object") return "Invalid payload";
  if (!Array.isArray(body.testimonials)) return "testimonials must be an array";
  if (!Array.isArray(body.partners)) return "partners must be an array";
  if (!Array.isArray(body.services)) return "services must be an array";
  if (!Array.isArray(body.portfolioCategories)) return "portfolioCategories must be an array";
  for (const t of body.testimonials) {
    if (!t || typeof t.name !== "string" || typeof t.quote !== "string") return "Each testimonial needs name and quote";
  }
  for (const p of body.partners) {
    if (!p || typeof p.name !== "string" || typeof p.logo !== "string") return "Each partner needs name and logo";
  }
  for (const s of body.services) {
    if (!s || typeof s.id !== "string" || typeof s.title !== "string") return "Each service needs id and title";
    if (!Array.isArray(s.bullets)) return "Service bullets must be an array";
  }
  for (const c of body.portfolioCategories) {
    if (!c || typeof c.id !== "string" || !Array.isArray(c.items)) return "Invalid use case category";
  }
  return null;
}

export async function GET() {
  const content = await getSiteContent();
  return NextResponse.json(content);
}

export async function PUT(req) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const err = validateShape(body);
  if (err) {
    return NextResponse.json({ error: err }, { status: 400 });
  }

  await saveSiteContent(body);
  return NextResponse.json({ ok: true, content: body });
}

export async function POST(req) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const defaults = JSON.parse(JSON.stringify(DEFAULT_SITE_CONTENT));
  await saveSiteContent(defaults);
  return NextResponse.json({ ok: true, content: defaults });
}
