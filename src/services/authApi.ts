// src/services/authApi.ts
import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import { useMenuStore } from "@/store/menuStore";
import { RefreshResponse } from "@/types/Auth";
import { navigate } from "@/utils/navigate"; // ✅ redirección global opcional

const authApi = axios.create({
  baseURL: import.meta.env.VITE_AUTH_SERVICE_URL || "http://localhost:4001/auth",
  withCredentials: true,
});

// ✅ Interceptor REQUEST: añade CSRF token y Authorization si existen
authApi.interceptors.request.use((config) => {
  const { csrfToken, accessToken } = useAuthStore.getState();

  config.headers = config.headers || {};

  if (csrfToken) {
    console.log("📤 [authApi] Usando CSRF token:", csrfToken);
    config.headers["x-csrf-token"] = csrfToken;
  }

  if (accessToken) {
    console.log("🔐 [authApi] Usando AccessToken en Authorization header");
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }

  return config;
});

// ✅ Interceptor RESPONSE: si 401 → reintenta con /refresh-token
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      console.warn("⚠️ [authApi] Recibido 401. Intentando /refresh-token...");

      try {
        const refreshRes = await authApi.post<RefreshResponse>("/refresh-token", null, {
          withCredentials: true,
        });

        const { csrfToken, accessToken } = refreshRes.data;

        console.log("🔁 [authApi] Nuevos tokens obtenidos vía /refresh-token");
        console.log("🧪 Nuevo CSRF:", csrfToken);
        console.log("🧪 Nuevo AccessToken:", accessToken);

        useAuthStore.getState().setCsrfToken(csrfToken);
        useAuthStore.getState().setAccessToken(accessToken);

        // Rehidratar sesión
        await useAuthStore.getState().fetchSession();

        // Actualizar headers del request original
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers["x-csrf-token"] = csrfToken;
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

        console.log("🔁 [authApi] Reintentando request original con nuevos tokens...");
        return authApi(originalRequest);
      } catch (err) {
        console.error("❌ [authApi] Falló refresh-token. Cerrando sesión...");

        // Evita ciclo infinito
        useAuthStore.getState().clearUser();

        // Limpiar menú también
        const { clearMenus, setMenuLoaded } = useMenuStore.getState();
        clearMenus();
        setMenuLoaded(false);

        // Redirigir manualmente
        navigate("/signin");

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default authApi;
