/*
 * /admin/system/info — where the platform currently runs and how big it is.
 */
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { storageTables, listJobs, listLogs, listSettings } from "../../../data/system";
import { usePageSEO } from "../../../seo";
import pkg from "../../../../package.json";

function fmtBytes(n) {
  if (!n) return "0 B";
  const u = ["B", "KB", "MB"];
  let i = 0;
  while (n >= 1024 && i < u.length - 1) { n /= 1024; i += 1; }
  return `${n.toFixed(n < 10 && i > 0 ? 1 : 0)} ${u[i]}`;
}

export default function SystemInfo() {
  const [quota, setQuota] = useState(null);
  const [ua, setUa] = useState("");

  useEffect(() => {
    setUa(navigator.userAgent || "");
    if (navigator.storage && navigator.storage.estimate) {
      navigator.storage.estimate().then((r) => setQuota(r)).catch(() => setQuota(null));
    }
  }, []);

  usePageSEO({
    noindex: true,
    title: "Deep Design Hubs: System info",
    description: "Platform version, runtime and storage footprint for Deep Design Hubs.",
    keywords: "deep design hubs admin system info"
  });

  const info = useMemo(() => {
    const tables = storageTables();
    let totalBytes = 0;
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const k = window.localStorage.key(i);
      if (!k) continue;
      const v = window.localStorage.getItem(k);
      totalBytes += (k.length + String(v || "").length) * 2;
    }
    return {
      version: pkg.version,
      tables: tables.length,
      rows: tables.reduce((s, t) => s + t.rows, 0),
      bytes: totalBytes,
      jobs: listJobs().length,
      jobsActive: listJobs().filter((j) => j.enabled).length,
      logs: listLogs(500).length,
      settings: listSettings().length
    };
  }, []);

  const ROW = { display: "flex", justifyContent: "space-between", gap: 12, padding: "9px 0", borderBottom: "1px solid var(--gray-100)" };
  const KEY = { fontSize: ".78rem", color: "var(--gray-500)" };

  return (
    <>
      <div className="nh-dash__head">
        <div>
          <h1>
            System info
            <br />
            <em>v{info.version} · {info.tables} tables · {fmtBytes(info.bytes)} in storage</em>
          </h1>
          <p className="nh-dash__sub">
            What's running, where it runs, and how much room the data takes. Icons
            and names survive the move to MySQL — only the storage layer changes.{" "}
            <Link to="/admin/system">← Back to system cards</Link>
          </p>
        </div>
        <div className="nh-dash__headacts">
          <Link className="nh-rowbtn" to="/admin/system/storage">
            <span className="material-symbols-rounded" aria-hidden="true">storage</span>
            Open storage
          </Link>
          <Link className="nh-rowbtn" to="/admin/system/logs">
            <span className="material-symbols-rounded" aria-hidden="true">monitoring</span>
            Open logs
          </Link>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
        <div className="nh-edt__card nh-in">
          <b>
            <span className="material-symbols-rounded" aria-hidden="true">memory</span>
            Platform
          </b>
          <div>
            <div style={ROW}><span style={KEY}>Version</span><b>v{info.version}</b></div>
            <div style={ROW}><span style={KEY}>Stack</span><b>React {pkg.dependencies && pkg.dependencies.react} · Vite</b></div>
            <div style={ROW}><span style={KEY}>Data backend</span><b>localStorage (dd_* tables)</b></div>
            <div style={ROW}><span style={KEY}>Env</span><b>{import.meta.env && import.meta.env.DEV ? "development" : "production"}</b></div>
          </div>
        </div>

        <div className="nh-edt__card nh-in" style={{ transitionDelay: ".05s" }}>
          <b>
            <span className="material-symbols-rounded" aria-hidden="true">database</span>
            Data footprint
          </b>
          <div>
            <div style={ROW}><span style={KEY}>Tables</span><b>{info.tables}</b></div>
            <div style={ROW}><span style={KEY}>Rows</span><b>{info.rows}</b></div>
            <div style={ROW}><span style={KEY}>Stored (approx)</span><b>{fmtBytes(info.bytes)}</b></div>
            <div style={ROW}>
              <span style={KEY}>Quota used</span>
              <b>{quota && quota.usage != null ? `${fmtBytes(quota.usage)}` : "—"}</b>
            </div>
            <div style={ROW}>
              <span style={KEY}>Quota total</span>
              <b>{quota && quota.quota != null ? fmtBytes(quota.quota) : "—"}</b>
            </div>
          </div>
        </div>

        <div className="nh-edt__card nh-in" style={{ transitionDelay: ".1s" }}>
          <b>
            <span className="material-symbols-rounded" aria-hidden="true">settings_suggest</span>
            Activity
          </b>
          <div>
            <div style={ROW}><span style={KEY}>Settings stored</span><b>{info.settings}</b></div>
            <div style={ROW}><span style={KEY}>Cronjobs</span><b>{info.jobsActive} / {info.jobs} active</b></div>
            <div style={ROW}><span style={KEY}>Log lines kept</span><b>{info.logs}</b></div>
            <div style={ROW}><span style={KEY}>Search engines ping</span><b>maintenance job</b></div>
          </div>
        </div>

        <div className="nh-edt__card nh-in" style={{ transitionDelay: ".15s" }}>
          <b>
            <span className="material-symbols-rounded" aria-hidden="true">monitor</span>
            Browser
          </b>
          <div>
            <div style={ROW}><span style={KEY}>User agent</span><b style={{ fontSize: ".78rem", wordBreak: "break-word", textAlign: "right", maxWidth: "60%" }}>{ua.split(" Safari")[0] || ua}</b></div>
            <div style={ROW}><span style={KEY}>Local storage</span><b>{typeof window.localStorage !== "undefined" ? "available" : "blocked"}</b></div>
            <div style={ROW}><span style={KEY}>Viewport</span><b>{window.innerWidth} × {window.innerHeight}</b></div>
          </div>
        </div>
      </div>

      <div className="nh-adm__note" style={{ marginTop: 16 }}>
        <span className="material-symbols-rounded" aria-hidden="true">info</span>
        <span>
          <b>Demo storage today.</b> Every table in <b>{info.tables} dd_* tables</b> is
          seeded idempotently and kept in the browser. Swap{" "}
          <b>src/data/db.js</b> for the PHP API and all of these numbers come from
          MySQL — nothing else on the site changes.
        </span>
      </div>
    </>
  );
}