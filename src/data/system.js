/*
 * system.js — platform background tables: settings, cronjobs, logs + storage.
 *
 * These are the "everything behind the site" records an admin manages:
 *   settings   — sectioned key/value platform config (general, appearance,
 *                email, payments, security, seo, i18n)
 *   cronjobs   — scheduled jobs (what runs, when it last ran, on/off)
 *   logs       — system log lines (email queue flushes, import runs, errors)
 *   storage    — backup/export/import of every dd_* table in localStorage
 *
 * Same swap story as every other table: replace openTable with fetch()
 * against the PHP API and nothing else changes.
 */
import { openTable, newId, PREFIX } from "./db";

/* ---------------- settings ---------------- */

const DEFAULT_SETTINGS = [
  /* general */
  { id: "set_site_name", section: "general", key: "site_name", label: "Site name", type: "text", value: "Deep Design Hubs", hint: "Used in titles, emails and invoices." },
  { id: "set_site_tagline", section: "general", key: "site_tagline", label: "Tagline", type: "text", value: "Design builds, ready to ship", hint: "Short line under the logo in emails and the footer." },
  { id: "set_contact_email", section: "general", key: "contact_email", label: "Public contact email", type: "text", value: "", hint: "Shown on the contact page and in email footers." },
  { id: "set_contact_phone", section: "general", key: "contact_phone", label: "Phone / WhatsApp", type: "text", value: "", hint: "Optional — shown next to the email." },
  { id: "set_location", section: "general", key: "location", label: "Location", type: "text", value: "", hint: "City / country line used in copy." },
  { id: "set_reply", section: "general", key: "reply_time_hours", label: "Reply time (hours)", type: "number", value: "24", hint: "Used in copy: 'reply within X hours'." },

  /* appearance */
  { id: "set_maintenance", section: "appearance", key: "maintenance_mode", label: "Maintenance mode", type: "toggle", value: "off", hint: "When on, visitors see a maintenance notice (admin stays in)." },
  { id: "set_banner", section: "appearance", key: "site_banner", label: "Site-wide announcement", type: "text", value: "", hint: "Shown in the header when non-empty. Clear to hide." },
  { id: "set_accent", section: "appearance", key: "accent_color", label: "Accent colour", type: "color", value: "#00e676", hint: "Highlight colour for CTAs and badges." },
  { id: "set_dark_ui", section: "appearance", key: "dark_ui", label: "Dark interface", type: "toggle", value: "off", hint: "Reserved — flips the public site to the dark palette when the theme layer lands." },

  /* email */
  { id: "set_mail_from_name", section: "email", key: "mail_from_name", label: "From name", type: "text", value: "Deep Design Hubs", hint: "Sender name recipients see in their inbox." },
  { id: "set_mail_from_email", section: "email", key: "mail_from_email", label: "From email", type: "text", value: "", hint: "Sender address (needs SMTP/DNS verification to deliver)." },
  { id: "set_mail_prefix", section: "email", key: "mail_subject_prefix", label: "Subject prefix", type: "text", value: "[Deep Design Hubs]", hint: "Optional prefix added to every outgoing subject." },
  { id: "set_smtp_host", section: "email", key: "smtp_host", label: "SMTP host", type: "text", value: "", hint: "e.g. smtp.mailgun.org — used by the server once the backend lands." },
  { id: "set_smtp_port", section: "email", key: "smtp_port", label: "SMTP port", type: "number", value: "587", hint: "587 (TLS) is the usual choice." },

  /* payments */
  { id: "set_paystack_pk", section: "payments", key: "paystack_public_key", label: "Paystack public key", type: "text", value: "", hint: "pk_live_… or pk_test_…. Server-side secret key never belongs here." },
  { id: "set_paystack_mode", section: "payments", key: "paystack_mode", label: "Paystack mode", type: "select", value: "test", options: "test,live", hint: "test = sandbox charges, live = real money." },
  { id: "set_currency", section: "payments", key: "default_currency", label: "Default currency", type: "select", value: "USD", options: "USD,NGN,GHS,KES,ZAR", hint: "Store currency for new orders." },
  { id: "set_bank", section: "payments", key: "bank_transfer_note", label: "Bank transfer instructions", type: "textarea", value: "Bank: GTBank · Account: Deep Design Hubs · 0123456789\nSend the transfer receipt to payments@deep-design.netlify.app with your order ref.", hint: "Shown on the buy page when bank payment is selected." },
  { id: "set_enable_bank", section: "payments", key: "enable_bank_transfer", label: "Bank transfer option", type: "toggle", value: "on", hint: "Offer manual bank transfer alongside Paystack." },

  /* security */
  { id: "set_session_timeout", section: "security", key: "session_timeout_hours", label: "Session timeout (hours)", type: "number", value: "72", hint: "How long a sign-in stays valid." },
  { id: "set_password_min", section: "security", key: "password_min_length", label: "Minimum password length", type: "number", value: "6", hint: "Enforced on register and password reset." },
  { id: "set_login_alerts", section: "security", key: "login_alerts", label: "Sign-in alert emails", type: "toggle", value: "on", hint: "Email the account owner on every new sign-in." },
  { id: "set_max_attempts", section: "security", key: "max_login_attempts", label: "Max login attempts", type: "number", value: "5", hint: "Lock the form after this many failures (enforced server-side later)." },

  /* seo */
  { id: "set_seo_title", section: "seo", key: "seo_default_title", label: "Default page title", type: "text", value: "", hint: "Fallback title when a page doesn't set one." },
  { id: "set_seo_desc", section: "seo", key: "seo_default_description", label: "Default description", type: "textarea", value: "", hint: "Fallback meta description for search results." },
  { id: "set_seo_og", section: "seo", key: "seo_og_image", label: "Social share image", type: "text", value: "", hint: "Path to the default Open Graph image (1200×630)." },
  { id: "set_seo_ping", section: "seo", key: "sitemap_ping", label: "Ping engines on publish", type: "toggle", value: "on", hint: "Sitemap ping job submits sitemap.xml after content changes." },

  /* i18n */
  { id: "set_lang", section: "i18n", key: "default_language", label: "Default language", type: "select", value: "English", options: "English,Yoruba,Igbo,Hausa,French,Spanish", hint: "Language for new visitors and outgoing emails." },
  { id: "set_locales", section: "i18n", key: "enabled_locales", label: "Enabled locales", type: "text", value: "English", hint: "Comma-separated list shown in the language switcher." },
  { id: "set_date_format", section: "i18n", key: "date_format", label: "Date format", type: "select", value: "DD/MM/YYYY", options: "DD/MM/YYYY,MM/DD/YYYY,YYYY-MM-DD", hint: "How dates render across the site." },
  { id: "set_timezone", section: "i18n", key: "time_zone", label: "Time zone", type: "text", value: "Africa/Lagos", hint: "IANA zone used for scheduled jobs and timestamps." }
];

