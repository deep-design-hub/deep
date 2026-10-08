import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CONTACT_SOCIALS, socialIcon } from "../data/socials";
import { submitRequest } from "../data/requests";
import { sendEmail } from "../data/emails";
import { currentUser } from "../data/users";
import { useAuth } from "../auth";
import { SITE } from "../data/site";
import { openRequestPanel } from "../data/requestPanel";
import PageStamp from "../components/PageStamp";
import "../contact.css";

export default function Contact() {
  const [state, setState] = useState("idle");
  const [sentRow, setSentRow] = useState(null);
  const { isLoggedIn, user } = useAuth();

  function handleSubmit(e) {
    e.preventDefault();
    if (state !== "idle") return;
    setState("sending");
    const form = e.currentTarget;
    const data = new FormData(form);

    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const company = String(data.get("company") || "").trim();

    let message = String(data.get("message") || "").trim();
    if (company) message += `\n\nCompany: ${company}`;

    window.setTimeout(() => {
      const user0 = currentUser();
      const row = submitRequest({
        name,
        email,
        service: "Contact message",
        message,
        budget: "Not sure yet",
        source: "contact",
        userId: user0 ? user0.id : ""
      });
      sendEmail({ to: email, name, template: "request_received", data: { request: row } });
      setSentRow(row);
      setState("sent");
      if (form) form.reset();
    }, 700);
  }

  return (
    <>
      <Header />
      <main className="nh-main">
        {/* ============ 1. CONTACT FORM (first) ============ */}
        <section className="nh-cp">
          <div className="nh-wrap">
            <div className="nh-phead">
<div className="nh-phead__copy nh-cp__head nh-in">
                <span className="nh-tag">
                  <span className="material-symbols-rounded" aria-hidden="true">
                    alternate_email
                  </span>
                  Contact
                </span>
                <h1 className="nh-h2" style={{ marginTop: "20px" }}>
                  Talk to me
                  <br />
                  <em>about anything</em>
                </h1>
                <p className="nh-sub">
                  Questions, licensing, invites — this form is for direct messages.
                  If you're briefing a design or build job, use the <b style={{ cursor: "pointer" }} onClick={openRequestPanel}>Request slide</b> instead.
                  Either way you'll get a straight answer within 24 hours.
                </p>
                </div>
              <PageStamp text="Contact · Reply in 24h · Fixed quotes · " icon="alternate_email" label="Contact stamp" />
            </div>

            <div className="nh-cp__grid">
              <div
                className="nh-cp__card nh-in"
                id="contact-form"
                style={{ transitionDelay: ".08s" }}
              >
                <form className="nh-cform" onSubmit={handleSubmit} noValidate={false}>
                  <div className="nh-cform__top">
                    <div className="nh-cform__steps">
                      <span className="nh-cform__step">
                        <i>01</i> Your message
                      </span>
                      <span className="nh-cform__step">
                        <i>02</i> My reply in 24h
                      </span>
                    </div>
                    <span className="nh-cform__secure">
                      <span className="material-symbols-rounded" aria-hidden="true">
                        lock
                      </span>
                      Private &amp; confidential
                    </span>
                  </div>

                  <div className="nh-cform__row">
                    <div className="nh-field">
                      <label htmlFor="cf-name">
                        <span className="material-symbols-rounded" aria-hidden="true">
                          person
                        </span>
                        Full name
                      </label>
                      <div className="nh-if">
                        <span className="material-symbols-rounded" aria-hidden="true">
                          badge
                        </span>
                        <input
                          id="cf-name"
                          name="name"
                          type="text"
                          placeholder="Your full name"
                          autoComplete="name"
                          required
                        />
                      </div>
                    </div>
                    <div className="nh-field">
                      <label htmlFor="cf-email">
                        <span className="material-symbols-rounded" aria-hidden="true">
                          mail
                        </span>
                        Email
                      </label>
                      <div className="nh-if">
                        <span className="material-symbols-rounded" aria-hidden="true">
                          alternate_email
                        </span>
                        <input
                          id="cf-email"
                          name="email"
                          type="email"
                          placeholder="you@company.com"
                          autoComplete="email"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="nh-field">
                  <label htmlFor="cf-company">
                    <span className="material-symbols-rounded" aria-hidden="true">
                      apartment
                    </span>
                    Company <span style={{ textTransform: "none", letterSpacing: 0, fontWeight: 500 }}>(optional)</span>
                  </label>
                  <div className="nh-if">
                    <span className="material-symbols-rounded" aria-hidden="true">
                      business_center
                    </span>
                    <input
                      id="cf-company"
                      name="company"
                      type="text"
                      placeholder="Studio, startup, nobody yet"
                      autoComplete="organization"
                    />
                  </div>
                </div>

                  <div className="nh-field">
                    <label htmlFor="cf-message">
                      <span className="material-symbols-rounded" aria-hidden="true">
                        forum
                      </span>
                      The brief
                    </label>
                    <div className="nh-if nh-if--area">
                      <span className="material-symbols-rounded" aria-hidden="true">
                        edit_note
                      </span>
                      <textarea
                        id="cf-message"
                        name="message"
                        placeholder="Your message — questions, licensing, invites, ideas. For project briefs use the Request slide instead."
                        required
                      />
                    </div>
                    <span className="nh-cform__hint">
                      Links to examples you like help more than a paragraph of
                      adjectives.
                    </span>
                  </div>

                  <label className="nh-check" htmlFor="cf-consent">
                    <input id="cf-consent" name="consent" type="checkbox" required />
                    <span>
                      Keep my details for newsletters, requests and listings
                    </span>
                  </label>

                  <div className="nh-cform__send">
                    <button
                      className="nh-btn nh-btn--accent"
                      type="submit"
                      disabled={state !== "idle"}
                    >
                      {state === "sent" ? "Message sent" : state === "sending" ? "Sending…" : "Send message"}
                      <span className="material-symbols-rounded" aria-hidden="true">
                        {state === "sent" ? "check_circle" : "arrow_outward"}
                      </span>
                    </button>
                    <span className="nh-cform__meta">
                      <span className="material-symbols-rounded" aria-hidden="true">
                        schedule
                      </span>
                      Typical reply: under 24 hours
                    </span>
                  </div>

                  {state === "sent" && sentRow ? (
                    <div className="nh-cform__ok is-on" role="status" aria-live="polite">
                      <span className="material-symbols-rounded" aria-hidden="true">
                        task_alt
                      </span>
                      <div style={{ flex: 1, textAlign: "left" }}>
                        <b>Message received</b> — thanks, it landed. I'll read it and reply within 24 hours.
                        <div style={{ display: "inline-flex", gap: 10, alignItems: "center", margin: "12px 0 0", padding: "7px 14px", borderRadius: 999, background: "rgba(255,255,255,.07)", border: "1px dashed rgba(255,255,255,.35)", fontSize: ".78rem" }}>
                          <span>Reference</span>
                          <b style={{ fontWeight: 800, letterSpacing: ".06em" }}>{sentRow.ref}</b>
                        </div>
                        <p style={{ margin: "12px 0 0", fontSize: ".84rem", opacity: .92 }}>
                          {!isLoggedIn ? (
                            <>
                              <b>Tip:</b> create a free account to track this message —
                              status, notes and replies in one dashboard.
                            </>
                          ) : (
                            <>
                              It's already attached to <b>{user.name}</b>'s account — see
                              the thread in your dashboard.
                            </>
                          )}
                        </p>
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
                          {!isLoggedIn && (
                            <Link to="/register" className="nh-btn nh-btn--accent" data-nav>
                              Create free account
                              <span className="material-symbols-rounded" aria-hidden="true">person_add</span>
                            </Link>
                          )}
                          <button
                            className="nh-btn nh-btn--ghost"
                            type="button"
                            style={{ color: "inherit", borderColor: "currentColor" }}
                            onClick={() => { setState("idle"); setSentRow(null); }}
                          >
                            Send another message
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="nh-cform__ok" role="status" aria-live="polite">
                      <span className="material-symbols-rounded" aria-hidden="true">
                        task_alt
                      </span>
                      Thanks — the message landed. I'll read it and reply within 24
                      hours.
                    </div>
                  )}
                </form>
              </div>

              <aside className="nh-cp__side nh-in" style={{ transitionDelay: ".16s" }}>
                <div className="nh-ci">
                  <span className="nh-ci__ic">
                    <span className="material-symbols-rounded" aria-hidden="true">
                      mail
                    </span>
                  </span>
                  <div className="nh-ci__b">
                    <b>Email</b>
                    <a href={`mailto:${SITE.contact.email}`}>
                      {SITE.contact.email}
                    </a>
                  </div>
                </div>

                <div className="nh-ci">
                  <span className="nh-ci__ic">
                    <span className="material-symbols-rounded" aria-hidden="true">
                      forum
                    </span>
                  </span>
                  <div className="nh-ci__b">
                    <b>Response time</b>
                    <span>Within 24 hours, every time</span>
                  </div>
                </div>

                <div className="nh-ci">
                  <span className="nh-ci__ic">
                    <span className="material-symbols-rounded" aria-hidden="true">
                      schedule
                    </span>
                  </span>
                  <div className="nh-ci__b">
                    <b>Working hours</b>
                    <span>Mon – Sat · 10:00 – 19:00 (PKT)</span>
                  </div>
                </div>

                <div className="nh-ci nh-ci--live">
                  <span className="nh-ci__ic">
                    <span className="material-symbols-rounded" aria-hidden="true">
                      rocket_launch
                    </span>
                  </span>
                  <div className="nh-ci__b">
                    <b>Availability</b>
                    <span>Open for new projects</span>
                  </div>
                </div>

                <div className="nh-socs">
                  <div className="nh-socs__t">
                    <span className="material-symbols-rounded" aria-hidden="true">
                      share
                    </span>
                    Elsewhere
                  </div>
                  <div className="nh-socs__grid">
                    {CONTACT_SOCIALS.map((s) => (
                      <a
                        key={s.name}
                        className="nh-soc"
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={s.name}
                        title={s.name}
                      >
                        <span
                          className="nh-soc__ic"
                          dangerouslySetInnerHTML={{ __html: socialIcon(s.icon) }}
                        />
                        <span>{s.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* ============ 2. CTA (after the form) ============ */}
        <section className="nh-cta">
          <div className="nh-wrap">
            <div className="nh-cta__card">
              <div className="nh-cta__inner nh-in">
                <span className="nh-tag">
                  <span className="material-symbols-rounded" aria-hidden="true">
                    handyman
                  </span>
                  Build it
                </span>
                <h2 className="nh-cta__title" style={{ marginTop: "20px" }}>
                  Got something you want built?
                </h2>
                <p className="nh-cta__sub">
                  Prefer a conversation first? Email the outline and I'll tell you
                  honestly whether it's a fit, what it takes and what it costs.
                </p>
                <div className="nh-cta__actions">
                  <button
                    type="button"
                    className="nh-btn nh-btn--accent"
                    onClick={openRequestPanel}
                  >
                    Start a project
                    <span className="material-symbols-rounded" aria-hidden="true">
                      arrow_outward
                    </span>
                  </button>
                  <a
                    href={`mailto:${SITE.contact.email}?subject=Ask%20about%20licensing`}
                    className="nh-btn nh-btn--outline"
                  >
                    Ask about licensing
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
