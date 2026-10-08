import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./auth.jsx";
import "./home.css";
import "./nh.css";
import "./work.css";

// Always start routes at the top — we scroll to top ourselves on navigation
if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);
