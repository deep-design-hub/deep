/*
 * /admin/system/general — site identity and contact details.
 */
import React from "react";
import { usePageSEO } from "../../../seo";
import SectionForm from "./SectionForm";
import "../../../auth.css";

export default function SystemGeneral() {
  usePageSEO({
    noindex: true,
    title: "Deep Design Dev: General settings",
    description: "Site name, tagline and contact details for Deep Design Dev.",
    keywords: "deep design hubs admin general settings"
  });

  return (
    <SectionForm
      section="general"
      title="General"
      em="Site identity & contact details"
      sub="The name, tagline and contact lines used across the site, emails and invoices."
      preview={{ to: "/", label: "View site" }}
    >
      <div className="nh-adm__note" style={{ marginTop: 16 }}>
        <span className="material-symbols-rounded" aria-hidden="true">info</span>
        <span>
          <b>These settings are live.</b> Saving here updates the values other
          data files read as fallbacks — the design copy in each page stays
          untouched until the CMS layer lands.
        </span>
      </div>
    </SectionForm>
  );
}
