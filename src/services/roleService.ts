import userApi from "./userApi";
import axios from "axios";
import type { Role } from "@/types/Role";

export const getPublicRoles = async (): Promise<Role[]> => {
  const res = await axios.get<{ roles: Role[] }>(
    import.meta.env.VITE_USER_SERVICE_URL + "/public/roles"
  );
  return res.data.roles;
};

export const getAllRoles = async (): Promise<Role[]> => {
  const res = await userApi.get<{ roles: Role[] }>("/roles");
  return res.data.roles;
};

export const createRole = async (data: { name: string; description?: string }): Promise<Role> => {
  const res = await userApi.post<{ role: Role }>("/roles", data);
  return res.data.role;
};

export const getRoleById = async (id: number): Promise<Role> => {
  const res = await userApi.get<{ role: Role }>(`/roles/${id}`);
  return res.data.role;
};
