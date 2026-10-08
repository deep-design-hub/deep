import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../auth";
import { usePageSEO, breadcrumbJsonLd } from "../seo";
import "../auth.css";

export default function Register() {
  const { register, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  usePageSEO({
    title: "Deep Design Dev: Create account",
    description:
      "Create a free Deep Design Dev account to send project requests, buy templates and keep every receipt and licence in one place.",
    keywords: "deep design hubs register, create account, sign up",
    path: "/register",
    noindex: true,
    jsonLd: [
      breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Create account", path: "/register" }
      ])
    ]
  });

  useEffect(() => {
    if (isLoggedIn) navigate("/account", { replace: true });
  }, [isLoggedIn, navigate]);

  function handleSubmit(e) {
    e.preventDefault();
    if (busy) return;
    setError("");
    setBusy(true);
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const password = String(data.get("password") || "");
    const confirm = String(data.get("confirm") || "");
    window.setTimeout(() => {
      if (password !== confirm) {
        setBusy(false);
        setError("Passwords don't match.");
        return;
      }
      const res = register({ name, email, password });
      setBusy(false);
      if (res.ok) navigate("/account", { replace: true });
      else setError(res.error);
    }, 350);
  }

  return (
    <>
      <Header />
      <main className="nh-main">
        <section className="nh-auth">
          <div className="nh-wrap">
            <div className="nh-auth__grid">
              <div className="nh-auth__copy nh-in">
                <span className="nh-tag">
                  <span className="material-symbols-rounded" aria-hidden="true">person_add</span>
                  Account
                </span>
                <h1 className="nh-h2" style={{ marginTop: "20px" }}>
                  Create your
                  <br />
                  <em>Deep Design account</em>
                </h1>
                <p className="nh-sub">
                  Free, no card, no newsletter unless you ask for it. An account
                  just keeps your requests, orders and receipts in one place —
                  and lets you leave verified reviews after a purchase.
                </p>
                <div className="nh-auth__points">
                  <div className="nh-auth__point">
                    <span className="material-symbols-rounded" aria-hidden="true">bolt</span>
                    <span><b>30-second signup</b> — email, password, done. No confirmation dance.</span>
                  </div>
                  <div className="nh-auth__point">
                    <span className="material-symbols-rounded" aria-hidden="true">verified_user</span>
                    <span><b>Your data stays yours</b> — accounts exist only to serve your orders.</span>
                  </div>
                  <div className="nh-auth__point">
                    <span className="material-symbols-rounded" aria-hidden="true">support_agent</span>
                    <span><b>Faster replies</b> — requests from a signed-in account are recognised instantly.</span>
                  </div>
                </div>
              </div>

              <div className="nh-auth__card nh-in" style={{ transitionDelay: ".1s" }}>
                <h2 className="nh-auth__title">Create account</h2>
                <p className="nh-auth__sub">Already have one? Sign in instead.</p>
                <form className="nh-auth__form" onSubmit={handleSubmit} noValidate>
                  {error && (
                    <p className="nh-auth__err" role="alert">
                      <span className="material-symbols-rounded" aria-hidden="true">error</span>
                      {error}
                    </p>
                  )}
                  <div className="nh-auth__field">
                    <label htmlFor="rg-name">
                      <span className="material-symbols-rounded" aria-hidden="true">badge</span>
                      Full name
                    </label>
                    <input id="rg-name" name="name" type="text" placeholder="Your name" autoComplete="name" required />
                  </div>
                  <div className="nh-auth__field">
                    <label htmlFor="rg-email">
                      <span className="material-symbols-rounded" aria-hidden="true">alternate_email</span>
                      Email
                    </label>
                    <input id="rg-email" name="email" type="email" placeholder="you@yourcompany.com" autoComplete="email" required />
                  </div>
                  <div className="nh-auth__field">
                    <label htmlFor="rg-pass">
                      <span className="material-symbols-rounded" aria-hidden="true">lock</span>
                      Password
                    </label>
                    <input id="rg-pass" name="password" type="password" placeholder="At least 6 characters" autoComplete="new-password" minLength={6} required />
                  </div>
                  <div className="nh-auth__field">
                    <label htmlFor="rg-confirm">
                      <span className="material-symbols-rounded" aria-hidden="true">lock_reset</span>
                      Confirm password
                    </label>
                    <input id="rg-confirm" name="confirm" type="password" placeholder="Type it again" autoComplete="new-password" minLength={6} required />
                  </div>
                  <button className="nh-auth__submit" type="submit" disabled={busy}>
                    {busy ? "Creating…" : "Create account"}
                    <span className="material-symbols-rounded" aria-hidden="true">arrow_forward</span>
                  </button>
                </form>
                <p className="nh-auth__alt">
                  Already registered? <Link to="/login">Sign in</Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
