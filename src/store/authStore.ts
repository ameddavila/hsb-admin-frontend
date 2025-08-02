// src/store/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import authApi from "@/services/authApi";
import type { AuthResponse } from "@/types/Auth";
import type { User } from "@/types/User";
import type { MenuNode } from "@/types/Menu";
import { useMenuStore } from "./menuStore";

type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  csrfToken: string | null;
  roles: string[];
  permissions: string[];
  menus: MenuNode[];

  setUser: (user: User) => void;
  setMenus: (menus: MenuNode[]) => void;
  clearUser: () => void;
  setCsrfToken: (token: string) => void;

  login: (identifier: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  fetchSession: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      csrfToken: null,
      roles: [],
      permissions: [],
      menus: [],

      setUser: (user) => {
        set({
          user,
          isAuthenticated: true,
          roles: Array.isArray(user.roles)
            ? user.roles.map((r) => (typeof r === "string" ? r : r.name))
            : [],
          permissions: user.permissions ?? [],
        });
      },

      setMenus: (menus) => set({ menus }),

      clearUser: () => {
        localStorage.removeItem("csrfToken");
        set({
          isAuthenticated: false,
          user: null,
          csrfToken: null,
          roles: [],
          permissions: [],
          menus: [],
        });
      },

      setCsrfToken: (token) => {
        if (!token || token === get().csrfToken) return;
        localStorage.setItem("csrfToken", token);
        set({ csrfToken: token });
      },

      login: async (identifier, password) => {
        try {
          console.log("📤 Iniciando login:", identifier);

          // Obtener token CSRF del backend
          const { data } = await authApi.get<{ csrfToken: string }>("/csrf");
          get().setCsrfToken(data.csrfToken);

          const res = await authApi.post<AuthResponse>(
            "/login",
            { identifier, password },
            {
              headers: { "x-csrf-token": data.csrfToken },
              withCredentials: true,
            }
          );

          const { user, csrfToken } = res.data;

          set({
            isAuthenticated: true,
            user,
            csrfToken,
            roles: Array.isArray(user.roles)
              ? user.roles.map((r) => (typeof r === "string" ? r : r.name))
              : [],
            permissions: user.permissions ?? [],
            menus: [],
          });

          if (csrfToken) localStorage.setItem("csrfToken", csrfToken);

          console.log("✅ Login exitoso:", user);
          return true;
        } catch (error) {
          console.error("❌ Error en login:", error);
          return false;
        }
      },

      logout: async () => {
        try {
          const { data } = await authApi.get<{ csrfToken: string }>("/csrf");
          get().setCsrfToken(data.csrfToken);

          await authApi.post(
            "/logout",
            {},
            {
              headers: { "x-csrf-token": data.csrfToken },
              withCredentials: true,
            }
          );

          console.log("✅ Logout exitoso");
        } catch (err) {
          console.error("❌ Error al cerrar sesión:", err);
        }

        set({
          isAuthenticated: false,
          user: null,
          csrfToken: null,
          roles: [],
          permissions: [],
        });

        localStorage.removeItem("csrfToken");

        try {
          const { clearMenus, setMenuLoaded } = useMenuStore.getState();
          clearMenus();
          setMenuLoaded(false);
        } catch (err) {
          console.warn("⚠️ No se pudo limpiar menú:", err);
        }
      },

      fetchSession: async () => {
        try {
          const csrfToken = get().csrfToken;
          const res = await authApi.get<AuthResponse>("/me", {
            headers: { "x-csrf-token": csrfToken ?? "" },
            withCredentials: true,
          });

          const { user } = res.data;

          set({
            isAuthenticated: true,
            user,
            roles: Array.isArray(user.roles)
              ? user.roles.map((r) => (typeof r === "string" ? r : r.name))
              : [],
            permissions: user.permissions ?? [],
          });
        } catch (error) {
          console.warn("⚠️ Sesión inválida:", error);
          await get().logout();
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user
          ? {
              id: state.user.id,
              username: state.user.username,
              email: state.user.email,
              profileImage: state.user.profileImage ?? null,
            }
          : null,
        csrfToken: state.csrfToken,
        roles: state.roles,
        permissions: state.permissions,
      }),
    }
  )
);
