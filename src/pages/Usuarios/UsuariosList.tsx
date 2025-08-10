// src/pages/usuarios/UsuariosList.tsx

import { useEffect, useState } from "react";
import { getUsers, toggleUserActive } from "@/services/userService";
import { User } from "@/types/User";
import { Link, useNavigate } from "react-router-dom";
import UsuariosTable from "@/components/UserProfile/UsuariosTable";
import { toast } from "react-toastify";

export default function UsuariosList() {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allUsers = await getUsers();
        setUsuarios(allUsers);
      } catch (err) {
        toast.error("Error al cargar usuarios");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleToggle = async (id: string, current: boolean) => {
    try {
      const updated = await toggleUserActive(id, !current);
      setUsuarios((prev) =>
        prev.map((u) => (u.id === id ? { ...u, isActive: updated.isActive } : u))
      );
      toast.success(`Usuario ${updated.isActive ? "activado" : "desactivado"}`);
    } catch (err) {
      toast.error("No se pudo actualizar el estado del usuario");
      console.error(err);
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/administracion/usuarios/editar/${id}`);
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
          onEdit={handleEdit}
          onDelete={(id) => console.log("Eliminar", id)}
          onReport={(id) => console.log("Reporte", id)}
        />
      )}
    </div>
  );
}
