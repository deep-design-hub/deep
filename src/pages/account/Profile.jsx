/*
 * /account/profile — identity: avatar, name, email, phone and bio.
 * Password & sessions live on /account/security.
 */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth";
import MediaPicker from "../../components/admin/MediaPicker";
import { usePageSEO, breadcrumbJsonLd } from "../../seo";
import "../../auth.css";

export default function Profile() {
  const { user, update, logout } = useAuth();
  const navigate = useNavigate();

  usePageSEO({
    noindex: true,
    title: "Deep Design Dev: Profile",
    description: "Manage your Deep Design Dev profile — avatar, name, email, phone and bio.",
    keywords: "deep design hubs profile, account settings, avatar",
    path: "/account/profile",
    jsonLd: [breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "My account", path: "/account" },
      { name: "Profile", path: "/account/profile" }
    ])]
  });

  const [form, setForm] = useState(() => ({
    name: user ? user.name : "",
    email: user ? user.email : "",
    phone: user && user.phone ? user.phone : "",
    bio: user && user.bio ? user.bio : "",
    avatar: user && user.avatar ? user.avatar : ""
  }));
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  const [picker, setPicker] = useState(false);

  function set(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function saveProfile(e) {
    e.preventDefault();
    setBusy(true);
    const res = update({
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      bio: form.bio.trim(),
      avatar: form.avatar
    });
    setMsg(res.ok ? { ok: true, text: "Profile updated." } : { ok: false, text: res.error || "Could not save." });
    setBusy(false);
  }

  function handleLogout() {
    logout();
    navigate("/", { replace: true });
  }

  return (
    <>
      <div className="nh-dash__head">
        <div>
          <h1>
            Profile
            <br />
            <em>your identity on the site</em>
          </h1>
          <p className="nh-dash__sub">
            Keep your name, email and phone current so quotes, receipts and replies
            always land in the right inbox.
          </p>
        </div>
      </div>

      {msg && (
        <div className={msg.ok ? "nh-prof__ok" : "nh-prof__err"} role="status" style={{ marginBottom: 18 }}>
          <span className="material-symbols-rounded" aria-hidden="true">
            {msg.ok ? "task_alt" : "error"}
          </span>
          {msg.text}
        </div>
      )}

      <div className="nh-prof">
        <div className="nh-acct__panel nh-in">
          <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 20 }}>
            {form.avatar ? (
              <img src={form.avatar} alt="" style={{ width: 84, height: 84, borderRadius: 22, objectFit: "cover", border: "1px solid var(--gray-200)", background: "var(--gray-100)" }} />
            ) : (
              <span style={{ width: 84, height: 84, borderRadius: 22, display: "grid", placeItems: "center", background: "var(--nh-ink)", color: "var(--nh-accent)", fontSize: "1.5rem", fontWeight: 800 }}>
                {String(user.name || "?").split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase()}
              </span>
            )}
            <span style={{ display: "grid", gap: 8 }}>
              <button className="nh-btn nh-btn--accent" type="button" style={{ alignSelf: "start" }} onClick={() => setPicker(true)}>
                <span className="material-symbols-rounded" aria-hidden="true">add_photo_alternate</span>
                {form.avatar ? "Change photo" : "Add photo"}
              </button>
              {form.avatar && (
                <button className="nh-btn nh-btn--ghost" type="button" onClick={() => setForm((f) => ({ ...f, avatar: "" }))}>
                  <span className="material-symbols-rounded" aria-hidden="true">delete</span>
                  Remove
                </button>
              )}
            </span>
          </div>

          <h2 className="nh-acct__ptitle">
            <span className="material-symbols-rounded" aria-hidden="true">badge</span>
            Account details
          </h2>
          <form className="nh-prof__form" style={{ marginTop: 18 }} onSubmit={saveProfile}>
            <div className="nh-prof__row">
              <div>
                <label className="nh-prof__lab" htmlFor="pf-name">Full name</label>
                <input
                  id="pf-name"
                  className="nh-prof__in"
                  type="text"
                  value={form.name}
                  onChange={set("name")}
                  required
                  autoComplete="name"
                />
              </div>
              <div>
                <label className="nh-prof__lab" htmlFor="pf-email">Email</label>
                <input
                  id="pf-email"
                  className="nh-prof__in"
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  required
                  autoComplete="email"
                />
              </div>
            </div>
            <div className="nh-prof__row">
              <div>
                <label className="nh-prof__lab" htmlFor="pf-phone">
                  Phone <span style={{ textTransform: "none", letterSpacing: 0, fontWeight: 500 }}>(optional)</span>
                </label>
                <input
                  id="pf-phone"
                  className="nh-prof__in"
                  type="tel"
                  value={form.phone}
                  onChange={set("phone")}
                  placeholder="+1 555 000 1234"
                  autoComplete="tel"
                />
              </div>
              <div>
                <label className="nh-prof__lab" htmlFor="pf-status">Account type</label>
                <input className="nh-prof__in" type="text" value={user.role === "admin" ? "Admin" : "Customer"} disabled readOnly />
              </div>
            </div>
            <div>
              <label className="nh-prof__lab" htmlFor="pf-bio">
                Bio <span style={{ textTransform: "none", letterSpacing: 0, fontWeight: 500 }}>(optional)</span>
              </label>
              <textarea
                id="pf-bio"
                className="nh-prof__in"
                rows={3}
                style={{ minHeight: 90, resize: "vertical" }}
                value={form.bio}
                onChange={set("bio")}
                placeholder="A line or two about you — shows up nowhere yet, but it'll feed review attributions and invoices."
              />
            </div>
            <div>
              <button className="nh-btn nh-btn--accent" type="submit" disabled={busy}>
                {busy ? "Saving…" : "Save changes"}
                <span className="material-symbols-rounded" aria-hidden="true">check</span>
              </button>
            </div>
          </form>
        </div>

        <div className="nh-facts nh-in" style={{ transitionDelay: ".08s" }}>
          <div className="nh-fact">
            <span>Member since</span>
            <b>{user.created_at ? new Date(user.created_at).toLocaleDateString() : "Today"}</b>
          </div>
          <div className="nh-fact">
            <span>Last sign-in</span>
            <b>{user.last_login_at ? new Date(user.last_login_at).toLocaleString() : "—"}</b>
          </div>
          <div className="nh-fact">
            <span>Sign-ins</span>
            <b>{user.login_count || 1}</b>
          </div>
          <div className="nh-fact">
            <span>User ID</span>
            <b style={{ fontSize: ".78rem", letterSpacing: ".04em" }}>{user.id}</b>
          </div>
          <div className="nh-fact">
            <span>Status</span>
            <b style={{ color: "#0b8a4d" }}>{user.status || "active"}</b>
          </div>

          <Link
            to="/account/security"
            className="nh-btn nh-btn--outline"
            style={{ marginTop: 4, width: "100%", justifyContent: "center" }}
          >
            <span className="material-symbols-rounded" aria-hidden="true">security</span>
            Password &amp; security
          </Link>
          <button
            className="nh-btn nh-btn--outline"
            type="button"
            style={{ marginTop: 8, width: "100%", justifyContent: "center" }}
            onClick={handleLogout}
          >
            <span className="material-symbols-rounded" aria-hidden="true">logout</span>
            Sign out
          </button>
        </div>
      </div>

      <MediaPicker
        open={picker}
        title="Profile photo"
        hint="Paste a link (we download it) or upload a file from your computer."
        onClose={() => setPicker(false)}
        onPick={(v) => { setForm((f) => ({ ...f, avatar: v })); setPicker(false); }}
      />
    </>
  );
}