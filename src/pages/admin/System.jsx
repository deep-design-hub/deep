/*
 * /admin/system — hub of widget cards. Each card links to its own full
 * system page (general, appearance, email, payments, translations,
 * cronjobs, logs, storage, security, seo) with its own complete functions.
 */
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  listSettings, listJobs, listLogs, ensureSeedLog, storageTables, settingsFor
} from "../../data/system";
import { outboxAll } from "../../data/emails";
import { usePageSEO } from "../../seo";
import pkg from "../../../package.json";
import "../../auth.css";

export default function AdminSystem() {
  const [tick] = useState(() => {
    ensureSeedLog();
    return 0;
  });

  usePageSEO({
    noindex: true,
    title: "Deep Design Dev: System",
    description: "Platform system cards: settings, cronjobs, logs, storage and more for Deep Design Dev.",
    keywords: "deep design hubs admin system"
  });

  const stats = useMemo(() => {
    void tick;
    const jobs = listJobs();
    const logs = listLogs(500);
    const outbox = outboxAll();
    const tables = storageTables();
    const maintenance = settingsFor("appearance").find((s) => s.key === "maintenance_mode");
    const payMode = settingsFor("payments").find((s) => s.key === "paystack_mode");
    const lang = settingsFor("i18n").find((s) => s.key === "default_language");
    const ping = settingsFor("seo").find((s) => s.key === "sitemap_ping");
    const session = settingsFor("security").find((s) => s.key === "session_timeout_hours");
    const siteName = settingsFor("general").find((s) => s.key === "site_name");
    return {
      jobsActive: jobs.filter((j) => j.enabled).length,
      jobsTotal: jobs.length,
      logLines: logs.length,
      errors: logs.filter((l) => l.level === "error").length,
      queued: outbox.filter((m) => m.status === "queued").length,
      mailTotal: outbox.length,
      tables: tables.length,
      rows: tables.reduce((s, t) => s + t.rows, 0),
      maintenance: maintenance ? maintenance.value : "?",
      payMode: payMode ? payMode.value : "?",
      lang: lang ? lang.value : "?",
      ping: ping ? ping.value : "?",
      session: session ? session.value : "?",
      siteName: siteName ? siteName.value : "—",
      settingsCount: listSettings().length
    };
  }, [tick]);

  const CARDS = [
    {
      id: "general", icon: "badge", title: "General",
      desc: "Site name, tagline, contact email, phone, location and reply time.",
      stat: stats.siteName
    },
    {
      id: "appearance", icon: "palette", title: "Appearance",
      desc: "Accent colour, site-wide announcement, maintenance switch and theme flags.",
      stat: stats.maintenance === "on" ? "maintenance on" : "live",
      hot: stats.maintenance === "on"
    },
    {
      id: "email", icon: "mail", title: "Email",
      desc: "Sender name and address, subject prefix, SMTP host — plus a test send.",
      stat: `${stats.queued} queued`,
      hot: stats.queued > 0
    },
    {
      id: "payments", icon: "credit_card", title: "Payments",
      desc: "Paystack keys and mode, store currency, bank transfer instructions.",
      stat: `${stats.payMode} mode`
    },
    {
      id: "translations", icon: "translate", title: "Translations",
      desc: "Default language, enabled locales, date format and language pack export.",
      stat: stats.lang
    },
    {
      id: "cronjobs", icon: "schedule", title: "Cronjobs",
      desc: "Scheduled background jobs — run now, enable/disable, create and edit.",
      stat: `${stats.jobsActive}/${stats.jobsTotal} active`,
      hot: stats.jobsActive > 0
    },
    {
      id: "logs", icon: "monitoring", title: "System logs",
      desc: "The event stream every job and admin action writes to. Filter, export, clear.",
      stat: `${stats.logLines} lines`,
      hot: stats.errors > 0
    },
    {
      id: "storage", icon: "storage", title: "Storage & backup",
      desc: "Row counts and sizes per table, full backup export and JSON restore.",
      stat: `${stats.tables} tables`
    },
    {
      id: "security", icon: "verified_user", title: "Security",
      desc: "Session timeout, password minimums, sign-in alerts and attempt limits.",
      stat: `${stats.session}h sessions`
    },
    {
      id: "seo", icon: "search", title: "SEO",
      desc: "Default title, description and share image — plus ping search engines now.",
      stat: `ping ${stats.ping}`
    },
    {
      id: "info", icon: "info", title: "System info",
      desc: "Version, runtime, browser and how much space the data uses.",
      stat: `v${pkg.version}`
    }
  ];

  return (
    <>
      <div className="nh-dash__head">
        <div>
          <h1>
            System
            <br />
            <em>{CARDS.length} cards · {stats.settingsCount} settings · {stats.jobsTotal} jobs</em>
          </h1>
          <p className="nh-dash__sub">
            Everything behind the site, one card per area. Open a card for its own
            full page of controls — with the PHP backend these become real server
            endpoints, same names, same switches.
          </p>
        </div>
      </div>

      <div className="nh-sysgrid nh-in">
        {CARDS.map((c) => (
          <Link key={c.id} className="nh-syscard" to={`/admin/system/${c.id}`}>
            <div className="nh-syscard__top">
              <span className="nh-syscard__ic" aria-hidden="true">
                <span className="material-symbols-rounded">{c.icon}</span>
              </span>
              <span className={"nh-syscard__stat" + (c.hot ? " nh-syscard__stat--hot" : "")}>{c.stat}</span>
            </div>
            <div className="nh-syscard__title">{c.title}</div>
            <div className="nh-syscard__desc">{c.desc}</div>
            <span className="nh-syscard__go">
              Open
              <span className="material-symbols-rounded" aria-hidden="true">arrow_forward</span>
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
