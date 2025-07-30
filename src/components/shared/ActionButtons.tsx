import React, { useEffect } from "react";
import ToggleButton from "@/components/ToggleButton/ToggleButton";

interface ActionButtonsProps {
  id: string;
  isActive?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onReport?: (id: string) => void;
  onToggle?: (id: string, current: boolean) => void;
  showToggle?: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  id,
  isActive = false,
  onEdit,
  onDelete,
  onReport,
  onToggle,
  showToggle = true,
}) => {
  useEffect(() => {
    console.log(`[ActionButtons] 🧩 Renderizando acciones para ID: ${id}`);
    console.log("onEdit:", !!onEdit, "onDelete:", !!onDelete, "onReport:", !!onReport, "onToggle:", !!onToggle);
  }, [id, onEdit, onDelete, onReport, onToggle]);

  return (
    <div className="flex items-center gap-2">
      {onEdit && (
        <button
          onClick={() => onEdit(id)}
          className="text-blue-600 hover:underline text-sm"
          title="Editar"
        >
          Editar
        </button>
      )}

      {onDelete && (
        <button
          onClick={() => onDelete(id)}
          className="text-red-600 hover:underline text-sm"
          title="Eliminar"
        >
          Eliminar
        </button>
      )}

      {onReport && (
        <button
          onClick={() => onReport(id)}
          className="text-gray-600 hover:underline text-sm"
          title="Reportes"
        >
          Reportes
        </button>
      )}

      {showToggle && onToggle && (
        <ToggleButton
          checked={isActive}
          onChange={() => onToggle(id, isActive)}
          className={`${isActive ? "bg-green-500" : "bg-gray-300"} h-5 w-10 ml-2`}
        />
      )}
    </div>
  );
};

export default ActionButtons;
