import {
  CheckCircle2,
  Eye,
  Heart,
  MapPin,
  Share2,
  Sparkles,
  Bath,
  Bed,
  Building2,
  Square,
  Calendar,
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
    if (!isAuthenticated) {
      setIsSaved(false);
      return;
    }
    if (favProperties?.includes(property.id)) {
      setIsSaved(true);
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

  const stats = [
    { icon: Bed, label: "Bedrooms", value: property.bedrooms },
    { icon: Bath, label: "Bathrooms", value: property.bathrooms },
    {
      icon: Square,
      label: property.squareFeet ? "Sq. Feet" : "Sq. Meters",
      value: property.squareFeet || property.squareMeters,
    },
    {
      icon: Building2,
      label: "Type",
      value: property.subType || property.propertyType,
    },
  ].filter((stat) => stat.value);

  // Generate builder initials
  const getBuilderInitials = (name: string | null) => {
    if (!name) return "BP";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Premium Glass-morphism Background with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-white/50 to-teal-50/80 backdrop-blur-xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-transparent" />

      {/* Main Content */}
      <div className="relative p-6 md:p-8">
        {/* Top Section: Badges, Title, Actions */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex-1 min-w-0">
            {/* Badges with Premium Styling */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {property.featured && (
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity" />
                  <span className="relative bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    FEATURED
                  </span>
                </div>
              )}
              {property.verified && (
                <div className="group relative">
                  <div className="absolute inset-0 bg-blue-500 rounded-xl blur-sm opacity-50 group-hover:opacity-75 transition-opacity" />
                  <span className="relative bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg">
                    <CheckCircle2 className="w-4 h-4" />
                    VERIFIED
                  </span>
                </div>
              )}
              <span className="bg-white/80 backdrop-blur-sm border border-gray-200/50 text-gray-700 px-4 py-2 rounded-xl text-xs font-bold uppercase shadow-sm">
                FOR {property.purpose}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight">
              {property.title}
            </h1>

            {/* Location & Views */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center shadow-sm">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium">
                  {property.locality}, {property.city.name}
                </span>
              </div>
              {property.viewCount !== undefined && (
                <div className="flex items-center gap-2 text-gray-500">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {property.viewCount.toLocaleString()} views
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons with Glass Effect */}
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={handleSave}
              disabled={isAdding || isRemoving}
              className={`group relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl ${
                isSaved
                  ? "bg-gradient-to-br from-red-500 to-pink-600"
                  : "bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:border-red-300"
              }`}
            >
              <div
                className={`absolute inset-0 rounded-xl blur-md opacity-0 group-hover:opacity-50 transition-opacity ${
                  isSaved ? "bg-red-500" : "bg-gray-300"
                }`}
              />
              {isAdding || isRemoving ? (
                <div className="w-5 h-5 border-2 border-t-transparent border-current animate-spin rounded-full" />
              ) : (
                <Heart
                  className={`relative w-5 h-5 transition-transform group-hover:scale-110 ${
                    isSaved
                      ? "fill-white text-white"
                      : "text-gray-600 group-hover:text-red-500"
                  }`}
                />
              )}
            </button>
            <button
              onClick={onShare}
              className="group relative w-12 h-12 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl flex items-center justify-center hover:border-blue-300 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <div className="absolute inset-0 rounded-xl bg-blue-500 blur-md opacity-0 group-hover:opacity-30 transition-opacity" />
              <Share2 className="relative w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-all group-hover:scale-110" />
            </button>
          </div>
        </div>

        {/* Divider with Gradient */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-6" />

        {/* Stats Grid with Premium Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="group relative bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-4 hover:bg-white/80 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-teal-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:shadow-lg transition-shadow">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-2xl font-bold text-gray-900 leading-none mb-1">
                      {typeof stat.value === "number"
                        ? stat.value.toLocaleString()
                        : stat.value}
                    </div>
                    <div className="text-xs text-gray-600 font-medium">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Section: Builder Info & Additional Details */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Builder Info */}
          {property.builderName && (
            <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition-all">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full blur-sm opacity-50" />
                <div className="relative w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-600 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-sm">
                    {getBuilderInitials(property.builderName)}
                  </span>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 font-medium">
                  Built by
                </div>
                <div className="text-sm font-bold text-gray-900">
                  {property.builderName}
                </div>
              </div>
            </div>
          )}

          {/* Year Built */}
          {property.yearBuilt && (
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl px-4 py-3 shadow-sm">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center shadow-sm">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-xs text-gray-500 font-medium">Built</div>
                <div className="text-sm font-bold text-gray-900">
                  {property.yearBuilt}
                </div>
              </div>
            </div>
          )}

          {/* Furnishing Status */}
          {property.furnishingStatus && (
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl px-4 py-3 shadow-sm">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-sm">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-xs text-gray-500 font-medium">
                  Furnishing
                </div>
                <div className="text-sm font-bold text-gray-900">
                  {property.furnishingStatus}
                </div>
              </div>
            </div>
          )}

          {/* Floors */}
          {property.floors && (
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl px-4 py-3 shadow-sm">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-sm">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-xs text-gray-500 font-medium">Floors</div>
                <div className="text-sm font-bold text-gray-900">
                  {property.floors}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-teal-500/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-amber-500/10 to-orange-500/10 rounded-full blur-3xl -z-10" />
      </div>
    </div>
  );
};
