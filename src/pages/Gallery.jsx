import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PageStamp from "../components/PageStamp";
import { ALBUMS, albumStats } from "../data/albums";
import { SITE } from "../data/site";
import { usePageSEO, breadcrumbJsonLd } from "../seo";
import { openRequestPanel } from "../data/requestPanel";
import "../detail.css";

const KINDS = ["all", ...Array.from(new Set(ALBUMS.map((a) => a.kind)))];

export default function Gallery() {
  const [kind, setKind] = useState("all");
  const [openIdx, setOpenIdx] = useState(null); // index into `list`
  const [photo, setPhoto] = useState(0);
  const stats = useMemo(() => albumStats(), []);

  const list = useMemo(
    () => (kind === "all" ? ALBUMS : ALBUMS.filter((a) => a.kind === kind)),
    [kind]
  );
  const cur = openIdx === null ? null : list[openIdx];

  usePageSEO({
    title: "Deep Design Dev: Gallery — events, competitions & behind the scenes",
    description:
      "Photos from the Deep Design Dev gallery: dev events, hackathons, competitions, meetups and workshops Abubakar Musa lived through. Pick a cover, open the album, see the full story in pictures.",
    keywords:
      "deep design dev gallery, design event photos, hackathon, dev meetup, design competition, workshop, abubakar musa events",
    path: "/gallery",
    image: ALBUMS[0] ? ALBUMS[0].cover : "/assets/imgs/logo/meta.png",
    jsonLd: [
      breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Gallery", path: "/gallery" }
      ]),
      {
        "@context": "https://schema.org",
        "@type": "ImageGallery",
        name: "Deep Design Dev Gallery",
        description: "Event photography and album coverage from the Deep Design Dev studio.",
        url: "https://deep-design.netlify.app/gallery",
        associatedMedia: ALBUMS.map((a) => ({
          "@type": "ImageObject",
          name: a.title,
          contentUrl: "https://deep-design.netlify.app" + a.cover
        }))
      }
    ]
  });

  useEffect(() => {
    if (openIdx === null) return;
    function onKey(e) {
      if (e.key === "Escape") setOpenIdx(null);
      if (!cur) return;
      if (e.key === "ArrowRight")
        setPhoto((p) => (p + 1) % cur.photos.length);
      if (e.key === "ArrowLeft")
        setPhoto((p) => (p - 1 + cur.photos.length) % cur.photos.length);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openIdx, cur]);

  useEffect(() => setPhoto(0), [openIdx]);

  return (
    <>
      <Header />
      <main className="nh-main">
        <section className="nh-gal">
          <div className="nh-wrap">
            <div className="nh-phead">
              <div className="nh-phead__copy nh-gal__head nh-in">
                <span className="nh-tag">
                  <span className="material-symbols-rounded" aria-hidden="true">
                    photo_camera
                  </span>
                  Gallery
                </span>
                <h1 className="nh-h2" style={{ marginTop: "20px" }}>
                  Life behind
                  <br />
                  <em>the work</em>
                </h1>
                <p className="nh-sub">
                  Events, meetups, competitions and workshops I've lived through — a
                  cover shot for each one, and the full album behind it. Click any
                  cover to walk through the whole story in pictures.
                </p>

                <div className="nh-gal__stats">
                  <div>
                    <b>{stats.albums}</b>
                    <span>Events &amp; projects</span>
                  </div>
                  <div>
                    <b>{stats.photos}</b>
                    <span>Photos</span>
                  </div>
                  <div>
                    <b>{new Set(ALBUMS.map((a) => a.kind)).size}</b>
                    <span>Kinds of coverage</span>
                  </div>
                  <div>
                    <b>{ALBUMS.reduce((n, a) => Math.min(n, +(a.year || 2026)), 2026)}</b>
                    <span>Earliest year</span>
                  </div>
                </div>
              </div>
              <PageStamp text="Gallery · Events · Competitions · Behind the scenes · " icon="photo_camera" label="Gallery stamp" />
            </div>

            <div className="nh-gal__filters nh-in" role="tablist" aria-label="Filter albums">
              {KINDS.map((k) => {
                const n = k === "all" ? ALBUMS.length : ALBUMS.filter((a) => a.kind === k).length;
                return (
                  <button
                    key={k}
                    type="button"
                    role="tab"
                    aria-selected={kind === k}
                    className={"nh-chip" + (kind === k ? " is-on" : "")}
                    onClick={() => { setKind(k); setOpenIdx(null); }}
                  >
                    {k === "all" ? "Everything" : k}
                    <i>{n}</i>
                  </button>
                );
              })}
            </div>

            <div className="nh-albs">
              {list.map((a, i) => (
                <button
                  type="button"
                  key={a.slug}
                  className="nh-alb nh-in"
                  style={{ transitionDelay: Math.min(i * 0.05, 0.3) + "s" }}
                  onClick={() => { setOpenIdx(i); setPhoto(0); }}
                  aria-label={`Open ${a.title} album (${a.photos.length} photos)`}
                >
                  <span className="nh-alb__media">
                    <img src={a.cover} alt={a.title} loading="lazy" decoding="async" draggable="false" />
                    <span className="nh-alb__shade" aria-hidden="true" />
                    <span className="nh-alb__chip">
                      <span className="material-symbols-rounded" aria-hidden="true">{a.icon}</span>
                      {a.kind}
                    </span>
                    <span className="nh-alb__count">
                      <span className="material-symbols-rounded" aria-hidden="true">photo_library</span>
                      {a.photos.length} photos
                    </span>
                    <span className="nh-alb__open" aria-hidden="true">
                      <span className="material-symbols-rounded">fullscreen</span>
                    </span>
                  </span>
                  <span className="nh-alb__body">
                    <span className="nh-alb__meta">
                      <b>{a.year}</b>
                      <span>·</span>
                      <span>{a.location}</span>
                    </span>
                    <h2 className="nh-alb__title">{a.title}</h2>
                    <p className="nh-alb__desc">{a.def}</p>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="nh-cta">
          <div className="nh-wrap">
            <div className="nh-cta__card">
              <div className="nh-cta__inner nh-in">
                <span className="nh-tag">
                  <span className="material-symbols-rounded" aria-hidden="true">
                    event
                  </span>
                  Live events
                </span>
                <h2 className="nh-cta__title" style={{ marginTop: "20px" }}>
                  Next event? Let's make it memorable.
                </h2>
                <p className="nh-cta__sub">
                  If you're running a dev meetup, hackathon, launch or competition,
                  I'll design the identity, the badges, the decks and the social kit
                  — and show up with a camera to cover it.
                </p>
                <div className="nh-cta__actions">
                  <button type="button" className="nh-btn nh-btn--accent" onClick={openRequestPanel}>
                    Commission event design
                    <span className="material-symbols-rounded" aria-hidden="true">
                      arrow_outward
                    </span>
                  </button>
                  <Link to="/projects" className="nh-btn nh-btn--outline">
                    See shipped projects
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {cur && (
        <div
          className="nh-abv"
          role="dialog"
          aria-modal="true"
          aria-label={`${cur.title} album`}
          onClick={() => setOpenIdx(null)}
        >
          <div className="nh-abv__panel" onClick={(e) => e.stopPropagation()}>
            <div className="nh-abv__top">
              <div className="nh-abv__info">
                <span className="nh-abv__chip">
                  <span className="material-symbols-rounded" aria-hidden="true">{cur.icon}</span>
                  {cur.kind} · {cur.year} · {cur.location}
                </span>
                <h3 className="nh-abv__title">{cur.title}</h3>
                <p className="nh-abv__desc">{cur.def}</p>
              </div>
              <div className="nh-abv__closer">
                <span className="nh-abv__counter">{photo + 1} / {cur.photos.length}</span>
                <button type="button" className="nh-abv__x" onClick={() => setOpenIdx(null)} aria-label="Close album">
                  <span className="material-symbols-rounded" aria-hidden="true">close</span>
                </button>
              </div>
            </div>

            <div className="nh-abv__stage">
              <img
                key={cur.photos[photo]}
                src={cur.photos[photo]}
                alt={`${cur.title} — photo ${photo + 1}`}
                draggable="false"
              />
              {cur.photos.length > 1 && (
                <>
                  <button
                    type="button"
                    className="nh-abv__nav nh-abv__nav--prev"
                    onClick={() => setPhoto((photo - 1 + cur.photos.length) % cur.photos.length)}
                    aria-label="Previous photo"
                  >
                    <span className="material-symbols-rounded" aria-hidden="true">arrow_back</span>
                  </button>
                  <button
                    type="button"
                    className="nh-abv__nav nh-abv__nav--next"
                    onClick={() => setPhoto((photo + 1) % cur.photos.length)}
                    aria-label="Next photo"
                  >
                    <span className="material-symbols-rounded" aria-hidden="true">arrow_forward</span>
                  </button>
                </>
              )}
            </div>

            {cur.photos.length > 1 && (
              <div className="nh-abv__thumbs">
                {cur.photos.map((src, n) => (
                  <button
                    type="button"
                    key={src}
                    className={"nh-abv__t" + (n === photo ? " is-on" : "")}
                    onClick={() => setPhoto(n)}
                    aria-label={`Photo ${n + 1}`}
                  >
                    <img src={src} alt="" loading="lazy" decoding="async" />
                  </button>
                ))}
              </div>
            )}

            <p className="nh-abv__hint">
              <span className="material-symbols-rounded" aria-hidden="true">swap_horiz</span>
              Use arrow keys to move between photos · ESC to close
            </p>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}