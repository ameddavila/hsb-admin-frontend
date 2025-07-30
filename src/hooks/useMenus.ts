import { useEffect, useState, useCallback } from "react";
import { getMyMenus } from "@/services/menuService";
import { useAuthStore } from "@/store/authStore";
import { useMenuStore } from "@/store/menuStore";
import type { MenuNode } from "@/types/Menu";
import { waitForRotatedCsrf } from "@/utils/waitForCookie";

// 🧠 Detectar persistencia Zustand
type PersistStore = {
  persist?: {
    onFinishHydration?: (cb: () => void) => void;
  };
};

function hasHydration<T extends object>(store: unknown): store is T & PersistStore {
  return (
    typeof store === "object" &&
    store !== null &&
    "persist" in store &&
    typeof (store as PersistStore).persist?.onFinishHydration === "function"
  );
}

export const useMenus = () => {
  const { user, isAuthenticated, setMenus: setAuthMenus } = useAuthStore();
  const {
    menus,
    setMenus,
    clearMenus,
    setMenuLoaded,
    menuLoaded,
  } = useMenuStore();

  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔁 Cargar menús desde backend
  const fetchMenus = useCallback(async (context = "default") => {
    try {
      setLoading(true);
      console.log(`📡 Cargando menús desde backend (${context})...`);

      await waitForRotatedCsrf(); // Asegura CSRF válido
      const menuTree: MenuNode[] = await getMyMenus();

      console.log("🌳 Menús recibidos:", menuTree);
      setMenus(menuTree);
      setAuthMenus(menuTree);
      setMenuLoaded(true);
    } catch (err) {
      console.error("❌ Error al cargar menús:", err);
      clearMenus();
      setMenuLoaded(false);
    } finally {
      setLoading(false);
    }
  }, [setMenus, clearMenus, setMenuLoaded, setAuthMenus]);

  // ✅ Esperar persistencia Zustand
  useEffect(() => {
    const store = useMenuStore as unknown;

    if (hasHydration(store)) {
      store.persist!.onFinishHydration?.(() => {
        console.log("💾 Zustand rehidratado (menuStore)");
        setHydrated(true);

        const auth = useAuthStore.getState();
        const currentMenus = useMenuStore.getState().menus;

        if (auth.isAuthenticated && auth.user) {
          if (currentMenus.length === 0) {
            console.log("🚀 Menús vacíos tras rehidratación. Forzando fetchMenus...");
            fetchMenus("rehydrated");
          } else {
            console.log("✅ Menús restaurados desde persistencia");
          }
        }
      });
    } else {
      console.warn("⚠️ No se detectó persistencia en menuStore");
      setHydrated(true);
    }
  }, [fetchMenus]);

  // ⏳ Ejecutar carga si sesión + menús no cargados
  useEffect(() => {
    const readyToFetch =
      hydrated && isAuthenticated && user && (!menuLoaded || menus.length === 0);
    /*
    console.log("🔄 Evaluando carga de menús...");
    console.log("  hydrated:", hydrated);
    console.log("  isAuthenticated:", isAuthenticated);
    console.log("  user:", user);
    console.log("  menuLoaded:", menuLoaded);
    console.log("  menus.length:", menus.length);
    */
    if (readyToFetch) {
      fetchMenus("session-ready");
    } else {
      /*
      if (hydrated && menus.length > 0) {
        console.log("✅ Menús ya disponibles, sin recarga");
      }*/
      setLoading(false);
    }
  }, [hydrated, user, isAuthenticated, menuLoaded, menus.length, fetchMenus]);

  return {
    menus,
    loading,
    fetchMenus,
  };
};
