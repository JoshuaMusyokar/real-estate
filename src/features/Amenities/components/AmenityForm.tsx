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

const inp =
  "w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-xs sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all";
const lbl =
  "block text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1";

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

  const toggleCustom = () => {
    setShowCustomInput((v) => !v);
    if (!showCustomInput)
      onFormDataChange({ name: "", icon: "", category: "", order: 0 });
  };

  return (
    <div className="space-y-4">
      {/* Header + toggle */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs sm:text-sm font-black text-gray-900 dark:text-white">
          {showCustomInput ? "Custom Amenity" : "Select Amenity"}
        </h3>
        <button
          type="button"
          onClick={toggleCustom}
          className="text-[11px] sm:text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
        >
          {showCustomInput ? "← Back to predefined" : "Create custom →"}
        </button>
      </div>

      {!showCustomInput ? (
        <>
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search amenities…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={inp}
            />
          </div>

          {/* Category chips — scrollable on mobile */}
          <div
            className="flex gap-1.5 overflow-x-auto pb-0.5"
            style={{ scrollbarWidth: "none" }}
          >
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-bold transition-colors
                ${selectedCategory === "all" ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"}`}
            >
              All
            </button>
            {AMENITY_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-bold transition-colors
                  ${selectedCategory === cat ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="max-h-56 sm:max-h-72 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-xl p-2.5 sm:p-3">
            {filteredAmenities.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {filteredAmenities.map((amenity) => (
                  <button
                    key={amenity.name}
                    type="button"
                    onClick={() => handleSelectAmenity(amenity)}
                    className={`p-2 sm:p-3 border rounded-xl transition-all text-center
                      ${
                        formData.name === amenity.name
                          ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500"
                          : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
                      }`}
                  >
                    <img
                      src={amenity.icon}
                      alt={amenity.name}
                      className="w-7 h-7 sm:w-8 sm:h-8 object-contain mx-auto mb-1"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/icons/amenities/default.svg";
                      }}
                    />
                    <p className="text-[9px] sm:text-[10px] font-semibold text-gray-900 dark:text-white leading-tight truncate">
                      {amenity.name}
                    </p>
                    <p className="text-[8px] sm:text-[9px] text-gray-400 truncate">
                      {amenity.category}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-center py-6 text-[11px] sm:text-xs text-gray-400">
                No amenities found. Try a different search or create a custom
                amenity.
              </p>
            )}
          </div>

          {/* Selected preview */}
          {formData.name && (
            <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
              <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <img
                  src={formData.icon || "/icons/amenities/default.svg"}
                  alt={formData.name}
                  className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate">
                  {formData.name}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                  {formData.category} · Order {formData.order}
                </p>
              </div>
            </div>
          )}
          {formErrors.name && (
            <p className="text-[10px] sm:text-xs text-red-500 font-medium">
              {formErrors.name}
            </p>
          )}
        </>
      ) : (
        /* Custom form */
        <div className="space-y-3">
          <div>
            <label className={lbl}>Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => onFormDataChange({ name: e.target.value })}
              placeholder="e.g., Swimming Pool"
              className={`${inp} ${formErrors.name ? "border-red-400 dark:border-red-500" : ""}`}
            />
            {formErrors.name && (
              <p className="mt-1 text-[10px] text-red-500">{formErrors.name}</p>
            )}
          </div>

          <div>
            <label className={lbl}>Icon (Emoji or URL)</label>
            <input
              type="text"
              value={formData.icon}
              onChange={(e) => onFormDataChange({ icon: e.target.value })}
              placeholder="🏊 or /icons/amenities/pool.svg"
              className={inp}
            />
            <p className="mt-1 text-[10px] text-gray-400">
              Use an emoji or a path to an icon file
            </p>
          </div>

          <div>
            <label className={lbl}>Category</label>
            <select
              value={formData.category}
              onChange={(e) => onFormDataChange({ category: e.target.value })}
              className={`${inp} appearance-none`}
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
            <label className={lbl}>Display Order</label>
            <input
              type="number"
              value={formData.order}
              min="0"
              placeholder="e.g., 100"
              onChange={(e) =>
                onFormDataChange({ order: parseInt(e.target.value) || 0 })
              }
              className={`${inp} ${formErrors.order ? "border-red-400 dark:border-red-500" : ""}`}
            />
            {formErrors.order && (
              <p className="mt-1 text-[10px] text-red-500">
                {formErrors.order}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Active toggle — always visible */}
      <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
        <label className="flex items-center gap-2 cursor-pointer">
          <div className="relative flex-shrink-0">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => onFormDataChange({ isActive: e.target.checked })}
              className="sr-only peer"
            />
            <div
              className="w-9 h-5 bg-gray-200 dark:bg-gray-700 peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full
              peer peer-checked:after:translate-x-full peer-checked:after:border-white
              after:content-[''] after:absolute after:top-[2px] after:left-[2px]
              after:bg-white after:border-gray-300 after:border after:rounded-full
              after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"
            />
          </div>
          <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
            Active
          </span>
        </label>
      </div>
    </div>
  );
};
