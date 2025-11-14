import { Check } from "lucide-react";
import type { Amenity } from "../../../types";

interface AmenitiesSectionProps {
  amenities: Amenity[];
}

export const AmenitiesSection: React.FC<AmenitiesSectionProps> = ({
  amenities,
}) => {
  if (amenities.length === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Amenities</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {amenities.map((amenity) => (
          <div
            key={amenity.id}
            className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
          >
            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Check className="w-3 h-3" />
            </div>
            <span className="font-medium text-gray-900 text-sm">
              {amenity.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
