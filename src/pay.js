/*
 * pay.js — Paystack checkout helper.
 *
 * If VITE_PAYSTACK_PUBLIC_KEY is set in .env, the real Paystack inline
 * popup is loaded (https://js.paystack.co — already allowed by CSP).
 * Without a key the flow runs in DEMO mode: it simulates a successful
 * charge so the orders/emails pipeline can be tested end-to-end.
 *
 * Real payments need a server-side transaction created with the secret
 * key — never put the secret key in this app.
 */
const PAYSTACK_SRC = "https://js.paystack.co/v1/inline.js";

const PUBLIC_KEY = (import.meta.env && import.meta.env.VITE_PAYSTACK_PUBLIC_KEY) || "";
export const isLivePayments = () => Boolean(PUBLIC_KEY);

function loadPaystack() {
  return new Promise((resolve, reject) => {
    if (window.PaystackPop) return resolve(window.PaystackPop);
    const s = document.createElement("script");
    s.src = PAYSTACK_SRC;
    s.async = true;
    s.onload = () => resolve(window.PaystackPop);
    s.onerror = () => reject(new Error("Could not load Paystack"));
    document.head.appendChild(s);
  });
}

/*
 * charge({ email, amount, currency, ref, name })
 *  → resolves { ok, provider_ref, status, demo }
 */
export async function charge({ email, amount, currency = "USD", ref, name }) {
  if (!isLivePayments()) {
    // DEMO mode — pretend the popup charged successfully
    await new Promise((r) => setTimeout(r, 1200));
    return { ok: true, status: "success", provider_ref: "demo_" + ref, demo: true };
  }

  const Pop = await loadPaystack();
  return new Promise((resolve, reject) => {
    const handler = Pop.setup({
      key: PUBLIC_KEY,
      email,
      amount: Math.round(amount * 100), // kobo/cents
      currency,
      ref,
      metadata: { name, custom_ref: ref },
      callback: (response) =>
        resolve({ ok: true, status: response.status, provider_ref: response.reference, demo: false }),
      onClose: () => reject(new Error("Payment cancelled"))
    });
    handler.openIframe();
  });
}
