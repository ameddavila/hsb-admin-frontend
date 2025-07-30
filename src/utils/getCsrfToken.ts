// src/utils/getCsrfToken.ts
export function getCsrfToken(): string | null {
  return localStorage.getItem("csrfToken");
}
