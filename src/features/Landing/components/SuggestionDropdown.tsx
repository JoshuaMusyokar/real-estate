// SuggestionsDropdown.tsx
import React from "react";
import { Home, MapPin, Building2, Search, X } from "lucide-react";
import type { SuggestionItem } from "../../../types/search";

interface SuggestionsDropdownProps {
  show: boolean;
  searchInput: string;
  suggestions: SuggestionItem[];
  initialSuggestions: SuggestionItem[];
  selectedCityName: string;
  selectedLocalities: SuggestionItem[];
  onSelect: (item: SuggestionItem) => void;
  onRemoveLocality: (id: string) => void;
}

const TYPE_STYLES: Record<string, { bg: string; icon: React.ReactNode }> = {
  city: {
    bg: "bg-blue-100 dark:bg-blue-900/40",
    icon: <MapPin className="w-4 h-4 text-blue-600" />,
  },
  locality: {
    bg: "bg-emerald-100 dark:bg-emerald-900/40",
    icon: <Home className="w-4 h-4 text-emerald-600" />,
  },
  project: {
    bg: "bg-purple-100 dark:bg-purple-900/40",
    icon: <Building2 className="w-4 h-4 text-purple-600" />,
  },
  builder: {
    bg: "bg-amber-100 dark:bg-amber-900/40",
    icon: <Building2 className="w-4 h-4 text-amber-600" />,
  },
  popular: {
    bg: "bg-indigo-100 dark:bg-indigo-900/40",
    icon: <Search className="w-4 h-4 text-indigo-600" />,
  },
  landmark: {
    bg: "bg-gray-100 dark:bg-gray-700",
    icon: <MapPin className="w-4 h-4 text-gray-600" />,
  },
};

function SuggestionRow({
  item,
  onSelect,
}: {
  item: SuggestionItem;
  onSelect: (i: SuggestionItem) => void;
}) {
  const style = TYPE_STYLES[item.type] ?? TYPE_STYLES.landmark;
  return (
    <button
      onMouseDown={(e) => {
        e.preventDefault();
        onSelect(item);
      }}
      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors text-left"
    >
      <div className={`p-2 rounded-lg flex-shrink-0 ${style.bg}`}>
        {style.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
          {item.displayName}
        </div>
        <div className="text-xs text-gray-400 capitalize">{item.type}</div>
      </div>
      {item.type === "locality" && (
        <span className="text-xs text-blue-500 font-medium flex-shrink-0">
          + Add
        </span>
      )}
    </button>
  );
}

export const SuggestionsDropdown: React.FC<SuggestionsDropdownProps> = ({
  show,
  searchInput,
  suggestions,
  initialSuggestions,
  selectedCityName,
  selectedLocalities,
  onSelect,
  onRemoveLocality,
}) => {
  if (!show) return null;

  const displayList = searchInput.length > 0 ? suggestions : initialSuggestions;
  const sectionLabel =
    searchInput.length > 0
      ? `Results for "${searchInput}"`
      : `Popular in ${selectedCityName}`;

  return (
    <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
      {/* Selected localities chips */}
      {selectedLocalities.length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-4 py-2.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          {selectedLocalities.map((loc) => (
            <span
              key={loc.id}
              className="flex items-center gap-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium"
            >
              {loc.name}
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  onRemoveLocality(loc.id);
                }}
                className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Section header */}
      {displayList.length > 0 && (
        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            {sectionLabel}
          </span>
        </div>
      )}

      {/* Results */}
      <div className="max-h-64 sm:max-h-80 overflow-y-auto">
        {displayList.length > 0
          ? displayList.map((item) => (
              <SuggestionRow
                key={`${item.type}-${item.id}`}
                item={item}
                onSelect={onSelect}
              />
            ))
          : searchInput.length > 0 && (
              <div className="px-4 py-6 text-center text-sm text-gray-400">
                No results for "{searchInput}"
              </div>
            )}
      </div>
    </div>
  );
};
