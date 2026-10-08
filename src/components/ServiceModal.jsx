/*
 * ServiceModal — "What do you need?" popup picker for request forms
 * (contact page + header request panel).
 *
 * Trigger looks like the form's own inputs; clicking opens a dark,
 * icon-rich modal with the service options. Selection is stored in a
 * hidden input named `name`, so FormData and the vanilla headerRuntime
 * submit keep working untouched.
 *
 * options: [{ value, label, icon, desc?, img? }]
 */
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function ServiceModal({
  name,
  options,
  value,
  onChange,
  required = false,
  id,
  placeholder = "Pick a service",
  className = "",
  title = "What do you need?",
  tag = "Request type",
  emptyIcon = "category",
  tagIcon
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const sel = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open && panelRef.current) {
      const first = panelRef.current.querySelector(".nh-selm__opt");
      if (first) first.focus();
    }
  }, [open]);

  function pick(v) {
    if (onChange) onChange(v);
    setOpen(false);
    window.setTimeout(() => triggerRef.current && triggerRef.current.focus(), 0);
  }

  return (
    <>
      <button
        type="button"
        ref={triggerRef}
        id={id}
        className={"nh-sel" + (sel ? " has-value" : "") + (className ? " " + className : "")}
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        data-nav
      >
        <span className="nh-sel__ic material-symbols-rounded" aria-hidden="true">
          {open ? "expand_less" : sel ? sel.icon : emptyIcon}
        </span>
        <span className="nh-sel__tx">{sel ? sel.label : placeholder}</span>
        <span className="nh-sel__car" aria-hidden="true">
          {open ? "expand_less" : "expand_more"}
        </span>
      </button>
      <input
        type="hidden"
        name={name}
        value={value || ""}
        required={required}
        readOnly
        tabIndex={-1}
        aria-hidden="true"
      />

      {open &&
        createPortal(
          <div
            className="nh-selm"
            role="dialog"
            aria-modal="true"
            aria-label={title}
            onClick={() => setOpen(false)}
          >
            <div
              className="nh-selm__panel"
              ref={panelRef}
              role="menu"
              aria-label="Services"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="nh-selm__head">
                <div className="nh-selm__tt">
                  <span className="nh-selm__tag">
                    <span className="material-symbols-rounded" aria-hidden="true">
                      {tagIcon || emptyIcon || "category"}
                    </span>
                    {tag}
                  </span>
                  <h3>{title}</h3>
                </div>
                <button
                  type="button"
                  className="nh-selm__x"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                >
                  <span className="material-symbols-rounded" aria-hidden="true">
                    close
                  </span>
                </button>
              </div>
              <div className="nh-selm__grid">
                {options.map((o) => (
                  <button
                    type="button"
                    key={o.value}
                    role="menuitemradio"
                    aria-checked={value === o.value}
                    className={"nh-selm__opt" + (value === o.value ? " is-on" : "")}
                    onClick={() => pick(o.value)}
                    data-nav
                  >
                    <span className="nh-selm__ic" aria-hidden="true">
                      {o.img ? (
                        <img src={o.img} alt="" loading="lazy" />
                      ) : (
                        <span className="material-symbols-rounded">{o.icon || "category"}</span>
                      )}
                    </span>
                    <span className="nh-selm__tx">
                      <b>{o.label}</b>
                      {o.desc ? <small>{o.desc}</small> : null}
                    </span>
                    {value === o.value ? (
                      <span className="nh-selm__chk material-symbols-rounded" aria-hidden="true">
                        check_circle
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}