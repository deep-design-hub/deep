import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../auth";
import { usePageSEO, breadcrumbJsonLd } from "../seo";
import "../auth.css";

export default function Login() {
  const { login, isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const home = user && user.role === "admin" ? "/admin" : "/account";

  usePageSEO({
    title: "Deep Design Dev: Sign in",
    description:
      "Sign in to your Deep Design Dev account to track project requests, downloads and purchases in one place.",
    keywords: "deep design hubs login, sign in, account",
    path: "/login",
    noindex: true,
    jsonLd: [
      breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Sign in", path: "/login" }
      ])
    ]
  });

  useEffect(() => {
    if (isLoggedIn) navigate(home, { replace: true });
  }, [isLoggedIn, home, navigate]);

  function handleSubmit(e) {
    e.preventDefault();
    if (busy) return;
    setError("");
    setBusy(true);
    const data = new FormData(e.currentTarget);
    window.setTimeout(() => {
      const res = login(String(data.get("email") || ""), String(data.get("password") || ""));
      setBusy(false);
      if (res.ok)
        navigate(res.user && res.user.role === "admin" ? "/admin" : "/account", {
          replace: true
        });
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
                  <span className="material-symbols-rounded" aria-hidden="true">account_circle</span>
                  Account
                </span>
                <h1 className="nh-h2" style={{ marginTop: "20px" }}>
                  Welcome back.
                  <br />
                  <em>Pick up where you left off</em>
                </h1>
                <p className="nh-sub">
                  One login covers your project requests, purchases and downloads.
                  Sign in to see status, receipts and replies without digging
                  through email.
                </p>
                <div className="nh-auth__points">
                  <div className="nh-auth__point">
                    <span className="material-symbols-rounded" aria-hidden="true">receipt_long</span>
                    <span><b>Track requests</b> — see every brief you've sent and what it's quoted at.</span>
                  </div>
                  <div className="nh-auth__point">
                    <span className="material-symbols-rounded" aria-hidden="true">shopping_bag</span>
                    <span><b>Order history</b> — receipts, licences and download links for templates.</span>
                  </div>
                  <div className="nh-auth__point">
                    <span className="material-symbols-rounded" aria-hidden="true">forum</span>
                    <span><b>Leave reviews</b> — verified ratings on anything you've bought.</span>
                  </div>
                </div>
              </div>

              <div className="nh-auth__card nh-in" style={{ transitionDelay: ".1s" }}>
                <h2 className="nh-auth__title">Sign in</h2>
                <p className="nh-auth__sub">Use the email and password you registered with.</p>
                <form className="nh-auth__form" onSubmit={handleSubmit} noValidate>
                  {error && (
                    <p className="nh-auth__err" role="alert">
                      <span className="material-symbols-rounded" aria-hidden="true">error</span>
                      {error}
                    </p>
                  )}
                  <div className="nh-auth__field">
                    <label htmlFor="li-email">
                      <span className="material-symbols-rounded" aria-hidden="true">alternate_email</span>
                      Email
                    </label>
                    <input id="li-email" name="email" type="email" placeholder="you@yourcompany.com" autoComplete="email" required />
                  </div>
                  <div className="nh-auth__field">
                    <label htmlFor="li-pass">
                      <span className="material-symbols-rounded" aria-hidden="true">lock</span>
                      Password
                    </label>
                    <input id="li-pass" name="password" type="password" placeholder="Your password" autoComplete="current-password" required />
                  </div>
                  <button className="nh-auth__submit" type="submit" disabled={busy}>
                    {busy ? "Signing in…" : "Sign in"}
                    <span className="material-symbols-rounded" aria-hidden="true">arrow_forward</span>
                  </button>
                </form>
                <p className="nh-auth__alt">
                  No account yet? <Link to="/register">Create one free</Link>
                </p>
                <p className="nh-auth__demo">
                  Demo login: <b>demo@deepdesign.com</b> / <b>demo123</b><br />
                  Admin login: <b>admin@deepdesign.com</b> / <b>admin123</b>
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
