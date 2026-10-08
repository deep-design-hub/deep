/*
 * users.js — users table + temporary auth (register / login / session).
 *
 * Storage: localStorage via db.js (swap db.js for the PHP API later and
 * every call here becomes a real server round-trip — same function names).
 *
 * Security note: passwords are obfuscated with a non-cryptographic digest
 * purely so they are not visible in plain text. Real authentication must
 * happen server-side (password_hash / JWT / sessions) once the PHP API
 * exists. This is the "temporary login" for the buying flow until then.
 */
import { openTable, weakHash } from "./db";

const SESSION_KEY = "dd_session";
const SESSIONS_KEY = "dd_sessions";
const PREFS_KEY = "dd_security_prefs";

const users = openTable("users", [
  {
    id: "usr_admin",
    name: "Deep Design Admin",
    email: "admin@deepdesign.com",
    password: weakHash("admin123"),
    role: "admin",
    status: "active"
  },
  {
    id: "usr_demo",
    name: "Demo Buyer",
    email: "demo@deepdesign.com",
    password: weakHash("demo123"),
    role: "customer",
    status: "active"
  }
]);

function publicUser(u) {
  if (!u) return null;
  const { password, ...rest } = u;
  return rest;
}

function setSession(id) {
  try {
    if (id) window.localStorage.setItem(SESSION_KEY, id);
    else window.localStorage.removeItem(SESSION_KEY);
  } catch (e) {
    /* storage blocked — session lives for this visit only */
  }
}

export function register({ name, email, password }) {
  const mail = String(email || "").trim().toLowerCase();
  if (!name || !mail || !password) return { ok: false, error: "All fields are required." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail)) return { ok: false, error: "That email doesn't look right." };
  if (String(password).length < 6) return { ok: false, error: "Password must be at least 6 characters." };
  if (users.find((u) => u.email === mail)) return { ok: false, error: "An account with that email already exists." };

  const row = users.insert({
    name: String(name).trim(),
    email: mail,
    password: weakHash(password),
    role: "customer",
    status: "active"
  });
  setSession(row.id);
  return { ok: true, user: publicUser(row), isNew: true };
}

export function login(email, password) {
  const mail = String(email || "").trim().toLowerCase();
  const user = users.find((u) => u.email === mail);
  if (!user || user.password !== weakHash(password)) {
    return { ok: false, error: "Wrong email or password." };
  }
  if (user.status === "suspended") return { ok: false, error: "This account is suspended." };
  const stamp = new Date().toISOString();
  users.update(user.id, { last_login_at: stamp, login_count: (user.login_count || 0) + 1 });
  try {
    const sessions = JSON.parse(window.localStorage.getItem(SESSIONS_KEY) || "[]");
    sessions.push({
      id: "sess_" + Date.now(),
      label: "Browser sign-in",
      browser: browserName(),
      ip: "127.0.0.1 (local demo)",
      created_at: stamp,
      last_seen: stamp,
      current: false
    });
    window.localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions.slice(-20)));
  } catch (e) {
    /* session trail is best-effort */
  }
  setSession(user.id);
  return { ok: true, user: publicUser(user) };
}

export function logout() {
  setSession(null);
}

export function currentUser() {
  try {
    const id = window.localStorage.getItem(SESSION_KEY);
    return id ? publicUser(users.byId(id)) : null;
  } catch (e) {
    return null;
  }
}

export function updateProfile(patch) {
  const cur = currentUser();
  if (!cur) return { ok: false, error: "Not signed in." };
  const row = users.update(cur.id, patch);
  return { ok: true, user: publicUser(row) };
}

export function isEmailTaken(email) {
  const mail = String(email || "").trim().toLowerCase();
  return !!users.find((u) => u.email === mail);
}

/* Admin helpers */
export function listUsers() {
  return users.all().map(publicUser);
}

export function getUser(id) {
  return publicUser(users.byId(id));
}

