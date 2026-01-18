import React, { useState } from "react";
import {
  CalendarIcon,
  FilterIcon,
  DownloadIcon,
  X,
  ChevronDown,
} from "lucide-react";
import { useGetCitiesQuery } from "../../../services/locationApi";
import { useGetPropertyTypesQuery } from "../../../services/propertyApi";

interface FilterBarProps {
  period: "7d" | "30d" | "90d" | "1y";
  selectedCities: string[];
  selectedPropertyTypes: string[];
  onPeriodChange: (period: "7d" | "30d" | "90d" | "1y") => void;
  onCitiesChange: (cities: string[]) => void;
  onPropertyTypesChange: (types: string[]) => void;
  onExport: (format: "csv" | "excel" | "pdf") => void;
  isExporting: boolean;
}

export default function FilterBar({
  period,
  selectedCities,
  selectedPropertyTypes,
  onPeriodChange,
  onCitiesChange,
  onPropertyTypesChange,
  onExport,
  isExporting,
}: FilterBarProps) {
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  // Fetch cities and property types from API
  const { data: citiesData, isLoading: citiesLoading } = useGetCitiesQuery({
    limit: 100,
    page: 1,
  });

  const { data: propertyTypesData, isLoading: typesLoading } =
    useGetPropertyTypesQuery({
      isActive: true,
      includeSubTypes: false,
    });

  const cities = citiesData?.data || [];
  const propertyTypes = propertyTypesData?.data || [];

  const handleCityToggle = (cityId: string) => {
    if (selectedCities.includes(cityId)) {
      onCitiesChange(selectedCities.filter((id) => id !== cityId));
    } else {
      onCitiesChange([...selectedCities, cityId]);
    }
  };

  const handlePropertyTypeToggle = (typeId: string) => {
    if (selectedPropertyTypes.includes(typeId)) {
      onPropertyTypesChange(
        selectedPropertyTypes.filter((id) => id !== typeId)
      );
    } else {
      onPropertyTypesChange([...selectedPropertyTypes, typeId]);
    }
  };

  const clearCityFilters = () => {
    onCitiesChange([]);
  };

  const clearTypeFilters = () => {
    onPropertyTypesChange([]);
  };

  const getSelectedCityNames = () => {
    if (selectedCities.length === 0) return "All Cities";
    if (selectedCities.length === 1) {
      const city = cities.find((c) => c.id === selectedCities[0]);
      return city?.name || "Selected";
    }
    return `${selectedCities.length} Cities`;
  };

  const getSelectedTypeNames = () => {
    if (selectedPropertyTypes.length === 0) return "All Types";
    if (selectedPropertyTypes.length === 1) {
      const type = propertyTypes.find((t) => t.id === selectedPropertyTypes[0]);
      return type?.name || "Selected";
    }
    return `${selectedPropertyTypes.length} Types`;
  };

  return (
    <div className="flex flex-col gap-4 p-4 sm:p-6 bg-white rounded-2xl border border-gray-200 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Mobile: Stack all filters vertically */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Left side - Filters */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
          {/* Period Selector */}
          <div className="relative">
            <div className="flex items-center gap-2 px-4 py-2.5 text-sm border border-gray-300 rounded-xl dark:border-gray-700 dark:bg-gray-800 hover:border-primary transition-colors bg-white dark:bg-gray-900">
              <CalendarIcon className="w-4 h-4 text-primary flex-shrink-0" />
              <select
                value={period}
                onChange={(e) => onPeriodChange(e.target.value as any)}
                className="bg-transparent outline-none cursor-pointer flex-1 min-w-[120px]"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
            </div>
          </div>

          {/* City Filter - Custom Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowCityDropdown(!showCityDropdown)}
              className="flex items-center justify-between gap-2 w-full sm:w-auto px-4 py-2.5 text-sm border border-gray-300 rounded-xl dark:border-gray-700 dark:bg-gray-800 hover:border-primary transition-colors bg-white dark:bg-gray-900 min-w-[160px]"
              disabled={citiesLoading}
            >
              <FilterIcon className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="flex-1 text-left truncate">
                {citiesLoading ? "Loading..." : getSelectedCityNames()}
              </span>
              {selectedCities.length > 0 && (
                <span className="flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary rounded-full">
                  {selectedCities.length}
                </span>
              )}
              <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
            </button>

            {/* City Dropdown Menu */}
            {showCityDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowCityDropdown(false)}
                />
                <div className="absolute left-0 right-0 sm:left-auto sm:right-auto mt-2 w-full sm:w-72 max-h-80 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-20">
                  {/* Header */}
                  <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        Select Cities
                      </span>
                      {selectedCities.length > 0 && (
                        <button
                          onClick={clearCityFilters}
                          className="text-xs text-primary hover:text-primary-dark font-medium"
                        >
                          Clear All
                        </button>
                      )}
                    </div>
                  </div>

                  {/* City List */}
                  <div className="p-2">
                    {cities.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-4">
                        No cities available
                      </p>
                    ) : (
                      cities.map((city) => (
                        <label
                          key={city.id}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={selectedCities.includes(city.id)}
                            onChange={() => handleCityToggle(city.id)}
                            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary"
                          />
                          <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">
                            {city.name}
                            {city.state && (
                              <span className="text-xs text-gray-500 ml-1">
                                , {city.state}
                              </span>
                            )}
                          </span>
                          {city._count && (
                            <span className="text-xs text-gray-500">
                              {city._count.properties}
                            </span>
                          )}
                        </label>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Property Type Filter - Custom Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowTypeDropdown(!showTypeDropdown)}
              className="flex items-center justify-between gap-2 w-full sm:w-auto px-4 py-2.5 text-sm border border-gray-300 rounded-xl dark:border-gray-700 dark:bg-gray-800 hover:border-primary transition-colors bg-white dark:bg-gray-900 min-w-[160px]"
              disabled={typesLoading}
            >
              <FilterIcon className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="flex-1 text-left truncate">
                {typesLoading ? "Loading..." : getSelectedTypeNames()}
              </span>
              {selectedPropertyTypes.length > 0 && (
                <span className="flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary rounded-full">
                  {selectedPropertyTypes.length}
                </span>
              )}
              <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
            </button>

            {/* Property Type Dropdown Menu */}
            {showTypeDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowTypeDropdown(false)}
                />
                <div className="absolute left-0 right-0 sm:left-auto sm:right-auto mt-2 w-full sm:w-72 max-h-80 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-20">
                  {/* Header */}
                  <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        Property Types
                      </span>
                      {selectedPropertyTypes.length > 0 && (
                        <button
                          onClick={clearTypeFilters}
                          className="text-xs text-primary hover:text-primary-dark font-medium"
                        >
                          Clear All
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Type List */}
                  <div className="p-2">
                    {propertyTypes.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-4">
                        No property types available
                      </p>
                    ) : (
                      propertyTypes.map((type) => (
                        <label
                          key={type.id}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={selectedPropertyTypes.includes(type.id)}
                            onChange={() => handlePropertyTypeToggle(type.id)}
                            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary"
                          />
                          <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">
                            {type.name}
                          </span>
                          {type.icon && (
                            <span className="text-lg">{type.icon}</span>
                          )}
                        </label>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right side - Export Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:inline">
            Export:
          </span>
          <button
            onClick={() => onExport("csv")}
            disabled={isExporting}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex-1 sm:flex-none justify-center"
          >
            <DownloadIcon className="w-4 h-4" />
            <span>CSV</span>
          </button>
          <button
            onClick={() => onExport("excel")}
            disabled={isExporting}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex-1 sm:flex-none justify-center"
          >
            <DownloadIcon className="w-4 h-4" />
            <span>Excel</span>
          </button>
          <button
            onClick={() => onExport("pdf")}
            disabled={isExporting}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex-1 sm:flex-none justify-center"
          >
            <DownloadIcon className="w-4 h-4" />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* Active Filters Display */}
      {(selectedCities.length > 0 || selectedPropertyTypes.length > 0) && (
        <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Active Filters:
          </span>

          {selectedCities.map((cityId) => {
            const city = cities.find((c) => c.id === cityId);
            return city ? (
              <button
                key={cityId}
                onClick={() => handleCityToggle(cityId)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 rounded-full hover:bg-primary/20 transition-colors"
              >
                <span>{city.name}</span>
                <X className="w-3 h-3" />
              </button>
            ) : null;
          })}

          {selectedPropertyTypes.map((typeId) => {
            const type = propertyTypes.find((t) => t.id === typeId);
            return type ? (
              <button
                key={typeId}
                onClick={() => handlePropertyTypeToggle(typeId)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple-600 bg-purple-100 rounded-full hover:bg-purple-200 transition-colors dark:text-purple-400 dark:bg-purple-900/30"
              >
                <span>{type.name}</span>
                <X className="w-3 h-3" />
              </button>
            ) : null;
          })}

          <button
            onClick={() => {
              clearCityFilters();
              clearTypeFilters();
            }}
            className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 font-medium underline ml-2"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
}
