import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PropertyImage } from "../../types/property";

interface PropertyImageCarouselProps {
  images: PropertyImage[];
  showThumbnails?: boolean;
  autoPlay?: boolean;
  interval?: number;
}

export const PropertyImageCarousel: React.FC<PropertyImageCarouselProps> = ({
  images,
  showThumbnails = true,
  autoPlay = false,
  interval = 5000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, images.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-2">🏠</div>
          <p className="text-gray-400">No images available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl">
      {/* Main Image */}
      <div className="relative w-full h-full">
        <img
          src={images[currentIndex].viewableUrl}
          alt={`Property image ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-500"
        />

        {/* Image Count Indicator */}
        <div className="absolute bottom-4 right-4 bg-black/60 text-white text-sm font-semibold px-3 py-1 rounded-full backdrop-blur-sm">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white text-gray-800 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white text-gray-800 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {showThumbnails && images.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex justify-center gap-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                  index === currentIndex
                    ? "border-blue-500 scale-110 shadow-lg"
                    : "border-transparent hover:border-gray-300"
                }`}
              >
                <img
                  src={image.viewableUrl}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Dots Indicator */}
      {!showThumbnails && images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-white scale-125"
                  : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
