// src/hooks/useUserIsReady.ts
import { useEffect, useState } from "react";
import { useSessionReady } from "./useSessionReady";
import { useAuthStore } from "../store/authStore";

/**
 * Hook combinado que indica si el usuario está listo para usarse
 * y devuelve también el user desde Zustand.
 */
export function useUserIsReady() {
  const user = useAuthStore((state) => state.user);
  const sessionReady = useSessionReady();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const ready = hydrated && sessionReady && !!user;

  return {
    user,
    ready,
    hydrated,
    sessionReady,
  };
}
