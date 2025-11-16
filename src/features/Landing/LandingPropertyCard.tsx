/* eslint-disable @typescript-eslint/no-unused-vars */
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
  ArrowRight,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState, type FC } from "react";
import type { Property } from "../../types";
import {
  useAddToFavoritesMutation,
  useRemoveFromFavoritesMutation,
} from "../../services/propertyApi";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router";
import { getCurrencySymbol } from "../../utils/currency-utils";
interface PropertyCardProps {
  property: Property;
  className: string;
  style: Record<string, string>;
  favProperties: string[];
}
export const LandingPropertyCard: FC<PropertyCardProps> = ({
  property,
  className = "",
  style = {},
  favProperties,
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [addToFavorites, { isLoading: isAdding }] = useAddToFavoritesMutation();
  const [removeFromFavorites, { isLoading: isRemoving }] =
    useRemoveFromFavoritesMutation();
  useEffect(() => {
    // Only check if the user is authenticated
    if (!isAuthenticated) {
      setIsSaved(false);
      return;
    }

    if (favProperties?.includes(property.id)) {
      setIsSaved(true);
      return;
    }
  }, [property.id, isAuthenticated, favProperties]);

  const coverImage =
    property.images?.find((img) => img.isCover)?.viewableUrl ||
    property.images?.[0]?.viewableUrl;
  const isPricePerMonth =
    property.purpose === "RENT" || property.purpose === "LEASE";

  const handleCardClick = () => {
    // Navigate to property detail
    window.location.href = `/property-detail/${property.id}`;
  };

  const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
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

  const handleShare = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out this property: ${property.title}`,
        url: window.location.href,
      });
    }
  };

  return (
    <div
      className={`group relative bg-white rounded-3xl overflow-hidden border-2 border-gray-200 hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 cursor-pointer ${className}`}
      style={style}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with Overlay Effects */}
      <div className="relative h-80 overflow-hidden bg-gray-100">
        {coverImage ? (
          <>
            <img
              src={coverImage}
              alt={property.title}
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-full object-cover transition-all duration-700 ${
                imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-110"
              } ${isHovered ? "scale-110 rotate-1" : "scale-100"}`}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 animate-shimmer" />
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex items-center justify-center">
            <Home className="w-24 h-24 text-gray-400 opacity-50" />
          </div>
        )}

        {/* Gradient Overlay on Hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
          {property.featured && (
            <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-2xl backdrop-blur-sm animate-pulse-subtle">
              <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
              FEATURED
            </span>
          )}
          {property.verified && (
            <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-2xl backdrop-blur-sm">
              <Check className="w-3.5 h-3.5" />
              VERIFIED
            </span>
          )}
          {property.purpose === "SALE" && (
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 py-1.5 rounded-xl text-xs font-black shadow-2xl backdrop-blur-sm">
              FOR SALE
            </span>
          )}
          {property.purpose === "RENT" && (
            <span className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-3 py-1.5 rounded-xl text-xs font-black shadow-2xl backdrop-blur-sm">
              FOR RENT
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
          <button
            onClick={handleSave}
            disabled={isAdding || isRemoving}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-2xl transition-all ${
              isSaved ? "bg-red-500" : "bg-white/95 hover:bg-white"
            }`}
          >
            {isAdding || isRemoving ? (
              <div className="w-4 h-4 border-2 border-t-transparent border-white animate-spin rounded-full" />
            ) : (
              <Heart
                className={`w-5 h-5 transition-all duration-300 ${
                  isSaved ? "fill-white text-white" : "text-gray-700"
                }`}
              />
            )}
          </button>

          <button
            onClick={handleShare}
            className={`w-12 h-12 bg-white/95 backdrop-blur-md rounded-2xl flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 shadow-2xl ${
              isHovered
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-2"
            }`}
          >
            <Share2 className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Bottom Info Overlay (appears on hover) */}
        <div
          className={`absolute bottom-0 left-0 right-0 p-4 transition-all duration-500 ${
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <button className="w-full py-3 bg-white/95 backdrop-blur-md rounded-2xl font-black text-gray-900 hover:bg-white transition-all flex items-center justify-center gap-2 shadow-2xl">
            View Details
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4">
        {/* Title and Location */}
        <div>
          <h3 className="font-black text-xl text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors duration-300">
            {property.title}
          </h3>
          <div className="flex items-start gap-2 text-gray-600 text-sm">
            <MapPin className="w-4 h-4 flex-shrink-0 text-blue-500 mt-0.5" />
            <span className="line-clamp-1 font-semibold">
              {property.locality}, {property.city}
            </span>
          </div>
        </div>

        {/* Property Features */}
        <div className="flex items-center gap-4 py-3 border-y border-gray-100">
          {property.bedrooms && (
            <div className="flex items-center gap-2 text-gray-700">
              <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center">
                <Bed className="w-4 h-4 text-blue-600" />
              </div>
              <span className="font-black text-sm">{property.bedrooms}</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center gap-2 text-gray-700">
              <div className="w-8 h-8 bg-purple-50 rounded-xl flex items-center justify-center">
                <Bath className="w-4 h-4 text-purple-600" />
              </div>
              <span className="font-black text-sm">{property.bathrooms}</span>
            </div>
          )}
          {property.squareFeet && (
            <div className="flex items-center gap-2 text-gray-700">
              <div className="w-8 h-8 bg-green-50 rounded-xl flex items-center justify-center">
                <Square className="w-4 h-4 text-green-600" />
              </div>
              <span className="font-black text-sm">
                {property.squareFeet.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Price and Stats */}
        <div className="flex items-end justify-between pt-2">
          <div>
            <div className="text-3xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {getCurrencySymbol(property.currency)}
              {property.price.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 uppercase font-black mt-1 tracking-wider">
              {isPricePerMonth ? "per month" : property.purpose}
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1.5 text-gray-500">
              <Eye className="w-4 h-4" />
              <span className="font-bold">{property.viewCount}</span>
            </div>
            {property.featured && (
              <div className="flex items-center gap-1.5 text-amber-500">
                <TrendingUp className="w-4 h-4" />
                <span className="font-bold text-xs">Hot</span>
              </div>
            )}
          </div>
        </div>

        {/* Additional Info (appears on hover) */}
        <div
          className={`grid grid-cols-2 gap-3 transition-all duration-500 ${
            isHovered
              ? "opacity-100 max-h-20"
              : "opacity-0 max-h-0 overflow-hidden"
          }`}
        >
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Calendar className="w-3.5 h-3.5 text-blue-500" />
            <span className="font-semibold">Listed Today</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <MapPin className="w-3.5 h-3.5 text-green-500" />
            <span className="font-semibold">Prime Location</span>
          </div>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div
        className={`absolute inset-0 rounded-3xl transition-opacity duration-500 pointer-events-none ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent" />
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes pulse-subtle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.85; }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }

        .animate-pulse-subtle {
          animation: pulse-subtle 2s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .animate-shimmer {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};
