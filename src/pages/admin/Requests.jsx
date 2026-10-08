/*
 * /admin/requests — inbox of briefs with live status control.
 * Status pill visible in view; changes happen via the 3-dot kebab.
 */
import React, { useMemo, useState } from "react";
import { listRequests, updateRequestStatus, deleteRequest, REQUEST_STATUSES, SERVICE_LABELS } from "../../data/requests";
import RowMenu from "../../components/admin/RowMenu";
import { usePageSEO } from "../../seo";
import "../../auth.css";

const SERVICE_ICONS = {
  brand: "branding_watermark",
  web: "language",
  product: "dashboard",
  graphic: "palette",
  licensing: "license",
  other: "widgets"
};

export default function AdminRequests() {
  const [rows, setRows] = useState(() => listRequests());
  const [filter, setFilter] = useState("all");
  const [flash, setFlash] = useState(null);
  const [openId, setOpenId] = useState(null);

  usePageSEO({
    noindex: true,
    title: "Deep Design Hubs: Admin requests",
    description: "Review and update project requests received by Deep Design Hubs.",
    keywords: "deep design hubs admin requests"
  });

  const shown = useMemo(
    () => (filter === "all" ? rows : rows.filter((r) => r.status === filter)),
    [rows, filter]
  );

  function setStatus(id, status, ref) {
    const updated = updateRequestStatus(id, status);
    if (updated) {
      setRows(listRequests());
      setFlash({ ok: true, text: `${ref} → ${status}. The client sees this in their dashboard.` });
    }
  }

  function remove(r) {
    deleteRequest(r.id);
    setRows(listRequests());
    setFlash({ ok: true, text: `Request ${r.ref} deleted.` });
  }

  return (
    <>
      <div className="nh-dash__head">
        <div>
          <h1>
            Requests
            <br />
            <em>{rows.filter((r) => r.status === "new").length} waiting on you</em>
          </h1>
          <p className="nh-dash__sub">
            Every brief from the contact form and header panel. Move a row to{" "}
            <b>reviewing</b> or attach a <b>quote</b> — the client sees the change in
            their dashboard.
          </p>
        </div>
        <div className="nh-dash__headacts">
          <label className="nh-prof__lab" htmlFor="rq-filter" style={{ marginBottom: 0, alignSelf: "center" }}>
            Filter
          </label>
          <select id="rq-filter" className="nh-selbtn" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All statuses</option>
            {REQUEST_STATUSES.map((s) => (
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
          <p className="nh-acct__empty">No requests{filter !== "all" ? ` with status “${filter}”` : " yet"}.</p>
        ) : (
          <div className="nh-dt__wrap">
            <table className="nh-dt">
              <thead>
                <tr>
                  <th>Ref</th>
                  <th>Client</th>
                  <th>Service</th>
                  <th>Budget</th>
                  <th>Brief</th>
                  <th>Status</th>
                  <th className="nh-dt__nowrap">Date</th>
                  <th className="nh-dt__actcell"><span className="nh-sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {shown.map((r) => (
                  <React.Fragment key={r.id}>
                  <tr>
                    <td className="nh-dt__ref">{r.ref}</td>
                    <td>
                      <div className="nh-dt__strong">{r.name}</div>
                      <a className="nh-dt__muted" style={{ textDecoration: "underline" }} href={`mailto:${r.email}`}>{r.email}</a>
                    </td>
                    <td className="nh-dt__nowrap">
                      <span className="nh-dt__cell">
                        <span className="nh-dt__ic" aria-hidden="true">
                          <span className="material-symbols-rounded">{SERVICE_ICONS[r.service] || "widgets"}</span>
                        </span>
                        <span>
                          {SERVICE_LABELS[r.service] || r.service}
                          <span className="nh-dt__sub">via {r.source}</span>
                        </span>
                      </span>
                    </td>
                    <td className="nh-dt__nowrap">{r.budget || "—"}</td>
                    <td>
                      <span className="nh-dt__clip" title={r.message}>{r.message || "—"}</span>
                    </td>
                    <td>
                      <span className={`nh-acct__pill nh-acct__pill--${r.status}`}>{r.status}</span>
                    </td>
                    <td className="nh-dt__muted nh-dt__nowrap">
                      {new Date(r.created_at).toLocaleDateString()}
                    </td>
                    <td className="nh-dt__actcell">
                      <RowMenu
                        label={`Actions for ${r.ref}`}
                        items={[
                          { label: openId === r.id ? "Hide request" : "View request", icon: openId === r.id ? "expand_less" : "visibility", onClick: () => setOpenId(openId === r.id ? null : r.id) },
                          ...REQUEST_STATUSES
                            .filter((s) => s !== r.status)
                            .map((s) => ({
                              label: `Mark ${s}`,
                              icon: s === "new" ? "fiber_new" : s === "reviewing" ? "search" : s === "quoted" ? "request_quote" : s === "won" ? "trophy" : "cancel",
                              onClick: () => setStatus(r.id, s, r.ref)
                            })),
                          { label: "Email client", icon: "mail", onClick: () => { window.location.href = `mailto:${r.email}`; } },
                          {
                            label: "Delete", icon: "delete", danger: true,
                            confirmLabel: `Delete request ${r.ref} from ${r.name}?`,
                            onClick: () => remove(r)
                          }
                        ]}
                      />
                    </td>
                  </tr>
                  {openId === r.id && (
                    <tr className="nh-dt__expand">
                      <td colSpan={8}>
                        <div className="nh-dt__expand-in">
                          <div className="nh-dt__expand-grid">
                            <div><span>Ref</span><b>{r.ref}</b></div>
                            <div><span>Client</span><b>{r.name}</b></div>
                            <div><span>Email</span><a href={`mailto:${r.email}`} style={{ textDecoration: "underline" }}>{r.email}</a></div>
                            <div><span>Service</span>{SERVICE_LABELS[r.service] || r.service}</div>
                            <div><span>Budget</span>{r.budget || "—"}</div>
                            <div><span>Source</span>via {r.source}</div>
                            <div><span>Status</span><span className={`nh-acct__pill nh-acct__pill--${r.status}`}>{r.status}</span></div>
                            <div><span>Received</span>{new Date(r.created_at).toLocaleString()}</div>
                          </div>
                          <div className="nh-dt__expand-quote">{r.message || "No brief text."}</div>
                        </div>
                      </td>
                    </tr>
                  )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
