/*
 * emails.js — professional transactional email templates + outbox.
 *
 * Templates return { subject, preview, html } with the Deep Design Dev
 * brand (black header, white body, accent green). sendEmail() queues the
 * rendered email into the `email_log` table — when the PHP/SMTP backend
 * exists, only sendEmail() needs to become a fetch() to the mail endpoint.
 */
import { openTable } from "./db";
import { SITE } from "./site.js";

const outbox = openTable("email_log", []);

const ACCENT = "#00e676";
const INK = "#0a0a0a";
const LOGO = `${SITE.url}/assets/imgs/logo/white-deep.png`;

function layout({ title, preheader, body }) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head>
<body style="margin:0;padding:0;background:#f4f5f7;font-family:Arial,Helvetica,sans-serif;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader || ""}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f7;padding:36px 12px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e6e8eb;">
  <tr><td style="background:${INK};padding:32px 40px;">
    <img src="${LOGO}" alt="${SITE.name}" width="220" style="display:block;border:0;width:220px;max-width:70%;height:auto;">
    <div style="color:${ACCENT};font-size:13px;margin-top:12px;letter-spacing:1.6px;text-transform:uppercase;">${SITE.tagline.split(".")[0]}</div>
  </td></tr>
  <tr><td style="padding:40px;color:#33373d;font-size:16.5px;line-height:1.78;">${body}</td></tr>
  <tr><td style="background:#0a0a0a;padding:26px 40px;color:#9aa0a6;font-size:13.5px;line-height:1.8;">
      ${SITE.name} · ${SITE.contact.location}<br>
      Reply within ${SITE.contact.responseTime.toLowerCase()} · ${SITE.contact.email}<br>
      <a href="${SITE.url}" style="color:${ACCENT};text-decoration:none;">${SITE.url.replace("https://", "")}</a>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;
}

