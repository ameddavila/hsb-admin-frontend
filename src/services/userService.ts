// src/services/userService.ts
import userApi from "./userApi";
import type { User } from "@/types/User";
import type { AxiosErrorResponse } from "@/types/AxiosError";
import { waitForRotatedCsrf } from "@/utils/waitForCookie";
import { useAuthStore } from "@/store/authStore";

/**
 * 🔍 Obtener todos los usuarios
 */
export const getUsers = async (): Promise<User[]> => {
  console.log("📡 [userService] GET /users");

  const res = await userApi.get<User[]>("/users");

  console.log("📦 Usuarios recibidos:", res.data.length);
  return res.data;
};

/**
 * 🔍 Obtener un usuario por ID (✅ Incluye CSRF + Auth headers)
 */
export const getUserById = async (id: string): Promise<User> => {
  console.log(`📡 [userService] GET /users/${id}`);

  try {
    const csrfToken = await waitForRotatedCsrf();
    const { accessToken } = useAuthStore.getState();

    const res = await userApi.get<{ user: User }>(`/users/${id}`, {
      headers: {
        "x-csrf-token": csrfToken,
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });

    console.log("📦 Usuario recibido:", res.data.user.username);
    return res.data.user;
  } catch (error) {
    const err = error as AxiosErrorResponse;
    console.error("❌ [userService] Error al obtener usuario:", err.response?.data || err.message);
    throw error;
  }
};

/**
 * ✍️ Crear un nuevo usuario (formData)
 */
export const createUser = async (formData: FormData): Promise<User> => {
  console.log("📤 [userService] POST /users");

  try {
    const csrfToken = await waitForRotatedCsrf();
    const { accessToken } = useAuthStore.getState();

    const res = await userApi.post<{ user: User }>("/users", formData, {
      headers: {
        "x-csrf-token": csrfToken,
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });

    console.log("✅ Usuario creado:", res.data.user.username);
    return res.data.user;
  } catch (error: unknown) {
    const err = error as AxiosErrorResponse;
    console.error("❌ [userService] Error al crear usuario:", err.response?.data || err.message);
    throw error;
  }
};

/**
 * ✏️ Actualizar un usuario (formData)
 */
export const updateUser = async (id: string, formData: FormData): Promise<User> => {
  console.log(`📤 [userService] PUT /users/${id}`);

  try {
    const csrfToken = await waitForRotatedCsrf();
    const { accessToken } = useAuthStore.getState();

    const res = await userApi.put<{ user: User }>(`/users/${id}`, formData, {
      headers: {
        "x-csrf-token": csrfToken,
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });

    console.log("✅ Usuario actualizado:", res.data.user.username);
    return res.data.user;
  } catch (error: unknown) {
    const err = error as AxiosErrorResponse;
    console.error("❌ [userService] Error al actualizar usuario:", err.response?.data || err.message);
    throw error;
  }
};

/**
 * 🔄 Activar o desactivar usuario
 */
export const toggleUserActive = async (id: string, isActive: boolean): Promise<User> => {
  console.log(`📤 [userService] PATCH /users/${id}/status`, { isActive });

  try {
    const csrfToken = await waitForRotatedCsrf();
    const { accessToken } = useAuthStore.getState();

    const res = await userApi.patch<{ user: User }>(
      `/users/${id}/status`,
      { isActive },
      {
        headers: {
          "x-csrf-token": csrfToken,
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      }
    );

    console.log("✅ Usuario activado/desactivado:", res.data.user.username);
    return res.data.user;
  } catch (error: unknown) {
    const err = error as AxiosErrorResponse;
    console.error("❌ [userService] Error en toggleUserActive:", err.response?.data || err.message);
    throw error;
  }
};
