// src/utils/waitForCookie.ts
import Cookies from "js-cookie";
import { useAuthStore } from "@/store/authStore";

// Esta utilidad sincroniza el token CSRF que está en la cookie (_csrf)
// y lo guarda en Zustand si es nuevo. Úsalo justo antes de hacer un POST/PUT/DELETE.
export const waitForRotatedCsrf = async (): Promise<string | null> => {
  const cookieToken = Cookies.get("_csrf");

  if (cookieToken) {
    console.log("🍪 Token CSRF desde cookie:", cookieToken);

    const currentToken = useAuthStore.getState().csrfToken;
    if (cookieToken !== currentToken) {
      console.log("🔁 Token CSRF actualizado desde cookie");
      useAuthStore.getState().setCsrfToken(cookieToken);
    }

    return cookieToken;
  }

  console.warn("⚠️ No se encontró la cookie _csrf");
  return null;
};
