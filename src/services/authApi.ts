import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const authApi = axios.create({
  baseURL: import.meta.env.VITE_API_AUTH || "http://localhost:4001",
  withCredentials: true,
});

authApi.interceptors.request.use((config) => {
  const csrfToken = useAuthStore.getState().csrfToken;
  if (!config.headers) config.headers = {};
  if (csrfToken) {
    config.headers["x-csrf-token"] = csrfToken;
  }
  return config;
});

export default authApi;
