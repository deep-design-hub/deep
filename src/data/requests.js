/*
 * requests.js — project request submissions (header request panel,
 * contact page form, "build me one" flows). One row per submission.
 */
import { openTable, newRef } from "./db";

const requests = openTable("requests", []);

export const REQUEST_STATUSES = ["new", "reviewing", "quoted", "won", "declined"];

/* Contact form option values → display labels */
export const SERVICE_LABELS = {
  brand: "Brand Identity",
  web: "Web Development",
  product: "UI/UX Design",
  graphic: "Graphic Design",
  licensing: "Licensing / Template",
  other: "Other"
};
export const BUDGET_LABELS = { small: "Under $1k", mid: "$1k – $5k", large: "$5k+" };
export const TIMELINE_LABELS = {
  asap: "As soon as possible",
  m1: "Within a month",
  m3: "1 – 3 months",
  explore: "Just exploring"
};

/* Popup-picker options (icon + desc), same shape as SITE.requestServices */
export const BUDGET_OPTIONS = [
  { value: "small", label: "Under $1k", icon: "battery_1_bar", desc: "Flyers, posts, small edits, quick wins" },
  { value: "mid", label: "$1k – $5k", icon: "battery_3_bar", desc: "Full sites, brand identities, products" },
  { value: "large", label: "$5k+", icon: "battery_full", desc: "Web apps, design systems, big builds" },
  { value: "", label: "Not sure yet", icon: "explore", desc: "Tell me the outcome, we'll price it" }
];

export const TIMELINE_OPTIONS = [
  { value: "asap", label: "As soon as possible", icon: "bolt", desc: "I'm ready to start now" },
  { value: "m1", label: "Within a month", icon: "calendar_month", desc: "Short runway, fixed date" },
  { value: "m3", label: "1 – 3 months", icon: "event_available", desc: "Room for discovery and reviews" },
  { value: "explore", label: "Just exploring", icon: "travel_explore", desc: "Researching — no rush yet" }
];

export function submitRequest({ name, email, service, message, budget, source, userId }) {
  const row = requests.insert({
    ref: newRef("REQ"),
    name: String(name || "").trim(),
    email: String(email || "").trim().toLowerCase(),
    service: SERVICE_LABELS[service] || String(service || "").trim() || "Other",
    message: String(message || "").trim(),
    budget: BUDGET_LABELS[budget] || String(budget || "").trim() || "Not sure yet",
    source: source || "site",
    user_id: userId || "",
    status: "new"
  });
  return row;
}

export function listRequests() {
  return requests.all().sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
}

export function requestsFor(email) {
  const mail = String(email || "").toLowerCase();
  return listRequests().filter((r) => r.email === mail);
}

export function updateRequestStatus(id, status) {
  if (!REQUEST_STATUSES.includes(status)) return null;
  return requests.update(id, { status });
}

export function countNewRequests() {
  return requests.filter((r) => r.status === "new").length;
}

/* Admin helpers */
export function deleteRequest(id) {
  return requests.remove(id);
}
