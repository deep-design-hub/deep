/*
 * /admin/system/logs — the system log stream: filter, search, export, clear.
 */
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { listLogs, clearLogs, ensureSeedLog, logEvent } from "../../../data/system";
import { usePageSEO } from "../../../seo";
import "../../../auth.css";

const LEVELS = ["all", "info", "warn", "error"];

function download(name, text, type = "text/plain") {
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

export default function SystemLogs() {
  const [rows, setRows] = useState(() => {
    ensureSeedLog();
    return listLogs(500);
  });
  const [level, setLevel] = useState("all");
  const [q, setQ] = useState("");
  const [msg, setMsg] = useState(null);
  const [confirmClear, setConfirmClear] = useState(false);

  usePageSEO({
    noindex: true,
    title: "Deep Design Dev: System logs",
    description: "System log stream for Deep Design Dev — job runs, imports and errors.",
    keywords: "deep design hubs admin system logs"
  });

  const shown = useMemo(() => {
    let out = rows;
    if (level !== "all") out = out.filter((r) => r.level === level);
    if (q.trim()) {
      const needle = q.trim().toLowerCase();
      out = out.filter((r) => `${r.message} ${r.source}`.toLowerCase().includes(needle));
    }
    return out;
  }, [rows, level, q]);

  function refresh() {
    setRows(listLogs(500));
    setMsg({ ok: true, text: "Log refreshed." });
  }

  function exportLogs() {
    const text = rows
      .map((l) => `${l.created_at} [${l.level.toUpperCase()}] (${l.source}) ${l.message}`)
      .join("\n");
    download(`deep-design-system-${new Date().toISOString().slice(0, 10)}.log`, text || "(empty)");
    setMsg({ ok: true, text: `${rows.length} line(s) exported.` });
  }

  function doClear() {
    clearLogs();
    logEvent("info", "System logs cleared by admin", "admin");
    setRows(listLogs(500));
    setConfirmClear(false);
    setMsg({ ok: true, text: "Logs cleared." });
  }

  return (
    <>
      <div className="nh-dash__head">
        <div>
          <h1>
            System logs
            <br />
            <em>{rows.length} line{rows.length === 1 ? "" : "s"} · {rows.filter((r) => r.level === "error").length} errors</em>
          </h1>
          <p className="nh-dash__sub">
            Every job run and admin action writes a line here.{" "}
            <Link to="/admin/system/cronjobs">Cronjobs</Link> produce most of them.{" "}
            <Link to="/admin/system">← Back to system cards</Link>
          </p>
        </div>
        <div className="nh-dash__headacts">
          <input
            className="nh-prof__in"
            type="search"
            placeholder="Search logs…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search logs"
            style={{ maxWidth: 190 }}
          />
          <select className="nh-selbtn" value={level} onChange={(e) => setLevel(e.target.value)} aria-label="Filter by level">
            {LEVELS.map((l) => <option key={l} value={l}>{l === "all" ? "All levels" : l}</option>)}
          </select>
        </div>
      </div>

      {msg && (
        <div className="nh-prof__ok" role="status" style={{ marginBottom: 16 }}>
          <span className="material-symbols-rounded" aria-hidden="true">task_alt</span>
          {msg.text}
        </div>
      )}

      <div className="nh-acct__panel nh-in">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
          <p className="nh-dash__sub" style={{ margin: 0 }}>
            Showing {shown.length} of {rows.length} line(s).
          </p>
          <div className="nh-rowacts">
            <button className="nh-rowbtn" type="button" onClick={refresh}>Refresh</button>
            <button className="nh-rowbtn" type="button" onClick={exportLogs}>Export .log</button>
            {confirmClear ? (
              <>
                <button className="nh-rowbtn nh-rowbtn--danger" type="button" onClick={doClear}>
                  Yes, clear all
                </button>
                <button className="nh-rowbtn" type="button" onClick={() => setConfirmClear(false)}>
                  Cancel
                </button>
              </>
            ) : (
              <button className="nh-rowbtn nh-rowbtn--danger" type="button" onClick={() => setConfirmClear(true)}>
                Clear logs
              </button>
            )}
          </div>
        </div>

        {shown.length === 0 ? (
          <p className="nh-acct__empty">No log lines{level !== "all" || q ? " match your filter" : " — run a job to produce one"}.</p>
        ) : (
          <div className="nh-dt__wrap">
            <table className="nh-dt">
              <thead>
                <tr>
                  <th>Level</th>
                  <th>Source</th>
                  <th>Message</th>
                  <th className="nh-dt__nowrap">Time</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((l) => (
                  <tr key={l.id}>
                    <td className="nh-dt__nowrap">
                      <span
                        className={"nh-acct__pill " + (
                          l.level === "error" ? "nh-acct__pill--failed" :
                          l.level === "warn" ? "nh-acct__pill--reviewing" :
                          "nh-acct__pill--paid"
                        )}
                      >
                        {l.level}
                      </span>
                    </td>
                    <td className="nh-dt__ref">{l.source}</td>
                    <td className="nh-dt__strong">{l.message}</td>
                    <td className="nh-dt__muted nh-dt__nowrap">
                      {new Date(l.created_at).toLocaleString()}
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
