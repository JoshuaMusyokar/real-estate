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
    setIsSaved(favProperties?.includes(property.id) ?? false);
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
    } catch (err) {
      console.error("Favorite error:", err);
    }
  };

  const openLightbox = useCallback((i: number) => {
    setSelectedImageIndex(i);
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

  // Keyboard nav in lightbox
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedImageIndex, goToNext, goToPrevious, closeLightbox]);

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
      gradient: "from-cyan-500 to-blue-600",
    },
    {
      icon: Square,
      label: property.squareFeet ? "Sq.ft" : "Sq.m",
      value: property.squareFeet || property.squareMeters,
      gradient: "from-indigo-500 to-blue-700",
    },
    {
      icon: Building2,
      label: "Type",
      value: property.subType?.name || property.propertyType.name,
      gradient: "from-blue-600 to-indigo-700",
    },
  ].filter((s) => s.value);

  if (!images.length) {
    return (
      <div className="w-full h-48 sm:h-72 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center">
        <div className="text-center text-blue-300">
          <Images className="w-10 h-10 mx-auto mb-2" />
          <p className="text-xs font-medium">No images available</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-xl bg-black">
        {/* ── Bento grid ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-1 h-56 sm:h-80 md:h-[500px]">
          {/* Main image */}
          <div
            className="md:col-span-3 relative cursor-pointer group overflow-hidden"
            onClick={() => openLightbox(0)}
          >
            <img
              src={sortedImages[0].viewableUrl}
              alt={property.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />
          </div>

          {/* Right stack — hidden on mobile */}
          <div className="hidden md:grid grid-rows-2 gap-1">
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
              <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
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
              <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
              {/* Image count */}
              <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-bold border border-white/20 flex items-center gap-1">
                <Images className="w-3 h-3" /> {sortedImages.length} photos
              </div>
            </div>
          </div>
        </div>

        {/* Mobile image count */}
        <div className="absolute top-3 left-3 md:hidden bg-black/60 backdrop-blur-md text-white px-2 py-1 rounded-full text-[10px] font-bold border border-white/20 flex items-center gap-1 z-20">
          <Images className="w-3 h-3" /> {sortedImages.length} photos
        </div>

        {/* ── Top action bar ──────────────────────────────────────────────── */}
        <div className="absolute top-0 left-0 right-0 p-3 sm:p-5 flex items-start justify-between z-20 pointer-events-none">
          {/* Badges */}
          <div className="flex flex-wrap gap-1.5 pointer-events-auto">
            {property.featured && (
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-bold flex items-center gap-1 shadow-md">
                <Sparkles className="w-3 h-3" /> FEATURED
              </span>
            )}
            {property.verified && (
              <span className="bg-blue-600 text-white px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-bold flex items-center gap-1 shadow-md">
                <CheckCircle2 className="w-3 h-3" /> VERIFIED
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-1.5 pointer-events-auto">
            {[
              {
                icon: Heart,
                onClick: handleSave,
                active: isSaved,
                disabled: isAdding || isRemoving,
                activeClass: "bg-red-500 border-red-400",
              },
              {
                icon: Share2,
                onClick: onShare,
                active: false,
                disabled: false,
                activeClass: "",
              },
              {
                icon: Maximize2,
                onClick: () => openLightbox(0),
                active: false,
                disabled: false,
                activeClass: "",
              },
            ].map(
              ({ icon: Icon, onClick, active, disabled, activeClass }, i) => (
                <button
                  key={i}
                  onClick={onClick}
                  disabled={disabled}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all shadow-md backdrop-blur-md border
                  ${active ? activeClass : "bg-white/10 border-white/20 hover:bg-white/25"}`}
                >
                  <Icon
                    className={`w-4 h-4 ${active ? "fill-white text-white" : "text-white"}`}
                  />
                </button>
              ),
            )}
          </div>
        </div>

        {/* ── Bottom info overlay ─────────────────────────────────────────── */}
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5 z-20">
          {property.complexName && (
            <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-2.5 py-1 mb-2">
              <Building2 className="w-3 h-3 text-white" />
              <span className="text-[10px] font-semibold text-white">
                {property.complexName}
              </span>
            </div>
          )}

          <h1 className="text-base sm:text-2xl md:text-3xl font-black text-white mb-1.5 drop-shadow-lg line-clamp-2">
            {property.title}
          </h1>

          <div className="flex items-center gap-3 mb-3 text-white/80">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium">
                {property.locality}, {property.city.name}
              </span>
            </div>
            {property.viewCount !== undefined && (
              <div className="flex items-center gap-1 text-xs opacity-70">
                <Eye className="w-3 h-3" />
                <span>{property.viewCount.toLocaleString()} views</span>
              </div>
            )}
          </div>

          {/* Stats grid */}
          {stats.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={i}
                    className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-2 sm:p-2.5"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br ${stat.gradient} rounded-lg flex items-center justify-center flex-shrink-0`}
                      >
                        <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-black text-white leading-none">
                          {typeof stat.value === "number"
                            ? stat.value.toLocaleString()
                            : stat.value}
                        </div>
                        <div className="text-[9px] sm:text-[10px] text-white/60 uppercase tracking-wide">
                          {stat.label}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Lightbox ─────────────────────────────────────────────────────── */}
      {selectedImageIndex !== null && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[100] flex items-center justify-center">
          <button
            onClick={closeLightbox}
            className="fixed top-4 right-4 w-10 h-10 bg-white/10 hover:bg-red-500 border border-white/20 rounded-xl flex items-center justify-center z-[110] transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Counter */}
          <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/20 z-[110]">
            {selectedImageIndex + 1} / {sortedImages.length}
          </div>

          {sortedImages.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl flex items-center justify-center z-[110] transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl flex items-center justify-center z-[110] transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </>
          )}

          <div className="w-full h-full flex items-center justify-center p-4 sm:p-16">
            <img
              src={sortedImages[selectedImageIndex].viewableUrl}
              alt={property.title}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  );
};
