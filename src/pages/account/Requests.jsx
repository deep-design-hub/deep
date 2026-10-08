/*
 * /account/requests — every brief the user has sent, with status + timeline.
 */
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth";
import { requestsFor, REQUEST_STATUSES } from "../../data/requests";
import { usePageSEO, breadcrumbJsonLd } from "../../seo";
import "../../auth.css";

const STEPS = REQUEST_STATUSES; // new → reviewing → quoted → won/declined

export default function Requests() {
  const { user } = useAuth();

  usePageSEO({
    noindex: true,
    title: "Deep Design Hubs: My requests",
    description: "Track every project request you've sent to Deep Design Hubs — status, quote and reference in one list.",
    keywords: "deep design hubs requests, project briefs, quotes",
    path: "/account/requests",
    jsonLd: [breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "My account", path: "/account" },
      { name: "Requests", path: "/account/requests" }
    ])]
  });

  const reqs = useMemo(() => (user ? requestsFor(user.email) : []), [user]);

  return (
    <>
      <div className="nh-dash__head">
        <div>
          <h1>
            My requests
            <br />
            <em>{reqs.length} brief{reqs.length === 1 ? "" : "s"} sent</em>
          </h1>
          <p className="nh-dash__sub">
            Each request is reviewed within 24 hours. Statuses move from{" "}
            <b>new → reviewing → quoted</b> as soon as a fixed quote is attached.
          </p>
        </div>
        <div className="nh-dash__headacts">
          <Link to="/contact" className="nh-btn nh-btn--accent">
            <span className="material-symbols-rounded" aria-hidden="true">add_task</span>
            New request
          </Link>
        </div>
      </div>

      <div className="nh-acct__panel nh-in">
        {reqs.length === 0 ? (
          <p className="nh-acct__empty">
            Nothing here yet. <Link to="/contact">Send your first brief</Link> — you'll
            get a fixed quote within 24 hours, no back-and-forth.
          </p>
        ) : (
          <div className="nh-acct__list">
            {reqs.map((r) => {
              const stepIndex = STEPS.indexOf(r.status);
              return (
                <div className="nh-acct__row" key={r.id}>
                  <div className="nh-acct__row-top">
                    <span className="nh-acct__ref">{r.ref}</span>
                    <span className={`nh-acct__pill nh-acct__pill--${r.status}`}>{r.status}</span>
                  </div>
                  <div className="nh-acct__row-title">{r.service}</div>
                  <div className="nh-acct__row-meta">
                    {r.budget ? `${r.budget} · ` : ""}
                    {new Date(r.created_at).toLocaleDateString()}
                  </div>
                  <p style={{ marginTop: 9, fontSize: ".84rem", lineHeight: 1.6, color: "var(--gray-500)" }}>
                    {r.message.length > 180 ? r.message.slice(0, 180) + "…" : r.message}
                  </p>
                  <div style={{ marginTop: 11, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    {STEPS.map((s, i) => (
                      <React.Fragment key={s}>
                        {i > 0 && (
                          <span
                            aria-hidden="true"
                            style={{
                              width: 14,
                              height: 1.5,
                              background: i <= stepIndex ? "var(--nh-accent)" : "var(--gray-200)"
                            }}
                          />
                        )}
                        <span
                          style={{
                            fontSize: ".66rem",
                            fontWeight: 700,
                            letterSpacing: ".05em",
                            textTransform: "uppercase",
                            color: i <= stepIndex ? "var(--nh-ink)" : "var(--gray-400, #a3a3a3)"
                          }}
                        >
                          {s}
                        </span>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
