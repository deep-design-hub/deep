/*
 * /admin/users — registered accounts with their request/order activity.
 * Row actions live in the 3-dot kebab; the editor is a full page.
 */
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listUsers, updateUser, deleteUser } from "../../data/users";
import { requestsFor } from "../../data/requests";
import { ordersFor } from "../../data/orders";
import { useAuth } from "../../auth";
import RowMenu from "../../components/admin/RowMenu";
import { usePageSEO } from "../../seo";
import "../../auth.css";

export default function AdminUsers() {
  const { user: me } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState(() => listUsers());
  const [flash, setFlash] = useState(null);

  usePageSEO({
    noindex: true,
    title: "Deep Design Hubs: Admin users",
    description: "All registered Deep Design Hubs accounts and their activity.",
    keywords: "deep design hubs admin users"
  });

  const withStats = useMemo(
    () =>
      rows.map((u) => {
        const reqs = requestsFor(u.email);
        const orders = ordersFor(u.email);
        const spent = orders
          .filter((o) => o.status === "paid")
          .reduce((s, o) => s + Number(o.amount || 0), 0);
        return { ...u, reqCount: reqs.length, orderCount: orders.length, spent };
      }),
    [rows]
  );

  function remove(u) {
    if (u.id === me.id) {
      setFlash({ ok: false, text: "You can't delete your own account." });
      return;
    }
    const ok = deleteUser(u.id);
    if (!ok) {
      setFlash({ ok: false, text: "Couldn't delete — the last admin must stay." });
      return;
    }
    setRows(listUsers());
    setFlash({ ok: true, text: `${u.name} deleted. Their requests and orders stay in the records.` });
  }

  function toggleStatus(u) {
    const next = (u.status || "active") === "active" ? "suspended" : "active";
    updateUser(u.id, { status: next });
    setRows(listUsers());
    setFlash({ ok: true, text: `${u.name} is now ${next}.` });
  }

  return (
    <>
      <div className="nh-dash__head">
        <div>
          <h1>
            Users
            <br />
            <em>{withStats.length} account{withStats.length === 1 ? "" : "s"}</em>
          </h1>
          <p className="nh-dash__sub">
            Everyone who has registered or signed in, with the requests they've sent
            and what they've spent.
          </p>
        </div>
        <div className="nh-dash__headacts">
          <button className="nh-rowbtn nh-rowbtn--accent" type="button" onClick={() => navigate("/admin/users/new")}>
            + New user
          </button>
        </div>
      </div>

      {flash && (
        <div className={flash.ok ? "nh-prof__ok" : "nh-prof__err"} role="status" style={{ marginBottom: 16 }}>
          <span className="material-symbols-rounded" aria-hidden="true">{flash.ok ? "task_alt" : "error"}</span>
          {flash.text}
        </div>
      )}

      <div className="nh-acct__panel nh-in">
        <div className="nh-dt__wrap">
          <table className="nh-dt">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th className="nh-dt__nowrap">Requests</th>
                <th className="nh-dt__nowrap">Orders</th>
                <th className="nh-dt__nowrap">Spent</th>
                <th className="nh-dt__nowrap">Joined</th>
                <th className="nh-dt__actcell"><span className="nh-sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {withStats.map((u) => {
                const self = u.id === me.id;
                return (
                  <tr key={u.id}>
                    <td>
                      <div className="nh-dt__strong">{u.name}{self ? " (you)" : ""}</div>
                      <a className="nh-dt__muted" style={{ textDecoration: "underline" }} href={`mailto:${u.email}`}>{u.email}</a>
                    </td>
                    <td>
                      <span className={"nh-acct__pill" + (u.role === "admin" ? " nh-acct__pill--new" : "")}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <span className={"nh-acct__pill" + (u.status === "suspended" ? " nh-acct__pill--failed" : " nh-acct__pill--paid")}>
                        {u.status || "active"}
                      </span>
                    </td>
                    <td className="nh-dt__strong">{u.reqCount}</td>
                    <td className="nh-dt__strong">{u.orderCount}</td>
                    <td className="nh-dt__strong nh-dt__nowrap">{u.spent > 0 ? `$${u.spent}` : "—"}</td>
                    <td className="nh-dt__muted nh-dt__nowrap">
                      {u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}
                    </td>
                    <td className="nh-dt__actcell">
                      <RowMenu
                        label={`Actions for ${u.name}`}
                        items={[
                          { label: "Edit", icon: "edit", to: `/admin/users/${u.id}` },
                          ...(self ? [] : [
                            {
                              label: (u.status || "active") === "active" ? "Suspend" : "Activate",
                              icon: (u.status || "active") === "active" ? "block" : "check_circle",
                              onClick: () => toggleStatus(u)
                            },
                            {
                              label: "Delete", icon: "delete", danger: true,
                              confirmLabel: `Delete ${u.name} (${u.email})? Their requests and orders stay in the records.`,
                              onClick: () => remove(u)
                            }
                          ])
                        ]}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
