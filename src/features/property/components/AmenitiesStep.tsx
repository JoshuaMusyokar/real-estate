import {
  AlertCircle,
  Check,
  Search,
  Wifi,
  Tv,
  Wind,
  Car,
  Dumbbell,
  UtensilsCrossed,
  Waves,
  ShieldCheck,
  Lightbulb,
  X,
} from "lucide-react";
import { useState } from "react";
import type { Amenity, PropertyCreateRequest } from "../../../types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/Card";
import Input from "../../../components/form/input/InputField";

interface AmenitiesStepProps {
  formData: PropertyCreateRequest;
  amenities: Amenity[];
  categories: string[];
  errors: Record<string, string>;
  onUpdate: (data: Partial<PropertyCreateRequest>) => void;
}

// Icon mapping for categories
const getCategoryIcon = (category: string) => {
  const iconMap: Record<string, any> = {
    Basic: Lightbulb,
    Entertainment: Tv,
    "Climate Control": Wind,
    "Internet & Office": Wifi,
    Parking: Car,
    Fitness: Dumbbell,
    Dining: UtensilsCrossed,
    "Pool & Spa": Waves,
    Security: ShieldCheck,
    Kitchen: UtensilsCrossed,
    Safety: ShieldCheck,
  };
  return iconMap[category] || Lightbulb;
};

export const AmenitiesStep: React.FC<AmenitiesStepProps> = ({
  formData,
  amenities,
  categories,
  errors,
  onUpdate,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleAmenityToggle = (amenityId: string) => {
    const current = formData.amenities || [];
    const isSelected = current.includes(amenityId);
    const updated = isSelected
      ? current.filter((id) => id !== amenityId)
      : [...current, amenityId];
    onUpdate({ amenities: updated });
  };

  // Filter amenities based on search and category
  const filteredAmenities = amenities.filter((amenity) => {
    const matchesSearch = amenity.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory
      ? amenity.category === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  const selectedCount = formData.amenities?.length || 0;

  // Group filtered amenities by category
  const groupedAmenities = categories.reduce(
    (acc, category) => {
      const categoryAmenities = filteredAmenities.filter(
        (a) => a.category === category,
      );
      if (categoryAmenities.length > 0) {
        acc[category] = categoryAmenities;
      }
      return acc;
    },
    {} as Record<string, Amenity[]>,
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          What amenities does your property offer?
        </h3>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Select all that apply to help guests find your property
        </p>
      </div>

      {/* Error Alert */}
      {errors.amenities && (
        <div className="bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg sm:rounded-xl p-3 sm:p-4">
          <div className="flex items-start gap-2 sm:gap-3">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-error-600 dark:text-error-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-error-800 dark:text-error-300">
              {errors.amenities}
            </p>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4 sm:p-5 md:p-6">
          <div className="space-y-3 sm:space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              </div>
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search amenities..."
                className="pl-10 sm:pl-12"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium text-xs sm:text-sm whitespace-nowrap transition-all flex-shrink-0 ${
                  selectedCategory === null
                    ? "bg-brand-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                All ({amenities.length})
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium text-xs sm:text-sm whitespace-nowrap transition-all flex-shrink-0 ${
                    selectedCategory === category
                      ? "bg-brand-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {category} (
                  {amenities.filter((a) => a.category === category).length})
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Amenities by Category */}
      {Object.keys(groupedAmenities).length > 0 ? (
        <div className="space-y-4 sm:space-y-6">
          {Object.entries(groupedAmenities).map(
            ([category, categoryAmenities]) => {
              const Icon = getCategoryIcon(category);
              return (
                <Card key={category}>
                  <CardHeader className="p-4 sm:p-5 md:p-6 border-b border-gray-200 dark:border-gray-700">
                    <CardTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      {category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-5 md:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                      {categoryAmenities.map((amenity) => {
                        const isSelected = formData.amenities?.includes(
                          amenity.id,
                        );
                        return (
                          <button
                            key={amenity.id}
                            type="button"
                            onClick={() => handleAmenityToggle(amenity.id)}
                            className={`group relative px-3 sm:px-4 py-3 sm:py-4 rounded-lg sm:rounded-xl text-left transition-all border-2 ${
                              isSelected
                                ? "bg-brand-50 dark:bg-brand-900/20 border-brand-600 dark:border-brand-500 shadow-sm"
                                : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm"
                            }`}
                          >
                            <div className="flex items-start gap-2 sm:gap-3">
                              <div
                                className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                  isSelected
                                    ? "bg-brand-600 border-brand-600"
                                    : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 group-hover:border-brand-600"
                                }`}
                              >
                                {isSelected && (
                                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                )}
                              </div>
                              <span
                                className={`text-xs sm:text-sm font-medium ${
                                  isSelected
                                    ? "text-brand-900 dark:text-brand-100"
                                    : "text-gray-900 dark:text-gray-100"
                                }`}
                              >
                                {amenity.name}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            },
          )}
        </div>
      ) : (
        // No Results
        <Card>
          <CardContent className="p-8 sm:p-12 text-center">
            <Search className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No amenities found
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4">
              Try adjusting your search or filter
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory(null);
              }}
              className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors text-xs sm:text-sm font-medium"
            >
              Clear Filters
            </button>
          </CardContent>
        </Card>
      )}

      {/* Selection Summary - Sticky on Mobile */}
      <div className="sticky bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4 sm:relative sm:border-0 sm:p-0">
        <Card
          className={`${
            selectedCount > 0
              ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800"
              : "bg-gray-50 dark:bg-gray-800/50"
          }`}
        >
          <CardContent className="p-3 sm:p-4 md:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ${
                  selectedCount > 0
                    ? "bg-brand-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                }`}
              >
                <Check className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
              </div>
              <div className="flex-1 min-w-0">
                <div
                  className={`text-base sm:text-lg md:text-xl font-bold mb-0.5 sm:mb-1 ${
                    selectedCount > 0
                      ? "text-blue-900 dark:text-blue-100"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {selectedCount}{" "}
                  {selectedCount === 1 ? "Amenity" : "Amenities"} Selected
                </div>
                <div
                  className={`text-xs sm:text-sm ${
                    selectedCount > 0
                      ? "text-blue-700 dark:text-blue-300"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {selectedCount === 0
                    ? "Select amenities to increase property appeal"
                    : "Great! More amenities improve search visibility"}
                </div>
              </div>
              {selectedCount > 0 && (
                <div className="hidden sm:block px-3 py-1 bg-blue-600 text-white rounded-full text-xs sm:text-sm font-bold">
                  {selectedCount}
                </div>
              )}
            </div>

            {/* Selected Amenities Tags - Show on mobile */}
            {selectedCount > 0 && (
              <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2">
                {formData.amenities?.slice(0, 5).map((amenityId) => {
                  const amenity = amenities.find((a) => a.id === amenityId);
                  if (!amenity) return null;
                  return (
                    <span
                      key={amenityId}
                      className="inline-flex items-center gap-1 px-2 py-0.5 sm:py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs font-medium"
                    >
                      {amenity.name}
                      <button
                        onClick={() => handleAmenityToggle(amenityId)}
                        className="hover:text-blue-900 dark:hover:text-blue-100"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}
                {selectedCount > 5 && (
                  <span className="inline-flex items-center px-2 py-0.5 sm:py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs font-medium">
                    +{selectedCount - 5} more
                  </span>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
