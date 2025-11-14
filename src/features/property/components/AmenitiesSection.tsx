import React, { useState } from "react";
import { Grid, List, ChevronDown, ChevronUp } from "lucide-react";
import { AmenityCard } from "./Amenities";
import type { Amenity } from "../../../types";

interface AmenitiesSectionProps {
  amenities: Amenity[];
  title?: string;
  maxVisible?: number;
}

export const AmenitiesSection: React.FC<AmenitiesSectionProps> = ({
  amenities,
  title = "Amenities",
  maxVisible = 6,
}) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showAll, setShowAll] = useState(false);

  const visibleAmenities = showAll ? amenities : amenities.slice(0, maxVisible);
  const hasMore = amenities.length > maxVisible;

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === "grid" ? "list" : "grid"));
  };

  if (amenities.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {amenities.length} amenities available
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <button
            onClick={toggleViewMode}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            title={`Switch to ${viewMode === "grid" ? "list" : "grid"} view`}
          >
            {viewMode === "grid" ? (
              <List className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            ) : (
              <Grid className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* Amenities Grid/List */}
      <div
        className={`
        ${
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            : "space-y-3"
        }
      `}
      >
        {visibleAmenities.map((amenity) => (
          <AmenityCard
            key={amenity.id}
            amenity={amenity}
            compact={viewMode === "list"}
          />
        ))}
      </div>

      {/* Show More/Less Button */}
      {hasMore && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
          >
            {showAll ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Show All {amenities.length} Amenities
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
