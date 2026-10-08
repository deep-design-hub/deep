/*
 * site.js — global site/brand data (the "settings" table).
 * Header nav, footer, contact blocks, request forms and SEO all read from here.
 */
export const SITE = {
  name: "Deep Design Dev",
  legalName: "Deep Design Dev",
  url: "https://deep-design.netlify.app",
  tagline:
    "A creative studio specializing in graphic design and web development. We craft digital experiences that elevate brands and drive results.",
  shortPitch:
    "Web development, brand identity, UI/UX, graphic design and motion — one studio, fixed quotes, reply within 24 hours.",

  contact: {
    email: "deepdesign844@gmail.com",
    phone: "08165458444",
    location: "Available Worldwide",
    locationNote: "Remote Projects Welcome",
    responseTime: "Within 24 hours",
    hours: "Mon – Sat, 9am – 6pm",
    whatsapp: "08165458444"
  },

  footer: {
    copyright: "2026 Deep Design Dev",
    quickLinks: [
      { label: "Home", to: "/" },
      { label: "Services", to: "/service" },
      { label: "Projects", to: "/projects" },
      { label: "About", to: "/about" }
    ],
    serviceLinks: [
      { label: "Graphic Design", to: "/service" },
      { label: "Web Development", to: "/service" },
      { label: "UI/UX Design", to: "/service" },
      { label: "Branding", to: "/service" }
    ],
    legal: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" }
    ]
  },

  nav: [
    { label: "Home", to: "/", icon: "home" },
    { label: "Service", to: "/service", icon: "design_services" },
    { label: "Projects", to: "/projects", icon: "dashboard" },
    { label: "Contact", to: "/contact", icon: "mail" },
    { label: "About", to: "/about", icon: "person" },
    { label: "Gallery", to: "/gallery", icon: "photo_library" }
  ],

  /* Options offered by the request form (header panel + contact page) */
  requestServices: [
    { value: "brand", label: "Brand Identity", icon: "diamond", desc: "Logos, identity systems, guidelines" },
    { value: "web", label: "Web Development", icon: "web", desc: "Marketing sites & web applications" },
    { value: "product", label: "UI/UX Design", icon: "devices", desc: "Apps, interfaces, design systems" },
    { value: "graphic", label: "Graphic Design", icon: "palette", desc: "Posts, flyers, packaging, print" },
    { value: "licensing", label: "Licensing / Template", icon: "verified_user", desc: "Buy & license a ready build" },
    { value: "other", label: "Something Else", icon: "category", desc: "Don't see it? Tell me anyway" }
  ]
};

/* Legacy shape used by footerRuntime's embedded-data path */
export const SITE_DATA = {
  contact: SITE.contact,
  footer: {
    copyright: SITE.footer.copyright,
    tagline: SITE.tagline,
    quickLinks: SITE.footer.quickLinks,
    serviceLinks: SITE.footer.serviceLinks
  }
};
