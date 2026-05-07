import { promises as fs } from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const blogsFile = path.join(dataDir, "blogs.json");

function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function ensureStore() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(blogsFile);
  } catch {
    const seed = [
      {
        id: "b1",
        title: "Web Development Best Practices 2025",
        slug: "web-development-best-practices-2025",
        excerpt: "High-performance websites for USA markets.",
        content:
          "Discover modern performance, accessibility, and SEO patterns for scalable web experiences in competitive markets.",
        category: "Web Development",
        imageUrl: "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=1600",
        publishedAt: "2025-01-04",
        comments: [
          {
            id: "c101",
            name: "Adeel",
            text: "Very useful checklist for performance and SEO. We applied the image optimization tips immediately.",
            rating: 5,
            createdAt: "2025-01-06T11:00:00.000Z"
          }
        ]
      },
      {
        id: "b2",
        title: "Mobile App Guide for Qatar & MENA",
        slug: "mobile-app-guide-for-qatar-and-mena",
        excerpt: "iOS and Android launch strategy by region.",
        content:
          "A practical framework for launching mobile products in MENA with localization, performance, and growth planning.",
        category: "App Development",
        imageUrl: "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=1600",
        publishedAt: "2025-01-03",
        comments: []
      },
      {
        id: "b3",
        title: "AI Automation Playbook for Service Businesses",
        slug: "ai-automation-playbook-service-businesses",
        excerpt: "Automate repetitive operations with practical AI workflows.",
        content:
          "Learn where AI automation creates immediate ROI for growing service companies. This guide covers lead qualification, support routing, reporting automation, and phased rollout strategies to reduce risk while improving efficiency.",
        category: "AI Automation",
        imageUrl: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1600",
        publishedAt: "2025-01-02",
        comments: []
      },
      {
        id: "b4",
        title: "UI/UX Conversion Patterns That Increase Leads",
        slug: "ui-ux-conversion-patterns-increase-leads",
        excerpt: "Design patterns that improve trust and conversion rates.",
        content:
          "High-converting interfaces combine clear hierarchy, trust signals, and low-friction forms. In this article, we break down practical UI/UX techniques for B2B websites and explain how to validate each change with measurable experiments.",
        category: "UI/UX Design",
        imageUrl: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1600",
        publishedAt: "2025-01-01",
        comments: []
      }
    ];
    await fs.writeFile(blogsFile, JSON.stringify(seed, null, 2), "utf8");
  }
}

export async function getAllBlogs() {
  await ensureStore();
  const raw = await fs.readFile(blogsFile, "utf8");
  const blogs = JSON.parse(raw);
  return blogs.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
}

export async function getBlogBySlug(slug) {
  const blogs = await getAllBlogs();
  return blogs.find((b) => b.slug === slug) || null;
}

export async function getBlogById(id) {
  const blogs = await getAllBlogs();
  return blogs.find((b) => b.id === id) || null;
}

export async function createBlog(input) {
  const blogs = await getAllBlogs();
  const title = (input.title || "").trim();
  const slugBase = slugify(input.slug || title);
  let slug = slugBase || `post-${Date.now()}`;
  let i = 1;
  while (blogs.some((b) => b.slug === slug)) {
    slug = `${slugBase}-${i++}`;
  }

  const post = {
    id: globalThis.crypto?.randomUUID?.() || `${Date.now()}`,
    title,
    slug,
    excerpt: (input.excerpt || "").trim(),
    content: (input.content || "").trim(),
    category: (input.category || "General").trim(),
    imageUrl: (input.imageUrl || "").trim(),
    publishedAt: input.publishedAt || new Date().toISOString().slice(0, 10)
  };

  const next = [post, ...blogs];
  await fs.writeFile(blogsFile, JSON.stringify(next, null, 2), "utf8");
  return post;
}

export async function updateBlog(id, input) {
  const blogs = await getAllBlogs();
  const index = blogs.findIndex((b) => b.id === id);
  if (index === -1) return null;

  const current = blogs[index];
  const requestedSlug = slugify(input.slug || input.title || current.slug);
  let slug = requestedSlug || current.slug;
  let i = 1;
  while (blogs.some((b) => b.id !== id && b.slug === slug)) {
    slug = `${requestedSlug}-${i++}`;
  }

  const updated = {
    ...current,
    title: (input.title ?? current.title).trim(),
    slug,
    excerpt: (input.excerpt ?? current.excerpt).trim(),
    content: (input.content ?? current.content).trim(),
    category: (input.category ?? current.category).trim(),
    imageUrl: (input.imageUrl ?? current.imageUrl).trim(),
    publishedAt: input.publishedAt ?? current.publishedAt
  };

  blogs[index] = updated;
  await fs.writeFile(blogsFile, JSON.stringify(blogs, null, 2), "utf8");
  return updated;
}

export async function deleteBlog(id) {
  const blogs = await getAllBlogs();
  const next = blogs.filter((b) => b.id !== id);
  if (next.length === blogs.length) return false;
  await fs.writeFile(blogsFile, JSON.stringify(next, null, 2), "utf8");
  return true;
}

export async function addBlogComment(blogId, input) {
  const blogs = await getAllBlogs();
  const index = blogs.findIndex((b) => b.id === blogId);
  if (index === -1) return null;

  const blog = blogs[index];
  const rating = Number(input.rating);
  const comment = {
    id: globalThis.crypto?.randomUUID?.() || `${Date.now()}`,
    name: (input.name || "Anonymous").trim().slice(0, 80),
    text: (input.text || "").trim().slice(0, 1000),
    rating: Number.isFinite(rating) ? Math.min(5, Math.max(1, Math.round(rating))) : 5,
    createdAt: new Date().toISOString()
  };

  if (!comment.text) return null;

  const comments = Array.isArray(blog.comments) ? blog.comments : [];
  const updated = { ...blog, comments: [comment, ...comments] };
  blogs[index] = updated;
  await fs.writeFile(blogsFile, JSON.stringify(blogs, null, 2), "utf8");
  return comment;
}
