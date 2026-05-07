import { NextResponse } from "next/server";
import { isAdminAuthorized } from "../../../../lib/adminAuth";
import { deleteJob, getJobById, updateJob } from "../../../../lib/jobsStore";

export const dynamic = "force-dynamic";

export async function GET(_req, { params }) {
  const { id } = await params;
  const job = await getJobById(id);
  if (!job) {
    return NextResponse.json({ error: "Not found" }, { status: 404, headers: { "Cache-Control": "no-store" } });
  }
  return NextResponse.json({ job }, { headers: { "Cache-Control": "no-store" } });
}

export async function PUT(req, { params }) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }
  const { id } = await params;
  try {
    const body = await req.json();
    const job = await updateJob(id, body);
    if (!job) {
      return NextResponse.json({ error: "Not found" }, { status: 404, headers: { "Cache-Control": "no-store" } });
    }
    return NextResponse.json({ job }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Failed to update job" }, { status: 500, headers: { "Cache-Control": "no-store" } });
  }
}

export async function DELETE(req, { params }) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }
  const { id } = await params;
  const ok = await deleteJob(id);
  if (!ok) {
    return NextResponse.json({ error: "Not found" }, { status: 404, headers: { "Cache-Control": "no-store" } });
  }
  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}

