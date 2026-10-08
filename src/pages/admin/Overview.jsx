/*
 * /admin — overview: aggregates + latest activity across tables.
 */
import React from "react";
import { Link } from "react-router-dom";
import { dashboardStats, recentActivity } from "../../data/admin";
import { usePageSEO } from "../../seo";
import "../../auth.css";

const TYPE_META = {
  request: { icon: "inbox", label: "Request", to: "/admin/requests" },
  order: { icon: "receipt_long", label: "Order", to: "/admin/orders" },
  user: { icon: "person", label: "User", to: "/admin/users" },
  review: { icon: "star", label: "Review", to: "/admin/reviews" }
};

export default function Overview() {
  const s = dashboardStats();
  const feed = recentActivity(10);

  usePageSEO({
    noindex: true,
    title: "Deep Design Hubs: Admin overview",
    description: "Deep Design Hubs admin console — requests, orders, users and revenue at a glance.",
    keywords: "deep design hubs admin, dashboard"
  });

  const cards = [
    { n: s.newRequests, l: "New requests", i: "inbox", to: "/admin/requests", hot: s.newRequests > 0 },
    { n: s.requests, l: "Requests total", i: "mail", to: "/admin/requests" },
    { n: s.paidOrders, l: "Paid orders", i: "task_alt", to: "/admin/orders" },
    { n: `$${s.revenue}`, l: "Revenue", i: "payments", to: "/admin/orders" },
    { n: s.users, l: "Users", i: "group", to: "/admin/users" },
    { n: s.reviews, l: "Reviews", i: "star", to: "/admin/reviews" },
    { n: s.subscribers, l: "Subscribers", i: "subscriptions", to: "/admin/subscribers" },
    { n: s.emailsQueued, l: "Emails queued", i: "send", to: "/admin/emails" }
  ];

  return (
    <>
      <div className="nh-dash__head">
        <div>
          <h1>
            Overview
            <br />
            <em>everything, one screen</em>
          </h1>
          <p className="nh-dash__sub">
            Live totals from the data layer — requests, orders, users, reviews and
            the email outbox.
          </p>
        </div>
        <div className="nh-dash__headacts">
          <Link to="/admin/requests" className="nh-btn nh-btn--accent">
            <span className="material-symbols-rounded" aria-hidden="true">inbox</span>
            {s.newRequests > 0 ? `${s.newRequests} new request${s.newRequests === 1 ? "" : "s"}` : "Inbox clear"}
          </Link>
        </div>
      </div>

      <div className="nh-acct__stats" style={{ marginTop: 0 }}>
        {cards.map((c, i) => (
          <Link
            key={c.l}
            to={c.to}
            className="nh-acct__stat nh-in"
            style={{ textDecoration: "none", color: "inherit", transitionDelay: `${i * 0.04}s`, ...(c.hot ? { borderColor: "rgba(0,230,118,.5)", background: "rgba(0,230,118,.05)" } : {}) }}
          >
            <b>{c.n}</b>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span className="material-symbols-rounded" style={{ fontSize: 15 }} aria-hidden="true">{c.i}</span>
              {c.l}
            </span>
          </Link>
        ))}
      </div>

      <div className="nh-acct__panel nh-in" style={{ marginTop: 24 }}>
        <h2 className="nh-acct__ptitle">
          <span className="material-symbols-rounded" aria-hidden="true">history</span>
          Latest activity
        </h2>
        {feed.length === 0 ? (
          <p className="nh-acct__empty">Quiet for now — new requests and orders will show up here.</p>
        ) : (
          <div className="nh-dt__wrap" style={{ marginTop: 14 }}>
            <table className="nh-dt">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Detail</th>
                  <th>Ref</th>
                  <th className="nh-dt__nowrap">When</th>
                </tr>
              </thead>
              <tbody>
                {feed.map((a, i) => {
                  const meta = TYPE_META[a.type] || TYPE_META.request;
                  return (
                    <tr key={a.type + a.ref + i}>
                      <td className="nh-dt__nowrap">
                        <span className="nh-dt__strong" style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
                          <span className="material-symbols-rounded" style={{ fontSize: 17, color: "var(--gray-500)" }} aria-hidden="true">
                            {meta.icon}
                          </span>
                          {meta.label}
                        </span>
                      </td>
                      <td className="nh-dt__clip" title={a.label}>{a.label}</td>
                      <td className="nh-dt__ref">{a.ref}</td>
                      <td className="nh-dt__muted nh-dt__nowrap">
                        {new Date(a.at).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
