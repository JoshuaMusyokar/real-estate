import React from "react";
import { Search, FunnelIcon } from "lucide-react";

interface LocationFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  filters: {
    state?: string;
    country?: string;
    hasLocality?: boolean;
  };
  onFiltersChange: (filters: any) => void;
}

export function LocationFilter({
  search,
  onSearchChange,
  filters,
  onFiltersChange,
}: LocationFilterProps) {
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4 mb-6">
      <div className="flex flex-col space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search cities or localities..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:text-white sm:text-sm"
          />
        </div>

        {/* Advanced Filters Toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
        >
          <FunnelIcon className="w-4 h-4 mr-2" />
          Advanced Filters
        </button>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <label
                htmlFor="state"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                State
              </label>
              <input
                type="text"
                id="state"
                value={filters.state || ""}
                onChange={(e) =>
                  onFiltersChange({ ...filters, state: e.target.value })
                }
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                placeholder="Filter by state"
              />
            </div>

            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Country
              </label>
              <input
                type="text"
                id="country"
                value={filters.country || ""}
                onChange={(e) =>
                  onFiltersChange({ ...filters, country: e.target.value })
                }
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                placeholder="Filter by country"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Has Localities
              </label>
              <select
                value={filters.hasLocality?.toString() || ""}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    hasLocality:
                      e.target.value === ""
                        ? undefined
                        : e.target.value === "true",
                  })
                }
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              >
                <option value="">All</option>
                <option value="true">With Localities</option>
                <option value="false">Without Localities</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
