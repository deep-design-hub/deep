<div align="center">
  <img src="public/assets/imgs/logo/black-deep.png" alt="Deep Design Dev" width="220" />
</div>

# Deep Design Dev

**[https://deep-design.netlify.app](https://deep-design.netlify.app)** — Design. Build. Ship.

The studio platform for Abubakar Musa — portfolio, product shop, project briefs, client portal and admin CRM. Built as a fast, static-first React app with a local data layer.

---

## Explore the Live Site

| Page | Description |
|---|---|
| [Home](https://deep-design.netlify.app/) | Hero, process, work highlights, testimonials |
| [Projects](https://deep-design.netlify.app/projects) | Portfolio grid with filters (category/subcategory) |
| [Gallery](https://deep-design.netlify.app/gallery) | Event/album media showcase + lightbox |
| [Services](https://deep-design.netlify.app/services) | Services catalogue |
| [About](https://deep-design.netlify.app/about) | Studio, approach, tools |
| [Contact](https://deep-design.netlify.app/contact) | Direct contact (briefs go to Request Slide) |
| [Login](https://deep-design.netlify.app/login) | Client sign in |
| [Register](https://deep-design.netlify.app/register) | Create account |

## Tech Stack

- React 19 + Vite 8 + React Router 7
- Vanilla CSS (area-scoped)
- Material Symbols Rounded
- localStorage-backed data layer (`src/data/db.js`)
- Paystack (client-side, DEMO fallback)
- Netlify static hosting

## Quick Start

```bash
npm install
npm run dev      # http://127.0.0.1:5173
npm run build    # dist/
npm run preview
```

## Demo Accounts

| Role | Email | Password |
|---|---|---|
| Admin | `admin@deepdesign.com` | `admin123` |
| Member | `demo@deepdesign.com` | `demo123` |

## Environment

```env
# Optional — enables live Paystack checkout
VITE_PAYSTACK_PUBLIC_KEY=pk_test_xxx
```

## Deploy

Build → publish `dist/` to Netlify/Vercel/Cloudflare Pages. `_headers` + `_redirects` included for CSP/SPA routing.

## License

ISC — brand/content © Deep Design Dev / Abubakar Musa.