import axios from "axios";
import { getCookie } from "@/utils/cookie";
import { waitForRotatedCsrf } from "@/utils/waitForCookie";
import { useAuthStore } from "@/store/authStore";

const menuApi = axios.create({
  baseURL: import.meta.env.VITE_MENU_SERVICE_URL || "/api/menus",
  withCredentials: true,
});

menuApi.interceptors.request.use((config) => {
  const { csrfToken } = useAuthStore.getState();
   config.headers = config.headers || {};
  config.headers["x-csrf-token"] =
    csrfToken || getCookie("csrfToken") || getCookie("_csrf") || "";
  return config;
});

menuApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const csrfToken = await waitForRotatedCsrf();
        await axios.post(
          import.meta.env.VITE_AUTH_SERVICE_URL + "/refresh",
          null,
          {
            headers: { "x-csrf-token": csrfToken },
            withCredentials: true,
          }
        );
        const { fetchSession } = useAuthStore.getState();
        await fetchSession();
        originalRequest.headers["x-csrf-token"] = csrfToken;
        return menuApi(originalRequest);
      } catch (err) {
        const { logout } = useAuthStore.getState();
        await logout();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default menuApi;
