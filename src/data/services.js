/*
 * services.js — services page data (the "services" table).
 * Service page cards, extras, FAQ and the future /service/:slug detail pages
 * all read from here. Services are seeded into the `services` table once;
 * admin edits persist there (swap openTable for MySQL later).
 */
import { openTable } from "./db";

const SERVICES_SEED = [
  {
    icon: "code",
    name: "Web Development",
    slug: "web-development",
    time: "1–3 weeks",
    price: "from $1,200",
    intro:
      "Hand-coded marketing sites, web apps and dashboards. Semantic HTML, real accessibility, no page-builder bloat and no mystery plugin holding your content hostage — fast on a bad connection, which is most connections.",
    includes: [
      "Marketing sites, landing pages and portfolio builds",
      "Web apps, dashboards and internal tools",
      "Ecommerce, booking and payment flows",
      "Stack: HTML/CSS/JS, React + Vite, or PHP/MySQL",
      "90+ Lighthouse performance and WCAG AA accessibility",
      "Source files, deploy help and a written handover guide"
    ],
    cta: "See built sites"
  },
  {
    icon: "branding_watermark",
    name: "Brand Identity",
    slug: "brand-identity",
    time: "2–4 weeks",
    price: "from $480",
    intro:
      "Logo, type, colour and a real guideline document — built as rules so the brand still looks right when your team uses it without me. Positioning first, pixels second.",
    includes: [
      "Positioning, audience and competitor review",
      "Primary logo, secondary lockup, mark and favicon",
      "Typography and colour system with usage rules",
      "Stationery: business card, letterhead, email signature",
      "Brand guidelines PDF your team can actually follow",
      "Editable source files (AI, SVG, PDF, PNG)"
    ],
    cta: "See identity work"
  },
  {
    icon: "palette",
    name: "Graphic Design",
    slug: "graphic-design",
    time: "3–7 days",
    price: "from $180",
    intro:
      "Posters, social packs, packaging, pitch decks and print — the everyday artwork that carries the brand between big projects. Two revision rounds included, print-ready files always.",
    includes: [
      "Posters, flyers and event artwork",
      "Social media kits and campaign visuals",
      "Packaging, labels and product print",
      "Pitch decks and sales one-pagers",
      "Print-ready output: CMYK, 300 dpi, bleed and crop marks",
      "Two revision rounds included"
    ],
    cta: "Browse the gallery"
  },
  {
    icon: "devices",
    name: "UI/UX Design",
    slug: "ui-ux-design",
    time: "1–4 weeks",
    price: "from $640",
    intro:
      "Research, wireframes, prototypes and design systems. You click through the product before a line of code exists — so the build phase is boring, in the good way.",
    includes: [
      "User flows, sitemap and low-fi wireframes",
      "High-fidelity mobile and desktop screens",
      "Clickable prototype for user testing",
      "Reusable component library and design tokens",
      "Dev-ready Figma handoff with specs",
      "Accessibility and usability review"
    ],
    cta: "See UI case studies"
  },
  {
    icon: "animation",
    name: "Motion Graphics",
    slug: "motion-graphics",
    time: "1–3 weeks",
    price: "from $360",
    intro:
      "Logo stings, Lottie files, UI transitions and animated social content that load light. Motion with a job to do — explaining, guiding or announcing — never motion for its own sake.",
    includes: [
      "Logo sting and brand ident animation",
      "Lottie / JSON animations for web and apps",
      "UI micro-interactions and page transitions",
      "Animated social content for Reels and stories",
      "Exports: MP4, WebM, GIF and Lottie JSON",
      "Sound design-ready timeline for post production"
    ],
    cta: "Ask about motion"
  }
];

export const EXTRAS = [
  {
    icon: "campaign",
    title: "Art Direction",
    desc: "Shoots, styling and the creative idea behind the work — briefed to photographers, illustrators and editors."
  },
  {
    icon: "inventory_2",
    title: "Digital Products",
    desc: "UI kits, template systems and design tokens sold in the gallery, ready to drop into your own project."
  },
  {
    icon: "build",
    title: "Rescue Jobs",
    desc: "Slow, broken or half-finished builds brought back to life — audited, rebuilt and handed over working."
  }
];

export const FAQS = [
  {
    q: "How much does a project cost?",
    a: "Brand identity starts around $480, websites around $1,200 and UI/UX work around $640. Small graphic design jobs start at $180. Every project gets a fixed written quote before you commit — the number only moves if you change the scope."
  },
  {
    q: "How long will it take?",
    a: "Graphic design runs 3–7 days, web development 1–3 weeks, UI/UX 1–4 weeks and brand identity 2–4 weeks. Tight deadline? Say so in the brief and I'll tell you honestly whether it can be met."
  },
  {
    q: "What do I get at the end?",
    a: "Editable source files — layered artwork, working code, your own hosting and domain logins — plus a written guide explaining how everything is put together. Thirty days of aftercare is included."
  },
  {
    q: "Do you work with existing brands and teams?",
    a: "Yes. I work inside existing brand systems as often as I build new ones, and I'm comfortable hand-working with developers, marketers and other designers through Figma, GitHub, WhatsApp or email."
  },
  {
    q: "Can I buy a template instead?",
    a: "If your project is a close match, buying a template from the gallery is cheaper and faster — see the design gallery for for-sale builds with prices and licences. If it's unusual, a custom build beats a bent template every time."
  }
];

const servicesTable = openTable(
  "services",
  SERVICES_SEED.map((s) => ({ id: "svc_" + s.slug, ...s }))
);

/** Every service row (live table — what the site renders). */
export function listServices() {
  return servicesTable.all();
}

/** Public services — drafts are only visible in the admin. */
export function listPublishedServices() {
  return servicesTable.all().filter((s) => s.status !== "draft");
}

export function getService(slug) {
  return servicesTable.find((s) => s.slug === slug) || null;
}

export function serviceNames() {
  return listServices().map((s) => s.name);
}

/* ---------- admin CRUD ---------- */

export function saveService(data) {
  return servicesTable.insert({
    icon: "design_services",
    includes: [],
    time: "1–2 weeks",
    price: "from $500",
    cta: "See the work",
    ...data,
    slug: String(data.slug || "").trim().toLowerCase().replace(/\s+/g, "-")
  });
}

export function updateService(id, patch) {
  const next = { ...patch };
  if (next.slug !== undefined)
    next.slug = String(next.slug).trim().toLowerCase().replace(/\s+/g, "-");
  return servicesTable.update(id, next);
}

export function deleteService(id) {
  return servicesTable.remove(id);
}
