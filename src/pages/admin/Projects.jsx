/*
 * /admin/projects — full CRUD for the gallery/case-study projects table.
 * Row actions live in the 3-dot kebab; the editor is a full page.
 */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { listProjects, deleteProject, isForSale } from "../../data/projects";
import RowMenu from "../../components/admin/RowMenu";
import { usePageSEO } from "../../seo";
import "../../auth.css";

export default function AdminProjects() {
  const [rows, setRows] = useState(() => listProjects());
  const [flash, setFlash] = useState(null);
  const navigate = useNavigate();

  usePageSEO({
    noindex: true,
    title: "Deep Design Hubs: Admin projects",
    description: "Create, edit and delete Deep Design Hubs projects and case studies.",
    keywords: "deep design hubs admin projects"
  });

  function remove(p) {
    deleteProject(p.id);
    setRows(listProjects());
    setFlash(`“${p.title}” deleted.`);
  }

  return (
    <>
      <div className="nh-dash__head">
        <div>
          <h1>
            Projects
            <br />
            <em>{rows.length} published · {rows.filter(isForSale).length} for sale</em>
          </h1>
          <p className="nh-dash__sub">
            Every gallery card and case-study page reads this table. Edits here go
            live immediately — images, story, price and sale state included.
          </p>
        </div>
        <div className="nh-dash__headacts">
          <button className="nh-rowbtn nh-rowbtn--accent" type="button" onClick={() => navigate("/admin/projects/new")}>
            + New project
          </button>
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
          <p className="nh-acct__empty">No projects yet — create the first one.</p>
        ) : (
          <div className="nh-dt__wrap">
            <table className="nh-dt">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th className="nh-dt__nowrap">Price</th>
                  <th className="nh-dt__nowrap">Rating</th>
                  <th className="nh-dt__actcell"><span className="nh-sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="nh-dt__cell">
                        <img className="nh-crd__thumb" src={p.cover} alt="" loading="lazy" />
                        <div>
                          <div className="nh-dt__strong">{p.title}</div>
                          <div className="nh-dt__muted">/project/{p.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="nh-dt__muted nh-dt__nowrap">{p.category}</td>
                    <td>
                      <span className={"nh-acct__pill" + (p.status === "for-sale" ? " nh-acct__pill--paid" : p.status === "preview" ? " nh-acct__pill--new" : "")}>
                        {p.status}
                      </span>
                    </td>
                    <td className="nh-dt__strong nh-dt__nowrap">{isForSale(p) ? `$${p.price}` : "—"}</td>
                    <td className="nh-dt__muted nh-dt__nowrap">
                      {p.rating ? `${p.rating.avg} (${p.rating.count})` : "—"}
                    </td>
                    <td className="nh-dt__actcell">
                      <RowMenu
                        label={`Actions for ${p.title}`}
                        items={[
                          { label: "Edit", icon: "edit", to: `/admin/projects/${p.id}` },
                          { label: "View case study", icon: "open_in_new", to: `/project/${p.slug}` },
                          { label: "Buy page", icon: "shopping_cart", to: `/buy/${p.slug}` },
                          { label: "Delete", icon: "delete", danger: true, confirmLabel: `Delete “${p.title}”? This removes it from the gallery and its case-study URL.`, onClick: () => remove(p) }
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
