// src/context/auth/AuthProvider.tsx
import { useEffect, useState, ReactNode, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import AuthContext from "./AuthContext";
import { useAuthStore } from "@/store/authStore";
import { waitForRotatedCsrf } from "@/utils/waitForCookie";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    user,
    csrfToken,
    roles,
    permissions,
    login,
    logout,
    fetchSession,
    clearUser,
  } = useAuthStore();

  // 🛡️ Definir rutas públicas que no requieren autenticación
  const isPublicRoute = useCallback(() => {
    const publicRoutes = ["/signin", "/signup", "/reset-password"];
    return publicRoutes.some((route) => location.pathname.startsWith(route));
  }, [location.pathname]);

  // 🔐 Intentar restaurar sesión al cargar
  useEffect(() => {
    const init = async () => {
      if (isPublicRoute()) {
        setLoading(false);
        return;
      }

      try {
        await waitForRotatedCsrf();
        await fetchSession();
        // console.log("✅ Sesión restaurada:", user);
      } catch {
        // console.warn("⚠️ No autenticado, redirigiendo a /signin");
        clearUser();
        navigate("/signin");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [isPublicRoute, fetchSession, clearUser, navigate]);

  // 🧪 Debug Zustand (opcional solo dev)
  // useEffect(() => {
  //   const unsub = useAuthStore.subscribe((state) => {
  //     console.log("🧠 Zustand actualizado:", state);
  //   });
  //   return () => unsub();
  // }, []);

  // 🔐 Login handler
  const handleLogin = async (identifier: string, password: string) => {
    setLoading(true);
    const success = await login(identifier, password);
    setLoading(false);

    if (success) {
      toast.success("✅ Bienvenido");
      navigate("/");
    } else {
      toast.error("❌ Credenciales inválidas");
    }
  };

  // 🔓 Logout handler
  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        csrfToken,
        roles,
        permissions,
        handleLogin,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
