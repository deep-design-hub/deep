import React, { useEffect, useLayoutEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Service from "./pages/Service.jsx";
import Portfolio from "./pages/Portfolio.jsx";
import Project from "./pages/Project.jsx";
import About from "./pages/About.jsx";
import Gallery from "./pages/Gallery.jsx";
import Contact from "./pages/Contact.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Buy from "./pages/Buy.jsx";
import NotFound from "./pages/NotFound.jsx";
import AccountLayout from "./pages/account/AccountLayout.jsx";
import AccountDashboard from "./pages/account/Dashboard.jsx";
import AccountRequests from "./pages/account/Requests.jsx";
import AccountOrders from "./pages/account/Orders.jsx";
import AccountProfile from "./pages/account/Profile.jsx";
import AccountSecurity from "./pages/account/Security.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminOverview from "./pages/admin/Overview.jsx";
import AdminRequests from "./pages/admin/Requests.jsx";
import AdminOrders from "./pages/admin/Orders.jsx";
import AdminPayments from "./pages/admin/Payments.jsx";
import AdminUsers from "./pages/admin/Users.jsx";
import AdminProjects from "./pages/admin/Projects.jsx";
import AdminProjectEditor from "./pages/admin/ProjectEditor.jsx";
import AdminServices from "./pages/admin/Services.jsx";
import AdminServiceEditor from "./pages/admin/ServiceEditor.jsx";
import AdminUserEditor from "./pages/admin/UserEditor.jsx";
import AdminSystem from "./pages/admin/System.jsx";
import SysGeneral from "./pages/admin/system/General.jsx";
import SysAppearance from "./pages/admin/system/Appearance.jsx";
import SysEmailCfg from "./pages/admin/system/EmailCfg.jsx";
import SysPayments from "./pages/admin/system/Payments.jsx";
import SysTranslations from "./pages/admin/system/Translations.jsx";
import SysCronjobs from "./pages/admin/system/Cronjobs.jsx";
import SysLogs from "./pages/admin/system/Logs.jsx";
import SysStorage from "./pages/admin/system/Storage.jsx";
import SysSecurity from "./pages/admin/system/Security.jsx";
import SysSeo from "./pages/admin/system/Seo.jsx";
import SysInfo from "./pages/admin/system/Info.jsx";
import AdminReviews from "./pages/admin/Reviews.jsx";
import AdminSubscribers from "./pages/admin/Subscribers.jsx";
import AdminEmails from "./pages/admin/Emails.jsx";
import mountReveal from "./revealRuntime.js";

function RouteEffects() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => mountReveal(), [pathname]);

  return null;
}

export default function App() {
  return (
    <>
      <RouteEffects />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/service" element={<Service />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/project" element={<Navigate to="/gallery" replace />} />
        <Route path="/project/:slug" element={<Project />} />
        <Route path="/about" element={<About />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/buy/:slug" element={<Buy />} />
        <Route path="/account" element={<AccountLayout />}>
          <Route index element={<AccountDashboard />} />
          <Route path="requests" element={<AccountRequests />} />
          <Route path="orders" element={<AccountOrders />} />
          <Route path="profile" element={<AccountProfile />} />
          <Route path="security" element={<AccountSecurity />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminOverview />} />
          <Route path="requests" element={<AdminRequests />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="projects/:id" element={<AdminProjectEditor />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="services/:id" element={<AdminServiceEditor />} />
          <Route path="system" element={<AdminSystem />} />
          <Route path="system/general" element={<SysGeneral />} />
          <Route path="system/appearance" element={<SysAppearance />} />
          <Route path="system/email" element={<SysEmailCfg />} />
          <Route path="system/payments" element={<SysPayments />} />
          <Route path="system/translations" element={<SysTranslations />} />
          <Route path="system/cronjobs" element={<SysCronjobs />} />
          <Route path="system/logs" element={<SysLogs />} />
          <Route path="system/storage" element={<SysStorage />} />
          <Route path="system/security" element={<SysSecurity />} />
          <Route path="system/seo" element={<SysSeo />} />
          <Route path="system/info" element={<SysInfo />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="users/:id" element={<AdminUserEditor />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="subscribers" element={<AdminSubscribers />} />
          <Route path="emails" element={<AdminEmails />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
