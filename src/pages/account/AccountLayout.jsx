/*
 * AccountLayout — /account/* shell, same pattern as admin:
 * LEFT  = dark sidenav (full height, drawer on mobile)
 * RIGHT = light sticky header + main (<Outlet />)
 * No site Header/Footer here — the account lives in its own full-width app.
 */
import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth";
import { countNewRequests } from "../../data/requests";
import { ordersFor } from "../../data/orders";
import "../../auth.css";
import "../../dash.css";
import "../../admin.css";

export function initials(name) {
  return String(name || "?")
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

const NAV = [
  { to: "/account", end: true, icon: "space_dashboard", label: "Dashboard" },
  { to: "/account/requests", icon: "mail", label: "My requests" },
  { to: "/account/orders", icon: "shopping_bag", label: "My orders" },
  { to: "/account/profile", icon: "person", label: "Profile" },
  { to: "/account/security", icon: "security", label: "Security" }
];

export default function AccountLayout() {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.add("is-loaded");
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const crumb = useMemo(() => {
    const match =
      NAV.slice()
        .sort((a, b) => b.to.length - a.to.length)
        .find((i) => (i.end ? pathname === i.to : pathname === i.to || pathname.startsWith(i.to + "/")));
    return match;
  }, [pathname]);

  if (!isLoggedIn) return <Navigate to="/login" replace />;

  const newReqs = countNewRequests();
  const paidOrders = user ? ordersFor(user.email).filter((o) => o.status === "paid").length : 0;

  function handleLogout() {
    logout();
    navigate("/", { replace: true });
  }

  return (
    <div className="nh-adm">
      {menuOpen && <div className="nh-adm__overlay" onClick={() => setMenuOpen(false)} aria-hidden="true" />}

      <aside className={"nh-adm__side" + (menuOpen ? " is-open" : "")}>
        <Link className="nh-adm__brand" to="/account">
          <img src="/assets/imgs/logo/white-deep.png" alt="Deep Design Dev" />
          <span className="nh-adm__brand-chip">My account</span>
        </Link>

        <div className="nh-adm__me">
          {user.avatar ? (
            <img className="nh-adm__me-av" src={user.avatar} alt="" />
          ) : (
            <span className="nh-adm__me-av" aria-hidden="true">{initials(user.name)}</span>
          )}
          <span className="nh-adm__me-b">
            <b>{user.name}</b>
            <small className="nh-adm__me-role">
              {user.role === "admin" ? "Admin" : "Customer"}
            </small>
          </span>
        </div>

        <nav className="nh-adm__nav" aria-label="Account">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => "nh-dash__link" + (isActive ? " is-on" : "")}
            >
              <span className="material-symbols-rounded" aria-hidden="true">{item.icon}</span>
              <span className="nh-dash__label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="nh-adm__grp">Manage</div>
        <nav className="nh-adm__nav" aria-label="Manage">
          <Link className="nh-dash__link" to="/projects">
            <span className="material-symbols-rounded" aria-hidden="true">photo_library</span>
            <span className="nh-dash__label">Browse work</span>
          </Link>
          <button type="button" className="nh-dash__link" onClick={openRequestPanel}>
            <span className="material-symbols-rounded" aria-hidden="true">send</span>
            <span className="nh-dash__label">Start a request</span>
          </button>
          {user.role === "admin" && (
            <Link className="nh-dash__link" to="/admin">
              <span className="material-symbols-rounded" aria-hidden="true">admin_panel_settings</span>
              <span className="nh-dash__label">Admin console</span>
              {newReqs > 0 && <span className="nh-dash__badge">{newReqs}</span>}
            </Link>
          )}
        </nav>

        <div className="nh-adm__foot">
          <button className="nh-dash__out" type="button" onClick={handleLogout}>
            <span className="material-symbols-rounded" aria-hidden="true">logout</span>
            Sign out
          </button>
        </div>
      </aside>

      <div className="nh-adm__right">
        <header className="nh-adm__top">
          <div className="nh-adm__crumb">
            <button
              className="nh-adm__burger"
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <span className="material-symbols-rounded" aria-hidden="true">{menuOpen ? "close" : "menu"}</span>
            </button>
            <span className="nh-adm__crumb-ic" aria-hidden="true">
              <span className="material-symbols-rounded">{crumb ? crumb.icon : "person"}</span>
            </span>
            <span className="nh-adm__crumb-txt">
              <b>{crumb ? crumb.label : "My account"}</b>
              <small>Deep Design Dev · Customer area</small>
            </span>
          </div>

          <div className="nh-adm__topacts">
            <Link className="nh-adm__toplink" to="/">
              <span className="material-symbols-rounded" aria-hidden="true">language</span>
              <span>View site</span>
            </Link>
            <Link className="nh-adm__toplink nh-adm__bell" to="/account/orders" aria-label={`Paid orders (${paidOrders})`}>
              <span className="material-symbols-rounded" aria-hidden="true">receipt_long</span>
              {paidOrders > 0 && <span className="nh-adm__dot">{paidOrders}</span>}
            </Link>
            <Link className="nh-adm__user" to="/account/profile">
              {user.avatar ? (
                <img className="nh-adm__user-av-img" src={user.avatar} alt="" />
              ) : (
                <span className="nh-adm__user-av" aria-hidden="true">{initials(user.name)}</span>
              )}
              <span className="nh-adm__user-name">{user.name}</span>
            </Link>
            <button className="nh-adm__logout" type="button" onClick={handleLogout} aria-label="Sign out" title="Sign out">
              <span className="material-symbols-rounded" aria-hidden="true">logout</span>
            </button>
          </div>
        </header>

        <main className="nh-adm__main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}