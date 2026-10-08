/*
 * home.js — Home page content blocks (the "home_sections" table).
 * Everything the landing page renders beyond global SITE data.
 */
import { getProject, isForSale } from "./projects.js";

/* Hero proof counters */
export const PROOF = [
  { count: 120, suffix: "+", label: "Projects shipped" },
  { count: 40, suffix: "+", label: "Happy clients" },
  { value: "24h", label: "Avg. reply" }
];

/* Hero footer meta */
export const HERO_META = [
  { icon: "place", text: "Available Worldwide" },
  { icon: "schedule", text: "Mon – Sat, 9am – 6pm" }
];

/* Rotating services marquee */
export const MARQUEE = [
  { icon: "palette", text: "Brand Identity" },
  { icon: "code", text: "Web Development" },
  { icon: "design_services", text: "UI/UX Design" },
  { icon: "movie", text: "Motion Graphics" },
  { icon: "campaign", text: "Art Direction" },
  { icon: "storefront", text: "Digital Products" }
];

/* About-section capability rows */
export const ABOUT_ROWS = [
  {
    icon: "draw",
    title: "I design the identity",
    text: "Logos, type systems, colour, packaging — built as a set of rules so it still looks right when you use it without me."
  },
  {
    icon: "terminal",
    title: "I build the thing",
    text: "Hand-coded, fast, accessible front-ends. No page-builder bloat, no mystery plugins holding your site hostage."
  },
  {
    icon: "storefront",
    title: "I sell the leftovers",
    text: "Systems and templates I built for clients get cleaned up and released here — often cheaper than commissioning from scratch."
  }
];

/* About-section stat counters */
export const STATS = [
  { count: 120, sup: "+", label: "Projects delivered across branding, web and product" },
  { count: 12, sup: "yrs", label: "Designing and shipping for brands worldwide" },
  { count: 98, sup: "%", label: "Clients who come back or refer someone" },
  { count: 24, sup: "h", label: "Typical first reply, every single message" }
];

/* Services bento — feature card (Web Development) */
export const BENTO_FEATURE = {
  icon: "code",
  title: "Web Development",
  desc: "Hand-coded marketing sites, web apps and dashboards. Semantic HTML, real accessibility, no page-builder bloat and no mystery plugin holding your content hostage. Fast on a bad connection, which is most connections.",
  chips: ["HTML5", "CSS3", "JavaScript", "React", "Node.js", "PHP / MySQL", "REST APIs", "Accessibility"],
  time: "1–3 weeks",
  link: { to: "/service", label: "See what's included" }
};

/* Services bento — the four standard cards (linked to service pages) */
export const BENTO_CARDS = [
  {
    icon: "branding_watermark",
    title: "Brand Identity",
    desc: "Logo, type, colour and a real guideline document — built as rules so it still looks right when you use it without me.",
    time: "2–4 weeks",
    to: "/service"
  },
  {
    icon: "palette",
    title: "Graphic Design",
    desc: "Posters, social packs, packaging, pitch decks and print — the everyday artwork that carries the brand.",
    time: "3–7 days",
    to: "/service"
  },
  {
    icon: "devices",
    title: "UI/UX Design",
    desc: "Research, wireframes, prototypes and design systems. You click through it before a line of code exists.",
    time: "1–4 weeks",
    to: "/service"
  },
  {
    icon: "animation",
    title: "Motion Graphics",
    desc: "Logo stings, Lottie files, UI transitions and animated social content that load light.",
    time: "1–3 weeks",
    to: "/service"
  }
];

/* Services bento — the strip card */
export const BENTO_STRIPS = [
  { icon: "campaign", title: "Art Direction", text: "Shoots, styling and the creative idea behind the work" },
  { icon: "inventory_2", title: "Digital Products", text: "UI kits, template systems and design tokens" },
  { icon: "build", title: "Rescue Jobs", text: "Slow, broken or half-finished builds brought back to life" }
];

