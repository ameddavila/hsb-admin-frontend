import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/authStore";
import authApi from "@/services/authApi";

/**
 * Hook para asegurar que el token CSRF esté cargado en Zustand.
 * Solo se ejecuta una vez por sesión autenticada.
 */
export const useCsrf = () => {
  const csrfToken = useAuthStore((s) => s.csrfToken);
  const setCsrfToken = useAuthStore((s) => s.setCsrfToken);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const fetchedRef = useRef(false); // 🔒 Previene múltiples ejecuciones

  useEffect(() => {
    const getToken = async () => {
      if (!isAuthenticated || fetchedRef.current) return;

      // 🌐 Intenta primero recuperar desde localStorage
      const saved = localStorage.getItem("csrfToken");

      if (saved && saved !== csrfToken) {
        console.log("🔁 CSRF recuperado de localStorage:", saved);
        setCsrfToken(saved);
        fetchedRef.current = true;
        return;
      }

      // 🌐 Si no hay token, solicita uno al backend
      try {
        console.log("🌐 Solicitando CSRF desde backend...");
        const res = await authApi.get<{ csrfToken: string }>("/auth/csrf");

        const token = res.data.csrfToken;

        if (token && token !== csrfToken) {
          console.log("🔐 CSRF obtenido del backend:", token);
          setCsrfToken(token);
        }
      } catch (error) {
        console.error("❌ Error al obtener CSRF:", error);
      } finally {
        fetchedRef.current = true;
      }
    };

    getToken();
  }, [isAuthenticated, csrfToken, setCsrfToken]);

  return csrfToken;
};
