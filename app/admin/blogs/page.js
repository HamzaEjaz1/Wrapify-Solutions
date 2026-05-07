"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

const initialForm = {
  title: "",
  slug: "",
  category: "",
  excerpt: "",
  imageUrl: "",
  publishedAt: "",
  content: ""
};

const TOKEN_KEY = "wrapify-admin-token";

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatPreviewDate(value) {
  if (!value) return "Date not set";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function BlogPreview({ form }) {
  const slug = (form.slug || slugify(form.title) || "your-slug").replace(/^\/+/, "");
  const lines = (form.content || "").split("\n");

  return (
    <div className="admin-blog-preview-frame">
      <div className="admin-blog-preview-chrome">
        <span className="admin-blog-preview-dots" aria-hidden="true" />
        <span className="admin-blog-preview-url">wrapify.com/blog/{slug || "…"}</span>
      </div>
      <div className="admin-blog-preview-body blog-page">
        <article className="admin-blog-preview-article">
          <div className="container blog-detail">
            <p className="portfolio-tag">{form.category || "Category"}</p>
            <h1>{form.title || "Untitled post"}</h1>
            <p className="blog-detail-meta">
              Published <time dateTime={form.publishedAt || ""}>{formatPreviewDate(form.publishedAt)}</time>
            </p>
            {form.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.imageUrl} alt={form.title || "Hero"} className="blog-hero-image" />
            ) : (
              <div className="admin-blog-preview-image-placeholder">No hero image URL yet</div>
            )}
            <p className="blog-excerpt blog-excerpt--lead">{form.excerpt || "Add an excerpt — it appears under the title on the live site."}</p>
            <div className="blog-content">
              {lines.filter((l) => l.trim()).length ? (
                lines.map((line, idx) => <p key={idx}>{line || "\u00a0"}</p>)
              ) : (
                <p className="admin-blog-preview-empty">Article body will appear here (one paragraph per line).</p>
              )}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

export default function AdminBlogsPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [token, setToken] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [ready, setReady] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [layoutMode, setLayoutMode] = useState("split");
  const [tokenVisible, setTokenVisible] = useState(false);

  const loadBlogs = useCallback(async () => {
    setLoadingList(true);
    try {
      const res = await fetch("/api/blogs");
      const data = await res.json();
      setBlogs(data.blogs || []);
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(TOKEN_KEY) || "";
    if (!saved) {
      router.replace("/blog/login");
      return;
    }
    setToken(saved);
    loadBlogs();
    setReady(true);
  }, [router, loadBlogs]);

  const categories = useMemo(() => {
    const set = new Set();
    blogs.forEach((b) => {
      if (b.category) set.add(b.category);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    const q = search.trim().toLowerCase();
    return blogs.filter((b) => {
      if (categoryFilter !== "all" && b.category !== categoryFilter) return false;
      if (!q) return true;
      const hay = `${b.title} ${b.excerpt} ${b.category} ${b.slug}`.toLowerCase();
      return hay.includes(q);
    });
  }, [blogs, search, categoryFilter]);

  const isEditing = useMemo(() => Boolean(editingId), [editingId]);

  const previewSlug = (form.slug || slugify(form.title) || "").replace(/^\/+/, "");
  const liveBlogUrl = previewSlug ? `/blog/${previewSlug}` : null;

  function onChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    const url = isEditing ? `/api/blogs/${editingId}` : "/api/blogs";
    const method = isEditing ? "PUT" : "POST";
    setSaving(true);
    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "err", text: data.error || "Failed to save blog" });
        return;
      }

      setForm(initialForm);
      setEditingId(null);
      setMessage({ type: "ok", text: isEditing ? "Blog updated successfully." : "Blog created successfully." });
      await loadBlogs();
    } finally {
      setSaving(false);
    }
  }

  function onEdit(blog) {
    setEditingId(blog.id);
    setForm({
      title: blog.title || "",
      slug: blog.slug || "",
      category: blog.category || "",
      excerpt: blog.excerpt || "",
      imageUrl: blog.imageUrl || "",
      publishedAt: blog.publishedAt || "",
      content: blog.content || ""
    });
    setMessage({ type: "", text: "" });
  }

  function onNewPost() {
    setEditingId(null);
    setForm(initialForm);
    setMessage({ type: "", text: "" });
  }

  async function onDelete(id) {
    const ok = window.confirm("Delete this blog? This cannot be undone.");
    if (!ok) return;
    const res = await fetch(`/api/blogs/${id}`, {
      method: "DELETE",
      headers: { "x-admin-token": token }
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage({ type: "err", text: data.error || "Delete failed" });
      return;
    }
    if (editingId === id) {
      setEditingId(null);
      setForm(initialForm);
    }
    setMessage({ type: "ok", text: "Blog deleted." });
    await loadBlogs();
  }

  function fillSlugFromTitle() {
    setForm((prev) => ({ ...prev, slug: slugify(prev.title) }));
  }

  if (!ready) {
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
            Opening blog workspace…
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-app admin-blog-app">
      <div className="admin-app-grid" aria-hidden="true" />

      <aside className="admin-sidebar admin-blog-sidebar" aria-label="Posts and session">
        <div className="admin-sidebar-brand">
          <motion.span
            className="admin-sidebar-logo"
            whileHover={{ scale: 1.06, rotate: 4 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
          >
            W
          </motion.span>
          <div>
            <strong className="admin-sidebar-title">Blog workspace</strong>
            <span className="admin-sidebar-sub">Posts &amp; SEO</span>
          </div>
        </div>

        <Link href="/admin" className="admin-blog-back">
          ← Content dashboard
        </Link>

        <div className="admin-blog-search-wrap">
          <input
            type="search"
            className="admin-blog-search"
            placeholder="Search posts…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search posts"
          />
        </div>

        <div className="admin-blog-filter-row" role="group" aria-label="Filter by category">
          <button
            type="button"
            className={`admin-blog-filter-pill ${categoryFilter === "all" ? "is-active" : ""}`}
            onClick={() => setCategoryFilter("all")}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              className={`admin-blog-filter-pill ${categoryFilter === c ? "is-active" : ""}`}
              onClick={() => setCategoryFilter(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="admin-blog-list-head">
          <span>{filteredBlogs.length} post{filteredBlogs.length === 1 ? "" : "s"}</span>
          <motion.button
            type="button"
            className="admin-blog-new-btn"
            onClick={onNewPost}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            + New
          </motion.button>
        </div>

        <div className="admin-blog-list">
          {loadingList ? (
            <p className="admin-blog-list-hint">Loading…</p>
          ) : filteredBlogs.length === 0 ? (
            <p className="admin-blog-list-hint">No posts match your filters.</p>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredBlogs.map((blog) => (
                <motion.div
                  key={blog.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.22 }}
                  className={`admin-blog-list-item-wrap ${editingId === blog.id ? "is-active" : ""}`}
                >
                  <button type="button" className="admin-blog-list-item" onClick={() => onEdit(blog)}>
                    <span className="admin-blog-list-item__cat">{blog.category}</span>
                    <span className="admin-blog-list-item__title">{blog.title}</span>
                    <span className="admin-blog-list-item__meta">{blog.publishedAt}</span>
                  </button>
                  <button
                    type="button"
                    className="admin-blog-list-delete"
                    title="Delete post"
                    aria-label={`Delete ${blog.title}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(blog.id);
                    }}
                  >
                    ×
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        <div className="admin-blog-session">
          <button
            type="button"
            className="admin-blog-session-toggle"
            onClick={() => setTokenVisible((v) => !v)}
            aria-expanded={tokenVisible}
          >
            Admin token {tokenVisible ? "▾" : "▸"}
          </button>
          {tokenVisible ? (
            <label className="admin-blog-session-field">
              <span>Token (stored locally)</span>
              <input
                value={token}
                onChange={(e) => {
                  setToken(e.target.value);
                  localStorage.setItem(TOKEN_KEY, e.target.value);
                }}
                placeholder="Token"
                autoComplete="off"
              />
            </label>
          ) : (
            <p className="admin-blog-session-hint">Saved in this browser for API requests.</p>
          )}
        </div>
      </aside>

      <main className="admin-main admin-blog-main">
        <header className="admin-blog-editor-header">
          <div>
            <div className="admin-breadcrumb admin-blog-breadcrumb">
              <span className="admin-breadcrumb__dot" />
              <span>Studio</span>
              <span className="admin-breadcrumb__sep">/</span>
              <span>Blog</span>
            </div>
            <h1 className="admin-page-title admin-blog-editor-title">{isEditing ? "Edit post" : "New post"}</h1>
            <p className="admin-page-sub">
              Draft in the editor; preview updates as you type. Saving still requires your admin token.
            </p>
          </div>
          <div className="admin-blog-toolbar">
            <div className="admin-blog-layout-toggle" role="group" aria-label="Editor layout">
              {["edit", "split", "preview"].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  className={`admin-blog-layout-btn ${layoutMode === mode ? "is-active" : ""}`}
                  onClick={() => setLayoutMode(mode)}
                >
                  {mode === "edit" ? "Edit" : mode === "split" ? "Split" : "Preview"}
                </button>
              ))}
            </div>
            <div className="admin-blog-toolbar-actions">
              {liveBlogUrl ? (
                <Link href={liveBlogUrl} target="_blank" rel="noopener noreferrer" className="admin-btn admin-btn--ghost">
                  Open live ↗
                </Link>
              ) : null}
              <motion.button
                type="submit"
                form="admin-blog-form"
                className="admin-btn admin-btn--primary"
                disabled={saving}
                whileHover={{ scale: saving ? 1 : 1.02 }}
                whileTap={{ scale: saving ? 1 : 0.98 }}
              >
                {saving ? (
                  <span className="admin-btn__inner">
                    <span className="admin-mini-spinner" />
                    Saving…
                  </span>
                ) : isEditing ? (
                  "Update post"
                ) : (
                  "Publish post"
                )}
              </motion.button>
            </div>
          </div>
        </header>

        <AnimatePresence>
          {message.text ? (
            <motion.div
              key={message.text}
              role="status"
              className={message.type === "ok" ? "admin-banner admin-banner--ok" : "admin-banner admin-banner--err"}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
            >
              {message.text}
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div
          className={`admin-blog-panels ${layoutMode === "split" ? "is-split" : ""} ${layoutMode === "preview" ? "is-preview-only" : ""} ${layoutMode === "edit" ? "is-edit-only" : ""}`}
        >
          <section className="admin-blog-panel admin-blog-panel--form">
            <form id="admin-blog-form" onSubmit={onSubmit} className="admin-blog-form-v2">
              <div className="admin-field-grid">
                <label className="admin-field">
                  <span>Title</span>
                  <input
                    className="admin-input"
                    name="title"
                    value={form.title}
                    onChange={onChange}
                    placeholder="Post title"
                    required
                  />
                </label>
                <label className="admin-field">
                  <span>Slug</span>
                  <div className="admin-blog-slug-row">
                    <input
                      className="admin-input"
                      name="slug"
                      value={form.slug}
                      onChange={onChange}
                      placeholder="url-friendly-slug"
                    />
                    <button type="button" className="admin-btn admin-btn--ghost admin-btn--sm" onClick={fillSlugFromTitle}>
                      From title
                    </button>
                  </div>
                </label>
                <label className="admin-field">
                  <span>Category</span>
                  <input
                    className="admin-input"
                    name="category"
                    value={form.category}
                    onChange={onChange}
                    placeholder="e.g. Web Development"
                    required
                  />
                </label>
                <label className="admin-field">
                  <span>Published date</span>
                  <input
                    className="admin-input"
                    name="publishedAt"
                    value={form.publishedAt}
                    onChange={onChange}
                    placeholder="YYYY-MM-DD"
                  />
                </label>
                <label className="admin-field admin-field--full">
                  <span>Hero image URL</span>
                  <input
                    className="admin-input"
                    name="imageUrl"
                    value={form.imageUrl}
                    onChange={onChange}
                    placeholder="https://…"
                  />
                </label>
                <label className="admin-field admin-field--full">
                  <span>Excerpt</span>
                  <textarea
                    className="admin-textarea"
                    name="excerpt"
                    value={form.excerpt}
                    onChange={onChange}
                    placeholder="Short summary for cards and SEO"
                    rows={3}
                    required
                  />
                </label>
                <label className="admin-field admin-field--full">
                  <span>Body (one paragraph per line)</span>
                  <textarea
                    className="admin-textarea admin-blog-body-input"
                    name="content"
                    value={form.content}
                    onChange={onChange}
                    placeholder="Write your article…"
                    rows={14}
                    required
                  />
                </label>
              </div>
              <div className="admin-blog-form-actions">
                {isEditing ? (
                  <motion.button
                    type="button"
                    className="admin-btn admin-btn--ghost"
                    onClick={onNewPost}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel / New
                  </motion.button>
                ) : null}
                <button type="button" className="admin-btn admin-btn--ghost" onClick={() => loadBlogs()}>
                  Refresh list
                </button>
              </div>
            </form>
          </section>

          {layoutMode !== "edit" ? (
            <section className="admin-blog-panel admin-blog-panel--preview">
              <div className="admin-blog-preview-header">
                <h2 className="admin-blog-preview-title">Preview</h2>
                <p className="admin-blog-preview-sub">Approximates the public article layout (not comments).</p>
              </div>
              <motion.div
                className="admin-blog-preview-scroll"
                initial={false}
                animate={{ opacity: 1 }}
                key={layoutMode}
              >
                <BlogPreview form={form} />
              </motion.div>
            </section>
          ) : null}
        </div>

        <footer className="admin-foot admin-blog-foot">
          <Link href="/blog">View blog index</Link>
          <span className="admin-blog-foot-sep">·</span>
          <button
            type="button"
            className="admin-blog-delete-foot"
            onClick={() => {
              if (editingId) onDelete(editingId);
            }}
            disabled={!editingId}
          >
            Delete current post
          </button>
        </footer>
      </main>
    </div>
  );
}
