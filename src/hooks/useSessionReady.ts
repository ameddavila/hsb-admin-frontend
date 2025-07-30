import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";

/**
 * Hook para detectar cuándo la sesión está completamente lista.
 * Retorna `true` si:
 *  - ya hay un usuario autenticado en el store, O
 *  - se dispara el evento global "session-ready"
 */
export function useSessionReady() {
  const [ready, setReady] = useState(false);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!ready && user) {
      console.log("🟢 useSessionReady => usuario ya presente => setReady(true)");
      setReady(true);
    }
  }, [user, ready]);

  useEffect(() => {
    const handleReady = () => {
      if (!ready) {
        console.log("✅ Evento 'session-ready' capturado => setReady(true)");
        setReady(true);
      }
    };

    window.addEventListener("session-ready", handleReady);
    return () => window.removeEventListener("session-ready", handleReady);
  }, [ready]);

  return ready;
}
