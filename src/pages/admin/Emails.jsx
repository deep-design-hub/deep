/*
 * /admin/emails — queued transactional emails (outbox) with HTML preview.
 * Row actions live in the 3-dot kebab; preview expands inline in the table.
 */
import React, { useState } from "react";
import { outboxAll, deleteEmail, resendEmail } from "../../data/emails";
import RowMenu from "../../components/admin/RowMenu";
import { usePageSEO } from "../../seo";
import "../../auth.css";

export default function AdminEmails() {
  const [rows, setRows] = useState(() => outboxAll());
  const [openId, setOpenId] = useState(null);
  const [flash, setFlash] = useState(null);

  usePageSEO({
    noindex: true,
    title: "Deep Design Hubs: Admin email outbox",
    description: "Every transactional email queued by Deep Design Hubs — welcome, receipts, quotes.",
    keywords: "deep design hubs admin emails"
  });

  function refresh() {
    setRows(outboxAll());
  }

  function remove(m) {
    deleteEmail(m.id);
    if (openId === m.id) setOpenId(null);
    refresh();
    setFlash(`“${m.subject}” deleted from the outbox.`);
  }

  function resend(m) {
    resendEmail(m.id);
    refresh();
    setFlash(`“${m.subject}” re-queued for sending.`);
  }

  return (
    <>
      <div className="nh-dash__head">
        <div>
          <h1>
            Email outbox
            <br />
            <em>{rows.length} message{rows.length === 1 ? "" : "s"} queued</em>
          </h1>
          <p className="nh-dash__sub">
            Until the SMTP backend exists, sent emails are stored here for review —
            same records a <b>mail_log</b> table will hold later.
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
            Outbox is empty — welcome notes, quotes and receipts appear here the
            moment they're triggered.
          </p>
        ) : (
          <div className="nh-dt__wrap">
            <table className="nh-dt">
              <thead>
                <tr>
                  <th>To</th>
                  <th>Subject</th>
                  <th>Template</th>
                  <th>Status</th>
                  <th className="nh-dt__nowrap">Queued</th>
                  <th className="nh-dt__actcell"><span className="nh-sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((m) => (
                  <React.Fragment key={m.id}>
                    <tr>
                      <td>
                        <div className="nh-dt__strong">{m.name || "—"}</div>
                        <span className="nh-dt__muted">{m.to}</span>
                      </td>
                      <td className="nh-dt__clip" title={m.subject}>{m.subject}</td>
                      <td className="nh-dt__ref">{m.template}</td>
                      <td>
                        <span className="nh-acct__pill nh-acct__pill--reviewing">{m.status}</span>
                      </td>
                      <td className="nh-dt__muted nh-dt__nowrap">
                        {new Date(m.created_at).toLocaleString()}
                      </td>
                      <td className="nh-dt__actcell">
                        <RowMenu
                          label={`Actions for “${m.subject}”`}
                          items={[
                            {
                              label: openId === m.id ? "Hide preview" : "Preview",
                              icon: openId === m.id ? "visibility_off" : "visibility",
                              onClick: () => setOpenId(openId === m.id ? null : m.id)
                            },
                            { label: "Email recipient", icon: "mail", onClick: () => { window.location.href = `mailto:${m.to}`; } },
                            { label: "Re-queue", icon: "refresh", onClick: () => resend(m) },
                            {
                              label: "Delete", icon: "delete", danger: true,
                              confirmLabel: `Delete “${m.subject}” from the outbox?`,
                              onClick: () => remove(m)
                            }
                          ]}
                        />
                      </td>
                    </tr>
                    {openId === m.id && (
                      <tr>
                        <td colSpan={6} style={{ background: "#fbfaf7", padding: 0 }}>
                          <iframe
                            title={`Preview ${m.subject}`}
                            srcDoc={m.html}
                            style={{
                              width: "100%",
                              minHeight: 340,
                              border: 0,
                              display: "block",
                              background: "#fff"
                            }}
                          />
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
