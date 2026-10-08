/*
 * orders.js — purchases of for-sale projects (buy page + Paystack flow).
 * Statuses: pending → paid | failed | refunded  (mirrors a payments table).
 */
import { openTable, newRef } from "./db";

const orders = openTable("orders", []);

export const ORDER_STATUSES = ["pending", "paid", "failed", "refunded"];

export function createOrder({ user, project, amount, currency, method, license }) {
  return orders.insert({
    ref: newRef("DDH"),
    user_name: (user && user.name) || "",
    user_email: (user && user.email) || "",
    project_slug: (project && project.slug) || "",
    project_title: (project && project.title) || "",
    amount: Number(amount) || 0,
    currency: currency || "USD",
    license: license || "",
    method: method || "paystack",
    provider_ref: "",
    status: "pending"
  });
}

export function getOrder(ref) {
  return orders.find((o) => o.ref === ref) || orders.find((o) => o.provider_ref === ref) || null;
}

export function markOrder(id, status, extra = {}) {
  if (!ORDER_STATUSES.includes(status)) return null;
  return orders.update(id, { status, ...extra });
}

export function listOrders() {
  return orders.all().sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
}

export function ordersFor(email) {
  const mail = String(email || "").toLowerCase();
  return listOrders().filter((o) => o.user_email === mail);
}

export function paidRevenue() {
  return orders
    .filter((o) => o.status === "paid")
    .reduce((sum, o) => sum + (Number(o.amount) || 0), 0);
}

/* Admin helpers */
export function deleteOrder(id) {
  return orders.remove(id);
}
