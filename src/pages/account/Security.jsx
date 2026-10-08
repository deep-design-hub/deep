/*
 * /account/security — password, sign-in alerts, active sessions,
 * data export and account deletion.
 */
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth";
import {
  changePassword,
  listSessions,
  revokeSession,
  securityPrefs,
  setSecurityPref,
  deleteOwnAccount
} from "../../data/users";
import { ordersFor } from "../../data/orders";
import { requestsFor } from "../../data/requests";
import { usePageSEO, breadcrumbJsonLd } from "../../seo";
import "../../auth.css";

export function strongEnough(pw) {
  if (!pw) return { level: 0, label: "No password yet" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const levels = ["Too weak", "Weak", "Okay", "Strong", "Very strong"];
  return { level: score, label: levels[score] };
}

export default function Security() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  usePageSEO({
    noindex: true,
    title: "Deep Design Dev: Security",
    description: "Change your password, review sign-in alerts, active sessions and export your data.",
    keywords: "deep design hubs security, change password, sessions",
    path: "/account/security",
    jsonLd: [breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "My account", path: "/account" },
      { name: "Security", path: "/account/security" }
    ])]
  });

  const [pwForm, setPwForm] = useState({ current: "", next: "", repeat: "" });
  const [pwMsg, setPwMsg] = useState(null);
  const [pwBusy, setPwBusy] = useState(false);

  const [alertsOn, setAlertsOn] = useState(() => securityPrefs().signInAlerts !== "off");
  const [alertMsg, setAlertMsg] = useState(null);

  const [sessions, setSessions] = useState([]);
  const [sessMsg, setSessMsg] = useState(null);

  const [confirmDel, setConfirmDel] = useState(false);
  const [delBusy, setDelBusy] = useState(false);

  useEffect(() => {
    setSessions(listSessions());
  }, []);

  const strength = useMemo(() => strongEnough(pwForm.next), [pwForm.next]);

  function set(field) {
    return (e) => setPwForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function savePassword(e) {
    e.preventDefault();
    setPwMsg(null);
    if (pwForm.next !== pwForm.repeat) {
      setPwMsg({ ok: false, text: "The new passwords don't match." });
      return;
    }
    setPwBusy(true);
    const res = changePassword(pwForm.current, pwForm.next);
    setPwMsg(res.ok ? { ok: true, text: "Password changed." } : { ok: false, text: res.error || "Could not change password." });
    if (res.ok) setPwForm({ current: "", next: "", repeat: "" });
    setPwBusy(false);
  }

  function toggleAlerts() {
    const next = !alertsOn;
    setAlertsOn(next);
    setSecurityPref("signInAlerts", next ? "on" : "off");
    setAlertMsg({ ok: true, text: next ? "Sign-in alerts turned on." : "Sign-in alerts turned off." });
    setTimeout(() => setAlertMsg(null), 2600);
  }

  function handleRevoke(id) {
    revokeSession(id);
    setSessions(listSessions());
    setSessMsg({ ok: true, text: "Session ended." });
    setTimeout(() => setSessMsg(null), 2400);
  }

  function signOutEverywhere() {
    revokeSession("sess_this");
    setSessMsg({ ok: true, text: "Signed out on every device." });
    setTimeout(() => {
      logout();
      navigate("/login", { replace: true });
    }, 700);
  }

  function exportData() {
    const payload = {
      exported_at: new Date().toISOString(),
      profile: user,
      requests: requestsFor(user.email),
      orders: ordersFor(user.email)
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `deepdesign-my-data-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  }

  function deleteAccount() {
    setDelBusy(true);
    const res = deleteOwnAccount();
    if (res.ok) {
      logout();
      navigate("/", { replace: true });
      return;
    }
    setDelBusy(false);
    setConfirmDel(false);
    setSessMsg({ ok: false, text: res.error || "Account could not be deleted." });
  }

  return (
    <>
      <div className="nh-dash__head">
        <div>
          <h1>
            Security
            <br />
            <em>password, sessions and data</em>
          </h1>
          <p className="nh-dash__sub">
            Everything that protects your account — keep your password strong and
            review where you're signed in.
          </p>
        </div>
      </div>

      {(pwMsg || alertMsg || sessMsg) && (
        <div
          className={(pwMsg || alertMsg || sessMsg).ok ? "nh-prof__ok" : "nh-prof__err"}
          role="status"
          style={{ marginBottom: 18 }}
        >
          <span className="material-symbols-rounded" aria-hidden="true">
            {(pwMsg || alertMsg || sessMsg).ok ? "task_alt" : "error"}
          </span>
          {(pwMsg || alertMsg || sessMsg).text}
        </div>
      )}

      <div className="nh-prof">
        <div className="nh-prof__col">
          <div className="nh-acct__panel nh-in">
            <h2 className="nh-acct__ptitle">
              <span className="material-symbols-rounded" aria-hidden="true">key</span>
              Change password
            </h2>
            <form className="nh-prof__form" style={{ marginTop: 16 }} onSubmit={savePassword}>
              <div>
                <label className="nh-prof__lab" htmlFor="pw-current">Current password</label>
                <input
                  id="pw-current"
                  className="nh-prof__in"
                  type="password"
                  value={pwForm.current}
                  onChange={set("current")}
                  autoComplete="current-password"
                  required
                />
              </div>
              <div className="nh-prof__row">
                <div>
                  <label className="nh-prof__lab" htmlFor="pw-next">New password</label>
                  <input
                    id="pw-next"
                    className="nh-prof__in"
                    type="password"
                    value={pwForm.next}
                    onChange={set("next")}
                    autoComplete="new-password"
                    required
                  />
                  <small className="nh-prof__hint">
                    {pwForm.next ? `Strength: ${strength.label} (${24 + strength.level * 18}%)` : "Minimum 6 characters — mix letters, digits and symbols."}
                  </small>
                </div>
                <div>
                  <label className="nh-prof__lab" htmlFor="pw-repeat">Repeat new password</label>
                  <input
                    id="pw-repeat"
                    className="nh-prof__in"
                    type="password"
                    value={pwForm.repeat}
                    onChange={set("repeat")}
                    autoComplete="new-password"
                    required
                  />
                </div>
              </div>
              <div>
                <button className="nh-btn nh-btn--accent" type="submit" disabled={pwBusy}>
                  {pwBusy ? "Updating…" : "Change password"}
                  <span className="material-symbols-rounded" aria-hidden="true">check</span>
                </button>
              </div>
            </form>
          </div>

          <div className="nh-acct__panel nh-in">
            <div className="nh-acct__ptitle" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span className="material-symbols-rounded" aria-hidden="true">notification_important</span>
                Sign-in alerts
              </span>
              <button
                className={"nh-pref__toggle" + (alertsOn ? " is-on" : "")}
                type="button"
                role="switch"
                aria-checked={alertsOn}
                onClick={toggleAlerts}
                aria-label="Toggle sign-in alerts"
              >
                <span />
              </button>
            </div>
            <p className="nh-prof__hint" style={{ marginTop: 10, marginBottom: 0 }}>
              We'll email you when a new device or browser signs into your account.
              {alertsOn ? " Currently on." : " Currently off."}
            </p>
          </div>

          <div className="nh-acct__panel nh-in">
            <h2 className="nh-acct__ptitle">
              <span className="material-symbols-rounded" aria-hidden="true">devices</span>
              Active sessions
            </h2>
            <div className="nh-sess" style={{ marginTop: 16 }}>
              {sessions.length === 0 && <p className="nh-prof__hint" style={{ margin: 0 }}>No recorded sessions yet.</p>}
              {sessions.map((s) => (
                <div className="nh-sess__row" key={s.id}>
                  <span className="nh-sess__ic" aria-hidden="true">
                    <span className="material-symbols-rounded">{s.current ? "laptop_mac" : "devices_other"}</span>
                  </span>
                  <span className="nh-sess__b">
                    <b>{s.label || "Browser session"} {s.current && <em>This device</em>}</b>
                    <small>
                      {s.browser || "Browser"} · {s.ip || "IP unknown"} · last seen{" "}
                      {s.last_seen ? new Date(s.last_seen).toLocaleString() : "just now"}
                      {s.created_at ? ` · started ${new Date(s.created_at).toLocaleDateString()}` : ""}
                    </small>
                  </span>
                  {!s.current && (
                    <button className="nh-btn nh-btn--ghost nh-sess__btn" type="button" onClick={() => handleRevoke(s.id)}>
                      Revoke
                    </button>
                  )}
                </div>
              ))}
            </div>
            {sessions.some((s) => !s.current) && (
              <button className="nh-btn nh-btn--outline" type="button" style={{ marginTop: 14 }} onClick={signOutEverywhere}>
                <span className="material-symbols-rounded" aria-hidden="true">logout</span>
                Sign out on all other devices
              </button>
            )}
          </div>

          <div className="nh-acct__panel nh-in">
            <h2 className="nh-acct__ptitle">
              <span className="material-symbols-rounded" aria-hidden="true">download</span>
              Your data
            </h2>
            <p className="nh-prof__hint" style={{ marginTop: 10 }}>
              Download a copy of your profile, requests and orders as a JSON file.
            </p>
            <button className="nh-btn nh-btn--accent" type="button" style={{ marginTop: 12 }} onClick={exportData}>
              <span className="material-symbols-rounded" aria-hidden="true">download</span>
              Export my data
            </button>
          </div>

          <div className="nh-acct__panel nh-in">
            <h2 className="nh-acct__ptitle" style={{ color: "#c4362e" }}>
              <span className="material-symbols-rounded" aria-hidden="true">warning</span>
              Danger zone
            </h2>
            <p className="nh-prof__hint" style={{ marginTop: 8 }}>
              Permanently delete your account and all your personal data. This can't be undone.
            </p>
            {!confirmDel ? (
              <button className="nh-btn nh-btn--danger" type="button" style={{ marginTop: 12 }} onClick={() => setConfirmDel(true)}>
                <span className="material-symbols-rounded" aria-hidden="true">delete_forever</span>
                Delete my account
              </button>
            ) : (
              <div className="nh-prof__confirm" style={{ marginTop: 14 }}>
                <b>Are you sure?</b>
                <p>Everything tied to <em>{user.email}</em> will be removed.</p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button className="nh-btn nh-btn--danger" type="button" disabled={delBusy} onClick={deleteAccount}>
                    {delBusy ? "Deleting…" : "Yes, delete forever"}
                  </button>
                  <button className="nh-btn nh-btn--ghost" type="button" onClick={() => setConfirmDel(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="nh-facts nh-in">
          <div className="nh-fact">
            <span>Member since</span>
            <b>{user.created_at ? new Date(user.created_at).toLocaleDateString() : "Today"}</b>
          </div>
          <div className="nh-fact">
            <span>Password updated</span>
            <b>{user.password_updated_at ? new Date(user.password_updated_at).toLocaleDateString() : "—"}</b>
          </div>
          <div className="nh-fact">
            <span>Sign-in alerts</span>
            <b>{alertsOn ? "On" : "Off"}</b>
          </div>
          <div className="nh-fact">
            <span>Active sessions</span>
            <b>{sessions.length}</b>
          </div>
          <div className="nh-fact">
            <span>Email confirmed</span>
            <b style={{ color: "#0b8a4d" }}>Yes</b>
          </div>
        </div>
      </div>
    </>
  );
}