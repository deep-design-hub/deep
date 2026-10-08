/*
 * /admin/system/translations — language defaults + locale pack export.
 */
import React, { useState } from "react";
import { settingsFor, getSetting, logEvent } from "../../../data/system";
import { usePageSEO } from "../../../seo";
import SectionForm from "./SectionForm";
import "../../../auth.css";

function download(name, text, type = "application/json") {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function SystemTranslations() {
  const [msg, setMsg] = useState(null);

  usePageSEO({
    noindex: true,
    title: "Deep Design Hubs: Translation settings",
    description: "Default language, enabled locales and language pack export.",
    keywords: "deep design hubs admin translations"
  });

  const locales = String(getSetting("enabled_locales", "English"))
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  function exportPack() {
    const rows = settingsFor("i18n");
    const pack = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    download(`deep-design-locales.json`, JSON.stringify({ locale: getSetting("default_language", "English"), strings: pack }, null, 2));
    logEvent("info", "Language pack exported", "admin");
    setMsg({ ok: true, text: "Language pack downloaded as JSON." });
  }

  return (
    <SectionForm
      section="i18n"
      title="Translations"
      em="Languages & locales"
      sub="The default language, which locales the site offers, and how dates render."
      preview={{ to: "/", label: "View site" }}
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
            <div className="nh-dt__strong">Enabled locales</div>
            <div className="nh-dt__muted" style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
              {locales.map((l) => (
                <span key={l} className="nh-acct__pill nh-acct__pill--paid">{l}</span>
              ))}
            </div>
          </div>
          <div className="nh-rowacts">
            <button className="nh-rowbtn nh-rowbtn--accent" type="button" onClick={exportPack}>
              Export language pack
            </button>
          </div>
        </div>
        <p className="nh-edt__hint" style={{ marginTop: 14 }}>
          Edit the comma-separated list above to add or remove locales — the chips
          here and the language switcher read the same value. Full per-string
          translation arrives with the CMS layer; this exports the pack shape it
          will consume.
        </p>
      </div>
    </SectionForm>
  );
}
