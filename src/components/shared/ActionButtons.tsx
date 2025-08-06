import { PencilIcon, TrashIcon, ChartBarIcon } from "@heroicons/react/24/outline";
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
  return (
    <div className="flex flex-wrap gap-2 items-center justify-center">
      {onEdit && (
        <button
          onClick={() => onEdit(id)}
          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
        >
          <PencilIcon className="w-4 h-4" />
          <span>Editar</span>
        </button>
      )}

      {onDelete && (
        <button
          onClick={() => onDelete(id)}
          className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 text-sm"
        >
          <TrashIcon className="w-4 h-4" />
          <span>Eliminar</span>
        </button>
      )}

      {onReport && (
        <button
          onClick={() => onReport(id)}
          className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-800 text-sm"
        >
          <ChartBarIcon className="w-4 h-4" />
          <span>Reportes</span>
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
