/*
 * /admin/reviews — all project ratings submitted on case studies.
 */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { listAll, deleteReview } from "../../data/reviews";
import { Stars } from "../../components/Stars";
import RowMenu from "../../components/admin/RowMenu";
import { usePageSEO } from "../../seo";
import "../../auth.css";

export default function AdminReviews() {
  const [rows, setRows] = useState(() => listAll());
  const [flash, setFlash] = useState(null);
  const [openId, setOpenId] = useState(null);

  function remove(r) {
    deleteReview(r.id);
    setRows(listAll());
    setFlash(`Review by ${r.name} on “${r.project_slug}” deleted.`);
  }

  usePageSEO({
    noindex: true,
    title: "Deep Design Hubs: Admin reviews",
    description: "All client reviews and star ratings submitted on Deep Design Hubs projects.",
    keywords: "deep design hubs admin reviews"
  });

  const avg = rows.length
    ? (rows.reduce((s, r) => s + Number(r.stars || 0), 0) / rows.length).toFixed(1)
    : "0.0";

  return (
    <>
      <div className="nh-dash__head">
        <div>
          <h1>
            Reviews
            <br />
            <em>{rows.length} rating{rows.length === 1 ? "" : "s"} · {avg} avg</em>
          </h1>
          <p className="nh-dash__sub">
            Reviews are left by signed-in clients on project case studies. They feed
            the star rating shown in the gallery.
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
          <p className="nh-acct__empty">
            No reviews yet. <Link to="/gallery">Open a project</Link> to see where
            clients rate the work.
          </p>
        ) : (
          <div className="nh-dt__wrap">
            <table className="nh-dt">
              <thead>
                <tr>
                  <th>Rating</th>
                  <th>Reviewer</th>
                  <th>Project</th>
                  <th>Review</th>
                  <th className="nh-dt__nowrap">Date</th>
                  <th className="nh-dt__actcell"><span className="nh-sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <React.Fragment key={r.id}>
                  <tr>
                    <td className="nh-dt__nowrap">
                      <Stars value={Number(r.stars) || 0} size={15} />
                    </td>
                    <td>
                      <div className="nh-dt__strong">{r.name}</div>
                      <div className="nh-dt__muted">{r.role || "Client"}</div>
                    </td>
                    <td>
                      <Link className="nh-dt__strong" style={{ color: "var(--nh-ink)" }} to={`/project/${r.project_slug}`}>
                        {r.project_slug}
                      </Link>
                    </td>
                    <td>
                      <span className="nh-dt__clip" title={r.body}>{r.body}</span>
                    </td>
                    <td className="nh-dt__muted nh-dt__nowrap">
                      {new Date(r.created_at).toLocaleDateString()}
                    </td>
                    <td className="nh-dt__actcell">
                      <RowMenu
                        label={`Actions for review by ${r.name}`}
                        items={[
                          { label: openId === r.id ? "Hide review" : "View review", icon: openId === r.id ? "expand_less" : "visibility", onClick: () => setOpenId(openId === r.id ? null : r.id) },
                          { label: "View project", icon: "open_in_new", to: `/project/${r.project_slug}` },
                          { label: "Email reviewer", icon: "mail", onClick: () => { window.location.href = `mailto:${r.email || ""}`; } },
                          {
                            label: "Delete", icon: "delete", danger: true,
                            confirmLabel: `Delete the review by ${r.name} on “${r.project_slug}”?`,
                            onClick: () => remove(r)
                          }
                        ]}
                      />
                    </td>
                  </tr>
                  {openId === r.id && (
                    <tr className="nh-dt__expand">
                      <td colSpan={6}>
                        <div className="nh-dt__expand-in">
                          <div className="nh-dt__expand-grid">
                            <div><span>Reviewer</span><b>{r.name}</b> — {r.role || "Client"}</div>
                            <div><span>Email</span>{r.email ? <a href={`mailto:${r.email}`} style={{ textDecoration: "underline" }}>{r.email}</a> : "not signed in"}</div>
                            <div><span>Project</span><Link to={`/project/${r.project_slug}`} style={{ textDecoration: "underline" }}>{r.project_slug}</Link></div>
                            <div><span>Rating</span><Stars value={Number(r.stars) || 0} size={14} /> · {r.stars}/5</div>
                            <div><span>Posted</span>{new Date(r.created_at).toLocaleString()}</div>
                          </div>
                          <div className="nh-dt__expand-quote">{r.body}</div>
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
