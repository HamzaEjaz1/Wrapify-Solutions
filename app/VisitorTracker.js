"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const KEY = "wrapify-visitor-session-id";

function getSessionId() {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem(KEY);
  if (!id) {
    id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`;
    sessionStorage.setItem(KEY, id);
  }
  return id;
}

export default function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin") || pathname.startsWith("/blog/login") || pathname.startsWith("/blogs/login")) {
      return;
    }
    const sessionId = getSessionId();
    fetch("/api/visitors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: pathname,
        referrer: document.referrer || "",
        sessionId
      }),
      keepalive: true
    }).catch(() => {});
  }, [pathname]);

  return null;
}
