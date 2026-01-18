import { useState } from "react";
import { FilterIcon, XIcon } from "lucide-react";
import type {
  AnalyticsInterval,
  AnalyticsPeriod,
  AnalyticsQueryParams,
} from "../../../types";

interface AdvancedFilterPanelProps {
  filters: AnalyticsQueryParams;
  onFilterChange: (filters: Partial<AnalyticsQueryParams>) => void;
  showPropertyFilters?: boolean;
  showLeadFilters?: boolean;
  showFinancialFilters?: boolean;
  showPerformanceFilters?: boolean;
}

export default function AdvancedFilterPanel({
  filters,
  onFilterChange,
  showPropertyFilters = false,
  showLeadFilters = false,
}: AdvancedFilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const periods = [
    { value: "today", label: "Today" },
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
    { value: "90d", label: "Last 90 days" },
    { value: "1y", label: "Last year" },
    { value: "custom", label: "Custom range" },
  ];

  const intervals = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
  ];

  // Mock data for filters
  const mockCities = [
    { id: "1", name: "New York" },
    { id: "2", name: "Los Angeles" },
    { id: "3", name: "Chicago" },
    { id: "4", name: "Miami" },
  ];

  const mockPropertyTypes = [
    { id: "residential", name: "Residential" },
    { id: "commercial", name: "Commercial" },
    { id: "industrial", name: "Industrial" },
    { id: "land", name: "Land" },
  ];

  const mockLeadSources = [
    { id: "website", name: "Website" },
    { id: "facebook", name: "Facebook" },
    { id: "instagram", name: "Instagram" },
    { id: "referral", name: "Referral" },
    { id: "walk-in", name: "Walk-in" },
  ];

  const handleDateChange = (type: "startDate" | "endDate", value: string) => {
    onFilterChange({ [type]: value });
  };

  const handleArrayFilterChange = (
    key: keyof AnalyticsQueryParams,
    value: string,
  ) => {
    const currentValues = ((filters[key] as string) || "")
      .split(",")
      .filter(Boolean);
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    onFilterChange({ [key]: newValues.join(",") });
  };

  const clearFilters = () => {
    onFilterChange({
      period: "30d",
      cityIds: undefined,
      localityIds: undefined,
      propertyType: undefined,
      subType: undefined,
      sources: undefined,
      stages: undefined,
      startDate: undefined,
      endDate: undefined,
    });
  };

  const hasActiveFilters = () => {
    return Object.entries(filters).some(([key, value]) => {
      if (key === "period" && value === "30d") return false;
      if (key === "interval") return false;
      return value && value !== "";
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
        >
          <FilterIcon className="w-5 h-5" />
          <span className="font-medium">Advanced Filters</span>
          {hasActiveFilters() && (
            <span className="inline-flex items-center justify-center w-2 h-2 bg-blue-600 rounded-full" />
          )}
        </button>

        <div className="flex items-center gap-3">
          {hasActiveFilters() && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              Clear all
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-gray-600"
          >
            {isExpanded ? (
              <XIcon className="w-5 h-5" />
            ) : (
              <FilterIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
          {/* Period and Interval */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Time Period
              </label>
              <select
                value={filters.period || "30d"}
                onChange={(e) =>
                  onFilterChange({ period: e.target.value as AnalyticsPeriod })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800"
              >
                {periods.map((period) => (
                  <option key={period.value} value={period.value}>
                    {period.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Interval
              </label>
              <select
                value={filters.interval || "daily"}
                onChange={(e) =>
                  onFilterChange({
                    interval: e.target.value as AnalyticsInterval,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800"
              >
                {intervals.map((interval) => (
                  <option key={interval.value} value={interval.value}>
                    {interval.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Custom Date Range */}
          {filters.period === "custom" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={filters.startDate || ""}
                  onChange={(e) =>
                    handleDateChange("startDate", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={filters.endDate || ""}
                  onChange={(e) => handleDateChange("endDate", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800"
                />
              </div>
            </div>
          )}

          {/* Property Filters */}
          {showPropertyFilters && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Property Filters
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Cities
                  </label>
                  <select
                    multiple
                    value={(filters.cityIds || []).filter(Boolean)}
                    onChange={(e) => {
                      const values = Array.from(
                        e.target.selectedOptions,
                        (opt) => opt.value,
                      );
                      onFilterChange({ cityIds: values });
                    }}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded dark:border-gray-700 dark:bg-gray-800 h-24"
                  >
                    {mockCities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Property Types
                  </label>
                  <div className="space-y-1">
                    {mockPropertyTypes.map((type) => (
                      <label key={type.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={(filters.propertyType || []).includes(
                            type.id,
                          )}
                          onChange={() =>
                            handleArrayFilterChange("propertyType", type.id)
                          }
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">{type.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Featured
                  </label>
                  <select
                    value={filters.featured?.toString() || ""}
                    onChange={(e) =>
                      onFilterChange({ featured: e.target.value === "true" })
                    }
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded dark:border-gray-700 dark:bg-gray-800"
                  >
                    <option value="">All</option>
                    <option value="true">Featured Only</option>
                    <option value="false">Not Featured</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Status
                  </label>
                  <select
                    multiple
                    value={(filters.status || []).filter(Boolean)}
                    onChange={(e) => {
                      const values = Array.from(
                        e.target.selectedOptions,
                        (opt) => opt.value,
                      );
                      onFilterChange({ status: values });
                    }}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded dark:border-gray-700 dark:bg-gray-800 h-24"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="sold">Sold</option>
                    <option value="rented">Rented</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Lead Filters */}
          {showLeadFilters && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Lead Filters
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Sources
                  </label>
                  <div className="space-y-1">
                    {mockLeadSources.map((source) => (
                      <label
                        key={source.id}
                        className="flex items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          checked={(filters.sources || []).includes(source.id)}
                          onChange={() =>
                            handleArrayFilterChange("sources", source.id)
                          }
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">{source.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Stages
                  </label>
                  <select
                    multiple
                    value={(filters.stages || []).filter(Boolean)}
                    onChange={(e) => {
                      const values = Array.from(
                        e.target.selectedOptions,
                        (opt) => opt.value,
                      );
                      onFilterChange({ stages: values });
                    }}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded dark:border-gray-700 dark:bg-gray-800 h-24"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="proposal">Proposal</option>
                    <option value="negotiation">Negotiation</option>
                    <option value="closed">Closed</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Assigned To
                  </label>
                  <select
                    multiple
                    value={(filters.assignedTo || []).filter(Boolean)}
                    onChange={(e) => {
                      const values = Array.from(
                        e.target.selectedOptions,
                        (opt) => opt.value,
                      );
                      onFilterChange({ assignedTo: values });
                    }}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded dark:border-gray-700 dark:bg-gray-800 h-24"
                  >
                    <option value="1">John Doe</option>
                    <option value="2">Jane Smith</option>
                    <option value="3">Bob Johnson</option>
                    <option value="4">Alice Williams</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Apply Filters Button */}
          <div className="flex justify-end">
            <button
              onClick={() => setIsExpanded(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
