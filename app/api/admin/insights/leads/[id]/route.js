import { NextResponse } from "next/server";
import { isAdminAuthorized } from "../../../../../../lib/adminAuth";
import { deleteLeadById } from "../../../../../../lib/visitorStore";

export const dynamic = "force-dynamic";

export async function DELETE(req, { params }) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }
  const { id } = await params;
  const ok = await deleteLeadById(id);
  if (!ok) {
    return NextResponse.json({ error: "Not found" }, { status: 404, headers: { "Cache-Control": "no-store" } });
  }
  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}

