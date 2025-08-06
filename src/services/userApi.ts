import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import { useMenuStore } from "@/store/menuStore";
import { waitForRotatedCsrf } from "@/utils/waitForCookie";
import { navigate } from "@/utils/navigate";
import { RefreshResponse } from "@/types/Auth";

// 📦 Instancia Axios para user-service
const userApi = axios.create({
  baseURL: import.meta.env.VITE_USER_SERVICE_URL || "http://localhost:4002/api/users",
  withCredentials: true,
});

// ✅ Interceptor REQUEST: añade CSRF y AccessToken si están disponibles
userApi.interceptors.request.use((config) => {
  const { csrfToken, accessToken } = useAuthStore.getState();
  config.headers = config.headers || {};

  if (csrfToken) {
    console.log("🧪 [userApi] Usando CSRF token:", csrfToken);
    config.headers["x-csrf-token"] = csrfToken;
  }

  if (accessToken) {
    console.log("🔐 [userApi] Usando AccessToken en Authorization header");
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }

  return config;
});

// ✅ Interceptor RESPONSE: intenta refresh si hay 401 una vez
userApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        console.warn("[userApi] ❗401 detectado. Intentando refresh...");

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
        useAuthStore.getState().setCsrfToken(newCsrf);

        await useAuthStore.getState().fetchSession();

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers["x-csrf-token"] = newCsrf;

        return userApi(originalRequest);
      } catch (err) {
        console.error("❌ Falló el refresh desde userApi:", err);

        useAuthStore.getState().clearUser();
        const { clearMenus, setMenuLoaded } = useMenuStore.getState();
        clearMenus();
        setMenuLoaded(false);

        navigate("/signin");
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default userApi;
