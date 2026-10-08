import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import mountHomeRuntime from "../homeRuntime.js";
import { usePageSEO } from "../seo";

import { PROGRAMS } from "../data/programs";
import { SITE } from "../data/site";
import {
  PROOF, HERO_META, MARQUEE, ABOUT_ROWS, STATS,
  BENTO_FEATURE, BENTO_CARDS, BENTO_STRIPS,
  PROCESS, PROMISES, STUDIO_SHOTS, STORY, TOOLKIT,
  INDUSTRIES, TESTIMONIALS, PLANS, shopItems,
  FAQ_HOME, SLOTS, PERKS
} from "../data/home";



export default function Home() {
  useEffect(() => mountHomeRuntime(), []);

  usePageSEO({
    title:
      "Deep Design Hubs: Home — Web Development, Graphic Design, UI/UX & Branding by Abubakar Musa",
    description:
      "Deep Design Hubs is the studio of Abubakar Musa — web development, graphic design, UI/UX design, brand identity and motion graphics for businesses worldwide. See services, real projects with full case studies, prices from $480, a design gallery with reviews, and a contact form that gets a reply within 24 hours.",
    keywords:
      "Deep Design Hubs, Abubakar Musa, web development, graphic design, UI/UX design, brand identity, motion graphics, freelance web developer, freelance graphic designer, logo design, dashboard design, ecommerce website, landing page design, portfolio website, design studio, brand guidelines, packaging design, design templates for sale",
    path: "/"
  });
  return (
    <>
      <Header />
      <section className="nh-hero" id="hero">
          <div className="nh-hero__grid" aria-hidden="true"></div>
          <div className="nh-hero__glow nh-hero__glow--a" aria-hidden="true"></div>
          <div className="nh-hero__glow nh-hero__glow--b" aria-hidden="true"></div>
          <div className="nh-hero__noise" aria-hidden="true"></div>
          <div className="nh-hero__inner">
              <div className="nh-hero__copy">
                  <span className="nh-eyebrow">
                      <span className="nh-eyebrow__dot" aria-hidden="true"></span>
                      Independent designer &amp; developer
                  </span>
                  <h1 className="nh-hero__title">
                      <span className="nh-line" data-split>Hi, I'm Abubakar</span>
                      <span className="nh-line" data-split>I make brands <em>live</em></span>
                  </h1>
                  <p className="nh-hero__lead">
                      This is my one-person studio. I design identities, build websites and
                      package digital products — and some of them you can take home and keep.
                  </p>
                  <div className="nh-actions">
                      <a href="#shop" className="nh-btn nh-btn--solid">
                          Browse the shop
                          <span className="material-symbols-rounded" aria-hidden="true">arrow_outward</span>
                      </a>
                      <a href="#about" className="nh-btn nh-btn--ghost">
                          <span className="material-symbols-rounded" aria-hidden="true">person</span>
                          More about me
                      </a>
                  </div>
                  <div className="nh-proof">
                      {PROOF.map((p) => (
                          <div className="nh-proof__item" key={p.label}>
                              <span className="nh-proof__value" {...(p.count != null ? { "data-count": p.count, "data-suffix": p.suffix } : {})}>{p.value || "0"}</span>
                              <span className="nh-proof__label">{p.label}</span>
                          </div>
                      ))}
                  </div>
              </div>
              <div className="nh-portrait">
                  <span className="nh-portrait__outline" aria-hidden="true"></span>
                  <figure className="nh-portrait__frame">
                      <img src="/assets/imgs/photo/me 3.jpg" alt="Portrait of Abubakar Musa, designer at Deep Design Hubs" loading="eager" decoding="async" id="nhHeroImg" />
                      <figcaption className="nh-portrait__label">
                          <span>
                              <span className="nh-portrait__name">Abubakar Musa</span><br />
                              <span className="nh-portrait__role">Founder, Deep Design Hubs</span>
                          </span>
                      </figcaption>
                  </figure>
                  <div className="nh-spin" aria-hidden="true">
                      <svg className="nh-spin__svg" viewBox="0 0 108 108">
                          <defs><path id="nhSpinPath" d="M54,54 m-40,0 a40,40 0 1,1 80,0 a40,40 0 1,1 -80,0"></path></defs>
                          <text className="nh-spin__text"><textPath href="#nhSpinPath" startOffset="0">Available for work · Design · Code · </textPath></text>
                      </svg>
                      <span className="nh-spin__core"><span className="material-symbols-rounded">auto_awesome</span></span>
                  </div>
                  <div className="nh-portrait__chip">
                      <span className="nh-portrait__chip-icon" aria-hidden="true">
                          <span className="material-symbols-rounded">bolt</span>
                      </span>
                      <span className="nh-portrait__chip-text">
                          <span className="nh-portrait__chip-title">Concept in 48 hours</span>
                          <span className="nh-portrait__chip-sub">Remote, worldwide</span>
                      </span>
                  </div>
              </div>
          </div>
          <div className="nh-hero__foot">
              <span className="nh-scroll">
                  <span className="nh-scroll__mouse" aria-hidden="true"></span>
                  Scroll to explore
              </span>
              <span className="nh-hero__meta">
                  {HERO_META.map((m) => (
                      <span key={m.text}><span className="material-symbols-rounded" aria-hidden="true">{m.icon}</span>{m.text}</span>
                  ))}
              </span>
          </div>
      </section>
      <section className="nh-marquee" aria-label="What I do">
          <div className="nh-marquee__track" id="nhMarquee">
              <div className="nh-marquee__group">
                  {MARQUEE.map((m) => (
                      <span className="nh-marquee__item" key={m.text}><span className="material-symbols-rounded" aria-hidden="true">{m.icon}</span>{m.text}</span>
                  ))}
              </div>
          </div>
      </section>
      <section className="nh-about" id="about">
          <div className="nh-wrap">
              <div className="nh-about__grid">
                  <div className="nh-about__media nh-in">
                      <div className="nh-about__img">
                          <img src="/assets/imgs/photo/me on laptop.jpg" alt="Abubakar designing a website on a laptop" loading="lazy" decoding="async" />
                      </div>
                      <blockquote className="nh-about__quote">
                          <p>“Good design is invisible until it isn't working.”</p>
                          <span>— Abubakar Musa</span>
                      </blockquote>
                  </div>
                  <div className="nh-in" style={{ transitionDelay: '.1s' }}>
                      <span className="nh-tag"><span className="material-symbols-rounded" aria-hidden="true">person</span>About me</span>
                      <h2 className="nh-h2" style={{ marginTop: '20px' }}>One studio.<br /><em>Every stage</em> of the build.</h2>
                      <p className="nh-sub">
                          I'm Abubakar — the designer, the developer and the person you email.
                          I started Deep Design Hubs so clients get one point of contact from the
                          first sketch to the final deploy, with nothing lost in a handover.
                      </p>
                      <ul className="nh-about__list">
                          {ABOUT_ROWS.map((r) => (
                              <li className="nh-about__row" key={r.title}>
                                  <span className="nh-about__row-icon"><span className="material-symbols-rounded" aria-hidden="true">{r.icon}</span></span>
                                  <span>
                                      <h3>{r.title}</h3>
                                      <p>{r.text}</p>
                                  </span>
                              </li>
                          ))}
                      </ul>
                  </div>
              </div>
              <div className="nh-stats">
                  {STATS.map((s, i) => (
                      <article className="nh-stat nh-in" key={s.label} style={{ transitionDelay: (i * 0.08) + "s" }}>
                          <div className="nh-stat__value"><span data-count={s.count}>0</span><sup>{s.sup}</sup></div>
                          <p className="nh-stat__label">{s.label}</p>
                      </article>
                  ))}
              </div>
          </div>
      </section>
      <section className="nh-services" id="services">
          <div className="nh-wrap">
              <div className="nh-services__panel">
                  <div className="nh-in">
                      <span className="nh-tag nh-tag--dark"><span className="material-symbols-rounded" aria-hidden="true">design_services</span>What I do</span>
                      <h2 className="nh-h2" style={{ marginTop: '20px' }}>Five services.<br /><em>One person</em> doing all of them.</h2>
                      <p className="nh-sub">
                          Most studios hand your project to a junior after the pitch. Here the person
                          you talk to is the person who designs it, codes it and ships it — which is
                          why nothing gets lost between the deck and the deploy.
                      </p>
                  </div>
                  <div className="nh-bento">
                      <article className="nh-bento__card nh-bento__card--feature nh-in">
                          <span className="nh-bento__icon"><span className="material-symbols-rounded" aria-hidden="true">{BENTO_FEATURE.icon}</span></span>
                          <h3 className="nh-bento__title">{BENTO_FEATURE.title}</h3>
                          <p className="nh-bento__desc">{BENTO_FEATURE.desc}</p>
                          <div className="nh-code" aria-hidden="true">
                              <div className="nh-code__bar">
                                  <span className="nh-code__dot"></span>
                                  <span className="nh-code__dot"></span>
                                  <span className="nh-code__dot"></span>
                                  <span className="nh-code__file">deploy.js</span>
                              </div>
                              <div className="nh-code__body">
      <span><span className="nh-code__c">// what you actually get shipped</span></span>
      <span><span className="nh-code__k">const</span> build = <span className="nh-code__k">await</span> ship({'{'}</span>
      <span>  stack:   <span className="nh-code__s">'html + css + js'</span>,</span>
      <span>  builder: <span className="nh-code__s">'page-builder'</span>,</span>
      <span>  plugins: <span className="nh-code__s">0</span>,</span>
      <span>  lighthouse: <span className="nh-code__p">98</span>,</span>
      <span>  handover: <span className="nh-code__s">'source files + docs'</span>,</span>
      <span>  reply:    <span className="nh-code__p">'24h'</span></span>
      <span>{'}'});<span className="nh-code__caret"></span></span>
                              </div>
                          </div>
                          <div className="nh-bento__chips">
                              {BENTO_FEATURE.chips.map((c) => <span className="nh-bento__chip" key={c}>{c}</span>)}
                          </div>
                          <div className="nh-bento__foot">
                              <span className="nh-bento__time">
                                  <span className="material-symbols-rounded" aria-hidden="true">schedule</span>{BENTO_FEATURE.time}
                              </span>
                              <Link to={BENTO_FEATURE.link.to} data-nav className="nh-bento__link">
                                  {BENTO_FEATURE.link.label}
                                  <span className="material-symbols-rounded" aria-hidden="true">arrow_outward</span>
                              </Link>
                          </div>
                      </article>
                      {BENTO_CARDS.map((c, i) => (
                          <article className="nh-bento__card nh-in" key={c.title} style={{ transitionDelay: (i % 2 ? '.12s' : '.06s') }}>
                              <span className="nh-bento__icon"><span className="material-symbols-rounded" aria-hidden="true">{c.icon}</span></span>
                              <h3 className="nh-bento__title">{c.title}</h3>
                              <p className="nh-bento__desc">{c.desc}</p>
                              <div className="nh-bento__foot">
                                  <span className="nh-bento__time"><span className="material-symbols-rounded" aria-hidden="true">schedule</span>{c.time}</span>
                              </div>
                          </article>
                      ))}
                      <article className="nh-bento__card nh-bento__card--strip nh-in" style={{ transitionDelay: '.18s' }}>
                          {BENTO_STRIPS.map((s) => (
                              <div className="nh-bento__strip" key={s.title}>
                                  <span className="material-symbols-rounded" aria-hidden="true">{s.icon}</span>
                                  <div>
                                      <b>{s.title}</b>
                                      <span>{s.text}</span>
                                  </div>
                              </div>
                          ))}
                      </article>
                  </div>
              </div>
          </div>
      </section>
      <section className="nh-process" id="process">
          <div className="nh-wrap">
              <div className="nh-in">
                  <span className="nh-tag"><span className="material-symbols-rounded" aria-hidden="true">route</span>How I work</span>
                  <h2 className="nh-h2" style={{ marginTop: '20px' }}>Four steps,<br /><em>no surprises</em></h2>
                  <p className="nh-sub">
                      Every project runs the same loop. You always know which step we're on, what
                      you owe me, and what I owe you next.
                  </p>
              </div>
              <div className="nh-steps nh-in">
                  {PROCESS.map((s) => (
                      <article className="nh-step" key={s.num}>
                          <span className="nh-step__num">{s.num}</span>
                          <h3 className="nh-step__title">{s.title}</h3>
                          <p className="nh-step__desc">{s.text}</p>
                          <span className="nh-step__get"><span className="material-symbols-rounded" aria-hidden="true">task_alt</span>{s.gets}</span>
                      </article>
                  ))}
              </div>
              <div className="nh-process__promise">
                  {PROMISES.map((p, i) => (
                      <div className="nh-promise nh-in" key={p.title} style={{ transitionDelay: (i * 0.08) + "s" }}>
                          <b><span className="material-symbols-rounded" aria-hidden="true">{p.icon}</span>{p.title}</b>
                          <span>{p.text}</span>
                      </div>
                  ))}
              </div>
          </div>
      </section>
      <section className="nh-work" id="work">
          <div className="nh-wrap">
              <div className="nh-work__head nh-in">
                  <div>
                      <span className="nh-tag"><span className="material-symbols-rounded" aria-hidden="true">photo_library</span>Selected work</span>
                      <h2 className="nh-h2" style={{ marginTop: '20px' }}>Things I've<br /><em>built and shipped</em></h2>
                  </div>
                  <Link to="/portfolio" className="nh-btn nh-btn--ghost" data-nav>
                      All projects
                      <span className="material-symbols-rounded" aria-hidden="true">arrow_outward</span>
                  </Link>
              </div>
              <div className="nh-programs">
                  {PROGRAMS.map((p, i) => (
                      <article className={"nh-program nh-in" + (i % 2 ? " nh-program--flip" : "")} key={p.id} style={{ transitionDelay: (i * 0.05) + "s" }}>
                          <div className="nh-program__media">
                              <figure className="nh-program__hero" data-viewer data-src={p.images[0]} data-title={p.title} data-meta={p.covered}>
                                  <img src={p.images[0]} alt={p.alt} loading="lazy" decoding="async" draggable="false" data-protect />
                                  <figcaption className="nh-program__herocap">
                                      <span className="material-symbols-rounded" aria-hidden="true">{p.icon}</span>
                                      {p.heroCaption}
                                  </figcaption>
                              </figure>
                              {p.images.length > 1 && (
                                  <div className="nh-program__strip">
                                      {p.images.slice(1).map((src, n) => (
                                          <figure className="nh-program__shot" key={src} data-viewer data-src={src} data-title={p.title} data-meta={p.shots[n]}>
                                              <img src={src} alt={p.title + " additional shot " + (n + 2)} loading="lazy" decoding="async" draggable="false" data-protect />
                                              <figcaption>{p.shots[n]}</figcaption>
                                          </figure>
                                      ))}
                                  </div>
                              )}
                              <span className="nh-program__index" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                          </div>
                          <div className="nh-program__body">
                              <span className="nh-tag"><span className="material-symbols-rounded" aria-hidden="true">{p.icon}</span>{p.kind}</span>
                              <h3 className="nh-program__title">{p.title}</h3>
                              <p className="nh-program__def">{p.def}</p>
                              <p className="nh-program__covered"><b>Covered:</b> {p.covered}</p>
                              <ul className="nh-program__scope">
                                  {p.scope.map((item) => <li key={item}>{item}</li>)}
                              </ul>
                              <dl className="nh-program__facts">
                                  <div><dt>Role</dt><dd>{p.role}</dd></div>
                                  <div><dt>Year</dt><dd>{p.year}</dd></div>
                                  <div><dt>Outcome</dt><dd>{p.outcome}</dd></div>
                              </dl>
                              <Link to={`/project/${p.id}`} className="nh-btn nh-btn--ghost nh-program__btn">
                                  Open case study
                                  <span className="material-symbols-rounded" aria-hidden="true">arrow_outward</span>
                              </Link>
                          </div>
                      </article>
                  ))}
              </div>
          </div>
      </section>
      <section className="nh-studio" id="studio">
          <div className="nh-wrap">
              <div className="nh-in" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '30px', flexWrap: 'wrap' }}>
                  <div>
                      <span className="nh-tag"><span className="material-symbols-rounded" aria-hidden="true">photo_camera</span>Inside the studio</span>
                      <h2 className="nh-h2" style={{ marginTop: '20px' }}>The desk,<br /><em>not just the deliverables</em></h2>
                      <p className="nh-sub">
                          Five frames from the desk. Tap any shot to see it full size.
                      </p>
                  </div>
                  <Link to="/gallery" data-nav className="nh-btn nh-btn--ghost">
                      Full gallery
                      <span className="material-symbols-rounded" aria-hidden="true">arrow_outward</span>
                  </Link>
              </div>
              <div className="nh-studio__grid">
                  {STUDIO_SHOTS.map((s, i) => (
                      <figure className="nh-shot nh-in" key={s.src} style={i % 3 ? { transitionDelay: (i % 3) * 0.05 + "s" } : undefined} data-viewer data-src={s.src} data-title={s.title} data-meta={s.meta}>
                          <div className="nh-shot__img">
                              <img src={s.src} alt={s.alt} loading="lazy" decoding="async" draggable="false" data-protect />
                          </div>
                          <span className="nh-shot__badge"><span className="material-symbols-rounded" aria-hidden="true">{s.badge.icon}</span>{s.badge.text}</span>
                          <figcaption className="nh-shot__cap">
                              <b>{s.title}</b>
                              <span>{s.meta}</span>
                          </figcaption>
                      </figure>
                  ))}
              </div>
          </div>
      </section>
      <section className="nh-journey" id="journey">
          <div className="nh-wrap">
              <div className="nh-in">
                  <span className="nh-tag"><span className="material-symbols-rounded" aria-hidden="true">timeline</span>My route</span>
                  <h2 className="nh-h2" style={{ marginTop: '20px' }}>From one logo<br /><em>to a whole studio</em></h2>
                  <p className="nh-sub">
                      No design-school prestige and no agency bench. I learned by shipping, made
                      plenty of mistakes, and kept the parts of it that actually worked.
                  </p>
              </div>
              <div className="nh-jline">
                  {STORY.map((j) => (
                      <article className={"nh-jitem nh-in" + (j.now ? " nh-jitem--now" : "")} key={j.year}>
                          <span className="nh-jitem__dot" aria-hidden="true"></span>
                          <div className="nh-jitem__card">
                              <span className="nh-jitem__year"><span className="material-symbols-rounded" aria-hidden="true">{j.yearIcon}</span>{j.year}</span>
                              <h3 className="nh-jitem__title">{j.title}</h3>
                              <p className="nh-jitem__text">{j.text}</p>
                              <div className="nh-jitem__tags">{j.tags.map((t) => <span key={t}>{t}</span>)}</div>
                          </div>
                      </article>
                  ))}
              </div>
          </div>
      </section>
      <section className="nh-stack" id="toolkit">
          <div className="nh-wrap">
              <div className="nh-in">
                  <span className="nh-tag"><span className="material-symbols-rounded" aria-hidden="true">construction</span>Toolkit</span>
                  <h2 className="nh-h2" style={{ marginTop: '20px' }}>What I actually<br /><em>open every day</em></h2>
                  <p className="nh-sub">
                      No "full capabilities" list — this is the actual bench. If a tool isn't here,
                      I don't pretend to know it.
                  </p>
              </div>
              <div className="nh-stack__grid">
                  {TOOLKIT.map((g, i) => (
                      <div className="nh-stack__card nh-in" key={g.title} style={i ? { transitionDelay: (i * 0.08) + "s" } : undefined}>
                          <div className="nh-stack__head">
                              <span className="material-symbols-rounded" aria-hidden="true">{g.icon}</span>
                              <h3>{g.title}</h3>
                          </div>
                          <div className="nh-stack__list">
                              {g.rows.map((r) => (
                                  <div className="nh-stack__row" key={r.tool}>{r.tool} <span className="nh-stack__dots"></span> <b>{r.note}</b></div>
                              ))}
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>
      <section className="nh-words" id="words">
          <div className="nh-wrap">
              <div className="nh-in">
                  <span className="nh-tag"><span className="material-symbols-rounded" aria-hidden="true">forum</span>Client words</span>
                  <h2 className="nh-h2" style={{ marginTop: '20px' }}>What it's like<br /><em>to work with me</em></h2>
              </div>
              <div className="nh-trust nh-in" aria-label="Industries worked in">
                  <div className="nh-trust__track" id="nhTrust">
                      <div className="nh-trust__group">
                          {INDUSTRIES.map((ind) => <span className="nh-trust__item" key={ind}>{ind}</span>)}
                      </div>
                  </div>
              </div>
              <div className="nh-quotes">
                  {TESTIMONIALS.map((t, i) => (
                      <article className="nh-quote nh-in" key={t.name} style={i ? { transitionDelay: (i * 0.08) + "s" } : undefined}>
                          <span className="nh-quote__mark" aria-hidden="true">format_quote</span>
                          <div className="nh-quote__stars" role="img" aria-label={`Rated ${t.stars} out of 5`}>
                              {Array.from({ length: t.stars }).map((_, n) => <span className="material-symbols-rounded" key={n}>star</span>)}
                          </div>
                          <p className="nh-quote__text">{t.text}</p>
                          <div className="nh-quote__who">
                              <span className="nh-quote__av">{t.initials}</span>
                              <span>
                                  <b>{t.name}</b>
                                  <span>{t.role}</span>
                              </span>
                          </div>
                      </article>
                  ))}
              </div>
          </div>
      </section>
      <section className="nh-price" id="packages">
          <div className="nh-wrap">
              <div className="nh-in">
                  <span className="nh-tag"><span className="material-symbols-rounded" aria-hidden="true">payments</span>Ways to work together</span>
                  <h2 className="nh-h2" style={{ marginTop: '20px' }}>Three ways in,<br /><em>one honest price list</em></h2>
                  <p className="nh-sub">
                      Starting points, not traps — every quote is fixed and adjusted to your actual
                      scope. If none of these fit, say so in your first message and we'll shape one.
                  </p>
              </div>
              <div className="nh-price__grid">
                  {PLANS.map((pl, i) => (
                      <article className={"nh-plan nh-in" + (pl.popular ? " nh-plan--pop" : "")} key={pl.name} style={i ? { transitionDelay: (i * 0.08) + "s" } : undefined}>
                          {pl.badge && <span className="nh-plan__badge">{pl.badge}</span>}
                          <h3 className="nh-plan__name">{pl.name}</h3>
                          <div className="nh-plan__price"><b>{pl.price}</b><span>{pl.priceNote}</span></div>
                          <p className="nh-plan__for">{pl.for}</p>
                          <ul className="nh-plan__list">
                              {pl.features.map((f) => (
                                  <li key={f}><span className="material-symbols-rounded" aria-hidden="true">check</span>{f}</li>
                              ))}
                          </ul>
                          <Link to={pl.cta.to} data-nav className={`nh-btn nh-btn--${pl.cta.variant} nh-plan__btn`}>{pl.cta.label}</Link>
                      </article>
                  ))}
              </div>
          </div>
      </section>
      <section className="nh-shop" id="shop">
          <div className="nh-wrap">
              <div className="nh-in">
                  <span className="nh-tag"><span className="material-symbols-rounded" aria-hidden="true">sell</span>Shop</span>
                  <h2 className="nh-h2" style={{ marginTop: '20px' }}>Take my work<br /><em>home with you</em></h2>
                  <p className="nh-sub">
                      A few of my builds are packaged up and for sale outright. The rest are
                      client projects — you can preview them, but they're not for sale.
                      Honest labels either way.
                  </p>
              </div>
              <div className="nh-shop__grid">
                  {shopItems().map((item, i) => (
                      <article className="nh-card nh-in" key={item.slug} style={i % 3 === 2 ? { transitionDelay: ".16s" } : i % 3 === 1 ? { transitionDelay: ".08s" } : undefined}>
                          <div className="nh-card__media">
                              <img src={item.project.cover} alt={item.alt} loading="lazy" decoding="async" draggable="false" data-protect />
                              <span className={"nh-card__flag " + (item.sale ? "nh-card__flag--sale" : "nh-card__flag--preview")}>
                                  <span className="material-symbols-rounded" aria-hidden="true">{item.sale ? "sell" : "visibility"}</span>
                                  {item.sale ? "For sale" : "Preview only"}
                              </span>
                          </div>
                          <div className="nh-card__body">
                              <h3 className="nh-card__title"><Link to={`/project/${item.slug}`}>{item.project.title}</Link></h3>
                              <p className="nh-card__desc">{item.desc}</p>
                              <div className="nh-card__foot">
                                  {item.sale ? (
                                      <span className="nh-card__price"><b>${item.project.price}</b><span>{item.project.priceNote}</span></span>
                                  ) : (
                                      <span className="nh-card__price nh-card__price--na"><b>Not for sale</b><span>Client work</span></span>
                                  )}
                                  {item.sale ? (
                                      <Link to={`/project/${item.slug}`} className="nh-card__btn nh-card__btn--buy" data-nav>
                                          <span className="material-symbols-rounded" aria-hidden="true">shopping_bag</span>Buy
                                      </Link>
                                  ) : (
                                      <button className="nh-card__btn" type="button" data-frame data-title={item.demo.title} data-meta={item.demo.meta} data-url={item.demo.url}>
                                          <span className="material-symbols-rounded" aria-hidden="true">open_in_new</span>Live demo
                                      </button>
                                  )}
                              </div>
                          </div>
                      </article>
                  ))}
              </div>
              <p className="nh-shop__note nh-in">
                  <span className="material-symbols-rounded" aria-hidden="true">shield_lock</span>
                  <span>
                      Previews are watermarked and disable right-click save, but please treat them as
                      samples — anything you want to use, buy it properly. Licensing is per-project and
                      I'll always say plainly what you can and can't do with a file.
                  </span>
              </p>
          </div>
      </section>
      <section className="nh-faq" id="faq">
          <div className="nh-wrap">
              <div className="nh-in">
                  <span className="nh-tag"><span className="material-symbols-rounded" aria-hidden="true">help</span>Before you ask</span>
                  <h2 className="nh-h2" style={{ marginTop: '20px' }}>Straight answers,<br /><em>no sales language</em></h2>
              </div>
              <div className="nh-faq__list">
                  {FAQ_HOME.map((f, i) => (
                      <details className="nh-faq__item nh-in" key={f.q}>
                          <summary className="nh-faq__q">
                              <span className="nh-faq__n">{String(i + 1).padStart(2, "0")}</span>
                              {f.q}
                              <span className="nh-faq__sign"><span className="material-symbols-rounded" aria-hidden="true">add</span></span>
                          </summary>
                          <div className="nh-faq__a">{f.a}</div>
                      </details>
                  ))}
              </div>
          </div>
      </section>
      <section className="nh-start" id="start">
          <div className="nh-wrap">
              <div className="nh-start__card">
                  <div className="nh-start__left nh-in">
                      <span className="nh-start__status"><i aria-hidden="true"></i>2 project slots open</span>
                      <h2 className="nh-start__title">Let's find out what you're actually trying to do.</h2>
                      <p className="nh-start__sub">
                          Send the goal, the deadline and one example of something you like the look of.
                          You'll get a straight answer, a realistic timeline and a fixed number within
                          24 hours — even if the answer is "you don't need me for this".
                      </p>
                      <div className="nh-slots">
                          {SLOTS.map((s) => (
                              <div className={"nh-slot nh-slot--" + s.state} key={s.label}>
                                  <span>{s.label}<small>{s.note}</small></span>
                                  <span className="material-symbols-rounded" aria-hidden="true">{s.icon}</span>
                              </div>
                          ))}
                      </div>
                  </div>
                  <div className="nh-start__right nh-in" style={{ transitionDelay: '.12s' }}>
                      <div className="nh-form">
                          <span className="nh-form__label"><span className="material-symbols-rounded" aria-hidden="true">newsmode</span>Design notes, monthly</span>
                          <p className="nh-form__note">
                              One short email a month: what I shipped, what's for sale in the shop,
                              and the occasional free resource. No drip sequence, unsubscribe in one click.
                          </p>
                          <form className="nh-form__row" id="nhNewsForm" noValidate>
                              <label className="visually-hidden" htmlFor="nhNewsEmail" style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }}>Email address</label>
                              <input id="nhNewsEmail" type="email" name="email" placeholder="you@yourcompany.com" autoComplete="email" required />
                              <button className="nh-form__btn" type="submit">Subscribe</button>
                          </form>
                          <p className="nh-form__msg" id="nhNewsMsg" role="status" aria-live="polite"></p>
                          <div className="nh-perks">
                              {PERKS.map((p) => (
                                  <div key={p.text}><span className="material-symbols-rounded" aria-hidden="true">{p.icon}</span>{p.text}</div>
                              ))}
                          </div>
                          <div style={{ marginTop: '26px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                              <a href={`mailto:${SITE.contact.email}`} className="nh-btn nh-btn--outline" style={{ padding: '13px 20px', fontSize: '.85rem' }}>
                                  <span className="material-symbols-rounded" aria-hidden="true">mail</span>Email me directly
                              </a>
                              <a href="#shop" className="nh-btn nh-btn--outline" style={{ padding: '13px 20px', fontSize: '.85rem' }}>
                                  <span className="material-symbols-rounded" aria-hidden="true">storefront</span>Or buy a template
                              </a>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>
      
      <div className="nh-viewer" id="nhViewer" role="dialog" aria-modal="true" aria-label="Work preview">
          <button className="nh-viewer__btn nh-viewer__close" id="nhVClose" aria-label="Close preview">
              <span className="material-symbols-rounded" aria-hidden="true">close</span>
          </button>
          <button className="nh-viewer__btn nh-viewer__prev" id="nhVPrev" aria-label="Previous preview">
              <span className="material-symbols-rounded" aria-hidden="true">arrow_back</span>
          </button>
          <button className="nh-viewer__btn nh-viewer__next" id="nhVNext" aria-label="Next preview">
              <span className="material-symbols-rounded" aria-hidden="true">arrow_forward</span>
          </button>
          <div className="nh-viewer__stage" id="nhVStage">
              <img id="nhVImg" alt="" draggable="false" data-protect />
              <div className="nh-viewer__wm" id="nhVWatermark" aria-hidden="true"></div>
              <iframe className="nh-viewer__iframe" id="nhVFrame" title="Live demo" loading="lazy" sandbox="allow-scripts allow-same-origin allow-popups" hidden></iframe>
              <div className="nh-viewer__bar">
                  <span><strong id="nhVTitle"></strong> — <span id="nhVMeta"></span></span>
                  <span className="nh-viewer__hint" id="nhVHint">
                      <span className="material-symbols-rounded" aria-hidden="true">lock</span><span id="nhVHintText">Watermarked preview</span>
                  </span>
              </div>
          </div>
      </div>
      <Footer />
    </>
  );
}
