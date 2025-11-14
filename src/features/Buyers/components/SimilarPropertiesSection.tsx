/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChevronRight, Bed, Bath, Maximize, Heart } from "lucide-react";
import { useGetSimilarPropertiesQuery } from "../../../services/propertyApi";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface SimilarPropertiesSectionProps {
  propertyId: string;
  currentPropertyTitle: string;
}

export const SimilarPropertiesSection: React.FC<
  SimilarPropertiesSectionProps
> = ({ propertyId, currentPropertyTitle }) => {
  const { data, isLoading, error } = useGetSimilarPropertiesQuery({
    propertyId,
    limit: 6,
  });

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-5">
          Similar Properties
        </h2>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !data?.data || data.data.length === 0) {
    return null; // Don't show section if no similar properties
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
        <h2 className="text-xl font-bold text-gray-900">Similar Properties</h2>
        <Link
          to="/"
          className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1"
        >
          View All
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.data.map((property) => (
          <Link
            key={property.id}
            to={`/property-detail/${property.id}`}
            className="group border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 hover:shadow-lg transition-all"
          >
            {/* Image */}
            <div className="relative h-48 bg-gray-200 overflow-hidden">
              {property.coverImage ? (
                <img
                  src={property.coverImage}
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                  <span className="text-gray-400 font-semibold">No Image</span>
                </div>
              )}

              {/* Favorite Badge */}
              <button
                className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  // Handle favorite toggle
                }}
              >
                <Heart
                  className={`w-5 h-5 ${
                    property.isSaved
                      ? "fill-red-500 text-red-500"
                      : "text-gray-600"
                  }`}
                />
              </button>

              {/* Price Badge */}
              <div className="absolute bottom-3 left-3 bg-blue-600 text-white px-3 py-1.5 rounded-lg font-bold text-sm shadow-lg">
                {formatPrice(property.price)}
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                {property.title}
              </h3>

              <p className="text-sm text-gray-600 mb-3 flex items-center gap-1">
                <span className="font-medium">{property.locality}</span>
                <span>·</span>
                <span>{property.city}</span>
              </p>

              {/* Property Stats */}
              <div className="flex items-center gap-4 text-sm text-gray-700">
                {property.bedrooms && (
                  <div className="flex items-center gap-1">
                    <Bed className="w-4 h-4 text-gray-500" />
                    <span>{property.bedrooms}</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center gap-1">
                    <Bath className="w-4 h-4 text-gray-500" />
                    <span>{property.bathrooms}</span>
                  </div>
                )}
                {property.squareFeet && (
                  <div className="flex items-center gap-1">
                    <Maximize className="w-4 h-4 text-gray-500" />
                    <span>{property.squareFeet.toLocaleString()} ft²</span>
                  </div>
                )}
              </div>

              {/* Amenities Pills */}
              {property.amenities && property.amenities.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {property.amenities.slice(0, 3).map((amenity, index) => (
                    <span
                      key={index}
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                    >
                      {amenity}
                    </span>
                  ))}
                  {property.amenities.length > 3 && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
                      +{property.amenities.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
