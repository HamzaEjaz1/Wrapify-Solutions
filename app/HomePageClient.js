"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  easeSmooth,
  heroStagger,
  sectionVariants,
  staggerContainer,
  staggerItem,
  staggerItemWide
} from "../lib/motionVariants";
import { DEFAULT_SITE_CONTENT } from "../lib/siteContentDefaults";

function AnimatedSection({ id, className = "", variant = "fadeUp", children }) {
  const reduceMotion = useReducedMotion();
  const base = sectionVariants[variant] || sectionVariants.fadeUp;
  const variants = reduceMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.2 } } }
    : base;

  return (
    <motion.section
      id={id}
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12, margin: "0px 0px -10% 0px" }}
    >
      {children}
    </motion.section>
  );
}

const leadershipSlides = [
  {
    name: "Hamza Ejaz",
    role: "CEO - Founder",
    quote:
      "You get exceptional products, measurable outcomes, and technology that helps drive sustainable revenue growth.",
    image: "/hamza-ejaz-ceo.png",
    imageAlt: "Hamza Ejaz, CEO and Founder of Wrapify Solutions",
    ringClass: ""
  },
  {
    name: "Co-founder",
    role: "Chief Operating Officer (COO)",
    quote:
      "At Wrapify Solutions, your team gets AI-powered software that strengthens operations and turns complex challenges into growth opportunities.",
    image: "/co-founder-coo.png",
    imageAlt: "Co-founder and Chief Operating Officer of Wrapify Solutions",
    ringClass: "leadership-photo-ring--coo"
  }
];

const leadershipSpecializations = [
  "SaaS Development",
  "DevOps",
  "Web Application",
  "Web Development",
  "Full-Stack Development",
  "Front-End Development",
  "Back-End Development",
  "QA Testing & Automation",
  "Mobile App Development",
  "Amazon Web Services",
  "RESTful API",
  "Google Chrome Extension",
  "API Integration",
  "App Development",
  "Chatbots Development",
  "AI App Development",
  "Artificial Intelligence",
  "Machine Learning"
];

const faqItems = [
  {
    question: "What services do you offer?",
    answer:
      "We deliver end-to-end digital products: custom web platforms and marketing sites, iOS and Android apps, UI/UX design, CRM and SaaS builds, AI automation, voice and chat agents, integrations (payments, APIs, third-party tools), and DevOps-ready hosting and release workflows. If you are unsure where to start, tell us your outcome—we will recommend the smallest viable path."
  },
  {
    question: "Do you work with clients in the USA and MENA region?",
    answer:
      "Yes. We work remotely with teams across the United States, Saudi Arabia, UAE, Qatar, Egypt, Pakistan, and beyond. We align on overlapping hours for workshops and stand-ups, use shared tools (Slack, email, video, project boards), and document decisions so everyone stays in sync regardless of time zone."
  },
  {
    question: "How long does a typical project take?",
    answer:
      "Timelines depend on scope, integrations, and compliance needs. A focused marketing or brochure site might take a few weeks; a production web app or mobile product often spans multiple months. We break work into milestones with demos so you see progress regularly and can adjust priorities without surprises."
  },
  {
    question: "What does your process look like from first call to launch?",
    answer:
      "Usually: discovery and goals, proposal or statement of work, UX/UI where needed, iterative build with testable increments, staging and UAT, launch, and a handover with documentation. For larger programs we can run in phases—MVP first, then scale—so you ship value early and reduce risk."
  },
  {
    question: "How do you price projects—fixed fee, hourly, or retainer?",
    answer:
      "We use what fits the work: fixed scope for well-defined deliverables, time-and-materials or sprint-based billing when requirements are evolving, and retainers for ongoing product or platform care. After a short discovery we recommend the model that matches your risk tolerance and roadmap."
  },
  {
    question: "Can you integrate AI, chatbots, or automation into our product?",
    answer:
      "Yes. We design and implement conversational assistants, workflow automation, and AI features where they improve outcomes—not hype. That includes retrieval-augmented patterns, tool use with your APIs, guardrails, logging, and human handoff when needed, aligned with your security and compliance constraints."
  },
  {
    question: "Will we own the code and assets after delivery?",
    answer:
      "For custom work, ownership and licensing are defined in your agreement—typically you receive rights to the deliverables you paid for, while third-party libraries and services remain under their respective licenses. We clarify this upfront so there is no ambiguity at handover."
  },
  {
    question: "Do you sign an NDA before we share confidential details?",
    answer:
      "Yes. If you need mutual or one-way confidentiality before sharing roadmaps, data samples, or architecture, we can execute an NDA as a standard step before deeper discovery."
  },
  {
    question: "Do you provide ongoing support after project completion?",
    answer:
      "Yes. Many clients choose a maintenance or product-support retainer for monitoring, updates, security patches, small enhancements, and incident response. Ad-hoc support is also possible; we will outline options based on your traffic, stack, and uptime expectations."
  },
  {
    question: "How do we get started working together?",
    answer:
      "Use the contact form on this page, email wrapifysolutions@gmail.com, or call +92 343 9024736. Share your goal, timeline, and any links or briefs. We will respond with next steps—often a short call to align on scope and the best engagement model for your project."
  }
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer }
  }))
};

