/*
 * /admin/users/new | /admin/users/:id — full-page account editor.
 * Layout: identity fields left; account state (role/status/save), avatar
 * and account activity in the right rail.
 */
import React, { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { listUsers, createUser, updateUser } from "../../data/users";
import { requestsFor } from "../../data/requests";
import { ordersFor } from "../../data/orders";
import { useAuth } from "../../auth";
import { usePageSEO } from "../../seo";
import MediaPicker from "../../components/admin/MediaPicker";
import "../../auth.css";

const EMPTY = {
  name: "", email: "", password: "", role: "customer", status: "active",
  avatar: "", phone: "", bio: ""
};

function toForm(u) {
  if (!u) return { ...EMPTY };
  return {
    name: u.name || "", email: u.email || "", password: "",
    role: u.role === "admin" ? "admin" : "customer",
    status: u.status === "suspended" ? "suspended" : "active",
    avatar: u.avatar || "", phone: u.phone || "", bio: u.bio || ""
  };
}

export default function UserEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: me } = useAuth();
  const all = useMemo(() => listUsers(), []);
  const editing = id && id !== "new" ? all.find((u) => u.id === id) : null;

  const [form, setForm] = useState(() => toForm(editing));
  const [msg, setMsg] = useState(null);
  const [picker, setPicker] = useState(false);

  const activity = useMemo(() => {
    if (!editing) return null;
    const reqs = requestsFor(editing.email);
    const ords = ordersFor(editing.email);
    return {
      requests: reqs.length,
      newRequests: reqs.filter((r) => r.status === "new").length,
      orders: ords.length,
      paid: ords.filter((o) => o.status === "paid").length,
      spent: ords.filter((o) => o.status === "paid").reduce((n, o) => n + (Number(o.amount) || 0), 0)
    };
  }, [editing]);

  usePageSEO({
    noindex: true,
    title: `Deep Design Hubs: ${editing ? "Edit" : "New"} account`,
    description: "Create or edit a Deep Design Hubs account.",
    keywords: "deep design hubs admin user editor"
  });

  function set(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function submit(e) {
    e.preventDefault();
    if (editing) {
      const patch = {
        name: form.name, email: form.email, role: form.role, status: form.status,
        avatar: form.avatar, phone: form.phone, bio: form.bio
      };
      if (form.password) patch.password = form.password;
      if (editing.id === me.id && form.role !== "admin") {
        setMsg({ ok: false, text: "You can't remove your own admin role." });
        return;
      }
      const res = updateUser(editing.id, patch);
      if (!res.ok) {
        setMsg({ ok: false, text: res.error || "Could not save." });
        return;
      }
    } else {
      const res = createUser(form);
      if (!res.ok) {
        setMsg({ ok: false, text: res.error || "Could not create." });
        return;
      }
    }
    navigate("/admin/users");
  }

  if (id && id !== "new" && !editing) {
    return (
      <>
        <div className="nh-dash__head">
          <div>
            <h1>
              Account not found
              <br />
              <em>That id isn't in the users table.</em>
            </h1>
          </div>
        </div>
        <div className="nh-acct__panel nh-in">
          <p className="nh-acct__empty">
            <Link className="nh-rowbtn" to="/admin/users">Back to users</Link>
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
            {editing ? "Edit account" : "New account"}
            <br />
            <em>
              {editing
                ? "Identity, avatar, role and status — plus everything this account has done."
                : "Create an account for someone who can't register themselves."}
            </em>
          </h1>
          <p className="nh-dash__sub">
            <Link to="/admin/users">← Back to users</Link>
          </p>
        </div>
      </div>

      <div className="nh-edt__grid">
        {/* ---------- left: identity ---------- */}
        <div className="nh-acct__panel nh-edt__panel nh-in">
          {msg && (
            <div className={msg.ok ? "nh-prof__ok" : "nh-prof__err"} role="status">
              <span className="material-symbols-rounded" aria-hidden="true">{msg.ok ? "task_alt" : "error"}</span>
              {msg.text}
            </div>
          )}

          <form className="nh-edt__form" onSubmit={submit}>
            <div className="nh-edt__row">
              <div>
                <label className="nh-prof__lab" htmlFor="us-name">Name *</label>
                <input id="us-name" className="nh-prof__in" type="text" value={form.name} onChange={set("name")} required autoComplete="off" />
              </div>
              <div>
                <label className="nh-prof__lab" htmlFor="us-email">Email *</label>
                <input id="us-email" className="nh-prof__in" type="email" value={form.email} onChange={set("email")} required autoComplete="off" />
              </div>
            </div>

            <div className="nh-edt__row">
              <div>
                <label className="nh-prof__lab" htmlFor="us-phone">Phone <span style={{ textTransform: "none", letterSpacing: 0, fontWeight: 500 }}>(optional)</span></label>
                <input id="us-phone" className="nh-prof__in" type="tel" value={form.phone} onChange={set("phone")} placeholder="+1 555 000 1234" autoComplete="off" />
              </div>
              <div>
                <label className="nh-prof__lab" htmlFor="us-pw">
                  {editing ? "New password (leave blank to keep)" : "Password *"}
                </label>
                <input id="us-pw" className="nh-prof__in" type="password" value={form.password} onChange={set("password")} placeholder="At least 6 characters" autoComplete="new-password" required={!editing} />
              </div>
            </div>

            <div>
              <label className="nh-prof__lab" htmlFor="us-bio">Bio <span style={{ textTransform: "none", letterSpacing: 0, fontWeight: 500 }}>(optional)</span></label>
              <textarea id="us-bio" className="nh-prof__in nh-edt__ta" value={form.bio} onChange={set("bio")} placeholder="One or two lines about who this person is." />
            </div>

            <p className="nh-edt__hint">Passwords are hashed with a demo salt today — server-side bcrypt when the API lands.</p>

            <div className="nh-edt__acts nh-edt__acts--mobile">
              <button className="nh-btn nh-btn--accent" type="submit">
                {editing ? "Save changes" : "Create account"}
                <span className="material-symbols-rounded" aria-hidden="true">check</span>
              </button>
            </div>
          </form>
        </div>

        {/* ---------- right: account state ---------- */}
        <aside className="nh-edt__rail">
          <div className="nh-edt__card nh-in">
            <b>
              <span className="material-symbols-rounded" aria-hidden="true">manage_accounts</span>
              Account state
            </b>
            <div className="nh-edt__stack">
              <div>
                <label className="nh-prof__lab" htmlFor="us-role">Role</label>
                <select id="us-role" className="nh-prof__in" value={form.role} onChange={set("role")}>
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="nh-prof__lab" htmlFor="us-status">Status</label>
                <select id="us-status" className="nh-prof__in" value={form.status} onChange={set("status")}>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
              <div className="nh-edt__acts nh-edt__acts--rail" style={{ display: "grid", gap: 8 }}>
                <button className="nh-btn nh-btn--accent" type="button" onClick={submit}>
                  {editing ? "Save changes" : "Create account"}
                  <span className="material-symbols-rounded" aria-hidden="true">check</span>
                </button>
                <button className="nh-btn nh-btn--ghost" type="button" onClick={() => navigate("/admin/users")}>Cancel</button>
              </div>
              {editing && editing.status === "suspended" && (
                <p className="nh-edt__hint"><b>Suspended</b> — this account can't sign in until reactivated.</p>
              )}
            </div>
          </div>

          <div className="nh-edt__card nh-in" style={{ transitionDelay: ".06s" }}>
            <b>
              <span className="material-symbols-rounded" aria-hidden="true">account_circle</span>
              Avatar
            </b>
            <div className="nh-edt__stack">
              {form.avatar ? (
                <img className="nh-edt__cover-prev" style={{ aspectRatio: "1 / 1", objectFit: "cover" }} src={form.avatar} alt="" />
              ) : (
                <div className="nh-edt__cover-empty" style={{ aspectRatio: "1 / 1" }}>
                  <span className="material-symbols-rounded" aria-hidden="true">account_circle</span>
                  No photo yet
                </div>
              )}
              <button className="nh-btn nh-btn--accent" type="button" onClick={() => setPicker(true)}>
                <span className="material-symbols-rounded" aria-hidden="true">add_photo_alternate</span>
                {form.avatar ? "Change photo" : "Add photo"}
              </button>
              {form.avatar && (
                <button className="nh-btn nh-btn--ghost" type="button" onClick={() => setForm((f) => ({ ...f, avatar: "" }))}>
                  <span className="material-symbols-rounded" aria-hidden="true">hide_image</span>
                  Remove photo
                </button>
              )}
            </div>
          </div>

          {editing && activity && (
            <div className="nh-edt__card nh-in" style={{ transitionDelay: ".1s" }}>
              <b>
                <span className="material-symbols-rounded" aria-hidden="true">insights</span>
                Activity
              </b>
              <div className="nh-edt__stack" style={{ fontSize: ".85rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <span style={{ color: "var(--gray-600)" }}>Requests</span>
                  <b>{activity.requests}{activity.newRequests ? ` · ${activity.newRequests} new` : ""}</b>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <span style={{ color: "var(--gray-600)" }}>Orders</span>
                  <b>{activity.orders}{activity.paid ? ` · ${activity.paid} paid` : ""}</b>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <span style={{ color: "var(--gray-600)" }}>Total spent</span>
                  <b>${activity.spent}</b>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
                  <Link className="nh-img-row__btn" to="/admin/requests">
                    <span className="material-symbols-rounded" aria-hidden="true">inbox</span>
                    Requests
                  </Link>
                  <Link className="nh-img-row__btn" to="/admin/orders">
                    <span className="material-symbols-rounded" aria-hidden="true">receipt_long</span>
                    Orders
                  </Link>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>

      <MediaPicker
        open={picker}
        title="Account photo"
        hint="Paste a link (we download it) or upload a file from your computer."
        onClose={() => setPicker(false)}
        onPick={(v) => { setForm((f) => ({ ...f, avatar: v })); setPicker(false); }}
      />
    </div>
  );
}
