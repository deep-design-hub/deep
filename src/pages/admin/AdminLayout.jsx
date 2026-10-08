/*
 * AdminLayout — full-screen /admin/* shell.
 * LEFT  = dark sidenav (full height, drawer on mobile)
 * RIGHT = light sticky header + main (<Outlet />)
 * No site Header/Footer inside /admin (the /account area keeps them).
 */
import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth";
import { countNewRequests } from "../../data/requests";
import { listOrders } from "../../data/orders";
import "../../auth.css";
import "../../dash.css";
import "../../admin.css";

const NAV = [
  { group: null, items: [
    { to: "/admin", end: true, icon: "space_dashboard", label: "Overview" }
  ]},
  { group: "Work", items: [
    { to: "/admin/requests", icon: "inbox", label: "Requests", badge: () => countNewRequests() },
    { to: "/admin/orders", icon: "receipt_long", label: "Orders" },
    {
      to: "/admin/payments", icon: "account_balance_wallet", label: "Payments",
      badge: () => listOrders().filter((o) => o.method === "bank" && o.status === "pending").length
    }
  ]},
  { group: "Content", items: [
    { to: "/admin/projects", icon: "deployed_code", label: "Projects" },
    { to: "/admin/services", icon: "construction", label: "Services" },
    { to: "/admin/reviews", icon: "star", label: "Reviews" }
  ]},
  { group: "People", items: [
    { to: "/admin/users", icon: "group", label: "Users" },
    { to: "/admin/subscribers", icon: "subscriptions", label: "Subscribers" },
    { to: "/admin/emails", icon: "send", label: "Email outbox" }
  ]},
  { group: "System", items: [
    { to: "/admin/system", icon: "settings", label: "System" }
  ]}
];

const FLAT = NAV.flatMap((g) => g.items);

function initials(name) {
  return String(name || "?")
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function AdminLayout() {
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
      FLAT.slice()
        .sort((a, b) => b.to.length - a.to.length)
        .find((i) => (i.end ? pathname === i.to : pathname === i.to || pathname.startsWith(i.to + "/")));
    return match || FLAT[0];
  }, [pathname]);

  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/account" replace />;

  const newReqs = countNewRequests();

  function handleLogout() {
    logout();
    navigate("/", { replace: true });
  }

  return (
    <div className="nh-adm">
      {menuOpen && <div className="nh-adm__overlay" onClick={() => setMenuOpen(false)} aria-hidden="true" />}

      <aside className={"nh-adm__side" + (menuOpen ? " is-open" : "")}>
        <Link className="nh-adm__brand" to="/admin">
          <img src="/assets/imgs/logo/white-deep.png" alt="Deep Design Hubs" />
          <span className="nh-adm__brand-chip">Admin console</span>
        </Link>

        {NAV.map((grp) => (
          <React.Fragment key={grp.group || "main"}>
            {grp.group && <div className="nh-adm__grp">{grp.group}</div>}
            <nav className="nh-adm__nav" aria-label={grp.group || "Admin"}>
              {grp.items.map((item) => {
                const n = item.badge ? item.badge() : 0;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) => "nh-dash__link" + (isActive ? " is-on" : "")}
                  >
                    <span className="material-symbols-rounded" aria-hidden="true">{item.icon}</span>
                    <span className="nh-dash__label">{item.label}</span>
                    {n > 0 && <span className="nh-dash__badge">{n}</span>}
                  </NavLink>
                );
              })}
            </nav>
          </React.Fragment>
        ))}

        <div className="nh-adm__foot">
          <Link to="/account" className="nh-dash__link">
            <span className="material-symbols-rounded" aria-hidden="true">person</span>
            <span className="nh-dash__label">My account</span>
          </Link>
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
              <span className="material-symbols-rounded">{crumb.icon}</span>
            </span>
            <span className="nh-adm__crumb-txt">
              <b>{crumb.label}</b>
              <small>Deep Design Hubs · Admin console</small>
            </span>
          </div>

          <div className="nh-adm__topacts">
            <Link className="nh-adm__toplink" to="/">
              <span className="material-symbols-rounded" aria-hidden="true">language</span>
              <span>View site</span>
            </Link>
            <Link className="nh-adm__toplink nh-adm__bell" to="/admin/requests" aria-label={`Requests${newReqs ? ` (${newReqs} new)` : ""}`}>
              <span className="material-symbols-rounded" aria-hidden="true">notifications</span>
              {newReqs > 0 && <span className="nh-adm__dot">{newReqs}</span>}
            </Link>
            <Link className="nh-adm__user" to="/account">
              <span className="nh-adm__user-av" aria-hidden="true">{initials(user.name)}</span>
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
