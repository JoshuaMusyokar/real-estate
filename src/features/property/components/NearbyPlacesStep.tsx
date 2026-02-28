import { useState } from "react";
import {
  Plus,
  Trash2,
  MapPin,
  School,
  Hospital,
  ShoppingBag,
  Train,
  Coffee,
  Utensils,
  Banknote,
  TreePine,
  Building,
  Search,
  AlertCircle,
  Edit2,
  X,
  Dumbbell,
} from "lucide-react";
import type { PropertyCreateRequest, NearbyPlace } from "../../../types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/Card";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Button from "../../../components/ui/button/Button";

interface NearbyPlacesStepProps {
  formData: PropertyCreateRequest;
  errors: Record<string, string>;
  onUpdate: (data: Partial<PropertyCreateRequest>) => void;
}

// Common nearby place categories with icons
const NEARBY_CATEGORIES = [
  {
    value: "School",
    label: "School",
    icon: School,
    color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30",
  },
  {
    value: "Hospital",
    label: "Hospital",
    icon: Hospital,
    color: "text-red-600 bg-red-100 dark:bg-red-900/30",
  },
  {
    value: "Mall",
    label: "Shopping Mall",
    icon: ShoppingBag,
    color: "text-pink-600 bg-pink-100 dark:bg-pink-900/30",
  },
  {
    value: "Metro",
    label: "Metro Station",
    icon: Train,
    color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30",
  },
  {
    value: "Bus",
    label: "Bus Station",
    icon: Train,
    color: "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30",
  },
  {
    value: "Cafe",
    label: "Cafe",
    icon: Coffee,
    color: "text-amber-600 bg-amber-100 dark:bg-amber-900/30",
  },
  {
    value: "Restaurant",
    label: "Restaurant",
    icon: Utensils,
    color: "text-orange-600 bg-orange-100 dark:bg-orange-900/30",
  },
  {
    value: "Bank",
    label: "Bank/ATM",
    icon: Banknote,
    color: "text-green-600 bg-green-100 dark:bg-green-900/30",
  },
  {
    value: "Park",
    label: "Park",
    icon: TreePine,
    color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30",
  },
  {
    value: "Supermarket",
    label: "Supermarket",
    icon: ShoppingBag,
    color: "text-cyan-600 bg-cyan-100 dark:bg-cyan-900/30",
  },
  {
    value: "Gym",
    label: "Gym/Fitness",
    icon: Dumbbell,
    color: "text-teal-600 bg-teal-100 dark:bg-teal-900/30",
  },
  {
    value: "Pharmacy",
    label: "Pharmacy",
    icon: Hospital,
    color: "text-rose-600 bg-rose-100 dark:bg-rose-900/30",
  },
  {
    value: "Cinema",
    label: "Cinema",
    icon: Building,
    color: "text-violet-600 bg-violet-100 dark:bg-violet-900/30",
  },
  {
    value: "Other",
    label: "Other",
    icon: MapPin,
    color: "text-gray-600 bg-gray-100 dark:bg-gray-900/30",
  },
];

