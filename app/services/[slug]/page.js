import Link from "next/link";
import { notFound } from "next/navigation";
import { getSiteUrl } from "../../../lib/siteUrl";

const SERVICE_PAGES = {
  "mobile-app-development": {
    title: "Mobile App Development in Dubai, Qatar & MENA",
    description:
      "Custom iOS and Android app development for startups and enterprises in Dubai, Qatar, and MENA. Build scalable mobile products with strong UX, reliable performance, and measurable growth.",
    heading: "Mobile App Development Services",
    heroImage:
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1800&q=80",
    intro:
      "Wrapify builds mobile apps for iOS and Android that help businesses launch faster, improve retention, and scale reliably across Dubai, Qatar, and the wider MENA region.",
    points: [
      "Product strategy, UX, and technical planning before code",
      "Native and Flutter app development for high-performance delivery",
      "Backend APIs, admin panels, analytics, and release support",
      "Ongoing optimization for retention, stability, and conversion"
    ],
    outcomes: [
      "Faster release cycles with clear sprint milestones",
      "Reduced churn through better UX and onboarding flows",
      "Stable app performance under real production load"
    ],
    process: [
      "Discovery and product roadmap",
      "UX/UI and technical architecture",
      "Agile development and QA",
      "Launch support and growth optimization"
    ],
    faqs: [
      {
        q: "How much does mobile app development cost in UAE or Qatar?",
        a: "Cost depends on scope, integrations, platforms, and timelines. Most projects start with discovery and a scoped roadmap so you can prioritize MVP features and control budget risk."
      },
      {
        q: "Do you build both iOS and Android apps?",
        a: "Yes. We build native and cross-platform mobile apps based on your product goals, team structure, and long-term maintenance plan."
      },
      {
        q: "Can you support app launch and post-launch updates?",
        a: "Yes. We help with testing, release readiness, app store publishing, monitoring, and iteration after launch."
      }
    ]
  },
  "voice-ai-agent-development": {
    title: "Voice AI Agent & Calling Agent Development",
    description:
      "Build production-ready voice AI agents and calling agents for support, lead qualification, and operations. Integrate telephony, CRM workflows, and guardrails for real business use.",
    heading: "Calling Agent & Voice AI Development",
    heroImage:
      "https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&w=1800&q=80",
    intro:
      "Wrapify develops voice AI agents and calling agents that automate conversations, qualify leads, and improve response times without sacrificing customer experience.",
    points: [
      "Inbound and outbound AI calling workflows for support and sales",
      "Integration with CRM, calendar booking, and ticketing systems",
      "Prompt design, safety controls, and escalation to human teams",
      "Analytics dashboards for conversion, call quality, and ROI tracking"
    ],
    outcomes: [
      "Higher call answer-to-qualified-lead rates",
      "Lower manual workload for support and sales teams",
      "Consistent customer experience across inbound/outbound calls"
    ],
    process: [
      "Use-case mapping and script design",
      "LLM prompt engineering and guardrails",
      "Telephony + CRM integration",
      "Pilot rollout, monitoring, and scaling"
    ],
    faqs: [
      {
        q: "What is a voice AI agent for business?",
        a: "A voice AI agent is an automated calling assistant that can handle repetitive conversations such as qualification, support triage, follow-ups, and appointment booking."
      },
      {
        q: "Can your AI calling agent connect to our CRM?",
        a: "Yes. We can connect voice agents to CRMs, forms, sheets, and internal APIs so outcomes are logged and routed automatically."
      },
      {
        q: "How do you handle compliance and safety?",
        a: "We add guardrails, logging, escalation logic, and role-based controls to keep calls aligned with your policy, legal constraints, and brand tone."
      }
    ]
  },
  "web-development": {
    title: "Web Development Services for UAE, Qatar & MENA",
    description:
      "High-performance web development for marketing sites, web apps, and SaaS platforms. Improve SEO, conversion, and reliability with modern architecture and measurable delivery.",
    heading: "Web Development Services",
    heroImage:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1800&q=80",
    intro:
      "Wrapify delivers modern web development for companies that need faster websites, scalable web apps, and stronger conversion performance in competitive markets.",
    points: [
      "SEO-ready architecture with strong Core Web Vitals foundations",
      "Custom web apps and SaaS platforms with secure backend systems",
      "Conversion-focused UI/UX and analytics instrumentation",
      "Deployment, monitoring, and long-term maintenance support"
    ],
    outcomes: [
      "Improved technical SEO and crawl readiness",
      "Better conversion with conversion-focused UX",
      "Scalable platform architecture for future features"
    ],
    process: [
      "Discovery and information architecture",
      "Design system and front-end implementation",
      "Backend integrations and QA",
      "Production deployment and optimization"
    ],
    faqs: [
      {
        q: "Do you build custom websites or templates?",
        a: "We primarily build custom websites and web apps aligned with business goals, brand requirements, and performance targets."
      },
      {
        q: "Can you improve SEO and conversion on existing websites?",
        a: "Yes. We handle technical SEO fixes, UX improvements, and performance optimization to improve traffic quality and lead generation."
      },
      {
        q: "Do you provide ongoing support after launch?",
        a: "Yes. We offer maintenance, feature iteration, and monitoring so your platform remains stable, secure, and growth-ready."
      }
    ]
  },
  "ai-agents-automation": {
    title: "AI Agents & Automation Services",
    description:
      "Design and deploy AI agents and automation workflows to reduce repetitive work, improve decision speed, and scale operations across UAE, Qatar, and MENA teams.",
    heading: "AI Agents & Automation Services",
    heroImage:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1800&q=80",
    intro:
      "Wrapify helps teams automate operations with production-ready AI agents, orchestrated workflows, and secure integrations across your existing business stack.",
    points: [
      "Process automation with intelligent AI agents",
      "Predictive insights and decision support systems",
      "Custom AI integrations aligned with business goals",
      "Monitoring and optimization for measurable ROI"
    ],
    outcomes: [
      "Reduced manual operational workload",
      "Faster response and decision cycles",
      "Improved consistency in high-volume workflows"
    ],
    process: [
      "Workflow mapping and opportunity analysis",
      "Agent design and tool integration",
      "Pilot rollout with safety controls",
      "Scale-up and continuous optimization"
    ],
    faqs: [
      {
        q: "What processes can AI automation handle?",
        a: "Common use cases include lead qualification, support routing, reporting, data enrichment, and repetitive operations that require structured logic."
      },
      {
        q: "Can AI agents integrate with our existing tools?",
        a: "Yes. We integrate with your CRM, internal systems, APIs, and communication tools to fit your current operations."
      },
      {
        q: "How do you measure AI automation success?",
        a: "We track baseline metrics and post-deployment impact such as time saved, accuracy, conversion uplift, and cost reduction."
      }
    ]
  },
  "chatbot-development": {
    title: "Chatbot Development Services",
    description:
      "Build multilingual customer support and lead-generation chatbots for websites, WhatsApp, and business channels with seamless backend integrations.",
    heading: "Chatbot Development Services",
    heroImage:
      "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=1800&q=80",
    intro:
      "Wrapify creates conversational chatbot experiences that improve response speed, qualify leads, and support users 24/7 across digital touchpoints.",
    points: [
      "Customer support chatbots and virtual assistants",
      "Multilingual flows and NLP-driven conversation design",
      "Website, WhatsApp, and social channel integrations",
      "Escalation logic to human teams when needed"
    ],
    outcomes: [
      "Higher response coverage without extra headcount",
      "Better lead quality through automated qualification",
      "Consistent customer support experiences"
    ],
    process: [
      "Conversation flow and intent mapping",
      "Bot design, integration, and testing",
      "Deployment across selected channels",
      "Ongoing optimization with conversation analytics"
    ],
    faqs: [
      {
        q: "Can the chatbot support both English and Arabic?",
        a: "Yes. We can implement bilingual or multilingual chatbot flows based on your audience and channel requirements."
      },
      {
        q: "Will the bot connect to our CRM or ticket system?",
        a: "Yes. We can connect chatbots to your CRM, ticketing tools, and internal APIs for smooth handoffs and tracking."
      },
      {
        q: "Can users talk to a human when needed?",
        a: "Yes. We add escalation paths so complex requests move to your support or sales team with full context."
      }
    ]
  },
  "ui-ux-design": {
    title: "UI/UX Design Services",
    description:
      "User-first UI/UX design for web and mobile products with conversion-focused layouts, stronger trust signals, and usable interactions across markets.",
    heading: "UI/UX Design Services",
    heroImage:
      "https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&w=1800&q=80",
    intro:
      "Wrapify designs product interfaces that are clear, conversion-friendly, and aligned with business goals from first click to completed action.",
    points: [
      "User journey mapping and wireframing",
      "Modern UI systems with interactive prototypes",
      "Accessibility and usability validation",
      "Design handoff with implementation-ready specs"
    ],
    outcomes: [
      "Higher conversion and engagement rates",
      "Reduced friction in key user flows",
      "Consistent product experience across platforms"
    ],
    process: [
      "Research and journey mapping",
      "Wireframes and interaction models",
      "Visual design and prototype validation",
      "Developer handoff and QA support"
    ],
    faqs: [
      {
        q: "Do you only design, or can you also build?",
        a: "We can do both. Our design and engineering teams work together so what is designed is practical to implement."
      },
      {
        q: "Can you redesign an existing app or website?",
        a: "Yes. We audit your current experience and redesign critical flows to improve usability, trust, and conversion."
      },
      {
        q: "What deliverables do we get?",
        a: "Typical deliverables include wireframes, UI screens, interaction prototypes, and handoff documentation for development."
      }
    ]
  },
  "digital-transformation": {
    title: "Digital Transformation Services",
    description:
      "Modernize legacy systems, optimize workflows, and build scalable digital infrastructure for long-term growth across enterprise and growth-stage teams.",
    heading: "Digital Transformation Services",
    heroImage:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1800&q=80",
    intro:
      "Wrapify supports digital transformation by modernizing technology stacks, integrating operations, and building resilient systems for scale.",
    points: [
      "Legacy modernization and cloud migration",
      "Workflow optimization and system integration",
      "Security, scalability, and compliance architecture",
      "Roadmaps for phased transformation with measurable outcomes"
    ],
    outcomes: [
      "Improved operational efficiency and visibility",
      "Lower technical debt and maintenance risk",
      "Faster execution for new business initiatives"
    ],
    process: [
      "Assessment of systems and bottlenecks",
      "Transformation roadmap and prioritization",
      "Implementation in controlled phases",
      "Monitoring, training, and continuous improvements"
    ],
    faqs: [
      {
        q: "How do you approach transformation without disrupting operations?",
        a: "We use phased rollouts and controlled migrations so core operations continue while improvements are introduced safely."
      },
      {
        q: "Can you work with our current tools and vendor stack?",
        a: "Yes. We assess your current stack and integrate where possible before recommending replacements."
      },
      {
        q: "How long does digital transformation usually take?",
        a: "Duration depends on scope and complexity, but we break work into milestones so value is delivered incrementally."
      }
    ]
  },
  "staff-augmentation": {
    title: "Staff Augmentation Services",
    description:
      "Scale your delivery with pre-vetted engineers, designers, QA, and AI specialists who integrate into your team and workflows quickly.",
    heading: "Staff Augmentation Services",
    heroImage:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1800&q=80",
    intro:
      "Wrapify provides on-demand technical talent to help your team deliver faster without long hiring cycles or operational friction.",
    points: [
      "Pre-vetted developers, designers, QA, and AI specialists",
      "Flexible engagement from short sprint support to long-term scaling",
      "Timezone-aligned collaboration for USA and MENA teams",
      "Clear reporting and delivery accountability"
    ],
    outcomes: [
      "Faster feature velocity with low onboarding overhead",
      "Access to specialized skills on demand",
      "Continuity in delivery during growth phases"
    ],
    process: [
      "Role and skill mapping",
      "Shortlisting and technical validation",
      "Onboarding into your workflow",
      "Ongoing performance and delivery tracking"
    ],
    faqs: [
      {
        q: "How quickly can we onboard augmented team members?",
        a: "Timelines vary by role, but we prioritize fast onboarding with clear ownership so contributors can become productive quickly."
      },
      {
        q: "Can augmented staff work in our timezone and tools?",
        a: "Yes. We align around your preferred tools, rituals, and overlapping working hours."
      },
      {
        q: "Is this suitable for short-term or long-term needs?",
        a: "Both. We support short sprint augmentation and long-term embedded team scaling."
      }
    ]
  },
  "remote-team-creation": {
    title: "Remote Team Creation Services",
    description:
      "Build dedicated remote product and engineering teams with proven workflows, governance, and scalable collaboration models.",
    heading: "Remote Team Creation Services",
    heroImage:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1800&q=80",
    intro:
      "Wrapify helps businesses create dedicated remote teams that deliver consistently with clear ownership, structured processes, and transparent execution.",
    points: [
      "Dedicated pods for web, app, AI, and product growth",
      "Structured onboarding, SOPs, and delivery governance",
      "Transparent reporting, velocity tracking, and milestone planning",
      "Scalable model for long-term distributed execution"
    ],
    outcomes: [
      "Reliable long-term delivery capacity",
      "Better predictability through process standardization",
      "Higher output quality from focused product pods"
    ],
    process: [
      "Team design and capability planning",
      "Hiring/onboarding framework setup",
      "Delivery process and governance rollout",
      "Performance optimization and scale-up"
    ],
    faqs: [
      {
        q: "How is remote team creation different from staff augmentation?",
        a: "Staff augmentation adds individual contributors; remote team creation builds structured pods with ownership, processes, and delivery governance."
      },
      {
        q: "Can you help with delivery workflows and SOPs?",
        a: "Yes. We establish workflow standards, reporting formats, and operating procedures for consistent outcomes."
      },
      {
        q: "Do remote teams work for enterprise and startup contexts?",
        a: "Yes. We tailor team structure and governance to your stage, product complexity, and growth targets."
      }
    ]
  }
};

