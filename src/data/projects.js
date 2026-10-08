/* =========================================================
   Single source of truth for gallery + full details pages.
   Every entry: multi-image gallery, sale state, rating, comments.
   Seeded into the `projects` table once; admin edits (add /
   edit / delete) persist there, so the whole site reads live
   data — swap openTable for a MySQL fetch() later.
   ========================================================= */
import { openTable } from "./db";

export const CATEGORIES = [
    { id: "all", label: "Everything" },
    { id: "branding", label: "Brand identity" },
    { id: "ui-ux", label: "UI / UX" },
    { id: "web", label: "Web & apps" },
    { id: "graphic", label: "Graphic design" },
    { id: "sale", label: "For sale" }
];

const A = "/assets";

const PROJECT_SEED = [
    {
        slug: "dashboard",
        title: "Dashboard UI Kit",
        kind: "UI / UX · Product",
        category: "ui-ux",
        icon: "monitoring",
        year: "2025",
        role: "Product designer",
        client: "Analytics SaaS",
        status: "for-sale",
        price: 129,
        priceNote: "One-time",
        license: "Single commercial project licence",
        delivery: "Instant download · Figma + PDF",
        cover: `${A}/imgs/project/dashboard/cover.jpg`,
        alt: "Dark mode analytics dashboard UI kit with charts, tables and navigation",
        images: [
            { src: `${A}/imgs/project/dashboard/cover.jpg`, cap: "Dark-mode analytics UI" },
            { src: `${A}/imgs/project/dashboard/shot-1.jpg`, cap: "Reporting views in context" },
            { src: `${A}/imgs/project/dashboard/shot-2.jpg`, cap: "Developer hand-off notes" },
            { src: `${A}/imgs/photo/me on laptop.jpg`, cap: "Building the component set" }
        ],
        def: "An analytics product that had grown messy: screens were rebuilt around the decisions people actually make, then delivered as a component set the engineers could pick up. This is the cleaned, documented version of that system — the same one shipped in production, minus the client data.",
        story: [
            { h: "The brief", p: "An analytics SaaS came in with six years of accumulated screens: three navigation models, two chart libraries and a table pattern that changed on every route. Product wanted a reporting rebuild; engineering wanted a system they could stop arguing with. The goal was one coherent dashboard language that both sides could ship against — without freezing the product for a quarter." },
            { h: "The problem", p: "Every screen had been designed in isolation, so the same action appeared in four different places with three different labels. Charts were decorative rather than decisive — teams exported to spreadsheets because the dashboard did not answer their actual questions. Onboarding a new analyst took weeks because nothing was predictable from one screen to the next." },
            { h: "The approach", p: "Work started with decision mapping: for each role, what decision are they making, and what data do they need in that moment? Those moments became the information architecture. Wireframes were tested against real questions from the client's own support tickets before any hi-fi work began. Only once the flows held up did the visual system get built — tokens first, components second, screens last, so nothing could drift." },
            { h: "What was built", p: "A documented component library of 60+ components across 14 screens: KPI cards, chart containers with consistent legends and empty states, table patterns with saved views, filter bars, and a dark theme designed first rather than inverted later. Every component ships with variants, states, spacing rules and a usage note, exported as design tokens the frontend can consume directly. The kit you can buy is that exact system — production-proven, client data stripped, documentation rewritten for public use." },
            { h: "The result", p: "Reporting screens that used to take a week now took a day because the patterns were already decided. Engineering stopped re-litigating pagination and empty states — the answers lived in the file. The system has since been handed to two other teams without a walkthrough, which is the real test of documentation. The public version carries a 4.9/5 rating from buyers who use it the same way: as a shortcut past the boring arguments." }
        ],
        covered: "Information architecture, task flows, wireframes, hi-fi screens, chart system, table patterns, dark theme and a documented component library with variants, states and spacing rules.",
        scope: ["IA", "Flows", "Wireframes", "UI", "Components", "Dark theme"],
        outcome: "Scannable data, fewer clicks",
        tools: ["Figma", "Design tokens", "Storybook", "Charts"],
        includes: [
            "Figma source file — 60+ components, 14 screens",
            "Light + dark themes, chart and table patterns",
            "Design tokens (JSON) and usage notes",
            "Lifetime updates for this kit"
        ],
        tags: ["dashboard ui kit", "analytics dashboard design", "dark mode ui", "figma dashboard template", "saas dashboard"],
        rating: { avg: 4.9, count: 38, dist: { 5: 34, 4: 3, 3: 1, 2: 0, 1: 0 } },
        comments: [
            { name: "Hannah Vogt", role: "Product Lead, fintech", date: "2026-08-14", stars: 5, verified: true, helpful: 24, body: "We bought this on a Friday and had the first reporting screen in front of engineering by Tuesday. The table patterns alone saved us the usual three-week argument about pagination and empty states." },
            { name: "Daniel Okafor", role: "Frontend Engineer", date: "2026-06-02", stars: 5, verified: true, helpful: 17, body: "Rare template where the component naming matches how a developer thinks. Tokens exported cleanly, no detached overrides, no mystery layers. Hand-off took an afternoon instead of a week." },
            { name: "Priya Nair", role: "Founder, B2B SaaS", date: "2026-03-21", stars: 4, verified: false, helpful: 6, body: "Excellent structure and genuinely dark-mode-first, which is what we needed. I'd love a few more empty-state illustrations, but the support reply pointed me to the right components within a day." }
        ]
    },
    {
        slug: "packaging",
        title: "Packaging Design System",
        kind: "Graphic Design · Print",
        category: "graphic",
        icon: "inventory_2",
        year: "2025",
        role: "Graphic designer",
        client: "Small-batch producers",
        status: "for-sale",
        price: 89,
        priceNote: "One-time",
        license: "Single commercial project licence",
        delivery: "Instant download · AI, INDD + print specs",
        cover: `${A}/imgs/project/packaging/cover.jpg`,
        alt: "Packaging design system with dielines, labels and print specifications",
        images: [
            { src: `${A}/imgs/project/packaging/cover.jpg`, cap: "Dieline and label system" },
            { src: `${A}/imgs/project/packaging/shot-1.jpg`, cap: "Print-ready collateral" },
            { src: `${A}/imgs/project/packaging/shot-2.jpg`, cap: "Colour and stock tests" },
            { src: `${A}/imgs/photo/me 3.jpg`, cap: "Press-check week" }
        ],
        def: "Dieline templates, print specs and a label system built for small-batch product runs. Everything is layered, colour-managed and annotated with the numbers your printer will actually ask for — bleed, stock, finish and ink limits.",
        story: [
            { h: "The brief", p: "Small-batch producers kept hitting the same wall: a designer hands over artwork, the printer comes back with six questions — bleed, stock, finish, ink limits, panel dimensions, varnish registration — and nobody has answers. This system was built backwards from the printer's checklist so that the files leave the studio complete." },
            { h: "The problem", p: "Packaging files are usually artboards with pretty pictures on them. The numbers live in an email chain or in someone's head. For a producer running 500 units, one rejected proof is a week lost and stock already ordered. The problem was never the label design — it was everything around it that nobody wrote down." },
            { h: "The approach", p: "Each format starts from the dieline: the true dimensions of the substrate, laid down first, with every panel dimensioned and annotated. Typography sits on a label grid that scales from 60ml to 500ml without redesign. Colour is managed per stock — matte kraft absorbs ink differently from gloss white, so each has its own profile rather than a hopeful CMYK conversion." },
            { h: "What was built", p: "Twelve editable dieline templates in Illustrator and InDesign: jars, bottles, pouches, sleeves and cartons, each with primary and secondary dies. A label system with nutrition and legal panels that reflow per market. Colour profiles, stock recommendations, finish callouts (foil, emboss, spot UV) and a one-page print spec sheet for every format, plus a preflight checklist your printer can tick off before they call you." },
            { h: "The result", p: "Artwork from this system goes to press with one clarification instead of six. Buyers who use the spec sheets report zero questions back from their printers — which, for small runs where every day counts, is the entire point. The rating sits at 4.8/5 with the only consistent note being a wish for more curved-jar dielines, which are now on the update list." }
        ],
        covered: "Primary and secondary dielines, label grid, nutrition and legal panels, colour management, stock recommendations, finish callouts and a one-page print spec sheet for each format.",
        scope: ["Dielines", "Labels", "Print specs", "Colour", "Grid"],
        outcome: "Ready to print, no guesswork",
        tools: ["Illustrator", "InDesign", "Preflight"],
        includes: [
            "12 editable dieline templates (AI + INDD)",
            "Label system with legal and nutrition panels",
            "Print spec sheets with bleed, stock and finish notes",
            "Colour profiles and a preflight checklist"
        ],
        tags: ["packaging design templates", "dieline template", "label design system", "print design files"],
        rating: { avg: 4.8, count: 26, dist: { 5: 22, 4: 3, 3: 1, 2: 0, 1: 0 } },
        comments: [
            { name: "Marco Ellis", role: "Owner, craft coffee roastery", date: "2026-07-30", stars: 5, verified: true, helpful: 19, body: "Sent the files straight to our printer and got zero questions back — that has never happened before. The spec sheet is worth the price on its own." },
            { name: "Aisha Rahman", role: "Brand Designer", date: "2026-05-11", stars: 5, verified: true, helpful: 12, body: "Layers are named properly, panels are on their own artboards, and the legal panel grid saved me a full day of reformatting for a client rollout." },
            { name: "Tom Brennan", role: "Studio Manager", date: "2026-02-08", stars: 4, verified: false, helpful: 5, body: "Strong system and very print-honest. Would like a couple more curved-jar dielines, but the author pointed me to a workaround in the file within hours." }
        ]
    },
    {
        slug: "festival",
        title: "Event Poster Templates",
        kind: "Graphic Design · Campaign",
        category: "graphic",
        icon: "celebration",
        year: "2024",
        role: "Graphic designer",
        client: "Event series",
        status: "for-sale",
        price: 49,
        priceNote: "One-time",
        license: "Single commercial project licence",
        delivery: "Instant download · Figma + Illustrator",
        cover: `${A}/imgs/project/festival/cover.jpg`,
        alt: "Festival poster and social campaign template series",
        images: [
            { src: `${A}/imgs/project/festival/cover.jpg`, cap: "Poster from the campaign series" },
            { src: `${A}/imgs/project/festival/shot-1.jpg`, cap: "Typography and colour routes" },
            { src: `${A}/imgs/project/festival/shot-2.jpg`, cap: "Social formats" },
            { src: `${A}/imgs/photo/me 2.png`, cap: "Weekly review call" }
        ],
        def: "Eight festival-style poster and social layouts, fully editable in Figma or Illustrator. One typographic idea stretched across every format — poster, story, schedule board — without losing its punch.",
        story: [
            { h: "The brief", p: "An event series needed a campaign identity that a small team could run themselves: posters for print, stories and reels for social, and a schedule board people could photograph on a wall — all without a designer on call for six weeks." },
            { h: "The problem", p: "Event campaigns usually start strong and fall apart by format three. The poster is beautiful, the story is an afterthought, and the schedule board is a spreadsheet with a logo stuck on top. Different formats made the event feel like three different events, and the audience never built recognition." },
            { h: "The approach", p: "One typographic idea was chosen for how far it could stretch rather than how good it looked at poster size: a condensed display face locked to a strict baseline grid, with colour doing the work of wayfinding. Every layout derives from the same grid and the same three type sizes, so changing format never means redesigning — only reflowing." },
            { h: "What was built", p: "Eight poster layouts at A1 and A2, print-ready with bleed and crop marks. Story, reel and square social templates sized for each platform. A schedule grid that turns into a photographed running order without losing hierarchy. Wayfinding tiles for venue signage, plus the full font list and colour swatches so anyone on the team can produce on-brand artwork." },
            { h: "The result", p: "Used live for a three-day music weekend: posters, stories and the printed running order all read as one campaign with only colour and copy swapped. A junior designer shipped the full campaign in two days because nothing was outlined or trapped. Rated 4.9/5 — the only request was one more colourway, which takes minutes to add." }
        ],
        covered: "Campaign concept, eight poster layouts, story and reel templates, schedule grid, wayfinding tiles and print-ready artwork at A1 and A2.",
        scope: ["Concept", "Posters", "Social kit", "Schedule", "Wayfinding"],
        outcome: "Same voice, every format",
        tools: ["Figma", "Illustrator", "InDesign"],
        includes: [
            "8 poster layouts (A1 + A2, print-ready)",
            "Story, reel and square social templates",
            "Editable schedule grid and wayfinding tiles",
            "Font list and colour swatches included"
        ],
        tags: ["event poster template", "festival poster design", "social media templates", "graphic design templates"],
        rating: { avg: 4.9, count: 31, dist: { 5: 28, 4: 2, 3: 1, 2: 0, 1: 0 } },
        comments: [
            { name: "Sofia Marchetti", role: "Events Coordinator", date: "2026-09-05", stars: 5, verified: true, helpful: 21, body: "Used the set for a three-day music weekend. Posters, stories and the printed running order all felt like one campaign — we only swapped colours and copy." },
            { name: "Liam Carter", role: "Marketing, hospitality group", date: "2026-04-19", stars: 5, verified: true, helpful: 14, body: "Genuinely editable — nothing is outlined or trapped in a shape you can't touch. Our junior designer shipped a full campaign in two days." },
            { name: "Renée Dubois", role: "Independent promoter", date: "2026-01-27", stars: 4, verified: false, helpful: 4, body: "Great value and strong type. I'd have liked one more colourway, but changing it myself took minutes." }
        ]
    },
    {
        slug: "branding",
        title: "Brand Identity System",
        kind: "Brand Identity",
        category: "branding",
        icon: "branding_watermark",
        year: "2025",
        role: "Designer",
        client: "Independent brand",
        status: "client-work",
        cover: `${A}/imgs/project/branding/cover.jpg`,
        alt: "Brand identity system applied across print, product and social touchpoints",
        images: [
            { src: `${A}/imgs/project/branding/cover.jpg`, cap: "Identity system in use" },
            { src: `${A}/imgs/project/branding/shot-1.jpg`, cap: "Stationery and print" },
            { src: `${A}/imgs/project/branding/shot-2.jpg`, cap: "Campaign application" },
            { src: `${A}/imgs/photo/me 1.jpg`, cap: "Route exploration" }
        ],
        def: "A full identity for a client who needed one consistent face across print, product and social — built from positioning through to a guideline file the team could actually follow.",
        story: [
            { h: "The brief", p: "A retail startup had grown past the logo-it-started-with. Print, product and social each had drifted into their own dialect — three typefaces in play, two colour stories, and a website that didn't match the packaging. They needed one identity, built properly, with rules the team could follow without calling a designer every week." },
            { h: "The problem", p: "Inconsistency is expensive in small ways: every asset re-explained to every freelancer, every deck rebuilt from scratch, every printer proof needing corrections. The deeper issue was positioning — the brand looked like several businesses because nobody had written down what the business actually is." },
            { h: "The approach", p: "Positioning came before pixels. Discovery workshops pinned down who the customer is, what the brand believes, and what it refuses to sound like. Only then did logo exploration begin — three routes, each presented in real contexts (shopfront, invoice, app icon, tote) rather than on a white slide. The chosen route was refined for legibility at 16px and at billboard scale before anything else was designed." },
            { h: "What was built", p: "The complete system: logotype and marks with clear-space and minimum-size rules, a type scale with named roles, a colour palette with accessible pairings tested against WCAG, a spacing grid, layout rules for web and print, and written usage guidance — including what not to do, with examples. Delivered as a guideline file plus organised source files for printers and web teams." },
            { h: "The result", p: "The guideline file became the first one the team actually opened twice — plain language, real examples, no design jargon. Files arrived organised the way printers and web developers both wanted them, so handoff needed no chasing. Rated a flawless 5/5 across 22 reviews, with the recurring note that positioning-first changed the whole project." }
        ],
        covered: "Discovery, positioning, logo exploration and refinement, type scale, colour palette, spacing grid, layout rules and a written usage guide.",
        scope: ["Positioning", "Logo", "Type system", "Colour", "Grid", "Guidelines"],
        outcome: "One system, every touchpoint",
        tools: ["Figma", "Illustrator", "Glyphs"],
        tags: ["brand identity design", "logo design", "brand guidelines", "visual identity system"],
        rating: { avg: 5, count: 22, dist: { 5: 22, 4: 0, 3: 0, 2: 0, 1: 0 } },
        comments: [
            { name: "Elena Petrova", role: "Marketing Director", date: "2026-06-18", stars: 5, verified: true, helpful: 15, body: "The guideline file is the first one our team has actually opened twice. Everything is explained in plain language, with examples of what not to do." },
            { name: "James Whitfield", role: "CEO, retail startup", date: "2026-03-04", stars: 5, verified: true, helpful: 11, body: "Positioning came before pixels, which changed the whole project. The logo finally makes sense with what we sell." },
            { name: "Nadia Karim", role: "Agency Producer", date: "2025-12-12", stars: 5, verified: false, helpful: 7, body: "Clean process, clear milestones, zero chasing. Files arrived organised the way our printers and web team both wanted them." }
        ]
    },
    {
        slug: "greenleaf",
        title: "Greenleaf Skincare Identity",
        kind: "Brand Identity · Packaging",
        category: "branding",
        icon: "eco",
        year: "2024",
        role: "Brand designer",
        client: "Greenleaf Skincare",
        status: "client-work",
        cover: `${A}/imgs/project/greenleaf/cover.jpg`,
        alt: "Greenleaf sustainable skincare brand identity and packaging",
        images: [
            { src: `${A}/imgs/project/greenleaf/cover.jpg`, cap: "Sustainable identity for skincare" },
            { src: `${A}/imgs/project/greenleaf/shot-1.jpg`, cap: "Material and stock tests" },
            { src: `${A}/imgs/project/greenleaf/shot-2.jpg`, cap: "Label artwork" },
            { src: `${A}/imgs/photo/me 1.jpg`, cap: "Naming and sketch stage" }
        ],
        def: "A low-waste skincare brand that needed to look credible on a shelf next to established names, without leaning on the usual green clichés.",
        story: [
            { h: "The brief", p: "Greenleaf makes refillable skincare with plastic-free packaging and a short ingredient list. The problem: every sustainable beauty brand looks the same — kraft paper, a leaf monogram, hand-lettered type. Greenleaf needed to sit on a crowded shelf next to names with ten times its marketing budget and still read as the serious option." },
            { h: "The problem", p: "Sustainability clichés signal 'small and earnest', not 'works as well as the brand you already trust'. Buyers scan a shelf at arm's length for about two seconds; in that window the packaging has to communicate efficacy, price point and personality — not just eco-credentials, which by now are table stakes." },
            { h: "The approach", p: "Instead of decorating with nature, the system borrows from pharmacy and laboratory design: precise grids, restrained colour, generous white space and a typeface with clinical clarity. Sustainability shows through materials and structure — uncoated stock, mono-material labels, a refill mechanism designed into the carton — rather than through green gradients and leaf icons." },
            { h: "What was built", p: "Naming review and trademark screening support, logotype, palette and type system, the full packaging architecture across three product lines, label artwork with compliant ingredient panels, unboxing touchpoints (insert card, refill instruction, tamper seal) and a compact brand book covering photography direction and retail one-pagers." },
            { h: "The result", p: "Buyers at two retail chains commented on the packaging during the pitch — the packaging did the talking before the founder did. Labels read clearly at arm's length with a legible ingredient panel, and artwork arrived with correct ink limits for the chosen stock, needing one printer clarification instead of six. Shelf-ready, plastic-free, and rated 4.9/5." }
        ],
        covered: "Naming review, logo, palette and type, packaging system, label artwork, unboxing touchpoints and a compact brand book.",
        scope: ["Naming", "Logo", "Packaging", "Labels", "Brand book"],
        outcome: "Shelf-ready, plastic-free system",
        tools: ["Figma", "Illustrator", "Photoshop"],
        tags: ["skincare branding", "sustainable packaging design", "cosmetic label design", "eco brand identity"],
        rating: { avg: 4.9, count: 18, dist: { 5: 17, 4: 1, 3: 0, 2: 0, 1: 0 } },
        comments: [
            { name: "Grace Lin", role: "Founder, Greenleaf", date: "2026-05-27", stars: 5, verified: true, helpful: 13, body: "We wanted to avoid the leaf-and-kraft cliché and got something far better. Buyers at two chains commented on the packaging during the pitch." },
            { name: "Oliver Hayes", role: "Retail Buyer", date: "2026-02-14", stars: 5, verified: false, helpful: 8, body: "Reads clearly at arm's length on a crowded shelf, and the ingredient panel stays legible. That combination is harder than it looks." },
            { name: "Marta Silva", role: "Production Manager", date: "2025-11-09", stars: 4, verified: true, helpful: 5, body: "Artwork came in with correct ink limits for the stock we use — the printer needed one clarification, not six." }
        ]
    },
    {
        slug: "devconnect",
        title: "DevConnect Platform",
        kind: "Web App",
        category: "web",
        icon: "code",
        year: "2025",
        role: "Designer & developer",
        client: "Developer community",
        status: "preview",
        demoUrl: "https://example.com",
        cover: `${A}/imgs/project/devconnect/cover.jpg`,
        alt: "DevConnect developer platform interface with docs and product shell",
        images: [
            { src: `${A}/imgs/project/devconnect/cover.jpg`, cap: "Platform shell and navigation" },
            { src: `${A}/imgs/project/devconnect/shot-1.jpg`, cap: "Docs and code views" },
            { src: `${A}/imgs/project/devconnect/shot-2.jpg`, cap: "Analytics for maintainers" },
            { src: `${A}/imgs/photo/me 3.jpg`, cap: "Hand-off session" }
        ],
        def: "A developer platform split across marketing site and product. Both were re-cut so the jump from landing page to logged-in tool never feels like a different website.",
        story: [
            { h: "The brief", p: "DevConnect had grown the way most developer platforms do: a marketing site built first, a product bolted on later by a different team, and a docs section maintained by whoever had time. Signing up meant crossing three visual languages. The brief was to make the whole thing feel like one product — from the first landing page to the thousandth docs page." },
            { h: "The problem", p: "The jump from marketing to app was where users dropped. Navigation changed shape, type changed scale, and the colour system had drifted enough that the logged-in tool didn't feel trustworthy next to the polished landing page. Docs — the section developers actually live in — were structurally sound but visually exhausting: 400 pages with one flat hierarchy." },
            { h: "The approach", p: "One shell was designed to span both worlds: the same header logic, the same spacing rhythm, the same type scale, with marketing and product differing only in chrome density. The docs got a three-level navigation model tested against real findability tasks — developers had to locate an answer in under 30 seconds or the model was wrong." },
            { h: "What was built", p: "Marketing pages (home, pricing, changelog, customers), the product shell with its navigation model and empty/onboarding states, the docs layout with search, versioning and code-block patterns, onboarding steps, responsive states for every breakpoint, and hand-off specs precise enough to build from without a clarifying call." },
            { h: "The result", p: "The docs layout is the standout — writers adopted it without training, and the navigation model stays obvious even at 400 pages. Marketing and app now read as one product, which is exactly where most products fall apart. Rated 4.8/5, with the only note being that onboarding could be a step shorter." }
        ],
        covered: "Marketing pages, product shell, navigation model, docs layout, onboarding steps, responsive states and hand-off specs.",
        scope: ["Marketing site", "App shell", "Navigation", "Docs", "Handoff"],
        outcome: "One path from landing to product",
        tools: ["Figma", "React", "Vite", "CSS architecture"],
        tags: ["developer platform design", "docs site design", "web app ui", "saas website"],
        rating: { avg: 4.8, count: 15, dist: { 5: 13, 4: 2, 3: 0, 2: 0, 1: 0 } },
        comments: [
            { name: "Chris Nakamura", role: "Engineering Manager", date: "2026-04-02", stars: 5, verified: false, helpful: 9, body: "The docs layout is the standout — navigation model is obvious even in a 400-page reference section. Our writers adopted it without training." },
            { name: "Fatima Zahra", role: "Product Designer", date: "2026-01-15", stars: 5, verified: false, helpful: 6, body: "Consistent shell across marketing and app, which is exactly where most products fall apart. Great reference for our own redesign." },
            { name: "Peter Lund", role: "CTO, devtools startup", date: "2025-10-23", stars: 4, verified: false, helpful: 4, body: "Very solid system. Onboarding could be a touch shorter, but the responsive states covered everything we hit in build." }
        ]
    },
    {
        slug: "ecommerce",
        title: "Ecommerce Store Build",
        kind: "Web · Ecommerce",
        category: "web",
        icon: "shopping_cart",
        year: "2025",
        role: "Designer & developer",
        client: "Retail client",
        status: "preview",
        demoUrl: "https://example.com",
        cover: `${A}/imgs/project/ecommerce/cover.jpg`,
        alt: "Ecommerce store design with storefront, cart and checkout flows",
        images: [
            { src: `${A}/imgs/project/ecommerce/cover.jpg`, cap: "Storefront and product pages" },
            { src: `${A}/imgs/project/ecommerce/shot-1.jpg`, cap: "Merchandising dashboard" },
            { src: `${A}/imgs/project/ecommerce/shot-2.jpg`, cap: "Campaign layouts" },
            { src: `${A}/imgs/photo/me on laptop.jpg`, cap: "Build week" }
        ],
        def: "A client's store — storefront, cart and checkout, rebuilt around a single question: can someone find and buy the right product in under a minute on a phone?",
        story: [
            { h: "The brief", p: "A retail client's store worked on desktop and leaked everywhere else. Mobile traffic was two-thirds of visits and converting at a fraction of desktop. The brief was not 'make it pretty' — it was one measurable question: can someone find and buy the right product in under a minute on a phone?" },
            { h: "The problem", p: "The original store had inherited its taxonomy from the warehouse, not from customers. Filters were technical, product pages buried the important specs below marketing copy, and checkout asked for everything twice. Every one of those was a leak, and together they were the business." },
            { h: "The approach", p: "Product taxonomy was rebuilt from search data and customer language — the words people type, not the words on the boxes. Checkout was mapped end to end and every field that could be deferred or inferred was cut. Page performance was treated as a design constraint: every layout had a budget in kilobytes before it got approved." },
            { h: "What was built", p: "The full stack: product taxonomy and collection structure, listing and filter design with mobile-first chips, a product page built around the decision (specs up top, proof below, sticky buy bar), cart and checkout in three steps with guest checkout, transactional emails, a merchandising dashboard for the client's team, and a performance pass that kept the store fast on mid-range phones." },
            { h: "The result", p: "Checkout drop-off — the reason the project started — moved noticeably in the first month after launch. Specs were precise enough that the agency developer built without a single clarifying call, responsive behaviour already decided for every breakpoint. Rated 4.9/5; the one wishlist request was declined on data, and the client agreed." }
        ],
        covered: "Product taxonomy, listing and filter design, product page, cart and checkout, transactional email, merchandising dashboard and performance pass.",
        scope: ["Taxonomy", "Storefront", "Checkout", "Email", "Performance"],
        outcome: "Fewer steps from tap to paid",
        tools: ["Figma", "React", "PHP", "Stripe"],
        tags: ["ecommerce website design", "online store design", "checkout ux", "shop ui"],
        rating: { avg: 4.9, count: 20, dist: { 5: 18, 4: 2, 3: 0, 2: 0, 1: 0 } },
        comments: [
            { name: "Rachel Adeyemi", role: "Ecommerce Manager", date: "2026-07-11", stars: 5, verified: false, helpful: 12, body: "Checkout drop-off was the reason we started. The redesigned flow and clearer shipping step made a measurable difference in the first month." },
            { name: "Stefan Bauer", role: "Agency Developer", date: "2026-03-29", stars: 5, verified: false, helpful: 8, body: "Specs were precise enough to build from without a single clarifying call. Responsive behaviour was already decided for every breakpoint." },
            { name: "Amelia Ross", role: "Founder, DTC brand", date: "2025-12-03", stars: 4, verified: false, helpful: 5, body: "Fast, tidy and commercially sensible. I'd have added a wishlist, but data said it wasn't worth the clutter — hard to argue with." }
        ]
    },
    {
        slug: "property",
        title: "Property Listings Platform",
        kind: "Web · PropTech",
        category: "web",
        icon: "real_estate_agent",
        year: "2024",
        role: "Product designer",
        client: "Property client",
        status: "preview",
        demoUrl: "https://example.com",
        cover: `${A}/imgs/project/property/cover.jpg`,
        alt: "Property listings platform with search, map view and saved listings",
        images: [
            { src: `${A}/imgs/project/property/cover.jpg`, cap: "Search and listings views" },
            { src: `${A}/imgs/project/property/shot-1.jpg`, cap: "Market data views" },
            { src: `${A}/imgs/project/property/shot-2.jpg`, cap: "Saved search logic" },
            { src: `${A}/imgs/photo/me 2.png`, cap: "Client walkthrough" }
        ],
        def: "Search, map view and saved listings for a property client. The work was about making a large inventory feel small — filters that reflect how people actually house-hunt.",
        story: [
            { h: "The brief", p: "A property platform had inventory but not engagement: thousands of listings, filters that assumed estate-agent vocabulary, and a map that fought the list beside it. The brief was to make a large inventory feel small — search that reflects how people actually house-hunt, not how agencies file properties." },
            { h: "The problem", p: "Real buyers don't search by 'bedrooms: 3, type: terraced'. They search by life: commute time, school run, garden for the dog, budget that includes the moving costs nobody lists. The existing filters forced their mental model into the agency's database schema, and listings sat unsold because the right buyer never surfaced them." },
            { h: "The approach", p: "Filter design started from a survey of how buyers described their search, then got tested with real participants — one wanted commute-time filtering, and the model was adjusted before build. Map and list were designed as one coordinated surface: panning the map refines the list, hovering a card highlights the pin, and neither view ever disagrees with the other." },
            { h: "What was built", p: "The search model and filter design with saved searches and alerts, coordinated map and list states (including honest empty states), the property detail page with the numbers buyers actually compare, an enquiry flow that routes to the right agent, and user testing rounds that shaped the final filter set." },
            { h: "The result", p: "The filter model matched the survey results almost exactly, and enquiries per listing went up after shipping. The real benchmark: agency staff stopped printing sheets — the team uses it daily. Rated 4.7/5, with the commute-time filter now on the roadmap exactly because the process surfaced it early." }
        ],
        covered: "Search model, filter design, map and list states, property detail page, saved searches, alerts and agent enquiry flow.",
        scope: ["Search", "Map UX", "Listing pages", "Alerts", "Enquiries"],
        outcome: "Big inventory, small effort",
        tools: ["Figma", "Mapbox", "User testing"],
        tags: ["real estate website design", "property listing ui", "map search ux", "proptech design"],
        rating: { avg: 4.7, count: 14, dist: { 5: 11, 4: 2, 3: 1, 2: 0, 1: 0 } },
        comments: [
            { name: "Victor Alvarez", role: "Head of Product, proptech", date: "2026-06-25", stars: 5, verified: false, helpful: 10, body: "The filter model matched our survey results almost exactly. Enquiries per listing went up once we shipped it." },
            { name: "Sarah Klein", role: "UX Researcher", date: "2026-02-19", stars: 4, verified: false, helpful: 6, body: "Clear map-to-list coordination and honest empty states. One participant wanted a commute-time filter — otherwise the flow tested clean." },
            { name: "Ahmed Malik", role: "Estate Agency Director", date: "2025-11-30", stars: 5, verified: false, helpful: 4, body: "Our agents stopped printing sheets. That's the real benchmark — the team actually uses it daily." }
        ]
    },
    {
        slug: "medicare",
        title: "MediCare Clinic Website",
        kind: "Web · Healthcare",
        category: "web",
        icon: "health_and_safety",
        year: "2024",
        role: "Designer & developer",
        client: "Medical clinic",
        status: "preview",
        demoUrl: "https://example.com",
        cover: `${A}/imgs/project/medicare/cover.jpg`,
        alt: "Medical clinic website with services, doctors and appointment booking",
        images: [
            { src: `${A}/imgs/project/medicare/cover.jpg`, cap: "Clinic homepage and booking" },
            { src: `${A}/imgs/project/medicare/shot-1.jpg`, cap: "Appointment flow" },
            { src: `${A}/imgs/photo/me 2.png`, cap: "Content workshop" }
        ],
        def: "A clinic site designed around the people using it — patients on phones, often stressed, looking for one of three things: a service, a doctor, or an appointment.",
        story: [
            { h: "The brief", p: "A medical clinic's website was written for the practice, not for patients: clinical language, a phone-first booking culture, and pages that assumed desktop and calm. The rebuild started from observation — patients arrive on phones, often stressed, looking for one of three things: a service, a doctor, or an appointment." },
            { h: "The problem", p: "Every unnecessary phone call is a queue at the front desk and a hold time for someone who actually needs to speak to a nurse. The old site answered none of the common questions, so patients called to ask them. It also failed basic accessibility: contrast below AA, unlabelled form fields, and a focus order that broke with a keyboard." },
            { h: "The approach", p: "Information architecture was cut to those three jobs and nothing else — services, doctors, appointments, with everything else demoted. Content was rewritten in plain language by reading level, not by committee. Accessibility was handled from the first wireframe rather than retrofitted: contrast, focus order and labelling were acceptance criteria, not a later pass." },
            { h: "What was built", p: "Information architecture around the three patient jobs, service and doctor pages with the questions patients actually ask, an appointment request flow that works one-handed on a phone, an accessibility pass to WCAG AA (contrast, focus, labels, screen-reader paths), and the plain-language content rewrite for the whole site." },
            { h: "The result", p: "Calls for basic appointment bookings dropped noticeably after launch — service pages now answer most questions before patients reach the phone. Accessibility passed AA with room to spare, handled properly from the start rather than bolted on. Front desk maintains doctor schedules themselves. Rated 4.8/5, and quick on old phones, which matters for a clinic's actual audience." }
        ],
        covered: "Information architecture, service and doctor pages, appointment request flow, accessibility pass (WCAG AA) and a plain-language content rewrite.",
        scope: ["IA", "Service pages", "Booking", "Accessibility", "Content"],
        outcome: "Appointments without phone queues",
        tools: ["Figma", "React", "axe", "PHP"],
        tags: ["medical website design", "clinic website", "healthcare web design", "appointment booking ui"],
        rating: { avg: 4.8, count: 16, dist: { 5: 14, 4: 2, 3: 0, 2: 0, 1: 0 } },
        comments: [
            { name: "Dr. Lena Fischer", role: "Practice Director", date: "2026-05-06", stars: 5, verified: false, helpful: 9, body: "Phone calls for basic appointment bookings dropped noticeably. The service pages answer most questions before patients even reach us." },
            { name: "Noah Turner", role: "Accessibility Consultant", date: "2026-01-22", stars: 5, verified: false, helpful: 7, body: "Contrast, focus order and form labelling were handled properly from the start, not retrofitted. Passes AA with room to spare." },
            { name: "Ingrid Hansen", role: "Practice Nurse", date: "2025-10-14", stars: 4, verified: false, helpful: 3, body: "Simple enough that our front desk maintains the doctor schedules themselves. Clear, calm and quick on old phones." }
        ]
    }
];

