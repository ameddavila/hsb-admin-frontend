// src/components/UserProfile/UsuariosTable.tsx
import { useEffect, useMemo } from "react";
import { User, Role } from "@/types/User";
import { Column } from "@/components/shared/DataTablePro";
import Badge from "@/components/ui/badge/Badge";
import DataTablePro from "@/components/shared/DataTablePro";
import ActionButtons from "@/components/shared/ActionButtons";
import { getAvatarSrc, PLACEHOLDER } from "@/utils/getAvatarSrc";

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
    console.log("📦 [UsuariosTable] Usuarios recibidos:", usuarios?.length ?? 0);
  }, [usuarios]);

  const columns: Column<User>[] = useMemo(
    () => [
      {
        key: "username",
        header: "Usuario",
        render: (u) => {
          const src = getAvatarSrc(u);
          return (
            <div className="flex items-center gap-3 whitespace-nowrap">
              <img
                src={src}
                onError={(e) => ((e.currentTarget.src = PLACEHOLDER))}
                alt={`Avatar de ${u.username}`}
                className="w-10 h-10 rounded-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div>
                <p className="font-medium text-sm">{u.username}</p>
                {(u.firstName || u.lastName) && (
                  <p className="text-xs text-gray-500">
                    {[u.firstName, u.lastName].filter(Boolean).join(" ")}
                  </p>
                )}
              </div>
            </div>
          );
        },
      },
      {
        key: "email",
        header: "Correo",
        render: (u) => <span className="text-sm whitespace-nowrap">{u.email}</span>,
      },
      {
        key: "roles",
        header: "Roles",
        render: (u) =>
          u.roles?.length ? (
            <div className="flex flex-wrap gap-1 max-w-[160px] truncate">
              {u.roles.map((r: Role) => (
                <Badge key={r.id ?? r.name} color="info" size="sm">
                  {r.name}
                </Badge>
              ))}
            </div>
          ) : (
            <span className="text-xs text-gray-400 italic">Sin rol</span>
          ),
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
    ],
    [onDelete, onEdit, onReport, onToggle],
  );

  return (
    <DataTablePro
      title="Usuarios"
      data={usuarios ?? []}
      columns={columns}
      searchKeys={["username", "email", "firstName", "lastName"]}
      itemsPerPage={8}
      cardRender={(u) => {
        const src = getAvatarSrc(u);
        return (
          <div className="flex flex-col gap-2">
            {/* Usuario */}
            <div className="flex items-center gap-3">
              <img
                src={src}
                onError={(e) => ((e.currentTarget.src = PLACEHOLDER))}
                alt={u.username}
                className="w-10 h-10 rounded-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div>
                <p className="font-medium">{u.username}</p>
                {(u.firstName || u.lastName) && (
                  <p className="text-xs text-gray-500">
                    {[u.firstName, u.lastName].filter(Boolean).join(" ")}
                  </p>
                )}
              </div>
            </div>

            {/* Correo */}
            <div className="text-sm">
              <strong>Correo:</strong>{" "}
              <span className="text-gray-700">{u.email}</span>
            </div>

            {/* Roles */}
            <div className="text-sm">
              <strong>Roles:</strong>{" "}
              {u.roles?.length ? (
                <div className="flex flex-wrap gap-1 mt-1">
                  {u.roles.map((r: Role) => (
                    <Badge key={r.id ?? r.name} color="info" size="sm">
                      {r.name}
                    </Badge>
                  ))}
                </div>
              ) : (
                <span className="text-gray-400 italic">Sin rol</span>
              )}
            </div>

            {/* Estado */}
            <div className="text-sm">
              <strong>Estado:</strong>{" "}
              <Badge color={u.isActive ? "success" : "error"} size="sm">
                {u.isActive ? "Activo" : "Inactivo"}
              </Badge>
            </div>

            {/* Acciones */}
            <div className="pt-2">
              <ActionButtons
                id={u.id}
                isActive={u.isActive}
                onToggle={onToggle}
                onEdit={onEdit}
                onDelete={onDelete}
                onReport={onReport}
              />
            </div>
          </div>
        );
      }}
    />
  );
}
