import React, { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Stars } from "../components/Stars";
import { getProject, isForSale } from "../data/projects";
import { createOrder, markOrder } from "../data/orders";
import { sendEmail } from "../data/emails";
import { useAuth } from "../auth";
import { charge, isLivePayments } from "../pay";
import { usePageSEO, breadcrumbJsonLd } from "../seo";
import "../detail.css";
import "../auth.css";

export default function Buy() {
  const { slug } = useParams();
  const project = getProject(slug);
  const { isLoggedIn, user } = useAuth();

  const [email, setEmail] = useState(user ? user.email : "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(null); // { ref, title, amount }

  usePageSEO({
    title: project
      ? `Deep Design Hubs: Buy ${project.title} — $${project.price}`
      : "Deep Design Hubs: Buy",
    description: project
      ? `Buy ${project.title} for $${project.price}. ${project.license}. Instant delivery: ${project.delivery}.`
      : "Purchase a Deep Design Hubs template or UI kit.",
    keywords: project ? `buy ${project.title.toLowerCase()}, ${project.tags ? project.tags.join(", ") : ""}` : "buy design templates",
    path: `/buy/${slug}`,
    jsonLd: project
      ? [
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Gallery", path: "/gallery" },
            { name: project.title, path: `/project/${project.slug}` },
            { name: "Buy", path: `/buy/${project.slug}` }
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Offer",
            itemOffered: { "@type": "Product", name: project.title, image: project.images.map((i) => i.src) },
            price: project.price,
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            url: `https://deep-design.netlify.app/buy/${project.slug}`
          }
        ]
      : []
  });

  const related = useMemo(() => (project ? project.includes : []), [project]);

  if (!project) return <Navigate to="/gallery" replace />;
  if (!isForSale(project)) return <Navigate to={`/project/${project.slug}`} replace />;

  async function handlePay(e) {
    e.preventDefault();
    if (busy) return;
    setError("");
    const mail = String(email || "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail)) {
      setError("Enter a valid email — the receipt and files go there.");
      return;
    }
    setBusy(true);
    const buyer = { name: (user && user.name) || mail.split("@")[0], email: mail };
    const order = createOrder({
      user: buyer,
      project,
      amount: project.price,
      currency: "USD",
      method: isLivePayments() ? "paystack" : "demo",
      license: project.license
    });

    try {
      const res = await charge({
        email: buyer.email,
        amount: project.price,
        currency: "USD",
        ref: order.ref,
        name: buyer.name
      });
      const row = markOrder(order.id, "paid", { provider_ref: res.provider_ref, demo: !!res.demo });
      sendEmail({ to: buyer.email, name: buyer.name, template: "purchase", data: { order: row, project } });
      sendEmail({ to: buyer.email, name: buyer.name, template: "invoice", data: { order: row, project } });
      setDone({ ref: row.ref, title: row.project_title, amount: row.amount });
    } catch (err) {
      markOrder(order.id, "failed");
      setError(err && err.message === "Payment cancelled" ? "Payment cancelled — no charge was made." : "Payment failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <>
        <Header />
        <main className="nh-main">
          <section className="nh-auth">
            <div className="nh-wrap">
              <nav className="nh-crumb" aria-label="Breadcrumb" style={{ marginBottom: 18 }}>
                <Link to="/gallery">Gallery</Link>
                <span aria-hidden="true">/</span>
                <Link to={`/project/${slug}`}>{done.title}</Link>
                <span aria-hidden="true">/</span>
                <span aria-current="page">Payment received</span>
              </nav>

              <div className="nh-auth__card nh-in" style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
                <span
                  aria-hidden="true"
                  style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    width: 76, height: 76, borderRadius: "50%",
                    background: "rgba(0, 230, 118, .12)", border: "1px solid rgba(0, 230, 118, .45)",
                    marginBottom: 22
                  }}
                >
                  <span className="material-symbols-rounded" style={{ fontSize: 40, color: "var(--nh-accent)" }}>
                    task_alt
                  </span>
                </span>
                <h1 className="nh-h2" id="buyDoneTitle" style={{ margin: 0 }}>Payment received</h1>
                <p className="nh-sub" style={{ marginTop: 14 }}>
                  <b>{done.title}</b> is yours. A receipt and download instructions
                  are on the way to your inbox.
                </p>
                <div style={{ display: "inline-flex", gap: 10, alignItems: "center", marginTop: 18, padding: "9px 16px", borderRadius: 999, background: "var(--gray-100)", border: "1px solid var(--gray-200)", fontSize: ".8rem", color: "var(--gray-600)" }}>
                  <span>Order</span>
                  <b style={{ fontWeight: 800, letterSpacing: ".06em", color: "var(--nh-ink)" }}>{done.ref}</b>
                </div>
                <p style={{ marginTop: 14, fontSize: ".95rem", color: "var(--gray-600)" }}>
                  <b>${done.amount} USD</b> paid
                  {isLivePayments() ? " via Paystack" : " (demo mode — no real charge)"}
                </p>
                <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 26 }}>
                  <Link to="/account" className="nh-btn nh-btn--accent" data-nav>
                    <span className="material-symbols-rounded" aria-hidden="true">receipt_long</span>
                    View in dashboard
                  </Link>
                  <Link to="/gallery" className="nh-btn nh-btn--ghost" data-nav>
                    Back to gallery
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="nh-main">
        <section className="nh-auth">
          <div className="nh-wrap">
            <nav className="nh-crumb" aria-label="Breadcrumb" style={{ marginBottom: 18 }}>
              <Link to="/gallery">Gallery</Link>
              <span aria-hidden="true">/</span>
              <Link to={`/project/${project.slug}`}>{project.title}</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">Buy</span>
            </nav>

            <div className="nh-auth__grid">
              <div className="nh-auth__copy nh-in">
                <span className="nh-tag">
                  <span className="material-symbols-rounded" aria-hidden="true">sell</span>
                  {project.kind}
                </span>
                <h1 className="nh-h2" style={{ marginTop: "20px" }}>
                  Buy {project.title}
                  <br />
                  <em>once, keep forever</em>
                </h1>
                <p className="nh-sub">{project.def}</p>

                <div style={{ marginTop: 26, display: "flex", alignItems: "center", gap: 12 }}>
                  <Stars value={project.rating.avg} size={18} />
                  <b style={{ letterSpacing: "-.02em" }}>{project.rating.avg.toFixed(1)}</b>
                  <span style={{ fontSize: ".87rem", color: "var(--gray-500)" }}>
                    from {project.rating.count} reviews
                  </span>
                </div>

                <div className="nh-auth__points">
                  <div className="nh-auth__point">
                    <span className="material-symbols-rounded" aria-hidden="true">verified_user</span>
                    <span><b>{project.license}</b> — plain-English terms, no subscription.</span>
                  </div>
                  <div className="nh-auth__point">
                    <span className="material-symbols-rounded" aria-hidden="true">bolt</span>
                    <span><b>{project.delivery}</b> — receipt emailed the moment you pay.</span>
                  </div>
                  <div className="nh-auth__point">
                    <span className="material-symbols-rounded" aria-hidden="true">forum</span>
                    <span><b>Questions first?</b> <Link to={`/project/${project.slug}`} style={{ textDecoration: "underline" }}>Read the full case study</Link> or email me.</span>
                  </div>
                </div>

                {related.length > 0 && (
                  <div style={{ marginTop: 30 }}>
                    <b style={{ fontSize: ".82rem", letterSpacing: ".05em", textTransform: "uppercase", color: "var(--gray-500)" }}>
                      What you get
                    </b>
                    <ul style={{ marginTop: 12, display: "grid", gap: 9 }}>
                      {related.map((inc) => (
                        <li key={inc} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: ".92rem", lineHeight: 1.6, color: "var(--gray-600)" }}>
                          <span className="material-symbols-rounded" style={{ fontSize: 18, color: "var(--nh-ink)" }} aria-hidden="true">check</span>
                          {inc}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="nh-auth__card nh-in" style={{ transitionDelay: ".1s" }}>
                <span className="nh-auth__title" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                  Order summary
                  <span style={{ color: "var(--nh-accent)", fontSize: "1.5rem", fontWeight: 800 }}>${project.price}</span>
                </span>
                <p className="nh-auth__sub">{project.priceNote} · {project.license}</p>

                <form className="nh-auth__form" onSubmit={handlePay}>
                  {error && (
                    <p className="nh-auth__err" role="alert">
                      <span className="material-symbols-rounded" aria-hidden="true">error</span>
                      {error}
                    </p>
                  )}
                  <div className="nh-auth__field">
                    <label htmlFor="by-email">
                      <span className="material-symbols-rounded" aria-hidden="true">alternate_email</span>
                      Email for receipt &amp; files
                    </label>
                    <input
                      id="by-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@yourcompany.com"
                      autoComplete="email"
                      required
                    />
                  </div>
                  {!isLoggedIn && (
                    <p className="nh-auth__sub" style={{ margin: 0 }}>
                      Signing in first keeps every order in your{" "}
                      <Link to="/login" style={{ color: "var(--nh-accent)" }}>dashboard</Link> —
                      or just checkout as a guest.
                    </p>
                  )}
                  <button className="nh-auth__submit" type="submit" disabled={busy}>
                    {busy ? "Opening secure checkout…" : `Pay $${project.price} — get the files`}
                    <span className="material-symbols-rounded" aria-hidden="true">
                      {busy ? "progress_activity" : "lock"}
                    </span>
                  </button>
                </form>

                <p className="nh-auth__demo">
                  {isLivePayments()
                    ? <>Payments secured by <b>Paystack</b>.</>
                    : <>Demo mode: <b>VITE_PAYSTACK_PUBLIC_KEY</b> not set, so no real charge happens — add it in <b>.env</b> to go live.</>}
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
