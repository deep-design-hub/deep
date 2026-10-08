/*
 * /account/orders — purchases (Paystack) with refs, status and receipts.
 */
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth";
import { ordersFor } from "../../data/orders";
import { usePageSEO, breadcrumbJsonLd } from "../../seo";
import "../../auth.css";

export default function Orders() {
  const { user } = useAuth();

  usePageSEO({
    noindex: true,
    title: "Deep Design Dev: My orders",
    description: "Every template, UI kit and licence you've bought from Deep Design Dev — refs, statuses and receipts.",
    keywords: "deep design hubs orders, purchases, receipts",
    path: "/account/orders",
    jsonLd: [breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "My account", path: "/account" },
      { name: "Orders", path: "/account/orders" }
    ])]
  });

  const orders = useMemo(() => (user ? ordersFor(user.email) : []), [user]);
  const spent = orders
    .filter((o) => o.status === "paid")
    .reduce((sum, o) => sum + Number(o.amount || 0), 0);

  return (
    <>
      <div className="nh-dash__head">
        <div>
          <h1>
            My orders
            <br />
            <em>{orders.length} order{orders.length === 1 ? "" : "s"} · ${spent} spent</em>
          </h1>
          <p className="nh-dash__sub">
            Receipts and file links are emailed the moment a payment clears. Paid
            orders stay here forever — re-download any time.
          </p>
        </div>
        <div className="nh-dash__headacts">
          <Link to="/projects" className="nh-btn nh-btn--accent">
            <span className="material-symbols-rounded" aria-hidden="true">storefront</span>
            Browse the shop
          </Link>
        </div>
      </div>

      <div className="nh-acct__panel nh-in">
        {orders.length === 0 ? (
          <p className="nh-acct__empty">
            No orders yet. <Link to="/projects">Browse the shop</Link> for templates
            and UI kits — every purchase includes a licence and instant delivery.
          </p>
        ) : (
          <div className="nh-dt__wrap">
            <table className="nh-dt">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Item</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th className="nh-dt__nowrap">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td className="nh-dt__ref">{o.ref}</td>
                    <td>
                      <Link className="nh-dt__strong" style={{ color: "var(--nh-ink)" }} to={`/project/${o.project_slug}`}>
                        {o.project_title || o.project_slug}
                      </Link>
                    </td>
                    <td className="nh-dt__strong nh-dt__nowrap">
                      ${o.amount} {o.currency}
                    </td>
                    <td className="nh-dt__muted nh-dt__nowrap">{o.method}</td>
                    <td>
                      <span className={`nh-acct__pill nh-acct__pill--${o.status}`}>{o.status}</span>
                    </td>
                    <td className="nh-dt__muted nh-dt__nowrap">
                      {new Date(o.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
