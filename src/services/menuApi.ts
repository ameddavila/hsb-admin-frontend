// src/services/menuApi.ts
import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import { useMenuStore } from "@/store/menuStore";
import { waitForRotatedCsrf } from "@/utils/waitForCookie";
import { navigate } from "@/utils/navigate";
import type { RefreshResponse } from "@/types/Auth";

const menuApi = axios.create({
  baseURL: import.meta.env.VITE_MENU_SERVICE_URL,
  withCredentials: true,
});

// ✅ Interceptor REQUEST
menuApi.interceptors.request.use((config) => {
  const { csrfToken, accessToken } = useAuthStore.getState();
  config.headers = config.headers || {};

  if (csrfToken) {
    if (import.meta.env.DEV) {
      console.log("📤 [menuApi] Usando CSRF token:", csrfToken);
    }
    config.headers["x-csrf-token"] = csrfToken;
  }

  if (accessToken) {
    if (import.meta.env.DEV) {
      console.log("🔐 [menuApi] Usando AccessToken");
    }
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }

  return config;
});

// ✅ Interceptor RESPONSE
menuApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;

    const skipRetry =
      originalRequest._retry ||
      originalRequest?.headers?.["x-skip-refresh"] === "true" ||
      originalRequest?.url?.includes("/login") ||
      originalRequest?.url?.includes("/logout") ||
      originalRequest?.url?.includes("/refresh-token");

    if (status === 401 && !skipRetry) {
      originalRequest._retry = true;

      if (import.meta.env.DEV) {
        console.warn("⚠️ [menuApi] 401 detectado. Intentando refresh-token...");
      }

      try {
        const rotatedCsrf = await waitForRotatedCsrf();

        const refreshRes = await axios.post<RefreshResponse>(
          import.meta.env.VITE_AUTH_SERVICE_URL + "/refresh-token",
          null,
          {
            headers: {
              "x-csrf-token": rotatedCsrf,
              "x-skip-refresh": "true", // ✅ evita loops
            },
            withCredentials: true,
          }
        );

        const { csrfToken, accessToken } = refreshRes.data;

        useAuthStore.getState().setCsrfToken(csrfToken);
        useAuthStore.getState().setAccessToken(accessToken);
        await useAuthStore.getState().fetchSession();

        originalRequest.headers = {
          ...originalRequest.headers,
          "x-csrf-token": csrfToken,
          Authorization: `Bearer ${accessToken}`,
        };

        if (import.meta.env.DEV) {
          console.log("🔁 [menuApi] Reintentando request original...");
        }

        return menuApi(originalRequest);
      } catch (err) {
        console.error("❌ [menuApi] Falló refresh-token. Cerrando sesión...");

        useAuthStore.getState().clearUser();
        const { clearMenus, setMenuLoaded } = useMenuStore.getState();
        clearMenus();
        setMenuLoaded(false);

        if (window.location.pathname !== "/signin") {
          navigate("/signin");
        }

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default menuApi;
