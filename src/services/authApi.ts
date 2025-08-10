// src/services/authApi.ts
import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import { useMenuStore } from "@/store/menuStore";
import { RefreshResponse } from "@/types/Auth";
import { navigate } from "@/utils/navigate";

const authApi = axios.create({
  baseURL: import.meta.env.VITE_AUTH_SERVICE_URL,
  withCredentials: true,
});

// ✅ Interceptor REQUEST: añade CSRF token y Authorization si existen
authApi.interceptors.request.use((config) => {
  const { csrfToken, accessToken } = useAuthStore.getState();

  config.headers = config.headers || {};

  if (csrfToken) {
    if (import.meta.env.DEV) console.log("📤 [authApi] Usando CSRF token:", csrfToken);
    config.headers["x-csrf-token"] = csrfToken;
  }

  if (accessToken) {
    if (import.meta.env.DEV) console.log("🔐 [authApi] Usando AccessToken");
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }

  return config;
});

// ✅ Interceptor RESPONSE: si 401 → intenta refresh-token (excepto en /login o /logout)
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;

    // Evitar retry si ya lo intentamos, o si es login/logout/refresh mismo
    const skipRetry =
      originalRequest._retry ||
      originalRequest?.headers?.["x-skip-refresh"] === "true" ||
      originalRequest?.url?.includes("/login") ||
      originalRequest?.url?.includes("/logout") ||
      originalRequest?.url?.includes("/refresh-token");

    if (status === 401 && !skipRetry) {
      originalRequest._retry = true;

      if (import.meta.env.DEV) {
        console.warn("⚠️ [authApi] 401 recibido. Intentando refresh-token...");
      }

      try {
        const refreshRes = await authApi.post<RefreshResponse>("/refresh-token", null, {
          withCredentials: true,
          headers: { "x-skip-refresh": "true" }, // 👈 evita loops
        });

        const { csrfToken, accessToken } = refreshRes.data;

        if (import.meta.env.DEV) {
          console.log("🔁 Nuevos tokens obtenidos:");
          console.log("   - CSRF:", csrfToken);
          console.log("   - AccessToken:", accessToken);
        }

        // Actualizar estado global
        useAuthStore.getState().setCsrfToken(csrfToken);
        useAuthStore.getState().setAccessToken(accessToken);

        await useAuthStore.getState().fetchSession();

        // Reintentar request original con nuevos headers
        originalRequest.headers = {
          ...originalRequest.headers,
          "x-csrf-token": csrfToken,
          Authorization: `Bearer ${accessToken}`,
        };

        return authApi(originalRequest);
      } catch (refreshError) {
        console.error("❌ [authApi] Refresh-token falló. Cerrando sesión...");

        // Logout silencioso (sin toasts)
        await useAuthStore.getState().logout(true);

        const { clearMenus, setMenuLoaded } = useMenuStore.getState();
        clearMenus();
        setMenuLoaded(false);

        // Redirigir solo si no estamos ya en /signin
        if (window.location.pathname !== "/signin") {
          navigate("/signin");
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default authApi;
