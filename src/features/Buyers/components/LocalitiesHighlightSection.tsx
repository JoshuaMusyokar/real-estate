import React, { useState } from "react";
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
} from "lucide-react";
import type { LocalityHighlight } from "../../../types";

interface LocalityHighlightsSectionProps {
  localityName: string;
  highlights: LocalityHighlight[];
  cityName: string;
}

const HIGHLIGHT_CONFIG: Record<
  string,
  { icon: React.ElementType; gradient: string; label: string }
> = {
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
  other: {
    icon: MapPin,
    gradient: "from-gray-500 to-gray-600",
    label: "Other",
  },
};

export const LocalityHighlightsSection: React.FC<
  LocalityHighlightsSectionProps
> = ({ localityName, highlights, cityName }) => {
  const [expanded, setExpanded] = useState(false);

  if (!highlights || highlights.length === 0) return null;

  // Group highlights by type
  const groupedHighlights = highlights.reduce((acc, highlight) => {
    if (!acc[highlight.type]) {
      acc[highlight.type] = [];
    }
    acc[highlight.type].push(highlight);
    return acc;
  }, {} as Record<string, LocalityHighlight[]>);

  // Sort each group by distance
  Object.keys(groupedHighlights).forEach((type) => {
    groupedHighlights[type].sort((a, b) => a.distance_km - b.distance_km);
  });

  // Get top 3 nearest places across all categories
  const topPlaces = highlights
    .slice()
    .sort((a, b) => a.distance_km - b.distance_km)
    .slice(0, 3);

  // Get categories for chips
  const categories = Object.keys(groupedHighlights).slice(0, 4);
  const moreCategories = Object.keys(groupedHighlights).length - 4;

  const getDistanceColor = (distance: number) => {
    if (distance <= 1) return "text-green-600";
    if (distance <= 3) return "text-amber-600";
    return "text-gray-600";
  };

  return (
    <div className="relative overflow-hidden">
      {/* Glass Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-white/50 to-teal-50/80 backdrop-blur-xl" />

      {/* Main Content */}
      <div className="relative p-5">
        {/* Compact Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-teal-600 rounded-xl blur-md opacity-50" />
            <div className="relative w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <MapPin className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 truncate">
              What's Nearby
            </h3>
            <p className="text-xs text-gray-600 truncate">
              {localityName}, {cityName}
            </p>
          </div>
          <div className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">
            {highlights.length}+
          </div>
        </div>

        {/* Category Chips */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((type) => {
            const config = HIGHLIGHT_CONFIG[type];
            const Icon = config.icon;
            const count = groupedHighlights[type].length;

            return (
              <div
                key={type}
                className="group flex-shrink-0 flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-full px-3 py-1.5 hover:bg-white/80 transition-all"
              >
                <div
                  className={`w-6 h-6 bg-gradient-to-br ${config.gradient} rounded-full flex items-center justify-center shadow-sm`}
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

        {/* Top 3 Nearest Places - Compact List */}
        <div className="space-y-2 mb-3">
          {topPlaces.map((highlight, index) => {
            const config =
              HIGHLIGHT_CONFIG[highlight.type] || HIGHLIGHT_CONFIG.other;
            const Icon = config.icon;

            return (
              <div
                key={index}
                className="group flex items-center gap-3 p-3 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl hover:bg-white/80 hover:shadow-md transition-all"
              >
                <div
                  className={`w-9 h-9 bg-gradient-to-br ${config.gradient} rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform flex-shrink-0`}
                >
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900 truncate">
                    {highlight.name}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Navigation className="w-3 h-3" />
                    <span className={getDistanceColor(highlight.distance_km)}>
                      {highlight.distance_km < 1
                        ? `${(highlight.distance_km * 1000).toFixed(0)}m`
                        : `${highlight.distance_km.toFixed(1)}km`}
                    </span>
                  </div>
                </div>
                <div className="text-xs font-bold text-gray-600 bg-gray-50 px-2 py-1 rounded-md">
                  {highlight.distance_km < 1 ? "Walk" : "Drive"}
                </div>
              </div>
            );
          })}
        </div>

        {/* Expand Button */}
        {highlights.length > 3 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-200/50 rounded-xl text-sm font-semibold text-blue-700 hover:from-blue-100 hover:to-teal-100 transition-all"
          >
            {expanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Show All ({highlights.length - 3} more)
              </>
            )}
          </button>
        )}

        {/* Expanded Content */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-gray-200/50 space-y-3 animate-in fade-in slide-in-from-top-4 duration-300">
            {Object.entries(groupedHighlights).map(([type, items]) => {
              const config = HIGHLIGHT_CONFIG[type];
              const Icon = config.icon;
              const remainingItems = items
                .slice(items.findIndex((item) => !topPlaces.includes(item)))
                .slice(0, 3);

              if (remainingItems.length === 0) return null;

              return (
                <div key={type}>
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`w-6 h-6 bg-gradient-to-br ${config.gradient} rounded-lg flex items-center justify-center shadow-sm`}
                    >
                      <Icon className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-xs font-bold text-gray-700">
                      {config.label}
                    </span>
                  </div>
                  <div className="space-y-2 ml-8">
                    {remainingItems.map((highlight, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs"
                      >
                        <span className="text-gray-700 truncate flex-1">
                          {highlight.name}
                        </span>
                        <span
                          className={`font-semibold ml-2 ${getDistanceColor(
                            highlight.distance_km
                          )}`}
                        >
                          {highlight.distance_km.toFixed(1)}km
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Quick Stats Footer */}
        <div className="mt-4 pt-4 border-t border-gray-200/50 grid grid-cols-3 gap-2">
          <div className="text-center p-2 bg-green-50/80 rounded-lg">
            <div className="text-lg font-bold text-green-600">
              {highlights.filter((h) => h.distance_km <= 1).length}
            </div>
            <div className="text-[10px] text-green-700 font-medium">
              Within 1km
            </div>
          </div>
          <div className="text-center p-2 bg-amber-50/80 rounded-lg">
            <div className="text-lg font-bold text-amber-600">
              {highlights.filter((h) => h.distance_km <= 3).length}
            </div>
            <div className="text-[10px] text-amber-700 font-medium">
              Within 3km
            </div>
          </div>
          <div className="text-center p-2 bg-blue-50/80 rounded-lg">
            <div className="text-lg font-bold text-blue-600">
              {Object.keys(groupedHighlights).length}
            </div>
            <div className="text-[10px] text-blue-700 font-medium">
              Categories
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-teal-500/10 to-blue-500/10 rounded-full blur-3xl -z-10" />
      </div>

      {/* Hide scrollbar but keep functionality */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};
