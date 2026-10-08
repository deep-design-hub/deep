/*
 * /admin/system/security — sessions, passwords and sign-in protections.
 */
import React from "react";
import { usePageSEO } from "../../../seo";
import SectionForm from "./SectionForm";
import "../../../auth.css";

export default function SystemSecurity() {
  usePageSEO({
    noindex: true,
    title: "Deep Design Dev: Security settings",
    description: "Session timeout, password rules and sign-in protections.",
    keywords: "deep design hubs admin security settings"
  });

  return (
    <SectionForm
      section="security"
      title="Security"
      em="Sessions, passwords & sign-in protection"
      sub="How long sessions last and the rules new passwords must follow."
    >
      <div className="nh-adm__note" style={{ marginTop: 16 }}>
        <span className="material-symbols-rounded" aria-hidden="true">verified_user</span>
        <span>
          <b>Demo enforcement only.</b> Lockouts and timeouts are enforced by the
          data layer today and move to server middleware when the API lands —
          the switches and rules stay exactly as configured here.
        </span>
      </div>
    </SectionForm>
  );
}
