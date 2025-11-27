import { Search, Grid3x3, List } from "lucide-react";
import type { AmenitySearchFilters, ViewMode } from "../../../types";

interface FiltersProps {
  filters: AmenitySearchFilters;
  categories: string[];
  viewMode: ViewMode;
  onFiltersChange: (updates: Partial<AmenitySearchFilters>) => void;
  onViewModeChange: (mode: ViewMode) => void;
  onResetFilters: () => void;
}

export const Filters = ({
  filters,
  categories,
  viewMode,
  onFiltersChange,
  onViewModeChange,
  onResetFilters,
}: FiltersProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) =>
              onFiltersChange({ search: e.target.value, page: 1 })
            }
            placeholder="Search amenities..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <select
            value={filters.category?.[0] || ""}
            onChange={(e) =>
              onFiltersChange({
                category: e.target.value ? [e.target.value] : undefined,
                page: 1,
              })
            }
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        )}

        {/* Status Filter */}
        <select
          value={
            filters.isActive === undefined
              ? ""
              : filters.isActive
              ? "active"
              : "inactive"
          }
          onChange={(e) =>
            onFiltersChange({
              isActive:
                e.target.value === "" ? undefined : e.target.value === "active",
              page: 1,
            })
          }
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        {/* Sort */}
        <select
          value={`${filters.sortBy}-${filters.sortOrder}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split("-");
            onFiltersChange({
              sortBy,
              sortOrder: sortOrder as "asc" | "desc",
            });
          }}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
        >
          <option value="order-asc">Order (Low to High)</option>
          <option value="order-desc">Order (High to Low)</option>
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="createdAt-desc">Newest First</option>
          <option value="createdAt-asc">Oldest First</option>
        </select>

        {/* View Toggle */}
        <div className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-lg p-1">
          <button
            onClick={() => onViewModeChange("grid")}
            className={`p-2 rounded ${
              viewMode === "grid"
                ? "bg-blue-600 text-white"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <Grid3x3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange("table")}
            className={`p-2 rounded ${
              viewMode === "table"
                ? "bg-blue-600 text-white"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>

        {/* Reset Filters */}
        <button
          onClick={onResetFilters}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
};
