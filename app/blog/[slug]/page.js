import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogBySlug } from "../../../lib/blogStore";
import { getSiteUrl } from "../../../lib/siteUrl";
import BlogInteractions from "./BlogInteractions";

function formatBlogDate(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) return { title: "Blog Not Found | Wrapify Solutions" };
  const base = getSiteUrl();
  const canonical = `${base}/blog/${blog.slug}`;
  return {
    title: `${blog.title} | Wrapify Solutions`,
    description: blog.excerpt,
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: canonical,
      title: blog.title,
      description: blog.excerpt,
      publishedTime: blog.publishedAt,
      images: blog.imageUrl ? [{ url: blog.imageUrl, alt: blog.title }] : []
    },
    twitter: {
      card: blog.imageUrl ? "summary_large_image" : "summary",
      title: blog.title,
      description: blog.excerpt,
      ...(blog.imageUrl ? { images: [blog.imageUrl] } : {})
    }
  };
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) notFound();
  const comments = Array.isArray(blog.comments) ? blog.comments : [];

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    datePublished: blog.publishedAt,
    description: blog.excerpt,
    image: blog.imageUrl || undefined,
    author: {
      "@type": "Organization",
      name: "Wrapify Solutions"
    }
  };

  const publishedLabel = formatBlogDate(blog.publishedAt);

  return (
    <main className="blog-page">
      <article className="section">
        <div className="container blog-detail">
          <p className="blog-back-wrap">
            <Link href="/blog" className="blog-back-link">
              ← All articles
            </Link>
          </p>
          <p className="portfolio-tag">{blog.category}</p>
          <h1>{blog.title}</h1>
          <p className="blog-detail-meta">
            Published <time dateTime={blog.publishedAt}>{publishedLabel}</time>
          </p>
          {blog.imageUrl ? <img src={blog.imageUrl} alt={blog.title} className="blog-hero-image" /> : null}
          <p className="blog-excerpt blog-excerpt--lead">{blog.excerpt}</p>
          <div className="blog-content">
            {blog.content.split("\n").map((line, idx) => (
              <p key={`${blog.id}-${idx}`}>{line}</p>
            ))}
          </div>
          <BlogInteractions blogId={blog.id} initialComments={comments} />
        </div>
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </main>
  );
}
