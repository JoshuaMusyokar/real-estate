import { Bath, Bed, Building2, Calendar, Home, Square } from "lucide-react";
import type { FC } from "react";
import type { Property } from "../../types";

interface PropertyStatsProps {
  property: Property;
}

export const PropertyStats: FC<PropertyStatsProps> = ({ property }) => {
  const stats = [
    { icon: Bed, label: "Bedrooms", value: property.bedrooms || "N/A" },
    { icon: Bath, label: "Bathrooms", value: property.bathrooms || "N/A" },
    {
      icon: Square,
      label: "Square Feet",
      value: property.squareFeet ? property.squareFeet.toLocaleString() : "N/A",
    },
    { icon: Building2, label: "Floors", value: property.floors || "N/A" },
    { icon: Calendar, label: "Year Built", value: property.yearBuilt || "N/A" },
    {
      icon: Home,
      label: "Furnishing",
      value: property.furnishingStatus || "N/A",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Icon className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stat.value}
            </div>
            <div className="text-xs text-gray-600 font-medium">
              {stat.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};
