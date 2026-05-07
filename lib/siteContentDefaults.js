/** Default homepage marketing content (editable via /admin after login at /blog/login). */
export const DEFAULT_SITE_CONTENT = {
  testimonials: [
    {
      name: "Tehreem",
      role: "Product Owner, Marketplace App",
      quote:
        "Wrapify delivered our mobile app similar to Dubizzle with exceptional quality. The UX is clean, the performance is fast, and the team handled every requirement with complete professionalism.",
      avatar: "https://i.pravatar.cc/160?img=44"
    },
    {
      name: "Abdul Aziz",
      role: "Operations Director, CRM & Voice AI Program",
      quote:
        "Their CRM system integrated with Voice AI agents transformed our operations. Lead handling is faster, follow-ups are automated, and overall team productivity has improved significantly.",
      avatar: "https://i.pravatar.cc/160?img=12"
    },
    {
      name: "Ayesha Malik",
      role: "Founder, Gulf Commerce Studio",
      quote:
        "Wrapify delivered exactly what we needed for our e-commerce operations. Their communication, speed, and quality were outstanding from planning to launch.",
      avatar: "https://i.pravatar.cc/160?img=32"
    },
    {
      name: "Omar Farooq",
      role: "Head of Product, Riyadh Digital Ventures",
      quote:
        "The team brought deep technical expertise and strong product thinking. Our platform performance improved dramatically, and the user feedback has been excellent.",
      avatar: "https://i.pravatar.cc/160?img=18"
    },
    {
      name: "Sara Williams",
      role: "Marketing Lead, Sydney Growth Hub",
      quote:
        "From design to deployment, the process was smooth and highly professional. Their conversion-focused approach helped us generate significantly better campaign results.",
      avatar: "https://i.pravatar.cc/160?img=25"
    },
    {
      name: "Hassan Rehman",
      role: "CTO, Doha Tech Labs",
      quote:
        "Wrapify’s engineering quality is top-tier. They handled complex integrations and delivered a secure, scalable system that our team could rely on immediately.",
      avatar: "https://i.pravatar.cc/160?img=68"
    },
    {
      name: "Liam Cooper",
      role: "Director, Melbourne Retail Systems",
      quote:
        "Excellent execution and ownership throughout the project. Their ability to turn requirements into practical, polished solutions made them a true partner for our business.",
      avatar: "https://i.pravatar.cc/160?img=53"
    }
  ],
  partners: [
    { name: "QuikSuccess International FZ-LLC", logo: "/partner-quik-success.png" },
    { name: "Pyncode", logo: "/partner-pyncode.png" },
    { name: "Aussietakeoff", logo: "/partner-aussie-takeoff.png" },
    { name: "Taukmi Resutrant Dubai", logo: "/partner-taukmi-dubai.png" },
    { name: "Sacha Resturant", logo: "/partner-sacha-restaurant.png" }
  ],
  services: [
    {
      id: "service-web",
      title: "Web Development",
      description: "High-performance websites and web apps engineered for speed, security, and growth.",
      bullets: [
        "Responsive websites, PWAs, and e-commerce storefronts",
        "CMS and custom admin dashboards",
        "Technical SEO foundations and Core Web Vitals optimization"
      ],
      note: "Ideal for brands that want stronger digital presence and conversion-ready platforms."
    },
    {
      id: "service-app",
      title: "App Development",
      description: "Scalable mobile products built for delightful user experience and robust business logic.",
      bullets: [
        "Native iOS and Android app development",
        "Cross-platform apps with shared architecture",
        "Launch, optimization, and long-term maintenance"
      ],
      note: "Ideal for startups and enterprises launching reliable apps across markets."
    },
    {
      id: "service-ai",
      title: "AI Agents & Automation",
      description: "AI systems that automate repetitive workflows and drive faster, smarter decisions.",
      bullets: [
        "Process automation with intelligent AI agents",
        "Predictive insights and decision support systems",
        "Custom AI integrations aligned with business goals"
      ],
      note: "Ideal for teams aiming to reduce operational overhead and scale efficiently."
    },
    {
      id: "service-chatbot",
      title: "Chatbot Development",
      description: "Conversational AI experiences that provide instant support and increase lead quality.",
      bullets: [
        "Customer support chatbots and virtual assistants",
        "Multilingual flows and NLP-powered conversation design",
        "Website, WhatsApp, and social channel integrations"
      ],
      note: "Ideal for brands that want 24/7 engagement and faster response cycles."
    },
    {
      id: "service-uiux",
      title: "UI/UX Design",
      description: "User-first product design crafted to improve usability, trust, and conversion outcomes.",
      bullets: [
        "User journey mapping and wireframing",
        "Modern UI systems with interactive prototypes",
        "Accessibility and usability validation"
      ],
      note: "Ideal for businesses that need polished, intuitive digital experiences."
    },
    {
      id: "service-dt",
      title: "Digital Transformation",
      description: "End-to-end modernization of operations, platforms, and workflows for future-ready growth.",
      bullets: [
        "Legacy modernization and cloud migration",
        "Workflow optimization and system integration",
        "Security, scalability, and compliance architecture"
      ],
      note: "Ideal for organizations scaling across regions with evolving technology needs."
    },
    {
      id: "service-staff",
      title: "Staff Augmentation",
      description:
        "On-demand technical talent integrated into your delivery process to accelerate execution without long hiring cycles.",
      bullets: [
        "Pre-vetted developers, designers, QA, and AI specialists",
        "Flexible engagement from short sprint support to long-term scaling",
        "Timezone-aligned collaboration for USA and MENA teams"
      ],
      note: "Ideal for companies needing immediate capacity, speed, and delivery continuity."
    },
    {
      id: "service-remote",
      title: "Remote Team Creation",
      description:
        "Build dedicated remote product teams with proven workflows, clear ownership, and consistent output quality.",
      bullets: [
        "Dedicated pods for web, app, AI, and product growth",
        "Structured onboarding, SOPs, and delivery governance",
        "Transparent reporting, velocity tracking, and milestone planning"
      ],
      note: "Ideal for businesses building long-term offshore/nearshore technology teams."
    }
  ],
  portfolioCategories: [
    {
      id: "cat-apps",
      label: "Mobile Apps",
      title: "App Development Use Cases",
      items: [
        {
          tag: "App Development",
          title: "HandyQ - Productivity Mobile Application",
          description:
            "Task and productivity app for iOS and Android with collaboration tools and automation workflows.",
          note: "Production-ready quality"
        },
        {
          tag: "App Development",
          title: "Sehat ke Baat - Health & Wellness App",
          description:
            "Wellness application for health tracking, daily habits, and user-centric experience for better outcomes.",
          note: "Production-ready quality"
        },
        {
          tag: "App Development",
          title: "Quick Qari - Learning & Recitation App",
          description: "Educational app with audio guidance, progress tracking, and interactive modules for all skill levels.",
          note: "Production-ready quality"
        },
        {
          tag: "In Development",
          title: "Moonlight Meditation App",
          description:
            "Mindfulness and guided meditation product focused on relaxation, focus, and daily wellness routines.",
          link: "https://www.figma.com/design/QtULhIADkJZzF3Qh8zdQxu/Moonlight-Manifestation?m=auto&fuid=1248386834489416722",
          linkLabel: "View Design Prototype"
        }
      ]
    },
    {
      id: "cat-web",
      label: "Web Platforms",
      title: "Web Platforms & Brand Websites",
      items: [
        {
          tag: "E-Commerce",
          title: "Fashion Giant",
          description: "Full-scale fashion store with product management, secure checkout, and payment integrations.",
          link: "https://fashiongiant.pk/shop/",
          linkLabel: "Visit Website"
        },
        {
          tag: "Web Development",
          title: "Aussie Takeoff",
          description: "Corporate website focused on lead generation, brand trust, and conversion-driven UX.",
          link: "https://www.aussietakeoff.com",
          linkLabel: "Visit Website"
        },
        {
          tag: "Agency Website",
          title: "Wrapify Solutions",
          description: "Service-led agency site with clear positioning, case studies, and conversion funnels.",
          link: "https://www.wrapifysolutions.com",
          linkLabel: "Visit Website"
        },
        {
          tag: "Marketing Website",
          title: "Maggic Land",
          description: "Modern visual storytelling website with optimized UX and strong product communication.",
          link: "https://maggic-land.vercel.app",
          linkLabel: "Visit Website"
        }
      ]
    },
    {
      id: "cat-saas",
      label: "CRM, SaaS & AI",
      title: "CRM, SaaS & AI Platforms",
      items: [
        {
          tag: "In Development",
          title: "Pyncode.ai",
          description:
            "Advanced AI platform for intelligent automation and scalable AI systems for modern business operations.",
          link: "https://www.figma.com/design/KPwdNoIijhO2tMuD3cGQ9X/landing-page-Pyncode?node-id=0-1&p=f&t=VFRassNYk11OQx05-0",
          linkLabel: "Landing Prototype"
        },
        {
          tag: "Legal Tech",
          title: "Legal Alatefaq",
          description:
            "Web and mobile ecosystem streamlining legal operations, client communication, and workflow digitization.",
          link: "https://www.figma.com/design/DZHoKJMBiBGsJ2ICDRRQb2/App-Website?node-id=0-1&p=f&t=23B55UNcSgZPvkcm-0",
          linkLabel: "View Prototype"
        },
        {
          tag: "AI Automation",
          title: "AI Waiter Agent",
          description:
            "Restaurant AI assistant automating ordering flow, improving service speed, and customer experience.",
          note: "Operational AI use case"
        },
        {
          tag: "SaaS Platform",
          title: "GigShark",
          description:
            "Scalable business-freelancer marketplace with performance-first architecture and smooth workflows.",
          link: "https://www.gigshark.io",
          linkLabel: "Visit Website"
        }
      ]
    },
    {
      id: "cat-enterprise",
      label: "Enterprise Systems",
      title: "Enterprise & Custom Systems",
      items: [
        {
          tag: "Enterprise SaaS",
          title: "Global Visa Processing Platform",
          description:
            "Multi-role workflow platform with secure public portal plus user, agent, and admin dashboards.",
          link: "https://global-visa-processing-platform.vercel.app/",
          linkLabel: "Public Platform"
        },
        {
          tag: "Dashboard",
          title: "THOVT Dashboard",
          description: "Internal operations dashboard for data visualization, administrative control, and monitoring.",
          link: "https://thovt-dashboard.vercel.app",
          linkLabel: "View Dashboard"
        },
        {
          tag: "Custom Platform",
          title: "Mansas Moov Technologies",
          description: "Custom-built web platform with scalable frontend architecture and performance-focused design.",
          link: "https://mansasmoov-technologies.vercel.app/",
          linkLabel: "Visit Website"
        }
      ]
    },
    {
      id: "cat-web3",
      label: "Web3",
      title: "Web3 / Blockchain",
      items: [
        {
          tag: "Web3 Platform",
          title: "Chrysus Presale Platform",
          description:
            "Token presale application with wallet integration, secure purchase flow, and live transaction handling.",
          link: "https://chrysus-presale.vercel.app",
          linkLabel: "Visit Platform"
        }
      ]
    },
    {
      id: "cat-live-apps",
      label: "Published Apps",
      title: "Published Mobile Applications",
      items: [
        {
          tag: "Android & iOS",
          title: "TaskEasy Contractors",
          description: "Contractor operations app on Google Play and Apple App Store.",
          link: "https://play.google.com/store/apps/details?id=com.taskeasy.mobile.beta&hl=en",
          linkLabel: "Google Play"
        },
        {
          tag: "Android & iOS",
          title: "Keelo - Strength & HIIT",
          description: "Fitness coaching app available across both major mobile platforms.",
          link: "https://apps.apple.com/us/app/keelo-strength-hiit-workouts/id1004824537",
          linkLabel: "Apple App Store"
        },
        {
          tag: "Android & iOS",
          title: "GeoWay / 4 Drivers / Fleet Apps",
          description: "Mobility and fleet-focused applications with real-world production deployment.",
          link: "https://apps.apple.com/us/app/geoway/id6753766125",
          linkLabel: "View Example"
        }
      ]
    }
  ]
};
