import { getAllJobs } from "../../lib/jobsStore";

function formatDate(value) {
  if (!value) return "Open until filled";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function daysUntil(value) {
  if (!value) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(value);
  d.setHours(0, 0, 0, 0);
  if (Number.isNaN(d.getTime())) return null;
  return Math.round((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export default async function CareersPage() {
  const jobs = await getAllJobs();
  const withMeta = jobs.map((job) => ({
    ...job,
    daysLeft: daysUntil(job.lastDate)
  }));

  return (
    <main className="section careers-page">
      <div className="container careers-shell">
        <p className="eyebrow">Careers at Wrapify Solutions</p>
        <h1>Join Our Remote Product &amp; AI Team</h1>
        <p className="section-intro">
          We work with product-led companies across the USA and MENA region, including Dubai and Qatar, to ship web,
          mobile, and AI solutions that actually move the needle. If you care about ownership, craft, and real impact,
          we would love to hear from you.
        </p>
        <p className="portfolio-note">
          Send your resume and a short note about why you&apos;re a fit to{" "}
          <a href="mailto:wrapifysolutions@gmail.com">wrapifysolutions@gmail.com</a>. If a role lists a Google Form,
          please complete that as well.
        </p>
        <section className="careers-highlights">
          <article className="card careers-highlight-card">
            <strong>{withMeta.length}</strong>
            <span>Open roles</span>
          </article>
          <article className="card careers-highlight-card">
            <strong>Remote-first</strong>
            <span>Flexible collaboration across MENA &amp; USA</span>
          </article>
          <article className="card careers-highlight-card">
            <strong>Fast process</strong>
            <span>Resume screen → Interview → Offer</span>
          </article>
        </section>

        {withMeta.length === 0 ? (
          <article className="card" style={{ marginTop: "18px" }}>
            <h2>No open roles right now</h2>
            <p>
              We don&apos;t have public openings at this moment, but we&apos;re always happy to connect with great
              engineers, designers, and product folks. Email{" "}
              <a href="mailto:wrapifysolutions@gmail.com">wrapifysolutions@gmail.com</a> with your profile.
            </p>
          </article>
        ) : (
          <div className="card-grid two careers-grid" style={{ marginTop: "18px" }}>
            {withMeta.map((job) => (
              <article key={job.id} className="card careers-job-card">
                <div className="careers-job-head">
                  <p className="portfolio-tag">Open Role</p>
                  {job.daysLeft != null ? (
                    <span className={`careers-deadline ${job.daysLeft <= 14 ? "is-soon" : ""}`}>
                      {job.daysLeft >= 0 ? `${job.daysLeft} days left` : "Closed"}
                    </span>
                  ) : null}
                </div>
                <h2>{job.title}</h2>
                <p>{job.description}</p>
                <p className="portfolio-note">Last date to apply: {formatDate(job.lastDate)}</p>
                <p className="portfolio-note">
                  Send your resume to <a href="mailto:wrapifysolutions@gmail.com">wrapifysolutions@gmail.com</a>
                  {job.formUrl ? " and complete the short form below." : "."}
                </p>
                <div className="cta-row">
                  <a className="btn" href="mailto:wrapifysolutions@gmail.com?subject=Application%20for%20Wrapify%20Role">
                    Send resume
                  </a>
                  {job.formUrl ? (
                    <a
                      href={job.formUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline"
                    >
                      Open application form
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