/* Process steps */
export const PROCESS = [
  {
    num: "01",
    title: "Discover",
    text: "We talk about the goal, the audience and the deadline. I research your competitors and look for the thing they're all doing the same.",
    gets: "Scope + fixed quote"
  },
  {
    num: "02",
    title: "Design",
    text: "Wireframes first, then the visual direction. Two rounds of revisions are included and I show you the thinking, not just the pretty picture.",
    gets: "Clickable prototype"
  },
  {
    num: "03",
    title: "Build",
    text: "I write the code, test it on real phones and real browsers, and check it works for keyboard and screen-reader users too.",
    gets: "Staging link to review"
  },
  {
    num: "04",
    title: "Launch & hand over",
    text: "Deploy, walk you through everything, and hand over editable source plus a written guide. Thirty days of aftercare is included, no retainer required.",
    gets: "Files you actually own"
  }
];

/* Process promises */
export const PROMISES = [
  {
    icon: "edit_note",
    title: "Fixed quote first",
    text: "You get a number before you commit to anything. It doesn't move unless you change the scope."
  },
  {
    icon: "visibility",
    title: "Work in the open",
    text: "A staging link from day three. No black boxes, no \"trust me, it's nearly done\"."
  },
  {
    icon: "verified_user",
    title: "You own everything",
    text: "Source files, editable artwork and logins are yours on the final invoice. No hostage situations."
  }
];

/* Studio photo strip */
export const STUDIO_SHOTS = [
  {
    src: "/assets/imgs/photo/me on laptop.jpg",
    alt: "Abubakar working on a client project at his desk",
    badge: { icon: "schedule", text: "Shipping week" },
    title: "The desk",
    meta: "Where the work happens"
  },
  {
    src: "/assets/imgs/photo/me 1.jpg",
    alt: "Abubakar sketching brand routes before designing",
    badge: { icon: "draw", text: "Sketch stage" },
    title: "Sketch stage",
    meta: "Routes before pixels"
  },
  {
    src: "/assets/imgs/project/dashboard/cover.jpg",
    alt: "Dark mode analytics dashboard interface",
    badge: { icon: "dark_mode", text: "UI kit" },
    title: "Dark mode UI",
    meta: "Dashboard UI kit"
  },
  {
    src: "/assets/imgs/photo/me 2.png",
    alt: "Abubakar on a weekly client video call",
    badge: { icon: "videocam", text: "Weekly call" },
    title: "Client calls",
    meta: "Weekly check-ins"
  },
  {
    src: "/assets/imgs/project/greenleaf/cover.jpg",
    alt: "Greenleaf sustainable brand identity",
    badge: { icon: "eco", text: "Client work" },
    title: "Greenleaf",
    meta: "Sustainable identity"
  }
];

/* Personal journey timeline */
export const STORY = [
  {
    year: "2013",
    yearIcon: "calendar_today",
    title: "First paid logo",
    text: "A friend of a friend needed a logo for a bakery. I charged almost nothing, delivered a file I now know was bad, and learned more from the three follow-up emails than from anything I'd done before it.",
    tags: ["Graphic design", "Print", "Learning fast"]
  },
  {
    year: "2016",
    yearIcon: "calendar_today",
    title: "\"Can you just make it work?\"",
    text: "Clients kept asking whether the artwork could become a working page. So I stopped outsourcing that half and learned HTML, CSS and JavaScript properly. Best decision I've made — now the design and the build can't disagree with each other.",
    tags: ["Front-end", "Responsive", "Accessibility"]
  },
  {
    year: "2019",
    yearIcon: "calendar_today",
    title: "Deep Design Hubs opens",
    text: "I registered the name and started taking direct clients. The whole point was one point of contact — the person you brief is the person who ships, so nothing gets reinterpreted three times on the way to production.",
    tags: ["Brand identity", "Web development", "One-person studio"]
  },
  {
    year: "2022",
    yearIcon: "calendar_today",
    title: "Into product work",
    text: "Dashboards, internal tools and multi-user platforms — the kind of work where a design decision affects someone's actual job. That raised my game on information architecture and states and edge cases.",
    tags: ["Dashboards", "Web apps", "Design systems"]
  },
  {
    year: "2024",
    yearIcon: "calendar_today",
    title: "DevConnect & the shop opens",
    text: "Client builds kept ending up as files other people wanted. So I started releasing the cleaned-up versions as products — a dashboard UI kit, a packaging system, poster templates. Same work, more people served.",
    tags: ["Digital products", "Licensing", "DevConnect"]
  },
  {
    year: "Right now",
    yearIcon: "sensors",
    now: true,
    title: "Two slots open, one shop growing",
    text: "Currently finishing a brand refresh and a small marketplace build, and releasing two new templates a month. If you need something shipped before a deadline, this is the best window I'll have for a while.",
    tags: ["Available", "Remote worldwide", "Replies in 24h"]
  }
];

