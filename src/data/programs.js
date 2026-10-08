/*
 * programs.js — featured work shown on the home page (bento cards).
 * Each entry points at a real project in data/projects.js (same slugs).
 */

export const PROGRAMS = [
    {
        id: "branding",
        kind: "Brand Identity",
        icon: "branding_watermark",
        title: "Branding",
        alt: "Branding project — identity system applied across touchpoints",
        images: ["/assets/imgs/project/branding/cover.jpg"],
        shots: [],
        heroCaption: "Identity system in use",
        def: "A full identity for a client who needed one consistent face across print, product and social — built from positioning through to a guideline file the team could actually follow.",
        covered: "Discovery, positioning, logo exploration and refinement, type scale, colour palette, spacing grid, layout rules and a written usage guide.",
        scope: ["Positioning", "Logo", "Type system", "Colour", "Grid", "Guidelines"],
        role: "Designer",
        year: "2025",
        outcome: "One system, every touchpoint"
    },
    {
        id: "dashboard",
        kind: "UI / UX",
        icon: "monitoring",
        title: "Dashboard",
        alt: "Analytics dashboard interface in dark mode",
        images: ["/assets/imgs/project/dashboard/cover.jpg"],
        shots: [],
        heroCaption: "Dark-mode analytics UI",
        def: "An analytics product that had grown messy: screens were rebuilt around the decisions people actually make, then delivered as a component set the engineers could pick up.",
        covered: "Information architecture, task flows, wireframes, hi-fi screens, chart system, table patterns, dark theme and a documented component library.",
        scope: ["IA", "Flows", "Wireframes", "UI", "Components", "Dark theme"],
        role: "Product designer",
        year: "2025",
        outcome: "Scannable data, fewer clicks"
    },
    {
        id: "devconnect",
        kind: "Web App",
        icon: "code",
        title: "DevConnect",
        alt: "DevConnect developer platform interface",
        images: ["/assets/imgs/project/devconnect/cover.jpg"],
        shots: [],
        heroCaption: "Platform shell and navigation",
        def: "A developer platform split across marketing site and product. Both were re-cut so the jump from landing page to logged-in tool never feels like a different website.",
        covered: "Marketing pages, product shell, navigation model, docs layout, onboarding steps, responsive states and hand-off specs.",
        scope: ["Marketing site", "App shell", "Navigation", "Docs", "Handoff"],
        role: "Designer & developer",
        year: "2025",
        outcome: "One path from landing to product"
    },
    {
        id: "festival",
        kind: "Graphic Design",
        icon: "celebration",
        title: "Festival",
        alt: "Festival poster and social campaign design",
        images: ["/assets/imgs/project/festival/cover.jpg"],
        shots: [],
        heroCaption: "Poster from the campaign series",
        def: "An event identity that had to survive a poster wall, a phone screen and a schedule board — one typographic idea stretched across every format without losing its punch.",
        covered: "Campaign concept, poster series, social kit, schedule grid, story and reel templates, wayfinding and print-ready artwork.",
        scope: ["Concept", "Posters", "Social kit", "Schedule", "Wayfinding"],
        role: "Graphic designer",
        year: "2024",
        outcome: "Same voice, every format"
    },
    {
        id: "greenleaf",
        kind: "Brand Identity",
        icon: "eco",
        title: "Greenleaf",
        alt: "Greenleaf sustainable skincare brand identity",
        images: ["/assets/imgs/project/greenleaf/cover.jpg"],
        shots: [],
        heroCaption: "Sustainable identity for skincare",
        def: "A low-waste skincare brand that needed to look credible on a shelf next to established names, without leaning on the usual green clichés.",
        covered: "Naming review, logo, palette and type, packaging system, label artwork, unboxing touchpoints and a compact brand book.",
        scope: ["Naming", "Logo", "Packaging", "Labels", "Brand book"],
        role: "Brand designer",
        year: "2024",
        outcome: "Shelf-ready, plastic-free system"
    }
];
