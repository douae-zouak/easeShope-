import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App.jsx";

import { useAuthStore } from "./store/auth.store.js";

// ⚡ Installer l'intercepteur Axios au démarrage
useAuthStore.getState().setupAxiosInterceptors();
console.log("🚀 Axios interceptors installed");

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
