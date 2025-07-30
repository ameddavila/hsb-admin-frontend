import { useEffect } from "react";
import { User, Role } from "@/types/User";
import { Column } from "@/components/shared/DataTablePro";
import Badge from "@/components/ui/badge/Badge";
import DataTablePro from "@/components/shared/DataTablePro";
import ActionButtons from "@/components/shared/ActionButtons"; // ✅ nuevo componente reutilizable

interface Props {
  usuarios: User[];
  onToggle: (id: string, current: boolean) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onReport?: (id: string) => void;
}

export default function UsuariosTable({
  usuarios,
  onToggle,
  onEdit,
  onDelete,
  onReport,
}: Props) {

  useEffect(() => {
    console.log("📦 [UsuariosTable] Usuarios recibidos:", usuarios);
    console.log("🛠️ [UsuariosTable] Funciones disponibles:", {
      onToggle,
      onEdit,
      onDelete,
      onReport,
    });
  }, [usuarios, onToggle, onEdit, onDelete, onReport]);

  const columns: Column<User>[] = [
    {
      key: "username",
      header: "Usuario",
      render: (u) => (
        <div className="flex items-center gap-3">
          <img
            src={u.profileImage ? `/${u.profileImage}` : "/images/user/owner.jpg"}
            alt={`Avatar de ${u.username}`}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-medium text-sm">{u.username}</p>
            {u.firstName && (
              <p className="text-xs text-gray-500">{u.firstName}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "email",
      header: "Correo",
      render: (u) => <span className="text-sm">{u.email}</span>,
    },
    {
      key: "roles",
      header: "Roles",
      render: (u) =>
        u.roles?.length
          ? u.roles.map((r: Role) => r.name).join(", ")
          : "Sin rol",
    },
    {
      key: "isActive",
      header: "Estado",
      render: (u) => (
        <Badge color={u.isActive ? "success" : "error"} size="sm">
          {u.isActive ? "Activo" : "Inactivo"}
        </Badge>
      ),
    },
    {
      key: "acciones",
      header: "Acciones",
      render: (u) => (
        <ActionButtons
          id={u.id}
          isActive={u.isActive}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
          onReport={onReport}
        />
      ),
    },
  ];

  return <DataTablePro columns={columns} data={usuarios} />;
}
