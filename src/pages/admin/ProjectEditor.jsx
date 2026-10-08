/*
 * /admin/projects/new | /admin/projects/:id — full-page project editor.
 * One project = one gallery card + one case-study page.
 * Layout: content fields on the left, publishing rail (cover, category,
 * status/draft, save) on the right. Uploads go through MediaPicker.
 */
import React, { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { listProjects, saveProject, updateProject, CATEGORIES } from "../../data/projects";
import { usePageSEO } from "../../seo";
import MediaPicker from "../../components/admin/MediaPicker";
import "../../auth.css";

const CATS = CATEGORIES.filter((c) => c.id !== "all" && c.id !== "sale");
const STATUS = [
  { id: "draft", label: "Draft — hidden from the site" },
  { id: "preview", label: "Preview" },
  { id: "client-work", label: "Client work" },
  { id: "for-sale", label: "For sale" }
];

const EMPTY = {
  title: "", slug: "", kind: "", category: "web", year: String(new Date().getFullYear()),
  role: "", client: "", status: "preview", price: "", priceNote: "One-time",
  license: "", delivery: "", cover: "", alt: "", def: "",
  images: [], storyText: "", covered: "", scope: "", outcome: "",
  tools: "", includes: "", tags: "", icon: "deployed_code"
};

function toForm(p) {
  if (!p) return { ...EMPTY, images: [] };
  return {
    ...EMPTY,
    title: p.title || "", slug: p.slug || "", kind: p.kind || "", category: p.category || "web",
    year: p.year || "", role: p.role || "", client: p.client || "", status: p.status || "preview",
    price: p.price != null ? p.price : "", priceNote: p.priceNote || "", license: p.license || "",
    delivery: p.delivery || "", cover: p.cover || "", alt: p.alt || "", def: p.def || "",
    images: (p.images || []).map((i) => ({ src: i.src || "", cap: i.cap || "" })),
    storyText: (p.story || []).map((s) => `${s.h} | ${s.p}`).join("\n"),
    covered: p.covered || "",
    scope: (p.scope || []).join(", "),
    outcome: p.outcome || "",
    tools: (p.tools || []).join(", "),
    includes: (p.includes || []).join("\n"),
    tags: (p.tags || []).join(", "),
    icon: p.icon || "deployed_code"
  };
}

function lines(v) {
  return String(v || "").split("\n").map((s) => s.trim()).filter(Boolean);
}
function commas(v) {
  return String(v || "").split(",").map((s) => s.trim()).filter(Boolean);
}

export default function ProjectEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const all = useMemo(() => listProjects(), []);
  const editing = id && id !== "new" ? all.find((p) => p.id === id) : null;

  const [form, setForm] = useState(() => toForm(editing));
  const [msg, setMsg] = useState(null);
  const [picker, setPicker] = useState(null); // {use:"cover"} | {use:"img"} | {use:"img", index}

  usePageSEO({
    noindex: true,
    title: `Deep Design Dev: ${editing ? "Edit" : "New"} project`,
    description: "Create or edit a Deep Design Dev project.",
    keywords: "deep design hubs admin project editor"
  });

  function set(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function handlePick(value) {
    if (!picker) return;
    if (picker.use === "cover") {
      setForm((f) => ({ ...f, cover: value }));
    } else if (picker.index == null) {
      setForm((f) => ({ ...f, images: [...f.images, { src: value, cap: "" }] }));
    } else {
      setForm((f) => {
        const imgs = f.images.slice();
        imgs[picker.index] = { ...imgs[picker.index], src: value };
        return { ...f, images: imgs };
      });
    }
    setPicker(null);
  }

  function removeImage(i) {
    setForm((f) => ({ ...f, images: f.images.filter((_, n) => n !== i) }));
  }

  function setImgCap(i, cap) {
    setForm((f) => {
      const imgs = f.images.slice();
      imgs[i] = { ...imgs[i], cap };
      return { ...f, images: imgs };
    });
  }

  function submit(e, asDraft) {
    e.preventDefault();
    if (!form.title.trim()) {
      setMsg({ ok: false, text: "Title is required." });
      return;
    }
    const slug = String(form.slug || form.title).trim().toLowerCase().replace(/\s+/g, "-");
    const status = asDraft ? "draft" : form.status;
    const payload = {
      title: form.title.trim(),
      slug,
      kind: form.kind.trim(),
      category: form.category,
      year: form.year.trim(),
      role: form.role.trim(),
      client: form.client.trim(),
      status,
      price: status === "for-sale" ? Number(form.price) || 0 : undefined,
      priceNote: form.priceNote.trim(),
      license: form.license.trim(),
      delivery: form.delivery.trim(),
      cover: form.cover.trim(),
      alt: form.alt.trim() || form.title.trim(),
      def: form.def.trim(),
      icon: form.icon.trim() || "deployed_code",
      images: form.images.filter((i) => i.src),
      story: lines(form.storyText).map((l) => {
        const i = l.indexOf("|");
        return i < 0 ? { h: l, p: "" } : { h: l.slice(0, i).trim(), p: l.slice(i + 1).trim() };
      }),
      covered: form.covered.trim(),
      scope: commas(form.scope),
      outcome: form.outcome.trim(),
      tools: commas(form.tools),
      includes: lines(form.includes),
      tags: commas(form.tags)
    };
    if (payload.status !== "for-sale") payload.price = undefined;
    if (payload.images.length && !payload.cover) payload.cover = payload.images[0].src;

    const dupe = all.find((r) => r.slug === slug || (!editing && r.title === payload.title));
    if (editing && dupe && dupe.id !== editing.id) {
      setMsg({ ok: false, text: "Another project already uses that slug/title." });
      return;
    }
    if (!editing && dupe) {
      setMsg({ ok: false, text: "A project with that slug/title already exists." });
      return;
    }

    if (editing) updateProject(editing.id, payload);
    else saveProject(payload);
    navigate("/admin/projects");
  }

  if (id && id !== "new" && !editing) {
    return (
      <>
        <div className="nh-dash__head">
          <div>
            <h1>
              Project not found
              <br />
              <em>That id isn't in the projects table.</em>
            </h1>
          </div>
        </div>
        <div className="nh-acct__panel nh-in">
          <p className="nh-acct__empty">
            <Link className="nh-rowbtn" to="/admin/projects">Back to projects</Link>
          </p>
        </div>
      </>
    );
  }

  return (
    <div className="nh-edt nh-edt--wide">
      <div className="nh-dash__head">
        <div>
          <h1>
            {editing ? "Edit project" : "New project"}
            <br />
            <em>
              {editing
                ? "Changes go live on the gallery and case-study immediately."
                : "One project = one gallery card + one case-study page."}
            </em>
          </h1>
          <p className="nh-dash__sub">
            <Link to="/admin/projects">← Back to projects</Link>
          </p>
        </div>
      </div>

      <div className="nh-edt__grid">
        {/* ---------- left: content ---------- */}
        <div className="nh-acct__panel nh-edt__panel nh-in">
          {msg && (
            <div className={msg.ok ? "nh-prof__ok" : "nh-prof__err"} role="status">
              <span className="material-symbols-rounded" aria-hidden="true">{msg.ok ? "task_alt" : "error"}</span>
              {msg.text}
            </div>
          )}

          <form className="nh-edt__form" onSubmit={(e) => submit(e, false)}>
            <div className="nh-edt__row">
              <div>
                <label className="nh-prof__lab" htmlFor="pj-title">Title *</label>
                <input id="pj-title" className="nh-prof__in" type="text" value={form.title} onChange={set("title")} required />
              </div>
              <div>
                <label className="nh-prof__lab" htmlFor="pj-slug">Slug</label>
                <input id="pj-slug" className="nh-prof__in" type="text" value={form.slug} onChange={set("slug")} placeholder="auto from title" />
              </div>
            </div>

            <div>
              <label className="nh-prof__lab" htmlFor="pj-def">Summary</label>
              <textarea id="pj-def" className="nh-prof__in nh-edt__ta" value={form.def} onChange={set("def")} />
            </div>

            <div>
              <span className="nh-prof__lab">Gallery images</span>
              <div className="nh-imgs">
                {form.images.map((img, i) => (
                  <div className="nh-img-row" key={i}>
                    {img.src ? (
                      <img className="nh-img-row__prev" src={img.src} alt="" />
                    ) : (
                      <span className="nh-img-row__prev" aria-hidden="true" />
                    )}
                    <input
                      className="nh-prof__in nh-img-row__cap"
                      type="text"
                      value={img.cap}
                      onChange={(e) => setImgCap(i, e.target.value)}
                      placeholder="Caption (optional)"
                    />
                    <span className="nh-img-row__acts">
                      <button type="button" className="nh-img-row__btn" onClick={() => setPicker({ use: "img", index: i })}>
                        <span className="material-symbols-rounded" aria-hidden="true">swap_horiz</span>
                        Replace
                      </button>
                      <button type="button" className="nh-img-row__btn nh-img-row__btn--danger" onClick={() => removeImage(i)}>
                        <span className="material-symbols-rounded" aria-hidden="true">delete</span>
                        Remove
                      </button>
                    </span>
                  </div>
                ))}
                <button type="button" className="nh-imgs__add" onClick={() => setPicker({ use: "img" })}>
                  <span className="material-symbols-rounded" aria-hidden="true">add_photo_alternate</span>
                  Add image
                </button>
              </div>
              <p className="nh-edt__hint">First image becomes the cover if the cover field is empty.</p>
            </div>

            <div>
              <label className="nh-prof__lab" htmlFor="pj-story">Case-study story</label>
              <textarea id="pj-story" className="nh-prof__in nh-edt__ta" value={form.storyText} onChange={set("storyText")} placeholder={"The brief | What the client asked for…\nThe result | What changed…"} />
              <p className="nh-edt__hint">One section per line: <b>heading | paragraph</b>.</p>
            </div>

            <div className="nh-edt__row">
              <div>
                <label className="nh-prof__lab" htmlFor="pj-includes">What's included</label>
                <textarea id="pj-includes" className="nh-prof__in nh-edt__ta" value={form.includes} onChange={set("includes")} placeholder={"Figma source file\nLifetime updates"} />
                <p className="nh-edt__hint">One item per line (for-sale deliverables).</p>
              </div>
              <div>
                <label className="nh-prof__lab" htmlFor="pj-scope">Scope / tools / tags</label>
                <input className="nh-prof__in" type="text" value={form.scope} onChange={set("scope")} placeholder="Scope: IA, Flows, UI" style={{ marginBottom: 10 }} />
                <input className="nh-prof__in" type="text" value={form.tools} onChange={set("tools")} placeholder="Tools: Figma, React" style={{ marginBottom: 10 }} />
                <input className="nh-prof__in" type="text" value={form.tags} onChange={set("tags")} placeholder="Tags: seo, keyword, keyword" />
                <p className="nh-edt__hint">Comma-separated values.</p>
              </div>
            </div>

            <div className="nh-edt__row">
              <div>
                <label className="nh-prof__lab" htmlFor="pj-covered">What was covered</label>
                <input id="pj-covered" className="nh-prof__in" type="text" value={form.covered} onChange={set("covered")} />
              </div>
              <div>
                <label className="nh-prof__lab" htmlFor="pj-outcome">Outcome line</label>
                <input id="pj-outcome" className="nh-prof__in" type="text" value={form.outcome} onChange={set("outcome")} placeholder="Scannable data, fewer clicks" />
              </div>
            </div>

            <div className="nh-edt__row nh-edt__row--3">
              <div>
                <label className="nh-prof__lab" htmlFor="pj-role">Role</label>
                <input id="pj-role" className="nh-prof__in" type="text" value={form.role} onChange={set("role")} placeholder="Product designer" />
              </div>
              <div>
                <label className="nh-prof__lab" htmlFor="pj-license">Licence</label>
                <input id="pj-license" className="nh-prof__in" type="text" value={form.license} onChange={set("license")} />
              </div>
              <div>
                <label className="nh-prof__lab" htmlFor="pj-delivery">Delivery</label>
                <input id="pj-delivery" className="nh-prof__in" type="text" value={form.delivery} onChange={set("delivery")} />
              </div>
            </div>

            <div className="nh-edt__row nh-edt__row--3">
              <div>
                <label className="nh-prof__lab" htmlFor="pj-kind">Kind label</label>
                <input id="pj-kind" className="nh-prof__in" type="text" value={form.kind} onChange={set("kind")} placeholder="UI / UX · Product" />
              </div>
              <div>
                <label className="nh-prof__lab" htmlFor="pj-year">Year</label>
                <input id="pj-year" className="nh-prof__in" type="text" value={form.year} onChange={set("year")} />
              </div>
              <div>
                <label className="nh-prof__lab" htmlFor="pj-client">Client</label>
                <input id="pj-client" className="nh-prof__in" type="text" value={form.client} onChange={set("client")} />
              </div>
            </div>

            {/* mobile-only save row (rail is hidden below the form on small screens) */}
            <div className="nh-edt__acts nh-edt__acts--mobile">
              <button className="nh-btn nh-btn--accent" type="submit">
                {editing ? "Save changes" : "Create project"}
                <span className="material-symbols-rounded" aria-hidden="true">check</span>
              </button>
            </div>
          </form>
        </div>

        {/* ---------- right: publishing rail ---------- */}
        <aside className="nh-edt__rail">
          <div className="nh-edt__card nh-in">
            <b>
              <span className="material-symbols-rounded" aria-hidden="true">publish</span>
              Publish
            </b>
            <div className="nh-edt__stack">
              <div>
                <label className="nh-prof__lab" htmlFor="pj-status">Status</label>
                <select id="pj-status" className="nh-prof__in" value={form.status} onChange={set("status")}>
                  {STATUS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label className="nh-prof__lab" htmlFor="pj-cat">Category</label>
                <select id="pj-cat" className="nh-prof__in" value={form.category} onChange={set("category")}>
                  {CATS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
              {form.status === "for-sale" && (
                <div className="nh-edt__row" style={{ gridTemplateColumns: "1fr 1fr" }}>
                  <div>
                    <label className="nh-prof__lab" htmlFor="pj-price">Price (USD)</label>
                    <input id="pj-price" className="nh-prof__in" type="number" min="0" value={form.price} onChange={set("price")} placeholder="129" />
                  </div>
                  <div>
                    <label className="nh-prof__lab" htmlFor="pj-priceNote">Note</label>
                    <input id="pj-priceNote" className="nh-prof__in" type="text" value={form.priceNote} onChange={set("priceNote")} placeholder="One-time" />
                  </div>
                </div>
              )}
              <div className="nh-edt__acts nh-edt__acts--rail" style={{ display: "grid", gap: 8 }}>
                <button className="nh-btn nh-btn--accent" type="button" onClick={(e) => submit(e, false)}>
                  {editing ? "Save changes" : "Create project"}
                  <span className="material-symbols-rounded" aria-hidden="true">check</span>
                </button>
                {!editing || form.status !== "draft" ? (
                  <button className="nh-btn nh-btn--ghost" type="button" onClick={(e) => submit(e, true)}>
                    <span className="material-symbols-rounded" aria-hidden="true">draft</span>
                    Save as draft
                  </button>
                ) : null}
                <button className="nh-btn nh-btn--ghost" type="button" onClick={() => navigate("/admin/projects")}>Cancel</button>
              </div>
              {editing && (
                <p className="nh-edt__hint">
                  <Link to={`/project/${editing.slug}`} style={{ textDecoration: "underline" }}>
                    Preview the case-study page →
                  </Link>
                </p>
              )}
            </div>
          </div>

          <div className="nh-edt__card nh-in" style={{ transitionDelay: ".06s" }}>
            <b>
              <span className="material-symbols-rounded" aria-hidden="true">image</span>
              Cover photo
            </b>
            <div className="nh-edt__stack">
              {form.cover ? (
                <img className="nh-edt__cover-prev" src={form.cover} alt="" />
              ) : (
                <div className="nh-edt__cover-empty">
                  <span className="material-symbols-rounded" aria-hidden="true">broken_image</span>
                  No cover yet — add one below
                </div>
              )}
              <button className="nh-btn nh-btn--accent" type="button" onClick={() => setPicker({ use: "cover" })}>
                <span className="material-symbols-rounded" aria-hidden="true">add_photo_alternate</span>
                {form.cover ? "Change cover" : "Add cover"}
              </button>
              {form.cover && (
                <button
                  className="nh-btn nh-btn--ghost"
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, cover: "" }))}
                >
                  <span className="material-symbols-rounded" aria-hidden="true">hide_image</span>
                  Remove cover
                </button>
              )}
              <div>
                <label className="nh-prof__lab" htmlFor="pj-alt">Cover alt text</label>
                <input id="pj-alt" className="nh-prof__in" type="text" value={form.alt} onChange={set("alt")} placeholder="describes the cover image" />
              </div>
            </div>
          </div>
        </aside>
      </div>

      <MediaPicker
        open={!!picker}
        title={picker && picker.use === "cover" ? "Cover photo" : "Gallery image"}
        hint={picker && picker.use === "cover"
          ? "Paste a link (we download it) or upload a file from your computer."
          : "The image is stored with the project, so it survives even if the original link dies."}
        onClose={() => setPicker(null)}
        onPick={handlePick}
      />
    </div>
  );
}
