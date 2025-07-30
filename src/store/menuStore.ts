// src/store/menuStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getMyMenus } from "@/services/menuService";
import { waitForRotatedCsrf } from "@/utils/waitForCookie";
import type { MenuNode } from "@/types/Menu";

type MenuState = {
  menus: MenuNode[];
  menuLoaded: boolean;

  // Actions
  setMenus: (menus: MenuNode[]) => void;
  clearMenus: () => void;
  setMenuLoaded: (loaded: boolean) => void;
  loadMenus: () => Promise<void>;
};

export const useMenuStore = create<MenuState>()(
  persist(
    (set) => ({
      menus: [],
      menuLoaded: false,

      setMenus: (menus) => {
        console.log("💾 Guardando menús en Zustand:", menus);
        set({ menus });
      },

      clearMenus: () => {
        console.log("🧹 Limpiando menús y estado de carga");
        set({ menus: [], menuLoaded: false });
      },

      setMenuLoaded: (loaded) => {
        console.log("📍 Estado de menuLoaded:", loaded);
        set({ menuLoaded: loaded });
      },

      loadMenus: async () => {
        try {
          console.log("⌛ Esperando token CSRF para cargar menús...");
          const token = await waitForRotatedCsrf();

          if (!token) {
            console.warn("⚠️ Token CSRF no disponible. Abortando carga de menús.");
            set({ menus: [], menuLoaded: false });
            return;
          }

          const menus = await getMyMenus();
          console.log("📥 Menús cargados desde loadMenus:", menus);
          set({ menus, menuLoaded: true });
        } catch (error) {
          console.error("❌ Error al cargar menús:", error);
          set({ menus: [], menuLoaded: false });
        }
      },
    }),
    {
      name: "menu-storage",
      partialize: (state) => ({
        menus: state.menus,
        menuLoaded: state.menuLoaded,
      }),
      onRehydrateStorage: () => () => {
        console.log("🔄 Rehidratando menuStore desde storage...");
      },
    }
  )
);
