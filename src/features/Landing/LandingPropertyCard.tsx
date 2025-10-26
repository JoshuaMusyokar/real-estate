import {
  Bath,
  Bed,
  Check,
  Eye,
  Heart,
  Home,
  MapPin,
  Share2,
  Sparkles,
  Square,
} from "lucide-react";
import { useState, type FC } from "react";
import type { Property } from "../../types";

interface PropertyCardProps {
  property: Property;
}

export const LandingPropertyCard: FC<PropertyCardProps> = ({ property }) => {
  const [isSaved, setIsSaved] = useState(false);
  const coverImage =
    property.images?.find((img) => img.isCover)?.url ||
    property.images?.[0]?.url;
  const isPricePerMonth =
    property.purpose === "RENT" || property.purpose === "LEASE";

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-2xl hover:border-gray-300 transition-all duration-300 cursor-pointer">
      <div className="relative h-72 overflow-hidden">
        {coverImage ? (
          <img
            src={coverImage}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <Home className="w-20 h-20 text-gray-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute top-4 left-4 flex gap-2">
          {property.featured && (
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              FEATURED
            </span>
          )}
          {property.verified && (
            <span className="bg-blue-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-sm">
              <Check className="w-3.5 h-3.5" />
              VERIFIED
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsSaved(!isSaved);
          }}
          className="absolute top-4 right-4 w-11 h-11 bg-white/95 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white transition-all shadow-lg group/heart"
        >
          <Heart
            className={`w-5 h-5 transition-all ${
              isSaved
                ? "fill-red-500 text-red-500 scale-110"
                : "text-gray-700 group-hover/heart:scale-110"
            }`}
          />
        </button>

        <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="w-10 h-10 bg-white/95 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white transition-colors shadow-lg">
            <Share2 className="w-4 h-4 text-gray-700" />
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-3">
          <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {property.title}
          </h3>
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <MapPin className="w-4 h-4 flex-shrink-0 text-gray-400" />
            <span className="line-clamp-1">
              {property.locality}, {property.city}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-5 mb-5 text-sm text-gray-700">
          {property.bedrooms && (
            <span className="flex items-center gap-2 font-medium">
              <Bed className="w-4 h-4 text-gray-400" />
              {property.bedrooms}
            </span>
          )}
          {property.bathrooms && (
            <span className="flex items-center gap-2 font-medium">
              <Bath className="w-4 h-4 text-gray-400" />
              {property.bathrooms}
            </span>
          )}
          {property.squareFeet && (
            <span className="flex items-center gap-2 font-medium">
              <Square className="w-4 h-4 text-gray-400" />
              {property.squareFeet.toLocaleString()}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-5 border-t border-gray-100">
          <div>
            <div className="text-2xl font-bold text-gray-900">
              ${property.price.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 uppercase font-semibold mt-1">
              {isPricePerMonth ? "per month" : property.purpose}
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Eye className="w-4 h-4" />
            {property.viewCount}
          </div>
        </div>
      </div>
    </div>
  );
};
