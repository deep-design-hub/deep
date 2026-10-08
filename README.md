![Deep Design Dev](public/assets/imgs/logo/black-deep.png)

# Deep Design Dev — Studio Website, Shop & Client Portal

**Deep Design Dev** is the digital home of Abubakar Musa — a one-person design and development studio crafting high-converting landing pages, brand identities, eCommerce experiences, UI kits and custom web applications. This repository contains the complete, production-ready studio website: portfolio, storefront, project briefs, client dashboard, admin CRM and media gallery — all built to run as a lightning-fast static site with zero backend dependency.

[Live Site →](https://deep-design.netlify.app)

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Demo Accounts](#demo-accounts)
- [Project Architecture](#project-architecture)
- [Routing](#routing)
- [Data Layer & Persistence](#data-layer--persistence)
- [Payments](#payments)
- [Request Pipeline](#request-pipeline)
- [Gallery & Media](#gallery--media)
- [Client Portal (Account)](#client-portal-account)
- [Admin CRM](#admin-crm)
- [SEO, Metadata & Indexing](#seo-metadata--indexing)
- [Performance, Accessibility & Security](#performance-accessibility--security)
- [Deployment](#deployment)
- [Scripts](#scripts)
- [Roadmap & TODO](#roadmap--todo)
- [Contributing](#contributing)
- [License](#license)
- [Brand](#brand)

---

## Overview

Deep Design Dev is engineered as a **client-first studio platform**. It unifies lead capture, project scoping, product sales (templates, UI kits, licences), order fulfilment, client communication and internal operations into one polished interface. The entire application is **data-driven and localStorage-persisted**, meaning it builds to a static `dist/` bundle deployable to Netlify, Vercel, Cloudflare Pages or any static host — while still delivering a fully interactive CRM experience out of the box.

---

## Key Features

| Feature | What It Delivers |
|---|---|
| **Modern Frontend Stack** | React 19, Vite 8, React Router 7. Zero heavy UI frameworks — every component is handcrafted for speed, clarity and brand consistency. |
| **Conversion-Optimised Landing** | Hero, process, portfolio highlights, testimonials, trust badges and a sticky CTA flow designed to convert visitors into qualified leads. |
| **Portfolio & Case Studies** | Dynamic `/projects` grid with advanced filtering, project detail pages, cover/gallery, deliverables, tech stack, live/demo links, reviews and related work. |
| **Product Storefront** | `/buy/:slug` product pages with licence options, instant delivery, order tracking, download access and automated receipts. |
| **Two-Step Request Pipeline** | Contextual **Request Slide** (category → subcategory → budget → timeline) with intelligent prefill (e.g. *"Build me one"* from any project). Designed to replace generic contact forms for qualified project briefs. |
| **Plain Contact Form** | Dedicated `/contact` for general enquiries, licensing questions and invites — clean, equal-height, accessible with icon-chip inputs and inline validation. |
| **Event Media Gallery** | `/gallery` albums/events showcase with masonry grid, kind filters, year stats, full-featured lightbox (prev/next, thumbnails, keyboard + ESC). |
| **Client Portal** | Authenticated `/account` area: overview dashboard, requests, orders, profile, security. Login-gated actions throughout the site. |
| **Role-Based Admin CRM** | Full `/admin` console: overview, requests (full brief detail), orders, reviews, subscribers, users, projects, services, payments, emails, system settings and storage. |
| **Authentication & Sessions** | Local credential auth with persistent sessions, role separation (`member` / `admin`), sign-in alerts and secure session handling. |
| **Transactional Email System** | Local outbox + professional HTML/text templates (welcome, sign-in alert, receipt, invoice, request received, custom build plan). Ready to plug into SMTP. |
| **SEO-First Architecture** | Per-page titles/descriptions, canonical URLs, Open Graph + Twitter Cards, breadcrumbs + JSON-LD (Organisation, Project, BreadcrumbList, Offer, ImageGallery), `sitemap.xml`, `robots.txt`. |
| **Accessibility-First UI** | Semantic HTML, focus states, ARIA, keyboard-accessible modals/lightbox, high-contrast readable type, reduced-motion-aware where appropriate. |
| **Security Hardened** | Strict CSP, security headers (`public/_headers`), HTTPS-only, no secrets committed, safe Paystack client integration with demo fallback. |
| **Responsive & Performant** | Mobile-first, fluid grids, CSS variables, minimal JS, tree-shakeable, Vite-optimised builds. |

---

## Tech Stack

| Category | Technology | Notes |
|---|---|---|
| **Framework** | [React 19](https://react.dev/) | Modern hooks, concurrent-safe patterns |
| **Build Tool** | [Vite 8](https://vitejs.dev/) | Ultra-fast HMR, optimised production bundles |
| **Routing** | [React Router 7](https://reactrouter.com/) | Client-side routing with SPA fallback |
| **Styling** | Vanilla CSS (split per-area) | `nh.css`, `home.css`, `work.css`, `detail.css`, `header.css`, `contact.css`, `dash.css`, `admin.css`, `footer.css` |
| **Icons** | [Material Symbols Rounded](https://fonts.google.com/icons?icon.style=Rounded) | Loaded via Google Fonts, with explicit font-family insurance |
| **State/Data** | Custom local DB (`src/data/db.js`) | localStorage-backed tables, seed data, CRUD, relations |
| **Auth** | React Context (`src/auth.jsx`) | Session persistence, role guards |
| **Payments** | [Paystack](https://paystack.com/) | Client-side integration, DEMO fallback when key absent |
| **Email** | Local outbox (`src/data/emails.js`) | Template engine + send queue (SMTP-ready) |
| **SEO** | Custom helpers (`src/seo.js`) | Meta, OG/Twitter, JSON-LD |
| **Hosting** | [Netlify](https://www.netlify.com/) | `_headers`, `_redirects`, SPA routing, edge headers |
| **Package Manager** | npm | Lockfile included |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) **v20.0+** (LTS recommended)
- [npm](https://www.npmjs.com/) **v10.0+**

### Installation

```bash
# Clone the repository
git clone https://github.com/deep-design-hub/deep.git

# Navigate into the project
cd deep/new/main  # or project root as applicable

# Install dependencies
npm install
```

### Development

```bash
npm run dev
```

The dev server runs at `http://127.0.0.1:5173/` with hot module replacement (HMR) enabled.

### Production Build

```bash
npm run build
```

Build output is written to `dist/`. This is a fully static, deployable bundle.

### Local Preview

```bash
npm run preview
```

Serves the production build locally for pre-deployment verification.

---

## Environment Variables

Payments are optional. The site runs in **safe DEMO mode** by default if no public key is provided.

| Variable | Type | Required | Description |
|---|---|---|---|
| `VITE_PAYSTACK_PUBLIC_KEY` | `string` | No | Your Paystack public key (`pk_test_...` for sandbox, `pk_live_...` for production). When set, live checkout is attempted; otherwise `src/data/pay.js` resolves orders in DEMO mode with a provider reference so the full purchase/order/email flow remains testable. |

**Example `.env.local`:**

```env
VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_public_key_here
```

> **Security Note:** Only the **public** Paystack key is exposed client-side (by design). Never commit secret keys.

---

## Demo Accounts

Seeded accounts are created on first load (localStorage). Use these to explore the platform immediately:

| Role | Email | Password | Access |
|---|---|---|---|
| **Admin** | `admin@deepdesign.com` | `admin123` | Full `/admin` CRM + all account features |
| **Member** | `demo@deepdesign.com` | `demo123` | Standard `/account` portal (requests, orders, profile, security) |

Sign in at `/login`. Role-based guards protect `/admin` routes.

---

## Project Architecture

```
src/
├── pages/
│   ├── Home.jsx                # Landing page
│   ├── Portfolio.jsx           # /projects — work grid + filters (category/subcategory)
│   ├── Project.jsx             # Case study/detail + "Build me one" prefill
│   ├── Buy.jsx                 # Product purchase + checkout (Paystack/bank transfer)
│   ├── Gallery.jsx             # Albums/events showcase + full lightbox
│   ├── Service.jsx             # Services overview
│   ├── About.jsx               # About + process + testimonials
│   ├── Contact.jsx             # Direct contact (plain form)
│   ├── Login.jsx               # Sign in
│   ├── Register.jsx            # Sign up
│   ├── NotFound.jsx            # 404
│   ├── account/
│   │   ├── AccountLayout.jsx   # Shared account shell
│   │   ├── Dashboard.jsx       # Overview + quick actions
│   │   ├── Requests.jsx        # User project briefs
│   │   ├── Orders.jsx          # Purchases + downloads
│   │   ├── Profile.jsx         # Profile management
│   │   └── Security.jsx        # Password/session settings
│   └── admin/
│       ├── AdminLayout.jsx     # Admin shell + sidebar
│       ├── Overview.jsx        # CRM analytics
│       ├── Requests.jsx        # Full request detail + workflow
│       ├── Orders.jsx          # Sales/orders management
│       ├── Reviews.jsx         # Testimonials/reviews
│       ├── Subscribers.jsx     # Email list
│       ├── Users.jsx           # User management
│       ├── Projects.jsx        # Portfolio/products list
│       ├── ProjectEditor.jsx   # Rich project editor
│       ├── Services.jsx        # Services list
│       ├── ServiceEditor.jsx   # Service editor
│       ├── Payments.jsx        # Payments overview
│       ├── Emails.jsx          # Email templates/outbox
│       ├── System.jsx          # Global settings hub
│       └── system/             # System sub-sections (General, SEO, Payments, Email, Storage…)
├── components/
│   ├── Header.jsx              # Navigation + Request Slide panel
│   ├── ServiceModal.jsx        # Reusable popup picker (categories/subs/budget/timeline)
│   ├── Footer.jsx              # Site footer + links
│   ├── PageStamp.jsx           # Decorative page stamp
│   ├── Stars.jsx               # Rating component
│   └── admin/
│       ├── MediaPicker.jsx     # Media library picker
│       └── RowMenu.jsx         # Table row actions
├── data/
│   ├── db.js                   # Tiny persistent table engine (localStorage)
│   ├── index.js                # Data exports/bootstrap
│   ├── site.js                 # Site config (name, domain, contact)
│   ├── home.js                 # Home page content
│   ├── projects.js             # Projects, case studies, products (+ category/subcategory)
│   ├── services.js             # Services catalogue
│   ├── requests.js             # Request pipeline, CATEGORIES, BUDGET/TIMELINE options
│   ├── requestPanel.js         # Programmatic open/prefill of Request Slide
│   ├── orders.js               # Orders model + helpers
│   ├── users.js                # Users/auth data + helpers
│   ├── reviews.js              # Reviews/testimonials
│   ├── subscribers.js          # Newsletter subscribers
│   ├── emails.js               # Transactional templates + outbox
│   ├── pay.js                  # Paystack integration (DEMO fallback)
│   ├── albums.js               # Gallery albums/events
│   ├── blog.js                 # Blog content (seed)
│   ├── about.js                # About page data
│   ├── socials.js              # Social links + icons
│   ├── programs.js             # Programs/offerings
│   ├── system.js               # System config
│   └── admin.js                # Admin helpers
├── auth.jsx                    # Auth context (isLoggedIn, user, role, guards)
├── seo.js                      # SEO helpers (setMeta, JSON-LD, canonical)
├── headerRuntime.js            # Vanilla header/panel/loader + request slide runtime
├── footerRuntime.js            # Footer/runtime helpers
├── revealRuntime.js            # Scroll reveal/animations
├── homeRuntime.js              # Home page interactions
├── pay.js                      # Payment helpers
├── contact.css, work.css, ...  # Area-scoped styles
└── main.jsx                    # App entry point (Router + AuthProvider)
```

---

## Routing

| Path | Type | Description |
|---|---|---|
| `/` | Public | Home |
| `/projects` | Public | Portfolio/work grid (filters: category, subcategory, search, tags) |
| `/project/:slug` | Public | Project/case study detail + *Build me one* CTA (prefills Request Slide) |
| `/buy/:slug` | Public | Product purchase page (licences, pricing, checkout) |
| `/gallery` | Public | Event/album media gallery + lightbox |
| `/services` | Public | Services catalogue |
| `/about` | Public | Studio/about page |
| `/contact` | Public | Direct contact form |
| `/login` | Public | Sign in (noindex) |
| `/register` | Public | Sign up (noindex) |
| `/account` | Protected (Member/Admin) | Account dashboard |
| `/account/requests` | Protected | My project briefs/requests |
| `/account/orders` | Protected | My orders + downloads |
| `/account/profile` | Protected | Edit profile |
| `/account/security` | Protected | Security settings |
| `/admin` | Protected (Admin only) | Admin overview |
| `/admin/*` | Protected (Admin only) | CRM sections (requests, orders, reviews, subscribers, users, projects, services, payments, emails, system) |
| `*` | Public | 404 Not Found |

SPA fallback is handled via `public/_redirects` for static hosting.

---

## Data Layer & Persistence

All application data is **browser-persisted** via a lightweight table engine in [`src/data/db.js`](src/data/db.js) (localStorage). This design keeps the site **fully static** while powering complex workflows (requests, orders, auth, reviews, content management).

- **Table-based**: `users`, `projects`, `requests`, `orders`, `reviews`, `subscribers`, `services`, `albums`, `blog`, `emails`, `system`, etc.
- **Auto-seeded**: Rich, production-ready seed data on first load (no external API required).
- **CRUD + relations**: IDs, timestamps, soft fields, filtering, search helpers.
- **Portable**: Engine shape mirrors a typical ORM/DB adapter — can be swapped for a REST/GraphQL backend with minimal refactor.
- **Per-browser storage**: Ideal for a single-studio deployment/demo; data persists across sessions on the same device.

> **Note:** Clearing localStorage resets seeded/demo content. This is expected for a static-first studio build.

---

## Payments

Two checkout paths are supported on `/buy/:slug`:

1. **Paystack (Recommended)** — Client-side charge via `src/data/pay.js`. If `VITE_PAYSTACK_PUBLIC_KEY` is present, the Paystack popup is initialised with live/test keys. On success, an order is created, receipt emailed (local outbox), and paid orders remain downloadable in `/account/orders`.
2. **Bank Transfer (Manual)** — Displays configurable transfer instructions (editable in Admin → System → Payments). Orders are marked `pending` until manually confirmed in Admin → Orders.

**Safety:** When the env var is **missing**, the integration runs in **DEMO mode**: it resolves immediately with a synthetic provider reference so the full end-to-end flow (order creation → email → receipt → account visibility) is fully testable without touching real money.

**CSP:** `public/_headers` allows `https://js.paystack.co` for Paystack scripts.

---

## Request Pipeline

The studio uses a **single source of truth** for project briefs: the **Request Slide** (header panel `#requestPanel`).

### Structure

- **Category → Subcategory (two-step)**: Organised service taxonomy (Web, Graphics, UI/UX, App, Brand, Marketing/Management, Video/Motion, Other). Includes domain/hosting, portfolio, eCommerce, landing, blog, web app, site update/redesign, logos, social kits, packaging, etc.
- **Budget + Timeline**: Standardised option sets (`BUDGET_OPTIONS`, `TIMELINE_OPTIONS`) rendered via [`ServiceModal.jsx`](src/components/ServiceModal.jsx) (reusable popup picker with `title`, `tag`, `tagIcon`, `emptyIcon`).
- **Intelligent Prefill**: `openRequestPanel(opts)` accepts `{ category, subcategory, project }`. The **"Build me one"** button on [`Project.jsx`](src/pages/Project.jsx) dispatches a prefill (CustomEvent `dd:prefillRequest`) so the slide opens with the correct service context and shows *"Building: <Project Title>"*.
- **Normalisation**: [`submitRequest()`](src/data/requests.js) normalises `service`, `budget`, `timeline`, `category`, `subcategory`, `projectRef`, `source` (ensures backward compatibility with older records).
- **Contact Separation**: [`/contact`](src/pages/Contact.jsx) is **plain direct contact** only (Full name, Email, Company, Message). Submissions store `service: "Contact message"`, `budget: "Not sure yet"`, `source: "contact"`. It explicitly directs qualified briefs to the Request Slide.

**Runtime:** [`src/headerRuntime.js`](src/headerRuntime.js) powers the slide, validates required fields (including hidden ServiceModal inputs), reads `timeline` + `subcategory`, and submits via the data layer. [`src/data/requestPanel.js`](src/data/requestPanel.js) exposes imperative open/prefill.

---

## Gallery & Media

[`/gallery`](src/pages/Gallery.jsx) is a **personal/event media showcase** (not a shop). It uses a dense, editorial masonry grid (`.nh-albs`) with responsive columns and feature placements (`nth-child(5n+1)` 2×2, `nth-child(3n+3)` wide). Features include:

- **Albums/Events**: Grouped by kind (Event, Shoot, Brand, BTS, etc.)
- **Kind Filters**: Toggle by media kind with live counts
- **Stats Bar**: Albums, photos, kinds, earliest year
- **Full Lightbox**: `.nh-abv` overlay with prev/next, thumbnail strip, ESC/arrow key navigation, click-to-close
- **SEO**: [`ImageGallery`](https://schema.org/ImageGallery) JSON-LD per relevant views
- **CTAs**: Commission/event design links into the Request Slide (not `/gallery` shop routes)

CSS lives in [`src/detail.css`](src/detail.css) (gallery album/lightbox styles). Data in [`src/data/albums.js`](src/data/albums.js).

---

## Client Portal (Account)

Authenticated area under `/account` with admin-style shell consistency:

- **Dashboard** ([`Dashboard.jsx`](src/pages/account/Dashboard.jsx)) — Quick stats (requests, orders), recent activity, CTAs ("New request", "Browse work", "Browse products").
- **Requests** ([`Requests.jsx`](src/pages/account/Requests.jsx)) — List + status of submitted briefs, linked to Request Slide.
- **Orders** ([`Orders.jsx`](src/pages/account/Orders.jsx)) — Purchases, payment status, provider refs, licence, download access for paid items.
- **Profile** ([`Profile.jsx`](src/pages/account/Profile.jsx)) — Name, email, company, bio, avatar, location, website, social links, preferences (newsletter/marketing). Clean, professional layout.
- **Security** ([`Security.jsx`](src/pages/account/Security.jsx)) — Change password, session info, sign-in alerts, security checklist.

All account CTAs use canonical routes (`/projects` for work/shop browsing). Login-gated via [`useAuth()`](src/auth.jsx).

---

## Admin CRM

Powerful operations console at `/admin` (role: `admin` only):

| Section | Purpose |
|---|---|
| **Overview** | KPIs (requests, orders, revenue, users, reviews), recent activity, pipeline health |
| **Requests** | Full detailed view per brief: contact, category, subcategory, budget, timeline, project reference, message, source, IP/user, status workflow (new/in review/quoted/accepted/closed) |
| **Orders** | Sales management, status (pending/paid/failed/refunded), method, provider ref, licence, fulfilment |
| **Reviews** | Manage testimonials (approve/publish, featured, ratings) |
| **Subscribers** | Newsletter list, export-ready, status |
| **Users** | User directory, roles, search, create/edit ([`UserEditor.jsx`](src/pages/admin/UserEditor.jsx)) |
| **Projects** | Portfolio/products catalogue ([`Projects.jsx`](src/pages/admin/Projects.jsx)) |
| **Project Editor** | Rich editor ([`ProjectEditor.jsx`](src/pages/admin/ProjectEditor.jsx)): cover, gallery, tags, category/subcategory, deliverables, links, pricing/licence (for buyables), SEO fields |
| **Services** | Services management + editor |
| **Payments** | Payments log, methods, configuration overview |
| **Emails** | Templates + local outbox ([`Emails.jsx`](src/pages/admin/Emails.jsx)), ready for SMTP wiring |
| **System** | Central settings hub ([`System.jsx`](src/pages/admin/System.jsx)) with sub-sections: General, Appearance, SEO, Payments, Email, Security, Storage, Cronjobs, Logs, Info, Translations, SectionForm |

Admin uses a consistent dark/neutral UI (`src/admin.css`) with tables, filters, search, bulk actions and [`RowMenu.jsx`](src/components/admin/RowMenu.jsx).

---

## SEO, Metadata & Indexing

[`src/seo.js`](src/seo.js) centralises all SEO concerns:

- **Per-page meta**: Dynamic `title`, `description`, `canonical` (canonical domain: `https://deep-design.netlify.app`)
- **Open Graph**: `og:title`, `og:description`, `og:type`, `og:url`, `og:image`, `og:site_name`
- **Twitter Cards**: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
- **JSON-LD**: `BreadcrumbList`, `Organization`, `Project`/`CreativeWork`, `Offer` (products), `ImageGallery` (gallery)
- **Robots**: [`public/robots.txt`](public/robots.txt) — allows public pages, disallows auth/admin (`/login`, `/register`, `/account`, `/admin`) to prevent thin/indexing of private routes
- **Sitemap**: [`public/sitemap.xml`](public/sitemap.xml) — includes public marketing routes (`/`, `/projects`, `/project/*`, `/buy/*`, `/gallery`, `/services`, `/about`, `/contact`). Private/auth routes excluded.

**Best Practice:** Auth/login/register are marked `noindex` via SEO helpers to avoid indexing gated pages.

---

## Performance, Accessibility & Security

| Area | Implementation |
|---|---|
| **Performance** | Vite code-splitting ready, minimal CSS, no heavy runtime libs, image lazy/optimised paths, static-first (no SSR overhead), build ~2–4s. |
| **Accessibility** | Semantic landmarks, labelled inputs, focus rings, keyboard nav (modals, lightbox), ARIA roles/live regions (`role="status"`), icon labels, sufficient colour contrast. |
| **Security Headers** | [`public/_headers`](public/_headers): CSP allows `https://js.paystack.co`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` restrictive, HSTS-ready. |
| **SPA Routing** | [`public/_redirects`](public/_redirects): `/* /index.html 200` for clean client routes. |
| **Secrets** | Zero `.env` secrets committed. Only `VITE_*` public vars exposed. |
| **Input Safety** | Form validation, required fields, checkbox consent, normalised inputs, XSS-resistant (React escaping). |
| **Mojibake Safety** | UTF-8 enforced (`index.html`, headers). Fix utility available: `C:\Users\DEEPDE~1\AppData\Local\Temp\opencode\fix-mojibake.mjs <dir> [--apply]` (for bulk text normalisation if ever needed). |

---

## Deployment

This project is **static-first** and deploys cleanly to any static host. Recommended: [Netlify](https://www.netlify.com/).

### Netlify (Recommended)

1. Push repo to GitHub (`deep-design-hub/deep`)
2. Connect to Netlify → Import repo → Branch `main`
3. Build command: `npm run build`
4. Publish directory: `dist/`
5. (Optional) Add env var: `VITE_PAYSTACK_PUBLIC_KEY` in Site Settings → Environment Variables
6. Deploy

`_headers` and `_redirects` in `public/` are automatically picked up.

### Other Hosts

- **Vercel**: `vercel.json` included (SPA/static config)
- **Cloudflare Pages**: Build `npm run build`, output `dist/`
- **GitHub Pages**: Requires base path config if not root; Netlify recommended

### Pre-Deploy Checklist

- [ ] `npm run build` passes with no errors
- [ ] `npm run preview` smoke-tested (routes, forms, lightbox, checkout demo)
- [ ] SEO: canonical/domain correct (`deep-design.netlify.app`)
- [ ] Payments: test DEMO + (if live) test key mode
- [ ] Auth: login/register/admin guards work
- [ ] Responsive: mobile/tablet/desktop verified
- [ ] Contact + Request Slide validation works
- [ ] Gallery lightbox + albums render correctly

---

## Scripts

| Script | Command | Purpose |
|---|---|---|
| `dev` | `npm run dev` | Start Vite dev server (localhost:5173) |
| `build` | `npm run build` | Production build → `dist/` |
| `preview` | `npm run preview` | Preview production build locally |

---

## Roadmap & TODO

The following items are tracked to complete the professionalisation + requested features (restored per your feedback):

### A. Request Slide — Professional Taxonomy (High Priority)
- [ ] **Timeline field in Header slide** — Add `Timeline` ServiceModal/picker to header request form (state `tml`, read in `headerRuntime.js`, submit via `submitRequest`).
- [ ] **Service Categories + Subcategories** — Expand `CATEGORIES` in [`src/data/requests.js`](src/data/requests.js) with full taxonomy: Web (portfolio, eCommerce, blog, business site, landing page, site update/redesign, **domain & hosting purchase/update**, web app, SaaS), Graphics (logos, flyers/posters, badges, social media kits, packaging/labels, brand graphics), UI/UX (wireframes, prototypes, design systems), App (mobile, cross-platform, API/UI), Brand (identity, brand guidelines, tone), Marketing/Management (social, SEO/content, email), Video/Motion (reels, explainers, logo animation), Other (consultation, audit).
- [ ] **Two-step ServiceModal in Header** — Wire category → subcategory flow in [`Header.jsx`](src/components/Header.jsx) (`svc` + `sub` states), persist selection, reset correctly on close/reset.
- [ ] **Header runtime sync** — Update [`src/headerRuntime.js`](src/headerRuntime.js) to read `[name=timeline]` and `[name=subcategory]` (hidden inputs) + validate.
- [ ] **Data model** — Extend `submitRequest` to persist `category`, `subcategory`, `timeline` on every request (backward-compatible with existing rows).
- [ ] **Prefill API harden** — [`openRequestPanel(opts)`](src/data/requestPanel.js) should accept `{ category, subcategory, project, projectTitle, ref }` and set UI state + show context ("Building: …").
- [ ] **Project → Prefill** — [`Project.jsx`](src/pages/Project.jsx): "Build me one" passes `category`, `subcategory`, `project` (slug/id), `projectTitle` and opens request slide with visible project reference.

### B. Portfolio — Left-Slide Filters (Restore + Implement)
- [ ] **Restore to TODO + implement** — Reintroduce the requested left-slide filter panel for `/projects` (toggle on/off, slides in from left, slides back when closed). Must be toggleable via a filter button (hamburger/filter icon) in portfolio toolbar.
- [ ] **Filter structure** — Filters by `Category`, `Subcategory`, `Tags`, `Type` (project/product), `Featured`, `Year` (if available). Multi-select + clear all.
- [ ] **UX** — Slide-in drawer with backdrop, ESC to close, click outside to close, active filter count badge, mobile-friendly (full-width sheet). Smooth CSS transitions.
- [ ] **State persistence (optional)** — Remember open/closed state per session or respect user toggle.
- [ ] **Update Portfolio.jsx** — Integrate drawer + filter logic with existing grid/search. Keep URL-friendly if feasible (query params) or local state.
- [ ] **Accessibility** — Focus trap, `aria-expanded`, `aria-controls`, close button, labelled regions.

### C. Projects Data — Enrich + Expand
- [ ] **Add category + subcategory to EVERY project** in [`src/data/projects.js`](src/data/projects.js) (map to new taxonomy, consistent slugs).
- [ ] **Add MORE projects** — Expand portfolio with realistic case studies (web, eCom, landing, brand, UI kits). Include covers, galleries, deliverables, tags, links (live/demo), reviews where applicable.
- [ ] **Portfolio filters/tags** — Surface category/subcategory as pills/tags on cards + in filter drawer.

### D. Admin — Requests Full Detail
- [ ] **Requests.jsx (Admin)** — Render full detailed info: `category`, `subcategory`, `timeline`, `budget`, `projectRef`/project, `ref`, `message` (preserve line breaks), `source`, `userId`, contact, timestamps, status history. Expandable row or detail panel with clean sections.

### E. Shop/Gallery Route Consistency (Clean-up)
- [ ] **Buy.jsx** — Audit and fix any remaining `/gallery` CTAs/links → point to `/projects` (work/shop browse) where appropriate (keep Gallery as media showcase only).
- [ ] **Admin** — `Orders.jsx`, `Reviews.jsx`, `Storage.jsx` (admin/system) — update "Visit the shop"/"Open a project"/"Browse the gallery" CTAs to correct canonical routes (`/projects`, `/admin/projects`, etc.). Remove `/gallery` shop references.

### F. Header — Account Button Polish
- [ ] **Verify `btn-account`** in [`Header.jsx`](src/components/Header.jsx) — Ensure visible, accessible, correct auth state (logged in/out), avatar/name fallback, dropdown if present, mobile-friendly. Polish spacing/alignment.

### G. Build, QA, Mojibake & Final Push
- [ ] **Typecheck/Lint sanity** — Run build + quick smoke (forms, modals, gallery, request prefill, checkout DEMO).
- [ ] **Mojibake check** — Run `fix-mojibake.mjs` against `new/main` in `--check`/`--apply` if needed (UTF-8 verified).
- [ ] **Final production build** — Clean build, verify `dist/` assets, no console errors/warnings.
- [ ] **Push to `deep main`** — Sync `new/main` → staging clone (preserve `.git`), `git add -A`, commit with clear message, `git push --force deep main` (per established push recipe).

### H. Legacy Pending (From Prior Batches)
- [ ] **About page additions** — Expand content/sections as planned.
- [ ] **Blog, Meet, Coffee pages + Header More dropdown** — `blog.js` ready; create `tips.js` + Coffee page, wire More dropdown in Header.
- [ ] **Coffee payments** — Implement flow if applicable.
- [ ] **Buy login gate + professional email/invoice templates** — Enforce login gate on buy/checkout where intended, polish invoice/email templates (HTML professional).
- [ ] **Notifications, full-page detail views, Admin Pages Manager, Profile completion, professional lists** — Implement remaining UX polish.
- [ ] **SEO indexing notes + cache-clear** — Final verification, canonical consistency, sitemap/robots validated.
- [ ] **Force-push only `new/main/` to `deep main`** — Maintain boundary (do not push legacy root repo files).

---

## Contributing

This is the source for Deep Design Dev (personal studio). Contributions are welcome if they align with the design system, architecture (static-first, data-driven, accessibility-first). Please:

1. Fork the repo
2. Create a feature branch (`feat/your-feature`)
3. Keep code style consistent (vanilla CSS, existing patterns, no unnecessary comments)
4. Test locally (`npm run dev` + `npm run build`)
5. Open a Pull Request against `main` with a clear description

---

## License

Licensed under the **ISC License**. See [LICENSE](LICENSE) (if present) for details.

**Brand & Content:** All logos, artwork, copy, case studies, product names and brand assets are the property of **Deep Design Dev / Abubakar Musa** and may not be reused or redistributed without permission.

---

## Brand

- **Name:** Deep Design Dev
- **Creator:** Abubakar Musa
- **Domain (Canonical):** [`https://deep-design.netlify.app`](https://deep-design.netlify.app)
- **Tagline:** Design. Build. Ship. — high-converting websites, brands and digital products.