import { useState } from "react";
import {
  PREDEFINED_AMENITIES,
  AMENITY_CATEGORIES,
  searchAmenities,
} from "../../../constants/amenities";
import type { AmenityFormData } from "../../../types";

interface AmenityFormProps {
  formData: AmenityFormData;
  formErrors: Record<string, string>;
  categories: string[];
  onFormDataChange: (updates: Partial<AmenityFormData>) => void;
}

export const AmenityForm = ({
  formData,
  formErrors,
  onFormDataChange,
}: AmenityFormProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const filteredAmenities = searchQuery
    ? searchAmenities(searchQuery)
    : selectedCategory === "all"
    ? PREDEFINED_AMENITIES
    : PREDEFINED_AMENITIES.filter((a) => a.category === selectedCategory);

  const handleSelectAmenity = (amenity: (typeof PREDEFINED_AMENITIES)[0]) => {
    onFormDataChange({
      name: amenity.name,
      icon: amenity.icon,
      category: amenity.category,
      order: amenity.order,
    });
    setShowCustomInput(false);
  };

  const toggleCustomInput = () => {
    setShowCustomInput(!showCustomInput);
    if (!showCustomInput) {
      // Clear selection when switching to custom
      onFormDataChange({
        name: "",
        icon: "",
        category: "",
        order: 0,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Toggle between predefined and custom */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {showCustomInput ? "Custom Amenity" : "Select Amenity"}
        </h3>
        <button
          type="button"
          onClick={toggleCustomInput}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          {showCustomInput ? "← Back to predefined" : "Create custom →"}
        </button>
      </div>

      {!showCustomInput ? (
        <>
          {/* Search and Filter */}
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Search amenities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                All
              </button>
              {AMENITY_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === cat
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Amenities Grid */}
          <div className="max-h-96 overflow-y-auto border-2 border-gray-200 dark:border-gray-700 rounded-xl p-4">
            {filteredAmenities.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filteredAmenities.map((amenity) => (
                  <button
                    key={amenity.name}
                    type="button"
                    onClick={() => handleSelectAmenity(amenity)}
                    className={`p-4 border-2 rounded-xl transition-all hover:shadow-md ${
                      formData.name === amenity.name
                        ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500"
                        : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <img
                        src={amenity.icon}
                        alt={amenity.name}
                        className="w-10 h-10 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/icons/amenities/default.svg";
                        }}
                      />
                      <span className="text-xs font-medium text-center text-gray-900 dark:text-white">
                        {amenity.name}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {amenity.category}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No amenities found. Try a different search or create a custom
                amenity.
              </div>
            )}
          </div>

          {/* Selected Amenity Display */}
          {formData.name && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl border-2 border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <img
                    src={formData.icon || "/icons/amenities/default.svg"}
                    alt={formData.name}
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-lg text-gray-900 dark:text-white">
                    {formData.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Category: {formData.category}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Order: {formData.order}
                  </p>
                </div>
              </div>
            </div>
          )}
          {formErrors.name && (
            <p className="text-red-500 text-sm font-medium">
              {formErrors.name}
            </p>
          )}
        </>
      ) : (
        /* Custom Input Form */
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => onFormDataChange({ name: e.target.value })}
              className={`w-full px-4 py-3 border-2 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                formErrors.name
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              placeholder="e.g., Swimming Pool"
            />
            {formErrors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {formErrors.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Icon (Emoji or URL)
            </label>
            <input
              type="text"
              value={formData.icon}
              onChange={(e) => onFormDataChange({ icon: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="🏊 or /icons/amenities/pool.svg"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Use emoji or path to icon file
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => onFormDataChange({ category: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select category</option>
              {AMENITY_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Display Order
            </label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) =>
                onFormDataChange({
                  order: parseInt(e.target.value) || 0,
                })
              }
              className={`w-full px-4 py-3 border-2 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                formErrors.order
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              min="0"
              placeholder="e.g., 100"
            />
            {formErrors.order && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {formErrors.order}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Active Status - Always Visible */}
      <div className="pt-4 border-t-2 border-gray-200 dark:border-gray-700">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => onFormDataChange({ isActive: e.target.checked })}
            className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Active
          </span>
        </label>
      </div>
    </div>
  );
};