export function createUser({ name, email, password, role, status, avatar, phone, bio }) {
  const mail = String(email || "").trim().toLowerCase();
  if (!name || !mail) return { ok: false, error: "Name and email are required." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail)) return { ok: false, error: "That email doesn't look right." };
  if (users.find((u) => u.email === mail)) return { ok: false, error: "An account with that email already exists." };
  if (password && String(password).length < 6) return { ok: false, error: "Password must be at least 6 characters." };
  const row = users.insert({
    name: String(name).trim(),
    email: mail,
    password: weakHash(password || "changeme123"),
    role: role === "admin" ? "admin" : "customer",
    status: status === "suspended" ? "suspended" : "active",
    avatar: avatar || "",
    phone: String(phone || "").trim(),
    bio: String(bio || "").trim()
  });
  return { ok: true, user: publicUser(row) };
}

export function updateUser(id, patch) {
  const row = users.byId(id);
  if (!row) return { ok: false, error: "Account not found." };
  const next = { ...patch };
  if (next.email !== undefined) {
    const mail = String(next.email).trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail)) return { ok: false, error: "That email doesn't look right." };
    const dupe = users.find((u) => u.email === mail && u.id !== id);
    if (dupe) return { ok: false, error: "Another account already uses that email." };
    next.email = mail;
  }
  if (next.password !== undefined) {
    if (String(next.password).length < 6) return { ok: false, error: "Password must be at least 6 characters." };
    next.password = weakHash(next.password);
  } else {
    delete next.password;
  }
  if (next.name !== undefined) next.name = String(next.name).trim();
  const updated = users.update(id, next);
  return { ok: !!updated, user: publicUser(updated) };
}

export function deleteUser(id) {
  const row = users.byId(id);
  if (!row) return false;
  if (row.role === "admin" && users.filter((u) => u.role === "admin").length <= 1) return false;
  return users.remove(id);
}

/* ---------- account security (password, sessions, alerts, data) ---------- */

export function browserName() {
  const ua = typeof navigator === "undefined" ? "" : navigator.userAgent || "";
  if (/Edg\//.test(ua)) return "Edge";
  if (/Chrome\//.test(ua) && !/Chromium/.test(ua)) return "Chrome";
  if (/Firefox\//.test(ua)) return "Firefox";
  if (/Safari\//.test(ua)) return "Safari";
  if (/OPR\//.test(ua)) return "Opera";
  return "Unknown browser";
}

export function changePassword(current, next) {
  const cur = currentUser();
  if (!cur) return { ok: false, error: "Not signed in." };
  const row = users.byId(cur.id);
  if (!row || row.password !== weakHash(current)) return { ok: false, error: "Your current password is wrong." };
  if (String(next).length < 6) return { ok: false, error: "New password must be at least 6 characters." };
  users.update(cur.id, { password: weakHash(next), password_updated_at: new Date().toISOString() });
  return { ok: true };
}

export function listSessions() {
  try {
    const raw = JSON.parse(window.localStorage.getItem(SESSIONS_KEY) || "[]");
    if (!Array.isArray(raw)) return [];
    const hasCurrent = raw.some((s) => s && s.current);
    if (!hasCurrent) {
      raw.unshift({
        id: "sess_this",
        label: "This browser",
        browser: browserName(),
        ip: "127.0.0.1 (local demo)",
        created_at: new Date().toISOString(),
        last_seen: new Date().toISOString(),
        current: true
      });
      window.localStorage.setItem(SESSIONS_KEY, JSON.stringify(raw));
    }
    return raw;
  } catch (e) {
    return [];
  }
}

export function revokeSession(id) {
  try {
    const raw = JSON.parse(window.localStorage.getItem(SESSIONS_KEY) || "[]");
    const next = (Array.isArray(raw) ? raw : []).filter((s) => s && (!s.current || s.id !== id) && s.id !== id);
    window.localStorage.setItem(SESSIONS_KEY, JSON.stringify(next));
    return true;
  } catch (e) {
    return false;
  }
}

export function securityPrefs() {
  try {
    return JSON.parse(window.localStorage.getItem(PREFS_KEY) || "{}");
  } catch (e) {
    return {};
  }
}

export function setSecurityPref(key, value) {
  const prefs = securityPrefs();
  prefs[key] = value;
  try {
    window.localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch (e) {
    /* storage blocked */
  }
  return prefs;
}

export function deleteOwnAccount() {
  const cur = currentUser();
  if (!cur) return { ok: false, error: "Not signed in." };
  const removed = deleteUser(cur.id);
  if (!removed) return { ok: false, error: "The last admin account can't be deleted." };
  setSession(null);
  return { ok: true };
}
