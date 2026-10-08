/*
 * MediaPicker — the upload popup used across admin editors.
 * Two sources: paste a link (the file is downloaded into the browser) or
 * upload from local (FileReader). Both paths shrink the image and hand a
 * ready-to-use src (data URL) back via onPick(value).
 */
import React, { useEffect, useRef, useState } from "react";

function blobToDataURL(blob) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result);
    fr.onerror = reject;
    fr.readAsDataURL(blob);
  });
}

export function shrinkImage(dataUrl, max = 1600, quality = 0.85) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const longest = Math.max(img.width || 0, img.height || 0);
        const scale = longest > max ? max / longest : 1;
        if (scale === 1 && String(dataUrl).length < 900000) return resolve(dataUrl);
        const w = Math.max(1, Math.round((img.width || max) * scale));
        const h = Math.max(1, Math.round((img.height || max) * scale));
        const c = document.createElement("canvas");
        c.width = w;
        c.height = h;
        const ctx = c.getContext("2d");
        const png = String(dataUrl).startsWith("data:image/png") || String(dataUrl).startsWith("data:image/svg");
        if (!png) {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, w, h);
        }
        ctx.drawImage(img, 0, 0, w, h);
        resolve(c.toDataURL(png ? "image/png" : "image/jpeg", quality));
      } catch (e) {
        resolve(dataUrl);
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

async function downloadToDataURL(url) {
  const res = await fetch(url, { mode: "cors" });
  if (!res.ok) throw new Error("HTTP " + res.status);
  const type = (res.headers.get("content-type") || "").toLowerCase();
  const blob = await res.blob();
  if (blob && blob.type && !blob.type.startsWith("image/") && !type.startsWith("image/")) {
    throw new Error("not-an-image");
  }
  if (!blob.size) throw new Error("empty");
  const data = await blobToDataURL(blob);
  return shrinkImage(data);
}

export default function MediaPicker({ open, title, hint, onClose, onPick }) {
  const [tab, setTab] = useState("link");
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [note, setNote] = useState("");
  const fileRef = useRef(null);
  const urlRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setTab("link");
    setUrl("");
    setErr("");
    setNote("");
    setBusy(false);
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  async function pickLink(e) {
    e.preventDefault();
    if (busy) return;
    const raw = String(url || "").trim();
    if (!raw) {
      setErr("Paste an image link first.");
      return;
    }
    setErr("");
    setNote("");
    setBusy(true);
    try {
      const data = await downloadToDataURL(raw);
      onPick(data);
    } catch (e) {
      if (/^data:image\//.test(raw)) {
        onPick(raw);
        return;
      }
      setNote("The server blocked the download (CORS) — using the link directly instead.");
      onPick(raw);
    } finally {
      setBusy(false);
    }
  }

  async function pickLocal(file) {
    if (!file) return;
    setErr("");
    setNote("");
    if (!/^image\//.test(file.type)) {
      setErr("That file isn't an image.");
      return;
    }
    setBusy(true);
    try {
      const data = await blobToDataURL(file);
      const small = await shrinkImage(data);
      onPick(small);
    } catch (e) {
      setErr("Couldn't read that file — try another one.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="nh-modal is-on"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mp-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="nh-modal__card nh-modal__card--wide nh-mp">
        <span className="nh-modal__ic nh-modal__ic--ok" aria-hidden="true">
          <span className="material-symbols-rounded">add_photo_alternate</span>
        </span>
        <h2 className="nh-modal__title" id="mp-title">
          {title || "Add image"}
        </h2>
        {hint && <p className="nh-modal__text">{hint}</p>}

        <div className="nh-mp__tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "link"}
            className={"nh-mp__tab" + (tab === "link" ? " is-on" : "")}
            onClick={() => setTab("link")}
          >
            <span className="material-symbols-rounded" aria-hidden="true">link</span>
            Continue with a link
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "local"}
            className={"nh-mp__tab" + (tab === "local" ? " is-on" : "")}
            onClick={() => setTab("local")}
          >
            <span className="material-symbols-rounded" aria-hidden="true">upload_file</span>
            Upload from local
          </button>
        </div>

        {tab === "link" ? (
          <form className="nh-mp__panel" onSubmit={pickLink}>
            <label className="nh-mp__lab" htmlFor="mp-url">
              Image link
            </label>
            <input
              id="mp-url"
              ref={urlRef}
              className="nh-prof__in"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/photo.jpg  or  /assets/imgs/…/cover.jpg"
              autoFocus
            />
            <p className="nh-mp__hint">
              The file is downloaded into the site's storage, so the original
              server can be offline later.
            </p>
            <div className="nh-mp__acts">
              <button className="nh-btn nh-btn--accent" type="submit" disabled={busy}>
                {busy ? "Downloading…" : "Download & use"}
                <span className="material-symbols-rounded" aria-hidden="true">
                  {busy ? "progress_activity" : "cloud_download"}
                </span>
              </button>
              <button className="nh-btn nh-btn--ghost" type="button" onClick={onClose}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div
            className="nh-mp__drop"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files && e.dataTransfer.files[0]) pickLocal(e.dataTransfer.files[0]);
            }}
          >
            <span className="material-symbols-rounded" aria-hidden="true">drive_folder_upload</span>
            <b>Drag an image here</b>
            <span>or</span>
            <button
              className="nh-btn nh-btn--accent"
              type="button"
              disabled={busy}
              onClick={() => fileRef.current && fileRef.current.click()}
            >
              {busy ? "Reading…" : "Choose a file"}
              <span className="material-symbols-rounded" aria-hidden="true">folder_open</span>
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) pickLocal(e.target.files[0]);
                e.target.value = "";
              }}
            />
            <span className="nh-mp__hint">PNG, JPG, WEBP or SVG · resized to 1600px max</span>
          </div>
        )}

        {err && (
          <p className="nh-mp__err" role="alert">
            <span className="material-symbols-rounded" aria-hidden="true">error</span>
            {err}
          </p>
        )}
        {note && (
          <p className="nh-mp__note" role="status">
            <span className="material-symbols-rounded" aria-hidden="true">info</span>
            {note}
          </p>
        )}
      </div>
    </div>
  );
}
