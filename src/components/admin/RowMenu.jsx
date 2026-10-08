/*
 * RowMenu — 3-dot kebab menu for admin tables.
 * Renders a fixed-position popover (portal, avoids clipped scroll areas).
 * Danger items require an inline confirm step (no window.confirm, no modals).
 *
 * items: [{ label, icon, onClick, to?, danger? }]
 */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";

export default function RowMenu({ items, label = "Row actions" }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [confirmIdx, setConfirmIdx] = useState(-1);
  const btnRef = useRef(null);
  const popRef = useRef(null);

  const close = useCallback(() => {
    setOpen(false);
    setConfirmIdx(-1);
  }, []);

  function place() {
    const r = btnRef.current.getBoundingClientRect();
    const w = 216;
    let x = r.right - w;
    if (x < 8) x = 8;
    let y = r.bottom + 6;
    const estH = Math.max(items.length, 1) * 40 + 34;
    if (y + estH > window.innerHeight - 8) y = Math.max(8, r.top - estH - 6);
    setPos({ x, y });
  }

  function toggle(e) {
    if (open) return close();
    const r = e.currentTarget.getBoundingClientRect();
    const w = 216;
    let x = r.right - w;
    if (x < 8) x = 8;
    let y = r.bottom + 6;
    const estH = Math.max(items.length, 1) * 40 + 34;
    if (y + estH > window.innerHeight - 8) y = Math.max(8, r.top - estH - 6);
    setPos({ x, y });
    setConfirmIdx(-1);
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;
    function onDocDown(e) {
      if (popRef.current && popRef.current.contains(e.target)) return;
      if (btnRef.current && btnRef.current.contains(e.target)) return;
      close();
    }
    function onKey(e) {
      if (e.key === "Escape") close();
    }
    function reposition() { close(); }
    document.addEventListener("mousedown", onDocDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);
    return () => {
      document.removeEventListener("mousedown", onDocDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
    };
  }, [open, close]);

  function run(fn) {
    close();
    if (typeof fn === "function") fn();
  }

  return (
    <span className="nh-menu">
      <button
        ref={btnRef}
        type="button"
        className={"nh-menu__btn" + (open ? " is-on" : "")}
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={toggle}
      >
        <span className="material-symbols-rounded" aria-hidden="true">more_vert</span>
      </button>

      {open && createPortal(
        <div ref={popRef} className="nh-menu__pop" style={{ left: pos.x, top: pos.y }} role="menu">
          {confirmIdx >= 0 ? (
            <div className="nh-menu__confirm">
              {items[confirmIdx].confirmLabel || `Delete “${items[confirmIdx].label.replace(/^Delete/, "").trim()}”?`}
              <div className="nh-menu__confirmacts">
                <button
                  type="button"
                  className="nh-menu__yes"
                  onClick={() => {
                    const fn = items[confirmIdx].onClick;
                    close();
                    if (typeof fn === "function") fn();
                  }}
                >
                  Yes, delete
                </button>
                <button type="button" className="nh-menu__no" onClick={() => setConfirmIdx(-1)}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            items.map((it, i) => {
              const cls = "nh-menu__item" + (it.danger ? " nh-menu__item--danger" : "");
              const icon = (
                <span className="material-symbols-rounded" aria-hidden="true">{it.icon || "chevron_right"}</span>
              );
              if (it.to) {
                return (
                  <Link key={i} className={cls} to={it.to} role="menuitem" onClick={close}>
                    {icon}
                    {it.label}
                  </Link>
                );
              }
              return (
                <button
                  key={i}
                  type="button"
                  className={cls}
                  role="menuitem"
                  onClick={() => {
                    if (it.danger) setConfirmIdx(i);
                    else run(it.onClick);
                  }}
                >
                  {icon}
                  {it.label}
                </button>
              );
            })
          )}
        </div>,
        document.body
      )}
    </span>
  );
}
