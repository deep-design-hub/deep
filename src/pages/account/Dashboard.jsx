/*
 * /account — Dashboard home: stats, latest requests + orders, quick actions.
 */
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth";
import { requestsFor } from "../../data/requests";
import { ordersFor } from "../../data/orders";
import { usePageSEO, breadcrumbJsonLd } from "../../seo";
import "../../auth.css";

export default function Dashboard() {
  const { user } = useAuth();

  usePageSEO({
    noindex: true,
    title: "Deep Design Hubs: Dashboard",
    description:
      "Your Deep Design Hubs dashboard — requests, orders and profile at a glance.",
    keywords: "deep design hubs dashboard, orders, requests, account",
    path: "/account",
    jsonLd: [breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "My account", path: "/account" },
      { name: "Dashboard", path: "/account" }
    ])]
  });

  const reqs = useMemo(() => (user ? requestsFor(user.email) : []), [user]);
  const orders = useMemo(() => (user ? ordersFor(user.email) : []), [user]);
  const paid = orders.filter((o) => o.status === "paid");

  const stats = [
    { n: reqs.length, l: "Requests sent", i: "mail" },
    { n: orders.length, l: "Orders placed", i: "shopping_bag" },
    { n: paid.length, l: "Purchases completed", i: "workspace_premium" },
    { n: "24h", l: "Typical reply time", i: "schedule" }
  ];

  return (
    <>
      <div className="nh-dash__head">
        <div>
          <h1>
            Welcome back, {String(user.name).split(" ")[0]}
            <br />
            <em>here's the latest</em>
          </h1>
          <p className="nh-dash__sub">
            Everything you've sent and bought lives here — status, references and
            receipts, updated the moment something moves.
          </p>
        </div>
        <div className="nh-dash__headacts">
          <Link to="/contact" className="nh-btn nh-btn--accent">
            <span className="material-symbols-rounded" aria-hidden="true">add_task</span>
            New request
          </Link>
          <Link to="/gallery" className="nh-btn nh-btn--outline">
            <span className="material-symbols-rounded" aria-hidden="true">photo_library</span>
            Browse work
          </Link>
        </div>
      </div>

      <div className="nh-acct__stats" style={{ marginTop: 0 }}>
        {stats.map((s, i) => (
          <div className="nh-acct__stat nh-in" key={s.l} style={{ transitionDelay: `${i * 0.06}s` }}>
            <b>{s.n}</b>
            <span>{s.l}</span>
          </div>
        ))}
      </div>

      <div className="nh-acct__cols" style={{ marginTop: 26 }}>
        <div className="nh-acct__panel nh-in">
          <h2 className="nh-acct__ptitle">
            <span className="material-symbols-rounded" aria-hidden="true">mail</span>
            Latest requests
            {reqs.length > 0 && (
              <Link to="/account/requests" className="nh-acct__all">
                View all
                <span className="material-symbols-rounded" aria-hidden="true">arrow_forward</span>
              </Link>
            )}
          </h2>
          {reqs.length === 0 ? (
            <p className="nh-acct__empty">
              No requests yet. <Link to="/contact">Send your first brief</Link> — you'll
              get a fixed quote within 24 hours.
            </p>
          ) : (
            <div className="nh-acct__list">
              {reqs.slice(0, 3).map((r) => (
                <div className="nh-acct__row" key={r.id}>
                  <div className="nh-acct__row-top">
                    <span className="nh-acct__ref">{r.ref}</span>
                    <span className={`nh-acct__pill nh-acct__pill--${r.status}`}>{r.status}</span>
                  </div>
                  <div className="nh-acct__row-title">{r.service}</div>
                  <div className="nh-acct__row-meta">
                    {r.budget ? `${r.budget} · ` : ""}
                    {new Date(r.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="nh-acct__panel nh-in" style={{ transitionDelay: ".08s" }}>
          <h2 className="nh-acct__ptitle">
            <span className="material-symbols-rounded" aria-hidden="true">shopping_bag</span>
            Latest orders
            {orders.length > 0 && (
              <Link to="/account/orders" className="nh-acct__all">
                View all
                <span className="material-symbols-rounded" aria-hidden="true">arrow_forward</span>
              </Link>
            )}
          </h2>
          {orders.length === 0 ? (
            <p className="nh-acct__empty">
              No orders yet. <Link to="/gallery">Browse the shop</Link> for templates
              and UI kits.
            </p>
          ) : (
            <div className="nh-acct__list">
              {orders.slice(0, 3).map((o) => (
                <div className="nh-acct__row" key={o.id}>
                  <div className="nh-acct__row-top">
                    <span className="nh-acct__ref">{o.ref}</span>
                    <span className={`nh-acct__pill nh-acct__pill--${o.status}`}>{o.status}</span>
                  </div>
                  <div className="nh-acct__row-title">{o.project_title || o.project_slug}</div>
                  <div className="nh-acct__row-meta">
                    ${o.amount} {o.currency} · {o.method} · {new Date(o.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
