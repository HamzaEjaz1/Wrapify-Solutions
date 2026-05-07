import { NextResponse } from "next/server";
import { addBlogComment, getBlogById } from "../../../../../lib/blogStore";

export async function GET(_req, { params }) {
  const { id } = await params;
  const blog = await getBlogById(id);
  if (!blog) return NextResponse.json({ error: "Blog not found" }, { status: 404 });
  return NextResponse.json({ comments: Array.isArray(blog.comments) ? blog.comments : [] });
}

export async function POST(req, { params }) {
  const body = await req.json();
  if (!body?.text) {
    return NextResponse.json({ error: "Comment text is required" }, { status: 400 });
  }

  const { id } = await params;
  const comment = await addBlogComment(id, body);
  if (!comment) {
    return NextResponse.json({ error: "Blog not found or invalid comment" }, { status: 404 });
  }

  return NextResponse.json({ comment }, { status: 201 });
}
