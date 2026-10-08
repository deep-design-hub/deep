/*
 * /admin/system/storage — every table in the local database: row counts,
 * sizes, per-table export/clear, full backup export and restore.
 */
import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { storageTables, exportBackup, importBackup, clearTable, logEvent } from "../../../data/system";
import RowMenu from "../../../components/admin/RowMenu";
import { usePageSEO } from "../../../seo";
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

function fmtBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export default function SystemStorage() {
  const [tables, setTables] = useState(() => storageTables());
  const [msg, setMsg] = useState(null);
  const fileRef = useRef(null);

  usePageSEO({
    noindex: true,
    title: "Deep Design Hubs: Storage & backup",
    description: "Table row counts, exports and backup restore for Deep Design Hubs.",
    keywords: "deep design hubs admin storage backup"
  });

  const totalRows = tables.reduce((s, t) => s + t.rows, 0);
  const totalBytes = tables.reduce((s, t) => s + t.bytes, 0);

  function refresh() {
    setTables(storageTables());
  }

  function backupAll() {
    download(`deep-design-backup-${new Date().toISOString().slice(0, 10)}.json`, exportBackup());
    logEvent("info", "Full backup exported", "storage");
    setMsg({ ok: true, text: "Backup downloaded — keep the JSON file somewhere safe." });
  }

  function onFile(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const res = importBackup(String(reader.result || ""));
      if (res.ok) {
        refresh();
        setMsg({ ok: true, text: `Backup restored — ${res.tables} table(s) replaced. Reload to see changes everywhere.` });
      } else {
        setMsg({ ok: false, text: res.error || "Import failed." });
      }
      if (fileRef.current) fileRef.current.value = "";
    };
    reader.readAsText(file);
  }

  function exportOne(t) {
    const raw = window.localStorage.getItem(t.key) || "[]";
    download(`${t.name}.json`, raw);
    setMsg({ ok: true, text: `Table “${t.name}” exported.` });
  }

  function clearOne(t) {
    clearTable(t.key);
    refresh();
    setMsg({ ok: true, text: `Table “${t.name}” cleared.` });
  }

  return (
    <>
      <div className="nh-dash__head">
        <div>
          <h1>
            Storage & backup
            <br />
            <em>{tables.length} tables · {totalRows} rows · {fmtBytes(totalBytes)}</em>
          </h1>
          <p className="nh-dash__sub">
            Every table the platform stores today, how big it is, and full
            export/restore. When MySQL lands this becomes the table browser for
            the API — same names, same counts.{" "}
            <Link to="/admin/system">← Back to system cards</Link>
          </p>
        </div>
        <div className="nh-dash__headacts">
          <button className="nh-rowbtn nh-rowbtn--accent" type="button" onClick={backupAll}>
            Export full backup
          </button>
          <button className="nh-rowbtn" type="button" onClick={() => fileRef.current && fileRef.current.click()}>
            Restore backup
          </button>
          <button className="nh-rowbtn" type="button" onClick={refresh}>Refresh</button>
          <input ref={fileRef} type="file" accept="application/json,.json" onChange={onFile} style={{ display: "none" }} aria-label="Backup file" />
        </div>
      </div>

      {msg && (
        <div className={msg.ok ? "nh-prof__ok" : "nh-prof__err"} role="status" style={{ marginBottom: 16 }}>
          <span className="material-symbols-rounded" aria-hidden="true">{msg.ok ? "task_alt" : "error"}</span>
          {msg.text}
        </div>
      )}

      <div className="nh-acct__panel nh-in">
        {tables.length === 0 ? (
          <p className="nh-acct__empty">
            No tables found — data appears as soon as you use the site.{" "}
            <Link to="/gallery">Browse the gallery</Link>.
          </p>
        ) : (
          <div className="nh-dt__wrap">
            <table className="nh-dt">
              <thead>
                <tr>
                  <th>Table</th>
                  <th className="nh-dt__nowrap">Rows</th>
                  <th className="nh-dt__nowrap">Size</th>
                  <th>Key</th>
                  <th className="nh-dt__actcell"><span className="nh-sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {tables.map((t) => (
                  <tr key={t.key}>
                    <td>
                      <div className="nh-dt__cell">
                        <span className="material-symbols-rounded" aria-hidden="true" style={{ fontSize: 20 }}>table_chart</span>
                        <div className="nh-dt__strong">{t.name}</div>
                      </div>
                    </td>
                    <td className="nh-dt__strong nh-dt__nowrap">{t.rows}</td>
                    <td className="nh-dt__muted nh-dt__nowrap">{fmtBytes(t.bytes)}</td>
                    <td className="nh-dt__ref">{t.key}</td>
                    <td className="nh-dt__actcell">
                      <RowMenu
                        label={`Actions for table ${t.name}`}
                        items={[
                          { label: "Export table", icon: "download", onClick: () => exportOne(t) },
                          {
                            label: "Clear table", icon: "delete", danger: true,
                            confirmLabel: `Clear “${t.name}”? Its ${t.rows} row(s) will be lost.`,
                            onClick: () => clearOne(t)
                          }
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

      <div className="nh-adm__note" style={{ marginTop: 16 }}>
        <span className="material-symbols-rounded" aria-hidden="true">cloud_done</span>
        <span>
          <b>Backups are plain JSON</b> of the local database — restore one here
          after clearing a browser or moving to another machine. The nightly{" "}
          <Link to="/admin/system/cronjobs">Database backup</Link> job will write
          the same format to the server once the backend lands.
        </span>
      </div>
    </>
  );
}
