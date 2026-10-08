/*
 * admin.js — admin account info + dashboard aggregates.
 * The admin login itself lives in the users table (seeded admin account);
 * this module only exposes what an /admin screen would render.
 */
import { listUsers } from "./users.js";
import { listRequests, countNewRequests } from "./requests.js";
import { listOrders, paidRevenue } from "./orders.js";
import { listAll as listReviews } from "./reviews.js";
import { listSubscribers } from "./subscribers.js";
import { outboxAll } from "./emails.js";

export const ADMIN = {
  email: "admin@deepdesign.com",
  password: "admin123",
  role: "admin",
  name: "Deep Design Admin"
};

export function dashboardStats() {
  const orders = listOrders();
  const requests = listRequests();
  return {
    users: listUsers().length,
    requests: requests.length,
    newRequests: countNewRequests(),
    orders: orders.length,
    paidOrders: orders.filter((o) => o.status === "paid").length,
    revenue: paidRevenue(),
    reviews: listReviews().length,
    subscribers: listSubscribers().length,
    emailsQueued: outboxAll().length
  };
}

/* Newest activity across every table — feed for an admin "latest" list */
export function recentActivity(limit = 8) {
  const items = [
    ...listRequests().map((r) => ({
      type: "request",
      label: `${r.name} · ${r.service}`,
      ref: r.ref,
      at: r.created_at
    })),
    ...listOrders().map((o) => ({
      type: "order",
      label: `${o.project_title} · ${o.currency} ${o.amount} (${o.status})`,
      ref: o.ref,
      at: o.created_at
    })),
    ...listUsers().map((u) => ({ type: "user", label: `${u.name} · ${u.email}`, ref: u.id, at: u.created_at })),
    ...listReviews().map((r) => ({ type: "review", label: `${r.name} on ${r.project_slug} · ${r.stars}★`, ref: r.id, at: r.created_at }))
  ];
  return items
    .sort((a, b) => String(b.at).localeCompare(String(a.at)))
    .slice(0, limit);
}
