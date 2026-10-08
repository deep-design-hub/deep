/*
 * /admin/orders — purchases with status actions via the 3-dot kebab.
 * Status pill visible in view; changes happen in the kebab.
 */
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { listOrders, markOrder, deleteOrder, ORDER_STATUSES, paidRevenue } from "../../data/orders";
import { getProject } from "../../data/projects";
import RowMenu from "../../components/admin/RowMenu";
import { usePageSEO } from "../../seo";
import "../../auth.css";

export default function AdminOrders() {
  const [rows, setRows] = useState(() => listOrders());
  const [filter, setFilter] = useState("all");
  const [flash, setFlash] = useState(null);
  const [openId, setOpenId] = useState(null);

  usePageSEO({
    noindex: true,
    title: "Deep Design Hubs: Admin orders",
    description: "All purchases, payments and refunds in the Deep Design Hubs store.",
    keywords: "deep design hubs admin orders"
  });

  const shown = useMemo(
    () => (filter === "all" ? rows : rows.filter((o) => o.status === filter)),
    [rows, filter]
  );
  const revenue = paidRevenue();

  function setStatus(id, status, ref) {
    markOrder(id, status);
    setRows(listOrders());
    setFlash({ ok: true, text: `${ref} → ${status}.` });
  }

  function remove(o) {
    deleteOrder(o.id);
    setRows(listOrders());
    setFlash({ ok: true, text: `Order ${o.ref} deleted. Revenue totals updated.` });
  }

  return (
    <>
      <div className="nh-dash__head">
        <div>
          <h1>
            Orders
            <br />
            <em>${revenue} revenue · {rows.filter((o) => o.status === "paid").length} paid</em>
          </h1>
          <p className="nh-dash__sub">
            Paystack and demo payments. Status changes here reflect instantly in the
            customer's dashboard.
          </p>
        </div>
        <div className="nh-dash__headacts">
          <label className="nh-prof__lab" htmlFor="or-filter" style={{ marginBottom: 0, alignSelf: "center" }}>
            Filter
          </label>
          <select id="or-filter" className="nh-selbtn" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All statuses</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {flash && (
        <div className="nh-prof__ok" role="status" style={{ marginBottom: 16 }}>
          <span className="material-symbols-rounded" aria-hidden="true">task_alt</span>
          {flash.text}
        </div>
      )}

      <div className="nh-acct__panel nh-in">
        {shown.length === 0 ? (
          <p className="nh-acct__empty">
            No orders{filter !== "all" ? ` with status “${filter}”` : " yet"}.{" "}
            <Link to="/gallery">Visit the shop</Link>.
          </p>
        ) : (
          <div className="nh-dt__wrap">
            <table className="nh-dt">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Buyer</th>
                  <th>Item</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th className="nh-dt__nowrap">Date</th>
                  <th className="nh-dt__actcell"><span className="nh-sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {shown.map((o) => {
                  const proj = getProject(o.project_slug);
                  return (
                  <React.Fragment key={o.id}>
                  <tr>
                    <td className="nh-dt__ref">{o.ref}</td>
                    <td>
                      <div className="nh-dt__strong">{o.user_name || "—"}</div>
                      <span className="nh-dt__muted">{o.user_email}</span>
                    </td>
                    <td>
                      <span className="nh-dt__cell">
                        {proj && proj.cover ? (
                          <img className="nh-dt__thumb" src={proj.cover} alt="" loading="lazy" />
                        ) : (
                          <span className="nh-dt__ic" aria-hidden="true">
                            <span className="material-symbols-rounded">{o.status === "paid" ? "task_alt" : "shopping_bag"}</span>
                          </span>
                        )}
                        <span style={{ minWidth: 0 }}>
                          <Link className="nh-dt__strong" style={{ color: "var(--nh-ink)" }} to={`/project/${o.project_slug}`}>
                            {o.project_title || o.project_slug}
                          </Link>
                          <span className="nh-dt__sub">{o.license || ""}</span>
                        </span>
                      </span>
                    </td>
                    <td className="nh-dt__strong nh-dt__nowrap">
                      ${o.amount} {o.currency}
                      <div className="nh-dt__muted">{o.method}</div>
                    </td>
                    <td>
                      <span className={`nh-acct__pill nh-acct__pill--${o.status}`}>{o.status}</span>
                    </td>
                    <td className="nh-dt__muted nh-dt__nowrap">
                      {new Date(o.created_at).toLocaleDateString()}
                    </td>
                    <td className="nh-dt__actcell">
                      <RowMenu
                        label={`Actions for ${o.ref}`}
                        items={[
                          { label: openId === o.id ? "Hide order" : "View order", icon: openId === o.id ? "expand_less" : "visibility", onClick: () => setOpenId(openId === o.id ? null : o.id) },
                          ...(o.status !== "paid" ? [{
                            label: "Mark paid", icon: "payments",
                            onClick: () => setStatus(o.id, "paid", o.ref)
                          }] : []),
                          ...(o.status === "paid" ? [{
                            label: "Refund", icon: "undo",
                            onClick: () => setStatus(o.id, "refunded", o.ref)
                          }] : []),
                          ...(o.status === "pending" ? [{
                            label: "Mark failed", icon: "error",
                            onClick: () => setStatus(o.id, "failed", o.ref)
                          }] : []),
                          ...ORDER_STATUSES
                            .filter((s) => s !== o.status && !["paid", "refunded", "failed"].includes(s))
                            .map((s) => ({
                              label: `Mark ${s}`, icon: "flag",
                              onClick: () => setStatus(o.id, s, o.ref)
                            })),
                          {
                            label: "Delete", icon: "delete", danger: true,
                            confirmLabel: `Delete order ${o.ref}? Revenue totals will drop.`,
                            onClick: () => remove(o)
                          }
                        ]}
                      />
                    </td>
                  </tr>
                  {openId === o.id && (
                    <tr className="nh-dt__expand">
                      <td colSpan={7}>
                        <div className="nh-dt__expand-in">
                          <div className="nh-dt__expand-grid">
                            <div><span>Order</span><b>{o.ref}</b></div>
                            <div><span>Buyer</span><b>{o.user_name || "—"}</b> · {o.user_email}</div>
                            <div><span>Item</span>{o.project_title || o.project_slug}</div>
                            <div><span>Licence</span>{o.license || "—"}</div>
                            <div><span>Amount</span><b>${o.amount} {o.currency}</b> · {o.method}</div>
                            <div><span>Status</span><span className={`nh-acct__pill nh-acct__pill--${o.status}`}>{o.status}</span></div>
                            <div><span>Provider ref</span>{o.provider_ref || "—"}</div>
                            <div><span>Placed</span>{new Date(o.created_at).toLocaleString()}</div>
                          </div>
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            <Link className="nh-img-row__btn" to={`/project/${o.project_slug}`}>
                              <span className="material-symbols-rounded" aria-hidden="true">open_in_new</span>
                              Open case study
                            </Link>
                            <a className="nh-img-row__btn" href={`mailto:${o.user_email}?subject=Order%20${o.ref}`}>
                              <span className="material-symbols-rounded" aria-hidden="true">mail</span>
                              Email buyer
                            </a>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                  </React.Fragment>
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
