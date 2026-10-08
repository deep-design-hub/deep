/*
 * /admin/system/email — sender/SMTP config, outbox stats, test send.
 */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { outboxAll, sendEmail } from "../../../data/emails";
import { getSetting, logEvent } from "../../../data/system";
import { usePageSEO } from "../../../seo";
import SectionForm from "./SectionForm";
import "../../../auth.css";

export default function SystemEmailCfg() {
  const [msg, setMsg] = useState(null);
  const outbox = outboxAll();
  const queued = outbox.filter((m) => m.status === "queued").length;

  usePageSEO({
    noindex: true,
    title: "Deep Design Hubs: Email settings",
    description: "Sender identity, SMTP configuration and outbox stats.",
    keywords: "deep design hubs admin email settings"
  });

  function sendTest() {
    const to = getSetting("mail_from_email") || "admin@deepdesign.com";
    const res = sendEmail({
      to,
      name: "Admin",
      template: "welcome",
      data: { user: { name: "Admin", email: to } }
    });
    if (res.ok) {
      logEvent("info", `Test email queued → ${to}`, "admin");
      setMsg({ ok: true, text: `Test welcome email queued for ${to} — open the outbox to preview it.` });
    } else {
      setMsg({ ok: false, text: res.error || "Could not queue the test email." });
    }
  }

  return (
    <SectionForm
      section="email"
      title="Email"
      em="Sender identity & SMTP"
      sub="Who the emails come from, the subject prefix and the SMTP details the backend will use."
      preview={{ to: "/admin/emails", label: "Open outbox" }}
      beforeForm={
        msg && (
          <div className={msg.ok ? "nh-prof__ok" : "nh-prof__err"} role="status" style={{ marginBottom: 16 }}>
            <span className="material-symbols-rounded" aria-hidden="true">{msg.ok ? "task_alt" : "error"}</span>
            {msg.text}
          </div>
        )
      }
    >
      <div className="nh-acct__panel nh-edt__panel nh-in" style={{ marginTop: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div>
            <div className="nh-dt__strong">Outbox</div>
            <div className="nh-dt__muted">
              {outbox.length} message{outbox.length === 1 ? "" : "s"} stored ·{" "}
              <span className={"nh-acct__pill " + (queued ? "nh-acct__pill--reviewing" : "nh-acct__pill--paid")}>
                {queued} queued
              </span>
            </div>
          </div>
          <div className="nh-rowacts">
            <button className="nh-rowbtn nh-rowbtn--accent" type="button" onClick={sendTest}>
              Send test email
            </button>
            <Link className="nh-rowbtn" to="/admin/emails">Open outbox</Link>
          </div>
        </div>
        <p className="nh-edt__hint" style={{ marginTop: 14 }}>
          The test email is rendered with the real template (logo, typography,
          footer) and queued into the outbox so you can preview exactly what a
          client would receive.
        </p>
      </div>
    </SectionForm>
  );
}
