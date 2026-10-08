/*
 * /admin/subscribers — newsletter signups from the home page.
 */
import React, { useState } from "react";
import { listSubscribers, deleteSubscriber } from "../../data/subscribers";
import RowMenu from "../../components/admin/RowMenu";
import { usePageSEO } from "../../seo";
import "../../auth.css";

export default function AdminSubscribers() {
  const [rows, setRows] = useState(() => listSubscribers());
  const [flash, setFlash] = useState(null);

  function remove(s) {
    deleteSubscriber(s.id);
    setRows(listSubscribers());
    setFlash(`${s.email} removed from the list.`);
  }

  usePageSEO({
    noindex: true,
    title: "Deep Design Hubs: Admin subscribers",
    description: "Newsletter subscribers collected by Deep Design Hubs.",
    keywords: "deep design hubs admin subscribers"
  });

  return (
    <>
      <div className="nh-dash__head">
        <div>
          <h1>
            Subscribers
            <br />
            <em>{rows.length} on the list</em>
          </h1>
          <p className="nh-dash__sub">
            Emails collected from the footer newsletter form. Export to your mail
            tool when the backend lands — one table, one query.
          </p>
        </div>
      </div>

      {flash && (
        <div className="nh-prof__ok" role="status" style={{ marginBottom: 16 }}>
          <span className="material-symbols-rounded" aria-hidden="true">task_alt</span>
          {flash}
        </div>
      )}

      <div className="nh-acct__panel nh-in">
        {rows.length === 0 ? (
          <p className="nh-acct__empty">Nobody on the list yet — signups appear here instantly.</p>
        ) : (
          <div className="nh-dt__wrap">
            <table className="nh-dt">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th className="nh-dt__nowrap">Joined</th>
                  <th className="nh-dt__actcell"><span className="nh-sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((s, i) => (
                  <tr key={s.id}>
                    <td className="nh-dt__muted">{i + 1}</td>
                    <td className="nh-dt__strong">
                      <a style={{ textDecoration: "underline" }} href={`mailto:${s.email}`}>{s.email}</a>
                    </td>
                    <td>
                      <span className="nh-acct__pill nh-acct__pill--paid">{s.status || "active"}</span>
                    </td>
                    <td className="nh-dt__muted nh-dt__nowrap">
                      {new Date(s.created_at).toLocaleDateString()}
                    </td>
                    <td className="nh-dt__actcell">
                      <RowMenu
                        label={`Actions for ${s.email}`}
                        items={[
                          { label: "Email", icon: "mail", onClick: () => { window.location.href = `mailto:${s.email}`; } },
                          {
                            label: "Remove", icon: "delete", danger: true,
                            confirmLabel: `Remove ${s.email} from the list?`,
                            onClick: () => remove(s)
                          }
                        ]}
                      />
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
