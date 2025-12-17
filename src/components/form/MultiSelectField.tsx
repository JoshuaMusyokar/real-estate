import { useState } from "react";
import { CheckCircle, AlertCircle, ChevronDown } from "lucide-react";

interface Option {
  label: string;
  value: string;
}

interface MultiSelectFieldProps<T = string> {
  label: string;
  options: Option[] | string[];
  value: T[];
  onChange: (value: T[]) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function MultiSelectField<T extends string = string>({
  label,
  options,
  value = [],
  onChange,
  error,
  required = false,
  placeholder = "Select options...",
  className = "",
  disabled = false,
}: MultiSelectFieldProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  // Normalize options to have consistent format
  const normalizedOptions: Option[] = options.map((opt) =>
    typeof opt === "string" ? { label: opt, value: opt } : opt
  );

  const selectedValues = value || [];

  const handleToggle = (optionValue: T) => {
    const newValues = selectedValues.includes(optionValue)
      ? selectedValues.filter((v) => v !== optionValue)
      : [...selectedValues, optionValue];
    onChange(newValues);
  };

  const removeValue = (optionValue: T) => {
    onChange(selectedValues.filter((v) => v !== optionValue));
  };

  const getLabel = (val: T): string => {
    const option = normalizedOptions.find((opt) => opt.value === val);
    return option?.label || val;
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-bold text-gray-900">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`w-full min-h-[48px] px-4 py-2 border-2 rounded-xl transition-all text-left ${
            disabled
              ? "bg-gray-100 cursor-not-allowed opacity-50"
              : "cursor-pointer"
          } ${
            error
              ? "border-red-500"
              : isOpen
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
                  {getLabel(val)}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!disabled) removeValue(val);
                    }}
                    disabled={disabled}
                    className="hover:text-blue-900 disabled:cursor-not-allowed"
                    aria-label={`Remove ${getLabel(val)}`}
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
            <span className="text-gray-500">{placeholder}</span>
          )}
          <ChevronDown
            className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && !disabled && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute z-20 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto">
              {normalizedOptions.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  No options available
                </div>
              ) : (
                normalizedOptions.map((option) => {
                  const isSelected = selectedValues.includes(option.value as T);
                  return (
                    <label
                      key={option.value}
                      className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                        isSelected ? "bg-blue-50" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggle(option.value as T)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span
                        className={`text-sm ${
                          isSelected
                            ? "font-semibold text-blue-900"
                            : "text-gray-900"
                        }`}
                      >
                        {option.label}
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
          {selectedValues.length} selected
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
}