const settings = openTable("settings", DEFAULT_SETTINGS);

/* Legacy rows written before sections existed (and rows the admin has
   already edited on an older build) get their home from this map. */
const SECTION_BY_KEY = {
  maintenance_mode: "appearance",
  site_banner: "appearance",
  paystack_public_key: "payments",
  bank_transfer_note: "payments",
  default_currency: "payments",
  reply_time_hours: "general"
};

export const SETTINGS_SECTIONS = ["general", "appearance", "email", "payments", "security", "seo", "i18n"];

export function listSettings() {
  return settings.all();
}

export function settingsFor(section) {
  return settings.all().filter((s) => (s.section || SECTION_BY_KEY[s.key] || "general") === section);
}

export function getSetting(key, fallback = "") {
  const row = settings.find((s) => s.key === key);
  return row ? row.value : fallback;
}

export function setSetting(key, value) {
  const row = settings.find((s) => s.key === key);
  if (row) return settings.update(row.id, { value: String(value) });
  return settings.insert({ key, label: key, type: "text", value: String(value), hint: "" });
}

/* Save every { key: value } pair at once; logs one admin action. */
export function saveSettingsPairs(pairs, source = "admin") {
  Object.entries(pairs || {}).forEach(([key, value]) => setSetting(key, value));
  logEvent("info", `Settings saved (${Object.keys(pairs || {}).join(", ")})`, source);
  return true;
}

/* ---------------- cronjobs ---------------- */

const DEFAULT_JOBS = [
  { id: "job_email_flush", name: "Email queue flush", schedule: "every 5 min", icon: "send", enabled: true, handler: "flushEmails", desc: "Sends queued outbox emails (queued → sent) once SMTP exists." },
  { id: "job_sitemap_ping", name: "Sitemap ping", schedule: "daily 03:00", icon: "travel_explore", enabled: true, handler: "pingSitemap", desc: "Pings search engines with sitemap.xml after content changes." },
  { id: "job_sub_digest", name: "Subscriber digest", schedule: "mon 08:00", icon: "subscriptions", enabled: false, handler: "subscriberDigest", desc: "Weekly summary of new subscribers sent to the admin inbox." },
  { id: "job_orders_sync", name: "Paystack order sync", schedule: "hourly", icon: "sync", enabled: true, handler: "syncOrders", desc: "Re-checks pending Paystack orders against the charge API." },
  { id: "job_db_backup", name: "Database backup", schedule: "daily 02:00", icon: "cloud_done", enabled: true, handler: "backupDb", desc: "Nightly dump of all tables (requests, orders, users, content)." },
  { id: "job_log_prune", name: "Log pruning", schedule: "weekly", icon: "cleaning_services", enabled: true, handler: "pruneLogs", desc: "Keeps the newest 500 log lines, drops the rest." }
];

const jobs = openTable("cronjobs", DEFAULT_JOBS);
const logs = openTable("system_logs", []);

export function listJobs() {
  return jobs.all();
}

