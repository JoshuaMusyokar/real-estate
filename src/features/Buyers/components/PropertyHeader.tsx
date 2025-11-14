import {
  CheckCircle2,
  Eye,
  Heart,
  MapPin,
  Share2,
  Sparkles,
} from "lucide-react";
import type { Property } from "../../../types";
import {
  useAddToFavoritesMutation,
  useRemoveFromFavoritesMutation,
} from "../../../services/propertyApi";
import { useAuth } from "../../../hooks/useAuth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

interface PropertyHeaderProps {
  property: Property;
  favProperties?: string[];
  onShare: () => void;
}

export const PropertyHeader: React.FC<PropertyHeaderProps> = ({
  property,
  onShare,
  favProperties,
}) => {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
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
    <div className="flex items-start justify-between gap-4 mb-6">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {property.featured && (
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-lg">
              <Sparkles className="w-3.5 h-3.5" />
              FEATURED
            </span>
          )}
          {property.verified && (
            <span className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-lg">
              <CheckCircle2 className="w-3.5 h-3.5" />
              VERIFIED
            </span>
          )}
          <span className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase">
            {property.purpose}
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          {property.title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span>
              {property.locality}, {property.city}
            </span>
          </div>
          {property.viewCount !== undefined && (
            <div className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-gray-400" />
              <span>{property.viewCount} views</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <button
          onClick={handleSave}
          disabled={isAdding || isRemoving}
          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
            isSaved
              ? "bg-red-100 text-red-600"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {isAdding || isRemoving ? (
            <div className="w-4 h-4 border-2 border-t-transparent border-white animate-spin rounded-full" />
          ) : (
            <Heart className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
          )}
        </button>
        <button
          onClick={onShare}
          className="w-10 h-10 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-all"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
