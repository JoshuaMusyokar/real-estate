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
  ParkingCircle,
  User,
  CalendarDays,
} from "lucide-react";
import type { CategorizedProperty } from "../../types";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router";
import {
  useAddToFavoritesMutation,
  useRemoveFromFavoritesMutation,
} from "../../services/propertyApi";

interface BuilderPropertyCardProps {
  property: CategorizedProperty;
  index: number;
  isFavorite: boolean;
}

export const BuilderPropertyCard: React.FC<BuilderPropertyCardProps> = ({
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

  const formattedDate = new Date(property.postedDate).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  );
  const area =
    property.superBuiltArea ??
    property.builtUpArea ??
    property.carpetArea ??
    property.squareFeet;

  const items = [
    {
      icon: Bed,
      label: "Beds",
      value: property.bedrooms,
      bg: "from-blue-50 to-indigo-50",
      text: "text-blue-600",
    },
    {
      icon: Bath,
      label: "Baths",
      value: property.bathrooms,
      bg: "from-purple-50 to-pink-50",
      text: "text-purple-600",
    },
    {
      icon: Square,
      label: "sqft",
      value: area,
      bg: "from-emerald-50 to-green-50",
      text: "text-emerald-600",
    },
  ];
  const filteredItems = items.filter((item) => item.value != null);
  return (
    <div
      className="
        group relative bg-white flex-shrink-0
        w-[260px] sm:w-[310px] lg:w-[340px]
        rounded-xl sm:rounded-2xl lg:rounded-3xl
        border-2 border-amber-100 hover:border-amber-300
        shadow-sm hover:shadow-2xl
        overflow-hidden
        transition-all duration-300
      "
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* ── Image ──────────────────────────────────────────────────────── */}
      <div className="relative h-40 sm:h-48 lg:h-56 overflow-hidden bg-amber-50">
        <img
          src={property.viewableCoverImage}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Top badges */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5">
          <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg text-[10px] sm:text-xs font-black shadow">
            <Crown className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            <span className="hidden sm:inline">BUILDER</span>
            <span className="sm:hidden">PRO</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500 text-white rounded-lg text-[10px] sm:text-xs font-black shadow">
            <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            <span className="hidden sm:inline">VERIFIED</span>
            <span className="sm:hidden">✓</span>
          </div>
        </div>

        {/* Favourite */}
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

        {/* Builder info strip at bottom of image */}
        <div className="absolute bottom-2 left-2 right-2">
          <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-lg sm:rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2">
            <div className="w-7 h-7 sm:w-9 sm:h-9 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Building2 className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="font-black text-gray-900 text-[10px] sm:text-xs leading-tight">
                Premium Builder
              </div>
              <div className="text-[9px] sm:text-[10px] text-gray-500 font-semibold">
                Trusted Developer
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className="p-3 sm:p-4 lg:p-5">
        {/* Price */}
        <div className="mb-2 sm:mb-3">
          <div className="text-lg sm:text-2xl font-black bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent leading-tight">
            {formatPrice(property.price)}
          </div>
          <div className="text-[9px] sm:text-[10px] text-gray-400 font-semibold uppercase tracking-wide">
            Exclusive Pricing
          </div>
        </div>

        {/* Title */}
        <h3 className="font-black text-gray-900 text-xs sm:text-sm lg:text-base leading-snug line-clamp-2 mb-2">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-100 rounded-lg px-2 py-1.5 mb-3">
          <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600 flex-shrink-0" />
          <span className="text-[10px] sm:text-xs font-bold text-gray-700 truncate">
            {property.locality}, {property.city.name}
          </span>
        </div>

        {/* Feature grid — 3 cols */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mb-3">
          {filteredItems.map(({ icon: Icon, label, value, bg, text }) => (
            <div
              key={label}
              className={`flex flex-col items-center gap-0.5 sm:gap-1 bg-gradient-to-br ${bg} rounded-lg sm:rounded-xl p-2 sm:p-2.5`}
            >
              <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${text}`} />

              <span className="text-[10px] sm:text-xs font-black text-gray-800">
                {value}
              </span>

              <span className="text-[9px] text-gray-400 hidden sm:block">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Parking row */}
        {(property.coveredParking ||
          property.openParking ||
          property.publicParking) && (
          <div className="flex items-center gap-2 mb-2 text-[10px] sm:text-xs text-gray-500">
            <ParkingCircle className="w-3 h-3 text-amber-500 flex-shrink-0" />
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

        {/* Posted by + date */}
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
          className="w-full flex items-center justify-center gap-1.5 py-2 sm:py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-[10px] sm:text-xs font-black rounded-lg sm:rounded-xl transition-all hover:shadow-lg hover:shadow-amber-200"
        >
          View Details
          <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </button>
      </div>
    </div>
  );
};
