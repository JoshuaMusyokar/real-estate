import { Building2, ChevronRight, Bed, Bath, Maximize } from "lucide-react";
import { useGetPropertiesByOwnerQuery } from "../../../services/propertyApi";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import type { Property } from "../../../types";

interface OwnerPropertiesSectionProps {
  ownerId: string;
  ownerName: string;
  currentPropertyId: string;
}

export const OwnerPropertiesSection: React.FC<OwnerPropertiesSectionProps> = ({
  ownerId,
  ownerName,
  currentPropertyId,
}) => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetPropertiesByOwnerQuery({
    ownerId,
    limit: 5,
    excludePropertyId: currentPropertyId,
  });

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-5">
          More Properties from {ownerName}
        </h2>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !data?.data || data.data.length === 0) {
    return null; // Don't show section if owner has no other properties
  }

  const formatPrice = (price: number): string => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(2)}M`;
    }
    if (price >= 1000) {
      return `$${(price / 1000).toFixed(0)}K`;
    }
    return `$${price.toLocaleString()}`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            {ownerName.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              More from {ownerName}
            </h2>
            <p className="text-sm text-gray-600">
              {data.pagination.total}{" "}
              {data.pagination.total === 1 ? "property" : "properties"}{" "}
              available
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {data.data.map((property: Property) => (
          <Link
            key={property.id}
            to={`/property-detail/${property.id}`}
            className="group border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50/30 transition-all flex gap-4"
          >
            {/* Image */}
            <div className="relative w-32 h-24 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
              {property.images && property.images.length > 0 ? (
                <img
                  src={property.images[0].viewableUrl}
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                  <Building2 className="w-8 h-8 text-gray-400" />
                </div>
              )}

              {/* Status Badge */}
              <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-0.5 rounded text-xs font-semibold">
                {property.status}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 mb-1.5 line-clamp-1 group-hover:text-blue-600 transition-colors">
                {property.title}
              </h3>

              <p className="text-sm text-gray-600 mb-2">
                {property.locality}, {property.city}
              </p>

              {/* Stats */}
              <div className="flex items-center gap-3 text-sm text-gray-700 mb-2">
                {property.bedrooms && (
                  <div className="flex items-center gap-1">
                    <Bed className="w-3.5 h-3.5 text-gray-500" />
                    <span>{property.bedrooms}</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center gap-1">
                    <Bath className="w-3.5 h-3.5 text-gray-500" />
                    <span>{property.bathrooms}</span>
                  </div>
                )}
                {property.squareFeet && (
                  <div className="flex items-center gap-1">
                    <Maximize className="w-3.5 h-3.5 text-gray-500" />
                    <span>{property.squareFeet.toLocaleString()} ft²</span>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="font-bold text-blue-600 text-lg">
                {formatPrice(property.price)}
              </div>
            </div>

            {/* Arrow */}
            <div className="flex items-center">
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </div>
          </Link>
        ))}
      </div>

      {/* View All Button */}
      {data.pagination.total > 5 && (
        <button
          className="w-full mt-4 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          onClick={() => navigate("/")}
        >
          Browse other properties
        </button>
      )}
    </div>
  );
};