export default function HomePageClient({
  testimonials = DEFAULT_SITE_CONTENT.testimonials,
  services = DEFAULT_SITE_CONTENT.services,
  portfolioCategories = DEFAULT_SITE_CONTENT.portfolioCategories,
  partners = DEFAULT_SITE_CONTENT.partners
}) {
  const contactServiceOptions = [...services.map((s) => s.title), "General inquiry"];
  const [activePortfolio, setActivePortfolio] = useState(
    () => portfolioCategories[0]?.id || "cat-apps"
  );
  const [latestBlogs, setLatestBlogs] = useState([]);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
    services: [],
    serviceOther: ""
  });
  const [submittingContact, setSubmittingContact] = useState(false);
  const [contactNotice, setContactNotice] = useState({ open: false, type: "success", text: "" });
  const [leadershipSlide, setLeadershipSlide] = useState(0);
  const portfolioScrollerRef = useRef(null);

  useEffect(() => {
    async function loadLatestBlogs() {
      try {
        const res = await fetch("/api/blogs");
        const data = await res.json();
        setLatestBlogs((data.blogs || []).slice(0, 4));
      } catch {
        setLatestBlogs([]);
      }
    }
    loadLatestBlogs();
  }, []);

  useEffect(() => {
    setActiveTestimonial((i) => Math.min(i, Math.max(0, testimonials.length - 1)));
  }, [testimonials.length]);

  function scrollPortfolio(direction) {
    if (!portfolioScrollerRef.current) return;
    const amount = Math.max(portfolioScrollerRef.current.clientWidth * 0.85, 320);
    portfolioScrollerRef.current.scrollBy({ left: direction * amount, behavior: "smooth" });
  }

  const testimonialCount = Math.max(1, testimonials.length);

  function getServiceHref(service) {
    const title = String(service?.title || "").toLowerCase();
    if (title.includes("web")) return "/services/web-development";
    if (title.includes("app")) return "/services/mobile-app-development";
    if (title.includes("ai agents") || title.includes("automation")) return "/services/ai-agents-automation";
    if (title.includes("chatbot")) return "/services/chatbot-development";
    if (title.includes("ui/ux") || title.includes("ui ux")) return "/services/ui-ux-design";
    if (title.includes("digital transformation")) return "/services/digital-transformation";
    if (title.includes("staff augmentation")) return "/services/staff-augmentation";
    if (title.includes("remote team")) return "/services/remote-team-creation";
    return null;
  }

  function moveTestimonial(direction) {
    setActiveTestimonial((prev) => (prev + direction + testimonialCount) % testimonialCount);
  }

  async function submitContactForm(event) {
    event.preventDefault();
    setSubmittingContact(true);
    setContactNotice({ open: false, type: "success", text: "" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm)
      });
      const raw = await res.text();
      let data = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        data = { error: raw || "Could not submit message." };
      }
      if (!res.ok) throw new Error(data.error || "Could not submit message.");

      setContactForm({ name: "", email: "", message: "", services: [], serviceOther: "" });
      setContactNotice({
        open: true,
        type: data?.emailSent === false ? "error" : "success",
        text:
          data?.warning ||
          "Message sent successfully. We will contact you soon."
      });
      setTimeout(() => {
        setContactNotice((prev) => ({ ...prev, open: false }));
      }, 4200);
    } catch (error) {
      setContactNotice({
        open: true,
        type: "error",
        text: error.message || "Failed to send message. Please try again."
      });
    } finally {
      setSubmittingContact(false);
    }
  }

  function toggleContactService(label) {
    setContactForm((prev) => {
      const next = new Set(prev.services);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return { ...prev, services: Array.from(next) };
    });
  }

  function moveLeadership(direction) {
    setLeadershipSlide((prev) => (prev + direction + leadershipSlides.length) % leadershipSlides.length);
  }

  const currentCategory =
    portfolioCategories.find((c) => c.id === activePortfolio) || portfolioCategories[0] || { items: [], title: "" };

  return (
    <>
      <div className="bg-orb orb-1" aria-hidden="true" />
      <div className="bg-orb orb-2" aria-hidden="true" />
      <div className="bg-grid" aria-hidden="true" />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.55, ease: easeSmooth, delay: 0.06 }}
      >
        <AnimatedSection className="hero section" id="home" variant="fadeIn">
          <div className="hero-video-wrap" aria-hidden="true">
            <motion.img
              className="hero-video"
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1600&auto=format&fit=crop&q=80"
              alt=""
              initial={{ scale: 1.04 }}
              animate={{ scale: 1.09 }}
              transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            />
            <motion.div
              className="hero-office-glow"
              initial={{ opacity: 0.45, x: -20 }}
              animate={{ opacity: [0.45, 0.65, 0.45], x: [0, 18, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="hero-office-glow hero-office-glow--alt"
              initial={{ opacity: 0.35, y: 10 }}
              animate={{ opacity: [0.35, 0.55, 0.35], y: [10, -8, 10] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            >
            </motion.div>
            <div className="hero-overlay" />
          </div>
          <div className="container hero-grid hero-foreground">
            <motion.div
              className="hero-content"
              variants={heroStagger}
              initial="hidden"
              animate="visible"
            >
              <motion.p className="eyebrow" variants={staggerItem}>
                WELCOME TO WRAPIFY SOLUTIONS - SERVING USA & MENA REGION
              </motion.p>
              <motion.h1 variants={staggerItem}>
                Expert Web Development, App Development & AI Automation Solutions
              </motion.h1>
              <motion.p className="muted" variants={staggerItem}>
                Wrapify Solutions brings global expertise with local understanding. Serving businesses across USA,
                Saudi Arabia, UAE, Qatar, Egypt, and Pakistan.
              </motion.p>
              <motion.div className="cta-row" variants={staggerItem}>
                <motion.a href="#services" className="btn" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  Explore Our Services
                </motion.a>
                <motion.a
                  href="https://calendly.com/hamzaejaz0771/new-meeting"
                  className="btn btn-outline"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get a Free Consultation
                </motion.a>
              </motion.div>
            </motion.div>
          </div>
        </AnimatedSection>

        <AnimatedSection className="section metrics-partners" id="achievements" variant="fadeUp">
          <div className="metrics-full metrics-grid">
            <article className="metric-panel metric-panel-fluid">
              <motion.div
                className="metric-strip"
                variants={staggerContainer(0.07, 0.04)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.35 }}
              >
                <motion.div className="metric-title-wrap" variants={staggerItemWide}>
                  <p className="eyebrow metric-eyebrow">Performance Snapshot</p>
                  <h3>Digital Solutions for USA and MENA Region</h3>
                </motion.div>
                <motion.div whileHover={{ y: -6, transition: { duration: 0.22 } }} className="metric-item" variants={staggerItem}>
                  <strong>50+</strong>
                  <span>Projects Completed</span>
                </motion.div>
                <motion.div whileHover={{ y: -6, transition: { duration: 0.22 } }} className="metric-item" variants={staggerItem}>
                  <strong>25+</strong>
                  <span>Happy Clients</span>
                </motion.div>
                <motion.div whileHover={{ y: -6, transition: { duration: 0.22 } }} className="metric-item" variants={staggerItem}>
                  <strong>10,000+</strong>
                  <span>Lines of Code</span>
                </motion.div>
                <motion.div whileHover={{ y: -6, transition: { duration: 0.22 } }} className="metric-item" variants={staggerItem}>
                  <strong>15+</strong>
                  <span>Awards Won</span>
                </motion.div>
              </motion.div>
            </article>
            <article className="partner-panel partner-panel-fluid">
              <div className="partner-marquee" aria-label="Trusted partners scrolling logos">
                <div className="partner-track partner-track-a">
                  {partners.map((partner, idx) => (
                    <motion.div
                      className="partner-logo-card"
                      key={`${partner.name}-${idx}`}
                      initial={{ opacity: 0, scale: 0.85 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ delay: idx * 0.05, duration: 0.45, ease: easeSmooth }}
                      whileHover={{ scale: 1.08, y: -4 }}
                    >
                      <Image src={partner.logo} alt={partner.name} width={84} height={84} />
                    </motion.div>
                  ))}
                </div>
                <div className="partner-track partner-track-b" aria-hidden="true">
                  {partners.map((partner, idx) => (
                    <div className="partner-logo-card" key={`${partner.name}-clone-${idx}`}>
                      <Image src={partner.logo} alt="" width={84} height={84} />
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </div>
        </AnimatedSection>

        <AnimatedSection className="section alt" id="about" variant="slideInLeft">
          <div className="container about-shell">
            <motion.div
              className="about-left"
              variants={staggerContainer(0.1, 0.05)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
            >
              <motion.p className="eyebrow" variants={staggerItem}>
                About Wrapify Solutions
              </motion.p>
              <motion.h2 variants={staggerItem}>Who We Are</motion.h2>
              <motion.p className="about-lead" variants={staggerItem}>
                Wrapify Solutions is a forward-thinking technology company driven by innovation, design, and excellence.
                We craft digital solutions that solve problems and create measurable impact.
              </motion.p>
              <motion.div className="about-pillars" variants={staggerContainer(0.12, 0.06)}>
                <motion.article className="about-card" variants={staggerItem} whileHover={{ y: -4 }}>
                  <h3>Our Mission</h3>
                  <p>To wrap ideas into intelligent digital solutions that empower businesses to grow in the digital era.</p>
                </motion.article>
                <motion.article className="about-card" variants={staggerItem} whileHover={{ y: -4 }}>
                  <h3>Our Vision</h3>
                  <p>To lead the future of intelligent digital experiences across global and regional markets.</p>
                </motion.article>
              </motion.div>
            </motion.div>
            <motion.div
              className="about-right"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.65, ease: easeSmooth, delay: 0.08 }}
            >
              <motion.article
                className="about-highlight"
                whileHover={{ y: -3, transition: { duration: 0.25 } }}
              >
                <h3>Why Choose Wrapify Solutions?</h3>
                <ul className="about-list">
                  <li><span>01</span>Global expertise with local knowledge</li>
                  <li><span>02</span>Security and compliance first</li>
                  <li><span>03</span>24/7 support across timezones</li>
                  <li><span>04</span>Tailored strategy for every client</li>
                </ul>
              </motion.article>
            </motion.div>
          </div>
        </AnimatedSection>

        <AnimatedSection className="section leadership-section" id="leadership" variant="slideInRight">
          <div className="container leadership-shell">
            <div className="leadership-profile card">
              <div className="leadership-slider-viewport">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={leadershipSlide}
                    className="leadership-slide-inner"
                    initial={{ opacity: 0, x: 28 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -28 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                  >
                    <div
                      className={["leadership-photo-ring", leadershipSlides[leadershipSlide].ringClass]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <Image
                        src={leadershipSlides[leadershipSlide].image}
                        alt={leadershipSlides[leadershipSlide].imageAlt}
                        width={220}
                        height={220}
                        className="leadership-photo"
                      />
                    </div>
                    <div className="leadership-bio">
                      <p className="eyebrow">Leadership</p>
                      <h2>{leadershipSlides[leadershipSlide].name}</h2>
                      <p className="leadership-role">{leadershipSlides[leadershipSlide].role}</p>
                      <blockquote className="leadership-quote">
                        &ldquo;{leadershipSlides[leadershipSlide].quote}&rdquo;
                      </blockquote>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="leadership-slider-controls">
                <motion.button
                  type="button"
                  aria-label="Previous leader"
                  onClick={() => moveLeadership(-1)}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                >
                  ←
                </motion.button>
                <div className="leadership-slider-dots">
                  {leadershipSlides.map((slide, idx) => (
                    <button
                      key={slide.name}
                      type="button"
                      aria-label={`Show ${slide.name}`}
                      aria-current={leadershipSlide === idx ? "true" : undefined}
                      className={leadershipSlide === idx ? "active" : ""}
                      onClick={() => setLeadershipSlide(idx)}
                    />
                  ))}
                </div>
                <motion.button
                  type="button"
                  aria-label="Next leader"
                  onClick={() => moveLeadership(1)}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                >
                  →
                </motion.button>
              </div>
            </div>
            <motion.div
              className="leadership-specialties card"
              variants={staggerContainer(0.06, 0.05)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <motion.h3 variants={staggerItem}>Areas We Specialize In</motion.h3>
              <motion.p className="section-intro leadership-specialties-intro" variants={staggerItem}>
                You get access to a senior engineering team across SaaS, full-stack development, AI, and machine
                learning to build scalable solutions tailored to your business goals.
              </motion.p>
              <ul className="specialty-grid" aria-label="Specializations">
                {leadershipSpecializations.map((item) => (
                  <motion.li key={item} variants={staggerItem} whileHover={{ y: -3, transition: { duration: 0.2 } }}>
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </AnimatedSection>

        <AnimatedSection className="section empower-premium" id="empower" variant="scaleIn">
          <div className="container">
            <motion.div
              variants={staggerContainer(0.12, 0.06)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <motion.p className="eyebrow" variants={staggerItem}>
                How We Empower Business
              </motion.p>
              <motion.h2 variants={staggerItem}>Our Proven Delivery Framework</motion.h2>
              <motion.p className="section-intro" variants={staggerItem}>
                A structured, transparent process that turns ideas into measurable business results.
              </motion.p>
            </motion.div>
            <motion.div
              className="empower-timeline"
              variants={staggerContainer(0.14, 0.08)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
            >
              <motion.article className="step empower-step" variants={staggerItem} whileHover={{ y: -6, transition: { duration: 0.25 } }}>
                <span>01</span>
                <h3>Discovery & Strategy</h3>
                <p>We define business goals, constraints, and opportunities, then shape a practical roadmap.</p>
              </motion.article>
              <motion.article className="step empower-step" variants={staggerItem} whileHover={{ y: -6, transition: { duration: 0.25 } }}>
                <span>02</span>
                <h3>Design & Planning</h3>
                <p>We prototype key flows, align milestones, and map technical execution for smooth delivery.</p>
              </motion.article>
              <motion.article className="step empower-step" variants={staggerItem} whileHover={{ y: -6, transition: { duration: 0.25 } }}>
                <span>03</span>
                <h3>Build & Develop</h3>
                <p>We execute with modern technologies, agile updates, and continuous quality control.</p>
              </motion.article>
              <motion.article className="step empower-step" variants={staggerItem} whileHover={{ y: -6, transition: { duration: 0.25 } }}>
                <span>04</span>
                <h3>Launch & Optimize</h3>
                <p>We deploy, measure performance, and continuously optimize for long-term growth.</p>
              </motion.article>
            </motion.div>
          </div>
        </AnimatedSection>

        <AnimatedSection className="section" id="services" variant="fadeUp">
          <div className="container services-shell">
            <motion.div
              variants={staggerContainer(0.1, 0.05)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
            >
              <motion.h2 className="services-title" variants={staggerItem}>
                Our Core Services
              </motion.h2>
              <motion.p className="section-intro" variants={staggerItem}>
                We build web platforms, mobile apps, and AI voice/calling agents that help companies automate operations,
                increase qualified leads, and scale across UAE, Qatar, and MENA.
              </motion.p>
            </motion.div>
            <motion.div
              className="services-links"
              aria-label="Jump to service"
              variants={staggerContainer(0.05, 0.02)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.35 }}
            >
              {services.map((svc) => (
                <motion.a
                  key={svc.id}
                  href={`#${svc.id}`}
                  variants={staggerItem}
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {svc.title}
                </motion.a>
              ))}
            </motion.div>
            <div className="services-scroll-wrap">
              <motion.div
                className="services-scroll-track"
                variants={staggerContainer(0.08, 0.04)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.08 }}
              >
                {services.map((svc) => (
                  <motion.article
                    key={svc.id}
                    className="card service-card"
                    id={svc.id}
                    variants={staggerItem}
                    whileHover={{ y: -5, transition: { duration: 0.22 } }}
                  >
                    <h3>{svc.title}</h3>
                    <p>{svc.description}</p>
                    <ul className="service-list">
                      {(svc.bullets || []).map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                    {svc.note ? <p className="service-note">{svc.note}</p> : null}
                    {getServiceHref(svc) ? (
                      <p className="service-note">
                        <Link href={getServiceHref(svc)}>View more details →</Link>
                      </p>
                    ) : null}
                  </motion.article>
                ))}
              </motion.div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection className="section" id="use-cases" variant="slideInLeft">
          <div className="container portfolio-shell">
            <motion.div
              className="portfolio-intro"
              variants={staggerContainer(0.1, 0.05)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.35 }}
            >
              <motion.p className="eyebrow" variants={staggerItem}>
                Portfolio
              </motion.p>
              <motion.h2 variants={staggerItem}>Use Cases</motion.h2>
              <motion.p className="section-intro" variants={staggerItem}>
                Real-world projects where we wrapped ideas into intelligent, high-impact products.
                Categorized by application type for fast exploration.
              </motion.p>
            </motion.div>

            <motion.div
              className="portfolio-categories"
              variants={staggerContainer(0.06, 0.02)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
            >
              {portfolioCategories.map((category) => (
                <motion.button
                  key={category.id}
                  type="button"
                  className={`portfolio-chip ${activePortfolio === category.id ? "active" : ""}`}
                  variants={staggerItem}
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setActivePortfolio(category.id);
                    portfolioScrollerRef.current?.scrollTo({ left: 0, behavior: "smooth" });
                  }}
                >
                  {category.label}
                </motion.button>
              ))}
            </motion.div>

            <div className="portfolio-stage">
              <div className="portfolio-stage-head">
                <motion.h3
                  key={currentCategory.title}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, ease: easeSmooth }}
                >
                  {currentCategory.title}
                </motion.h3>
                <div className="portfolio-controls">
                  <motion.button
                    type="button"
                    aria-label="Scroll portfolio left"
                    onClick={() => scrollPortfolio(-1)}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.94 }}
                  >
                    ←
                  </motion.button>
                  <motion.button
                    type="button"
                    aria-label="Scroll portfolio right"
                    onClick={() => scrollPortfolio(1)}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.94 }}
                  >
                    →
                  </motion.button>
                </div>
              </div>
              <div className="portfolio-scroll" ref={portfolioScrollerRef}>
                <motion.div
                  className="portfolio-scroll-track"
                  key={activePortfolio}
                  variants={staggerContainer(0.07, 0.03)}
                  initial="hidden"
                  animate="visible"
                >
                  {currentCategory.items.map((item) => (
                    <motion.article
                      key={`${currentCategory.id}-${item.title}`}
                      className="card portfolio-card premium-case-card"
                      variants={staggerItem}
                      whileHover={{ y: -5, transition: { duration: 0.22 } }}
                    >
                      <p className="portfolio-tag">{item.tag}</p>
                      <h4>{item.title}</h4>
                      <p>{item.description}</p>
                      {item.note ? <p className="portfolio-note">{item.note}</p> : null}
                      {item.link ? (
                        <a href={item.link} target="_blank" rel="noreferrer">
                          {item.linkLabel || "View Project"}
                        </a>
                      ) : null}
                    </motion.article>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection className="section alt" id="values-tech" variant="fadeUp">
          <motion.div
            className="container"
            style={{ marginBottom: "16px" }}
            variants={staggerContainer(0.1, 0.05)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
          >
            <motion.p className="eyebrow" variants={staggerItem}>
              Client Testimonials
            </motion.p>
            <motion.h2 variants={staggerItem}>What Clients Say About Wrapify</motion.h2>
            {testimonials.length === 0 ? (
              <motion.p className="section-intro" variants={staggerItem}>
                Add testimonials from the admin panel (sign in at /blog/login → Testimonials).
              </motion.p>
            ) : (
            <motion.div className="testimonial-slider card" variants={staggerItem}>
              <div className="testimonial-stars" aria-label="Five star rating">★★★★★</div>
              <motion.article
                key={`${testimonials[activeTestimonial]?.name}-${activeTestimonial}`}
                className="testimonial-premium-card testimonial-slide-card"
                initial={{ opacity: 0, y: 22, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.45, ease: easeSmooth }}
              >
                <div className="testimonial-head">
                  <img src={testimonials[activeTestimonial].avatar} alt={testimonials[activeTestimonial].name} />
                  <div>
                    <h4>{testimonials[activeTestimonial].name}</h4>
                    <p>{testimonials[activeTestimonial].role}</p>
                  </div>
                </div>
                <p className="testimonial-premium-quote">“{testimonials[activeTestimonial].quote}”</p>
              </motion.article>
              <div className="testimonial-controls">
                <motion.button
                  type="button"
                  aria-label="Previous testimonial"
                  onClick={() => moveTestimonial(-1)}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                >
                  ←
                </motion.button>
                <div className="testimonial-dots">
                  {testimonials.map((item, idx) => (
                    <button
                      key={`${item.name}-${idx}`}
                      type="button"
                      aria-label={`Show testimonial ${idx + 1}`}
                      className={activeTestimonial === idx ? "active" : ""}
                      onClick={() => setActiveTestimonial(idx)}
                    />
                  ))}
                </div>
                <motion.button
                  type="button"
                  aria-label="Next testimonial"
                  onClick={() => moveTestimonial(1)}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                >
                  →
                </motion.button>
              </div>
            </motion.div>
            )}
          </motion.div>

          <div className="container values-shell">
            <motion.div
              className="card values-card"
              variants={staggerContainer(0.1, 0.06)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <motion.p className="eyebrow" variants={staggerItem}>
                Reason behind our success
              </motion.p>
              <motion.h2 variants={staggerItem}>Our Core Values</motion.h2>
              <motion.div className="values-grid" variants={staggerContainer(0.08, 0.05)}>
                <motion.article variants={staggerItem} whileHover={{ y: -3, transition: { duration: 0.2 } }}>
                  <h4>Client-Centric Excellence</h4>
                  <p>Your success stays at the center, with solutions shaped around your priorities and long-term goals.</p>
                </motion.article>
                <motion.article variants={staggerItem} whileHover={{ y: -3, transition: { duration: 0.2 } }}>
                  <h4>Innovative Problem Solving</h4>
                  <p>You get creative, expert problem solving that turns blockers into practical growth opportunities.</p>
                </motion.article>
                <motion.article variants={staggerItem} whileHover={{ y: -3, transition: { duration: 0.2 } }}>
                  <h4>Clear & Effective Communication</h4>
                  <p>You get straightforward communication and full clarity across decisions, progress, and delivery.</p>
                </motion.article>
                <motion.article variants={staggerItem} whileHover={{ y: -3, transition: { duration: 0.2 } }}>
                  <h4>Accountability & Ownership</h4>
                  <p>You get accountable delivery with high standards for quality, ownership, and integrity.</p>
                </motion.article>
              </motion.div>
            </motion.div>
          </div>
        </AnimatedSection>

        <AnimatedSection className="section alt" id="blog" variant="slideInRight">
          <div className="container">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.55, ease: easeSmooth }}
            >
              Blog & Resources
            </motion.h2>
            <motion.div
              className="card-grid two"
              variants={staggerContainer(0.1, 0.05)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.12 }}
            >
              {latestBlogs.length === 0 ? (
                <motion.article className="card" variants={staggerItem}>
                  <h3>Publishing Articles...</h3>
                  <p>Your dynamic SEO blog feed will appear here.</p>
                </motion.article>
              ) : (
                latestBlogs.map((blog) => (
                  <motion.article
                    className="card blog-card"
                    key={blog.id}
                    variants={staggerItem}
                    whileHover={{ y: -6, transition: { duration: 0.22 } }}
                  >
                    {blog.imageUrl ? <img src={blog.imageUrl} alt={blog.title} className="blog-thumb" /> : null}
                    <p className="portfolio-tag">{blog.category}</p>
                    <h3>{blog.title}</h3>
                    <p>{blog.excerpt}</p>
                    <p className="portfolio-note">{blog.publishedAt}</p>
                    <Link href={`/blog/${blog.slug}`}>Read Article</Link>
                  </motion.article>
                ))
              )}
            </motion.div>
            <motion.div
              className="cta-row"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ delay: 0.12, duration: 0.5, ease: easeSmooth }}
            >
              <motion.a href="/blog" className="btn" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                View All Blogs
              </motion.a>
            </motion.div>
          </div>
        </AnimatedSection>

        <AnimatedSection className="section alt" id="contact" variant="fadeUp">
          <div className="container contact-grid">
            <motion.div
              className="contact-panel card"
              variants={staggerContainer(0.09, 0.04)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
            >
              <motion.p className="eyebrow" variants={staggerItem}>
                Contact Us
              </motion.p>
              <motion.h2 variants={staggerItem}>Have a project in mind? Let&apos;s build together.</motion.h2>
              <motion.p className="section-intro" variants={staggerItem}>
                Talk with our senior designers and engineers to turn your idea into a high-impact digital product.
              </motion.p>
              <motion.div className="contact-designer-highlight" variants={staggerItem} whileHover={{ y: -2 }}>
                <img
                  src="https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Product team collaborating from idea to execution"
                />
                <div>
                  <h4>From Idea to Execution</h4>
                  <p>
                    We take you from first concept through scope, design, build, and launch—so your product moves from
                    vision to shipped software with a clear plan and measurable milestones.
                  </p>
                </div>
              </motion.div>
              <motion.div className="contact-chips contact-chips-icons" variants={staggerItem}>
                <motion.a href="mailto:wrapifysolutions@gmail.com" whileHover={{ x: 4 }} whileTap={{ scale: 0.99 }}>
                  <span aria-hidden="true">✉</span>Email: wrapifysolutions@gmail.com
                </motion.a>
                <motion.a href="tel:+923439024736" whileHover={{ x: 4 }} whileTap={{ scale: 0.99 }}>
                  <span aria-hidden="true">☎</span>Phone: +92 343 9024736
                </motion.a>
                <p><span aria-hidden="true">📍</span>Headquarters: G11 Markaz, Islamabad, Pakistan</p>
              </motion.div>
              <motion.div className="contact-hours" aria-label="Business hours" variants={staggerItem}>
                <h4 className="contact-hours-title">
                  <span aria-hidden="true">🕐</span>
                  Business Hours
                </h4>
                <ul className="contact-hours-list">
                  <li><strong>Monday – Friday:</strong> 9:00 AM – 6:00 PM (PKT)</li>
                  <li><strong>Saturday:</strong> 10:00 AM – 4:00 PM (PKT)</li>
                  <li><strong>Sunday:</strong> Available for emergencies</li>
                </ul>
              </motion.div>
            </motion.div>
            <motion.form
              className="contact-form contact-form-enhanced"
              onSubmit={submitContactForm}
              variants={staggerContainer(0.08, 0.04)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.12 }}
            >
              <motion.div className="contact-form-intro" variants={staggerItem}>
                <p className="eyebrow">Get in touch</p>
                <p className="contact-form-lead">
                  Tell us what you need—we&apos;ll route you to the right specialists and reply within one business day.
                </p>
              </motion.div>

              <motion.fieldset className="contact-service-field" variants={staggerItem}>
                <legend>Which services are you looking for?</legend>
                <p className="contact-service-hint">Tap one or more—helps us prepare before we call you back.</p>
                <div className="contact-service-chips" role="group" aria-label="Services of interest">
                  {contactServiceOptions.map((label) => {
                    const selected = contactForm.services.includes(label);
                    return (
                      <motion.button
                        key={label}
                        type="button"
                        className={`contact-service-chip ${selected ? "is-selected" : ""}`}
                        onClick={() => toggleContactService(label)}
                        aria-pressed={selected}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        {selected ? "✓ " : ""}
                        {label}
                      </motion.button>
                    );
                  })}
                </div>
                {contactForm.services.length > 0 ? (
                  <p className="contact-service-summary">
                    Selected: <strong>{contactForm.services.join(", ")}</strong>
                  </p>
                ) : null}
                <label className="contact-service-other">
                  Other or extra detail (optional)
                  <input
                    type="text"
                    placeholder="e.g. MVP in 8 weeks, HIPAA, Arabic + English…"
                    value={contactForm.serviceOther}
                    onChange={(e) => setContactForm((prev) => ({ ...prev, serviceOther: e.target.value }))}
                    maxLength={200}
                  />
                </label>
              </motion.fieldset>

              <motion.label className="contact-field" variants={staggerItem}>
                <span className="contact-field-label">Name</span>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm((prev) => ({ ...prev, name: e.target.value }))}
                  autoComplete="name"
                  required
                />
              </motion.label>
              <motion.label className="contact-field" variants={staggerItem}>
                <span className="contact-field-label">Email</span>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))}
                  autoComplete="email"
                  required
                />
              </motion.label>
              <motion.label className="contact-field" variants={staggerItem}>
                <span className="contact-field-label">Message</span>
                <textarea
                  placeholder="Project goals, timeline, budget range, links…"
                  rows="5"
                  value={contactForm.message}
                  onChange={(e) => setContactForm((prev) => ({ ...prev, message: e.target.value }))}
                  required
                />
              </motion.label>
              <motion.button
                type="submit"
                className="btn contact-submit-btn"
                disabled={submittingContact}
                variants={staggerItem}
                whileHover={submittingContact ? undefined : { scale: 1.02 }}
                whileTap={submittingContact ? undefined : { scale: 0.98 }}
              >
                {submittingContact ? "Sending..." : "Send message"}
              </motion.button>
            </motion.form>
          </div>
        </AnimatedSection>

        <AnimatedSection className="section faq-section" id="faq" variant="scaleIn">
          <div className="container">
            <motion.div
              variants={staggerContainer(0.1, 0.05)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.35 }}
            >
              <motion.p className="eyebrow" variants={staggerItem}>
                FAQs
              </motion.p>
              <motion.h2 variants={staggerItem}>Frequently Asked Questions</motion.h2>
              <motion.p className="section-intro" variants={staggerItem}>
                Answers about how we build web and mobile products, AI and automation, pricing and ownership, and working
                with teams across the USA and MENA—after you reach out, we tailor detail to your specific project.
              </motion.p>
            </motion.div>
            <motion.div
              className="faq-list"
              variants={staggerContainer(0.08, 0.04)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.08 }}
            >
              {faqItems.map((item) => (
                <motion.details
                  key={item.question}
                  className="faq-item card"
                  variants={staggerItem}
                  whileTap={{ scale: 0.992 }}
                >
                  <summary>{item.question}</summary>
                  <p className="faq-answer">{item.answer}</p>
                </motion.details>
              ))}
            </motion.div>
          </div>
        </AnimatedSection>
      </motion.main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <AnimatePresence>
        {contactNotice.open ? (
          <motion.div
            className={`contact-toast ${contactNotice.type}`}
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 48, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.4, ease: easeSmooth }}
          >
            {contactNotice.text}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