export function generateStaticParams() {
  return Object.keys(SERVICE_PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = SERVICE_PAGES[slug];
  if (!page) return {};
  const base = getSiteUrl();
  const canonical = `${base}/services/${slug}`;
  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical,
      languages: {
        "en-ae": canonical,
        "en-qa": canonical,
        "x-default": canonical
      }
    },
    openGraph: {
      type: "website",
      title: page.title,
      description: page.description,
      url: canonical
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description
    }
  };
}

export default async function ServicePage({ params }) {
  const { slug } = await params;
  const page = SERVICE_PAGES[slug];
  if (!page) notFound();
  const base = getSiteUrl();
  const canonical = `${base}/services/${slug}`;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a }
    }))
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: page.heading,
    name: page.heading,
    description: page.description,
    areaServed: ["Dubai", "Qatar", "UAE", "MENA", "Saudi Arabia"],
    provider: {
      "@type": "Organization",
      name: "Wrapify Solutions",
      url: base
    },
    url: canonical
  };

  return (
    <main className="section">
      <div className="container service-detail-shell">
        <p className="portfolio-note service-detail-back">
          <Link href="/">← Back to homepage</Link>
        </p>
        <section className="service-detail-hero card">
          <div className="service-detail-hero__media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={page.heroImage} alt={page.heading} />
          </div>
          <div className="service-detail-hero__content">
            <h1>{page.heading}</h1>
            <p className="section-intro">{page.intro}</p>
            <div className="cta-row">
              <a className="btn" href="https://calendly.com/hamzaejaz0771/new-meeting" target="_blank" rel="noreferrer">
                Book a consultation
              </a>
              <Link className="btn btn-outline" href="/#contact">
                Contact form
              </Link>
            </div>
          </div>
        </section>

        <section className="card service-detail-block">
          <h2>What you get</h2>
          <ul className="clean-list service-detail-list">
            {page.points.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="service-detail-grid">
          <article className="card">
            <h2>Expected outcomes</h2>
            <ul className="clean-list service-detail-list">
              {page.outcomes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="card">
            <h2>Delivery process</h2>
            <ol className="service-detail-steps">
              {page.process.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </article>
        </section>

        <section className="card service-detail-block">
          <h2>FAQs</h2>
          <div className="faq-list service-detail-faq">
            {page.faqs.map((item) => (
              <details key={item.q} className="faq-item card">
                <summary>{item.q}</summary>
                <p className="faq-answer">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="card service-detail-block service-detail-cta">
          <h2>Start your project</h2>
          <p>
            Tell us your timeline, budget range, and goals. You can email{" "}
            <a href="mailto:wrapifysolutions@gmail.com">wrapifysolutions@gmail.com</a> or book a discovery call.
          </p>
          <p className="cta-row">
            <a className="btn" href="https://calendly.com/hamzaejaz0771/new-meeting" target="_blank" rel="noreferrer">
              Book a consultation
            </a>
            <Link className="btn btn-outline" href="/#contact">
              Contact form
            </Link>
          </p>
        </section>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </main>
  );
}

