import { NextResponse } from "next/server";
import { deleteBlog, updateBlog } from "../../../../lib/blogStore";
import { isAdminAuthorized } from "../../../../lib/adminAuth";

export async function PUT(req, { params }) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const updated = await updateBlog(id, body);
  if (!updated) return NextResponse.json({ error: "Blog not found" }, { status: 404 });
  return NextResponse.json({ blog: updated });
}

export async function DELETE(req, { params }) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const ok = await deleteBlog(id);
  if (!ok) return NextResponse.json({ error: "Blog not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
