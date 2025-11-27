import { MapPin, Home, Bed, Bath, Square, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useAddToFavoritesMutation,
  useRemoveFromFavoritesMutation,
} from "../../services/propertyApi";
import { useAuth } from "../../hooks/useAuth";
import type { Property } from "../../types";

// Property Card Component (Zillow Style)
export const Template2PropertyCard = ({
  property,
  favProperties,
}: {
  property: Property;
  favProperties: string[];
}) => {
  const [isSaved, setIsSaved] = useState(false);
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
      className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300 cursor-pointer group"
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden bg-gray-100">
        {coverImage ? (
          <img
            src={coverImage}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <Home className="w-16 h-16 text-gray-400" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {property.featured && (
            <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
              FEATURED
            </span>
          )}
          {property.purpose === "SALE" && (
            <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">
              FOR SALE
            </span>
          )}
          {property.purpose === "RENT" && (
            <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs font-bold">
              FOR RENT
            </span>
          )}
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={isAdding || isRemoving}
          className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md"
        >
          <Heart
            className={`w-5 h-5 ${
              isSaved ? "fill-red-500 text-red-500" : "text-gray-600"
            }`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Price */}
        <div className="text-2xl font-bold text-gray-900 mb-2">
          ${property.price.toLocaleString()}
          {isPricePerMonth && (
            <span className="text-base text-gray-600">/mo</span>
          )}
        </div>

        {/* Property Features */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3 pb-3 border-b border-gray-200">
          {property.bedrooms && (
            <span className="flex items-center gap-1">
              <Bed className="w-4 h-4" />
              {property.bedrooms} bd
            </span>
          )}
          {property.bathrooms && (
            <span className="flex items-center gap-1">
              <Bath className="w-4 h-4" />
              {property.bathrooms} ba
            </span>
          )}
          {property.squareFeet && (
            <span className="flex items-center gap-1">
              <Square className="w-4 h-4" />
              {property.squareFeet.toLocaleString()} sqft
            </span>
          )}
        </div>

        {/* Address */}
        <div className="flex items-start gap-2 mb-2">
          <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-gray-700 font-medium line-clamp-2">
            {property.locality}, {property.city.name}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-sm text-gray-900 font-semibold line-clamp-1">
          {property.title}
        </h3>
      </div>
    </div>
  );
};
