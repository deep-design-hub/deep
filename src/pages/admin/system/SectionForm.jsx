/*
 * SectionForm — shared full-page settings editor for one system section.
 * Renders the page head, the section's fields, a Save button and any
 * page-specific children below the panel.
 */
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { settingsFor, saveSettingsPairs } from "../../../data/system";

export default function SectionForm({ section, title, em, sub, children, beforeForm, preview }) {
  const fields = useMemo(() => settingsFor(section), [section]);
  const [values, setValues] = useState(() =>
    Object.fromEntries(settingsFor(section).map((s) => [s.key, s.value == null ? "" : String(s.value)]))
  );
  const [msg, setMsg] = useState(null);

  function set(key) {
    return (e) => setValues((v) => ({ ...v, [key]: e.target.value }));
  }

  function save(e) {
    e.preventDefault();
    saveSettingsPairs(values, "admin");
    setMsg({ ok: true, text: "Settings saved — applied across the site." });
  }

  return (
    <div className="nh-edt">
      <div className="nh-dash__head">
        <div>
          <h1>
            {title}
            <br />
            <em>{em}</em>
          </h1>
          <p className="nh-dash__sub">{sub}</p>
        </div>
        <div className="nh-dash__headacts">
          {preview && (
            <Link className="nh-rowbtn" to={preview.to}>
              <span className="material-symbols-rounded" aria-hidden="true">visibility</span>
              {preview.label || "Preview"}
            </Link>
          )}
          <Link className="nh-rowbtn" to="/admin/system">
            <span className="material-symbols-rounded" aria-hidden="true">arrow_back</span>
            Back to system cards
          </Link>
        </div>
      </div>

      {beforeForm}

      <form className="nh-acct__panel nh-edt__panel nh-in" onSubmit={save}>
        {msg && (
          <div className={msg.ok ? "nh-prof__ok" : "nh-prof__err"} role="status">
            <span className="material-symbols-rounded" aria-hidden="true">{msg.ok ? "task_alt" : "error"}</span>
            {msg.text}
          </div>
        )}

        <div className="nh-edt__form">
          {fields.map((s) => (
            <div key={s.id || s.key}>
              <label className="nh-prof__lab" htmlFor={`st-${s.key}`}>{s.label}</label>
              {s.type === "toggle" ? (
                <select id={`st-${s.key}`} className="nh-prof__in" value={values[s.key] ?? ""} onChange={set(s.key)}>
                  <option value="off">Off</option>
                  <option value="on">On</option>
                </select>
              ) : s.type === "select" ? (
                <select id={`st-${s.key}`} className="nh-prof__in" value={values[s.key] ?? ""} onChange={set(s.key)}>
                  {String(s.options || "").split(",").filter(Boolean).map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              ) : s.type === "textarea" ? (
                <textarea id={`st-${s.key}`} className="nh-prof__in nh-edt__ta" value={values[s.key] ?? ""} onChange={set(s.key)} />
              ) : (
                <input
                  id={`st-${s.key}`}
                  className="nh-prof__in"
                  type={s.type === "number" ? "number" : s.type === "color" ? "color" : "text"}
                  value={values[s.key] ?? ""}
                  onChange={set(s.key)}
                />
              )}
              {s.hint && <p className="nh-edt__hint">{s.hint}</p>}
            </div>
          ))}

          <div className="nh-edt__acts">
            <button className="nh-btn nh-btn--accent" type="submit">
              Save changes
              <span className="material-symbols-rounded" aria-hidden="true">check</span>
            </button>
          </div>
        </div>
      </form>

      {children}
    </div>
  );
}
