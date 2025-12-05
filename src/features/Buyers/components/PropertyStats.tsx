import { Bath, Bed, Building2, Square } from "lucide-react";
import type { Property } from "../../../types";

interface PropertyStatsProps {
  property: Property;
}

export const PropertyStats: React.FC<PropertyStatsProps> = ({ property }) => {
  const stats = [
    { icon: Bed, label: "Bedrooms", value: property.bedrooms },
    { icon: Bath, label: "Bathrooms", value: property.bathrooms },
    {
      icon: Square,
      label: property.squareFeet ? "Sq. Feet" : "Sq. Meters",
      value: property.squareFeet || property.squareMeters,
    },
    { icon: Building2, label: "Type", value: property.propertyType.name },
  ].filter((stat) => stat.value);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-gray-50 rounded-xl p-4 flex items-center gap-3 border border-gray-100"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">
                {typeof stat.value === "number"
                  ? stat.value.toLocaleString()
                  : stat.value}
              </div>
              <div className="text-xs text-gray-600">{stat.label}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
