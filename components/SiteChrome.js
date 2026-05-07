"use client";

import { usePathname } from "next/navigation";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

export default function SiteChrome({ children }) {
  const pathname = usePathname();
  const hideChrome =
    pathname?.startsWith("/admin") || pathname === "/blogs/login" || pathname === "/blog/login";

  if (hideChrome) {
    return children;
  }

  return (
    <>
      <SiteHeader />
      <div className="site-page-body">{children}</div>
      <SiteFooter />
    </>
  );
}
