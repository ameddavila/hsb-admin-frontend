import axios from "axios";
import { getCookie } from "@/utils/cookie";
import { waitForRotatedCsrf } from "@/utils/waitForCookie";
import { useAuthStore } from "@/store/authStore";

const userApi = axios.create({
  baseURL: import.meta.env.VITE_USER_SERVICE_URL || "/api/users",
  withCredentials: true,
});

userApi.interceptors.request.use((config) => {
  const { csrfToken } = useAuthStore.getState();
   config.headers = config.headers || {};
  config.headers["x-csrf-token"] =
    csrfToken || getCookie("csrfToken") || getCookie("_csrf") || "";
  return config;
});

userApi.interceptors.response.use(
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
        return userApi(originalRequest);
      } catch (err) {
        const { logout } = useAuthStore.getState();
        await logout();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default userApi;