/* Toolkit bench */
export const TOOLKIT = [
  {
    icon: "palette",
    title: "Design",
    rows: [
      { tool: "Figma", note: "Daily" },
      { tool: "Adobe Illustrator", note: "Daily" },
      { tool: "Photoshop", note: "Daily" },
      { tool: "InDesign", note: "Print" },
      { tool: "After Effects", note: "Motion" },
      { tool: "Procreate", note: "Sketches" }
    ]
  },
  {
    icon: "code",
    title: "Build",
    rows: [
      { tool: "HTML5 & CSS3", note: "Daily" },
      { tool: "JavaScript (ES6+)", note: "Daily" },
      { tool: "React", note: "Often" },
      { tool: "PHP & MySQL", note: "Often" },
      { tool: "Node.js", note: "Often" },
      { tool: "GSAP & Lottie", note: "Motion" }
    ]
  },
  {
    icon: "rocket_launch",
    title: "Ship & run",
    rows: [
      { tool: "Git", note: "Daily" },
      { tool: "Netlify", note: "Deploy" },
      { tool: "Vercel", note: "Deploy" },
      { tool: "cPanel / XAMPP", note: "Hosting" },
      { tool: "Lighthouse audits", note: "Every build" },
      { tool: "Google Search Console", note: "SEO" }
    ]
  }
];

/* Industries marquee */
export const INDUSTRIES = [
  "SaaS", "Healthcare", "Retail", "Real estate", "Events",
  "Hospitality", "Education", "Non-profit", "Fintech", "Music"
];

/* Client testimonial quotes */
export const TESTIMONIALS = [
  {
    initials: "AY",
    name: "Amina Yusuf",
    role: "Founder, Greenleaf skincare",
    stars: 5,
    text: "I'd briefed three studios before this and every handoff made the work smaller. Abubakar asked the questions nobody had asked, then built the site himself. It shipped in three weeks and hasn't needed a fix since."
  },
  {
    initials: "DK",
    name: "Daniel Kovač",
    role: "Product Lead, DevConnect",
    stars: 5,
    text: "The dashboard work was the hardest brief I've given anyone — dense data, real users, real deadlines. He designed the states we hadn't thought about before we knew we needed them. Genuinely thought-through product work."
  },
  {
    initials: "SR",
    name: "Sofia Reyes",
    role: "Events Director",
    stars: 5,
    text: "We needed 40 assets in nine days for a festival nobody knew about yet. He came back with a system instead of a stack of one-offs, which meant we could keep making them ourselves after he left. Worth every penny."
  }
];

/* Pricing plans */
export const PLANS = [
  {
    name: "Brand Sprint",
    price: "$480",
    priceNote: "starting",
    for: "For founders who need to look like a real company next week, not a hobby.",
    features: [
      "Primary logo + one alternate lockup",
      "Colour palette and type pairing",
      "12-page mini brand guide (PDF)",
      "Avatar, banner and email signature",
      "Editable source files handed over"
    ],
    cta: { label: "Start a Brand Sprint", to: "/contact", variant: "ghost" }
  },
  {
    name: "Site Build",
    popular: true,
    badge: "Most booked",
    price: "$1,200",
    priceNote: "starting",
    for: "A hand-coded marketing site or landing system, design included.",
    features: [
      "Up to 8 designed and coded pages",
      "Responsive down to 320px, accessible",
      "Contact forms, CMS or API wiring",
      "On-page SEO and analytics setup",
      "Deployment + 30 days of aftercare",
      "Full source code and written guide"
    ],
    cta: { label: "Get a fixed quote", to: "/contact", variant: "accent" }
  },
  {
    name: "Studio Retainer",
    price: "$2,400",
    priceNote: "/ month",
    for: "For teams shipping every week who don't want to keep restarting a project.",
    features: [
      "Reserved weekly capacity, priority queue",
      "Ongoing design and front-end work",
      "Same-day replies on weekdays",
      "Shared channel with plain updates",
      "Monthly written progress report"
    ],
    cta: { label: "Ask about a retainer", to: "/contact", variant: "ghost" }
  }
];

