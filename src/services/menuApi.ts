// src/services/menuApi.ts
import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import { useMenuStore } from "@/store/menuStore";
import { waitForRotatedCsrf } from "@/utils/waitForCookie";
import { navigate } from "@/utils/navigate";
import type { RefreshResponse } from "@/types/Auth"; // 👈 asegúrate de tener este tipo

// 📦 Crear instancia Axios para el menú
const menuApi = axios.create({
  baseURL: import.meta.env.VITE_MENU_SERVICE_URL || "http://localhost:4003/api/menus",
  withCredentials: true, // Importante para enviar cookies como CSRF
});

// ✅ Interceptor REQUEST: añade CSRF token si está disponible
menuApi.interceptors.request.use((config) => {
  const { csrfToken, accessToken } = useAuthStore.getState();
  config.headers = config.headers || {};

  if (csrfToken) {
    console.log("[menuApi] Usando CSRF token:", csrfToken);
    config.headers["x-csrf-token"] = csrfToken;
  }

  if (accessToken) {
    console.log("[menuApi] Usando AccessToken en Authorization header");
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }

  return config;
});


// ✅ Interceptor RESPONSE: refresca tokens si hay 401 (una sola vez)
menuApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.warn("[menuApi] ⚠️ 401 detectado. Intentando refresh...");

        // 🔁 Obtener nuevo CSRF y refrescar tokens
        const csrfToken = await waitForRotatedCsrf();

        const refreshRes = await axios.post<RefreshResponse>(
          import.meta.env.VITE_AUTH_SERVICE_URL + "/refresh-token",
          null,
          {
            headers: { "x-csrf-token": csrfToken },
            withCredentials: true,
          }
        );

        const newCsrf = refreshRes.data?.csrfToken;
        console.log("[menuApi] 🔄 Nuevo CSRF token recibido:", newCsrf);
        useAuthStore.getState().setCsrfToken(newCsrf);

        // 🔁 Rehidratar sesión y reintentar
        await useAuthStore.getState().fetchSession();

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers["x-csrf-token"] = newCsrf;

        return menuApi(originalRequest);
      } catch (err) {
        console.error("[menuApi] ❌ Falló refresh-token. Cerrando sesión:", err);

        // 🧹 Limpiar estado global
        useAuthStore.getState().clearUser();
        const { clearMenus, setMenuLoaded } = useMenuStore.getState();
        clearMenus();
        setMenuLoaded(false);

        // 🔐 Redirigir al login
        navigate("/signin");

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default menuApi;
