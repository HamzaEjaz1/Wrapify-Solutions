import Link from "next/link";
import { getAllBlogs } from "../../lib/blogStore";
import { getSiteUrl } from "../../lib/siteUrl";

const base = getSiteUrl();

export const metadata = {
  title: "Blog & Resources | Wrapify Solutions",
  description: "Insights on web development, app development, AI automation, and digital transformation.",
  alternates: { canonical: `${base}/blog` },
  openGraph: {
    type: "website",
    url: `${base}/blog`,
    title: "Blog & Resources | Wrapify Solutions",
    description:
      "Insights on web development, app development, AI automation, and digital transformation for USA and MENA markets."
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog & Resources | Wrapify Solutions",
    description:
      "Insights on web development, app development, AI automation, and digital transformation for USA and MENA markets."
  }
};

export default async function BlogPage() {
  const blogs = await getAllBlogs();

  return (
    <main className="blog-page">
      <section className="section">
        <div className="container">
          <p className="eyebrow">Insights & Resources</p>
          <h1>Blog & Resources</h1>
          <p className="section-intro">
            Expert insights on web development, app development, AI automation, and digital transformation for USA and MENA markets.
          </p>
          <div className="card-grid three">
            {blogs.map((blog) => (
              <article key={blog.id} className="card blog-card">
                {blog.imageUrl ? <img src={blog.imageUrl} alt={blog.title} className="blog-thumb" /> : null}
                <p className="portfolio-tag">{blog.category}</p>
                <h3>{blog.title}</h3>
                <p>{blog.excerpt}</p>
                <p className="portfolio-note">{blog.publishedAt}</p>
                <Link href={`/blog/${blog.slug}`}>Read Article</Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
