import React from "react";

interface ToggleButtonProps {
  checked: boolean;
  onChange: () => void;
  className?: string;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  checked,
  onChange,
  className = "",
}) => {
  return (
    <button
      onClick={onChange}
      type="button"
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
        checked ? "bg-green-500" : "bg-gray-300"
      } ${className}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
};

export default ToggleButton;
