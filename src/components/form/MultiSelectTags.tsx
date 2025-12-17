import { useState } from "react";
import { CheckCircle, AlertCircle, ChevronDown } from "lucide-react";

interface MultiSelectTagsProps {
  fieldName: string;
  label: string;
  options: string[];
  value: string[] | undefined | null;
  error?: string;
  required?: boolean;
  placeholder?: string;
  onChange: (fieldName: string, value: string[]) => void;
}

export const MultiSelectTags: React.FC<MultiSelectTagsProps> = ({
  fieldName,
  label,
  options,
  value,
  error,
  required = false,
  placeholder,
  onChange,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const selectedValues = value || [];

  const handleToggle = (option: string) => {
    const newValues = selectedValues.includes(option)
      ? selectedValues.filter((v) => v !== option)
      : [...selectedValues, option];
    onChange(fieldName, newValues);
  };

  const removeValue = (option: string) => {
    const newValues = selectedValues.filter((v) => v !== option);
    onChange(fieldName, newValues);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-bold text-gray-900">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative">
        <div
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className={`w-full min-h-[48px] px-4 py-2 border-2 rounded-xl cursor-pointer transition-all ${
            error
              ? "border-red-500"
              : dropdownOpen
              ? "border-blue-500 ring-2 ring-blue-500"
              : "border-gray-200"
          } ${selectedValues.length > 0 ? "bg-white" : "bg-gray-50"}`}
        >
          {selectedValues.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedValues.map((val) => (
                <span
                  key={val}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg"
                >
                  {val}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeValue(val);
                    }}
                    className="hover:text-blue-900"
                    aria-label={`Remove ${val}`}
                  >
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <span className="text-gray-500">
              {placeholder || `Select ${label.toLowerCase()}...`}
            </span>
          )}
          <ChevronDown
            className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-transform ${
              dropdownOpen ? "rotate-180" : ""
            }`}
          />
        </div>

        {dropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setDropdownOpen(false)}
            />
            <div className="absolute z-20 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto">
              {options.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  No options available
                </div>
              ) : (
                options.map((option) => {
                  const isSelected = selectedValues.includes(option);
                  return (
                    <label
                      key={option}
                      className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                        isSelected ? "bg-blue-50" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggle(option)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span
                        className={`text-sm ${
                          isSelected
                            ? "font-semibold text-blue-900"
                            : "text-gray-900"
                        }`}
                      >
                        {option}
                      </span>
                      {isSelected && (
                        <CheckCircle className="w-4 h-4 text-blue-600 ml-auto" />
                      )}
                    </label>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>

      {selectedValues.length > 0 && (
        <p className="text-xs text-gray-600">
          {selectedValues.length} {label.toLowerCase()}
          {selectedValues.length !== 1 ? "s" : ""} selected
        </p>
      )}

      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
};
