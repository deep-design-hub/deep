![Deep Design Dev](public/assets/imgs/logo/black-deep.png)

# Deep Design Dev

The studio site, storefront and client system for **Deep Design Dev** — a one-person design & development studio by Abubakar Musa.

Built as a fully client-side React app with a persistent browser-based data layer, so the whole experience runs on static hosting with zero backend: case studies, a product shop, a request pipeline, an account dashboard and a complete admin console.

---

## Highlights

| | |
|---|---|
| ⚡ **Sites & apps** | Fast, accessible React 19 + Vite build — `npm run build` → static `dist/` |
| 🛍️ **Products & shop** | Sellable templates/UI kits with licences, instant delivery, Paystack + bank transfer |
| 📋 **Request pipeline** | Contextual request slide (category → sub-category + budget + timeline), 24h reply flow, quotes |
| 💼 **Admin console** | Full CRM dashboard: requests, orders, reviews, subscribers, users, projects, services, payments, system settings |
| 👤 **Account area** | Dashboard, requests, orders, profile, security — every action login-gated |
| 🔒 **Auth** | Local credential auth with sessions, role-based access (member/admin) |
| 📧 **Transactional emails** | Local outbox + professional templates (welcome, sign-in alert, receipt, invoice, request received, custom build plan) |
| 🔎 **SEO-ready** | Per-page meta, Open Graph, Twitter cards, breadcrumb + JSON-LD, sitemap, robots |
| 🖼️ **Media gallery** | Event/album showcase with a full lightbox viewer |
| 📝 **Content layer** | Projects, case studies, reviews, services, blog, albums, testimonials — all data-driven |

---

## Tech Stack

| Layer | Choice |
| --- | --- |
| Framework | [React 19](https://react.dev) + [Vite](https://vitejs.dev) 8 |
| Routing | [React Router 7](https://reactrouter.com) |
| Styling | Hand-rolled CSS modules (`home.css`, `nh.css`, `detail.css`, `header.css`, `admin.css`…) |
| Icons | Material Symbols Rounded (Google Fonts) |
| Data | LocalStorage-backed mini-DB (`src/data/db.js`) with seed content |
| Payments | [Paystack](https://paystack.com) (client-side), demo-mode fallback, bank-transfer flow |
| Hosting | Netlify (see `netlify.toml`, `public/_headers`) |

---

## Getting Started

### Prerequisites

- Node.js **20+**
- npm **10+**

### Install & run

```bash
npm install
npm run dev        # local dev server → http://127.0.0.1:5173
npm run build      # production build → dist/
npm run preview    # preview the production build
```

### Environment variables

Optional — for **live** payments only. Without it the site runs in safe demo mode.

| Variable | Purpose |
| --- | --- |
| `VITE_PAYSTACK_PUBLIC_KEY` | Paystack public key (`pk_live_…` or `pk_test_…`). When present, real charges are attempted; otherwise orders complete in demo mode. |

```bash
# .env
VITE_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxx
```

---

## Signing in

Seeded demo accounts (stored locally):

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@deepdesign.com` | `admin123` |
| Member | `demo@deepdesign.com` | `demo123` |

Visit `/login` to sign in. The admin console lives under `/admin`, the account area under `/account`.

---

## Project Structure

```
src/
├── pages/
│   ├── Home.jsx            # landing page
│   ├── Portfolio.jsx       # /projects — work grid + filters
│   ├── Project.jsx         # project case-study detail
│   ├── Buy.jsx             # product purchase page
│   ├── Gallery.jsx         # event/album media gallery + lightbox
│   ├── Service.jsx         # services
│   ├── About.jsx
│   ├── Contact.jsx         # direct-message contact form
│   ├── Login.jsx / Register.jsx
│   ├── account/            # user dashboard, requests, orders, profile, security
│   └── admin/              # CRM console (projects, requests, orders, users …)
├── components/
│   ├── Header.jsx          # nav + request slide panel
│   ├── ServiceModal.jsx    # popup picker (service/budget/timeline)
│   ├── Footer.jsx, PageStamp.jsx, Stars.jsx
│   └── admin/              # table, media picker, editors
├── data/                   # the browser data layer
│   ├── db.js               # tiny persistent table engine (localStorage)
│   ├── requests.js         # request pipeline + option sets
│   ├── projects.js         # projects / case studies / products
│   ├── orders.js, users.js, reviews.js, subscriptions.js
│   ├── emails.js           # transactional templates + local outbox
│   ├── pay.js              # Paystack integration (demo fallback)
│   ├── blog.js, albums.js, about.js, home.js, site.js
│   └── requestPanel.js     # programmatic open/prefill of the request slide
├── auth.jsx                # auth context (session, roles)
├── seo.js                  # per-page meta + JSON-LD helpers
├── headerRuntime.js        # vanilla header/panel/loader runtime
└── *.css                   # per-area stylesheets
```

### Routes

- Marketing: `/`, `/projects`, `/project/:slug`, `/buy/:slug`, `/gallery`, `/services`, `/about`, `/contact`
- Auth + account: `/login`, `/register`, `/account`, `/account/requests`, `/account/orders`, `/account/profile`, `/account/security`
- Admin: `/admin` (overview, requests, orders, reviews, subscribers, users, projects, services, payments, system)

---

## Data & Persistence

Everything is stored **in the browser** through a small table engine in `src/data/db.js` (localStorage). This keeps the public site fully static while still powering real workflows (requests, orders, auth, reviews, content editing). Content tables ship with rich seed data, so the site is complete on first load.

> **Note:** because storage is per-browser, this is a single-user local setup. The engine is shaped like a real DB adapter so a backend (API + SQL) can be dropped in without rewriting the layers above it.

---

## Payments

- **Paystack** — the preferred flow. Triggered by `src/data/pay.js`; set `VITE_PAYSTACK_PUBLIC_KEY` for live charges, otherwise demo mode resolves immediately with a fake provider reference so the full purchase loop (order → email → receipt) is still testable.
- **Bank transfer** — manual instructions rendered on the buy page (configurable content in admin → System → Payments).
- Orders record the method, provider reference and licence, and paid orders stay downloadable forever from `/account/orders`.

---

## Admin Console

The `/admin` area powers the whole content + CRM side:

- **Requests** — full detail on every brief (contact info, category, sub-category, budget, timeline, project reference, message, source, status workflow).
- **Orders, Reviews, Subscribers, Users** — full read/manage with search, filtering and row actions.
- **Projects & Services** — rich editors (cover, gallery, deliverable list, reviews, service menu).
- **Payments & System** — environment note, currency, Paystack key/mode, SMTP placeholders, sitemap ping and background-job registry.

---

## SEO

`src/seo.js` centralises per-page SEO: titles, meta descriptions, canonical URLs, Open Graph + Twitter cards and JSON-LD (breadcrumbs, Offer, ImageGallery). `public/sitemap.xml` and `public/robots.txt` are maintained alongside. Every route targets the canonical domain `https://deep-design.netlify.app`.

---

## Deployment

The project deploys as a static site — `npm run build` produces the `dist/` folder Netlify serves:

```bash
npm run build
npm run preview   # verify locally, then publish dist/
```

`public/_headers` includes the Netlify security headers (including the CSP that allows `https://js.paystack.co`), and `_redirects` handles SPA fallback.

---

## Contributing

This is a personal studio build, but the repo is open. Fork it, keep the structure (pages / components / data), and open a PR against `main`.

---

## License

Licensed under the ISC license — see [LICENSE](#). Brand and content belong to Deep Design Dev.