import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { usePageSEO, breadcrumbJsonLd } from "../seo";
import "../detail.css";

import { BELIEFS, JOURNEY, TOOLS } from "../data/about";
import { SITE } from "../data/site";
import { openRequestPanel } from "../data/requestPanel";


export default function About() {
  usePageSEO({
    title:
      "Deep Design Dev: About — Abubakar Musa, designer & developer",
    description:
      "Abubakar Musa is the designer and developer behind Deep Design Dev — a one-person studio for web development, brand identity, UI/UX, graphic design and motion. 120+ projects shipped, 40+ happy clients, remote worldwide, every message answered within 24 hours.",
    keywords:
      "Abubakar Musa, Deep Design Dev about, freelance designer and developer, one person design studio, web developer projects, graphic designer profile, ui ux designer, remote designer pakistan, about deep design dev",
    path: "/about",
    image: "/assets/imgs/logo/meta.png",
    jsonLd: [
      breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "About", path: "/about" }
      ]),
      {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        name: "About Deep Design Dev — Abubakar Musa",
        url: "https://deep-design.netlify.app/about",
        mainEntity: {
          "@type": "Person",
          name: "Abubakar Musa",
          jobTitle: "Designer & Developer",
          worksFor: {
            "@type": "Organization",
            name: "Deep Design Dev",
            url: "https://deep-design.netlify.app/"
          },
          email: SITE.contact.email,
          knowsAbout: [
            "Web Development",
            "Graphic Design",
            "UI/UX Design",
            "Brand Identity",
            "Motion Graphics"
          ]
        }
      }
    ]
  });

  return (
    <>
      <Header />
      <main className="nh-main">
        <section className="nh-abt">
          <div className="nh-wrap">
            <div className="nh-abt__grid">
              <div className="nh-abt__copy nh-in">
                <span className="nh-tag">
                  <span className="material-symbols-rounded" aria-hidden="true">
                    person
                  </span>
                  About
                </span>
                <h1 className="nh-h2" style={{ marginTop: "20px" }}>
                  Hi, I'm Abubakar —
                  <br />
                  <em>the whole studio</em>
                </h1>
                <p className="nh-sub">
                  Deep Design Dev is my one-person studio. I design identities,
                  build websites and package digital products — and the person you
                  brief is the person who does the work.
                </p>
<div className="nh-abt__actions">
                  <button type="button" className="nh-btn nh-btn--solid" onClick={openRequestPanel}>
                    Work with me
                    <span className="material-symbols-rounded" aria-hidden="true">
                      arrow_outward
                    </span>
                  </button>
                  <Link to="/gallery" className="nh-btn nh-btn--ghost">
                    <span className="material-symbols-rounded" aria-hidden="true">
                      photo_library
                    </span>
                    See the work
                  </Link>
                </div>
              </div>
              <figure
                className="nh-abt__portrait nh-in"
                style={{ transitionDelay: ".12s" }}
              >
                <img
                  src="/assets/imgs/photo/me 1.jpg"
                  alt="Abubakar Musa, designer and developer at Deep Design Dev"
                  loading="eager"
                />
                <figcaption>
                  <b>Abubakar Musa</b>
                  <span>Designer &amp; developer — Deep Design Dev</span>
                </figcaption>
              </figure>
            </div>

            <div className="nh-abt__stats nh-in">
              <div className="nh-abt__stat">
                <b>120+</b>
                <span>Projects shipped</span>
              </div>
              <div className="nh-abt__stat">
                <b>40+</b>
                <span>Happy clients</span>
              </div>
              <div className="nh-abt__stat">
                <b>5</b>
                <span>Services, one person</span>
              </div>
              <div className="nh-abt__stat">
                <b>24h</b>
                <span>Average reply time</span>
              </div>
            </div>
          </div>
        </section>

        <section className="nh-abt__story">
          <div className="nh-wrap">
            <div className="nh-abt__story-grid">
              <div className="nh-in">
                <span className="nh-tag">
                  <span className="material-symbols-rounded" aria-hidden="true">
                    auto_stories
                  </span>
                  The short version
                </span>
                <h2 className="nh-h2" style={{ marginTop: "20px" }}>
                  One person,
                  <br />
                  <em>end to end</em>
                </h2>
              </div>
              <div
                className="nh-abt__prose nh-in"
                style={{ transitionDelay: ".1s" }}
              >
                <p>
                  Most agencies split your project across three people: the one who
                  sells it, the one who designs it and the one who builds it. Each
                  handoff loses a little of the original idea, and by the time it
                  ships nobody can tell you why it looks the way it does.
                </p>
                <p>
                  Deep Design Dev doesn't work that way. I take the brief, research
                  the market, draw the interface, write the code and hand you the
                  finished thing with the source files and a guide explaining how it
                  fits together. When something is wrong, one person fixes it —
                  there is no ticket queue between you and the answer.
                </p>
                <p>
                  That also means the studio can stay honest about scope. There's no
                  account manager to protect, no bench to fill, no reason to pad a
                  quote. You get a fixed price, a real timeline and work I'm willing
                  to put my name on — which is literally what you're looking at.
                </p>
                <p>
                  I work remotely with clients across Europe, Africa, the Gulf and
                  the US, reply to every message within 24 hours, and keep thirty
                  days of aftercare on every project. If a template in the{" "}
                  <Link to="/gallery" className="nh-lnk">
                    gallery
                  </Link>{" "}
                  already solves your problem, I'll tell you that too — it's cheaper
                  for you and better for everyone.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="nh-abt__beliefs">
          <div className="nh-wrap">
            <span className="nh-tag nh-in">
              <span className="material-symbols-rounded" aria-hidden="true">
                verified
              </span>
              How I work
            </span>
            <h2 className="nh-h2 nh-in" style={{ marginTop: "20px", transitionDelay: ".06s" }}>
              Four rules I
              <br />
              <em>don't bend</em>
            </h2>
            <div className="nh-abt__belief-grid">
              {BELIEFS.map((b, i) => (
                <article
                  className="nh-abt__belief nh-in"
                  key={b.title}
                  style={{ transitionDelay: (0.12 + i * 0.07) + "s" }}
                >
                  <span className="nh-abt__belief-icon">
                    <span className="material-symbols-rounded" aria-hidden="true">
                      {b.icon}
                    </span>
                  </span>
                  <h3>{b.title}</h3>
                  <p>{b.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="nh-abt__journey">
          <div className="nh-wrap">
            <span className="nh-tag nh-in">
              <span className="material-symbols-rounded" aria-hidden="true">
                route
              </span>
              The journey
            </span>
            <h2 className="nh-h2 nh-in" style={{ marginTop: "20px", transitionDelay: ".06s" }}>
              How the studio
              <br />
              <em>got here</em>
            </h2>
            <div className="nh-abt__timeline">
              {JOURNEY.map((j, i) => (
                <article
                  className="nh-abt__tl nh-in"
                  key={j.year}
                  style={{ transitionDelay: (0.1 + i * 0.06) + "s" }}
                >
                  <span className="nh-abt__tl-year">{j.year}</span>
                  <div>
                    <h3>{j.title}</h3>
                    <p>{j.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="nh-abt__tools">
          <div className="nh-wrap">
            <div className="nh-abt__tools-head nh-in">
              <span className="nh-tag">
                <span className="material-symbols-rounded" aria-hidden="true">
                  build
                </span>
                Toolkit
              </span>
              <h2 className="nh-h2" style={{ marginTop: "20px" }}>
                Tools I
                <br />
                <em>use daily</em>
              </h2>
              <p className="nh-sub">
                Design in Figma and Adobe, build with plain, boring, fast
                technology. The stack is chosen for the project — not for the
                résumé.
              </p>
            </div>
            <div
              className="nh-abt__tool-list nh-in"
              style={{ transitionDelay: ".1s" }}
            >
              {TOOLS.map((t) => (
                <span className="nh-abt__tool" key={t}>
                  {t}
                </span>
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
                    forum
                  </span>
                  Say hello
                </span>
                <h2 className="nh-cta__title" style={{ marginTop: "20px" }}>
                  Let's see if we're a fit
                </h2>
                <p className="nh-cta__sub">
                  Tell me what you're building and when you need it. Every message
                  gets a real reply within 24 hours — including the ones that should
                  buy a template instead.
                </p>
<div className="nh-cta__actions">
                  <button type="button" className="nh-btn nh-btn--accent" onClick={openRequestPanel}>
                    Send a brief
                    <span className="material-symbols-rounded" aria-hidden="true">
                      arrow_outward
                    </span>
                  </button>
                  <a
                    href={`mailto:${SITE.contact.email}`}
                    className="nh-btn nh-btn--outline"
                  >
                    {SITE.contact.email}
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
