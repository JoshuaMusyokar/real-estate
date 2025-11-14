import { useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn, Images } from "lucide-react";
import type { PropertyImage } from "../../../types";

interface PropertyImageGalleryProps {
  images: PropertyImage[];
  propertyTitle: string;
}

export const ImageGallery: React.FC<PropertyImageGalleryProps> = ({
  images,
  propertyTitle,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );

  const sortedImages = [...images].sort((a, b) => a.order - b.order);
  const coverImage = sortedImages.find((img) => img.isCover) || sortedImages[0];
  const otherImages = sortedImages.slice(1, 5);

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

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "ArrowLeft") goToPrevious();
    },
    [selectedImageIndex, closeLightbox, goToNext, goToPrevious]
  );

  useEffect(() => {
    if (selectedImageIndex !== null) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [selectedImageIndex, handleKeyDown]);

  if (!images.length) {
    return (
      <div className="w-full h-48 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center">
        <div className="text-center text-gray-400">
          <Images size={40} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">No images available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Compact Gallery Grid */}
      <div className="relative rounded-xl overflow-hidden shadow-lg">
        {/* Main Image Container */}
        <div
          className="relative group cursor-pointer"
          onClick={() => openLightbox(0)}
        >
          <img
            src={coverImage.viewableUrl}
            alt={coverImage.caption || propertyTitle}
            className="w-full h-56 sm:h-64 md:h-72 object-cover transition-transform duration-500 group-hover:scale-105"
            loading="eager"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Photo Count Badge */}
          <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5">
            <Images size={14} />
            <span>{sortedImages.length}</span>
          </div>

          {/* View All Button */}
          <button className="absolute bottom-3 right-3 bg-white hover:bg-gray-100 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium shadow-lg flex items-center gap-2 transition-all duration-200 hover:shadow-xl">
            <ZoomIn size={16} />
            <span className="hidden sm:inline">View All</span>
          </button>
        </div>

        {/* Thumbnail Strip */}
        {otherImages.length > 0 && (
          <div className="absolute bottom-3 left-3 flex gap-2 max-w-[calc(100%-120px)] overflow-hidden">
            {otherImages.map((image, index) => (
              <button
                key={image.id}
                onClick={(e) => {
                  e.stopPropagation();
                  openLightbox(index + 1);
                }}
                className="relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 border-white/80 hover:border-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
              >
                <img
                  src={image.viewableUrl}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {index === 3 && sortedImages.length > 5 && (
                  <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">
                      +{sortedImages.length - 5}
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImageIndex !== null && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-55 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:bg-white/10 transition-all z-51 p-2 rounded-full"
            aria-label="Close"
          >
            <X size={28} />
          </button>

          {/* Navigation */}
          {sortedImages.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 transition-all z-20 p-2 sm:p-3 rounded-full"
                aria-label="Previous"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 transition-all z-20 p-2 sm:p-3 rounded-full"
                aria-label="Next"
              >
                <ChevronRight size={28} />
              </button>
            </>
          )}

          {/* Main Image */}
          <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-8">
            <img
              src={sortedImages[selectedImageIndex].viewableUrl}
              alt={sortedImages[selectedImageIndex].caption || propertyTitle}
              className="max-w-full max-h-full object-contain rounded-lg"
            />

            {/* Image Counter */}
            <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm font-medium">
              {selectedImageIndex + 1} / {sortedImages.length}
            </div>

            {/* Caption */}
            {sortedImages[selectedImageIndex].caption && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-lg max-w-md text-center text-sm">
                {sortedImages[selectedImageIndex].caption}
              </div>
            )}
          </div>

          {/* Bottom Thumbnail Strip */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[calc(100%-2rem)] overflow-x-auto pb-2 scrollbar-hide">
            {sortedImages.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setSelectedImageIndex(index)}
                className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  index === selectedImageIndex
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
          </div>
        </div>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};
