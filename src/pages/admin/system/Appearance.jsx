/*
 * /admin/system/appearance — theme accent, banner, maintenance switch.
 */
import React, { useState } from "react";
import { getSetting } from "../../../data/system";
import { usePageSEO } from "../../../seo";
import SectionForm from "./SectionForm";
import "../../../auth.css";

export default function SystemAppearance() {
  const [accent] = useState(() => getSetting("accent_color", "#00e676"));
  const [maintenance] = useState(() => getSetting("maintenance_mode", "off"));

  usePageSEO({
    noindex: true,
    title: "Deep Design Dev: Appearance settings",
    description: "Accent colour, announcements and maintenance mode for Deep Design Dev.",
    keywords: "deep design hubs admin appearance settings"
  });

  return (
    <SectionForm
      section="appearance"
      title="Appearance"
      em="Theme, announcements & maintenance"
      sub="Accent colour, the site-wide banner and the maintenance switch."
      preview={{ to: "/", label: "View site" }}
    >
      <div className="nh-acct__panel nh-in" style={{ marginTop: 16 }}>
        <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          <div
            style={{
              width: 64, height: 64, borderRadius: 18, background: accent,
              border: "1px solid rgba(10,10,10,.12)", boxShadow: "0 10px 26px rgba(10,10,10,.12)"
            }}
            aria-hidden="true"
          />
          <div>
            <div className="nh-dt__strong">Accent swatch preview</div>
            <div className="nh-dt__muted">
              Saved value: <b>{accent}</b> · Maintenance mode:{" "}
              <span className={"nh-acct__pill " + (maintenance === "on" ? "nh-acct__pill--failed" : "nh-acct__pill--paid")}>
                {maintenance}
              </span>
            </div>
          </div>
        </div>
      </div>
    </SectionForm>
  );
}
