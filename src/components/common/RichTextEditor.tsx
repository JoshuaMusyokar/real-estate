import React, { useState } from "react";
import { cn } from "../../utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  error,
  disabled = false,
  placeholder = "Start typing your content here...",
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "w-full min-h-[200px] px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400",
          "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100",
          "placeholder-gray-400 dark:placeholder-gray-500",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          error && "border-red-500 dark:border-red-400",
          isFocused &&
            "ring-2 ring-blue-500 ring-opacity-50 dark:ring-blue-400 dark:ring-opacity-50"
        )}
        rows={10}
      />

      {/* Simple formatting toolbar */}
      <div className="absolute top-2 right-2 flex space-x-1">
        <button
          type="button"
          onClick={() => onChange(value + " **bold** ")}
          className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
          disabled={disabled}
          title="Add bold text"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => onChange(value + " *italic* ")}
          className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
          disabled={disabled}
          title="Add italic text"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={() => onChange(value + "\n- List item")}
          className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
          disabled={disabled}
          title="Add bullet list"
        >
          • List
        </button>
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default RichTextEditor;
