// src/routes/DynamicRoutes.tsx
import { type JSX } from "react";
import { Route } from "react-router-dom";
import { componentMap } from "./componentMap";
import ProtectedRoute from "./ProtectedRoute";
import { flattenMenuTree } from "@/utils/flattenMenuTree";
import { useMenuStore } from "@/store/menuStore";

export default function DynamicRoutes(): JSX.Element[] {
  const { menus, menuLoaded } = useMenuStore();

  // Evitar renderizar rutas si los menús aún no están cargados (por ejemplo tras F5)
  if (!menuLoaded) {
   // console.log("⏳ Esperando carga de menús en DynamicRoutes...");
    return [];
  }

  const flatMenus = flattenMenuTree(menus || []);

  //console.log("📦 Menús planos desde Zustand:", flatMenus.map((m) => m.path));

  const uniquePaths = new Set<string>();

  return flatMenus
    .map((menu) => {
      const path = menu.path;
      if (!path || uniquePaths.has(path)) {
        console.warn("⛔ Ruta omitida por duplicado o inválida:", path);
        return null;
      }

      uniquePaths.add(path);

      const basePath = path.includes("/:") ? path.split("/:")[0] : path;
      const Component = componentMap[basePath] ?? componentMap[path];

      if (!Component) {
        console.warn("⚠️ Ruta sin componente asignado:", path);
        return null;
      }

     // console.log("✅ Ruta registrada:", path);

      return (
        <Route
          key={path}
          path={path}
          element={
            <ProtectedRoute
              requiredRoles={["Administrador"]}
              requiredPermissions={menu.permission ? [menu.permission] : []}
            >
              <Component />
            </ProtectedRoute>
          }
        />
      );
    })
    .filter((route): route is JSX.Element => route !== null);
}
