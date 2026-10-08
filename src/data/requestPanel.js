/* Opens the header "Start a Project" slide panel from anywhere in the app.
 * The panel + overlay are always mounted (Header.jsx) and headerRuntime
 * handles close/overlay/escape. This only re-opens it. */
export function openRequestPanel() {
  const panel = document.getElementById("requestPanel");
  const overlay = document.getElementById("panelOverlay");
  const mobileNav = document.getElementById("mobileNavPanel");
  const toggler = document.getElementById("mobileMenuToggler");

  if (mobileNav) mobileNav.classList.remove("active");
  if (toggler) toggler.classList.remove("active");
  if (panel) panel.classList.add("active");
  if (overlay) overlay.classList.add("show");

  document.body.style.overflow = "hidden";
  const first = panel && panel.querySelector('input:not([type="hidden"]), textarea');
  if (first) setTimeout(() => first.focus(), 140);
}