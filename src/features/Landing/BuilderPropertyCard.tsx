import React from "react";
import {
  Heart,
  MapPin,
  Bed,
  Bath,
  Square,
  Crown,
  Building2,
  Shield,
  ArrowRight,
} from "lucide-react";
import type { CategorizedProperty } from "../../types";
import { useNavigate } from "react-router";

// Premium Property Card for Featured Builders
interface BuilderPropertyCardProps {
  property: CategorizedProperty;
  index: number;
}

export const BuilderPropertyCard: React.FC<BuilderPropertyCardProps> = ({
  property,
  index,
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
      className="group relative bg-white rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 flex-shrink-0 w-[340px] border-2 border-gray-100 hover:border-transparent"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Premium Badge */}
      <div className="absolute top-4 left-4 z-20">
        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl text-xs font-black backdrop-blur-sm shadow-lg">
          <Crown className="w-4 h-4" />
          <span>BUILDER SPECIAL</span>
        </div>
      </div>

      {/* Verified Badge */}
      <div className="absolute top-4 right-4 z-20">
        <div className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-2xl text-xs font-black backdrop-blur-sm shadow-lg">
          <Shield className="w-3 h-3" />
          <span>VERIFIED</span>
        </div>
      </div>

      {/* Favorite Button */}
      <button
        onClick={() => setIsFavorited(!isFavorited)}
        className={`absolute top-16 right-4 z-20 p-2.5 rounded-2xl backdrop-blur-sm transition-all duration-300 ${
          isFavorited
            ? "bg-red-500 text-white shadow-lg scale-110"
            : "bg-white/90 text-gray-600 hover:bg-white hover:text-red-500 hover:scale-110"
        }`}
      >
        <Heart className={`w-5 h-5 ${isFavorited ? "fill-current" : ""}`} />
      </button>

      {/* Image Container */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={property.viewableCoverImage}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Builder Info Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-3 bg-white/95 backdrop-blur-sm rounded-2xl p-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-black text-gray-900 text-sm">
                Premium Builder
              </div>
              <div className="text-xs text-gray-600 font-semibold">
                Trusted Developer
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Price */}
        <div className="mb-4">
          <div className="text-3xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            {formatPrice(property.price)}
          </div>
          <div className="text-xs text-gray-500 font-semibold mt-1">
            Exclusive Pricing
          </div>
        </div>

        {/* Title */}
        <h3 className="font-black text-gray-900 mb-3 line-clamp-2 text-lg leading-tight">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-2 text-gray-600 mb-4 bg-gray-50 rounded-xl p-3">
          <MapPin className="w-5 h-5 text-amber-600" />
          <span className="text-sm font-bold truncate">
            {property.locality}, {property.city.name}
          </span>
        </div>

        {/* Property Features */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="flex flex-col items-center gap-1 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-3">
            <Bed className="w-5 h-5 text-blue-600" />
            <span className="text-xs font-black text-gray-900">
              {property.bedrooms} Beds
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3">
            <Bath className="w-5 h-5 text-purple-600" />
            <span className="text-xs font-black text-gray-900">
              {property.bathrooms} Baths
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3">
            <Square className="w-5 h-5 text-green-600" />
            <span className="text-xs font-black text-gray-900">
              {property.squareFeet} sqft
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <button
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-2xl font-black text-sm hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
          onClick={() => navigate(`/property-detail/${property.id}`)}
        >
          <span>View Details</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Hover Border Glow */}
      <div className="absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 bg-clip-padding opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
    </div>
  );
};
