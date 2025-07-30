// src/services/menuApi.ts
import axios from "axios";

/**
 * Extrae el valor de csrfToken desde las cookies del navegador
 */
const getCsrfTokenFromCookie = (): string | null => {
  const match = document.cookie.match(/(?:^|;\s*)csrfToken=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
};

const menuApi = axios.create({
  baseURL: import.meta.env.VITE_API_MENU,
  withCredentials: true,
});

// Interceptor para agregar el token CSRF a cada solicitud
menuApi.interceptors.request.use((config) => {
  const csrfToken = getCsrfTokenFromCookie();
  if (csrfToken && config.headers) {
    config.headers["x-csrf-token"] = csrfToken;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default menuApi;
