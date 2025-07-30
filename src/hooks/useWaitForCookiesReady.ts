// src/hooks/useWaitForCookiesReady.ts
import { useEffect, useState } from "react";

// 🔒 Cookies HttpOnly no pueden ser leídas por el frontend
const HTTP_ONLY_COOKIES = ["accessToken", "refreshToken"];

/**
 * Hook que espera a que las cookies visibles (no HttpOnly) estén disponibles.
 * Ignora cookies HttpOnly ya que no son accesibles vía JavaScript.
 *
 * @param names Nombres de cookies a esperar (ej. ["csrfToken"])
 * @param maxWaitMs Tiempo máximo a esperar (default: 3000ms)
 * @param checkInterval Intervalo entre chequeos (default: 100ms)
 * @returns `true` si están listas, `false` si falló, `undefined` mientras espera
 */
export const useWaitForCookiesReady = (
  names: string[],
  maxWaitMs = 3000,
  checkInterval = 100
): boolean | undefined => {
  const [ready, setReady] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const pathname = window.location.pathname;

    const isPublicRoute =
      pathname.startsWith("/signin") ||
      pathname.startsWith("/signup") ||
      pathname.startsWith("/recover");

    if (isPublicRoute) {
      console.log("🔓 Ruta pública, cookies no requeridas:", pathname);
      setReady(true);
      return;
    }

    // Filtramos las cookies visibles
    const visibleCookies = names.filter(
      (name) => !HTTP_ONLY_COOKIES.includes(name)
    );

    // Si todas las cookies son HttpOnly, no se puede esperar
    if (visibleCookies.length === 0) {
      console.log("👻 Solo cookies HttpOnly, no se puede verificar desde frontend");
      setReady(true);
      return;
    }

    let waited = 0;
    const intervalId = setInterval(() => {
      const allPresent = visibleCookies.every((name) =>
        document.cookie.includes(`${name}=`)
      );

      if (allPresent) {
        console.log("🍪 Cookies listas:", visibleCookies);
        clearInterval(intervalId);
        setReady(true);
      } else if (waited >= maxWaitMs) {
        const missing = visibleCookies.filter(
          (name) => !document.cookie.includes(`${name}=`)
        );
        console.warn("⏳ Tiempo agotado. Faltan cookies:", missing);
        clearInterval(intervalId);
        setReady(false);
      } else {
        waited += checkInterval;
      }
    }, checkInterval);

    return () => clearInterval(intervalId);
  }, [names.join("|")]); // optimiza re-ejecuciones

  return ready;
};
