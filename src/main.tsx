import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Toast from "@/components/shared/Toast";

import App from "./App";
import { AppWrapper } from "./components/common/PageMeta";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/auth/AuthProvider"; // ✅ IMPORTACIÓN CORREGIDA

// ✅ Verificación opcional del entorno en desarrollo
if (import.meta.env.DEV) {
  console.log("🛠️ Entorno de desarrollo activo");
  console.log("🔐 AUTH_SERVICE_URL:", import.meta.env.VITE_AUTH_SERVICE_URL);
  console.log("👤 USER_SERVICE_URL:", import.meta.env.VITE_USER_SERVICE_URL);
  console.log("📋 MENU_SERVICE_URL:", import.meta.env.VITE_MENU_SERVICE_URL);
  console.log("🧬 API_BIOMETRICO:", import.meta.env.VITE_API_BIOMETRICO);
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toast />
          <AppWrapper>
            <App />
          </AppWrapper>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
