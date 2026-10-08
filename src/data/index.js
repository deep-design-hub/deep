/*
 * src/data/index.js — the single entry point for ALL site data.
 *
 * Static content (would be DB content / CMS rows):
 *   projects   — gallery projects, case studies, seed reviews, prices
 *   services   — services, extras, FAQs
 *   programs   — home page featured work
 *   home       — home page sections (bento, process, story, plans, shop, FAQ…)
 *   about      — beliefs, journey, tools
 *   albums     — gallery albums (events, workshops)
 *   site       — brand, nav, footer, contact, form options
 *   socials    — social profiles + SVG icon map
 *
 * Runtime tables (localStorage now → PHP/MySQL later via src/data/db.js):
 *   users      — accounts + temporary auth (login/register/session)
 *   requests   — project requests from the forms (+ form option labels)
 *   orders     — buy-page purchases / Paystack payments
 *   reviews    — visitor reviews & ratings per project
 *   subscribers— newsletter signups
 *   admin      — admin account + dashboard aggregates
 *   emails     — transactional email templates + outbox (email_log table)
 */

export * from "./projects.js";
export * from "./services.js";
export * from "./programs.js";
export * from "./home.js";
export * from "./about.js";
export * from "./albums.js";
export * from "./site.js";
export { SOCIALS, CONTACT_SOCIALS, socialIcons, socialIcon } from "./socials.js";

export * from "./users.js";
export * from "./requests.js";
export * from "./orders.js";
export * from "./reviews.js";
export * from "./subscribers.js";
export * from "./admin.js";
export { EMAIL_TEMPLATES, renderEmail, sendEmail, outboxAll } from "./emails.js";

export { openTable, newId, newRef, weakHash } from "./db.js";
