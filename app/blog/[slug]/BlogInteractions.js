"use client";

import { useMemo, useState } from "react";

function formatDate(value) {
  try {
    return new Date(value).toLocaleDateString();
  } catch {
    return value;
  }
}

function stars(rating) {
  return "★".repeat(Math.max(1, Math.min(5, rating)));
}

export default function BlogInteractions({ blogId, initialComments = [] }) {
  const [comments, setComments] = useState(initialComments);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const avgRating = useMemo(() => {
    if (!comments.length) return 5;
    const total = comments.reduce((sum, c) => sum + (Number(c.rating) || 5), 0);
    return (total / comments.length).toFixed(1);
  }, [comments]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) {
      setStatus("Please write a comment first.");
      return;
    }
    setLoading(true);
    setStatus("");
    try {
      const res = await fetch(`/api/blogs/${blogId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, rating, text })
      });
      const raw = await res.text();
      let data = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        data = { error: raw || "Could not post comment" };
      }
      if (!res.ok) throw new Error(data.error || "Could not post comment");

      setComments((prev) => [data.comment, ...prev]);
      setText("");
      setName("");
      setRating(5);
      setStatus("Thanks! Your review is now live.");
    } catch (error) {
      setStatus(error.message || "Failed to submit review.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="blog-interactions" id="comments" aria-label="Comments">
      <div className="card">
        <h3>Comments</h3>
        <p className="section-intro">
          Share your thoughts on this article. Your comment appears here after you post it.
        </p>
        <p className="portfolio-note">
          Average rating: <strong>{avgRating}/5</strong> ({comments.length} review{comments.length === 1 ? "" : "s"})
        </p>
        <form className="blog-comment-form" onSubmit={handleSubmit}>
          <label>
            Your Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Optional"
              maxLength={80}
            />
          </label>
          <label>
            Rating
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
              <option value={5}>5 - Excellent</option>
              <option value={4}>4 - Great</option>
              <option value={3}>3 - Good</option>
              <option value={2}>2 - Fair</option>
              <option value={1}>1 - Poor</option>
            </select>
          </label>
          <label>
            Your Comment
            <textarea
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Share your thoughts..."
              maxLength={1000}
              required
            />
          </label>
          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Posting..." : "Post Comment"}
          </button>
          {status ? <p className="portfolio-note">{status}</p> : null}
        </form>
      </div>

      <div className="blog-comments-list">
        {comments.length === 0 ? (
          <article className="card">
            <h4>No comments yet</h4>
            <p>Be the first to leave a review for this article.</p>
          </article>
        ) : (
          comments.map((comment) => (
            <article className="card" key={comment.id}>
              <div className="blog-comment-head">
                <h4>{comment.name || "Anonymous"}</h4>
                <span>{stars(Number(comment.rating) || 5)}</span>
              </div>
              <p>{comment.text}</p>
              <p className="portfolio-note">{formatDate(comment.createdAt)}</p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
