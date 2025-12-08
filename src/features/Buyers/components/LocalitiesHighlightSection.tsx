// components/NearbyPlacesSection.tsx
import React, { useState, useEffect } from "react";
import {
  MapPin,
  Navigation,
  School,
  Heart,
  Utensils,
  ShoppingCart,
  Trees,
  Bus,
  Church,
  PiggyBank,
  Film,
  ChevronDown,
  ChevronUp,
  User,
  Database,
  RefreshCw,
} from "lucide-react";
import type { LocalityHighlight, NearbyPlace } from "../../../types";

interface NearbyPlacesSectionProps {
  localityName: string;
  cityName: string;
  localityHighlights?: LocalityHighlight[]; // From locality database
  nearbyPlaces?: NearbyPlace[]; // From property (user input)
}

interface MergedPlace {
  id: string;
  name: string;
  distance: number; // In km for consistent comparison
  distanceDisplay: string; // Original display format
  category: string;
  categoryType: "locality" | "user";
  icon: string | null;
  source: string;
}

const CATEGORY_CONFIG: Record<
  string,
  { icon: React.ElementType; gradient: string; label: string }
> = {
  // Match locality highlight types
  school: {
    icon: School,
    gradient: "from-blue-500 to-indigo-600",
    label: "Schools",
  },
  hospital: {
    icon: Heart,
    gradient: "from-red-500 to-rose-600",
    label: "Hospitals",
  },
  restaurant: {
    icon: Utensils,
    gradient: "from-green-500 to-emerald-600",
    label: "Restaurants",
  },
  shopping: {
    icon: ShoppingCart,
    gradient: "from-purple-500 to-pink-600",
    label: "Shopping",
  },
  park: {
    icon: Trees,
    gradient: "from-emerald-500 to-teal-600",
    label: "Parks",
  },
  transport: {
    icon: Bus,
    gradient: "from-orange-500 to-amber-600",
    label: "Transport",
  },
  worship: {
    icon: Church,
    gradient: "from-indigo-500 to-purple-600",
    label: "Worship",
  },
  bank: {
    icon: PiggyBank,
    gradient: "from-lime-500 to-green-600",
    label: "Banks",
  },
  entertainment: {
    icon: Film,
    gradient: "from-pink-500 to-fuchsia-600",
    label: "Entertainment",
  },
  // User input categories
  School: {
    icon: School,
    gradient: "from-blue-500 to-indigo-600",
    label: "Schools",
  },
  Hospital: {
    icon: Heart,
    gradient: "from-red-500 to-rose-600",
    label: "Hospitals",
  },
  Mall: {
    icon: ShoppingCart,
    gradient: "from-purple-500 to-pink-600",
    label: "Shopping Malls",
  },
  Metro: {
    icon: Bus,
    gradient: "from-orange-500 to-amber-600",
    label: "Metro Stations",
  },
  Cafe: {
    icon: Utensils,
    gradient: "from-green-500 to-emerald-600",
    label: "Cafes",
  },
  Restaurant: {
    icon: Utensils,
    gradient: "from-green-500 to-emerald-600",
    label: "Restaurants",
  },
  Bank: {
    icon: PiggyBank,
    gradient: "from-lime-500 to-green-600",
    label: "Banks/ATMs",
  },
  Park: {
    icon: Trees,
    gradient: "from-emerald-500 to-teal-600",
    label: "Parks",
  },
  Supermarket: {
    icon: ShoppingCart,
    gradient: "from-purple-500 to-pink-600",
    label: "Supermarkets",
  },
  Gym: {
    icon: Film,
    gradient: "from-pink-500 to-fuchsia-600",
    label: "Gyms",
  },
  Pharmacy: {
    icon: Heart,
    gradient: "from-red-500 to-rose-600",
    label: "Pharmacies",
  },
  Cinema: {
    icon: Film,
    gradient: "from-pink-500 to-fuchsia-600",
    label: "Cinemas",
  },
  Bus: {
    icon: Bus,
    gradient: "from-orange-500 to-amber-600",
    label: "Bus Stations",
  },
  Other: {
    icon: MapPin,
    gradient: "from-gray-500 to-gray-600",
    label: "Other",
  },
};

