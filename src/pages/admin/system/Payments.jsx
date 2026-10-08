/*
 * /admin/system/payments — Paystack keys, currency and bank transfer config.
 */
import React from "react";
import { Link } from "react-router-dom";
import { usePageSEO } from "../../../seo";
import SectionForm from "./SectionForm";
import "../../../auth.css";

export default function SystemPayments() {
  usePageSEO({
    noindex: true,
    title: "Deep Design Hubs: Payment settings",
    description: "Paystack, currency and bank transfer configuration for Deep Design Hubs.",
    keywords: "deep design hubs admin payment settings"
  });

  return (
    <SectionForm
      section="payments"
      title="Payments"
      em="Paystack, currency & bank transfer"
      sub="How the store charges: gateway keys, store currency and manual bank transfers."
      preview={{ to: "/admin/payments", label: "Open payments" }}
    >
      <div className="nh-adm__note" style={{ marginTop: 16 }}>
        <span className="material-symbols-rounded" aria-hidden="true">lock</span>
        <span>
          <b>Secret keys stay server-side.</b> Only the public key belongs in the
          browser — the PHP backend keeps the secret key in its env file. Review
          purchases under <Link to="/admin/orders">Orders</Link>.
        </span>
      </div>
    </SectionForm>
  );
}
