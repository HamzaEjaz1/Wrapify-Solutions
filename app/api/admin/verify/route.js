import { NextResponse } from "next/server";
import { readAdminTokenFromRequest, tokenMatchesExpected } from "../../../../lib/adminAuth";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const token = req.headers.get("x-admin-token")?.trim() ?? "";
  if (tokenMatchesExpected(token)) {
    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  }
  return NextResponse.json({ ok: false }, { status: 401, headers: { "Cache-Control": "no-store" } });
}

export async function POST(req) {
  const token = await readAdminTokenFromRequest(req);
  if (tokenMatchesExpected(token)) {
    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  }
  return NextResponse.json({ ok: false }, { status: 401, headers: { "Cache-Control": "no-store" } });
}