export const NearbyPlacesSection: React.FC<NearbyPlacesSectionProps> = ({
  localityName,
  cityName,
  localityHighlights = [],
  nearbyPlaces = [],
}) => {
  const [expanded, setExpanded] = useState(false);
  const [mergedPlaces, setMergedPlaces] = useState<MergedPlace[]>([]);
  const [groupedPlaces, setGroupedPlaces] = useState<
    Record<string, MergedPlace[]>
  >({});
  const [showUserPlaces, setShowUserPlaces] = useState(true);
  const [showLocalityPlaces, setShowLocalityPlaces] = useState(true);

  // Parse distance string to km
  const parseDistanceToKm = (distanceStr: string): number => {
    if (!distanceStr) return 0;

    const lowerStr = distanceStr.toLowerCase();
    const match = lowerStr.match(/(\d+(?:\.\d+)?)\s*(m|km|mi)/);

    if (!match) return 0;

    const value = parseFloat(match[1]);
    const unit = match[2];

    switch (unit) {
      case "m":
        return value / 1000; // meters to km
      case "mi":
        return value * 1.60934; // miles to km
      default:
        return value; // already in km
    }
  };

  // Merge and normalize data
  useEffect(() => {
    const merged: MergedPlace[] = [];

    // Add locality highlights
    localityHighlights.forEach((highlight, index) => {
      merged.push({
        id: `locality-${index}`,
        name: highlight.name,
        distance: highlight.distance_km,
        distanceDisplay:
          highlight.distance_km < 1
            ? `${(highlight.distance_km * 1000).toFixed(0)}m`
            : `${highlight.distance_km.toFixed(1)}km`,
        category: highlight.type,
        categoryType: "locality",
        source: "Local Database",
        icon: null,
      });
    });

    // Add user input nearby places
    nearbyPlaces.forEach((place, index) => {
      const distanceKm = parseDistanceToKm(place.distance);
      merged.push({
        id: `user-${index}`,
        name: place.name,
        distance: distanceKm,
        distanceDisplay: place.distance, // Keep original display format
        category: place.category,
        categoryType: "user",
        icon: place.icon,
        source: "Property Owner",
      });
    });

    // Sort by distance
    merged.sort((a, b) => a.distance - b.distance);
    setMergedPlaces(merged);

    // Group by category
    const grouped = merged.reduce((acc, place) => {
      const categoryKey = place.category.toLowerCase();
      if (!acc[categoryKey]) {
        acc[categoryKey] = [];
      }
      acc[categoryKey].push(place);
      return acc;
    }, {} as Record<string, MergedPlace[]>);

    // Sort each group by distance
    Object.keys(grouped).forEach((category) => {
      grouped[category].sort((a, b) => a.distance - b.distance);
    });

    setGroupedPlaces(grouped);
  }, [localityHighlights, nearbyPlaces]);

  // Filter places based on toggle
  const filteredPlaces = mergedPlaces.filter((place) => {
    if (!showUserPlaces && place.categoryType === "user") return false;
    if (!showLocalityPlaces && place.categoryType === "locality") return false;
    return true;
  });

  // Get categories for chips
  const categories = Object.keys(groupedPlaces).slice(0, 4);
  const moreCategories = Object.keys(groupedPlaces).length - 4;

  // Get top 5 nearest places
  const topPlaces = filteredPlaces.slice(0, 5);

  const getDistanceColor = (distance: number) => {
    if (distance <= 1) return "text-green-600";
    if (distance <= 3) return "text-amber-600";
    return "text-gray-600";
  };

  const getCategoryConfig = (category: string) => {
    const normalizedCategory =
      category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
    return CATEGORY_CONFIG[normalizedCategory] || CATEGORY_CONFIG.Other;
  };

  if (mergedPlaces.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-blue-50/50 border border-gray-200 rounded-xl p-6 text-center">
        <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3">
          <MapPin className="w-6 h-6 text-gray-400" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Nearby Places</h3>
        <p className="text-sm text-gray-600 mb-4">
          No nearby places information available for {localityName}, {cityName}
        </p>
        <div className="text-xs text-gray-500">
          Add nearby places in the property form or check back later
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {/* Header with Filters */}
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-600 rounded-xl flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Nearby Places & Amenities
              </h3>
              <p className="text-sm text-gray-600">
                {localityName}, {cityName}
              </p>
            </div>
          </div>
          <div className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">
            {mergedPlaces.length} total
          </div>
        </div>

        {/* Filter Toggles */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowUserPlaces(!showUserPlaces)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              showUserPlaces
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            <User className="w-4 h-4" />
            User Added ({nearbyPlaces.length})
          </button>
          <button
            onClick={() => setShowLocalityPlaces(!showLocalityPlaces)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              showLocalityPlaces
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            <Database className="w-4 h-4" />
            Local Data ({localityHighlights.length})
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-5">
        {/* Category Chips */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => {
            const config = getCategoryConfig(category);
            const Icon = config.icon;
            const count = groupedPlaces[category].length;

            return (
              <div
                key={category}
                className="flex-shrink-0 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 hover:bg-gray-100 transition-colors"
              >
                <div
                  className={`w-6 h-6 bg-gradient-to-br ${config.gradient} rounded-full flex items-center justify-center`}
                >
                  <Icon className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs font-semibold text-gray-700">
                  {config.label}
                </span>
                <span className="text-xs font-bold text-gray-500">{count}</span>
              </div>
            );
          })}
          {moreCategories > 0 && (
            <div className="flex-shrink-0 text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
              +{moreCategories} more
            </div>
          )}
        </div>

        {/* Top Places */}
        <div className="space-y-3 mb-4">
          {topPlaces.map((place) => {
            const config = getCategoryConfig(place.category);
            const Icon = config.icon;
            const isUserPlace = place.categoryType === "user";

            return (
              <div
                key={place.id}
                className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-white hover:shadow-sm transition-all"
              >
                <div className="relative">
                  <div
                    className={`w-9 h-9 bg-gradient-to-br ${config.gradient} rounded-lg flex items-center justify-center`}
                  >
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  {isUserPlace && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                      <User className="w-2 h-2 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-semibold text-gray-900 truncate">
                      {place.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      ({config.label})
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Navigation className="w-3 h-3" />
                      <span className={getDistanceColor(place.distance)}>
                        {place.distanceDisplay}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      {isUserPlace ? (
                        <>
                          <User className="w-3 h-3" />
                          <span>Added by owner</span>
                        </>
                      ) : (
                        <>
                          <Database className="w-3 h-3" />
                          <span>Local data</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                  {place.distance <= 1 ? "Walkable" : "Driveable"}
                </div>
              </div>
            );
          })}
        </div>

        {/* Expand/Collapse */}
        {filteredPlaces.length > 5 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
          >
            {expanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Show All ({filteredPlaces.length - 5} more)
              </>
            )}
          </button>
        )}

        {/* Expanded View */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
            {Object.entries(groupedPlaces).map(([category, places]) => {
              const config = getCategoryConfig(category);
              const Icon = config.icon;
              const filteredCategoryPlaces = places.filter((place) =>
                filteredPlaces.includes(place)
              );

              if (filteredCategoryPlaces.length === 0) return null;

              return (
                <div key={category} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 bg-gradient-to-br ${config.gradient} rounded-lg flex items-center justify-center`}
                    >
                      <Icon className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm font-bold text-gray-700">
                      {config.label} ({filteredCategoryPlaces.length})
                    </span>
                  </div>
                  <div className="space-y-2 ml-8">
                    {filteredCategoryPlaces.map((place) => {
                      const isUserPlace = place.categoryType === "user";

                      return (
                        <div
                          key={place.id}
                          className="flex items-center justify-between text-sm p-2 hover:bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-gray-700">{place.name}</span>
                            {isUserPlace && (
                              <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                                Added by owner
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={getDistanceColor(place.distance)}>
                              {place.distanceDisplay}
                            </span>
                            {place.distance <= 1 && (
                              <span className="text-xs text-green-600">
                                🚶 Walk
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Summary Stats */}
        <div className="mt-6 pt-4 border-t border-gray-200 grid grid-cols-4 gap-2">
          <div className="text-center p-2 bg-green-50 rounded-lg">
            <div className="text-lg font-bold text-green-600">
              {filteredPlaces.filter((p) => p.distance <= 1).length}
            </div>
            <div className="text-xs text-green-700 font-medium">Within 1km</div>
          </div>
          <div className="text-center p-2 bg-amber-50 rounded-lg">
            <div className="text-lg font-bold text-amber-600">
              {filteredPlaces.filter((p) => p.distance <= 3).length}
            </div>
            <div className="text-xs text-amber-700 font-medium">Within 3km</div>
          </div>
          <div className="text-center p-2 bg-blue-50 rounded-lg">
            <div className="text-lg font-bold text-blue-600">
              {Object.keys(groupedPlaces).length}
            </div>
            <div className="text-xs text-blue-700 font-medium">Categories</div>
          </div>
          <div className="text-center p-2 bg-purple-50 rounded-lg">
            <div className="text-lg font-bold text-purple-600">
              {nearbyPlaces.length}
            </div>
            <div className="text-xs text-purple-700 font-medium">
              User Added
            </div>
          </div>
        </div>

        {/* Data Source Info */}
        <div className="mt-4 text-xs text-gray-500 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Added by Property Owner</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>From Local Database</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <RefreshCw className="w-3 h-3" />
            <span>Updated {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
