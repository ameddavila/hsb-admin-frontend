// src/services/userService.ts

import userApi from "./userApi";
import { User } from "@/types/User";

/**
 * ✅ Obtener todos los usuarios
 * Retorna directamente un arreglo de usuarios
 * Se espera que el backend responda con: User[]
 */
export const getUsers = async (): Promise<User[]> => {
  console.log("📡 Llamando a /users desde getUsers()");

  // Tipado explícito como arreglo de usuarios
  const res = await userApi.get<User[]>("/users");

  console.log("📨 Respuesta:", res.data);
  return res.data; // res.data ya es User[]
};

/**
 * ✅ Obtener un usuario por ID
 * Se espera que el backend responda con: { user: User }
 */
export const getUserById = async (id: string): Promise<User> => {
  const res = await userApi.get<{ user: User }>(`/users/${id}`);
  return res.data.user;
};

/**
 * ✅ Crear nuevo usuario (con imagen de perfil)
 * Enviar un FormData con los campos y la imagen
 * El backend debe responder con: { user: User }
 */
export const createUser = async (formData: FormData): Promise<User> => {
  const res = await userApi.post<{ user: User }>("/users", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data.user;
};

/**
 * ✅ Actualizar un usuario existente (con imagen de perfil)
 * El backend debe responder con: { user: User }
 */
export const updateUser = async (id: string, formData: FormData): Promise<User> => {
  const res = await userApi.put<{ user: User }>(`/users/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data.user;
};

//activar/dasactivar usuario
export const toggleUserActive = async (id: string, isActive: boolean): Promise<User> => {
  const res = await userApi.patch<{ user: User }>(`/users/${id}/status`, { isActive });
  return res.data.user;
};