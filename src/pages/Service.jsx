import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { usePageSEO, breadcrumbJsonLd } from "../seo";
import "../detail.css";

import { listPublishedServices, EXTRAS, FAQS } from "../data/services";
import { SITE } from "../data/site";
import { openRequestPanel } from "../data/requestPanel";
import PageStamp from "../components/PageStamp";

export default function Service() {
  const services = listPublishedServices();
  usePageSEO({
    title:
      "Deep Design Dev: Services — Web Development, Brand Identity, UI/UX, Graphic Design & Motion",
    description:
      "Services from Deep Design Dev: web development from $1,200, brand identity from $480, UI/UX design from $640, graphic design from $180 and motion graphics from $360. Fixed quotes, two revision rounds, source files you own and a reply within 24 hours.",
    keywords:
      "web development services, brand identity designer, ui ux design services, graphic designer for hire, motion graphics designer, freelance web developer, logo design service, landing page design, design agency, deep design dev services",
    path: "/service",
    jsonLd: [
      breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Services", path: "/service" }
      ]),
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Deep Design Dev services",
        itemListElement: services.map((s, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Service",
            name: s.name,
            description: s.intro,
            provider: {
              "@type": "Organization",
              name: "Deep Design Dev",
              url: "https://deep-design.netlify.app/"
            },
            areaServed: "Worldwide",
            url: "https://deep-design.netlify.app/service#" + s.slug
          }
        }))
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a }
        }))
      }
    ]
  });

  return (
    <>
      <Header />
      <main className="nh-main">
        <section className="nh-svch">
          <div className="nh-wrap">
            <div className="nh-phead">
              <div className="nh-phead__copy nh-in">
                <span className="nh-tag">
                  <span className="material-symbols-rounded" aria-hidden="true">
                    design_services
                  </span>
                  Services
                </span>
                <h1 className="nh-h2" style={{ marginTop: "20px" }}>
                  Five services.
                  <br />
                  <em>One person</em> doing all of them.
                </h1>
                <p className="nh-sub">
                  Most studios hand your project to a junior after the pitch. Here the
                  person you talk to is the person who designs it, codes it and ships
                  it — which is why nothing gets lost between the deck and the deploy.
                  Fixed quote first, two revision rounds included, and you own the
                  files on the final invoice.
                </p>
              </div>
              <PageStamp text="Services · Fixed quotes · 24h reply · " icon="design_services" label="Services stamp" />
            </div>
            <div className="nh-svch__actions nh-in" style={{ transitionDelay: ".12s" }}>
              <button type="button" className="nh-btn nh-btn--solid" onClick={openRequestPanel}>
                Get a fixed quote
                <span className="material-symbols-rounded" aria-hidden="true">
                  arrow_outward
                </span>
              </button>
              <Link to="/projects" className="nh-btn nh-btn--ghost">
                <span className="material-symbols-rounded" aria-hidden="true">
                  photo_library
                </span>
                See the work
              </Link>
            </div>
          </div>
        </section>

        <section className="nh-svcs">
          <div className="nh-wrap">
            <div className="nh-svcs__list">
              {services.map((s, i) => (
                <article
                  className="nh-svc nh-in"
                  id={s.slug}
                  key={s.slug}
                  style={{ transitionDelay: Math.min(i * 0.06, 0.3) + "s" }}
                >
                  <div className="nh-svc__aside">
                    <span className="nh-svc__num">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="nh-svc__icon">
                      <span className="material-symbols-rounded" aria-hidden="true">
                        {s.icon}
                      </span>
                    </span>
                  </div>
                  <div className="nh-svc__body">
                    <div className="nh-svc__head">
                      <h2 className="nh-svc__title">{s.name}</h2>
                      <div className="nh-svc__meta">
                        <span className="nh-svc__chip">
                          <span className="material-symbols-rounded" aria-hidden="true">
                            schedule
                          </span>
                          {s.time}
                        </span>
                        <span className="nh-svc__chip nh-svc__chip--price">
                          <span className="material-symbols-rounded" aria-hidden="true">
                            sell
                          </span>
                          {s.price}
                        </span>
                      </div>
                    </div>
                    <p className="nh-svc__intro">{s.intro}</p>
                    <div className="nh-svc__incl">
                      <b>What's included</b>
                      <ul>
                        {s.includes.map((it) => (
                          <li key={it}>
                            <span
                              className="material-symbols-rounded"
                              aria-hidden="true"
                            >
                              check_small
                            </span>
                            {it}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="nh-svc__foot">
<Link to="/projects" className="nh-svc__link">
                        {s.cta}
                        <span className="material-symbols-rounded" aria-hidden="true">
                          arrow_outward
                        </span>
                      </Link>
                      <button
                        type="button"
                        className="nh-svc__link nh-svc__link--quiet"
                        onClick={openRequestPanel}
                      >
Ask about {s.name.toLowerCase()}
                        <span className="material-symbols-rounded" aria-hidden="true">
                          arrow_forward
                        </span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="nh-svcs__extras nh-in">
              <h2 className="nh-h2 nh-svcs__extras-title">
                Also part of the job
              </h2>
              <div className="nh-svcs__extra-grid">
                {EXTRAS.map((e) => (
                  <div className="nh-svcs__extra" key={e.title}>
                    <span className="material-symbols-rounded" aria-hidden="true">
                      {e.icon}
                    </span>
                    <div>
                      <b>{e.title}</b>
                      <p>{e.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="nh-process">
          <div className="nh-wrap">
            <div className="nh-in">
              <span className="nh-tag">
                <span className="material-symbols-rounded" aria-hidden="true">
                  route
                </span>
                How I work
              </span>
              <h2 className="nh-h2" style={{ marginTop: "20px" }}>
                Four steps,
                <br />
                <em>no surprises</em>
              </h2>
              <p className="nh-sub">
                Every project runs the same loop. You always know which step we're
                on, what you owe me, and what I owe you next.
              </p>
            </div>
            <div className="nh-steps nh-in" style={{ transitionDelay: ".1s" }}>
              <article className="nh-step">
                <span className="nh-step__num">01</span>
                <h3 className="nh-step__title">Discover</h3>
                <p className="nh-step__desc">
                  We talk about the goal, the audience and the deadline. I research
                  your competitors and look for the thing they're all doing the same.
                </p>
                <span className="nh-step__get">
                  <span className="material-symbols-rounded" aria-hidden="true">
                    task_alt
                  </span>
                  Scope + fixed quote
                </span>
              </article>
              <article className="nh-step">
                <span className="nh-step__num">02</span>
                <h3 className="nh-step__title">Design</h3>
                <p className="nh-step__desc">
                  Wireframes first, then the visual direction. Two rounds of
                  revisions are included and I show you the thinking, not just the
                  pretty picture.
                </p>
                <span className="nh-step__get">
                  <span className="material-symbols-rounded" aria-hidden="true">
                    task_alt
                  </span>
                  Clickable prototype
                </span>
              </article>
              <article className="nh-step">
                <span className="nh-step__num">03</span>
                <h3 className="nh-step__title">Build</h3>
                <p className="nh-step__desc">
                  I write the code, test it on real phones and real browsers, and
                  check it works for keyboard and screen-reader users too.
                </p>
                <span className="nh-step__get">
                  <span className="material-symbols-rounded" aria-hidden="true">
                    task_alt
                  </span>
                  Staging link to review
                </span>
              </article>
              <article className="nh-step">
                <span className="nh-step__num">04</span>
                <h3 className="nh-step__title">Launch &amp; hand over</h3>
                <p className="nh-step__desc">
                  Deploy, walk you through everything, and hand over editable source
                  plus a written guide. Thirty days of aftercare is included, no
                  retainer required.
                </p>
                <span className="nh-step__get">
                  <span className="material-symbols-rounded" aria-hidden="true">
                    task_alt
                  </span>
                  Files you actually own
                </span>
              </article>
            </div>
            <div className="nh-process__promise nh-in" style={{ transitionDelay: ".16s" }}>
              <div className="nh-promise">
                <b>
                  <span className="material-symbols-rounded" aria-hidden="true">
                    edit_note
                  </span>
                  Fixed quote first
                </b>
                <span>
                  You get a number before you commit to anything. It doesn't move
                  unless you change the scope.
                </span>
              </div>
              <div className="nh-promise">
                <b>
                  <span className="material-symbols-rounded" aria-hidden="true">
                    visibility
                  </span>
                  Work in the open
                </b>
                <span>
                  A staging link from day three. No black boxes, no "trust me, it's
                  nearly done".
                </span>
              </div>
              <div className="nh-promise">
                <b>
                  <span className="material-symbols-rounded" aria-hidden="true">
                    verified_user
                  </span>
                  You own everything
                </b>
                <span>
                  Source files, editable artwork and logins are yours on the final
                  invoice. No hostage situations.
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="nh-faq">
          <div className="nh-wrap">
            <div className="nh-in">
              <span className="nh-tag">
                <span className="material-symbols-rounded" aria-hidden="true">
                  help
                </span>
                Questions
              </span>
              <h2 className="nh-h2" style={{ marginTop: "20px" }}>
                Before you
                <br />
                <em>send a brief</em>
              </h2>
            </div>
            <div className="nh-faq__list nh-in" style={{ transitionDelay: ".1s" }}>
              {FAQS.map((f, i) => (
                <details className="nh-faq__item" key={f.q} open={i === 0}>
                  <summary className="nh-faq__q">
                    <span className="nh-faq__n">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="nh-faq__label">{f.q}</span>
                    <span className="nh-faq__sign" aria-hidden="true">
                      <span className="material-symbols-rounded">add</span>
                    </span>
                  </summary>
                  <div className="nh-faq__a">{f.a}</div>
                </details>
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
                  Tell me what you're building
                </h2>
                <p className="nh-cta__sub">
                  Send the goal, the audience and the deadline. You'll get a plan, a
                  timeline and a fixed price back within 24 hours — no discovery fee,
                  no obligation.
                </p>
<div className="nh-cta__actions">
                  <button type="button" className="nh-btn nh-btn--accent" onClick={openRequestPanel}>
                    Start a project
                    <span className="material-symbols-rounded" aria-hidden="true">
                      arrow_outward
                    </span>
                  </button>
                  <a
                    href={`mailto:${SITE.contact.email}?subject=Question%20about%20a%20service`}
                    className="nh-btn nh-btn--outline"
                  >
                    Ask a question first
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
