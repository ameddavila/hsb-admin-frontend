// src/utils/waitForRotatedCsrf.ts
import { getCookie } from "./cookie";
import { useAuthStore } from "@/store/authStore";

/**
 * Espera hasta que la cookie csrfToken o _csrf sea visible (usualmente después de /auth/refresh)
 * Fallback: 3 segundos de espera máxima.
 */
export const waitForRotatedCsrf = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const maxRetries = 50;
    let tries = 0;

    const interval = setInterval(() => {
      const rotatedToken = getCookie("csrfToken") || getCookie("_csrf");

      if (rotatedToken) {
        const { csrfToken, setCsrfToken } = useAuthStore.getState();

        if (csrfToken !== rotatedToken) {
          setCsrfToken(rotatedToken);
        }

        clearInterval(interval);
        resolve(rotatedToken);
      }

      tries++;
      if (tries >= maxRetries) {
        clearInterval(interval);
        reject(new Error("Timeout esperando token CSRF"));
      }
    }, 100);
  });
};
