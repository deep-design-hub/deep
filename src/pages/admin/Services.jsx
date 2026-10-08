/*
 * /admin/services — full CRUD for the services table.
 * Row actions live in the 3-dot kebab; the editor is a full page.
 */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { listServices, deleteService } from "../../data/services";
import RowMenu from "../../components/admin/RowMenu";
import { usePageSEO } from "../../seo";
import "../../auth.css";

export default function AdminServices() {
  const [rows, setRows] = useState(() => listServices());
  const [flash, setFlash] = useState(null);
  const navigate = useNavigate();

  usePageSEO({
    noindex: true,
    title: "Deep Design Dev: Admin services",
    description: "Create, edit and delete Deep Design Dev services.",
    keywords: "deep design hubs admin services"
  });

  function remove(s) {
    deleteService(s.id);
    setRows(listServices());
    setFlash(`“${s.name}” deleted.`);
  }

  return (
    <>
      <div className="nh-dash__head">
        <div>
          <h1>
            Services
            <br />
            <em>{rows.length} offered</em>
          </h1>
          <p className="nh-dash__sub">
            The service cards, their prices and what's included. Edits here go
            live on the services page immediately.
          </p>
        </div>
        <div className="nh-dash__headacts">
          <button className="nh-rowbtn nh-rowbtn--accent" type="button" onClick={() => navigate("/admin/services/new")}>
            + New service
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
          <p className="nh-acct__empty">No services yet — create the first one.</p>
        ) : (
          <div className="nh-dt__wrap">
            <table className="nh-dt">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Slug</th>
                  <th className="nh-dt__nowrap">Timeline</th>
                  <th className="nh-dt__nowrap">Price</th>
                  <th className="nh-dt__nowrap">Includes</th>
                  <th className="nh-dt__actcell"><span className="nh-sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div className="nh-dt__cell">
                        <span className="material-symbols-rounded" aria-hidden="true" style={{ fontSize: 20 }}>{s.icon}</span>
                        <div className="nh-dt__strong">{s.name}</div>
                      </div>
                    </td>
                    <td className="nh-dt__muted">{s.slug}</td>
                    <td className="nh-dt__nowrap">{s.time}</td>
                    <td className="nh-dt__strong nh-dt__nowrap">{s.price}</td>
                    <td className="nh-dt__muted">{(s.includes || []).length} items</td>
                    <td className="nh-dt__actcell">
                      <RowMenu
                        label={`Actions for ${s.name}`}
                        items={[
                          { label: "Edit", icon: "edit", to: `/admin/services/${s.id}` },
                          { label: "Delete", icon: "delete", danger: true, confirmLabel: `Delete “${s.name}”? It disappears from the services page immediately.`, onClick: () => remove(s) }
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
