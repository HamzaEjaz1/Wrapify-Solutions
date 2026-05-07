"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { easeSmooth } from "../lib/motionVariants";

const navItems = [
  { href: "/#home", label: "Home" },
  { href: "/#about", label: "About Us" },
  { href: "/#leadership", label: "Leadership" },
  { href: "/#services", label: "Services" },
  { href: "/blog", label: "Blog" },
  { href: "/careers", label: "Careers" },
  { href: "/#contact", label: "Contact" }
];

const uniqueNavItems = navItems.filter(
  (item, index, arr) => arr.findIndex((x) => x.href === item.href && x.label === item.label) === index
);

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("wrapify-theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.body.classList.add("dark");
    }
  }, []);

  function toggleTheme() {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    document.body.classList.toggle("dark", nextDark);
    localStorage.setItem("wrapify-theme", nextDark ? "dark" : "light");
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <motion.header
      className="site-header"
      initial={{ y: -28, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: easeSmooth, delay: 0.04 }}
    >
      <div className="container nav-wrap">
        <Link href="/" className="brand" onClick={closeMenu}>
          <span className="brand-mark">
            <Image src="/wrapify-logo.png" alt="Wrapify Solutions logo" width={30} height={30} />
          </span>
          <span>Wrapify Solutions</span>
        </Link>
        <button
          className={`menu-btn ${menuOpen ? "is-open" : ""}`}
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
          <span />
          <span />
        </button>
        <nav className={`main-nav ${menuOpen ? "open" : ""}`} aria-label="Primary">
          {uniqueNavItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={closeMenu}>
              {item.label}
            </Link>
          ))}
          <button
            type="button"
            className="theme-btn theme-icon-btn"
            onClick={toggleTheme}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            title={darkMode ? "Light mode" : "Dark mode"}
          >
            <span aria-hidden="true">{darkMode ? "☀" : "🌙"}</span>
          </button>
          <a
            href="https://calendly.com/hamzaejaz0771/new-meeting"
            className="btn btn-sm nav-cta"
            onClick={closeMenu}
            target="_blank"
            rel="noopener noreferrer"
          >
            Book Call
          </a>
        </nav>
      </div>
    </motion.header>
  );
}
