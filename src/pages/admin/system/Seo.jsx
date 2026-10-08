/*
 * /admin/system/seo — default meta values + sitemap pinging.
 */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { runJob, listJobs, logEvent } from "../../../data/system";
import { usePageSEO } from "../../../seo";
import SectionForm from "./SectionForm";
import "../../../auth.css";

export default function SystemSeo() {
  const [msg, setMsg] = useState(null);

  usePageSEO({
    noindex: true,
    title: "Deep Design Dev: SEO settings",
    description: "Default meta titles, descriptions and sitemap pinging.",
    keywords: "deep design hubs admin seo settings"
  });

  function pingNow() {
    const job = listJobs().find((j) => j.handler === "pingSitemap");
    if (!job) {
      setMsg({ ok: false, text: "The sitemap ping job doesn't exist yet." });
      return;
    }
    const res = runJob(job.id);
    setMsg(res && res.ok ? { ok: true, text: `Sitemap pinged — ${res.result} (${res.ms}ms).` } : { ok: false, text: res ? res.result : "Job failed." });
  }

  return (
    <SectionForm
      section="seo"
      title="SEO"
      em="Meta defaults & search engines"
      sub="Fallback title, description and share image, plus the sitemap ping job."
      preview={{ to: "/", label: "View site" }}
    >
      <div className="nh-acct__panel nh-edt__panel nh-in" style={{ marginTop: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div>
            <div className="nh-dt__strong">Sitemap</div>
            <div className="nh-dt__muted">
              <a href="/sitemap.xml" target="_blank" rel="noreferrer">/sitemap.xml</a> · ping search engines after publishing
            </div>
          </div>
          <div className="nh-rowacts">
            <button className="nh-rowbtn nh-rowbtn--accent" type="button" onClick={pingNow}>
              Ping engines now
            </button>
            <Link className="nh-rowbtn" to="/admin/projects">Review content</Link>
          </div>
        </div>
        {msg && (
          <div className={msg.ok ? "nh-prof__ok" : "nh-prof__err"} role="status" style={{ marginTop: 14 }}>
            <span className="material-symbols-rounded" aria-hidden="true">{msg.ok ? "task_alt" : "error"}</span>
            {msg.text}
          </div>
        )}
      </div>
    </SectionForm>
  );
}
