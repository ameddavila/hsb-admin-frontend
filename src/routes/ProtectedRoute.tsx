import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: string[];
  requiredPermissions?: string[];
}

export default function ProtectedRoute({
  children,
  requiredRoles = [],
  requiredPermissions = [],
}: ProtectedRouteProps) {
  const { isAuthenticated, roles, permissions } = useAuthStore();
  const location = useLocation();

  //console.log("[ProtectedRoute] Evaluando acceso a:", location.pathname);
  /*
  console.log("Estado:", {
    isAuthenticated,
    userRoles: roles,
    userPermissions: permissions,
    requiredRoles,
    requiredPermissions,
  });*/

  if (!isAuthenticated) {
    console.warn("🔒 Usuario no autenticado. Redirigiendo a /signin");
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Comparar roles (case-insensitive)
  const hasRequiredRole =
    requiredRoles.length === 0 ||
    requiredRoles.some((role) =>
      roles.map((r) => r.toLowerCase()).includes(role.toLowerCase())
    );

  if (!hasRequiredRole) {
    console.warn("⛔ Usuario no tiene roles requeridos. Redirigiendo a /unauthorized");
    return <Navigate to="/unauthorized" replace />;
  }

  // Comparar permisos (case-insensitive)
  const hasRequiredPermission =
    requiredPermissions.length === 0 ||
    requiredPermissions.some((perm) =>
      permissions.map((p) => p.toLowerCase()).includes(perm.toLowerCase())
    );

  if (!hasRequiredPermission) {
    console.warn("⛔ Usuario no tiene permisos requeridos. Redirigiendo a /unauthorized");
    return <Navigate to="/unauthorized" replace />;
  }

  //console.log("✅ Acceso permitido a:", location.pathname);
  return children;
}
