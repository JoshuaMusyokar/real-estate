import { useState, useCallback, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Images,
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
  Maximize2,
} from "lucide-react";
import type { Property } from "../../../types";
import {
  useAddToFavoritesMutation,
  useRemoveFromFavoritesMutation,
} from "../../../services/propertyApi";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate, useLocation } from "react-router";

interface PropertyShowcaseProps {
  property: Property;
  favProperties?: string[];
  onShare: () => void;
}

export const PropertyShowcase: React.FC<PropertyShowcaseProps> = ({
  property,
  onShare,
  favProperties,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSaved, setIsSaved] = useState(false);
  const { isAuthenticated } = useAuth();
  const [addToFavorites, { isLoading: isAdding }] = useAddToFavoritesMutation();
  const [removeFromFavorites, { isLoading: isRemoving }] =
    useRemoveFromFavoritesMutation();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  );

  const images = property.images || [];
  const sortedImages = [...images].sort((a, b) => a.order - b.order);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsSaved(false);
      return;
    }
    if (favProperties?.includes(property.id)) {
      setIsSaved(true);
    }
  }, [property.id, isAuthenticated, favProperties]);

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

  const openLightbox = useCallback((index: number) => {
    setSelectedImageIndex(index);
    document.body.style.overflow = "hidden";
  }, []);

  const closeLightbox = useCallback(() => {
    setSelectedImageIndex(null);
    document.body.style.overflow = "unset";
  }, []);

  const goToNext = useCallback(() => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((selectedImageIndex + 1) % sortedImages.length);
  }, [selectedImageIndex, sortedImages.length]);

  const goToPrevious = useCallback(() => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex(
      selectedImageIndex === 0
        ? sortedImages.length - 1
        : selectedImageIndex - 1,
    );
  }, [selectedImageIndex, sortedImages.length]);

  const stats = [
    {
      icon: Bed,
      label: "Beds",
      value: property.bedrooms,
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      icon: Bath,
      label: "Baths",
      value: property.bathrooms,
      gradient: "from-teal-500 to-cyan-600",
    },
    {
      icon: Square,
      label: property.squareFeet ? "Sq.Ft" : "Sq.M",
      value: property.squareFeet || property.squareMeters,
      gradient: "from-purple-500 to-pink-600",
    },
    {
      icon: Building2,
      label: "Type",
      value: property.subType?.name || property.propertyType.name,
      gradient: "from-amber-500 to-orange-600",
    },
  ].filter((stat) => stat.value);

  const getBuilderInitials = (name: string | null) => {
    if (!name) return "BP";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (!images.length) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-2xl flex items-center justify-center">
        <div className="text-center text-gray-400">
          <Images size={48} className="mx-auto mb-3 opacity-50" />
          <p className="text-sm font-medium">No images available</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-black">
        {/* BENTO GRID LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[500px] md:h-[600px]">
          {/* Main Large Image (Left 75%) */}
          <div
            className="md:col-span-3 relative cursor-pointer group overflow-hidden"
            onClick={() => openLightbox(0)}
          >
            <img
              src={sortedImages[0].viewableUrl}
              alt={property.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
          </div>

          {/* Right Column Stack (Right 25%) */}
          <div className="hidden md:grid grid-rows-2 gap-2">
            <div
              className="relative cursor-pointer group overflow-hidden"
              onClick={() => openLightbox(1)}
            >
              <img
                src={
                  sortedImages[1]?.viewableUrl || sortedImages[0].viewableUrl
                }
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                alt="Interior"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
            </div>
            <div
              className="relative cursor-pointer group overflow-hidden"
              onClick={() => openLightbox(2)}
            >
              <img
                src={
                  sortedImages[2]?.viewableUrl || sortedImages[0].viewableUrl
                }
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                alt="Detail"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />

              {/* Image Count Badge */}
              <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-bold border border-white/20 flex items-center gap-2">
                <Images size={14} />
                1/{sortedImages.length}
              </div>
            </div>
          </div>
        </div>

        {/* OVERLAY: Top Bar - Badges & Actions */}
        <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex items-start justify-between z-20 pointer-events-none">
          <div className="flex flex-wrap gap-2 pointer-events-auto">
            {property.featured && (
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg">
                <Sparkles className="w-3.5 h-3.5" /> FEATURED
              </span>
            )}
            {property.verified && (
              <span className="bg-blue-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg">
                <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED
              </span>
            )}
          </div>

          <div className="flex gap-2 pointer-events-auto">
            <button
              onClick={handleSave}
              disabled={isAdding || isRemoving}
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all shadow-lg backdrop-blur-md border ${
                isSaved
                  ? "bg-red-500 border-red-400"
                  : "bg-white/10 border-white/20 hover:bg-white/20"
              }`}
            >
              <Heart
                className={`w-5 h-5 ${isSaved ? "fill-white text-white" : "text-white"}`}
              />
            </button>
            <button
              onClick={onShare}
              className="w-11 h-11 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center hover:bg-white/20 transition-all shadow-lg"
            >
              <Share2 className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => openLightbox(0)}
              className="w-11 h-11 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center hover:bg-white/20 transition-all shadow-lg"
            >
              <Maximize2 className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* OVERLAY: Bottom Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-20 pointer-events-none">
          <div className="pointer-events-auto max-w-4xl">
            {property.complexName && (
              <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3 py-1 mb-3">
                <Building2 className="w-3.5 h-3.5 text-white" />
                <span className="text-xs font-semibold text-white">
                  {property.complexName}
                </span>
              </div>
            )}

            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
              {property.title}
            </h1>

            <div className="flex items-center gap-4 mb-4 text-white/90">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {property.locality}, {property.city.name}
                </span>
              </div>
              {property.viewCount !== undefined && (
                <div className="flex items-center gap-1.5 text-sm opacity-80">
                  <Eye className="w-4 h-4" />
                  <span>{property.viewCount.toLocaleString()} views</span>
                </div>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 bg-gradient-to-br ${stat.gradient} rounded-lg flex items-center justify-center flex-shrink-0`}
                      >
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-lg font-bold text-white leading-none">
                          {typeof stat.value === "number"
                            ? stat.value.toLocaleString()
                            : stat.value}
                        </div>
                        <div className="text-[10px] text-white/70 uppercase">
                          {stat.label}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal (Logic remains the same) */}
      {selectedImageIndex !== null && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[100] flex items-center justify-center">
          <button
            onClick={closeLightbox}
            className="fixed top-6 right-6 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center z-[110]"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {sortedImages.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center z-[110]"
              >
                <ChevronLeft className="w-8 h-8 text-white" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center z-[110]"
              >
                <ChevronRight className="w-8 h-8 text-white" />
              </button>
            </>
          )}

          <div className="relative w-full h-full flex items-center justify-center p-4">
            <img
              src={sortedImages[selectedImageIndex].viewableUrl}
              alt={property.title}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
};
