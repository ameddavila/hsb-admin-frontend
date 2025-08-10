import userApi from "./userApi";
import type { Permission } from "@/types/Permission";

export const getAllPermissions = async (): Promise<Permission[]> => {
  const res = await userApi.get<{ permissions: Permission[] }>("/permissions");
  return res.data.permissions;
};

export const createPermission = async (name: string): Promise<Permission> => {
  const res = await userApi.post<{ permission: Permission }>("/permissions", { name });
  return res.data.permission;
};

export const getPermissionById = async (id: number): Promise<Permission> => {
  const res = await userApi.get<{ permission: Permission }>(`/permissions/${id}`);
  return res.data.permission;
};
