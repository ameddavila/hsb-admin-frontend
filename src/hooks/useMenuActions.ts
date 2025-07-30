// src/hooks/useMenuActions.ts
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  createMenu,
  updateMenu,
  deleteMenu,
  type MenuInput,
} from "../services/menuService";
import { useMenuStore } from "../store/menuStore";

/**
 * Hook con acciones CRUD para menús usando Zustand y navegación con react-router-dom
 */
export const useMenuActions = () => {
  const navigate = useNavigate();
  const { loadMenus } = useMenuStore();

  const refreshMenus = async () => {
    try {
      await loadMenus();
    } catch {
      toast.error("❌ Error al recargar menús");
    }
  };

  const handleCreateMenu = async (data: MenuInput) => {
    try {
      await createMenu({
        ...data,
        parentId: data.parentId ? Number(data.parentId) : null,
      });
      toast.success("✅ Menú creado correctamente");
      await refreshMenus();
      navigate("/admin/menus");
    } catch (error) {
      toast.error("❌ Error al crear el menú");
      console.error(error);
    }
  };

  const handleUpdateMenu = async (id: number, data: MenuInput) => {
    try {
      await updateMenu(id, {
        ...data,
        parentId: data.parentId ? Number(data.parentId) : null,
      });
      toast.success("✅ Menú actualizado correctamente");
      await refreshMenus();
      navigate("/admin/menus");
    } catch (error) {
      toast.error("❌ Error al actualizar el menú");
      console.error(error);
    }
  };

  const handleDeleteMenu = async (id: number) => {
    try {
      await deleteMenu(id);
      toast.success("✅ Menú eliminado correctamente");
      await refreshMenus();
    } catch (error) {
      toast.error("❌ Error al eliminar el menú");
      console.error(error);
    }
  };

  return {
    handleCreateMenu,
    handleUpdateMenu,
    handleDeleteMenu,
  };
};
