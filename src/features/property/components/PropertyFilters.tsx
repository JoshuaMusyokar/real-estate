import { Search, Filter, Grid, List, ChevronDown, X } from "lucide-react";
import { useState } from "react";
import type { PropertyStatus } from "../../../types";
import { Card, CardContent } from "../../../components/ui/Card";
import { Dropdown } from "../../../components/ui/dropdown/Dropdown";
import { DropdownItem } from "../../../components/ui/dropdown/DropdownItem";
import Button from "../../../components/ui/button/Button";

interface PropertyFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  statusFilter: PropertyStatus | "all";
  setStatusFilter: (value: PropertyStatus | "all") => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  propertyTypeFilter?: string;
  setPropertyTypeFilter?: (value: string) => void;
  purposeFilter?: string;
  setPurposeFilter?: (value: string) => void;
  priceRangeFilter?: string;
  setPriceRangeFilter?: (value: string) => void;
}

export const PropertyFilters: React.FC<PropertyFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  viewMode,
  setViewMode,
  propertyTypeFilter = "all",
  setPropertyTypeFilter,
  purposeFilter = "all",
  setPurposeFilter,
  priceRangeFilter = "all",
  setPriceRangeFilter,
}) => {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [showPropertyTypeDropdown, setShowPropertyTypeDropdown] =
    useState(false);
  const [showPurposeDropdown, setShowPurposeDropdown] = useState(false);
  const [showPriceRangeDropdown, setShowPriceRangeDropdown] = useState(false);

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "AVAILABLE", label: "Available" },
    { value: "PENDING", label: "Pending" },
    { value: "SOLD", label: "Sold" },
    { value: "RENTED", label: "Rented" },
    { value: "UNDER_REVIEW", label: "Under Review" },
    { value: "DRAFT", label: "Draft" },
  ];

  const propertyTypeOptions = [
    { value: "all", label: "All Types" },
    { value: "residential", label: "Residential" },
    { value: "commercial", label: "Commercial" },
    { value: "land", label: "Land" },
  ];

  const purposeOptions = [
    { value: "all", label: "All Purposes" },
    { value: "sale", label: "Sale" },
    { value: "rent", label: "Rent" },
    { value: "lease", label: "Lease" },
  ];

  const priceRangeOptions = [
    { value: "all", label: "All Prices" },
    { value: "under-500k", label: "Under $500K" },
    { value: "500k-1m", label: "$500K - $1M" },
    { value: "over-1m", label: "Over $1M" },
  ];

  const getStatusLabel = () => {
    return (
      statusOptions.find((opt) => opt.value === statusFilter)?.label ||
      "All Status"
    );
  };

  const getPropertyTypeLabel = () => {
    return (
      propertyTypeOptions.find((opt) => opt.value === propertyTypeFilter)
        ?.label || "All Types"
    );
  };

  const getPurposeLabel = () => {
    return (
      purposeOptions.find((opt) => opt.value === purposeFilter)?.label ||
      "All Purposes"
    );
  };

  const getPriceRangeLabel = () => {
    return (
      priceRangeOptions.find((opt) => opt.value === priceRangeFilter)?.label ||
      "All Prices"
    );
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const clearAllFilters = () => {
    setStatusFilter("all");
    setSearchQuery("");
    setPropertyTypeFilter?.("all");
    setPurposeFilter?.("all");
    setPriceRangeFilter?.("all");
    setShowMoreFilters(false);
  };

  const hasActiveFilters =
    statusFilter !== "all" ||
    propertyTypeFilter !== "all" ||
    purposeFilter !== "all" ||
    priceRangeFilter !== "all" ||
    searchQuery !== "";

  return (
    <Card className="mb-4 sm:mb-6">
      <CardContent className="p-3 sm:p-4 md:p-5">
        {/* Main Search and Quick Filters */}
        <div className="flex flex-col gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
          </div>

          {/* Filter Controls Row */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Status Filter Dropdown */}
            <div className="relative flex-1 sm:flex-initial min-w-[140px]">
              <button
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className="dropdown-toggle w-full sm:w-auto flex items-center justify-between gap-2 px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm"
              >
                <span className="truncate">{getStatusLabel()}</span>
                <ChevronDown className="w-4 h-4 flex-shrink-0" />
              </button>
              <Dropdown
                isOpen={showStatusDropdown}
                onClose={() => setShowStatusDropdown(false)}
                className="w-48"
              >
                <div className="py-1">
                  {statusOptions.map((option) => (
                    <DropdownItem
                      key={option.value}
                      onClick={() => {
                        setStatusFilter(option.value as PropertyStatus | "all");
                        setShowStatusDropdown(false);
                      }}
                      className={`${
                        statusFilter === option.value
                          ? "bg-blue-50 text-blue-600 font-medium"
                          : ""
                      }`}
                    >
                      {option.label}
                    </DropdownItem>
                  ))}
                </div>
              </Dropdown>
            </div>

            {/* More Filters Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMoreFilters(!showMoreFilters)}
              startIcon={<Filter className="w-4 h-4" />}
              className="flex-1 sm:flex-initial"
            >
              <span className="hidden sm:inline">More Filters</span>
              <span className="sm:hidden">Filters</span>
              {hasActiveFilters && (
                <span className="ml-1 w-2 h-2 bg-blue-600 rounded-full" />
              )}
            </Button>

            {/* View Mode Toggle - Hidden on Mobile */}
            <div className="hidden sm:flex items-center gap-1 border border-gray-300 rounded-lg sm:rounded-xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
                title="Grid view"
              >
                <Grid className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "list"
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
                title="List view"
              >
                <List className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Mobile View Toggle */}
            <div className="sm:hidden ml-auto">
              <button
                onClick={() =>
                  setViewMode(viewMode === "grid" ? "list" : "grid")
                }
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {viewMode === "grid" ? (
                  <List className="w-5 h-5 text-gray-600" />
                ) : (
                  <Grid className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Advanced Filters - Collapsible */}
        {showMoreFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Property Type Dropdown */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                  Property Type
                </label>
                <div className="relative">
                  <button
                    onClick={() =>
                      setShowPropertyTypeDropdown(!showPropertyTypeDropdown)
                    }
                    className="dropdown-toggle w-full flex items-center justify-between gap-2 px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm"
                  >
                    <span className="truncate">{getPropertyTypeLabel()}</span>
                    <ChevronDown className="w-4 h-4 flex-shrink-0" />
                  </button>
                  <Dropdown
                    isOpen={showPropertyTypeDropdown}
                    onClose={() => setShowPropertyTypeDropdown(false)}
                    className="w-full"
                  >
                    <div className="py-1">
                      {propertyTypeOptions.map((option) => (
                        <DropdownItem
                          key={option.value}
                          onClick={() => {
                            setPropertyTypeFilter?.(option.value);
                            setShowPropertyTypeDropdown(false);
                          }}
                          className={`${
                            propertyTypeFilter === option.value
                              ? "bg-blue-50 text-blue-600 font-medium"
                              : ""
                          }`}
                        >
                          {option.label}
                        </DropdownItem>
                      ))}
                    </div>
                  </Dropdown>
                </div>
              </div>

              {/* Purpose Dropdown */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                  Purpose
                </label>
                <div className="relative">
                  <button
                    onClick={() => setShowPurposeDropdown(!showPurposeDropdown)}
                    className="dropdown-toggle w-full flex items-center justify-between gap-2 px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm"
                  >
                    <span className="truncate">{getPurposeLabel()}</span>
                    <ChevronDown className="w-4 h-4 flex-shrink-0" />
                  </button>
                  <Dropdown
                    isOpen={showPurposeDropdown}
                    onClose={() => setShowPurposeDropdown(false)}
                    className="w-full"
                  >
                    <div className="py-1">
                      {purposeOptions.map((option) => (
                        <DropdownItem
                          key={option.value}
                          onClick={() => {
                            setPurposeFilter?.(option.value);
                            setShowPurposeDropdown(false);
                          }}
                          className={`${
                            purposeFilter === option.value
                              ? "bg-blue-50 text-blue-600 font-medium"
                              : ""
                          }`}
                        >
                          {option.label}
                        </DropdownItem>
                      ))}
                    </div>
                  </Dropdown>
                </div>
              </div>

              {/* Price Range Dropdown */}
              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                  Price Range
                </label>
                <div className="relative">
                  <button
                    onClick={() =>
                      setShowPriceRangeDropdown(!showPriceRangeDropdown)
                    }
                    className="dropdown-toggle w-full flex items-center justify-between gap-2 px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm"
                  >
                    <span className="truncate">{getPriceRangeLabel()}</span>
                    <ChevronDown className="w-4 h-4 flex-shrink-0" />
                  </button>
                  <Dropdown
                    isOpen={showPriceRangeDropdown}
                    onClose={() => setShowPriceRangeDropdown(false)}
                    className="w-full"
                  >
                    <div className="py-1">
                      {priceRangeOptions.map((option) => (
                        <DropdownItem
                          key={option.value}
                          onClick={() => {
                            setPriceRangeFilter?.(option.value);
                            setShowPriceRangeDropdown(false);
                          }}
                          className={`${
                            priceRangeFilter === option.value
                              ? "bg-blue-50 text-blue-600 font-medium"
                              : ""
                          }`}
                        >
                          {option.label}
                        </DropdownItem>
                      ))}
                    </div>
                  </Dropdown>
                </div>
              </div>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <div className="mt-4 flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-gray-600"
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
