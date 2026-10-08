/*
 * reviews.js — visitor/client reviews & star ratings per project.
 * Static seed reviews live inside data/projects.js (content); this table
 * stores everything visitors submit at runtime.
 */
import { openTable } from "./db";

const reviews = openTable("reviews", []);

const MIGRATED_KEY = "dd_reviews_migrated";

/* One-time import of reviews written by the old per-project localStorage
   keys (dd-rev-<slug>) so nothing users already submitted is lost. */
export function migrateLegacyReviews() {
  try {
    if (window.localStorage.getItem(MIGRATED_KEY)) return;
    const ls = window.localStorage;
    for (let i = 0; i < ls.length; i++) {
      const key = ls.key(i);
      if (!key || !key.startsWith("dd-rev-")) continue;
      const slug = key.slice(7);
      let list = [];
      try {
        list = JSON.parse(ls.getItem(key) || "[]");
      } catch (e) {
        continue;
      }
      list.forEach((r) => {
        if (!reviews.find((x) => x.project_slug === slug && x.body === r.body && x.name === r.name)) {
          reviews.insert({
            project_slug: slug,
            name: r.name || "",
            role: r.role || "Client",
            date: r.date || new Date().toISOString().slice(0, 10),
            stars: Number(r.stars) || 5,
            body: r.body || "",
            verified: !!r.verified,
            helpful: Number(r.helpful) || 0,
            _mine: true,
            user_id: "",
            source: "legacy"
          });
        }
      });
    }
    window.localStorage.setItem(MIGRATED_KEY, "1");
  } catch (e) {
    /* storage blocked — legacy import simply skipped */
  }
}

export function listFor(slug) {
  return reviews
    .filter((r) => r.project_slug === slug)
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))
    .map((r) => ({
      id: r.id,
      name: r.name,
      role: r.role,
      date: r.date,
      stars: r.stars,
      body: r.body,
      verified: r.verified,
      helpful: r.helpful || 0,
      _mine: !!r._mine
    }));
}

export function addReview({ slug, name, role, stars, body, userId, email }) {
  const row = reviews.insert({
    project_slug: slug,
    name: String(name || "").trim(),
    role: String(role || "").trim() || "Client",
    date: new Date().toISOString().slice(0, 10),
    stars: Math.max(1, Math.min(5, Number(stars) || 5)),
    body: String(body || "").trim(),
    verified: false,
    helpful: 0,
    _mine: true,
    user_id: userId || "",
    email: String(email || "").toLowerCase(),
    source: "site"
  });
  return listFor(slug);
}

export function markHelpful(id) {
  const row = reviews.byId(id);
  if (!row) return;
  reviews.update(id, { helpful: (Number(row.helpful) || 0) + 1 });
}

export function countFor(slug) {
  return reviews.filter((r) => r.project_slug === slug).length;
}

export function listAll() {
  return reviews.all().sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
}

/* Admin helpers */
export function deleteReview(id) {
  return reviews.remove(id);
}

/* Import old per-project reviews as soon as this module loads, so the very
   first listFor() call already includes everything users ever submitted. */
migrateLegacyReviews();
