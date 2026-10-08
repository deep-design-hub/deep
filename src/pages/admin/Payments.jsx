/*
 * /admin/payments — money in one place.
 * Automated (Paystack/demo) charges on top, manual bank transfers below
 * with a confirm/decline flow, plus a form to record a transfer received.
 */
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { listOrders, markOrder, deleteOrder, createOrder, paidRevenue } from "../../data/orders";
import { getProject, listPublished } from "../../data/projects";
import RowMenu from "../../components/admin/RowMenu";
import { usePageSEO } from "../../seo";
import "../../auth.css";

const STAT = {
  display: "flex", flexDirection: "column", gap: 6,
  padding: "16px 18px", background: "var(--pure-white)",
  border: "1px solid rgba(10,10,10,.09)", borderRadius: 14, flex: "1 1 180px"
};
const STAT_LABEL = { fontSize: ".7rem", fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--gray-500)" };
const STAT_VALUE = { fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-.03em" };

export default function AdminPayments() {
  const [rows, setRows] = useState(() => listOrders());
  const [flash, setFlash] = useState(null);
  const [openId, setOpenId] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", item: "", custom: false, customTitle: "", amount: "" });
  const [formErr, setFormErr] = useState("");

  usePageSEO({
    noindex: true,
    title: "Deep Design Dev: Admin payments",
    description: "Automated Paystack payments and manual bank transfers for Deep Design Dev.",
    keywords: "deep design hubs admin payments"
  });

  const automated = useMemo(() => rows.filter((o) => o.method !== "bank"), [rows]);
  const bank = useMemo(() => rows.filter((o) => o.method === "bank"), [rows]);
  const bankPending = bank.filter((o) => o.status === "pending");
  const autoPaid = automated.filter((o) => o.status === "paid");
  const autoSum = autoPaid.reduce((n, o) => n + (Number(o.amount) || 0), 0);
  const bankSum = bankPending.reduce((n, o) => n + (Number(o.amount) || 0), 0);
  const saleProjects = useMemo(
    () => listPublished().filter((p) => p.status === "for-sale"),
    []
  );

  function refresh(msg) {
    setRows(listOrders());
    if (msg) setFlash({ ok: true, text: msg });
  }

  function setStatus(o, status) {
    const extra = status === "paid" && o.method === "bank"
      ? { confirmed_at: new Date().toISOString(), confirmed_by: "admin" }
      : {};
    markOrder(o.id, status, extra);
    refresh(
      status === "paid" && o.method === "bank"
        ? `Bank transfer ${o.ref} confirmed — ${o.user_name} now sees the order as paid.`
        : `${o.ref} → ${status}.`
    );
  }

  function remove(o) {
    deleteOrder(o.id);
    refresh(`Order ${o.ref} deleted.`);
  }

  function recordBank(e) {
    e.preventDefault();
    setFormErr("");
    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const item = (form.custom ? form.customTitle : form.item).trim();
    const amount = Number(form.amount);
    if (!name || !email || !item) {
      setFormErr(form.custom ? "Buyer name, email and a description are required." : "Buyer name, email and item are required.");
      return;
    }
    if (!(amount > 0)) {
      setFormErr("Enter the amount received (numbers only).");
      return;
    }
    createOrder({
      user: { name, email },
      project: { slug: "", title: item },
      amount,
      currency: "USD",
      method: "bank",
      license: "Manual bank transfer"
    });
    setForm({ name: "", email: "", item: "", custom: false, customTitle: "", amount: "" });
    refresh(`Bank transfer recorded for ${name} — confirm it below once the money lands.`);
  }

  function kebab(o) {
    const isBank = o.method === "bank";
    return (
      <RowMenu
        label={`Actions for ${o.ref}`}
        items={[
          { label: openId === o.id ? "Hide payment" : "View payment", icon: openId === o.id ? "expand_less" : "visibility", onClick: () => setOpenId(openId === o.id ? null : o.id) },
          ...(o.status !== "paid" ? [{
            label: isBank ? "Confirm payment" : "Mark paid", icon: "task_alt",
            onClick: () => setStatus(o, "paid")
          }] : []),
          ...(isBank && o.status !== "failed" ? [{
            label: "Decline transfer", icon: "cancel", danger: true,
            confirmLabel: `Decline bank transfer ${o.ref} from ${o.user_name}?`,
            onClick: () => setStatus(o, "failed")
          }] : []),
          ...(o.status === "paid" ? [{
            label: "Refund", icon: "undo",
            onClick: () => setStatus(o, "refunded")
          }] : []),
          ...(o.status === "pending" && !isBank ? [{
            label: "Mark failed", icon: "error",
            onClick: () => setStatus(o, "failed")
          }] : []),
          {
            label: "Delete", icon: "delete", danger: true,
            confirmLabel: `Delete payment ${o.ref}? Totals will drop.`,
            onClick: () => remove(o)
          }
        ]}
      />
    );
  }

  function table(list, cols) {
    if (list.length === 0) {
      return <p className="nh-acct__empty">{cols.empty}</p>;
    }
    return (
      <div className="nh-dt__wrap">
        <table className="nh-dt">
          <thead>
            <tr>
              <th>Payment</th>
              <th>Buyer</th>
              <th>Item</th>
              <th>Amount</th>
              <th>Status</th>
              <th className="nh-dt__nowrap">Date</th>
              <th className="nh-dt__actcell"><span className="nh-sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {list.map((o) => {
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
                            <span className="material-symbols-rounded">{o.method === "bank" ? "account_balance" : "credit_card"}</span>
                          </span>
                        )}
                        <span style={{ minWidth: 0 }}>
                          <span className="nh-dt__strong">{o.project_title || o.project_slug || "Manual item"}</span>
                          <span className="nh-dt__sub">{o.method}</span>
                        </span>
                      </span>
                    </td>
                    <td className="nh-dt__strong nh-dt__nowrap">
                      ${o.amount} {o.currency}
                    </td>
                    <td>
                      <span className={`nh-acct__pill nh-acct__pill--${o.status}`}>{o.status}</span>
                    </td>
                    <td className="nh-dt__muted nh-dt__nowrap">
                      {new Date(o.created_at).toLocaleDateString()}
                    </td>
                    <td className="nh-dt__actcell">{kebab(o)}</td>
                  </tr>
                  {openId === o.id && (
                    <tr className="nh-dt__expand">
                      <td colSpan={7}>
                        <div className="nh-dt__expand-in">
                          <div className="nh-dt__expand-grid">
                            <div><span>Payment</span><b>{o.ref}</b></div>
                            <div><span>Buyer</span><b>{o.user_name || "—"}</b> · {o.user_email}</div>
                            <div><span>Item</span>{o.project_title || "Manual item"}</div>
                            <div><span>Method</span>{o.method}{o.method === "bank" ? " (manual)" : " (automated)"}</div>
                            <div><span>Amount</span><b>${o.amount} {o.currency}</b></div>
                            <div><span>Provider ref</span>{o.provider_ref || "—"}</div>
                            <div><span>Status</span><span className={`nh-acct__pill nh-acct__pill--${o.status}`}>{o.status}</span></div>
                            <div><span>Placed</span>{new Date(o.created_at).toLocaleString()}</div>
                            {o.confirmed_at && <div><span>Confirmed</span>{new Date(o.confirmed_at).toLocaleString()} by {o.confirmed_by || "admin"}</div>}
                          </div>
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            {o.project_slug && (
                              <Link className="nh-img-row__btn" to={`/project/${o.project_slug}`}>
                                <span className="material-symbols-rounded" aria-hidden="true">open_in_new</span>
                                Open case study
                              </Link>
                            )}
                            <a className="nh-img-row__btn" href={`mailto:${o.user_email}?subject=Payment%20${o.ref}`}>
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
    );
  }

  return (
    <>
      <div className="nh-dash__head">
        <div>
          <h1>
            Payments
            <br />
            <em>${paidRevenue()} total · {autoPaid.length} automated · {bankPending.length} bank waiting</em>
          </h1>
          <p className="nh-dash__sub">
            Automated Paystack charges arrive here on their own. Bank transfers
            are recorded below and stay <b>pending</b> until you confirm the money landed.
          </p>
        </div>
      </div>

      {flash && (
        <div className="nh-prof__ok" role="status" style={{ marginBottom: 16 }}>
          <span className="material-symbols-rounded" aria-hidden="true">task_alt</span>
          {flash.text}
        </div>
      )}

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 18 }}>
        <div style={STAT}>
          <span style={STAT_LABEL}>Total revenue</span>
          <span style={STAT_VALUE}>${paidRevenue()}</span>
        </div>
        <div style={STAT}>
          <span style={STAT_LABEL}>Automated (Paystack/demo)</span>
          <span style={STAT_VALUE}>${autoSum}</span>
          <span style={{ fontSize: ".76rem", color: "var(--gray-500)" }}>{autoPaid.length} paid charge{autoPaid.length === 1 ? "" : "s"}</span>
        </div>
        <div style={STAT}>
          <span style={STAT_LABEL}>Bank awaiting confirm</span>
          <span style={{ ...STAT_VALUE, color: bankPending.length ? "#b26a00" : "inherit" }}>${bankSum}</span>
          <span style={{ fontSize: ".76rem", color: "var(--gray-500)" }}>{bankPending.length} transfer{bankPending.length === 1 ? "" : "s"} to check</span>
        </div>
      </div>

      <div className="nh-acct__panel nh-in" style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 12 }}>
          <span className="nh-dt__ic" aria-hidden="true">
            <span className="material-symbols-rounded">bolt</span>
          </span>
          <b style={{ letterSpacing: "-.02em" }}>Automated payments</b>
          <span className="nh-dt__muted">Paystack + demo charges from the buy page</span>
        </div>
        {table(automated, { empty: "No automated payments yet — they appear the moment someone buys a template." })}
      </div>

      <div className="nh-acct__panel nh-in" style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 12 }}>
          <span className="nh-dt__ic" aria-hidden="true">
            <span className="material-symbols-rounded">account_balance</span>
          </span>
          <b style={{ letterSpacing: "-.02em" }}>Bank transfers</b>
          <span className="nh-dt__muted">manual payments — confirm each one after checking your bank</span>
        </div>
        {table(bank, { empty: "No bank transfers recorded yet. Use the form below when someone pays by transfer." })}
      </div>

      <div className="nh-acct__panel nh-edt__panel nh-in">
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 6 }}>
          <span className="nh-dt__ic" aria-hidden="true">
            <span className="material-symbols-rounded">add_card</span>
          </span>
          <b style={{ letterSpacing: "-.02em" }}>Record a bank payment</b>
        </div>
        <p className="nh-dt__muted" style={{ marginBottom: 14 }}>
          Money arrived by transfer? Log it here — it stays <b>pending</b> until you
          hit <b>Confirm payment</b> in the kebab above.
        </p>
        <form className="nh-edt__form" onSubmit={recordBank} style={{ maxWidth: 720 }}>
          {formErr && (
            <div className="nh-prof__err" role="alert">
              <span className="material-symbols-rounded" aria-hidden="true">error</span>
              {formErr}
            </div>
          )}
          <div className="nh-edt__row">
            <div>
              <label className="nh-prof__lab" htmlFor="bp-name">Buyer name *</label>
              <input id="bp-name" className="nh-prof__in" type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required autoComplete="off" />
            </div>
            <div>
              <label className="nh-prof__lab" htmlFor="bp-email">Buyer email *</label>
              <input id="bp-email" className="nh-prof__in" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required autoComplete="off" />
            </div>
          </div>
          <div className="nh-edt__row">
            <div>
              <label className="nh-prof__lab" htmlFor="bp-item">Item *</label>
              <select
                id="bp-item"
                className="nh-prof__in"
                value={form.custom ? "__manual" : form.item}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "__manual") {
                    setForm((f) => ({ ...f, custom: true, item: "", customTitle: f.customTitle || "", amount: f.amount }));
                  } else {
                    const p = saleProjects.find((x) => x.title === v);
                    setForm((f) => ({ ...f, custom: false, item: v, amount: p ? String(p.price) : f.amount }));
                  }
                }}
              >
                <option value="">Choose a for-sale project…</option>
                {saleProjects.map((p) => (
                  <option key={p.id} value={p.title}>{p.title} — ${p.price}</option>
                ))}
                <option value="__manual">Something else (describe it)</option>
              </select>
              {form.custom && (
                <input
                  className="nh-prof__in"
                  style={{ marginTop: 8 }}
                  type="text"
                  placeholder="Describe what they paid for"
                  value={form.customTitle}
                  onChange={(e) => setForm((f) => ({ ...f, customTitle: e.target.value }))}
                />
              )}
            </div>
            <div>
              <label className="nh-prof__lab" htmlFor="bp-amount">Amount (USD) *</label>
              <input id="bp-amount" className="nh-prof__in" type="number" min="1" step="0.01" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} required />
            </div>
          </div>
          <div className="nh-edt__acts">
            <button className="nh-btn nh-btn--accent" type="submit">
              Record bank payment
              <span className="material-symbols-rounded" aria-hidden="true">add_card</span>
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
