// src/services/csrfService.ts
import authApi from "./authApi";

interface CsrfResponse {
  csrfToken: string;
}

export const getCsrfToken = async (): Promise<string | null> => {
  try {
    const res = await authApi.get<CsrfResponse>("/csrf");
    return res.data.csrfToken ?? null;
  } catch (error) {
    console.error("❌ Error al obtener CSRF:", error);
    return null;
  }
};
