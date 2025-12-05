import {
  Heart,
  MapPin,
  Bed,
  Bath,
  Square,
  Star,
  Zap,
  Crown,
} from "lucide-react";
import type { CategorizedProperty } from "../../types";
import { useAuth } from "../../hooks/useAuth";
import {
  useAddToFavoritesMutation,
  useRemoveFromFavoritesMutation,
} from "../../services/propertyApi";
import { useState } from "react";

interface CategorizedPropertyCardProps {
  property: CategorizedProperty;
  category: string;
  index: number;
}

const categoryBadges = {
  featured: {
    icon: Zap,
    label: "Featured",
    gradient: "from-purple-500 to-pink-500",
    textColor: "text-purple-600",
  },
  luxury: {
    icon: Crown,
    label: "Luxury",
    gradient: "from-amber-500 to-orange-500",
    textColor: "text-amber-600",
  },
  recent: {
    icon: Star,
    label: "New",
    gradient: "from-blue-500 to-cyan-500",
    textColor: "text-blue-600",
  },
  affordable: {
    icon: "💰",
    label: "Great Value",
    gradient: "from-green-500 to-emerald-500",
    textColor: "text-green-600",
  },
};

export const CategorizedPropertyCard = ({
  property,
  category,
  index,
}: CategorizedPropertyCardProps) => {
  const { isAuthenticated } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);
  const [addToFavorites] = useAddToFavoritesMutation();
  const [removeFromFavorites] = useRemoveFromFavoritesMutation();

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) return;

    try {
      if (isFavorited) {
        await removeFromFavorites({ propertyId: property.id }).unwrap();
      } else {
        await addToFavorites({ propertyId: property.id }).unwrap();
      }
      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  const coverImage = property.viewableCoverImage || "/api/placeholder/400/300";

  const badgeConfig =
    categoryBadges[category as keyof typeof categoryBadges] ||
    categoryBadges.featured;

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)}Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)}L`;
    return `₹${price.toLocaleString()}`;
  };

  return (
    <div
      className="group relative bg-white rounded-3xl border-2 border-gray-200 overflow-hidden hover:border-transparent hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Category Badge */}
      <div className="absolute top-4 left-4 z-20">
        <div
          className={`flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r ${badgeConfig.gradient} text-white rounded-2xl text-xs font-black backdrop-blur-sm`}
        >
          {badgeConfig.icon === "💰" ? (
            <span>💰</span>
          ) : (
            <badgeConfig.icon className="w-3 h-3" />
          )}
          <span>{badgeConfig.label}</span>
        </div>
      </div>

      {/* Favorite Button */}
      <button
        onClick={handleFavoriteClick}
        className={`absolute top-4 right-4 z-20 p-2 rounded-2xl backdrop-blur-sm transition-all duration-300 ${
          isFavorited
            ? "bg-red-500 text-white shadow-lg"
            : "bg-white/90 text-gray-600 hover:bg-white hover:text-red-500 hover:scale-110"
        }`}
      >
        <Heart className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`} />
      </button>

      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={coverImage}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Price */}
        <div className="mb-3">
          <div className="text-2xl font-black text-gray-900 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all">
            {formatPrice(property.price)}
            {/* {property.priceNegotiable && (
              <span className="text-sm font-bold text-green-600 ml-2">
                (Negotiable)
              </span>
            )} */}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-gray-700 transition-colors leading-tight">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-gray-600 mb-3">
          <MapPin className="w-4 h-4" />
          <span className="text-sm font-medium truncate">
            {property.locality}, {property.city.name}
          </span>
        </div>

        {/* Property Features */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          {property.bedrooms && (
            <div className="flex items-center gap-1 font-medium">
              <Bed className="w-4 h-4" />
              <span>{property.bedrooms} bed</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center gap-1 font-medium">
              <Bath className="w-4 h-4" />
              <span>{property.bathrooms} bath</span>
            </div>
          )}
          {property.squareFeet && (
            <div className="flex items-center gap-1 font-medium">
              <Square className="w-4 h-4" />
              <span>{property.squareFeet.toLocaleString()} sqft</span>
            </div>
          )}
        </div>

        {/* Property Type & Purpose */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 rounded-lg text-xs font-black ${badgeConfig.textColor}`}
            >
              {property.propertyType.name}
            </span>
            <span className="px-2 py-1 rounded-lg text-xs font-black bg-gray-100 text-gray-600">
              {property.purpose}
            </span>
          </div>

          {/* {property.verified && (
            <div className="flex items-center gap-1 text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-black">Verified</span>
            </div>
          )} */}
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-padding opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
    </div>
  );
};
