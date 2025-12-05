import { Building2, Home, Warehouse, X } from "lucide-react";
import type { PropertyPurpose, PropertySearchFilters } from "../../types";
interface FilterPanelProps {
  filters: PropertySearchFilters;
  setFilters: React.Dispatch<React.SetStateAction<PropertySearchFilters>>;
  onClose: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  setFilters,
  onClose,
}) => {
  const propertyTypes: Array<{
    value: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { value: "RESIDENTIAL", label: "Residential", icon: Home },
    { value: "COMMERCIAL", label: "Commercial", icon: Building2 },
    { value: "INDUSTRIAL", label: "Industrial", icon: Warehouse },
  ];

  const purposes: PropertyPurpose[] = ["SALE", "RENT", "LEASE"];
  const bedroomOptions = [1, 2, 3, 4, 5];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-gray-900">Advanced Filters</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Property Type */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">
              Property Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              {propertyTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = filters.propertyType === type.value;
                return (
                  <button
                    key={type.value}
                    onClick={() =>
                      setFilters({
                        ...filters,
                        propertyType: isSelected ? undefined : type.value,
                      })
                    }
                    className={`p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? "border-blue-600 bg-blue-50 text-blue-600 shadow-md"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                    }`}
                  >
                    <Icon className="w-7 h-7 mx-auto mb-2" />
                    <div className="text-sm font-semibold">{type.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Purpose */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">
              Purpose
            </label>
            <div className="flex gap-3">
              {purposes.map((purpose) => {
                const isSelected = filters.purpose === purpose;
                return (
                  <button
                    key={purpose}
                    onClick={() =>
                      setFilters({
                        ...filters,
                        purpose: isSelected ? undefined : purpose,
                      })
                    }
                    className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                      isSelected
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {purpose}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">
              Price Range
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="number"
                  placeholder="Min Price"
                  value={filters.minPrice || ""}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      minPrice: e.target.value
                        ? parseInt(e.target.value)
                        : undefined,
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Max Price"
                  value={filters.maxPrice || ""}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      maxPrice: e.target.value
                        ? parseInt(e.target.value)
                        : undefined,
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Bedrooms */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">
              Bedrooms
            </label>
            <div className="flex gap-3">
              {bedroomOptions.map((num) => {
                const isSelected = filters.bedrooms?.includes(num);
                return (
                  <button
                    key={num}
                    onClick={() => {
                      const current = filters.bedrooms || [];
                      const updated = isSelected
                        ? current.filter((b) => b !== num)
                        : [...current, num];
                      setFilters({
                        ...filters,
                        bedrooms: updated.length ? updated : undefined,
                      });
                    }}
                    className={`w-14 h-14 rounded-xl font-bold text-lg transition-all ${
                      isSelected
                        ? "bg-blue-600 text-white shadow-lg scale-105"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {num}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Square Feet */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">
              Square Feet
            </label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Min Sqft"
                value={filters.minSquareFeet || ""}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    minSquareFeet: e.target.value
                      ? parseInt(e.target.value)
                      : undefined,
                  })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              <input
                type="number"
                placeholder="Max Sqft"
                value={filters.maxSquareFeet || ""}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    maxSquareFeet: e.target.value
                      ? parseInt(e.target.value)
                      : undefined,
                  })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Featured & Verified */}
          <div className="flex gap-6">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.featured || false}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    featured: e.target.checked || undefined,
                  })
                }
                className="w-5 h-5 rounded-lg border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">
                Featured Properties Only
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.verified || false}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    verified: e.target.checked || undefined,
                  })
                }
                className="w-5 h-5 rounded-lg border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">
                Verified Properties Only
              </span>
            </label>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex gap-3">
          <button
            onClick={() => setFilters({})}
            className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            Clear All
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};
