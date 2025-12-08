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
} from "lucide-react";
import type { PropertyCreateRequest, NearbyPlace } from "../../../types";

interface NearbyPlacesStepProps {
  formData: PropertyCreateRequest;
  errors: Record<string, string>;
  onUpdate: (data: Partial<PropertyCreateRequest>) => void;
}

// Common nearby place categories with icons
const NEARBY_CATEGORIES = [
  { value: "School", label: "School", icon: <School className="w-4 h-4" /> },
  {
    value: "Hospital",
    label: "Hospital",
    icon: <Hospital className="w-4 h-4" />,
  },
  {
    value: "Mall",
    label: "Shopping Mall",
    icon: <ShoppingBag className="w-4 h-4" />,
  },
  {
    value: "Metro",
    label: "Metro Station",
    icon: <Train className="w-4 h-4" />,
  },
  { value: "Bus", label: "Bus Station", icon: <Train className="w-4 h-4" /> },
  { value: "Cafe", label: "Cafe", icon: <Coffee className="w-4 h-4" /> },
  {
    value: "Restaurant",
    label: "Restaurant",
    icon: <Utensils className="w-4 h-4" />,
  },
  { value: "Bank", label: "Bank/ATM", icon: <Banknote className="w-4 h-4" /> },
  { value: "Park", label: "Park", icon: <TreePine className="w-4 h-4" /> },
  {
    value: "Supermarket",
    label: "Supermarket",
    icon: <ShoppingBag className="w-4 h-4" />,
  },
  {
    value: "Gym",
    label: "Gym/Fitness",
    icon: <Building className="w-4 h-4" />,
  },
  {
    value: "Pharmacy",
    label: "Pharmacy",
    icon: <Hospital className="w-4 h-4" />,
  },
  { value: "Cinema", label: "Cinema", icon: <Building className="w-4 h-4" /> },
  { value: "Other", label: "Other", icon: <MapPin className="w-4 h-4" /> },
];

export const NearbyPlacesStep: React.FC<NearbyPlacesStepProps> = ({
  formData,
  //   errors,
  onUpdate,
}) => {
  const [newPlace, setNewPlace] = useState<Partial<NearbyPlace>>({
    name: "",
    distance: "",
    category: "School",
    icon: null,
  });
  const [searchQuery, setSearchQuery] = useState("");

  // Get existing nearby places or initialize empty array
  const nearbyPlaces: NearbyPlace[] = formData.nearbyPlaces || [];

  // Filter places based on search
  const filteredPlaces = nearbyPlaces.filter(
    (place) =>
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddPlace = () => {
    if (!newPlace.name || !newPlace.distance) {
      return;
    }

    const placeToAdd: NearbyPlace = {
      name: newPlace.name,
      distance: newPlace.distance,
      category: newPlace.category || "Other",
      icon: null,
      // icon: NEARBY_CATEGORIES.find(
      //   (cat) => cat.value === newPlace.category
      // )?.icon?.toString(),
    };

    const updatedPlaces = [...nearbyPlaces, placeToAdd];
    onUpdate({ nearbyPlaces: updatedPlaces });

    // Reset form
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
    value: string
  ) => {
    const updatedPlaces = [...nearbyPlaces];
    updatedPlaces[index] = { ...updatedPlaces[index], [field]: value };
    onUpdate({ nearbyPlaces: updatedPlaces });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <MapPin className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Nearby Places & Landmarks
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Add nearby places, landmarks, and important locations to help
          potential buyers/renters understand the neighborhood.
        </p>
      </div>

      {/* Add New Place Form */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Nearby Place
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Place Name */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Place Name *
            </label>
            <input
              type="text"
              value={newPlace.name}
              onChange={(e) =>
                setNewPlace({ ...newPlace, name: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="e.g., City Mall, St. Mary's School"
            />
          </div>

          {/* Distance */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Distance *
            </label>
            <input
              type="text"
              value={newPlace.distance}
              onChange={(e) =>
                setNewPlace({ ...newPlace, distance: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="e.g., 500m, 1.2km, 0.5mi"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Category
            </label>
            <select
              value={newPlace.category}
              onChange={(e) =>
                setNewPlace({ ...newPlace, category: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
            >
              {NEARBY_CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddPlace}
          disabled={!newPlace.name || !newPlace.distance}
          className={`mt-6 w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
            !newPlace.name || !newPlace.distance
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          <Plus className="w-5 h-5" />
          Add Place
        </button>
      </div>

      {/* Search and Filter */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search nearby places..."
          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </div>

      {/* Nearby Places List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">
            Nearby Places ({nearbyPlaces.length})
          </h3>
          {nearbyPlaces.length > 0 && (
            <span className="text-sm text-gray-600">
              Click on any field to edit
            </span>
          )}
        </div>

        {filteredPlaces.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-bold text-gray-900 mb-2">
              No nearby places added yet
            </h4>
            <p className="text-gray-600">
              Add nearby places to help people understand the neighborhood
              better.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPlaces.map((place, index) => {
              const categoryInfo = NEARBY_CATEGORIES.find(
                (cat) => cat.value === place.category
              );

              return (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        {categoryInfo?.icon || (
                          <MapPin className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <input
                          type="text"
                          value={place.name}
                          onChange={(e) =>
                            handleUpdatePlace(index, "name", e.target.value)
                          }
                          className="text-lg font-bold text-gray-900 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none px-1 py-0.5"
                        />
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                            {place.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemovePlace(index)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={place.distance}
                        onChange={(e) =>
                          handleUpdatePlace(index, "distance", e.target.value)
                        }
                        className="text-sm text-gray-600 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none px-1 py-0.5"
                        placeholder="Distance"
                      />
                    </div>
                    <div className="text-xs text-gray-500">Click to edit</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Add Suggestions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-blue-600" />
          Quick Add Suggestions
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {NEARBY_CATEGORIES.map((category) => (
            <button
              key={category.value}
              type="button"
              onClick={() => {
                setNewPlace({
                  ...newPlace,
                  category: category.value,
                });
              }}
              className={`p-3 rounded-lg border transition-all flex items-center justify-center gap-2 ${
                newPlace.category === category.value
                  ? "bg-blue-100 border-blue-300 text-blue-700"
                  : "bg-white border-gray-200 text-gray-700 hover:border-blue-300"
              }`}
            >
              {category.icon}
              <span className="text-sm font-medium">{category.label}</span>
            </button>
          ))}
        </div>
        <p className="mt-4 text-sm text-gray-600">
          Click on a category to quickly select it for your next entry.
        </p>
      </div>

      {/* Tips */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h4 className="text-lg font-bold text-gray-900 mb-3">
          Tips for Adding Nearby Places:
        </h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
            <span>
              Include schools, hospitals, shopping malls, and transportation
              hubs
            </span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
            <span>Use accurate distances (e.g., "500m", "1.2km", "0.8mi")</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
            <span>
              Add places that would be important to potential buyers/renters
            </span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
            <span>
              You can edit or remove places anytime by clicking on them
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};
