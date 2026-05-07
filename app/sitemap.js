import { getSiteUrl } from "../lib/siteUrl";
import { getAllBlogs } from "../lib/blogStore";

export default async function sitemap() {
  const base = getSiteUrl();
  const blogs = await getAllBlogs();

  const staticRoutes = [
    { path: "", changeFrequency: "weekly", priority: 1 },
    { path: "/blog", changeFrequency: "weekly", priority: 0.85 },
    { path: "/careers", changeFrequency: "weekly", priority: 0.8 },
    { path: "/services/web-development", changeFrequency: "weekly", priority: 0.82 },
    { path: "/services/mobile-app-development", changeFrequency: "weekly", priority: 0.82 },
    { path: "/services/voice-ai-agent-development", changeFrequency: "weekly", priority: 0.82 },
    { path: "/services/ai-agents-automation", changeFrequency: "weekly", priority: 0.8 },
    { path: "/services/chatbot-development", changeFrequency: "weekly", priority: 0.8 },
    { path: "/services/ui-ux-design", changeFrequency: "weekly", priority: 0.8 },
    { path: "/services/digital-transformation", changeFrequency: "weekly", priority: 0.8 },
    { path: "/services/staff-augmentation", changeFrequency: "weekly", priority: 0.8 },
    { path: "/services/remote-team-creation", changeFrequency: "weekly", priority: 0.8 },
    { path: "/privacy", changeFrequency: "yearly", priority: 0.35 },
    { path: "/terms", changeFrequency: "yearly", priority: 0.35 },
    { path: "/cookies", changeFrequency: "yearly", priority: 0.35 }
  ].map(({ path, changeFrequency, priority }) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority
  }));

  const blogRoutes = blogs.map((b) => ({
    url: `${base}/blog/${b.slug}`,
    lastModified: b.publishedAt ? new Date(b.publishedAt) : new Date(),
    changeFrequency: "weekly",
    priority: 0.65
  }));

  return [...staticRoutes, ...blogRoutes];
}
