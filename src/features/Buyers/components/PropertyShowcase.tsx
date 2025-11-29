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
import { useNavigate } from "react-router";

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
  const [isSaved, setIsSaved] = useState(false);
  const { isAuthenticated } = useAuth();
  const [addToFavorites, { isLoading: isAdding }] = useAddToFavoritesMutation();
  const [removeFromFavorites, { isLoading: isRemoving }] =
    useRemoveFromFavoritesMutation();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
        : selectedImageIndex - 1
    );
  }, [selectedImageIndex, sortedImages.length]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % sortedImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + sortedImages.length) % sortedImages.length
    );
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "ArrowLeft") goToPrevious();
    };
    if (selectedImageIndex !== null) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [selectedImageIndex, closeLightbox, goToNext, goToPrevious]);

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
      value: property.subType || property.propertyType,
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
      <div className="w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
        <div className="text-center text-gray-400">
          <Images size={48} className="mx-auto mb-3 opacity-50" />
          <p className="text-sm font-medium">No images available</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl shadow-2xl">
        {/* Main Image Container with Carousel */}
        <div className="relative h-[500px] md:h-[600px] bg-black">
          {/* Current Image */}
          <img
            src={sortedImages[currentImageIndex].viewableUrl}
            alt={property.title}
            className="w-full h-full object-cover"
          />

          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />

          {/* Navigation Arrows */}
          {sortedImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition-all z-10 group"
              >
                <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition-all z-10 group"
              >
                <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              </button>
            </>
          )}

          {/* Top Bar - Badges & Actions */}
          <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex items-start justify-between z-20">
            {/* Left: Badges */}
            <div className="flex flex-wrap gap-2">
              {property.featured && (
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl blur-md opacity-75" />
                  <span className="relative bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-sm">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                    FEATURED
                  </span>
                </div>
              )}
              {property.verified && (
                <div className="group relative">
                  <div className="absolute inset-0 bg-blue-500 rounded-xl blur-md opacity-50" />
                  <span className="relative bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-sm">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    VERIFIED
                  </span>
                </div>
              )}
              <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-3 py-1.5 rounded-xl text-xs font-bold uppercase shadow-lg">
                FOR {property.purpose}
              </span>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={isAdding || isRemoving}
                className={`group relative w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg backdrop-blur-md border ${
                  isSaved
                    ? "bg-red-500/90 border-red-400/50"
                    : "bg-white/10 border-white/20 hover:bg-white/20"
                }`}
              >
                {isAdding || isRemoving ? (
                  <div className="w-4 h-4 border-2 border-t-transparent border-white animate-spin rounded-full" />
                ) : (
                  <Heart
                    className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                      isSaved ? "fill-white text-white" : "text-white"
                    }`}
                  />
                )}
              </button>
              <button
                onClick={onShare}
                className="group relative w-11 h-11 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center hover:bg-white/20 transition-all duration-300 shadow-lg"
              >
                <Share2 className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              </button>
              <button
                onClick={() => openLightbox(currentImageIndex)}
                className="group relative w-11 h-11 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center hover:bg-white/20 transition-all duration-300 shadow-lg"
              >
                <Maximize2 className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>

          {/* Bottom Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-20">
            {property.complexName && (
              <div className="w-50 flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3 py-1.5 shadow-lg">
                <Building2 className="w-3.5 h-3.5 text-white" />
                <span className="text-xs font-semibold text-white">
                  {property.complexName}
                </span>
              </div>
            )}
            {/* Title & Location */}
            <div className="mb-4">
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
                {property.title}
              </h1>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 text-white/90">
                  <div className="w-7 h-7 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="text-sm md:text-base font-medium drop-shadow">
                    {property.locality}, {property.city.name}
                  </span>
                </div>
                {property.viewCount !== undefined && (
                  <div className="flex items-center gap-1.5 text-white/80 text-sm">
                    <Eye className="w-4 h-4" />
                    <span>{property.viewCount.toLocaleString()} views</span>
                  </div>
                )}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="group relative bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 hover:bg-white/20 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-9 h-9 bg-gradient-to-br ${stat.gradient} rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg`}
                      >
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xl font-bold text-white leading-none mb-0.5">
                          {typeof stat.value === "number"
                            ? stat.value.toLocaleString()
                            : stat.value}
                        </div>
                        <div className="text-[10px] text-white/80 font-medium uppercase">
                          {stat.label}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Additional Info Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              {property.builderName && (
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3 py-1.5 shadow-lg">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-[10px]">
                      {getBuilderInitials(property.builderName)}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-white">
                    {property.builderName}
                  </span>
                </div>
              )}
              {property.yearBuilt && (
                <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3 py-1.5 shadow-lg">
                  <Calendar className="w-3.5 h-3.5 text-white" />
                  <span className="text-xs font-semibold text-white">
                    {property.yearBuilt}
                  </span>
                </div>
              )}
              {property.furnishingStatus && (
                <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3 py-1.5 shadow-lg">
                  <Building2 className="w-3.5 h-3.5 text-white" />
                  <span className="text-xs font-semibold text-white">
                    {property.furnishingStatus}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Image Counter & Thumbnails */}
          <div className="absolute bottom-4 right-4 flex items-center gap-2 z-20">
            <div className="bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-bold border border-white/20">
              {currentImageIndex + 1} / {sortedImages.length}
            </div>
          </div>

          {/* Thumbnail Strip (Hidden on Mobile) */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden md:flex gap-2 max-w-md overflow-hidden z-20">
            {sortedImages.slice(0, 5).map((image, index) => (
              <button
                key={image.id}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentImageIndex
                    ? "border-white scale-110 shadow-xl"
                    : "border-white/30 hover:border-white/70"
                }`}
              >
                <img
                  src={image.viewableUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
            {sortedImages.length > 5 && (
              <button
                onClick={() => openLightbox(0)}
                className="flex-shrink-0 w-16 h-16 rounded-lg bg-black/60 backdrop-blur-md border-2 border-white/30 flex items-center justify-center text-white text-xs font-bold hover:border-white/70 transition-all"
              >
                +{sortedImages.length - 5}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImageIndex !== null && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:bg-white/10 transition-all z-50 p-2 rounded-full"
          >
            <X size={28} />
          </button>

          {sortedImages.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 transition-all z-50 p-3 rounded-full"
              >
                <ChevronLeft size={32} />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 transition-all z-50 p-3 rounded-full"
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}

          <div className="relative w-full h-full flex items-center justify-center p-8">
            <img
              src={sortedImages[selectedImageIndex].viewableUrl}
              alt={property.title}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-sm font-medium">
              {selectedImageIndex + 1} / {sortedImages.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