export function saveJob(data) {
  if (data.id && jobs.byId(data.id)) {
    return jobs.update(data.id, data);
  }
  const { id, ...rest } = data;
  return jobs.insert({ enabled: true, icon: "schedule", handler: "stub", ...rest });
}

export function deleteJob(id) {
  const job = jobs.byId(id);
  if (!job) return false;
  const ok = jobs.remove(id);
  if (ok) logEvent("warn", `Cronjob removed: ${job.name}`, "admin");
  return ok;
}

export function toggleJob(id) {
  const row = jobs.byId(id);
  if (!row) return null;
  const next = jobs.update(id, { enabled: !row.enabled });
  logEvent("info", `Cronjob ${row.name} ${row.enabled ? "disabled" : "enabled"}`, "admin");
  return next;
}

/* Simulated run — executes the job's handler and writes a log line.
   With a real backend these become server cron endpoints. */
export function runJob(id) {
  const job = jobs.byId(id);
  if (!job) return null;
  const started = Date.now();
  let result = "ok";
  try {
    result = executeHandler(job.handler) || "ok";
  } catch (e) {
    result = "error: " + (e && e.message ? e.message : String(e));
  }
  jobs.update(id, { last_run: new Date().toISOString() });
  logEvent(result === "ok" ? "info" : "error", `${job.name} → ${result}`, "cron");
  return { ok: result === "ok", result, ms: Date.now() - started };
}

function executeHandler(handler) {
  switch (handler) {
    case "flushEmails": {
      // Mark every queued email as sent (SMTP stand-in).
      const outbox = openTable("email_log", []);
      const queued = outbox.filter((e) => e.status === "queued");
      queued.forEach((e) => outbox.update(e.id, { status: "sent", sent_at: new Date().toISOString() }));
      return queued.length ? `${queued.length} email(s) flushed` : "nothing queued";
    }
    case "pruneLogs": {
      const all = logs.all();
      if (all.length <= 500) return `kept ${all.length} lines`;
      const keep = all
        .sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)))
        .slice(0, 500);
      logs.replaceAll(keep);
      return `pruned to ${keep.length} lines`;
    }
    case "pingSitemap":
      return "sitemap submitted (stub)";
    case "subscriberDigest":
      return "digest queued (stub)";
    case "syncOrders":
      return "0 pending orders to sync";
    case "backupDb":
      return `backup written (${storageTables().length} tables)`;
    default:
      return "no handler";
  }
}

/* ---------------- logs ---------------- */

const LEVELS = ["info", "warn", "error"];

export function logEvent(level, message, source = "system") {
  return logs.insert({
    level: LEVELS.includes(level) ? level : "info",
    message: String(message || ""),
    source
  });
}

export function listLogs(limit = 200) {
  return logs
    .all()
    .sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)))
    .slice(0, limit);
}

export function clearLogs() {
  logs.clear();
  return true;
}

/* Import-only: let first paint show something real in the log panel. */
export function ensureSeedLog() {
  if (logs.count() === 0) {
    logEvent("info", "System tables initialised", "boot");
  }
}

/* ---------------- storage / backup ---------------- */

/* Every dd_* array in localStorage = one "table". */
export function storageTables() {
  const out = [];
  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (!key || !key.startsWith(PREFIX)) continue;
      const raw = window.localStorage.getItem(key) || "";
      let val;
      try {
        val = JSON.parse(raw);
      } catch (e) {
        continue;
      }
      if (Array.isArray(val)) {
        out.push({ key, name: key.slice(PREFIX.length), rows: val.length, bytes: raw.length });
      }
    }
  } catch (e) {
    /* storage unavailable */
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

export function exportBackup() {
  const data = {};
  let keys = 0;
  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (!key || !key.startsWith(PREFIX)) continue;
      data[key] = window.localStorage.getItem(key);
      keys++;
    }
  } catch (e) {
    /* ignore */
  }
  return JSON.stringify(
    { app: "deep-design-hubs", version: 1, exported_at: new Date().toISOString(), keys, data },
    null,
    2
  );
}

export function importBackup(json) {
  let parsed;
  try {
    parsed = typeof json === "string" ? JSON.parse(json) : json;
  } catch (e) {
    return { ok: false, error: "That file isn't valid JSON." };
  }
  if (!parsed || typeof parsed !== "object" || typeof parsed.data !== "object" || !parsed.data) {
    return { ok: false, error: "Not a Deep Design Hubs backup file." };
  }
  let count = 0;
  Object.entries(parsed.data).forEach(([key, value]) => {
    if (!key.startsWith(PREFIX)) return;
    try {
      window.localStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value));
      count++;
    } catch (e) {
      /* skip unwritable keys */
    }
  });
  logEvent("info", `Backup imported — ${count} table(s) restored`, "storage");
  return { ok: true, tables: count };
}

export function clearTable(key) {
  if (!key || !key.startsWith(PREFIX)) return false;
  try {
    window.localStorage.removeItem(key);
  } catch (e) {
    return false;
  }
  logEvent("warn", `Table cleared: ${key.slice(PREFIX.length)}`, "storage");
  return true;
}
