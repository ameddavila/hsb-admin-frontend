import axios from "axios";
//import { useAuthStore } from "@/store/authStore";
import { getCookie } from "@/utils/cookie";

const userApi = axios.create({
  baseURL: import.meta.env.VITE_API_USERS + "/api", // ✅ /api agregado
  withCredentials: true, // ✅ necesario para cookies HttpOnly
});

userApi.interceptors.request.use((config) => {
  //const csrfToken = useAuthStore.getState().csrfToken;
  const csrfToken = getCookie("csrfToken");
  if (!config.headers) config.headers = {};
  if (csrfToken) {
    config.headers["x-csrf-token"] = csrfToken;
  }
  return config;
});

export default userApi;
