import { NextResponse } from "next/server";
import { createBlog, getAllBlogs } from "../../../lib/blogStore";
import { isAdminAuthorized } from "../../../lib/adminAuth";

export async function GET() {
  const blogs = await getAllBlogs();
  return NextResponse.json({ blogs });
}

export async function POST(req) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  if (!body?.title || !body?.excerpt || !body?.content) {
    return NextResponse.json({ error: "title, excerpt, and content are required" }, { status: 400 });
  }

  const blog = await createBlog(body);
  return NextResponse.json({ blog }, { status: 201 });
}
