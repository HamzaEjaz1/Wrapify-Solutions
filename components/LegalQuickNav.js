import Link from "next/link";

const items = [
  { href: "/privacy", label: "Privacy Policy", id: "privacy" },
  { href: "/terms", label: "Terms & Conditions", id: "terms" },
  { href: "/cookies", label: "Cookie Policy", id: "cookies" }
];

export default function LegalQuickNav({ current }) {
  return (
    <nav className="legal-quick-nav" aria-label="Legal documents">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={current === item.id ? "is-current" : undefined}
          aria-current={current === item.id ? "page" : undefined}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
