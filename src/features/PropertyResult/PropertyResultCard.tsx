// components/PropertyCard.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Home,
  Check,
  User,
  Phone,
  Shield,
  CheckCircle,
} from "lucide-react";
import type { Property } from "../../types";
import { PropertyImageCarousel } from "./PropertyImageCarousel";

interface PropertyCardProps {
  property: Property;
  isFavorite: boolean;
  onToggleFavorite: (propertyId: string) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  isFavorite,
  onToggleFavorite,
}) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const coverImage =
    property.images.find((img) => img.isCover)?.viewableUrl ||
    property.images[0]?.viewableUrl;

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
    return `₹${price.toLocaleString()}`;
  };

  const handleCardClick = () => {
    navigate(`/property-detail/${property.id}`);
  };

  const avgPricePerSqFt = property.carpetArea
    ? (property.price / property.carpetArea / 1000).toFixed(2)
    : null;

  const possessionText =
    property.possessionStatus === "READY_TO_MOVE"
      ? "Ready to Move"
      : property.possessionStatus === "UNDER_CONSTRUCTION"
      ? `Possession: ${
          property.possessionDate
            ? new Date(property.possessionDate).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })
            : "Upcoming"
        }`
      : "";

  return (
    <div className="bg-white border border-gray-300 rounded-lg overflow-hidden hover:shadow-xl transition-shadow group flex mb-4">
      {/* 🖼️ Image Section */}
      <div
        className="relative w-72 h-64 flex-shrink-0 bg-gray-100"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <PropertyImageCarousel
          images={property.images}
          showThumbnails={false}
          autoPlay={isHovered}
        />

        {/* Top Left Badge - Show RERA if available, else Zero Brokerage/Verified */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {property.reraNumber ? (
            <div className="bg-green-600 text-white text-xs px-2 py-1 rounded-md font-semibold flex items-center gap-1 shadow-lg">
              <Shield className="w-3 h-3" />
              <span>RERA Approved</span>
            </div>
          ) : (
            <div className="bg-black/60 text-white text-xs px-2 py-1 rounded-sm font-medium">
              {property.verified ? "Verified" : "Zero Brokerage"}
            </div>
          )}
        </div>

        {/* Favorite Button (Top Right) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleFavorite(property.id);
          }}
          className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-lg z-10"
        >
          <Heart
            className={`w-4 h-4 ${
              isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
            }`}
          />
        </button>

        {/* Image indicator dots (Bottom Center) */}
        {property.images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {property.images.slice(0, 5).map((_, idx) => (
              <div
                key={idx}
                className="w-1.5 h-1.5 rounded-full bg-white/80 border border-gray-600"
              />
            ))}
          </div>
        )}
      </div>

      {/* 📝 Content Section */}
      <div
        className="flex-1 p-4 flex flex-col justify-between cursor-pointer"
        onClick={handleCardClick}
      >
        <div>
          {/* Price Range / Main Price */}
          <h3 className="font-extrabold text-2xl text-purple-700 mb-1">
            {formatPrice(property.price)}
          </h3>

          {/* Title / Project Name */}
          <p className="text-lg font-semibold text-gray-800 line-clamp-1 mb-1">
            {property.title}
          </p>

          {/* Locality and City */}
          <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
            <MapPin className="w-4 h-4 flex-shrink-0 text-purple-500" />
            <span className="truncate">
              {property.locality}, {property.city.name}
            </span>
          </div>

          {/* Property Feature Icons (BHK, Bath, Area) */}
          <div className="flex items-center gap-6 text-sm text-gray-700 mb-4">
            {property.bedrooms && (
              <div className="flex items-center gap-1">
                <Bed className="w-4 h-4 text-gray-600" />
                <span className="font-medium">{property.bedrooms} BHK</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center gap-1">
                <Bath className="w-4 h-4 text-gray-600" />
                <span className="font-medium">{property.bathrooms} Bath</span>
              </div>
            )}
            {property.carpetArea && (
              <div className="flex items-center gap-1">
                <Maximize className="w-4 h-4 text-gray-600" />
                <span className="font-medium">{property.carpetArea} sq.ft</span>
              </div>
            )}
          </div>

          {/* RERA Number Display - Prominent placement */}
          {property.reraNumber && (
            <div className="mb-3 bg-green-50 border border-green-200 rounded-md px-3 py-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-green-700 font-semibold">
                    RERA Registered
                  </p>
                  <p className="text-xs text-green-600 font-mono font-medium">
                    {property.reraNumber}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Avg Price and Possession Status */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-3 border-t border-dashed pt-3">
            {avgPricePerSqFt && (
              <span className="text-gray-600 font-medium">
                Avg. Price: <strong>₹{avgPricePerSqFt} K/sq.ft</strong>
              </span>
            )}
            {possessionText && (
              <span className="text-xs text-gray-500">{possessionText}</span>
            )}
          </div>
        </div>

        {/* 👤 Builder/Agent and Contact Button (Bottom Row) */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          {/* Agent/Builder Info */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-4 h-4 text-gray-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 line-clamp-1">
                {property.builderName || property.ownerName || "Property Agent"}
              </p>
              <p className="text-xs text-gray-500">Agent</p>
            </div>
          </div>

          {/* Contact Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Implement modal or direct contact action here
            }}
            className="px-6 py-2 bg-purple-600 text-white rounded-md font-semibold hover:bg-purple-700 transition-colors text-sm flex items-center gap-1 shadow-md"
          >
            <Phone className="w-4 h-4" />
            Contact
          </button>
        </div>
      </div>
    </div>
  );
};
