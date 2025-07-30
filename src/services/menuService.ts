// src/services/menuService.ts
import menuApi from "./menuApi";
import type { MenuNode } from "../types/Menu";
import { useAuthStore } from "@/store/authStore";



export type MenuInput = Omit<MenuNode, "id" | "children">;

export const getMyMenus = async (): Promise<MenuNode[]> => {
  // console.log("📡 Llamando a /menus/tree");

  const csrfToken = useAuthStore.getState().csrfToken;

  const res = await menuApi.get<MenuNode[]>("/menus/tree", {
    headers: {
      "x-csrf-token": csrfToken!,
    },
    withCredentials: true, 
  });

  return res.data;
};

export const createMenu = async (data: Partial<MenuInput>): Promise<MenuNode> => {
  const res = await menuApi.post<MenuNode>("/menus", data);
  return res.data;
};

export const updateMenu = async (
  id: number,
  data: Partial<MenuInput>
): Promise<MenuNode> => {
  const res = await menuApi.put<MenuNode>(`/menus/${id}`, data);
  return res.data;
};

export const deleteMenu = async (id: number): Promise<{ success: boolean }> => {
  const res = await menuApi.delete<{ success: boolean }>(`/menus/${id}`);
  return res.data;
};
