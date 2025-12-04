import React from "react";
import { ChevronDown } from "lucide-react";

interface DropdownProps {
  label: string;
  children: React.ReactNode;
  id: string;
  count?: number;
  activeDropdown: string | null;
  setActiveDropdown: (id: string | null) => void;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  children,
  id,
  count = 0,
  activeDropdown,
  setActiveDropdown,
}) => {
  const isOpen = activeDropdown === id;

  return (
    <div className="relative">
      <button
        onClick={() => setActiveDropdown(isOpen ? null : id)}
        className={`flex items-center gap-2 px-4 py-2 border rounded-lg hover:border-gray-400 transition-colors whitespace-nowrap ${
          count > 0
            ? "border-purple-600 bg-purple-50"
            : "border-gray-300 bg-white"
        }`}
      >
        <span className="text-sm font-medium">{label}</span>
        {count > 0 && (
          <span className="bg-purple-600 text-white text-xs px-1.5 py-0.5 rounded-full">
            {count}
          </span>
        )}
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setActiveDropdown(null)}
          />
          <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 min-w-[240px] max-h-[400px] overflow-y-auto">
            {children}
          </div>
        </>
      )}
    </div>
  );
};
