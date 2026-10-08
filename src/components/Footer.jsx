import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../footer.css";
import mountFooterRuntime from "../footerRuntime.js";
import { SITE } from "../data/site";

export default function Footer() {
  useEffect(() => {
    mountFooterRuntime();
  }, []);
  return (
    <>
      <footer className="main-footer" id="mainFooter">
              <div className="footer-container">
                  <div className="footer-grid">
                      
                      <div className="footer-brand">
                          <div className="footer-logo">
                              <Link to="/" data-nav>
                                  <img src="/assets/imgs/logo/black-deep.png" alt="Deep Design Hubs logo" />
                              </Link>
                          </div>
                          <p className="footer-description">
                              {SITE.tagline}
                          </p>
                          <div className="footer-social" id="footerSocial">
                              
                          </div>
                      </div>
      
                      
                      <div className="footer-column">
                          <h4>Quick Links</h4>
                          <ul className="footer-links" id="footerQuickLinks">
                              
                          </ul>
                      </div>
      
                      
                      <div className="footer-column">
                          <h4>Services</h4>
                          <ul className="footer-links" id="footerServiceLinks">
                              
                          </ul>
                      </div>
      
                      
                      <div className="footer-column">
                          <h4>Contact</h4>
                          <div className="footer-contact">
                              <div className="contact-item">
                                  <span className="material-symbols-rounded">mail</span>
                                  <span id="footerEmail">{SITE.contact.email}</span>
                              </div>
                              <div className="contact-item">
                                  <span className="material-symbols-rounded">location_on</span>
                                  <span id="footerLocation">{SITE.contact.location}<br />{SITE.contact.locationNote}</span>
                              </div>
                          </div>
                      </div>
                  </div>
      
                  
                  <div className="footer-bottom">
                      <span id="footerCopyright">&copy; {SITE.footer.copyright}. All rights reserved.</span>
                      <div className="footer-bottom-links">
                          {SITE.footer.legal.map((l) => (
                            <a key={l.label} href={l.href}>{l.label}</a>
                          ))}
                      </div>
                  </div>
              </div>
          </footer>
      
          
          <a href="#" className="whatsapp-float" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" id="whatsappFloat">
              <svg viewBox="0 0 32 32" fill="currentColor" width="28" height="28"><path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.132 6.744 3.058 9.374L1.054 31.25l6.114-1.974A15.912 15.912 0 0 0 16.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.326 22.594c-.39 1.096-1.932 2.01-3.164 2.27-.844.18-1.946.322-5.642-1.216-4.734-1.966-7.776-6.764-8.01-7.076-.226-.312-1.884-2.506-1.884-4.78s1.196-3.4 1.62-3.868c.39-.426.924-.56 1.23-.56.312 0 .624.004.894.018.29.012.678-.11 1.06.808.39.94 1.336 3.25 1.452 3.488.116.238.232.548.074.858-.156.324-.31.524-.572.812-.262.288-.504.51-.766.822-.238.276-.502.572-.214.998.288.426 1.282 1.892 2.75 3.064 1.886 1.508 3.428 1.976 3.964 2.192.536.216.848.182 1.158-.11.316-.3.676-.774 1.06-1.254.274-.342.624-.386 1.008-.262.39.118 2.472 1.166 2.894 1.378.422.212.704.318.81.494.104.18.104 1.036-.286 2.132z" /></svg>
              <span className="whatsapp-pulse"></span>
          </a>
    </>
  );
}
