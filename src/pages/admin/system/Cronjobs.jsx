/*
 * /admin/system/cronjobs — full CRUD for scheduled background jobs.
 * Row actions live in the 3-dot kebab; new/edit happens in the inline
 * full-page editor panel (no modals).
 */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { listJobs, saveJob, deleteJob, toggleJob, runJob } from "../../../data/system";
import RowMenu from "../../../components/admin/RowMenu";
import { usePageSEO } from "../../../seo";
import "../../../auth.css";

const EMPTY = { name: "", schedule: "daily 00:00", icon: "schedule", handler: "stub", desc: "", enabled: true };

export default function SystemCronjobs() {
  const [rows, setRows] = useState(() => listJobs());
  const [editing, setEditing] = useState(null); // null | {} | job row
  const [form, setForm] = useState(EMPTY);
  const [msg, setMsg] = useState(null);
  const [lastRun, setLastRun] = useState(null);

  usePageSEO({
    noindex: true,
    title: "Deep Design Hubs: Cronjobs",
    description: "Scheduled background jobs for Deep Design Hubs — run, toggle, create.",
    keywords: "deep design hubs admin cronjobs"
  });

  function refresh() {
    setRows(listJobs());
  }

  function flash(ok, text) {
    setMsg({ ok, text });
  }

  function openNew() {
    setForm({ ...EMPTY });
    setEditing({});
    setMsg(null);
  }

  function openEdit(j) {
    setForm({
      name: j.name || "", schedule: j.schedule || "", icon: j.icon || "schedule",
      handler: j.handler || "stub", desc: j.desc || "", enabled: !!j.enabled
    });
    setEditing(j);
    setMsg(null);
  }

  function close() {
    setEditing(null);
    setMsg(null);
  }

  function set(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function submit(e) {
    e.preventDefault();
    if (!form.name.trim()) {
      flash(false, "Job name is required.");
      return;
    }
    const payload = {
      name: form.name.trim(),
      schedule: form.schedule.trim(),
      icon: form.icon.trim() || "schedule",
      handler: form.handler.trim() || "stub",
      desc: form.desc.trim(),
      enabled: form.enabled !== false
    };
    if (editing && editing.id) saveJob({ id: editing.id, ...payload });
    else saveJob(payload);
    refresh();
    flash(true, editing && editing.id ? "Job updated." : "Job created.");
    close();
  }

  function onToggle(j) {
    toggleJob(j.id);
    refresh();
    flash(true, `${j.name} ${j.enabled ? "disabled" : "enabled"}.`);
  }

  function onRun(j) {
    const res = runJob(j.id);
    refresh();
    if (!res) return flash(false, "Job not found.");
    setLastRun({ id: j.id, result: res.result, ms: res.ms });
    flash(res.ok, `${j.name} → ${res.result} (${res.ms}ms)`);
  }

  function onRemove(j) {
    deleteJob(j.id);
    refresh();
    flash(true, `“${j.name}” deleted.`);
  }

  return (
    <>
      <div className="nh-dash__head">
        <div>
          <h1>
            Cronjobs
            <br />
            <em>{rows.filter((j) => j.enabled).length} active of {rows.length} · {rows.filter((j) => j.last_run).length} run before</em>
          </h1>
          <p className="nh-dash__sub">
            The platform's scheduled background jobs. Run them by hand, flip them
            on/off or add your own — every run writes a line to{" "}
            <Link to="/admin/system/logs">system logs</Link>.{" "}
            <Link to="/admin/system">← Back to system cards</Link>
          </p>
        </div>
        <div className="nh-dash__headacts">
          <button className="nh-rowbtn nh-rowbtn--accent" type="button" onClick={openNew}>
            + New job
          </button>
        </div>
      </div>

      {msg && (
        <div className={msg.ok ? "nh-prof__ok" : "nh-prof__err"} role="status" style={{ marginBottom: 16 }}>
          <span className="material-symbols-rounded" aria-hidden="true">{msg.ok ? "task_alt" : "error"}</span>
          {msg.text}
        </div>
      )}

      {editing !== null && (
        <div className="nh-acct__panel nh-edt__panel nh-in" style={{ marginBottom: 16 }}>
          <div className="nh-dt__strong" style={{ fontSize: "1.02rem" }}>
            {editing.id ? "Edit job" : "New job"}
          </div>
          <form className="nh-edt__form" onSubmit={submit}>
            <div className="nh-edt__row">
              <div>
                <label className="nh-prof__lab" htmlFor="cj-name">Name *</label>
                <input id="cj-name" className="nh-prof__in" type="text" value={form.name} onChange={set("name")} required />
              </div>
              <div>
                <label className="nh-prof__lab" htmlFor="cj-schedule">Schedule</label>
                <input id="cj-schedule" className="nh-prof__in" type="text" value={form.schedule} onChange={set("schedule")} placeholder="daily 02:00" />
              </div>
            </div>
            <div className="nh-edt__row nh-edt__row--3">
              <div>
                <label className="nh-prof__lab" htmlFor="cj-icon">Icon</label>
                <input id="cj-icon" className="nh-prof__in" type="text" value={form.icon} onChange={set("icon")} placeholder="schedule" />
                <p className="nh-edt__hint">Material Symbols name.</p>
              </div>
              <div>
                <label className="nh-prof__lab" htmlFor="cj-handler">Handler</label>
                <input id="cj-handler" className="nh-prof__in" type="text" value={form.handler} onChange={set("handler")} placeholder="flushEmails" />
                <p className="nh-edt__hint">Known: flushEmails, pingSitemap, subscriberDigest, syncOrders, backupDb, pruneLogs.</p>
              </div>
              <div>
                <label className="nh-prof__lab" htmlFor="cj-enabled">State</label>
                <select id="cj-enabled" className="nh-prof__in" value={form.enabled ? "on" : "off"} onChange={(e) => setForm((f) => ({ ...f, enabled: e.target.value === "on" }))}>
                  <option value="on">Enabled</option>
                  <option value="off">Disabled</option>
                </select>
              </div>
            </div>
            <div>
              <label className="nh-prof__lab" htmlFor="cj-desc">Description</label>
              <input id="cj-desc" className="nh-prof__in" type="text" value={form.desc} onChange={set("desc")} />
            </div>
            <div className="nh-edt__acts">
              <button className="nh-btn nh-btn--accent" type="submit">
                {editing.id ? "Save changes" : "Create job"}
                <span className="material-symbols-rounded" aria-hidden="true">check</span>
              </button>
              <button className="nh-btn nh-btn--ghost" type="button" onClick={close}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="nh-acct__panel nh-in">
        {rows.length === 0 ? (
          <p className="nh-acct__empty">No jobs — create the first one.</p>
        ) : (
          <div className="nh-dt__wrap">
            <table className="nh-dt">
              <thead>
                <tr>
                  <th>Job</th>
                  <th>Schedule</th>
                  <th>Last run</th>
                  <th>State</th>
                  <th className="nh-dt__actcell"><span className="nh-sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((j) => (
                  <tr key={j.id}>
                    <td>
                      <div className="nh-dt__cell">
                        <span className="material-symbols-rounded" aria-hidden="true" style={{ fontSize: 20 }}>{j.icon}</span>
                        <div>
                          <div className="nh-dt__strong">{j.name}</div>
                          <div className="nh-dt__muted" style={{ maxWidth: 380 }}>{j.desc}</div>
                        </div>
                      </div>
                    </td>
                    <td className="nh-dt__ref nh-dt__nowrap">{j.schedule}</td>
                    <td className="nh-dt__muted nh-dt__nowrap">
                      {j.last_run ? new Date(j.last_run).toLocaleString() : "never"}
                      {lastRun && lastRun.id === j.id && (
                        <div style={{ color: "#0b8a4d", fontWeight: 700 }}>{lastRun.result} · {lastRun.ms}ms</div>
                      )}
                    </td>
                    <td>
                      <span className={"nh-acct__pill " + (j.enabled ? "nh-acct__pill--paid" : "nh-acct__pill--failed")}>
                        {j.enabled ? "enabled" : "off"}
                      </span>
                    </td>
                    <td className="nh-dt__actcell">
                      <RowMenu
                        label={`Actions for ${j.name}`}
                        items={[
                          { label: "Run now", icon: "play_arrow", onClick: () => onRun(j) },
                          { label: j.enabled ? "Disable" : "Enable", icon: j.enabled ? "pause" : "toggle_on", onClick: () => onToggle(j) },
                          { label: "Edit", icon: "edit", onClick: () => openEdit(j) },
                          {
                            label: "Delete", icon: "delete", danger: true,
                            confirmLabel: `Delete “${j.name}”? It will stop running.`,
                            onClick: () => onRemove(j)
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
    </>
  );
}
