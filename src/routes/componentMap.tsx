// src/routes/componentMap.ts
import UsuarioList from "@/pages/Usuarios/UsuariosList";
import UsuarioForm from "@/pages/Usuarios/UsuarioForm";

// import MenuList from "@/pages/Menus/MenuList";

// import DispositivoList from "@/pages/Dispositivos/DispositivoList";
// import EmpleadoList from "@/pages/Empleados/EmpleadoList";
// import EmpleadoForm from "@/pages/Empleados/EmpleadoForm";

// import Sincronizacion from "@/pages/Empleados/Sincronizacion";
// import ReporteList from "@/pages/Reportes/ReporteList";

// Mapa de rutas a componentes funcionales (no JSX.Element)
export const componentMap: Record<string, React.FC> = {
  "/administracion/usuarios": UsuarioList,
  "/administracion/usuarios/nuevo": UsuarioForm,
  "/administracion/usuarios/editar/:id": UsuarioForm,

  // "/administracion/menus": MenuList,

  // "/rrhh/dispositivos": DispositivoList,

  // "/rrhh/empleados": EmpleadoList,
  // "/rrhh/empleados/nuevo": EmpleadoForm,
  // "/rrhh/empleados/editar/:id": EmpleadoForm,

  // "/rrhh/sincronizacion": Sincronizacion,
  // "/rrhh/reportes": ReporteList,
};
