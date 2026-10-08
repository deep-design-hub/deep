/*
 * 404 — unknown routes. Noindex, designed like the rest of the site.
 */
import React from "react";
import { Link, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PageStamp from "../components/PageStamp";
import { usePageSEO } from "../seo";
import "../detail.css";

export default function NotFound() {
  const location = useLocation();

  usePageSEO({
    title: "Deep Design Hubs: 404 — this page doesn't exist",
    description:
      "That page may have been moved, removed, or never existed. Browse the Deep Design Hubs projects, services and gallery instead.",
    keywords: "deep design hubs 404, page not found",
    path: location.pathname,
    noindex: true
  });

  return (
    <>
      <Header />
      <main className="nh-main">
        <section className="nh-phead" style={{ padding: "170px 0 40px" }}>
          <div className="nh-wrap">
            <div className="nh-phead__copy nh-in">
              <span className="nh-tag">
                <span className="material-symbols-rounded" aria-hidden="true">error</span>
                404 · Not found
              </span>
              <h1 className="nh-h2" style={{ marginTop: "20px" }}>
                This page doesn't exist
                <br />
                <em>it may have been moved or removed</em>
              </h1>
              <p className="nh-sub">
                The link is broken or the page changed address. Everything that does
                exist is one click away — projects, services, the gallery and the shop.
              </p>
              <div style={{ marginTop: 26, display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link to="/" className="nh-btn nh-btn--accent">
                  <span className="material-symbols-rounded" aria-hidden="true">home</span>
                  Back home
                </Link>
                <Link to="/portfolio" className="nh-btn nh-btn--solid">
                  <span className="material-symbols-rounded" aria-hidden="true">dashboard</span>
                  See projects
                </Link>
                <Link to="/contact" className="nh-btn nh-btn--outline">
                  <span className="material-symbols-rounded" aria-hidden="true">mail</span>
                  Contact
                </Link>
              </div>
            </div>
            <PageStamp text="Page not found · Gone · Never existed · " icon="search_off" label="404 stamp" />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
