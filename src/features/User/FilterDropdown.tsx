import { Filter } from "lucide-react";
import { useState } from "react";

export const FilterDropdown: React.FC<{
  label: string;
  options: { id: string; name: string }[];
  value?: string[];
  onChange: (value: string[]) => void;
  darkMode?: boolean;
}> = ({ label, options, value = [], onChange, darkMode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (option: string) => {
    const newValue = value.includes(option)
      ? value.filter((v) => v !== option)
      : [...value, option];
    onChange(newValue);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
          darkMode
            ? "border-slate-600 hover:bg-slate-700 text-slate-300"
            : "border-slate-300 hover:bg-slate-50 text-slate-700"
        }`}
      >
        <Filter size={16} />
        {label}
        {value.length > 0 && (
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              darkMode
                ? "bg-blue-900 text-blue-200"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {value.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className={`absolute top-full left-0 mt-2 w-48 border rounded-lg shadow-lg z-10 ${
            darkMode
              ? "bg-slate-800 border-slate-700"
              : "bg-white border-slate-200"
          }`}
        >
          <div className="p-2 space-y-1 max-h-64 overflow-y-auto">
            {options.map((option) => (
              <label
                key={option.id}
                className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-colors ${
                  darkMode ? "hover:bg-slate-700" : "hover:bg-slate-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={value.includes(option.id)}
                  onChange={() => toggleOption(option.id)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span
                  className={`text-sm ${
                    darkMode ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  {option.name}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
