import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { waitForRotatedCsrf } from "@/utils/waitForCookie";
import authApi from "@/services/authApi";

/**
 * Programa la renovación de sesión cada X minutos.
 * Se cancela automáticamente cuando el usuario cierra sesión.
 */
export function useAutoRefresh(intervalMs = 14 * 60 * 1000) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const fetchSession = useAuthStore((s) => s.fetchSession);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    if (!isAuthenticated) return;

    const id = window.setInterval(async () => {
      try {
        // lee el CSRF rotado por si el backend generó uno nuevo
        const rotatedCsrf = await waitForRotatedCsrf();
        // refresca los tokens (access y csrf) en el backend
        await authApi.post("/refresh-token", null, {
          headers: { "x-csrf-token": rotatedCsrf ?? "" },
          withCredentials: true,
        });
        // actualiza el estado de la sesión en el frontend
        await fetchSession();
      } catch (err) {
        console.log("[useAutoRefresh]",err)
        // si algo falla, cierra la sesión
        await logout();
      }
    }, intervalMs);

    return () => clearInterval(id);
  }, [isAuthenticated, fetchSession, logout, intervalMs]);
}
