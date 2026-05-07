import { NextResponse } from "next/server";
import { isAdminAuthorized } from "../../../../lib/adminAuth";
import { getInsightsSummary } from "../../../../lib/visitorStore";

export const dynamic = "force-dynamic";

export async function GET(req) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }
  const insights = await getInsightsSummary();
  return NextResponse.json(insights, { headers: { "Cache-Control": "no-store" } });
}
