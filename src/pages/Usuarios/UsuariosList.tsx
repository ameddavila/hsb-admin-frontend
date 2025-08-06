import { useEffect, useState } from "react";
import { getUsers, toggleUserActive } from "@/services/userService";
import { User } from "@/types/User";
import { Link } from "react-router-dom";
import UsuariosTable from "@/components/UserProfile/UsuariosTable";

export default function UsuariosList() {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsers()
      .then(setUsuarios)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = async (id: string, current: boolean) => {
    try {
      const updated = await toggleUserActive(id, !current);
      setUsuarios((prev) =>
        prev.map((u) => (u.id === id ? { ...u, isActive: updated.isActive } : u))
      );
    } catch (err) {
      console.error("Error al cambiar estado:", err);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-full overflow-x-auto">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-xl font-bold">Usuarios</h1>
        <Link
          to="/administracion/usuarios/nuevo"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap"
        >
          + Nuevo Usuario
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando usuarios...</p>
      ) : (
        <UsuariosTable
          usuarios={usuarios}
          onToggle={handleToggle}
          onEdit={(id) => console.log("Editar", id)}
          onDelete={(id) => console.log("Eliminar", id)}
          onReport={(id) => console.log("Reporte", id)}
        />
      )}
    </div>
  );
}
