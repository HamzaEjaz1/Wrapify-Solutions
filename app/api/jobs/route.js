import { NextResponse } from "next/server";
import { isAdminAuthorized } from "../../../lib/adminAuth";
import { createJob, getAllJobs } from "../../../lib/jobsStore";

export const dynamic = "force-dynamic";

export async function GET() {
  const jobs = await getAllJobs();
  return NextResponse.json({ jobs }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }
  try {
    const body = await req.json();
    const job = await createJob(body);
    return NextResponse.json({ job }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Failed to create job" }, { status: 500, headers: { "Cache-Control": "no-store" } });
  }
}