function h(text) {
  return String(text || "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

const btn = (label, href) =>
  `<p style="margin:30px 0 8px;"><a href="${h(href)}" style="background:${INK};color:#ffffff;text-decoration:none;padding:16px 32px;border-radius:8px;font-size:16px;font-weight:bold;display:inline-block;">${h(label)}</a></p>`;

const note = (text) =>
  `<p style="margin:26px 0 0;padding-top:22px;border-top:1px solid #e6e8eb;color:#8b9099;font-size:14.5px;line-height:1.7;">${text}</p>`;

export const EMAIL_TEMPLATES = {
  /* 1. Welcome — sent right after registration */
  welcome: ({ user }) => ({
    subject: `Welcome to ${SITE.name}, ${h(user.name)}!`,
    preheader: "Your account is ready — here's how to get the most out of it.",
    html: layout({
      title: "Welcome",
      preheader: "Your account is ready",
      body: `
        <h1 style="margin:0 0 16px;color:${INK};font-size:28px;">Welcome, ${h(user.name)} 👋</h1>
        <p>Your ${SITE.name} account is live. You can now buy gallery builds instantly, track your requests and keep every invoice in one place.</p>
        ${btn("Open your account", SITE.url + "/account")}
        ${note("Your login: <strong>${h(user.email)}</strong><br>Never share your password — we will never ask for it by email.")}`
    })
  }),

  /* 2. Login alert — sent whenever an account is signed in to */
  login: ({ user, meta }) => ({
    subject: `New sign-in to your ${SITE.name} account`,
    preheader: "Your account was just accessed.",
    html: layout({
      title: "Sign-in alert",
      preheader: "Account accessed",
      body: `
        <h1 style="margin:0 0 16px;color:${INK};font-size:28px;">New sign-in</h1>
        <p>Hi ${h(user.name)}, your account was accessed just now.</p>
        <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;font-size:15px;border:1px solid #e6e8eb;border-radius:8px;overflow:hidden;">
          <tr><td style="padding:10px 14px;background:#f8f9fa;color:#8b9099;">Account</td><td style="padding:10px 14px;color:${INK};">${h(user.email)}</td></tr>
          <tr><td style="padding:10px 14px;background:#f8f9fa;color:#8b9099;">When</td><td style="padding:10px 14px;color:${INK};">${h((meta && meta.when) || new Date().toString())}</td></tr>
          <tr><td style="padding:10px 14px;background:#f8f9fa;color:#8b9099;">Device</td><td style="padding:10px 14px;color:${INK};">${h((meta && meta.device) || "Web browser")}</td></tr>
        </table>
        ${note("If this wasn't you, reset your password immediately or reply to this email.")}`
    })
  }),

  /* 3. Purchase confirmation — sent when a build is bought */
  purchase: ({ order }) => ({
    subject: `Purchase confirmed — ${order.project_title} (${order.ref})`,
    preheader: "Your files are ready to download.",
    html: layout({
      title: "Purchase confirmed",
      preheader: "Files ready",
      body: `
        <h1 style="margin:0 0 16px;color:${INK};font-size:28px;">Thanks, ${h(order.user_name || "friend")}!</h1>
        <p>Your payment went through and <strong>${h(order.project_title)}</strong> is yours. The licence and download link are below.</p>
        <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;font-size:15px;border:1px solid #e6e8eb;border-radius:8px;overflow:hidden;">
          <tr><td style="padding:10px 14px;background:#f8f9fa;color:#8b9099;">Order</td><td style="padding:10px 14px;color:${INK};"><strong>${h(order.ref)}</strong></td></tr>
          <tr><td style="padding:10px 14px;background:#f8f9fa;color:#8b9099;">Item</td><td style="padding:10px 14px;color:${INK};">${h(order.project_title)}</td></tr>
          <tr><td style="padding:10px 14px;background:#f8f9fa;color:#8b9099;">Licence</td><td style="padding:10px 14px;color:${INK};">${h(order.license || "Standard licence")}</td></tr>
          <tr><td style="padding:10px 14px;background:#f8f9fa;color:#8b9099;">Paid</td><td style="padding:10px 14px;color:${INK};"><strong>${h(order.currency)} ${Number(order.amount).toFixed(2)}</strong></td></tr>
        </table>
        ${btn("Download your files", SITE.url + "/account")}
        ${note("Keep this email — it doubles as your proof of purchase.")}`
    })
  }),

  /* 4. Invoice — itemised receipt for the same order */
  invoice: ({ order }) => ({
    subject: `Invoice ${order.ref} — ${SITE.name}`,
    preheader: `Invoice for ${order.project_title}`,
    html: layout({
      title: "Invoice",
      preheader: "Invoice " + order.ref,
      body: `
        <h1 style="margin:0 0 4px;color:${INK};font-size:28px;">Invoice ${h(order.ref)}</h1>
        <p style="color:#8b9099;margin-top:0;">Issued ${h(new Date().toISOString().slice(0, 10))} · ${h(order.user_name || "")} &lt;${h(order.user_email)}&gt;</p>
        <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;font-size:15px;border:1px solid #e6e8eb;border-radius:8px;overflow:hidden;">
          <tr><th align="left" style="padding:10px 14px;background:${INK};color:#ffffff;">Item</th><th align="right" style="padding:10px 14px;background:${INK};color:#ffffff;">Amount</th></tr>
          <tr><td style="padding:12px 14px;color:${INK};">${h(order.project_title)} — ${h(order.license || "standard licence")}</td><td align="right" style="padding:12px 14px;color:${INK};">${h(order.currency)} ${Number(order.amount).toFixed(2)}</td></tr>
          <tr><td style="padding:12px 14px;border-top:1px solid #e6e8eb;font-weight:bold;color:${INK};">Total paid</td><td align="right" style="padding:12px 14px;border-top:1px solid #e6e8eb;font-weight:bold;color:${INK};">${h(order.currency)} ${Number(order.amount).toFixed(2)}</td></tr>
        </table>
        ${note("Paid via ${h(order.method)} · status: <strong style=\"color:${ACCENT};\">${h(order.status)}</strong>")}`
    })
  }),

  /* 5. Request received — confirmation for the contact/request forms */
  request_received: ({ request }) => ({
    subject: `We received your request — ${request.ref}`,
    preheader: "Your brief is in. Expect a reply within 24 hours.",
    html: layout({
      title: "Request received",
      preheader: "Brief received",
      body: `
        <h1 style="margin:0 0 16px;color:${INK};font-size:28px;">Got it, ${h(request.name)}.</h1>
        <p>Your request <strong>${h(request.ref)}</strong> landed safely. You'll get a plan, a timeline and a fixed price within 24 hours — before any money moves.</p>
        <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;font-size:15px;border:1px solid #e6e8eb;border-radius:8px;overflow:hidden;">
          <tr><td style="padding:10px 14px;background:#f8f9fa;color:#8b9099;">Service</td><td style="padding:10px 14px;color:${INK};">${h(request.service)}</td></tr>
          <tr><td style="padding:10px 14px;background:#f8f9fa;color:#8b9099;">Budget</td><td style="padding:10px 14px;color:${INK};">${h(request.budget || "Not specified")}</td></tr>
        </table>
        ${btn("Track it in your account", SITE.url + "/account")}
        ${note("Tip: creating an account lets you track every request, quote and invoice from one dashboard.")}`
    })
  }),

  /* 6. Build me one — reply template when someone commissions a custom build */
  build_me_one: ({ request }) => ({
    subject: `Your custom build plan — ${request.ref}`,
    preheader: "Plan, timeline and next steps for your project.",
    html: layout({
      title: "Your build plan",
      preheader: "Plan and next steps",
      body: `
        <h1 style="margin:0 0 16px;color:${INK};font-size:28px;">Let's build it, ${h(request.name)}.</h1>
        <p>Here's the starting plan for your brief (<strong>${h(request.ref)}</strong>):</p>
        <ol style="padding-left:20px;color:#3d4148;line-height:1.9;">
          <li><strong>Scope check</strong> — I confirm exactly what's in and out within 24 hours.</li>
          <li><strong>Fixed quote</strong> — one number, written down, valid for 14 days.</li>
          <li><strong>Kickoff</strong> — 50% to start, staging link from day three, source files yours at the end.</li>
        </ol>
        <p>Requested service: <strong>${h(request.service)}</strong> · Budget: <strong>${h(request.budget || "to be agreed")}</strong></p>
        ${btn("Reply with your questions", "mailto:" + SITE.contact.email)}
        ${note("This plan was generated from your request ${h(request.ref)}. Reply to this email anytime — answers come within 24 hours.")}`
    })
  })
};

export function renderEmail(template, data) {
  const t = EMAIL_TEMPLATES[template];
  if (!t) return null;
  const { subject, preheader, html } = t(data || {});
  return { template, subject, preheader, html };
}

export function sendEmail({ to, name, template, data }) {
  const rendered = renderEmail(template, data);
  if (!rendered) return { ok: false, error: "Unknown template: " + template };

  outbox.insert({
    to: String(to || "").toLowerCase(),
    name: name || "",
    subject: rendered.subject,
    template,
    html: rendered.html,
    status: "queued"
  });

  if (typeof console !== "undefined" && console.info) {
    console.info("[email queued]", template, "->", to, "|", rendered.subject);
  }
  return { ok: true, ...rendered };
}

export function outboxAll() {
  return outbox.all().sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
}

export function deleteEmail(id) {
  outbox.remove(id);
  return true;
}

export function resendEmail(id) {
  const m = outbox.all().find((r) => r.id === id);
  if (!m) return false;
  outbox.update(id, { status: "queued", created_at: new Date().toISOString() });
  return true;
}
