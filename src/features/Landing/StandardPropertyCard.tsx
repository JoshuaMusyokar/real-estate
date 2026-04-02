import React from "react";
import {
  Heart,
  MapPin,
  Bed,
  Bath,
  Square,
  ParkingCircle,
  User,
  CalendarDays,
  Eye,
} from "lucide-react";
import type { CategorizedProperty } from "../../types";
import {
  useAddToFavoritesMutation,
  useRemoveFromFavoritesMutation,
} from "../../services/propertyApi";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router";

interface StandardPropertyCardProps {
  property: CategorizedProperty;
  index: number;
  color?: string;
  isFavorite: boolean;
}

export const StandardPropertyCard: React.FC<StandardPropertyCardProps> = ({
  property,
  index,
  isFavorite,
}) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [addToFavorites, { isLoading: isAddingToFavorites }] =
    useAddToFavoritesMutation();
  const [removeFromFavorites, { isLoading: isRemovingFromFavorites }] =
    useRemoveFromFavoritesMutation();
  const formatPrice = (price: number) => {
    if (price >= 10_000_000) return `₹${(price / 10_000_000).toFixed(2)} Cr`;
    if (price >= 100_000) return `₹${(price / 100_000).toFixed(2)} L`;
    return `₹${price.toLocaleString()}`;
  };

  const formattedDate = new Date(property.postedDate).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  );
  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate("/signin");
      return;
    }

    try {
      if (isFavorite) {
        await removeFromFavorites({ propertyId: property.id }).unwrap();
      } else {
        await addToFavorites({ propertyId: property.id }).unwrap();
      }
    } catch {
      //
    }
  };
  let areaValue = null;
  // let areaType = "";

  if (property.superBuiltArea) {
    areaValue = property.superBuiltArea;
    // areaType = "Super Built-up";
  } else if (property.builtUpArea) {
    areaValue = property.builtUpArea;
    // areaType = "Built-up";
  } else if (property.carpetArea) {
    areaValue = property.carpetArea;
    // areaType = "Carpet";
  }

  const areaLabel = areaValue ? `${areaValue} ft²` : null;
  return (
    <div
      className="
        group relative bg-white flex-shrink-0
        w-[230px] sm:w-[270px] lg:w-[300px]
        rounded-xl sm:rounded-2xl
        border border-blue-100 hover:border-blue-300
        shadow-sm hover:shadow-xl
        overflow-hidden
        transition-all duration-300
      "
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* ── Image ──────────────────────────────────────────────────────── */}
      <div className="relative h-36 sm:h-44 overflow-hidden bg-blue-50">
        <img
          src={property.viewableCoverImage}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Favourite button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleFavoriteClick(e);
          }}
          disabled={isAddingToFavorites || isRemovingFromFavorites}
          className={`absolute top-2 right-2 p-1.5 sm:p-2 rounded-lg sm:rounded-xl backdrop-blur-sm transition-all duration-200 ${
            isFavorite
              ? "bg-red-500 text-white shadow-lg"
              : "bg-white/90 text-gray-500 hover:text-red-500 hover:bg-white"
          }`}
        >
          <Heart
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isFavorite ? "fill-current" : ""}`}
          />
        </button>

        {/* Price badge pinned to bottom-left of image */}
        <div className="absolute bottom-2 left-2">
          <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-white/95 backdrop-blur-sm rounded-lg text-xs sm:text-sm font-black text-blue-700 shadow-sm">
            {formatPrice(property.price)}
          </span>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <div className="p-3 sm:p-4">
        {/* Title */}
        <h3 className="font-bold text-gray-900 text-xs sm:text-sm leading-snug line-clamp-2 mb-2">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-gray-500 mb-2.5 sm:mb-3">
          <MapPin className="w-3 h-3 flex-shrink-0 text-blue-400" />
          <span className="text-[10px] sm:text-xs font-medium truncate">
            {property.locality}, {property.city.name}
          </span>
        </div>

        {/* Feature pills */}
        <div className="flex items-center gap-1.5 sm:gap-2 mb-2.5 sm:mb-3 flex-wrap">
          {[
            {
              icon: Bed,
              value: property.bedrooms ? `${property.bedrooms} Bed` : null,
            },
            {
              icon: Bath,
              value: property.bathrooms ? `${property.bathrooms} Bath` : null,
            },
            { icon: Square, value: areaLabel },
          ]
            .filter((item) => item.value)
            .map(({ icon: Icon, value }) => (
              <span
                key={value}
                className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 bg-blue-50 border border-blue-100 rounded-md text-[10px] sm:text-xs font-semibold text-blue-700"
              >
                <Icon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                {value}
              </span>
            ))}
        </div>
        {/* Parking row (only if any parking exists) */}
        {(property.coveredParking ||
          property.openParking ||
          property.publicParking) && (
          <div className="flex items-center gap-2 mb-2 text-[10px] sm:text-xs text-gray-500">
            <ParkingCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-400 flex-shrink-0" />
            {property.coveredParking ? (
              <span>{property.coveredParking} Covered</span>
            ) : null}
            {property.openParking ? (
              <span>{property.openParking} Open</span>
            ) : null}
            {property.publicParking ? (
              <span>{property.publicParking} Public</span>
            ) : null}
          </div>
        )}

        {/* Posted by + date — single compact row */}
        <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-400 mb-3">
          <div className="flex items-center gap-1 min-w-0">
            <User className="w-2.5 h-2.5 flex-shrink-0" />
            <span className="truncate">
              {property.postedBy}
              {property.advertiserName ? ` · ${property.advertiserName}` : ""}
            </span>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0 ml-2">
            <CalendarDays className="w-2.5 h-2.5" />
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() =>
            window.open(`/property-detail/${property.slug}`, "_blank")
          }
          className="w-full flex items-center justify-center gap-1.5 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white text-[10px] sm:text-xs font-bold rounded-lg sm:rounded-xl transition-colors"
        >
          <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          View Details
        </button>
      </div>
    </div>
  );
};
