// src/services/authService.ts
import authApi from "./authApi";
import { AuthResponse } from "@/types/Auth"; 

export const login = async (
  identifier: string,
  password: string
): Promise<AuthResponse> => {
  const res = await authApi.post<AuthResponse>("/login", {
    identifier,
    password,
  });

  // ✅ Ahora TypeScript sabe que res.data.csrfToken existe
  //localStorage.setItem("csrfToken", res.data.csrfToken);

  return res.data;
};
/*
export const getSession = async () => {
  const res = await authApi.get("/auth/me");
  return res.data;
};
*/