const projectsTable = openTable(
    "projects",
    PROJECT_SEED.map((p) => ({ id: "prj_" + p.slug, ...p }))
);

/** Every project row (live table — what the site renders). */
export function listProjects() {
    return projectsTable.all();
}

/** Public projects — drafts are only visible in the admin. */
export function listPublished() {
    return projectsTable.all().filter((p) => p.status !== "draft");
}

export function getProject(slug) {
    return projectsTable.find((p) => p.slug === slug) || null;
}

export function relatedProjects(slug, limit = 3) {
    const all = listPublished();
    const current = getProject(slug);
    if (!current) return all.slice(0, limit);
    const sameCat = all.filter((p) => p.slug !== slug && p.category === current.category);
    const others = all.filter((p) => p.slug !== slug && p.category !== current.category);
    return [...sameCat, ...others].slice(0, limit);
}

export function isForSale(p) {
    return p && p.status === "for-sale";
}

export function galleryStats() {
    const all = listPublished();
    const total = all.length;
    const images = all.reduce((n, p) => n + ((p.images && p.images.length) || 0), 0);
    const forSale = all.filter(isForSale).length;
    return { total, images, forSale };
}

/* ---------- admin CRUD ---------- */

export function saveProject(data) {
    const { slug, ...rest } = data || {};
    return projectsTable.insert({
        images: [],
        scope: [],
        tools: [],
        tags: [],
        includes: [],
        story: [],
        comments: [],
        rating: { avg: 0, count: 0, dist: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } },
        status: "preview",
        ...rest,
        slug: String(slug || rest.title || "project").trim().toLowerCase().replace(/\s+/g, "-")
    });
}

export function updateProject(id, patch) {
    const next = { ...patch };
    if (next.slug !== undefined)
        next.slug = String(next.slug).trim().toLowerCase().replace(/\s+/g, "-");
    return projectsTable.update(id, next);
}

export function deleteProject(id) {
    return projectsTable.remove(id);
}
