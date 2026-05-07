"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const TOKEN_KEY = "wrapify-admin-token";

const initialForm = {
  title: "",
  description: "",
  lastDate: "",
  formUrl: ""
};

export default function AdminCareersPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [ready, setReady] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const isEditing = useMemo(() => Boolean(editingId), [editingId]);

  useEffect(() => {
    const saved = localStorage.getItem(TOKEN_KEY) || "";
    if (!saved) {
      router.replace("/blog/login");
      return;
    }
    setToken(saved);
    loadJobs(saved);
    setReady(true);
  }, [router]);

  async function loadJobs(currentToken = token) {
    try {
      const res = await fetch("/api/jobs", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Failed to load jobs");
        return;
      }
      setJobs(data.jobs || []);
    } catch {
      setMessage("Failed to load jobs");
    }
  }

  function onChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    setMessage("");
    const url = isEditing ? `/api/jobs/${editingId}` : "/api/jobs";
    const method = isEditing ? "PUT" : "POST";
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
        setMessage(data.error || "Failed to save job");
        return;
      }
      setForm(initialForm);
      setEditingId(null);
      setMessage(isEditing ? "Job updated successfully." : "Job created successfully.");
      await loadJobs();
    } finally {
      setSaving(false);
    }
  }

  function onEdit(job) {
    setEditingId(job.id);
    setForm({
      title: job.title || "",
      description: job.description || "",
      lastDate: job.lastDate || "",
      formUrl: job.formUrl || ""
    });
    setMessage("");
  }

  async function onDelete(id) {
    if (!token) return;
    const ok = window.confirm("Delete this job posting? This cannot be undone.");
    if (!ok) return;
    const res = await fetch(`/api/jobs/${id}`, {
      method: "DELETE",
      headers: { "x-admin-token": token }
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || "Delete failed");
      return;
    }
    if (editingId === id) {
      setEditingId(null);
      setForm(initialForm);
    }
    setMessage("Job deleted.");
    await loadJobs();
  }

  if (!ready) {
    return (
      <main className="section">
        <div className="container">
          <p className="section-intro">Loading careers workspace…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="section">
      <div className="container">
        <p className="portfolio-note" style={{ marginBottom: "12px" }}>
          <a href="/admin">← Content dashboard</a>
        </p>
        <h1>Careers workspace</h1>
        <p className="section-intro">
          Create, update, and delete public job postings for the careers page. Applicants are asked to send resumes to{" "}
          <a href="mailto:wrapifysolutions@gmail.com">wrapifysolutions@gmail.com</a> and optionally complete a Google
          Form.
        </p>

        <div className="card admin-blog-card">
          {message ? <p className="portfolio-note">{message}</p> : null}
          <form onSubmit={onSubmit} className="admin-blog-form">
            <input
              name="title"
              value={form.title}
              onChange={onChange}
              placeholder="Job title (e.g. Senior Full-Stack Engineer)"
              required
            />
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              placeholder="Role description and responsibilities"
              rows={4}
              required
            />
            <input
              name="lastDate"
              value={form.lastDate}
              onChange={onChange}
              placeholder="Last date to apply (YYYY-MM-DD)"
            />
            <input
              name="formUrl"
              value={form.formUrl}
              onChange={onChange}
              placeholder="Optional Google Form link"
            />
            <div className="cta-row">
              <button className="btn" type="submit" disabled={saving}>
                {isEditing ? "Update Job" : "Create Job"}
              </button>
              {isEditing ? (
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    setEditingId(null);
                    setForm(initialForm);
                  }}
                >
                  Cancel Edit
                </button>
              ) : null}
            </div>
          </form>
        </div>

        <div className="card-grid two" style={{ marginTop: "18px" }}>
          {jobs.map((job) => (
            <article key={job.id} className="card blog-card">
              <p className="portfolio-tag">Open Role</p>
              <h3>{job.title}</h3>
              <p>{job.description}</p>
              <p className="portfolio-note">
                Last date: {job.lastDate || "Open until filled"} · Resumes: wrapifysolutions@gmail.com
              </p>
              <div className="cta-row">
                <button className="btn btn-outline" type="button" onClick={() => onEdit(job)}>
                  Edit
                </button>
                <button className="btn btn-outline" type="button" onClick={() => onDelete(job.id)}>
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

