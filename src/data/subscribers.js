/*
 * subscribers.js — newsletter signups (home page form).
 */
import { openTable } from "./db";

const subscribers = openTable("subscribers", []);

export function subscribe(email) {
  const mail = String(email || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail)) {
    return { ok: false, message: "That email doesn't look right." };
  }
  if (subscribers.find((s) => s.email === mail)) {
    return { ok: true, message: "You're already on the list." };
  }
  subscribers.insert({ email: mail, status: "active" });
  return { ok: true, message: "You're on the list. Check your inbox." };
}

export function listSubscribers() {
  return subscribers.all().sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
}

/* Admin helpers */
export function deleteSubscriber(id) {
  return subscribers.remove(id);
}
