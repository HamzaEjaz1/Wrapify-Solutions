import { NextResponse } from "next/server";
import { isAdminAuthorized } from "../../../../../lib/adminAuth";
import { clearAllVisitors } from "../../../../../lib/visitorStore";

export const dynamic = "force-dynamic";

export async function DELETE(req) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }
  await clearAllVisitors();
  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}