export const NearbyPlacesStep: React.FC<NearbyPlacesStepProps> = ({
  formData,
  onUpdate,
}) => {
  const [newPlace, setNewPlace] = useState<Partial<NearbyPlace>>({
    name: "",
    distance: "",
    category: "School",
    icon: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const nearbyPlaces: NearbyPlace[] = formData.nearbyPlaces || [];

  const filteredPlaces = nearbyPlaces.filter(
    (place) =>
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleAddPlace = () => {
    if (!newPlace.name || !newPlace.distance) {
      return;
    }

    const placeToAdd: NearbyPlace = {
      name: newPlace.name,
      distance: newPlace.distance,
      category: newPlace.category || "Other",
      icon: "",
    };

    const updatedPlaces = [...nearbyPlaces, placeToAdd];
    onUpdate({ nearbyPlaces: updatedPlaces });

    setNewPlace({
      name: "",
      distance: "",
      category: "School",
    });
  };

  const handleRemovePlace = (index: number) => {
    const updatedPlaces = nearbyPlaces.filter((_, i) => i !== index);
    onUpdate({ nearbyPlaces: updatedPlaces });
  };

  const handleUpdatePlace = (
    index: number,
    field: keyof NearbyPlace,
    value: string,
  ) => {
    const updatedPlaces = [...nearbyPlaces];
    updatedPlaces[index] = { ...updatedPlaces[index], [field]: value };
    onUpdate({ nearbyPlaces: updatedPlaces });
  };

  const getCategoryInfo = (categoryValue: string) => {
    return (
      NEARBY_CATEGORIES.find((cat) => cat.value === categoryValue) ||
      NEARBY_CATEGORIES[NEARBY_CATEGORIES.length - 1]
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-3 sm:mb-4">
          <MapPin className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Nearby Places & Landmarks
        </h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
          Add nearby places, landmarks, and important locations to help
          potential buyers/renters understand the neighborhood.
        </p>
      </div>

      {/* Add New Place Form */}
      <Card>
        <CardHeader className="p-4 sm:p-5 md:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            Add Nearby Place
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 md:p-6 pt-0 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Place Name */}
            <div className="sm:col-span-2 lg:col-span-1">
              <Label>Place Name *</Label>
              <Input
                type="text"
                value={newPlace.name || ""}
                onChange={(e) =>
                  setNewPlace({ ...newPlace, name: e.target.value })
                }
                placeholder="e.g., City Mall, St. Mary's School"
              />
            </div>

            {/* Distance */}
            <div>
              <Label>Distance *</Label>
              <Input
                type="text"
                value={newPlace.distance || ""}
                onChange={(e) =>
                  setNewPlace({ ...newPlace, distance: e.target.value })
                }
                placeholder="e.g., 500m, 1.2km"
              />
            </div>

            {/* Category */}
            <div>
              <Label>Category</Label>
              <select
                value={newPlace.category}
                onChange={(e) =>
                  setNewPlace({ ...newPlace, category: e.target.value })
                }
                className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              >
                {NEARBY_CATEGORIES.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Button
            onClick={handleAddPlace}
            disabled={!newPlace.name || !newPlace.distance}
            className="w-full"
            startIcon={<Plus className="w-4 h-4 sm:w-5 sm:h-5" />}
          >
            Add Place
          </Button>
        </CardContent>
      </Card>

      {/* Quick Category Selection */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardHeader className="p-4 sm:p-5 md:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-blue-900 dark:text-blue-100">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
            Quick Category Selection
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 md:p-6 pt-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3">
            {NEARBY_CATEGORIES.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.value}
                  type="button"
                  onClick={() => {
                    setNewPlace({
                      ...newPlace,
                      category: category.value,
                    });
                  }}
                  className={`p-2 sm:p-3 rounded-lg border-2 transition-all flex flex-col items-center justify-center gap-1 sm:gap-2 ${
                    newPlace.category === category.value
                      ? "bg-brand-100 dark:bg-brand-900/30 border-brand-500 dark:border-brand-600"
                      : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-700"
                  }`}
                >
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${category.color}`}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium text-gray-900 dark:text-gray-100 text-center">
                    {category.label}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-blue-700 dark:text-blue-300">
            Click on a category to quickly select it for your next entry.
          </p>
        </CardContent>
      </Card>

      {/* Search */}
      {nearbyPlaces.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search nearby places..."
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
      )}

      {/* Nearby Places List */}
      <Card>
        <CardHeader className="p-4 sm:p-5 md:p-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base sm:text-lg">
              Nearby Places ({nearbyPlaces.length})
            </CardTitle>
            {nearbyPlaces.length > 0 && (
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
                Click to edit
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 md:p-6 pt-0">
          {filteredPlaces.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <MapPin className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3 sm:mb-4" />
              <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2">
                {nearbyPlaces.length === 0
                  ? "No nearby places added yet"
                  : "No results found"}
              </h4>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                {nearbyPlaces.length === 0
                  ? "Add nearby places to help people understand the neighborhood better."
                  : "Try adjusting your search query."}
              </p>
              {searchQuery && (
                <Button
                  onClick={() => setSearchQuery("")}
                  variant="outline"
                  className="mt-4"
                >
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {filteredPlaces.map((place, index) => {
                const categoryInfo = getCategoryInfo(place.category);
                const Icon = categoryInfo.icon;
                const isEditing = editingIndex === index;

                return (
                  <div
                    key={index}
                    className="bg-gray-50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:border-brand-300 dark:hover:border-brand-700 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                        <div
                          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${categoryInfo.color}`}
                        >
                          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          {isEditing ? (
                            <Input
                              type="text"
                              value={place.name}
                              onChange={(e) =>
                                handleUpdatePlace(index, "name", e.target.value)
                              }
                              onBlur={() => setEditingIndex(null)}
                              // autoFocus
                              className="mb-2"
                            />
                          ) : (
                            <h4
                              onClick={() => setEditingIndex(index)}
                              className="text-sm sm:text-base font-bold text-gray-900 dark:text-white cursor-pointer hover:text-brand-600 dark:hover:text-brand-400 truncate"
                            >
                              {place.name}
                            </h4>
                          )}
                          <span className="inline-block text-[10px] sm:text-xs font-medium px-2 py-0.5 sm:py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-full border border-gray-200 dark:border-gray-700">
                            {categoryInfo.label}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 ml-2">
                        <button
                          type="button"
                          onClick={() => setEditingIndex(index)}
                          className="p-1.5 sm:p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemovePlace(index)}
                          className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pl-11 sm:pl-13">
                      <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                      {isEditing ? (
                        <Input
                          type="text"
                          value={place.distance}
                          onChange={(e) =>
                            handleUpdatePlace(index, "distance", e.target.value)
                          }
                          onBlur={() => setEditingIndex(null)}
                          placeholder="Distance"
                        />
                      ) : (
                        <span
                          onClick={() => setEditingIndex(index)}
                          className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 cursor-pointer hover:text-brand-600 dark:hover:text-brand-400"
                        >
                          {place.distance}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-gray-50 dark:bg-gray-800/50">
        <CardHeader className="p-4 sm:p-5 md:p-6">
          <CardTitle className="text-base sm:text-lg">
            Tips for Adding Nearby Places:
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 md:p-6 pt-0">
          <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-2 sm:gap-3">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-brand-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <span>
                Include schools, hospitals, shopping malls, and transportation
                hubs
              </span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-brand-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <span>
                Use accurate distances (e.g., "500m", "1.2km", "0.8mi")
              </span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-brand-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <span>
                Add places that would be important to potential buyers/renters
              </span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-brand-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <span>Click on any place to edit its name or distance</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
