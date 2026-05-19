import { Search, SlidersHorizontal, X } from "lucide-react";

interface Props {
  search: string;
  category: string;
  showInactive: boolean;
  onSearch: (v: string) => void;
  onCategory: (v: string) => void;
  onToggleInactive: () => void;
  onReset: () => void;
}

const CATEGORIES = [
  { id: "", label: "All" },
  { id: "appointment", label: "Appointment" },
  { id: "follow_up", label: "Follow-up" },
  { id: "welcome", label: "Welcome" },
  { id: "reminder", label: "Reminder" },
  { id: "campaign", label: "Campaign" },
  { id: "custom", label: "Custom" },
];

export const TemplateFilters: React.FC<Props> = ({
  search,
  category,
  showInactive,
  onSearch,
  onCategory,
  onToggleInactive,
  onReset,
}) => {
  const activeCount = [search, category, showInactive ? "x" : ""].filter(
    Boolean,
  ).length;

  return (
    <div className="space-y-2.5">
      {/* Search row */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search templates…"
            className="w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-xs sm:text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>

        {/* Inactive toggle */}
        <button
          onClick={onToggleInactive}
          className={`flex items-center gap-1 px-2.5 py-2 rounded-xl border text-[11px] font-bold flex-shrink-0 transition-all
            ${
              showInactive
                ? "bg-amber-600 border-amber-600 text-white"
                : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400"
            }`}
        >
          <SlidersHorizontal className="w-3 h-3" />
          <span className="hidden sm:inline">Inactive</span>
        </button>

        {/* Reset */}
        {activeCount > 0 && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 px-2.5 py-2 rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20 text-red-600 text-[11px] font-bold flex-shrink-0 transition-colors hover:bg-red-100"
          >
            <X className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        )}
      </div>

      {/* Category chips — horizontal scroll on mobile */}
      <div
        className="flex gap-1.5 overflow-x-auto pb-0.5"
        style={{ scrollbarWidth: "none" }}
      >
        {CATEGORIES.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => onCategory(id)}
            className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors
              ${
                category === id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};
