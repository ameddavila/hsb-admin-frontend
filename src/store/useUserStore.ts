// src/stores/useUserStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  userId: string;
  username: string;
  email: string;
  role: string;
}

interface UserStore {
  user: User | null;

  // Setters
  setUser: (user: User | null) => void;
  clearUser: () => void;

  // Getters
  isAdmin: () => boolean;
  hasRole: (role: string | string[]) => boolean;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,

      /**
       * Guarda el usuario en el estado.
       */
      setUser: (user) => {
        if (!user) {
          console.warn("[UserStore] Usuario nulo recibido en setUser.");
          set({ user: null });
          return;
        }

        console.log("[UserStore] setUser =>", user);
        set({ user: { ...user, role: user.role.toLowerCase() } });
      },

      /**
       * Limpia completamente el usuario.
       */
      clearUser: () => {
        console.log("[UserStore] clearUser()");
        set({ user: null });
      },

      /**
       * Retorna `true` si el usuario tiene el rol "administrador".
       */
      isAdmin: () => {
        return get().user?.role?.toLowerCase() === "administrador";
      },

      /**
       * Verifica si el usuario tiene alguno de los roles dados.
       */
      hasRole: (roles) => {
        const currentRole = get().user?.role?.toLowerCase();
        if (!currentRole) return false;

        if (Array.isArray(roles)) {
          return roles.map((r) => r.toLowerCase()).includes(currentRole);
        }
        return roles.toLowerCase() === currentRole;
      },
    }),
    {
      name: "user-storage",
      version: 0,
      partialize: (state) => ({
        user: state.user,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error("[UserStore] Error al rehidratar:", error);
        } else {
          console.log("[UserStore] Rehidratación completada. State:", state);
        }
      },
    }
  )
);