/*
 * Shop grid — per-card home copy keyed by project slug.
 * cover / price / title / sale state come from projects.js (single source).
 */
export const SHOP = [
  {
    slug: "dashboard",
    desc: "The analytics dashboard I built, cleaned up and handed over — dark mode, charts, table and nav components.",
    alt: "Dashboard UI kit for sale"
  },
  {
    slug: "packaging",
    desc: "Dieline templates, print specs and label system for small-batch product runs. Edited, layered, ready to print.",
    alt: "Packaging design system for sale"
  },
  {
    slug: "festival",
    desc: "Eight festival-style poster and social layouts, fully editable in Figma or Illustrator.",
    alt: "Festival identity template for sale"
  },
  {
    slug: "ecommerce",
    desc: "A client's store — storefront, cart and checkout. Live demo below; this template isn't being sold.",
    alt: "Ecommerce store project preview",
    demo: { title: "Ecommerce — Live Demo", meta: "Client project · not for sale", url: "https://example.com" }
  },
  {
    slug: "devconnect",
    desc: "A developer community site I designed and built in 2024. Have a look — the build itself isn't for sale.",
    alt: "DevConnect platform preview",
    demo: { title: "DevConnect — Live Demo", meta: "Client project · not for sale", url: "https://example.com" }
  },
  {
    slug: "property",
    desc: "Search, map view and saved listings for a property client. Preview available; the platform isn't for sale.",
    alt: "Property listings platform preview",
    demo: { title: "Property — Live Demo", meta: "Client project · not for sale", url: "https://example.com" }
  }
];

/* Join shop cards with their project records */
export function shopItems() {
  return SHOP.map((s) => {
    const project = getProject(s.slug);
    return { ...s, project, sale: isForSale(project) };
  }).filter((s) => s.project);
}

/* Home FAQ */
export const FAQ_HOME = [
  {
    q: "What do I actually get at the end?",
    a: "Editable source files — layered artwork, working code, your own hosting and domain logins. Plus a written guide that explains how everything is put together. If I can't hand it over in a form you own, I won't take the project."
  },
  {
    q: "How much will my project cost?",
    a: "Brand work starts around $480, sites around $1,200, retainers at $2,400 a month. Those are floors, not invoices — the number you get depends on scope, and it's fixed in writing before you commit. If it's out of your range, I'll tell you what smaller version of it would work."
  },
  {
    q: "How long does it take?",
    a: "Graphics usually land in 3–7 days, a brand in 2–4 weeks, a site in 1–3 weeks, product work in 4–8. Rush work is possible if the slot is free — tell me the deadline in the first message and I'll say honestly whether it's realistic."
  },
  {
    q: "Do you work with people in other timezones?",
    a: "All of it. I'm used to async work — written updates, shared files and one scheduled call a week is usually faster than being online at the same hours. Overlapping a couple of hours with Europe, Africa and the Gulf is easy; US East Coast mornings work too."
  },
  {
    q: "Should I buy a template instead?",
    a: "If your project is a close match, buying is usually cheaper and faster. If yours is unusual, a custom build will beat a bent template every time — I'd rather tell you that than take a job I'd do badly. Either way the licence is plain English and you'll know exactly what you can and can't ship."
  },
  {
    q: "What happens if I don't like the first draft?",
    a: "Two revision rounds are included on every project, and I'd rather you push back early than sign off quietly. If after revisions it still isn't right, you pay for the work done so far and keep everything produced up to that point. No sunk-cost arguments."
  },
  {
    q: "Who owns the work when I'm done?",
    a: "You do — completely, on the final invoice. I only keep the right to show the work in my portfolio unless you ask me not to. If we disagree about that, put it in writing before we start and I'll honour it."
  }
];

/* Availability slots in the final CTA */
export const SLOTS = [
  { label: "This week", note: "Mon – Fri, 9am – 6pm", icon: "check_circle", state: "free" },
  { label: "New projects", note: "Starting from next month", icon: "event_available", state: "free" },
  { label: "Retainers", note: "Currently full — join the waitlist", icon: "pause_circle", state: "full" }
];

/* Newsletter perks */
export const PERKS = [
  { icon: "bolt", text: "Reply to every message within 24 hours" },
  { icon: "receipt_long", text: "Fixed written quote before you commit" },
  { icon: "public", text: "Remote worldwide, no timezone tax" }
];
