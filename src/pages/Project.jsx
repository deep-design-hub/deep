import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Stars, StarPicker } from "../components/Stars";
import PageStamp from "../components/PageStamp";
import { getProject, relatedProjects, isForSale } from "../data/projects";
import { SITE } from "../data/site";
import { listFor, addReview } from "../data/reviews";
import { useAuth } from "../auth";
import { usePageSEO, breadcrumbJsonLd, SITE_URL } from "../seo";
import "../detail.css";

function fmtDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function initials(name) {
  return String(name || "?")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function Project() {
  const { slug } = useParams();
  const project = getProject(slug);

  const [idx, setIdx] = useState(0);
  const [sort, setSort] = useState("helpful");
  const [local, setLocal] = useState(() => (project ? listFor(project.slug) : []));
  const [voted, setVoted] = useState({});
  const [copied, setCopied] = useState(false);
  const [draft, setDraft] = useState({ name: "", role: "", stars: 0, body: "" });
  const [sent, setSent] = useState(false);
  const [gated, setGated] = useState(false);
  const { isLoggedIn, user } = useAuth();

  useEffect(() => {
    setIdx(0);
    setLocal(project ? listFor(project.slug) : []);
    setVoted({});
    setSent(false);
    setDraft({ name: "", role: "", stars: 0, body: "" });
    window.scrollTo(0, 0);
  }, [slug, project]);

  const related = useMemo(() => relatedProjects(slug, 8), [slug]);

  const seo = useMemo(() => {
    if (!project) {
      return {
        title: "Deep Design Hubs: Project not found — back to the gallery",
        description: "That project could not be found. Browse the full Deep Design Hubs gallery of web, branding and design case studies.",
        path: "/gallery",
        noindex: true
      };
    }
    const sale = isForSale(project);
    return {
      title: `Deep Design Hubs: ${project.title} — ${project.kind}${sale ? ` · $${project.price}` : " · case study"}`,
      description: `${project.title} by Deep Design Hubs — ${project.def.slice(0, 150)}${project.def.length > 150 ? "…" : ""} Rated ${project.rating.avg.toFixed(1)}/5 from ${project.rating.count} reviews.${sale ? ` For sale at $${project.price} (${project.license}).` : ""}`,
      keywords: [...project.tags, project.title.toLowerCase(), "deep design hubs", "abubakar musa"].join(", "),
      path: `/project/${project.slug}`,
      image: project.cover,
      jsonLd: [
        breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Projects", path: "/portfolio" },
          { name: project.title, path: `/project/${project.slug}` }
        ]),
        {
          "@context": "https://schema.org",
          "@type": sale ? "Product" : "CreativeWork",
          name: project.title,
          description: project.def,
          url: SITE_URL + `/project/${project.slug}`,
          image: project.images.map((im) => SITE_URL + im.src),
          author: { "@type": "Person", name: "Abubakar Musa", jobTitle: "Designer & Developer" },
          publisher: { "@type": "Organization", name: "Deep Design Hubs" },
          datePublished: project.year,
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: project.rating.avg,
            reviewCount: project.rating.count,
            bestRating: 5
          },
          review: project.comments.slice(0, 3).map((c) => ({
            "@type": "Review",
            author: { "@type": "Person", name: c.name },
            datePublished: c.date,
            reviewRating: { "@type": "Rating", ratingValue: c.stars, bestRating: 5 },
            reviewBody: c.body
          })),
          ...(sale
            ? {
                offers: {
                  "@type": "Offer",
                  price: project.price,
                  priceCurrency: "USD",
                  availability: "https://schema.org/InStock",
                  url: SITE_URL + `/project/${project.slug}`
                }
              }
            : {})
        }
      ]
    };
  }, [project]);

  usePageSEO(seo);

  if (!project) return <Navigate to="/gallery" replace />;

  const sale = isForSale(project);
  const image = project.images[idx] || project.images[0];

  const reviews = [...local, ...project.comments]
    .map((c, i) => ({
      ...c,
      _i: i,
      helpful: (c.helpful || 0) + (voted[i] ? 1 : 0),
      mine: !!c._mine
    }))
    .sort((a, b) => {
      if (sort === "newest") return String(b.date).localeCompare(String(a.date));
      if (sort === "highest") return b.stars - a.stars;
      return b.helpful - a.helpful;
    });

  function submitReview(e) {
    e.preventDefault();
    if (!isLoggedIn) {
      setGated(true);
      window.setTimeout(() => setGated(false), 6000);
      return;
    }
    if (!draft.body.trim() || draft.stars < 1) return;
    const name = draft.name.trim() || (user ? user.name : "");
    if (!name) return;
    setLocal(
      addReview({
        slug: project.slug,
        name,
        role: draft.role.trim() || "Client",
        stars: draft.stars,
        body: draft.body.trim(),
        userId: user ? user.id : "",
        email: user ? user.email : ""
      })
    );
    setDraft({ name: "", role: "", stars: 0, body: "" });
    setSent(true);
    window.setTimeout(() => setSent(false), 5000);
  }

  function copyLink() {
    const url = window.location.href;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(
        () => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2500);
        },
        () => {}
      );
    }
  }

  const distTotal = project.rating.count || 1;

  return (
    <>
      <Header />
      <main className="nh-main">
        <article className="nh-dp">
          <div className="nh-wrap">
            <nav className="nh-dp__crumbs" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span className="material-symbols-rounded" aria-hidden="true">
                chevron_right
              </span>
              <Link to="/portfolio">Projects</Link>
              <span className="material-symbols-rounded" aria-hidden="true">
                chevron_right
              </span>
              <span aria-current="page">{project.title}</span>
            </nav>

            <div className="nh-phead">
              <header className="nh-phead__copy nh-dp__head nh-in">
                <span className="nh-tag">
                  <span className="material-symbols-rounded" aria-hidden="true">
                    {project.icon}
                  </span>
                  {project.kind}
                </span>
                <h1 className="nh-dp__title">{project.title}</h1>
                <div className="nh-dp__meta">
                  <span className="nh-dp__rate">
                    <Stars value={project.rating.avg} size={17} />
                    <b>{project.rating.avg.toFixed(1)}</b>
                    <a href="#reviews">
                      {project.rating.count} reviews
                    </a>
                  </span>
                  <span className="nh-dp__chip">
                    <span className="material-symbols-rounded" aria-hidden="true">
                      calendar_month
                    </span>
                    {project.year}
                  </span>
                  <span className="nh-dp__chip">
                    <span className="material-symbols-rounded" aria-hidden="true">
                      workspace_premium
                    </span>
                    {project.role}
                  </span>
                  <span className={"nh-dp__chip nh-dp__chip--" + project.status}>
                    <span className="material-symbols-rounded" aria-hidden="true">
                      {sale ? "sell" : project.status === "preview" ? "visibility" : "verified"}
                    </span>
                    {sale ? `For sale · $${project.price}` : project.status === "preview" ? "Preview only" : "Client work · not for sale"}
                  </span>
                </div>
              </header>
              <PageStamp text={`${project.title} · Case study · Reviews · `} icon={project.icon} label={`${project.title} stamp`} />
            </div>

            <div className="nh-dp__cols">
              <div className="nh-dp__main">
                <figure className="nh-dp__gal nh-in" style={{ transitionDelay: ".06s" }}>
                  <div className="nh-dp__stage">
                    <img
                      src={image.src}
                      alt={`${project.title} — ${image.cap}`}
                      decoding="async"
                      draggable="false"
                    />
                    <span className="nh-dp__counter">
                      <span className="material-symbols-rounded" aria-hidden="true">
                        photo_library
                      </span>
                      {idx + 1} / {project.images.length} — {image.cap}
                    </span>
                    {project.images.length > 1 && (
                      <>
                        <button
                          type="button"
                          className="nh-dp__nav nh-dp__nav--prev"
                          aria-label="Previous image"
                          onClick={() => setIdx((idx - 1 + project.images.length) % project.images.length)}
                        >
                          <span className="material-symbols-rounded" aria-hidden="true">
                            arrow_back
                          </span>
                        </button>
                        <button
                          type="button"
                          className="nh-dp__nav nh-dp__nav--next"
                          aria-label="Next image"
                          onClick={() => setIdx((idx + 1) % project.images.length)}
                        >
                          <span className="material-symbols-rounded" aria-hidden="true">
                            arrow_forward
                          </span>
                        </button>
                      </>
                    )}
                  </div>
                  <div className="nh-dp__thumbs">
                    {project.images.map((im, n) => (
                      <button
                        type="button"
                        key={im.src + n}
                        className={"nh-dp__thumb" + (n === idx ? " is-on" : "")}
                        onClick={() => setIdx(n)}
                        aria-label={`Show image ${n + 1}: ${im.cap}`}
                        aria-pressed={n === idx}
                      >
                        <img src={im.src} alt="" loading="lazy" decoding="async" />
                      </button>
                    ))}
                  </div>
                </figure>

                <section className="nh-dp__sec nh-in">
                  <h2 className="nh-h3">Overview</h2>
                  <p className="nh-dp__p">{project.def}</p>
                </section>

                <section className="nh-dp__sec nh-dp__story nh-in" id="description">
                  <h2 className="nh-h3">
                    Project description
                    <span className="nh-dp__storybadge">
                      <span className="material-symbols-rounded" aria-hidden="true">
                        menu_book
                      </span>
                      Full case study
                    </span>
                  </h2>
                  <div className="nh-dp__storybody">
                    {(project.story || []).map((b) => (
                      <div className="nh-dp__block" key={b.h}>
                        <h3 className="nh-dp__blockh">{b.h}</h3>
                        <p className="nh-dp__p">{b.p}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="nh-dp__sec nh-in">
                  <h2 className="nh-h3">What was covered</h2>
                  <p className="nh-dp__p">{project.covered}</p>
                  <ul className="nh-dp__scope">
                    {project.scope.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </section>

                <dl className="nh-dp__facts nh-in">
                  <div>
                    <dt>Role</dt>
                    <dd>{project.role}</dd>
                  </div>
                  <div>
                    <dt>Year</dt>
                    <dd>{project.year}</dd>
                  </div>
                  <div>
                    <dt>Client</dt>
                    <dd>{project.client}</dd>
                  </div>
                  <div>
                    <dt>Outcome</dt>
                    <dd>{project.outcome}</dd>
                  </div>
                  <div>
                    <dt>Tools</dt>
                    <dd>{project.tools.join(", ")}</dd>
                  </div>
                  <div>
                    <dt>Status</dt>
                    <dd>
                      {sale ? "For sale" : project.status === "preview" ? "Preview only" : "Client work"}
                    </dd>
                  </div>
                </dl>

                <section className="nh-dp__sec nh-in" id="reviews">
                  <div className="nh-rates">
                    <div className="nh-rates__sum">
                      <span className="nh-rates__big">{project.rating.avg.toFixed(1)}</span>
                      <Stars value={project.rating.avg} size={20} />
                      <span className="nh-rates__count">
                        Based on {project.rating.count} professional reviews
                      </span>
                    </div>
                    <div className="nh-rates__dist">
                      {[5, 4, 3, 2, 1].map((n) => {
                        const c = project.rating.dist[n] || 0;
                        const pct = Math.round((c / distTotal) * 100);
                        return (
                          <div className="nh-rates__row" key={n}>
                            <span>
                              {n} <span className="material-symbols-rounded" aria-hidden="true">star</span>
                            </span>
                            <span className="nh-rates__bar">
                              <i style={{ width: pct + "%" }} />
                            </span>
                            <em>{c}</em>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="nh-revs__top">
                    <h2 className="nh-h3">
                      Reviews
                      <span className="nh-revs__n">{reviews.length}</span>
                    </h2>
                    <div className="nh-revs__sort">
                      <label htmlFor="rv-sort">Sort</label>
                      <select id="rv-sort" value={sort} onChange={(e) => setSort(e.target.value)}>
                        <option value="helpful">Most helpful</option>
                        <option value="newest">Newest</option>
                        <option value="highest">Highest rated</option>
                      </select>
                    </div>
                  </div>

                  {!isLoggedIn ? (
                    <div className="nh-revs__form nh-revs__form--locked" role="note">
                      <div className="nh-revs__formhead">
                        <b>Write a review</b>
                        <span>
                          <span className="material-symbols-rounded" aria-hidden="true">
                            lock
                          </span>
                          Sign in to rate and review
                        </span>
                      </div>
                      <p className="nh-revs__gate">
                        Reviews are tied to an account so ratings stay honest —
                        one review per signed-in buyer, name only, no email shown.
                      </p>
                      <div className="nh-revs__gateactions">
                        <Link to="/login" className="nh-btn nh-btn--solid">
                          <span className="material-symbols-rounded" aria-hidden="true">login</span>
                          Sign in to review
                        </Link>
                        <Link to="/register" className="nh-btn nh-btn--ghost">
                          Create free account
                        </Link>
                      </div>
                      {gated && (
                        <p className="nh-revs__ok" role="alert">
                          <span className="material-symbols-rounded" aria-hidden="true">info</span>
                          You need to sign in first — use the buttons above.
                        </p>
                      )}
                    </div>
                  ) : (
                  <form className="nh-revs__form" onSubmit={submitReview}>
                    <div className="nh-revs__formhead">
                      <b>Write a review</b>
                      <span>
                        <span className="material-symbols-rounded" aria-hidden="true">
                          shield_check
                        </span>
                        Signed in as {user.name} — reviews show your name only
                      </span>
                    </div>
                    <div className="nh-revs__stars">
                      <StarPicker
                        value={draft.stars}
                        onChange={(n) => setDraft({ ...draft, stars: n })}
                      />
                      <span>
                        {draft.stars
                          ? ["", "Poor", "Fair", "Good", "Very good", "Excellent"][draft.stars]
                          : "Tap to rate"}
                      </span>
                    </div>
                    <div className="nh-revs__fields">
                      <input
                        type="text"
                        placeholder={user ? user.name : "Your name"}
                        aria-label="Your name"
                        value={draft.name}
                        onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                      />
                      <input
                        type="text"
                        placeholder="Role / company (optional)"
                        aria-label="Role or company"
                        value={draft.role}
                        onChange={(e) => setDraft({ ...draft, role: e.target.value })}
                      />
                    </div>
                    <textarea
                      placeholder="What worked, what you received, how it held up in real use…"
                      aria-label="Your review"
                      value={draft.body}
                      onChange={(e) => setDraft({ ...draft, body: e.target.value })}
                      required
                    />
                    <div className="nh-revs__formfoot">
                      <button className="nh-btn nh-btn--solid" type="submit">
                        Publish review
                        <span className="material-symbols-rounded" aria-hidden="true">
                          arrow_outward
                        </span>
                      </button>
                      {sent && (
                        <span className="nh-revs__ok">
                          <span className="material-symbols-rounded" aria-hidden="true">
                            task_alt
                          </span>
                          Review published — thanks
                        </span>
                      )}
                    </div>
                  </form>
                  )}

                  <div className="nh-revs">
                    {reviews.map((c) => (
                      <article
                        className={"nh-rev" + (c.mine ? " nh-rev--mine" : "")}
                        key={c._i}
                      >
                        <div className="nh-rev__aside">
                          <span className="nh-rev__ava">{initials(c.name)}</span>
                          {c.mine && <span className="nh-rev__you">You</span>}
                        </div>
                        <div className="nh-rev__b">
                          <div className="nh-rev__top">
                            <div>
                              <b>{c.name}</b>
                              <span>{c.role}</span>
                            </div>
                            <div className="nh-rev__meta">
                              <Stars value={c.stars} size={14} />
                              <time dateTime={c.date}>{fmtDate(c.date)}</time>
                            </div>
                          </div>
                          <p>{c.body}</p>
                          <div className="nh-rev__foot">
                            {c.verified && (
                              <span className="nh-rev__badge">
                                <span className="material-symbols-rounded" aria-hidden="true">
                                  verified
                                </span>
                                Verified client
                              </span>
                            )}
                            <button
                              type="button"
                              className={"nh-rev__help" + (voted[c._i] ? " is-on" : "")}
                              onClick={() =>
                                setVoted((v) => ({ ...v, [c._i]: !v[c._i] }))
                              }
                            >
                              <span className="material-symbols-rounded" aria-hidden="true">
                                thumb_up
                              </span>
                              Helpful{c.helpful ? ` · ${c.helpful}` : ""}
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              </div>

              <aside className="nh-dp__side">
                <div
                  className={"nh-buy" + (sale ? " nh-buy--sale" : " nh-buy--info") + " nh-in"}
                  style={{ transitionDelay: ".1s" }}
                >
                  {sale ? (
                    <>
                      <span className="nh-buy__flag">
                        <span className="material-symbols-rounded" aria-hidden="true">
                          sell
                        </span>
                        For sale — instant download
                      </span>
                      <div className="nh-buy__price">
                        <b>${project.price}</b>
                        <span>{project.priceNote}</span>
                      </div>
                      <p className="nh-buy__note">{project.license}. Pay once, use it on your own project.</p>
                      <ul className="nh-buy__inc">
                        {project.includes.map((inc) => (
                          <li key={inc}>
                            <span className="material-symbols-rounded" aria-hidden="true">
                              check
                            </span>
                            {inc}
                          </li>
                        ))}
                      </ul>
                      <Link to={`/buy/${project.slug}`} className="nh-btn nh-btn--accent nh-buy__cta">
                        <span className="material-symbols-rounded" aria-hidden="true">
                          shopping_bag
                        </span>
                        Buy ${project.price}
                      </Link>
                      <a
                        href={`mailto:${SITE.contact.email}?subject=${encodeURIComponent(
                          "Question about " + project.title
                        )}`}
                        className="nh-buy__ask"
                      >
                        Questions before buying? Email me
                      </a>
                      <span className="nh-buy__deliv">
                        <span className="material-symbols-rounded" aria-hidden="true">
                          bolt
                        </span>
                        {project.delivery}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="nh-buy__flag nh-buy__flag--muted">
                        <span className="material-symbols-rounded" aria-hidden="true">
                          {project.status === "preview" ? "visibility" : "workspace_premium"}
                        </span>
                        {project.status === "preview" ? "Preview only" : "Client work"}
                      </span>
                      <div className="nh-buy__price nh-buy__price--na">
                        <b>Not for sale</b>
                        <span>This one belongs to the client</span>
                      </div>
                      <p className="nh-buy__note">
                        You can walk through the live preview, or ask for something
                        built the same way for your own project — same process, same
                        standards.
                      </p>
                      <div className="nh-buy__alt">
                        {project.demoUrl && (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="nh-btn nh-btn--solid"
                          >
                            <span className="material-symbols-rounded" aria-hidden="true">
                              open_in_new
                            </span>
                            Live demo
                          </a>
                        )}
                        <Link to="/contact" className="nh-btn nh-btn--accent">
                          <span className="material-symbols-rounded" aria-hidden="true">
                              handyman
                          </span>
                          Build me one
                        </Link>
                      </div>
                      <span className="nh-buy__deliv">
                        <span className="material-symbols-rounded" aria-hidden="true">
                          schedule
                        </span>
                        Typical reply within 24 hours
                      </span>
                    </>
                  )}
                </div>

                <div className="nh-dbox nh-in" style={{ transitionDelay: ".16s" }}>
                  <b>Project facts</b>
                  <ul>
                    <li>
                      <span>Category</span>
                      <em>{project.kind}</em>
                    </li>
                    <li>
                      <span>Photos</span>
                      <em>{project.images.length}</em>
                    </li>
                    <li>
                      <span>Rating</span>
                      <em>{project.rating.avg.toFixed(1)} / 5</em>
                    </li>
                    <li>
                      <span>Licence</span>
                      <em>{sale ? "Commercial" : "Not available"}</em>
                    </li>
                  </ul>
                </div>

                <div className="nh-dbox nh-in" style={{ transitionDelay: ".22s" }}>
                  <b>Share</b>
                  <div className="nh-share">
                    <button type="button" onClick={copyLink}>
                      <span className="material-symbols-rounded" aria-hidden="true">
                        {copied ? "check" : "link"}
                      </span>
                      {copied ? "Copied" : "Copy link"}
                    </button>
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                        project.title + " — Deep Design Hubs"
                      )}&url=${encodeURIComponent(SITE_URL + "/project/" + project.slug)}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      X / Twitter
                    </a>
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                        SITE_URL + "/project/" + project.slug
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Facebook
                    </a>
                    <a
                      href={`mailto:?subject=${encodeURIComponent(project.title)}&body=${encodeURIComponent(
                        SITE_URL + "/project/" + project.slug
                      )}`}
                    >
                      Email
                    </a>
                  </div>
                </div>
              </aside>
            </div>

            <section className="nh-dp__related">
              <div className="nh-dp__relhead nh-in">
                <span className="nh-tag">
                  <span className="material-symbols-rounded" aria-hidden="true">
                    auto_awesome
                  </span>
                  Keep looking
                </span>
                <h2 className="nh-h2" style={{ marginTop: "18px" }}>
                  Related
                  <br />
                  <em>projects</em>
                </h2>
              </div>
              <div className="nh-gal__grid nh-dp__relgrid">
                {related.map((p, i) => (
                  <Link
                    to={`/project/${p.slug}`}
                    className="nh-gcard nh-in"
                    key={p.slug}
                    style={{ transitionDelay: Math.min(i * 0.05, 0.25) + "s" }}
                  >
                    <div className="nh-gcard__media">
                      <img src={p.cover} alt={p.alt} loading="lazy" decoding="async" />
                      <span className="nh-gcard__count">
                        <span className="material-symbols-rounded" aria-hidden="true">
                          photo_library
                        </span>
                        {p.images.length} photos
                      </span>
                      {isForSale(p) && (
                        <span className="nh-gcard__flag nh-gcard__flag--sale">
                          <span className="material-symbols-rounded" aria-hidden="true">
                            sell
                          </span>
                          ${p.price}
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
                      <h3 className="nh-gcard__title">{p.title}</h3>
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
            </section>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
