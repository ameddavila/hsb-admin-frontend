import axios from "axios";
import { waitForRotatedCsrf } from "@/utils/waitForCookie";
import { useAuthStore } from "@/store/authStore";

// 🔧 Crear instancia
const authApi = axios.create({
  baseURL: import.meta.env.VITE_AUTH_SERVICE_URL || "http://localhost:4001/auth",
  withCredentials: true, // Necesario para que se envíen cookies HttpOnly
});

// ✅ Interceptor REQUEST: añade CSRF token si existe
authApi.interceptors.request.use((config) => {
  const csrfToken = useAuthStore.getState().csrfToken;
  if (csrfToken) {
    config.headers = config.headers || {};
    config.headers["x-csrf-token"] = csrfToken;
  }
  return config;
});

// ✅ Interceptor RESPONSE: reintento automático con /refresh si hay 401
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // ⏳ Esperar que el backend escriba nueva cookie csrf
        const rotatedCsrf = await waitForRotatedCsrf();

        // 🔄 Hacer refresh de sesión
        await authApi.post("/refresh", null, {
          headers: { "x-csrf-token": rotatedCsrf },
        });

        // 🔁 Rehidratar estado global
        const { fetchSession } = useAuthStore.getState();
        await fetchSession();

        // ✅ Reintentar el request original con nuevo token
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers["x-csrf-token"] = rotatedCsrf;

        return authApi(originalRequest);
      } catch (err) {
        const { logout } = useAuthStore.getState();
        await logout();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default authApi;
