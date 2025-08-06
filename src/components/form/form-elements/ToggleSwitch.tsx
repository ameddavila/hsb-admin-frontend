// src/components/form/form-elements/ToggleSwitch.tsx
import Switch from "../switch/Switch";

interface ToggleSwitchProps {
  enabled: boolean;
  setEnabled: (value: boolean) => void;
  disabled?: boolean;
  label?: string;
  color?: "blue" | "gray";
}

export default function ToggleSwitch({
  enabled,
  setEnabled,
  disabled = false,
  label = "",
  color = "blue",
}: ToggleSwitchProps) {
  return (
    <div className="flex items-center gap-3">
      {label && <label className="text-sm">{label}</label>}
      <Switch
        checked={enabled}
        onChange={setEnabled}
        color={color}
        disabled={disabled}
      />
    </div>
  );
}
