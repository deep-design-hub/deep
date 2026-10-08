import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Stars } from "../components/Stars";
import PageStamp from "../components/PageStamp";
import { listPublished, isForSale } from "../data/projects";
import { usePageSEO, breadcrumbJsonLd } from "../seo";
import "../detail.css";

export default function Portfolio() {
  usePageSEO({
    title: "Deep Design Hubs: Portfolio — websites, apps, branding & design projects",
    description:
      "The Deep Design Hubs portfolio: every website, web app, brand identity and graphic design project delivered by Abubakar Musa — outcomes, tools, client ratings and full case studies. Some builds are packaged for sale with instant download.",
    keywords:
      "deep design hubs portfolio, web development projects, graphic design work, ui ux portfolio, brand identity portfolio, freelance designer pakistan, abubakar musa",
    path: "/portfolio",
    jsonLd: [
      breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Portfolio", path: "/portfolio" }
      ]),
      {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        name: "Deep Design Hubs Portfolio",
        description: "Selected client and product work by Abubakar Musa, designer and developer.",
        url: "https://deep-design.netlify.app/portfolio",
        mainEntity: {
          "@type": "Person",
          name: "Abubakar Musa",
          jobTitle: "Designer & Developer",
          worksFor: { "@type": "Organization", name: "Deep Design Hubs" }
        }
      }
    ]
  });

  return (
    <>
      <Header />
      <main className="nh-main">
        <section className="nh-pf">
          <div className="nh-wrap">
            <div className="nh-phead">
              <div className="nh-phead__copy nh-pf__head nh-in">
                <span className="nh-tag">
                  <span className="material-symbols-rounded" aria-hidden="true">
                    dashboard
                  </span>
                  Portfolio
                </span>
                <h1 className="nh-h2" style={{ marginTop: "20px" }}>
                  Projects with
                  <br />
                  <em>receipts attached</em>
                </h1>
                <p className="nh-sub">
                  Every project below shipped — with the brief, the outcome and what
                  clients said afterwards. Open one for the full case study, all the
                  images, the rating and the reviews.
                </p>
              </div>
              <PageStamp text="Portfolio · Shipped work · Case studies · " icon="dashboard" label="Portfolio stamp" />
            </div>

            <div className="nh-gal__grid nh-pf__grid">
              {listPublished().map((p, i) => (
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
                        calendar_month
                      </span>
                      {p.year}
                    </span>
                    {isForSale(p) ? (
                      <span className="nh-gcard__flag nh-gcard__flag--sale">
                        <span className="material-symbols-rounded" aria-hidden="true">
                          sell
                        </span>
                        ${p.price}
                      </span>
                    ) : (
                      <span className="nh-gcard__flag nh-gcard__flag--work">
                        <span className="material-symbols-rounded" aria-hidden="true">
                          verified
                        </span>
                        {p.status === "preview" ? "Preview" : "Client work"}
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
                    <p className="nh-gcard__desc">
                      <b style={{ color: "#0a0a0a" }}>Outcome:</b> {p.outcome}. {p.def}
                    </p>
                    <div className="nh-gcard__foot">
                      <span className="nh-gcard__rating">
                        <Stars value={p.rating.avg} size={14} />
                        <b>{p.rating.avg.toFixed(1)}</b>
                        <span>({p.rating.count})</span>
                      </span>
                      <span className="nh-gcard__open">
                        Case study
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
                  Your project
                </span>
                <h2 className="nh-cta__title" style={{ marginTop: "20px" }}>
                  Your project could be the next case study.
                </h2>
                <p className="nh-cta__sub">
                  Send the brief today and you'll get a plan, a timeline and a fixed
                  price within 24 hours — before any money moves.
                </p>
                <div className="nh-cta__actions">
                  <Link to="/contact" className="nh-btn nh-btn--accent">
                    Start a project
                    <span className="material-symbols-rounded" aria-hidden="true">
                      arrow_outward
                    </span>
                  </Link>
                  <Link to="/gallery" className="nh-btn nh-btn--outline">
                    Browse the gallery
                  </Link>
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
