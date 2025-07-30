import { useEffect, useState } from "react";
import { getUsers, toggleUserActive } from "@/services/userService";
import { User } from "@/types/User";
import { Link } from "react-router-dom";
import UsuariosTable from "@/components/UserProfile/UsuariosTable"; // ✅ importa tu tabla

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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Usuarios</h1>
        <Link
          to="/usuarios/nuevo"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
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
          onEdit={(id) => console.log("Editar", id)}       // ejemplo funcional
          onDelete={(id) => console.log("Eliminar", id)}   // ejemplo funcional
          onReport={(id) => console.log("Reporte", id)}    // ejemplo funcional
        />

      )}
    </div>
  );
}
