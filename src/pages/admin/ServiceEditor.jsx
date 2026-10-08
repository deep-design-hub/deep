/*
 * /admin/services/new | /admin/services/:id — full-page service editor.
 * Layout: content fields left, publishing rail (status/draft, save, icon
 * picker, live card preview) right.
 */
import React, { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { listServices, saveService, updateService } from "../../data/services";
import { usePageSEO } from "../../seo";
import "../../auth.css";

const EMPTY = {
  name: "", slug: "", icon: "design_services", time: "1–2 weeks",
  price: "from $500", intro: "", includes: "", cta: "See the work", status: "published"
};

const ICON_CHOICES = [
  "design_services", "deployed_code", "language", "palette", "dashboard",
  "movie", "branding_watermark", "draw", "hub", "interests", "web", "widgets"
];

function toForm(s) {
  if (!s) return { ...EMPTY };
  return {
    name: s.name || "", slug: s.slug || "", icon: s.icon || "design_services",
    time: s.time || "", price: s.price || "", intro: s.intro || "",
    includes: (s.includes || []).join("\n"), cta: s.cta || "",
    status: s.status === "draft" ? "draft" : "published"
  };
}

function lines(v) {
  return String(v || "").split("\n").map((s) => s.trim()).filter(Boolean);
}

export default function ServiceEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const all = useMemo(() => listServices(), []);
  const editing = id && id !== "new" ? all.find((s) => s.id === id) : null;

  const [form, setForm] = useState(() => toForm(editing));
  const [msg, setMsg] = useState(null);

  usePageSEO({
    noindex: true,
    title: `Deep Design Hubs: ${editing ? "Edit" : "New"} service`,
    description: "Create or edit a Deep Design Hubs service.",
    keywords: "deep design hubs admin service editor"
  });

  function set(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function submit(e, asDraft) {
    e.preventDefault();
    if (!form.name.trim()) {
      setMsg({ ok: false, text: "Name is required." });
      return;
    }
    const slug = String(form.slug || form.name).trim().toLowerCase().replace(/\s+/g, "-");
    const dupe = all.find((r) => r.slug === slug);
    if (dupe && (!editing || dupe.id !== editing.id)) {
      setMsg({ ok: false, text: "Another service already uses that slug." });
      return;
    }

    const payload = {
      name: form.name.trim(),
      slug,
      icon: form.icon.trim() || "design_services",
      time: form.time.trim(),
      price: form.price.trim(),
      intro: form.intro.trim(),
      includes: lines(form.includes),
      cta: form.cta.trim(),
      status: asDraft ? "draft" : form.status
    };

    if (editing) updateService(editing.id, payload);
    else saveService(payload);
    navigate("/admin/services");
  }

  if (id && id !== "new" && !editing) {
    return (
      <>
        <div className="nh-dash__head">
          <div>
            <h1>
              Service not found
              <br />
              <em>That id isn't in the services table.</em>
            </h1>
          </div>
        </div>
        <div className="nh-acct__panel nh-in">
          <p className="nh-acct__empty">
            <Link className="nh-rowbtn" to="/admin/services">Back to services</Link>
          </p>
        </div>
      </>
    );
  }

  return (
    <div className="nh-edt nh-edt--wide">
      <div className="nh-dash__head">
        <div>
          <h1>
            {editing ? "Edit service" : "New service"}
            <br />
            <em>
              {editing
                ? "Changes appear on the services page immediately."
                : "Adds a card to the services page."}
            </em>
          </h1>
          <p className="nh-dash__sub">
            <Link to="/admin/services">← Back to services</Link>
          </p>
        </div>
      </div>

      <div className="nh-edt__grid">
        {/* ---------- left: content ---------- */}
        <div className="nh-acct__panel nh-edt__panel nh-in">
          {msg && (
            <div className={msg.ok ? "nh-prof__ok" : "nh-prof__err"} role="status">
              <span className="material-symbols-rounded" aria-hidden="true">{msg.ok ? "task_alt" : "error"}</span>
              {msg.text}
            </div>
          )}

          <form className="nh-edt__form" onSubmit={(e) => submit(e, false)}>
            <div className="nh-edt__row">
              <div>
                <label className="nh-prof__lab" htmlFor="sv-name">Name *</label>
                <input id="sv-name" className="nh-prof__in" type="text" value={form.name} onChange={set("name")} required />
              </div>
              <div>
                <label className="nh-prof__lab" htmlFor="sv-slug">Slug</label>
                <input id="sv-slug" className="nh-prof__in" type="text" value={form.slug} onChange={set("slug")} placeholder="auto from name" />
              </div>
            </div>

            <div>
              <label className="nh-prof__lab" htmlFor="sv-intro">Intro</label>
              <textarea id="sv-intro" className="nh-prof__in nh-edt__ta" value={form.intro} onChange={set("intro")} />
            </div>

            <div>
              <label className="nh-prof__lab" htmlFor="sv-includes">What's included</label>
              <textarea id="sv-includes" className="nh-prof__in nh-edt__ta" value={form.includes} onChange={set("includes")} placeholder={"Marketing sites, landing pages\nEcommerce and payment flows"} />
              <p className="nh-edt__hint">One bullet per line.</p>
            </div>

            <div className="nh-edt__row nh-edt__row--3">
              <div>
                <label className="nh-prof__lab" htmlFor="sv-time">Timeline</label>
                <input id="sv-time" className="nh-prof__in" type="text" value={form.time} onChange={set("time")} placeholder="1–3 weeks" />
              </div>
              <div>
                <label className="nh-prof__lab" htmlFor="sv-price">Price line</label>
                <input id="sv-price" className="nh-prof__in" type="text" value={form.price} onChange={set("price")} placeholder="from $1,200" />
              </div>
              <div>
                <label className="nh-prof__lab" htmlFor="sv-cta">Card CTA label</label>
                <input id="sv-cta" className="nh-prof__in" type="text" value={form.cta} onChange={set("cta")} placeholder="See the work" />
              </div>
            </div>

            <div className="nh-edt__acts nh-edt__acts--mobile">
              <button className="nh-btn nh-btn--accent" type="submit">
                {editing ? "Save changes" : "Create service"}
                <span className="material-symbols-rounded" aria-hidden="true">check</span>
              </button>
            </div>
          </form>
        </div>

        {/* ---------- right: publishing rail ---------- */}
        <aside className="nh-edt__rail">
          <div className="nh-edt__card nh-in">
            <b>
              <span className="material-symbols-rounded" aria-hidden="true">publish</span>
              Publish
            </b>
            <div className="nh-edt__stack">
              <div>
                <label className="nh-prof__lab" htmlFor="sv-status">Status</label>
                <select id="sv-status" className="nh-prof__in" value={form.status} onChange={set("status")}>
                  <option value="published">Published — visible on the site</option>
                  <option value="draft">Draft — hidden from the site</option>
                </select>
              </div>
              <div className="nh-edt__acts nh-edt__acts--rail" style={{ display: "grid", gap: 8 }}>
                <button className="nh-btn nh-btn--accent" type="button" onClick={(e) => submit(e, false)}>
                  {editing ? "Save changes" : "Create service"}
                  <span className="material-symbols-rounded" aria-hidden="true">check</span>
                </button>
                {!editing || form.status !== "draft" ? (
                  <button className="nh-btn nh-btn--ghost" type="button" onClick={(e) => submit(e, true)}>
                    <span className="material-symbols-rounded" aria-hidden="true">draft</span>
                    Save as draft
                  </button>
                ) : null}
                <button className="nh-btn nh-btn--ghost" type="button" onClick={() => navigate("/admin/services")}>Cancel</button>
              </div>
              <p className="nh-edt__hint">
                <Link to="/service" style={{ textDecoration: "underline" }}>
                  Preview the services page →
                </Link>
              </p>
            </div>
          </div>

          <div className="nh-edt__card nh-in" style={{ transitionDelay: ".06s" }}>
            <b>
              <span className="material-symbols-rounded" aria-hidden="true">extension</span>
              Icon
            </b>
            <div className="nh-edt__stack">
              <input id="sv-icon" className="nh-prof__in" type="text" value={form.icon} onChange={set("icon")} placeholder="design_services" />
              <p className="nh-edt__hint">Material Symbols name — tap one below or type your own.</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 6 }}>
                {ICON_CHOICES.map((ic) => (
                  <button
                    key={ic}
                    type="button"
                    title={ic}
                    onClick={() => setForm((f) => ({ ...f, icon: ic }))}
                    style={{
                      display: "grid", placeItems: "center", height: 38, borderRadius: 9,
                      border: form.icon === ic ? "2px solid var(--nh-accent)" : "1px solid var(--gray-200)",
                      background: form.icon === ic ? "rgba(0,230,118,.1)" : "var(--gray-100)",
                      cursor: "pointer", color: "var(--nh-ink)"
                    }}
                  >
                    <span className="material-symbols-rounded" style={{ fontSize: 19 }} aria-hidden="true">{ic}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="nh-edt__card nh-in" style={{ transitionDelay: ".1s" }}>
            <b>
              <span className="material-symbols-rounded" aria-hidden="true">visibility</span>
              Card preview
            </b>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "13px 14px", border: "1px solid var(--gray-200)", borderRadius: 13, background: "var(--gray-100)" }}>
              <span className="nh-dt__ic" style={{ width: 44, height: 44, borderRadius: 12 }}>
                <span className="material-symbols-rounded" style={{ fontSize: 22 }} aria-hidden="true">{form.icon || "design_services"}</span>
              </span>
              <span style={{ minWidth: 0 }}>
                <b style={{ display: "block", fontSize: ".95rem", letterSpacing: "-.02em" }}>{form.name || "Service name"}</b>
                <span style={{ display: "block", fontSize: ".76rem", color: "var(--gray-500)", marginTop: 3 }}>
                  {form.time || "timeline"} · {form.price || "price"}
                </span>
                <span style={{ display: "inline-block", marginTop: 8, fontSize: ".72rem", fontWeight: 800, color: "var(--nh-ink)", textDecoration: "underline" }}>
                  {form.cta || "See the work"} →
                </span>
              </span>
            </div>
            {form.status === "draft" && (
              <p className="nh-edt__hint" style={{ marginTop: 10 }}>
                <b>Draft</b> — this card is hidden from the live services page right now.
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
