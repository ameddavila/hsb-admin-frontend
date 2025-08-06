// src/store/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import authApi from "@/services/authApi";
import type { AuthResponse } from "@/types/Auth";
import type { User } from "@/types/User";
import type { MenuNode } from "@/types/Menu";
import { useMenuStore } from "./menuStore";
import { getOrCreateDeviceId } from "@/utils/deviceId";
import { waitForRotatedCsrf } from "@/utils/waitForCookie";

type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  csrfToken: string | null;
  accessToken: string | null;
  roles: string[];
  permissions: string[];
  menus: MenuNode[];

  setUser: (user: User) => void;
  setRoles: (roles: string[]) => void;
  setPermissions: (permissions: string[]) => void;
  setMenus: (menus: MenuNode[]) => void;
  clearUser: () => void;
  setCsrfToken: (token: string) => void;
  setAccessToken: (token: string) => void;

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
      accessToken: null,
      roles: [],
      permissions: [],
      menus: [],

      setUser: (user) => {
        console.log("✅ [setUser] Usuario asignado:", user.username);
        set({
          user,
          isAuthenticated: true,
        });
      },

      setRoles: (roles) => {
        console.log("✅ [setRoles] Asignando roles:", roles);
        set({ roles });
      },

      setPermissions: (permissions) => {
        console.log("✅ [setPermissions] Asignando permisos:", permissions);
        set({ permissions });
      },

      setMenus: (menus) => {
        console.log("✅ [setMenus] Asignando menús:", menus);
        set({ menus });
      },

      setCsrfToken: (token) => {
        if (!token || token === get().csrfToken) return;
        localStorage.setItem("csrfToken", token);
        console.log("🔐 [setCsrfToken] Nuevo token:", token);
        set({ csrfToken: token });
      },

      setAccessToken: (token) => {
        if (!token || token === get().accessToken) return;
        localStorage.setItem("accessToken", token);
        console.log("🔐 [setAccessToken] Nuevo token:", token);
        set({ accessToken: token });
      },

      clearUser: () => {
        console.log("🧹 [clearUser] Limpiando estado y localStorage");
        localStorage.removeItem("csrfToken");
        localStorage.removeItem("accessToken");

        set({
          isAuthenticated: false,
          user: null,
          csrfToken: null,
          accessToken: null,
          roles: [],
          permissions: [],
          menus: [],
        });
      },

      login: async (identifier, password) => {
        try {
          console.log("📤 [login] Iniciando con:", identifier);

          const res = await authApi.post<AuthResponse>(
            "/login",
            {
              identifier,
              password,
              deviceId: getOrCreateDeviceId(),
            },
            {
              withCredentials: true,
            }
          );

          const { csrfToken, accessToken } = res.data;

          get().setCsrfToken(csrfToken);
          get().setAccessToken(accessToken);

          await get().fetchSession();

          console.log("✅ [login] Autenticación completada");
          return true;
        } catch (error) {
          console.error("❌ [login] Error:", error);
          return false;
        }
      },

      logout: async () => {
        try {
          const csrfToken = get().csrfToken ?? localStorage.getItem("csrfToken") ?? "";
          console.log("📤 [logout] Cerrando sesión...");

          await authApi.post(
            "/logout",
            {},
            {
              headers: { "x-csrf-token": csrfToken },
              withCredentials: true,
            }
          );

          console.log("✅ [logout] Éxito");
        } catch (err) {
          console.error("❌ [logout] Fallo al cerrar sesión:", err);
        }

        get().clearUser();

        try {
          const { clearMenus, setMenuLoaded } = useMenuStore.getState();
          clearMenus();
          setMenuLoaded(false);
        } catch (err) {
          console.warn("⚠️ [logout] Error limpiando menús:", err);
        }
      },

      fetchSession: async () => {
        try {
          let csrfToken = get().csrfToken ?? localStorage.getItem("csrfToken") ?? "";

          try {
            const rotated = await waitForRotatedCsrf();
            csrfToken = rotated ?? csrfToken;
          } catch (err) {
            console.log("⚠️ [fetchSession] No se pudo rotar CSRF:", err);
          }

          const accessToken = get().accessToken ?? localStorage.getItem("accessToken") ?? "";

          const res = await authApi.get<AuthResponse>("/me", {
            headers: {
              "x-csrf-token": csrfToken,
              Authorization: `Bearer ${accessToken}`,
            },
            withCredentials: true,
          });

          const { user, roles, permissions, menus } = res.data;

          console.log("👤 [fetchSession] Usuario:", user);
          console.log("🔐 [fetchSession] Roles:", roles);
          console.log("🔑 [fetchSession] Permisos:", permissions);
          console.log("📋 [fetchSession] Menús:", menus);

          get().setUser(user);
          get().setRoles(roles || []);
          get().setPermissions(permissions || []);
          get().setMenus(menus || []);
        } catch (error) {
          console.warn("⚠️ [fetchSession] Sesión inválida:", error);
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
        accessToken: state.accessToken,
        roles: state.roles,
        permissions: state.permissions,
      }),
    }
  )
);
  