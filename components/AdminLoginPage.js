"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

const TOKEN_KEY = "wrapify-admin-token";

async function verifyToken(token) {
  const res = await fetch("/api/admin/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
    cache: "no-store"
  });
  return res.ok;
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [devHint, setDevHint] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let cancelled = false;

    async function boot() {
      if (process.env.NODE_ENV === "development") {
        try {
          const h = await fetch("/api/admin/login-hint", { cache: "no-store" });
          if (h.ok) {
            const data = await h.json();
            if (!cancelled) setDevHint(data);
          }
        } catch {
          /* ignore */
        }
      }

      const existing = localStorage.getItem(TOKEN_KEY);
      if (!existing) {
        if (!cancelled) setChecking(false);
        return;
      }

      const ok = await verifyToken(existing);
      if (cancelled) return;
      if (ok) {
        router.replace("/admin");
        return;
      }
      localStorage.removeItem(TOKEN_KEY);
      setChecking(false);
    }

    boot();
    return () => {
      cancelled = true;
    };
  }, [router]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    const trimmed = password.trim();
    if (!trimmed) {
      setError("Please enter your admin password.");
      return;
    }

    setSubmitting(true);
    try {
      const ok = await verifyToken(trimmed);
      if (!ok) {
        setError(
          "That password does not match the server. See the blue hint below (dev) or check .env.local and restart npm run dev."
        );
        return;
      }
      localStorage.setItem(TOKEN_KEY, trimmed);
      router.push("/admin");
    } finally {
      setSubmitting(false);
    }
  }

  function clearSavedSession() {
    localStorage.removeItem(TOKEN_KEY);
    setError("");
    setPassword("");
    setDevHint(null);
    if (process.env.NODE_ENV === "development") {
      fetch("/api/admin/login-hint", { cache: "no-store" })
        .then((r) => r.json())
        .then(setDevHint)
        .catch(() => {});
    }
  }

  if (checking) {
    return (
      <div className="admin-login-page">
        <div className="admin-login-bg" aria-hidden="true" />
        <motion.div
          className="admin-login-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <span className="admin-login-spinner" aria-hidden="true" />
          <p>Checking your session…</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-bg" aria-hidden="true" />
      <motion.div
        className="admin-login-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="admin-login-brand">
          <span className="admin-login-logo">W</span>
          <div>
            <p className="admin-login-brand-name">Wrapify Solutions</p>
            <p className="admin-login-brand-sub">Secure admin</p>
          </div>
        </div>

        <h1 className="admin-login-title">Sign in</h1>
        <p className="admin-login-lead">
          Manage blog posts, testimonials, services, and portfolio content. This page is not indexed by search engines.
        </p>

        {devHint ? (
          <motion.div
            className={`admin-login-dev-hint admin-login-dev-hint--${devHint.mode}`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ delay: 0.15, duration: 0.35 }}
          >
            <strong>{devHint.hint}</strong>
            <p>{devHint.detail}</p>
          </motion.div>
        ) : null}

        <form onSubmit={onSubmit} className="admin-login-form">
          <label className="admin-field">
            <span>Password</span>
            <div className="admin-login-password-row">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="admin-input"
                disabled={submitting}
              />
              <button
                type="button"
                className="admin-login-toggle-visibility"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={0}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          <AnimatePresence mode="wait">
            {error ? (
              <motion.p
                key={error}
                className="admin-login-error"
                role="alert"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: [0, -6, 6, -4, 4, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45 }}
              >
                {error}
              </motion.p>
            ) : null}
          </AnimatePresence>

          <motion.button
            type="submit"
            className="btn admin-login-submit"
            disabled={submitting}
            whileHover={submitting ? undefined : { scale: 1.02 }}
            whileTap={submitting ? undefined : { scale: 0.98 }}
          >
            {submitting ? (
              <span className="admin-login-btn-inner">
                <span className="admin-login-spinner admin-login-spinner--btn" aria-hidden="true" />
                Signing in…
              </span>
            ) : (
              "Continue to dashboard"
            )}
          </motion.button>
        </form>

        <button type="button" className="admin-login-text-btn" onClick={() => setHelpOpen((v) => !v)}>
          {helpOpen ? "▼ Hide setup help" : "▶ Where is my password?"}
        </button>
        <AnimatePresence>
          {helpOpen ? (
            <motion.div
              className="admin-login-help"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ol className="admin-login-help-list">
                <li>
                  In the project folder (same place as <code>package.json</code>), create or open{" "}
                  <code>.env.local</code>.
                </li>
                <li>
                  Add a line: <code>ADMIN_BLOG_TOKEN=your-secret-here</code> (no quotes).
                </li>
                <li>
                  Stop the dev server and run <code>npm run dev</code> again.
                </li>
                <li>Type that same secret on this form.</li>
              </ol>
              <p className="admin-login-help-note">
                If you have not created <code>.env.local</code> yet, the dev server uses the default password{" "}
                <code>wrapify-admin</code>.
              </p>
              <button type="button" className="admin-login-text-btn" onClick={clearSavedSession}>
                Clear saved login on this browser
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <p className="admin-login-foot">
          <Link href="/" className="admin-login-back">
            ← Back to website
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
