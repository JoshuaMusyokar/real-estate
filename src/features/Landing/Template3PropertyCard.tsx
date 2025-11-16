/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  MapPin,
  Home,
  Bed,
  Bath,
  Square,
  Heart,
  Eye,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useAddToFavoritesMutation,
  useRemoveFromFavoritesMutation,
} from "../../services/propertyApi";
import { useAuth } from "../../hooks/useAuth";
import type { Property } from "../../types";

// Property Card Component (Redfin Style - Dark Mode)
export const Template3PropertyCard = ({
  property,
  favProperties,
}: {
  property: Property;
  favProperties: string[];
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [addToFavorites, { isLoading: isAdding }] = useAddToFavoritesMutation();
  const [removeFromFavorites, { isLoading: isRemoving }] =
    useRemoveFromFavoritesMutation();

  useEffect(() => {
    if (!isAuthenticated) {
      setIsSaved(false);
      return;
    }
    if (favProperties?.includes(property.id)) {
      setIsSaved(true);
    }
  }, [property.id, isAuthenticated, favProperties]);

  const coverImage =
    property.images?.find((img) => img.isCover)?.viewableUrl ||
    property.images?.[0]?.viewableUrl;

  const isPricePerMonth =
    property.purpose === "RENT" || property.purpose === "LEASE";

  const handleCardClick = () => {
    window.location.href = `/property-detail/${property.id}`;
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate("/signin", { state: { from: location.pathname } });
      return;
    }
    try {
      if (isSaved) {
        await removeFromFavorites({ propertyId: property.id }).unwrap();
        setIsSaved(false);
      } else {
        await addToFavorites({ propertyId: property.id }).unwrap();
        setIsSaved(true);
      }
    } catch (error) {
      console.error("Favorite error:", error);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-red-500 hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-300 cursor-pointer group"
    >
      {/* Image */}
      <div className="relative h-64 overflow-hidden bg-slate-900">
        {coverImage ? (
          <img
            src={coverImage}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-slate-900 flex items-center justify-center">
            <Home className="w-20 h-20 text-slate-700" />
          </div>
        )}

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {property.featured && (
            <span className="bg-red-600 text-white px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wide">
              Hot Home
            </span>
          )}
          {property.verified && (
            <span className="bg-green-600 text-white px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Verified
            </span>
          )}
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={isAdding || isRemoving}
          className={`absolute top-3 right-3 w-10 h-10 rounded-lg flex items-center justify-center transition-all shadow-lg ${
            isSaved ? "bg-red-600" : "bg-slate-800/90 hover:bg-slate-700"
          }`}
        >
          <Heart
            className={`w-5 h-5 ${
              isSaved ? "fill-white text-white" : "text-white"
            }`}
          />
        </button>

        {/* View Count */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-slate-900/80 backdrop-blur-sm px-2 py-1 rounded text-white text-xs">
          <Eye className="w-3 h-3" />
          <span className="font-semibold">{property.viewCount} views</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Price - Large and Prominent */}
        <div className="mb-3">
          <div className="text-3xl font-bold text-white">
            ${property.price.toLocaleString()}
          </div>
          {isPricePerMonth && (
            <span className="text-sm text-slate-400 font-medium">/month</span>
          )}
        </div>

        {/* Property Features */}
        <div className="flex items-center gap-4 text-sm text-slate-300 mb-4 pb-4 border-b border-slate-700">
          {property.bedrooms && (
            <div className="flex items-center gap-1.5">
              <Bed className="w-4 h-4 text-red-500" />
              <span className="font-semibold">{property.bedrooms} Beds</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center gap-1.5">
              <Bath className="w-4 h-4 text-red-500" />
              <span className="font-semibold">{property.bathrooms} Baths</span>
            </div>
          )}
          {property.squareFeet && (
            <div className="flex items-center gap-1.5">
              <Square className="w-4 h-4 text-red-500" />
              <span className="font-semibold">
                {property.squareFeet.toLocaleString()} Sq Ft
              </span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-white font-bold text-lg mb-2 line-clamp-1 group-hover:text-red-400 transition-colors">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-start gap-2 text-slate-400">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span className="text-sm font-medium line-clamp-1">
            {property.locality}, {property.city}
          </span>
        </div>

        {/* Purpose Badge */}
        <div className="mt-4">
          <span
            className={`inline-block px-3 py-1 rounded-md text-xs font-bold ${
              property.purpose === "SALE"
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-purple-500/20 text-purple-400 border border-purple-500/30"
            }`}
          >
            FOR {property.purpose}
          </span>
        </div>
      </div>

      {/* Hover Action Bar */}
      <div
        className={`border-t border-slate-700 p-4 transition-all ${
          isHovered ? "bg-slate-700/50" : "bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400 font-medium">View Details</span>
          <ArrowRight
            className={`w-5 h-5 text-red-500 transition-transform ${
              isHovered ? "translate-x-1" : ""
            }`}
          />
        </div>
      </div>
    </div>
  );
};
