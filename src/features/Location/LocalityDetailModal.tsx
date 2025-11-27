import React from "react";
import {
  X,
  MapPin,
  Users,
  Calendar,
  Star,
  Building2,
  Navigation,
} from "lucide-react";
import type { Locality, LocalityHighlight } from "../../types";

interface LocalityDetailModalProps {
  locality: Locality | null;
  isOpen: boolean;
  onClose: () => void;
}

// Highlight type configuration with icons
const HIGHLIGHT_CONFIG: Record<
  string,
  { icon: React.ReactNode; color: string }
> = {
  school: {
    icon: "🎓",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
  hospital: {
    icon: "🏥",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  },
  restaurant: {
    icon: "🍴",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
  shopping: {
    icon: "🛍️",
    color:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  },
  park: {
    icon: "🌳",
    color:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
  },
  transport: {
    icon: "🚌",
    color:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  },
  worship: {
    icon: "⛪",
    color:
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  },
  bank: {
    icon: "🏦",
    color: "bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-200",
  },
  entertainment: {
    icon: "🎭",
    color: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  },
  other: {
    icon: "📍",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
  },
};

export function LocalityDetailModal({
  locality,
  isOpen,
  onClose,
}: LocalityDetailModalProps) {
  if (!isOpen || !locality) return null;

  // Parse highlights from JSON string if needed
  const highlights: LocalityHighlight[] = locality.highlights
    ? typeof locality.highlights === "string"
      ? JSON.parse(locality.highlights)
      : locality.highlights
    : [];

  const getHighlightConfig = (type: string) => {
    return HIGHLIGHT_CONFIG[type] || HIGHLIGHT_CONFIG.other;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-6 border w-full max-w-2xl shadow-lg rounded-md bg-white dark:bg-gray-800">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {locality.name}
              </h2>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                <span>{locality.city.name}</span>
              </div>
              {locality.city.state && (
                <div className="flex items-center gap-1">
                  <span>•</span>
                  <span>{locality.city.state}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <span>•</span>
                <span>{locality.city.country}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {locality._count?.users || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Users
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
              <div className="w-6 h-6 mx-auto mb-2">🏢</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {highlights.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Highlights
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
              <Calendar className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {formatDate(locality.createdAt.toString())}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Created
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
              <Navigation className="w-6 h-6 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {locality.city.latitude?.toFixed(4)},{" "}
                {locality.city.longitude?.toFixed(4)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Coordinates
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Location Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-blue-700 dark:text-blue-300 font-medium">
                  City:
                </span>
                <span className="text-blue-900 dark:text-blue-100 ml-2">
                  {locality.city.name}
                </span>
              </div>
              {locality.city.state && (
                <div>
                  <span className="text-blue-700 dark:text-blue-300 font-medium">
                    State:
                  </span>
                  <span className="text-blue-900 dark:text-blue-100 ml-2">
                    {locality.city.state}
                  </span>
                </div>
              )}
              <div>
                <span className="text-blue-700 dark:text-blue-300 font-medium">
                  Country:
                </span>
                <span className="text-blue-900 dark:text-blue-100 ml-2">
                  {locality.city.country}
                </span>
              </div>
              <div>
                <span className="text-blue-700 dark:text-blue-300 font-medium">
                  Last Updated:
                </span>
                <span className="text-blue-900 dark:text-blue-100 ml-2">
                  {formatDate(locality.updatedAt.toString())}
                </span>
              </div>
            </div>
          </div>

          {/* Highlights Section */}
          {highlights.length > 0 ? (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Nearby Highlights ({highlights.length})
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {highlights.map((highlight, index) => {
                  const config = getHighlightConfig(highlight.type);
                  return (
                    <div
                      key={index}
                      className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{config.icon}</span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
                          >
                            {highlight.type.charAt(0).toUpperCase() +
                              highlight.type.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                          <Navigation className="w-3 h-3" />
                          <span>{highlight.distance_km} km</span>
                        </div>
                      </div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                        {highlight.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Approximately {highlight.distance_km} kilometers from
                        this locality
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
              <Star className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Highlights Added
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                This locality doesn't have any nearby highlights added yet. Add
                schools, hospitals, restaurants, and other important places to
                help users understand the area better.
              </p>
            </div>
          )}

          {/* Coordinates */}
          {locality.city.latitude && locality.city.longitude && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Navigation className="w-4 h-4" />
                Geographic Coordinates
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Latitude:
                  </span>
                  <div className="font-mono text-gray-900 dark:text-white">
                    {locality.city.latitude}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Longitude:
                  </span>
                  <div className="font-mono text-gray-900 dark:text-white">
                    {locality.city.longitude}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
