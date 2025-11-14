import React from "react";
import {
  Check,
  Wifi,
  Car,
  Trees,
  Dumbbell,
  Coffee,
  Shield,
} from "lucide-react";
import type { Amenity } from "../../../types";

interface AmenityCardProps {
  amenity: Amenity;
  compact?: boolean;
}

// Icon mapping for common amenities
const amenityIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  wifi: Wifi,
  parking: Car,
  garden: Trees,
  gym: Dumbbell,
  pool: Coffee, // Using coffee as pool icon placeholder
  security: Shield,
  // Add more mappings as needed
};

export const AmenityCard: React.FC<AmenityCardProps> = ({
  amenity,
  compact = false,
}) => {
  const getIcon = () => {
    if (amenity.icon) {
      // If amenity has a custom icon (could be URL or icon name)
      if (amenity.icon.startsWith("http")) {
        return (
          <img
            src={amenity.icon}
            alt={amenity.name}
            className="w-5 h-5 object-contain"
          />
        );
      }

      // Map common amenity names to icons
      const iconName = amenity.icon.toLowerCase();
      const IconComponent = amenityIcons[iconName] || Check;
      return <IconComponent className="w-5 h-5" />;
    }

    return <Check className="w-5 h-5" />;
  };

  const getCategoryColor = (category: string | null) => {
    const colors = {
      Safety: "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400",
      Leisure:
        "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
      Utility:
        "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400",
      Luxury:
        "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
      default: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
    };

    return colors[category as keyof typeof colors] || colors.default;
  };

  if (compact) {
    return (
      <div
        className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 group"
        title={amenity.name}
      >
        <div
          className={`p-1.5 rounded-md ${getCategoryColor(amenity.category)}`}
        >
          {getIcon()}
        </div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
          {amenity.name}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg transition-all duration-300 group hover:border-blue-200 dark:hover:border-blue-800">
      <div
        className={`p-2 rounded-lg ${getCategoryColor(
          amenity.category
        )} group-hover:scale-110 transition-transform duration-200`}
      >
        {getIcon()}
      </div>
      <div className="flex-1">
        <div className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {amenity.name}
        </div>
        {amenity.category && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {amenity.category}
          </div>
        )}
      </div>
    </div>
  );
};
