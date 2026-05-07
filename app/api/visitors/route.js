import { NextResponse } from "next/server";
import { recordVisit } from "../../../lib/visitorStore";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const body = await req.json();
    const path = String(body?.path || "/");
    if (path.startsWith("/admin") || path.startsWith("/api")) {
      return NextResponse.json({ ok: true, skipped: true }, { headers: { "Cache-Control": "no-store" } });
    }
    await recordVisit(req, {
      path,
      referrer: body?.referrer || "",
      sessionId: body?.sessionId || ""
    });
    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }
}
