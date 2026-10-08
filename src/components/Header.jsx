import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../header.css";
import mountHeaderRuntime from "../headerRuntime.js";
import { SITE } from "../data/site";
import { BUDGET_OPTIONS } from "../data/requests";
import { useAuth } from "../auth";
import ServiceModal from "./ServiceModal";

function initials(name) {
  return String(name || "?")
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function Header() {
  const { isLoggedIn, user } = useAuth();
  const [svc, setSvc] = useState("");
  const [bgt, setBgt] = useState("");
  useEffect(() => {
    mountHeaderRuntime();
    const f = document.getElementById("requestForm");
    const onReset = () => { setSvc(""); setBgt(""); };
    if (f) f.addEventListener("reset", onReset);
    return () => {
      if (f) f.removeEventListener("reset", onReset);
    };
  }, []);
  return (
    <>
      <div className="loader-wrapper" id="loaderWrapper">
              <div className="loader-content">
                  <div className="loader-logo">
                      <img src="/assets/imgs/logo/white-deep.png" alt="Deep Design Dev logo" />
                  </div>
                  <div className="loader-bar-wrapper">
                      <div className="loader-bar"></div>
                  </div>
                  <div className="loader-text">Loading</div>
              </div>
          </div>
      
          
          <div className="panel-overlay" id="panelOverlay"></div>
      
          
          <div className="toast-success" id="toastSuccess">
              <span className="material-symbols-rounded">check_circle</span>
              Request sent successfully!
          </div>
      
          
          <header className="main-header" id="mainHeader">
              <div className="header-container">
                  <div className="header-logo">
                      <Link to="/" data-nav>
                          <img src="/assets/imgs/logo/black-deep.png" alt="Deep Design Dev logo" />
                          <span className="header-wordmark">Deep Design Dev</span>
                      </Link>
                  </div>
      
                  <div className="nav-menu">
                      <ul className="nav-list">
                          {SITE.nav.map((item) => (
                            <li key={item.to}><Link to={item.to} data-nav className="nav-link"><span className="material-symbols-rounded nav-icon">{item.icon}</span> {item.label}</Link></li>
                          ))}
                      </ul>
                      <button className="btn-request" id="openRequestBtn">
                          <span className="material-symbols-rounded btn-icon">send</span> Request
                      </button>
                      <Link
                          to={isLoggedIn ? "/account" : "/login"}
                          data-nav
                          className="btn-account"
                          aria-label={isLoggedIn ? `Account of ${user.name}` : "Sign in"}
                          title={isLoggedIn ? user.name : "Sign in"}
                      >
                          <span className="material-symbols-rounded btn-icon">
                              {isLoggedIn ? "account_circle" : "person"}
                          </span>
                          <span className="btn-account__label">
                              {isLoggedIn ? initials(user.name) : "Sign in"}
                          </span>
                      </Link>
                  </div>
      
                  <button className="navbar-toggler" id="mobileMenuToggler" aria-label="Open menu">
                      <div className="hamburger-box">
                          <span className="hamburger-inner"></span>
                          <span className="hamburger-inner"></span>
                          <span className="hamburger-inner"></span>
                      </div>
                  </button>
              </div>
          </header>
      
          
          <div className="slide-panel" id="mobileNavPanel">
              <div className="panel-header">
                  <span className="panel-title">Menu</span>
                  <button className="panel-close" id="closeMobileNav">
                      <span className="material-symbols-rounded">close</span>
                  </button>
              </div>
              <ul className="mobile-nav-list">
                  {SITE.nav.map((item) => (
                    <li className="mobile-nav-item" key={item.to}><Link to={item.to} data-nav className="mobile-nav-link"><span className="material-symbols-rounded">{item.icon}</span> {item.label}</Link></li>
                  ))}
                  <li className="mobile-nav-item">
                      <Link to={isLoggedIn ? "/account" : "/login"} data-nav className="mobile-nav-link">
                          <span className="material-symbols-rounded">{isLoggedIn ? "account_circle" : "person"}</span>
                          {isLoggedIn ? `Account — ${user.name}` : "Sign in"}
                      </Link>
                  </li>
              </ul>
              <button className="mobile-request-btn" id="mobileRequestBtn">
                  <span className="material-symbols-rounded">send</span> Make a Request
              </button>
          </div>
      
          
          <div className="slide-panel request-panel" id="requestPanel">
              <div className="panel-header">
                  <span className="panel-title">Start a Project</span>
                  <button className="panel-close" id="closeRequestPanel">
                      <span className="material-symbols-rounded">close</span>
                  </button>
              </div>
              <p style={{ color: '#888', marginBottom: '24px', fontSize: '0.85rem', lineHeight: '1.5' }}>Tell me about your vision. I'll respond within 24 hours with a tailored proposal.</p>
      
              <form className="request-form" id="requestForm">
                  <div className="form-group">
                      <label><span className="material-symbols-rounded">badge</span> Full name</label>
                      <input type="text" name="name" placeholder="Your full name" required />
                  </div>
                  <div className="form-group">
                      <label><span className="material-symbols-rounded">alternate_email</span> Email address</label>
                      <input type="email" name="email" placeholder="you@example.com" required />
                  </div>
                  <div className="form-group">
                      <label><span className="material-symbols-rounded">category</span> Service type</label>
                      <ServiceModal
                          name="service"
                          options={SITE.requestServices}
                          value={svc}
                          onChange={setSvc}
                          placeholder="Choose a service"
                          required
                      />
                  </div>
                  <div className="form-group">
                      <label><span className="material-symbols-rounded">description</span> Project details</label>
                      <textarea name="message" placeholder="Describe your project, goals, timeline, and any inspiration..." required></textarea>
                  </div>
                  <div className="form-group">
                      <label><span className="material-symbols-rounded">payments</span> Budget range</label>
                      <ServiceModal
                          name="budget"
                          options={BUDGET_OPTIONS}
                          value={bgt}
                          onChange={setBgt}
                          placeholder="Select a budget"
                          title="What's the budget?"
                          tag="Budget"
                          emptyIcon="payments"
                      />
                  </div>
                  <button type="submit" className="submit-request">
                      Send Request <span className="material-symbols-rounded">arrow_forward</span>
                  </button>
              </form>
          </div>
    </>
  );
}
