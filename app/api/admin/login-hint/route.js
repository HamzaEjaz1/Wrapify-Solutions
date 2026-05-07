import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** Development-only: explains which password the server expects (never echoes custom secrets). */
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const raw = process.env.ADMIN_BLOG_TOKEN;
  const hasCustomEnv = raw !== undefined && raw !== null && String(raw).trim() !== "";

  if (!hasCustomEnv) {
    return NextResponse.json(
      {
        mode: "default",
        hint: "Try password: wrapify-admin",
        detail:
          "No ADMIN_BLOG_TOKEN in .env.local yet—that uses the built-in dev password. For production, create .env.local in the project root and set ADMIN_BLOG_TOKEN=your-secret, then restart npm run dev."
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  return NextResponse.json(
    {
      mode: "env",
      hint: "Use the exact value after ADMIN_BLOG_TOKEN= in .env.local",
      detail: "No spaces around =. No quotes unless they are part of your password. Restart npm run dev after every change."
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
