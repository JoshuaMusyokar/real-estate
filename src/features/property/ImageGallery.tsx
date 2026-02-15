import { ChevronLeft, ChevronRight, ImageIcon, X, ZoomIn } from "lucide-react";
import { useState, useEffect, type FC } from "react";
import type { PropertyImage } from "../../types";
import { BASE_URL } from "../../constants";

interface ImageGalleryProps {
  images: PropertyImage[];
  title: string;
  propertyId: string;
}

export const ImageGallery: FC<ImageGalleryProps> = ({
  images,
  title,
  propertyId,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);

  // Fetch presigned URLs for all images
  useEffect(() => {
    const fetchPresignedUrls = async () => {
      if (!images || images.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const urlMap: { [key: string]: string } = {};

        // For each image, get presigned URL if it's from S3
        for (const image of images) {
          // If it's an external URL (like Unsplash), use directly
          if (image.url.includes("unsplash.com")) {
            urlMap[image.id] = image.url;
            continue;
          }

          // If we already have a viewableUrl from backend, use it
          if (image.viewableUrl) {
            urlMap[image.id] = image.viewableUrl;
            continue;
          }

          // Otherwise, fetch presigned URL from API
          try {
            const response = await fetch(
              `${BASE_URL}/properties/${propertyId}/images/${image.id}/url`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              },
            );

            const data = await response.json();
            if (data.success) {
              urlMap[image.id] = data.url;
            } else {
              // Fallback to original URL if presigned URL fails
              urlMap[image.id] = image.url;
            }
          } catch (error) {
            console.error("Error fetching presigned URL:", error);
            urlMap[image.id] = image.url; // Fallback
          }
        }

        setImageUrls(urlMap);
      } catch (error) {
        console.error("Error loading images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPresignedUrls();
  }, [images, propertyId]);

  const coverImage = images?.find((img) => img.isCover) || images?.[0];
  const otherImages = images?.filter((img) => !img.isCover) || [];

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Handle keyboard navigation
  useEffect(() => {
    if (!showLightbox) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "Escape") setShowLightbox(false);
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [showLightbox]);

  // Get URL for a specific image
  const getImageUrl = (image: PropertyImage) => {
    return imageUrls[image.id] || image.url;
  };

  if (loading) {
    return (
      <div className="w-full h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[600px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 border-b-2 border-gray-900 mx-auto mb-3 sm:mb-4"></div>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            Loading images...
          </p>
        </div>
      </div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[600px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <ImageIcon className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 text-gray-300 mx-auto mb-3 sm:mb-4" />
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            No images available
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[600px]">
        {/* Main Image */}
        <div
          className="col-span-1 md:col-span-3 relative rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden cursor-pointer group"
          onClick={() => {
            setCurrentIndex(0);
            setShowLightbox(true);
          }}
        >
          <img
            src={getImageUrl(coverImage)}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Mobile View All Button */}
          <button className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 md:bottom-4 md:right-4 bg-white/95 backdrop-blur-sm px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 rounded-lg sm:rounded-xl font-semibold text-gray-900 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:opacity-0 md:group-hover:opacity-100 transition-opacity shadow-lg">
            <ZoomIn className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            <span className="hidden xs:inline">View All</span>
            <span className="xs:hidden">({images.length})</span>
            <span className="hidden xs:inline">({images.length})</span>
          </button>
        </div>

        {/* Thumbnail Grid - Hidden on Mobile */}
        <div className="hidden md:flex flex-col gap-2 sm:gap-3 md:gap-4">
          {otherImages.slice(0, 2).map((img, idx) => (
            <div
              key={img.id}
              className="relative rounded-lg sm:rounded-xl overflow-hidden cursor-pointer group h-full"
              onClick={() => {
                setCurrentIndex(idx + 1);
                setShowLightbox(true);
              }}
            >
              <img
                src={getImageUrl(img)}
                alt={`${title} ${idx + 2}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {idx === 1 && otherImages.length > 2 && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <span className="text-white text-base sm:text-lg md:text-xl font-bold">
                    +{otherImages.length - 2}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile Thumbnail Scroll - Visible only on Mobile */}
        {otherImages.length > 0 && (
          <div className="md:hidden col-span-1 overflow-x-auto">
            <div className="flex gap-2 pb-2">
              {otherImages.slice(0, 4).map((img, idx) => (
                <div
                  key={img.id}
                  className="relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden cursor-pointer"
                  onClick={() => {
                    setCurrentIndex(idx + 1);
                    setShowLightbox(true);
                  }}
                >
                  <img
                    src={getImageUrl(img)}
                    alt={`${title} ${idx + 2}`}
                    className="w-full h-full object-cover"
                  />
                  {idx === 3 && otherImages.length > 4 && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        +{otherImages.length - 4}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {showLightbox && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors text-white z-10"
          >
            <X className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>

          {/* Previous Button */}
          <button
            onClick={prevImage}
            className="absolute left-2 sm:left-4 md:left-6 w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors text-white z-10"
          >
            <ChevronLeft className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>

          {/* Image Container */}
          <div className="w-full h-full flex flex-col items-center justify-center px-12 sm:px-16 md:px-20 py-12 sm:py-16 md:py-20">
            <div className="relative max-w-6xl max-h-[80vh] sm:max-h-[85vh] md:max-h-[90vh] w-full h-full flex items-center justify-center">
              <img
                src={getImageUrl(images[currentIndex])}
                alt={`${title} ${currentIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Image Counter */}
            <div className="text-white text-center mt-3 sm:mt-4 font-medium text-sm sm:text-base">
              {currentIndex + 1} / {images.length}
            </div>

            {/* Mobile Thumbnail Strip in Lightbox */}
            <div className="md:hidden mt-4 overflow-x-auto max-w-full">
              <div className="flex gap-2 px-4">
                {images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      idx === currentIndex
                        ? "border-white scale-110"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={getImageUrl(img)}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={nextImage}
            className="absolute right-2 sm:right-4 md:right-6 w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors text-white z-10"
          >
            <ChevronRight className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>
        </div>
      )}
    </>
  );
};
