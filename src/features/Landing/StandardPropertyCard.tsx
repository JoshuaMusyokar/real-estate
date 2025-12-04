import React from "react";
import { Heart, MapPin, Bed, Bath, Square } from "lucide-react";
import type { CategorizedProperty } from "../../types";
import { useNavigate } from "react-router";
interface StandardPropertyCardProps {
  property: CategorizedProperty;
  index: number;
  color?: string;
}

export const StandardPropertyCard: React.FC<StandardPropertyCardProps> = ({
  property,
  index,
  color = "from-blue-500 to-purple-500",
}) => {
  const [isFavorited, setIsFavorited] = React.useState(false);
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
    return `₹${price.toLocaleString()}`;
  };

  return (
    <div
      className="group relative bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500 flex-shrink-0 w-[300px] border border-gray-200 hover:border-transparent"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Favorite Button */}
      <button
        onClick={() => setIsFavorited(!isFavorited)}
        className={`absolute top-3 right-3 z-20 p-2 rounded-xl backdrop-blur-sm transition-all duration-300 ${
          isFavorited
            ? "bg-red-500 text-white"
            : "bg-white/90 text-gray-600 hover:bg-white hover:text-red-500"
        }`}
      >
        <Heart className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`} />
      </button>

      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={property.viewableCoverImage}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Price */}
        <div
          className={`text-2xl font-black bg-gradient-to-r ${color} bg-clip-text text-transparent mb-2`}
        >
          {formatPrice(property.price)}
        </div>

        {/* Title */}
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-sm leading-tight">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-gray-600 mb-3">
          <MapPin className="w-4 h-4" />
          <span className="text-xs font-medium truncate">
            {property.locality}, {property.city.name}
          </span>
        </div>

        {/* Features */}
        <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <Bed className="w-3 h-3" />
            <span>{property.bedrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-3 h-3" />
            <span>{property.bathrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Square className="w-3 h-3" />
            <span>{property.squareFeet}</span>
          </div>
        </div>

        {/* CTA */}
        <button
          className={`w-full bg-gradient-to-r ${color} text-white py-2 rounded-xl font-bold text-xs hover:shadow-lg transition-all`}
          onClick={() => navigate(`/property-detail/${property.id}`)}
        >
          View Details
        </button>
      </div>
    </div>
  );
};
