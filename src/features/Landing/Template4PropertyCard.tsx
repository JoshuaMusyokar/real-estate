/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Bath,
  Bed,
  Check,
  Eye,
  Heart,
  MapPin,
  Sparkles,
  ArrowRight,
  Ruler,
} from "lucide-react";
import { useEffect, useState, type FC } from "react";
import type { Property } from "../../types";
import {
  useAddToFavoritesMutation,
  useRemoveFromFavoritesMutation,
} from "../../services/propertyApi";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router";

interface Template4PropertyCardProps {
  property: Property;
  className: string;
  style: Record<string, string>;
  favProperties: string[];
}

export const Template4PropertyCard: FC<Template4PropertyCardProps> = ({
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

  return (
    <div
      className={`group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300 cursor-pointer ${className}`}
      style={style}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        {coverImage ? (
          <>
            <img
              src={coverImage}
              alt={property.title}
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-full object-cover transition-transform duration-500 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              } ${isHovered ? "scale-110" : "scale-100"}`}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
              <MapPin className="w-6 h-6 text-gray-400" />
            </div>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {property.featured && (
            <span className="bg-yellow-500 text-white px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Featured
            </span>
          )}
          {property.verified && (
            <span className="bg-blue-600 text-white px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
              <Check className="w-3 h-3" />
              Verified
            </span>
          )}
        </div>

        {/* Price Tag */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2">
          <div className="text-lg font-black text-gray-900">
            ${property.price.toLocaleString()}
          </div>
          {isPricePerMonth && (
            <div className="text-xs text-gray-500 font-semibold">per month</div>
          )}
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={isAdding || isRemoving}
          className={`absolute bottom-3 right-3 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${
            isSaved ? "bg-red-500" : "bg-white/95 hover:bg-white"
          }`}
        >
          {isAdding || isRemoving ? (
            <div className="w-4 h-4 border-2 border-t-transparent border-gray-700 animate-spin rounded-full" />
          ) : (
            <Heart
              className={`w-5 h-5 transition-all ${
                isSaved ? "fill-white text-white" : "text-gray-700"
              }`}
            />
          )}
        </button>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Title and Location */}
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-1 text-lg">
          {property.title}
        </h3>
        <div className="flex items-center gap-1 text-gray-600 text-sm mb-3">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="line-clamp-1">
            {property.locality}, {property.city}
          </span>
        </div>

        {/* Property Features */}
        <div className="flex items-center gap-4 py-3 border-y border-gray-100 mb-3">
          {property.bedrooms && (
            <div className="flex items-center gap-2 text-gray-700">
              <Bed className="w-4 h-4 text-blue-600" />
              <span className="font-bold text-sm">
                {property.bedrooms} Beds
              </span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center gap-2 text-gray-700">
              <Bath className="w-4 h-4 text-blue-600" />
              <span className="font-bold text-sm">
                {property.bathrooms} Baths
              </span>
            </div>
          )}
          {property.squareFeet && (
            <div className="flex items-center gap-2 text-gray-700">
              <Ruler className="w-4 h-4 text-green-600" />
              <span className="font-bold text-sm">
                {property.squareFeet.toLocaleString()} sq.ft
              </span>
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{property.viewCount} views</span>
          </div>
          <div className="font-semibold">
            {property.purpose === "SALE" ? "For Sale" : "For Rent"}
          </div>
        </div>

        {/* View Details Button - Appears on Hover */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center">
            <button className="px-6 py-3 bg-white rounded-xl font-semibold text-gray-900 hover:bg-gray-50 transition-all flex items-center gap-2 shadow-lg">
              View Details
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
