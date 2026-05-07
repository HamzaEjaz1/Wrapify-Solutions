"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

const TOKEN_KEY = "wrapify-admin-token";

const TABS = [
  { id: "overview", label: "Overview", icon: "⌁", hint: "Hub & status" },
  { id: "testimonials", label: "Testimonials", icon: "★", hint: "Client quotes" },
  { id: "partners", label: "Partners", icon: "◎", hint: "Logo strip" },
  { id: "services", label: "Services", icon: "⬡", hint: "Core offers" },
  { id: "useCases", label: "Use cases", icon: "▣", hint: "Portfolio tabs" },
  { id: "careers", label: "Careers", icon: "⟡", hint: "Jobs & hiring" },
  { id: "insights", label: "Insights", icon: "◉", hint: "Leads & traffic" }
];

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function formatStamp(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value || "-";
  return d.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

export default function AdminDashboardClient() {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [content, setContent] = useState(null);
  const [tab, setTab] = useState("overview");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [saving, setSaving] = useState(false);
  const [insights, setInsights] = useState(null);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobForm, setJobForm] = useState({ title: "", description: "", lastDate: "", formUrl: "" });
  const [editingJobId, setEditingJobId] = useState(null);

  useEffect(() => {
    const t = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
    if (!t) {
      router.replace("/blog/login");
      return;
    }
    setToken(t);
  }, [router]);

  const load = useCallback(async () => {
    const res = await fetch("/api/site-content");
    if (!res.ok) return;
    const data = await res.json();
    setContent(data);
  }, []);

  useEffect(() => {
    if (!token) return;
    load();
  }, [token, load]);

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    router.push("/blog/login");
  }

  async function save() {
    if (!content || !token) return;
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const res = await fetch("/api/site-content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token
        },
        body: JSON.stringify(content)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setMessage({ type: "ok", text: "All changes saved to the live site data file." });
    } catch (e) {
      setMessage({ type: "err", text: e.message || "Save failed" });
    } finally {
      setSaving(false);
    }
  }

  async function resetDefaults() {
    if (!token) return;
    const ok = window.confirm("Replace all homepage marketing content with factory defaults? This cannot be undone.");
    if (!ok) return;
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const res = await fetch("/api/site-content", {
        method: "POST",
        headers: { "x-admin-token": token }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Reset failed");
      setContent(data.content);
      setMessage({ type: "ok", text: "Content reset to defaults." });
    } catch (e) {
      setMessage({ type: "err", text: e.message || "Reset failed" });
    } finally {
      setSaving(false);
    }
  }

  async function loadInsights() {
    if (!token) return;
    setInsightsLoading(true);
    try {
      const res = await fetch("/api/admin/insights", {
        headers: { "x-admin-token": token }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not load insights");
      setInsights(data);
    } catch (e) {
      setMessage({ type: "err", text: e.message || "Failed to load insights" });
    } finally {
      setInsightsLoading(false);
    }
  }

  async function loadJobs() {
    setJobsLoading(true);
    try {
      const res = await fetch("/api/jobs", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not load jobs");
      setJobs(data.jobs || []);
    } catch (e) {
      setMessage({ type: "err", text: e.message || "Failed to load jobs" });
    } finally {
      setJobsLoading(false);
    }
  }

  useEffect(() => {
    if (tab === "careers" && !jobsLoading && jobs.length === 0) {
      loadJobs();
    }
  }, [tab, jobsLoading, jobs.length]);

  async function saveJob() {
    if (!token) return;
    setSaving(true);
    setMessage({ type: "", text: "" });
    const url = editingJobId ? `/api/jobs/${editingJobId}` : "/api/jobs";
    const method = editingJobId ? "PUT" : "POST";
    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token
        },
        body: JSON.stringify(jobForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save job");
      setMessage({ type: "ok", text: editingJobId ? "Job updated." : "Job created." });
      setEditingJobId(null);
      setJobForm({ title: "", description: "", lastDate: "", formUrl: "" });
      await loadJobs();
    } catch (e) {
      setMessage({ type: "err", text: e.message || "Failed to save job" });
    } finally {
      setSaving(false);
    }
  }

  async function deleteJob(id) {
    if (!token) return;
    const ok = window.confirm("Delete this job posting? This cannot be undone.");
    if (!ok) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/jobs/${id}`, {
        method: "DELETE",
        headers: { "x-admin-token": token }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      setMessage({ type: "ok", text: "Job deleted." });
      if (editingJobId === id) {
        setEditingJobId(null);
        setJobForm({ title: "", description: "", lastDate: "", formUrl: "" });
      }
      await loadJobs();
    } catch (e) {
      setMessage({ type: "err", text: e.message || "Delete failed" });
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    if (tab === "insights" && token && !insights && !insightsLoading) {
      loadInsights();
    }
  }, [tab, token, insights, insightsLoading]);

  if (!token || !content) {
    return (
      <div className="admin-app admin-app--loading">
        <div className="admin-loading-screen">
          <motion.div
            className="admin-loading-orbit"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="admin-loading-core"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="admin-sidebar-logo admin-sidebar-logo--lg">W</span>
          </motion.div>
          <motion.p
            className="admin-loading-text"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Syncing content studio…
          </motion.p>
        </div>
      </div>
    );
  }

  const activeTab = TABS.find((x) => x.id === tab);
  const editMode = tab !== "insights" && tab !== "careers";

  return (
    <div className="admin-app">
      <div className="admin-app-grid" aria-hidden="true" />
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <motion.span
            className="admin-sidebar-logo"
            whileHover={{ scale: 1.06, rotate: 4 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
          >
            W
          </motion.span>
          <div>
            <strong className="admin-sidebar-title">Wrapify</strong>
            <span className="admin-sidebar-sub">Content studio</span>
          </div>
        </div>
        <nav className="admin-side-nav" aria-label="Admin sections">
          {TABS.map((t) => (
            <motion.button
              key={t.id}
              type="button"
              className={`admin-nav-btn ${t.id === tab ? "is-active" : ""}`}
              onClick={() => setTab(t.id)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              layout
            >
              <span className="admin-nav-btn__icon" aria-hidden="true">
                {t.icon}
              </span>
              <span className="admin-nav-btn__text">
                <span className="admin-nav-btn__label">{t.label}</span>
                <span className="admin-nav-btn__hint">{t.hint}</span>
              </span>
              {t.id === tab ? <motion.span className="admin-nav-glow" layoutId="admin-nav-glow" /> : null}
            </motion.button>
          ))}
        </nav>
        <div className="admin-sidebar-foot">
          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
            <Link href="/admin/blogs" className="admin-side-link admin-side-link--cta">
              <span className="admin-side-link__icon">➜</span>
              Blog workspace
            </Link>
          </motion.div>
          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
            <Link href="/admin/careers" className="admin-side-link">
              <span className="admin-side-link__icon">➜</span>
              Careers workspace
            </Link>
          </motion.div>
          <button type="button" className="admin-logout" onClick={logout}>
            Sign out
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-intro">
            <div className="admin-breadcrumb">
              <span className="admin-breadcrumb__dot" />
              <span>Studio</span>
              <span className="admin-breadcrumb__sep">/</span>
              <span>{activeTab?.label}</span>
            </div>
            <h1 className="admin-page-title">{activeTab?.label}</h1>
            {editMode ? (
              <p className="admin-page-sub">
                Changes stay local until you <strong>Save changes</strong>. The homepage reads{" "}
                <code className="admin-code">data/site-content.json</code>.
              </p>
            ) : (
              <p className="admin-page-sub">
                Automatic lead capture and visitor analytics. Track performance, last month traffic, and recent contacts.
              </p>
            )}
            <div className="admin-topbar-chips">
              <span className="admin-chip">{editMode ? "Live JSON" : "Live Insights"}</span>
              <span className="admin-chip admin-chip--muted">{editMode ? "Marketing site" : "Admin only"}</span>
            </div>
          </div>
          <div className="admin-topbar-actions">
            {editMode ? (
              <>
                <motion.button
                  type="button"
                  className="admin-btn admin-btn--ghost"
                  onClick={resetDefaults}
                  disabled={saving}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Reset defaults
                </motion.button>
                <motion.button
                  type="button"
                  className="admin-btn admin-btn--primary"
                  onClick={save}
                  disabled={saving}
                  whileHover={{ scale: saving ? 1 : 1.03 }}
                  whileTap={{ scale: saving ? 1 : 0.97 }}
                >
                  {saving ? (
                    <span className="admin-btn__inner">
                      <span className="admin-mini-spinner" />
                      Saving…
                    </span>
                  ) : (
                    "Save changes"
                  )}
                </motion.button>
              </>
            ) : (
              <motion.button
                type="button"
                className="admin-btn admin-btn--primary"
                onClick={loadInsights}
                disabled={insightsLoading}
                whileHover={{ scale: insightsLoading ? 1 : 1.03 }}
                whileTap={{ scale: insightsLoading ? 1 : 0.97 }}
              >
                {insightsLoading ? (
                  <span className="admin-btn__inner">
                    <span className="admin-mini-spinner" />
                    Refreshing…
                  </span>
                ) : (
                  "Refresh insights"
                )}
              </motion.button>
            )}
          </div>
        </header>

        <AnimatePresence mode="wait">
          {message.text ? (
            <motion.div
              key={message.text}
              className={message.type === "ok" ? "admin-banner admin-banner--ok" : "admin-banner admin-banner--err"}
              role="status"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
            >
              {message.text}
            </motion.div>
          ) : null}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {tab === "overview" ? (
            <motion.div
              key="overview"
              className="admin-panels admin-panels--bento"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.section
                className="admin-panel admin-panel--hero"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
              >
                <div className="admin-panel__icon">⌁</div>
                <h2>Homepage content</h2>
                <p className="admin-panel__lead">
                  Testimonials, partners, service cards, and portfolio use cases—all in one JSON file on the server.
                </p>
                <ul className="admin-checklist">
                  <li>
                    Partner logos live in <code>/public</code> — paths like <code>/partner-name.png</code>
                  </li>
                  <li>
                    Keep stable <code>id</code> on services so anchors like <code>#service-web</code> never break
                  </li>
                  <li>Use cases power the tabbed portfolio on the public site</li>
                </ul>
                <div className="admin-panel__actions">
                  <button type="button" className="admin-linkish" onClick={() => setTab("testimonials")}>
                    Edit testimonials →
                  </button>
                  <button type="button" className="admin-linkish" onClick={() => setTab("services")}>
                    Edit services →
                  </button>
                </div>
              </motion.section>
              <motion.section
                className="admin-panel admin-panel--accent"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
              >
                <div className="admin-panel__icon">✦</div>
                <h2>Blog publishing</h2>
                <p className="admin-panel__lead">Articles, slugs, SEO fields, and images—separate from marketing JSON.</p>
                <Link href="/admin/blogs" className="admin-btn admin-btn--primary admin-btn--block">
                  Open blog workspace
                </Link>
              </motion.section>
              <motion.section
                className="admin-panel admin-panel--compact"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
              >
                <div className="admin-panel__icon">◇</div>
                <h2>Security</h2>
                <p className="admin-panel__lead">
                  Session via <Link href="/blog/login">/blog/login</Link>. Secret:{" "}
                  <code className="admin-code">ADMIN_BLOG_TOKEN</code> in <code className="admin-code">.env.local</code>.
                </p>
              </motion.section>

              <motion.section
                className="admin-panel admin-panel--compact"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
              >
                <div className="admin-panel__icon">⟡</div>
                <h2>Careers</h2>
                <p className="admin-panel__lead">
                  Manage job postings for the public <Link href="/careers">/careers</Link> page. Applicants can apply
                  via email and an optional Google Form link.
                </p>
                <div className="admin-panel__actions">
                  <button type="button" className="admin-linkish" onClick={() => setTab("careers")}>
                    Manage jobs →
                  </button>
                  <Link href="/admin/careers" className="admin-linkish">
                    Open careers workspace →
                  </Link>
                </div>
              </motion.section>
            </motion.div>
          ) : null}

          {tab === "testimonials" ? (
            <motion.div
              key="testimonials"
              className="admin-stack"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
            <div className="admin-toolbar">
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() =>
                  setContent((c) => ({
                    ...c,
                    testimonials: [
                      ...c.testimonials,
                      { name: "New client", role: "Role", quote: "Quote text.", avatar: "https://i.pravatar.cc/160?img=1" }
                    ]
                  }))
                }
              >
                Add testimonial
              </button>
            </div>
            {content.testimonials.map((row, idx) => (
              <article key={idx} className="card admin-editor-card">
                <div className="admin-editor-head">
                  <h3>Testimonial {idx + 1}</h3>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() =>
                      setContent((c) => ({
                        ...c,
                        testimonials: c.testimonials.filter((_, i) => i !== idx)
                      }))
                    }
                  >
                    Remove
                  </button>
                </div>
                <div className="admin-field-grid">
                  <label className="admin-field">
                    <span>Name</span>
                    <input
                      className="admin-input"
                      value={row.name}
                      onChange={(e) => {
                        const v = e.target.value;
                        setContent((c) => {
                          const next = deepClone(c);
                          next.testimonials[idx].name = v;
                          return next;
                        });
                      }}
                    />
                  </label>
                  <label className="admin-field">
                    <span>Role</span>
                    <input
                      className="admin-input"
                      value={row.role}
                      onChange={(e) => {
                        const v = e.target.value;
                        setContent((c) => {
                          const next = deepClone(c);
                          next.testimonials[idx].role = v;
                          return next;
                        });
                      }}
                    />
                  </label>
                  <label className="admin-field admin-field--full">
                    <span>Avatar URL</span>
                    <input
                      className="admin-input"
                      value={row.avatar}
                      onChange={(e) => {
                        const v = e.target.value;
                        setContent((c) => {
                          const next = deepClone(c);
                          next.testimonials[idx].avatar = v;
                          return next;
                        });
                      }}
                    />
                  </label>
                  <label className="admin-field admin-field--full">
                    <span>Quote</span>
                    <textarea
                      className="admin-textarea"
                      rows={4}
                      value={row.quote}
                      onChange={(e) => {
                        const v = e.target.value;
                        setContent((c) => {
                          const next = deepClone(c);
                          next.testimonials[idx].quote = v;
                          return next;
                        });
                      }}
                    />
                  </label>
                </div>
              </article>
            ))}
            </motion.div>
          ) : null}

          {tab === "partners" ? (
            <motion.div
              key="partners"
              className="admin-stack"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
            <div className="admin-toolbar">
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() =>
                  setContent((c) => ({
                    ...c,
                    partners: [...c.partners, { name: "Partner name", logo: "/partner-placeholder.png" }]
                  }))
                }
              >
                Add partner
              </button>
            </div>
            {content.partners.map((row, idx) => (
              <article key={idx} className="card admin-editor-card">
                <div className="admin-editor-head">
                  <h3>Partner {idx + 1}</h3>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() =>
                      setContent((c) => ({
                        ...c,
                        partners: c.partners.filter((_, i) => i !== idx)
                      }))
                    }
                  >
                    Remove
                  </button>
                </div>
                <div className="admin-field-grid">
                  <label className="admin-field admin-field--full">
                    <span>Company name</span>
                    <input
                      className="admin-input"
                      value={row.name}
                      onChange={(e) => {
                        const v = e.target.value;
                        setContent((c) => {
                          const next = deepClone(c);
                          next.partners[idx].name = v;
                          return next;
                        });
                      }}
                    />
                  </label>
                  <label className="admin-field admin-field--full">
                    <span>Logo path</span>
                    <input
                      className="admin-input"
                      value={row.logo}
                      onChange={(e) => {
                        const v = e.target.value;
                        setContent((c) => {
                          const next = deepClone(c);
                          next.partners[idx].logo = v;
                          return next;
                        });
                      }}
                    />
                  </label>
                </div>
              </article>
            ))}
            </motion.div>
          ) : null}

          {tab === "services" ? (
            <motion.div
              key="services"
              className="admin-stack"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
            <p className="section-intro admin-hint">
              Bullet lines appear as list items. The <code>id</code> becomes the anchor (e.g. <code>#service-web</code>).
            </p>
            <div className="admin-toolbar">
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() =>
                  setContent((c) => ({
                    ...c,
                    services: [
                      ...c.services,
                      {
                        id: `service-${Date.now()}`,
                        title: "New service",
                        description: "Short description for this service.",
                        bullets: ["First benefit or detail"],
                        note: "Optional closing line."
                      }
                    ]
                  }))
                }
              >
                Add service
              </button>
            </div>
            {content.services.map((row, idx) => (
              <article key={`${row.id}-${idx}`} className="card admin-editor-card">
                <div className="admin-editor-head">
                  <h3>{row.title}</h3>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() =>
                      setContent((c) => ({
                        ...c,
                        services: c.services.filter((_, i) => i !== idx)
                      }))
                    }
                  >
                    Remove
                  </button>
                </div>
                <div className="admin-field-grid">
                  <label className="admin-field">
                    <span>Anchor id</span>
                    <input
                      className="admin-input"
                      value={row.id}
                      onChange={(e) => {
                        const v = e.target.value;
                        setContent((c) => {
                          const next = deepClone(c);
                          next.services[idx].id = v;
                          return next;
                        });
                      }}
                    />
                  </label>
                  <label className="admin-field">
                    <span>Title</span>
                    <input
                      className="admin-input"
                      value={row.title}
                      onChange={(e) => {
                        const v = e.target.value;
                        setContent((c) => {
                          const next = deepClone(c);
                          next.services[idx].title = v;
                          return next;
                        });
                      }}
                    />
                  </label>
                  <label className="admin-field admin-field--full">
                    <span>Lead paragraph</span>
                    <textarea
                      className="admin-textarea"
                      rows={2}
                      value={row.description}
                      onChange={(e) => {
                        const v = e.target.value;
                        setContent((c) => {
                          const next = deepClone(c);
                          next.services[idx].description = v;
                          return next;
                        });
                      }}
                    />
                  </label>
                  <label className="admin-field admin-field--full">
                    <span>Bullets (one per line)</span>
                    <textarea
                      className="admin-textarea"
                      rows={4}
                      value={(row.bullets || []).join("\n")}
                      onChange={(e) => {
                        const lines = e.target.value.split("\n").map((l) => l.trim()).filter(Boolean);
                        setContent((c) => {
                          const next = deepClone(c);
                          next.services[idx].bullets = lines;
                          return next;
                        });
                      }}
                    />
                  </label>
                  <label className="admin-field admin-field--full">
                    <span>Closing note</span>
                    <input
                      className="admin-input"
                      value={row.note || ""}
                      onChange={(e) => {
                        const v = e.target.value;
                        setContent((c) => {
                          const next = deepClone(c);
                          next.services[idx].note = v;
                          return next;
                        });
                      }}
                    />
                  </label>
                </div>
              </article>
            ))}
            </motion.div>
          ) : null}

          {tab === "useCases" ? (
            <motion.div
              key="useCases"
              className="admin-stack"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
            {content.portfolioCategories.map((cat, cIdx) => (
              <section key={cat.id} className="card admin-editor-card admin-nested">
                <div className="admin-field-grid">
                  <label className="admin-field">
                    <span>Category id</span>
                    <input
                      className="admin-input"
                      value={cat.id}
                      onChange={(e) => {
                        const v = e.target.value;
                        setContent((c) => {
                          const next = deepClone(c);
                          next.portfolioCategories[cIdx].id = v;
                          return next;
                        });
                      }}
                    />
                  </label>
                  <label className="admin-field">
                    <span>Tab label</span>
                    <input
                      className="admin-input"
                      value={cat.label}
                      onChange={(e) => {
                        const v = e.target.value;
                        setContent((c) => {
                          const next = deepClone(c);
                          next.portfolioCategories[cIdx].label = v;
                          return next;
                        });
                      }}
                    />
                  </label>
                  <label className="admin-field admin-field--full">
                    <span>Section title</span>
                    <input
                      className="admin-input"
                      value={cat.title}
                      onChange={(e) => {
                        const v = e.target.value;
                        setContent((c) => {
                          const next = deepClone(c);
                          next.portfolioCategories[cIdx].title = v;
                          return next;
                        });
                      }}
                    />
                  </label>
                </div>
                <h4 className="admin-nested-title">Projects in this category</h4>
                <div className="admin-nested-list">
                  {cat.items.map((item, iIdx) => (
                    <div key={iIdx} className="admin-nested-item">
                      <div className="admin-editor-head">
                        <span className="admin-muted">Item {iIdx + 1}</span>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() =>
                            setContent((c) => {
                              const next = deepClone(c);
                              next.portfolioCategories[cIdx].items = next.portfolioCategories[cIdx].items.filter(
                                (_, j) => j !== iIdx
                              );
                              return next;
                            })
                          }
                        >
                          Remove
                        </button>
                      </div>
                      <div className="admin-field-grid">
                        <label className="admin-field">
                          <span>Tag</span>
                          <input
                            className="admin-input"
                            value={item.tag}
                            onChange={(e) => {
                              const v = e.target.value;
                              setContent((c) => {
                                const next = deepClone(c);
                                next.portfolioCategories[cIdx].items[iIdx].tag = v;
                                return next;
                              });
                            }}
                          />
                        </label>
                        <label className="admin-field admin-field--full">
                          <span>Title</span>
                          <input
                            className="admin-input"
                            value={item.title}
                            onChange={(e) => {
                              const v = e.target.value;
                              setContent((c) => {
                                const next = deepClone(c);
                                next.portfolioCategories[cIdx].items[iIdx].title = v;
                                return next;
                              });
                            }}
                          />
                        </label>
                        <label className="admin-field admin-field--full">
                          <span>Description</span>
                          <textarea
                            className="admin-textarea"
                            rows={2}
                            value={item.description}
                            onChange={(e) => {
                              const v = e.target.value;
                              setContent((c) => {
                                const next = deepClone(c);
                                next.portfolioCategories[cIdx].items[iIdx].description = v;
                                return next;
                              });
                            }}
                          />
                        </label>
                        <label className="admin-field">
                          <span>Note (optional)</span>
                          <input
                            className="admin-input"
                            value={item.note || ""}
                            onChange={(e) => {
                              const v = e.target.value;
                              setContent((c) => {
                                const next = deepClone(c);
                                next.portfolioCategories[cIdx].items[iIdx].note = v || undefined;
                                return next;
                              });
                            }}
                          />
                        </label>
                        <label className="admin-field">
                          <span>Link (optional)</span>
                          <input
                            className="admin-input"
                            value={item.link || ""}
                            onChange={(e) => {
                              const v = e.target.value;
                              setContent((c) => {
                                const next = deepClone(c);
                                next.portfolioCategories[cIdx].items[iIdx].link = v || undefined;
                                return next;
                              });
                            }}
                          />
                        </label>
                        <label className="admin-field">
                          <span>Link label</span>
                          <input
                            className="admin-input"
                            value={item.linkLabel || ""}
                            onChange={(e) => {
                              const v = e.target.value;
                              setContent((c) => {
                                const next = deepClone(c);
                                next.portfolioCategories[cIdx].items[iIdx].linkLabel = v || undefined;
                                return next;
                              });
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() =>
                    setContent((c) => {
                      const next = deepClone(c);
                      next.portfolioCategories[cIdx].items.push({
                        tag: "Tag",
                        title: "New project",
                        description: "Description"
                      });
                      return next;
                    })
                  }
                >
                  Add project to {cat.label}
                </button>
              </section>
            ))}
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() =>
                setContent((c) => {
                  const next = deepClone(c);
                  next.portfolioCategories.push({
                    id: `cat-${Date.now()}`,
                    label: "New category",
                    title: "New use case group",
                    items: []
                  });
                  return next;
                })
              }
            >
              Add category
            </button>
            </motion.div>
          ) : null}

          {tab === "careers" ? (
            <motion.div
              key="careers"
              className="admin-stack"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <section className="card admin-editor-card">
                <div className="admin-editor-head">
                  <h3>{editingJobId ? "Edit job posting" : "Create a new job posting"}</h3>
                  <div className="admin-toolbar">
                    <button type="button" className="btn btn-outline btn-sm" onClick={loadJobs} disabled={jobsLoading}>
                      {jobsLoading ? "Refreshing…" : "Refresh"}
                    </button>
                    <Link href="/admin/careers" className="btn btn-outline btn-sm">
                      Open workspace
                    </Link>
                  </div>
                </div>
                <div className="admin-field-grid">
                  <label className="admin-field admin-field--full">
                    <span>Job title</span>
                    <input
                      className="admin-input"
                      value={jobForm.title}
                      onChange={(e) => setJobForm((p) => ({ ...p, title: e.target.value }))}
                      placeholder="e.g. Senior Full-Stack Engineer (React + Node)"
                    />
                  </label>
                  <label className="admin-field admin-field--full">
                    <span>Description</span>
                    <textarea
                      className="admin-textarea"
                      rows={5}
                      value={jobForm.description}
                      onChange={(e) => setJobForm((p) => ({ ...p, description: e.target.value }))}
                      placeholder="Role description, responsibilities, requirements…"
                    />
                  </label>
                  <label className="admin-field">
                    <span>Last date (YYYY-MM-DD)</span>
                    <input
                      className="admin-input"
                      value={jobForm.lastDate}
                      onChange={(e) => setJobForm((p) => ({ ...p, lastDate: e.target.value }))}
                      placeholder="2026-06-30"
                    />
                  </label>
                  <label className="admin-field">
                    <span>Google Form link (optional)</span>
                    <input
                      className="admin-input"
                      value={jobForm.formUrl}
                      onChange={(e) => setJobForm((p) => ({ ...p, formUrl: e.target.value }))}
                      placeholder="https://forms.gle/…"
                    />
                  </label>
                </div>
                <div className="admin-toolbar" style={{ marginTop: "12px" }}>
                  <button type="button" className="btn btn-outline btn-sm" onClick={saveJob} disabled={saving}>
                    {saving ? "Saving…" : editingJobId ? "Update job" : "Create job"}
                  </button>
                  {editingJobId ? (
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => {
                        setEditingJobId(null);
                        setJobForm({ title: "", description: "", lastDate: "", formUrl: "" });
                      }}
                    >
                      Cancel edit
                    </button>
                  ) : null}
                  <Link href="/careers" className="btn btn-outline btn-sm">
                    View public careers →
                  </Link>
                </div>
                <p className="admin-hint" style={{ marginTop: "10px" }}>
                  Applicants are instructed to email their resume to <code className="admin-code">wrapifysolutions@gmail.com</code>.
                </p>
              </section>

              <section className="card admin-editor-card">
                <h3 className="admin-insight-heading">Current job posts</h3>
                {jobsLoading ? (
                  <p className="admin-hint">Loading jobs…</p>
                ) : jobs.length === 0 ? (
                  <p className="admin-hint">No jobs yet. Create one above.</p>
                ) : (
                  <div className="admin-careers-list">
                    {jobs.map((j) => (
                      <div key={j.id} className="admin-careers-item">
                        <div>
                          <strong>{j.title}</strong>
                          <div className="admin-muted" style={{ marginTop: "4px" }}>
                            Last date: {j.lastDate || "Open until filled"} {j.formUrl ? "· Form attached" : ""}
                          </div>
                        </div>
                        <div className="admin-toolbar">
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            onClick={() => {
                              setEditingJobId(j.id);
                              setJobForm({
                                title: j.title || "",
                                description: j.description || "",
                                lastDate: j.lastDate || "",
                                formUrl: j.formUrl || ""
                              });
                            }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            onClick={() => deleteJob(j.id)}
                            disabled={saving}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </motion.div>
          ) : null}

          {tab === "insights" ? (
            <motion.div
              key="insights"
              className="admin-stack"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {insights ? (
                <>
                  <section className="admin-insight-grid">
                    <article className="card admin-editor-card admin-insight-card">
                      <p className="admin-insight-label">Visitors (all time)</p>
                      <h3>{insights.totals?.visitors ?? 0}</h3>
                    </article>
                    <article className="card admin-editor-card admin-insight-card">
                      <p className="admin-insight-label">Visitors last month</p>
                      <h3>{insights.lastMonth?.visitors ?? 0}</h3>
                    </article>
                    <article className="card admin-editor-card admin-insight-card">
                      <p className="admin-insight-label">Visitors this month</p>
                      <h3>{insights.thisMonth?.visitors ?? 0}</h3>
                    </article>
                    <article className="card admin-editor-card admin-insight-card">
                      <p className="admin-insight-label">Leads captured</p>
                      <h3>{insights.totals?.leads ?? 0}</h3>
                    </article>
                  </section>

                  <section className="card admin-editor-card">
                    <h3 className="admin-insight-heading">Monthly visitors trend</h3>
                    <div className="admin-trend-list">
                      {(insights.monthlyVisitors || []).map((point) => (
                        <div key={point.label} className="admin-trend-row">
                          <span>{point.label}</span>
                          <div className="admin-trend-bar-wrap">
                            <div
                              className="admin-trend-bar"
                              style={{
                                width: `${Math.max(4, Math.min(100, point.visitors * 8))}%`
                              }}
                            />
                          </div>
                          <strong>{point.visitors}</strong>
                        </div>
                      ))}
                    </div>
                  </section>

                  <div className="admin-insight-table-grid">
                    <section className="card admin-editor-card">
                      <div className="admin-insight-heading-row">
                        <h3 className="admin-insight-heading">Recent leads</h3>
                        <div className="admin-insight-heading-actions">
                          <button
                            type="button"
                            className="admin-insight-link-btn"
                            onClick={async () => {
                              if (!token) return;
                              const ok = window.confirm("Delete all saved leads? This cannot be undone.");
                              if (!ok) return;
                              try {
                                const res = await fetch("/api/admin/insights/leads", {
                                  method: "DELETE",
                                  headers: { "x-admin-token": token }
                                });
                                const data = await res.json();
                                if (!res.ok) {
                                  setMessage({ type: "err", text: data.error || "Failed to clear leads" });
                                  return;
                                }
                                setInsights((prev) =>
                                  prev
                                    ? {
                                        ...prev,
                                        totals: { ...prev.totals, leads: 0 },
                                        thisMonth: { ...prev.thisMonth, leads: 0 },
                                        lastMonth: { ...prev.lastMonth, leads: 0 },
                                        recentLeads: []
                                      }
                                    : prev
                                );
                                setMessage({ type: "ok", text: "All leads cleared." });
                              } catch {
                                setMessage({ type: "err", text: "Failed to clear leads" });
                              }
                            }}
                          >
                            Clear all
                          </button>
                        </div>
                      </div>
                      <div className="admin-insight-table-wrap">
                        <table className="admin-insight-table">
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Email</th>
                              <th>Source</th>
                              <th>Captured</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(insights.recentLeads || []).map((row) => (
                              <tr key={row.id}>
                                <td>{row.name}</td>
                                <td>{row.email}</td>
                                <td>{row.source || "contact-form"}</td>
                                <td>
                                  <div className="admin-insight-cell-row">
                                    <span>{formatStamp(row.at)}</span>
                                    <button
                                      type="button"
                                      className="admin-insight-link-btn"
                                      onClick={async () => {
                                        if (!token) return;
                                        const ok = window.confirm("Delete this lead record?");
                                        if (!ok) return;
                                        try {
                                          const res = await fetch(`/api/admin/insights/leads/${row.id}`, {
                                            method: "DELETE",
                                            headers: { "x-admin-token": token }
                                          });
                                          const data = await res.json();
                                          if (!res.ok) {
                                            setMessage({ type: "err", text: data.error || "Failed to delete lead" });
                                            return;
                                          }
                                          setInsights((prev) =>
                                            prev
                                              ? {
                                                  ...prev,
                                                  totals: {
                                                    ...prev.totals,
                                                    leads: Math.max(0, (prev.totals?.leads || 0) - 1)
                                                  },
                                                  recentLeads: (prev.recentLeads || []).filter(
                                                    (l) => l.id !== row.id
                                                  )
                                                }
                                              : prev
                                          );
                                          setMessage({ type: "ok", text: "Lead deleted." });
                                        } catch {
                                          setMessage({ type: "err", text: "Failed to delete lead" });
                                        }
                                      }}
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                            {!(insights.recentLeads || []).length ? (
                              <tr>
                                <td colSpan={4} className="admin-muted">
                                  No leads captured yet.
                                </td>
                              </tr>
                            ) : null}
                          </tbody>
                        </table>
                      </div>
                    </section>

                    <section className="card admin-editor-card">
                      <div className="admin-insight-heading-row">
                        <h3 className="admin-insight-heading">Recent visitor records</h3>
                        <div className="admin-insight-heading-actions">
                          <button
                            type="button"
                            className="admin-insight-link-btn"
                            onClick={async () => {
                              if (!token) return;
                              const ok = window.confirm("Clear all visitor history? This cannot be undone.");
                              if (!ok) return;
                              try {
                                const res = await fetch("/api/admin/insights/visitors", {
                                  method: "DELETE",
                                  headers: { "x-admin-token": token }
                                });
                                const data = await res.json();
                                if (!res.ok) {
                                  setMessage({ type: "err", text: data.error || "Failed to clear visitors" });
                                  return;
                                }
                                setInsights((prev) =>
                                  prev
                                    ? {
                                        ...prev,
                                        totals: { ...prev.totals, visitors: 0 },
                                        thisMonth: { ...prev.thisMonth, visitors: 0 },
                                        lastMonth: { ...prev.lastMonth, visitors: 0 },
                                        monthlyVisitors: (prev.monthlyVisitors || []).map((m) => ({
                                          ...m,
                                          visitors: 0
                                        })),
                                        recentVisitors: []
                                      }
                                    : prev
                                );
                                setMessage({ type: "ok", text: "Visitor history cleared." });
                              } catch {
                                setMessage({ type: "err", text: "Failed to clear visitors" });
                              }
                            }}
                          >
                            Clear all
                          </button>
                        </div>
                      </div>
                      <div className="admin-insight-table-wrap">
                        <table className="admin-insight-table">
                          <thead>
                            <tr>
                              <th>Path</th>
                              <th>Referrer</th>
                              <th>Visited</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(insights.recentVisitors || []).map((row) => (
                              <tr key={row.id}>
                                <td>{row.path}</td>
                                <td>{row.referrer || "-"}</td>
                                <td>{formatStamp(row.at)}</td>
                              </tr>
                            ))}
                            {!(insights.recentVisitors || []).length ? (
                              <tr>
                                <td colSpan={3} className="admin-muted">
                                  No visitor records yet.
                                </td>
                              </tr>
                            ) : null}
                          </tbody>
                        </table>
                      </div>
                    </section>
                  </div>
                </>
              ) : (
                <section className="card admin-editor-card">
                  <p className="admin-hint">No data yet. Click “Refresh insights” to load visitors and leads.</p>
                </section>
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>

        <footer className="admin-foot">
          <Link href="/">← View public site</Link>
        </footer>
      </main>
    </div>
  );
}
