import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Stars } from "../components/Stars";
import PageStamp from "../components/PageStamp";
import { listPublished, CATEGORIES, isForSale, galleryStats } from "../data/projects";
import { SITE } from "../data/site";
import { usePageSEO, breadcrumbJsonLd } from "../seo";
import "../detail.css";

export default function Gallery() {
  const [cat, setCat] = useState("all");
  const all = listPublished();
  const stats = useMemo(() => galleryStats(), [all]);

  usePageSEO({
    title: "Deep Design Hubs: Gallery — web, branding, UI/UX & graphic design projects",
    description:
      "Browse the full Deep Design Hubs gallery: websites, brand identity systems, dashboards, packaging and poster work by Abubakar Musa. Every project opens a full case study with images, description, client rating and reviews — for-sale builds include price, licence and what you get.",
    keywords:
      "deep design hubs gallery, web design projects, graphic design portfolio, brand identity work, ui ux case studies, design projects for sale, abubakar musa portfolio",
    path: "/gallery",
    jsonLd: [
      breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Gallery", path: "/gallery" }
      ]),
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Deep Design Hubs Gallery",
        description: "Selected web, branding, UI/UX and graphic design projects, each with a full case study.",
        url: "https://deep-design.netlify.app/gallery",
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: all.length,
          itemListElement: all.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: p.title,
            url: "https://deep-design.netlify.app/project/" + p.slug
          }))
        }
      }
    ]
  });

  const list = useMemo(() => {
    if (cat === "all") return all;
    if (cat === "sale") return all.filter(isForSale);
    return all.filter((p) => p.category === cat);
  }, [cat, all]);

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
                    photo_library
                  </span>
                  Gallery
                </span>
                <h1 className="nh-h2" style={{ marginTop: "20px" }}>
                  Every build,
                  <br />
                  <em>front to back</em>
                </h1>
                <p className="nh-sub">
                  Each set below is a project — one cover and every extra shot that
                  belongs to it. Open any set for the full case study: what was
                  built, how it was rated, and whether it's for sale.
                </p>

                <div className="nh-gal__stats">
                  <div>
                    <b>{stats.total}</b>
                    <span>Projects</span>
                  </div>
                  <div>
                    <b>{stats.images}</b>
                    <span>Photos</span>
                  </div>
                  <div>
                    <b>{stats.forSale}</b>
                    <span>For sale</span>
                  </div>
                  <div>
                    <b>4.8</b>
                    <span>Avg. rating</span>
                  </div>
                </div>
              </div>
              <PageStamp text="Gallery · Case studies · Reviews · For sale · " icon="photo_library" label="Gallery stamp" />
            </div>

            <div className="nh-gal__filters nh-in" role="tablist" aria-label="Filter projects">
              {CATEGORIES.map((c) => {
                const n =
                  c.id === "all"
                    ? all.length
                    : c.id === "sale"
                    ? all.filter(isForSale).length
                    : all.filter((p) => p.category === c.id).length;
                return (
                  <button
                    key={c.id}
                    type="button"
                    role="tab"
                    aria-selected={cat === c.id}
                    className={"nh-chip" + (cat === c.id ? " is-on" : "")}
                    onClick={() => setCat(c.id)}
                  >
                    {c.label}
                    <i>{n}</i>
                  </button>
                );
              })}
            </div>

            <div className="nh-gal__grid">
              {list.map((p, i) => (
                <Link
                  to={`/project/${p.slug}`}
                  className="nh-gcard nh-in"
                  key={p.slug}
                  style={{ transitionDelay: Math.min(i * 0.04, 0.3) + "s" }}
                >
                  <div className="nh-gcard__media">
                    <img src={p.cover} alt={p.alt} loading="lazy" decoding="async" />
                    <span className="nh-gcard__count">
                      <span className="material-symbols-rounded" aria-hidden="true">
                        photo_library
                      </span>
                      {p.images.length} photos
                    </span>
                    {isForSale(p) ? (
                      <span className="nh-gcard__flag nh-gcard__flag--sale">
                        <span className="material-symbols-rounded" aria-hidden="true">
                          sell
                        </span>
                        ${p.price}
                      </span>
                    ) : p.status === "preview" ? (
                      <span className="nh-gcard__flag nh-gcard__flag--prev">
                        <span className="material-symbols-rounded" aria-hidden="true">
                          visibility
                        </span>
                        Preview only
                      </span>
                    ) : (
                      <span className="nh-gcard__flag nh-gcard__flag--work">
                        <span className="material-symbols-rounded" aria-hidden="true">
                          verified
                        </span>
                        Client work
                      </span>
                    )}
                  </div>
                  <div className="nh-gcard__body">
                    <span className="nh-gcard__kind">
                      <span className="material-symbols-rounded" aria-hidden="true">
                        {p.icon}
                      </span>
                      {p.kind}
                    </span>
                    <h2 className="nh-gcard__title">{p.title}</h2>
                    <p className="nh-gcard__desc">{p.def}</p>
                    <div className="nh-gcard__foot">
                      <span className="nh-gcard__rating">
                        <Stars value={p.rating.avg} size={14} />
                        <b>{p.rating.avg.toFixed(1)}</b>
                        <span>({p.rating.count})</span>
                      </span>
                      <span className="nh-gcard__open">
                        Full details
                        <span className="material-symbols-rounded" aria-hidden="true">
                          arrow_outward
                        </span>
                      </span>
                    </div>
                  </div>
                </Link>
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
                    handyman
                  </span>
                  Custom work
                </span>
                <h2 className="nh-cta__title" style={{ marginTop: "20px" }}>
                  Want one of these built for you?
                </h2>
                <p className="nh-cta__sub">
                  The for-sale files are instant. Everything else here started as a
                  brief — send yours and you'll get a plan, a timeline and a fixed
                  price within 24 hours.
                </p>
                <div className="nh-cta__actions">
                  <Link to="/contact" className="nh-btn nh-btn--accent">
                    Start a project
                    <span className="material-symbols-rounded" aria-hidden="true">
                      arrow_outward
                    </span>
                  </Link>
                  <a
                    href={`mailto:${SITE.contact.email}?subject=Question%20about%20a%20gallery%20project`}
                    className="nh-btn nh-btn--outline"
                  >
                    Ask about a project
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
