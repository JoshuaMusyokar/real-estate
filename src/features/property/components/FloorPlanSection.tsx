import React, { useState, useRef, useEffect } from "react";
import {
  Maximize2,
  X,
  ZoomIn,
  ZoomOut,
  Download,
  ChevronLeft,
  ChevronRight,
  Grid3x3,
} from "lucide-react";

interface PropertyImage {
  url: string;
  order: number | null;
  caption: string | null;
  isFloorPlan: boolean | null;
  key: string | null;
  isCover: boolean | null;
}

interface FloorPlanSectionProps {
  images: PropertyImage[];
}

export const FloorPlanSection: React.FC<FloorPlanSectionProps> = ({
  images,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [zoomLevel, setZoomLevel] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;

      if (e.key === "Escape") {
        handleClose();
      } else if (e.key === "ArrowLeft") {
        handlePrevious();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImageIndex]);

  // Filter only floor plan images and sort by order
  const floorPlanImages = images
    .filter((img) => img.isFloorPlan === true)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  // Don't render if no floor plans
  if (floorPlanImages.length === 0) {
    return null;
  }

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setZoomLevel(1);
  };

  const handleClose = () => {
    setSelectedImageIndex(null);
    setZoomLevel(1);
  };

  const handlePrevious = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
      setZoomLevel(1);
    }
  };

  const handleNext = () => {
    if (
      selectedImageIndex !== null &&
      selectedImageIndex < floorPlanImages.length - 1
    ) {
      setSelectedImageIndex(selectedImageIndex + 1);
      setZoomLevel(1);
    }
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleDownload = async (imageUrl: string, index: number) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `floor-plan-${index + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  // Carousel navigation
  const scrollToSlide = (index: number) => {
    if (carouselRef.current) {
      const slideWidth = carouselRef.current.offsetWidth;
      carouselRef.current.scrollTo({
        left: slideWidth * index,
        behavior: "smooth",
      });
      setCurrentSlide(index);
    }
  };

  const handleCarouselPrev = () => {
    if (currentSlide > 0) {
      scrollToSlide(currentSlide - 1);
    }
  };

  const handleCarouselNext = () => {
    if (currentSlide < floorPlanImages.length - 1) {
      scrollToSlide(currentSlide + 1);
    }
  };

  // Handle scroll event to update current slide
  const handleScroll = () => {
    if (carouselRef.current) {
      const slideWidth = carouselRef.current.offsetWidth;
      const scrollLeft = carouselRef.current.scrollLeft;
      const newSlide = Math.round(scrollLeft / slideWidth);
      setCurrentSlide(newSlide);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Section Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-lg">
              <Grid3x3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Floor Plans</h2>
              <p className="text-purple-100 text-sm mt-0.5">
                {floorPlanImages.length}{" "}
                {floorPlanImages.length === 1 ? "layout" : "layouts"} available
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Carousel/Slider */}
      <div className="relative px-6 py-8 bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Navigation Buttons */}
        {currentSlide > 0 && (
          <button
            onClick={handleCarouselPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-100 shadow-xl p-3 rounded-full transition-all duration-300 hover:scale-110"
            aria-label="Previous floor plan"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
        )}

        {currentSlide < floorPlanImages.length - 1 && (
          <button
            onClick={handleCarouselNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-100 shadow-xl p-3 rounded-full transition-all duration-300 hover:scale-110"
            aria-label="Next floor plan"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        )}

        {/* Carousel Container */}
        <div
          ref={carouselRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {floorPlanImages.map((image, index) => (
            <div
              key={image.key || index}
              className="flex-shrink-0 w-full snap-center px-4"
            >
              <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                  {/* Image Container */}
                  <div className="lg:w-3/5 relative bg-gray-50">
                    <div className="aspect-[16/10] relative group">
                      <img
                        src={image.url}
                        alt={image.caption || `Floor Plan ${index + 1}`}
                        className="w-full h-full object-contain p-6 cursor-pointer transition-transform duration-300 group-hover:scale-105"
                        onClick={() => handleImageClick(index)}
                      />

                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                        <button
                          onClick={() => handleImageClick(index)}
                          className="bg-white text-purple-600 px-6 py-3 rounded-full font-semibold flex items-center gap-2 shadow-xl hover:bg-purple-600 hover:text-white transition-all transform hover:scale-105"
                        >
                          <Maximize2 className="w-5 h-5" />
                          View Full Size
                        </button>
                      </div>

                      {/* Plan Number Badge */}
                      <div className="absolute top-4 left-4 bg-purple-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                        Plan {index + 1} of {floorPlanImages.length}
                      </div>
                    </div>
                  </div>

                  {/* Details Container */}
                  <div className="lg:w-2/5 p-8 flex flex-col justify-center bg-white">
                    <div className="mb-6">
                      <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-bold mb-4">
                        <Grid3x3 className="w-4 h-4" />
                        Floor Plan
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {image.caption || `Layout ${index + 1}`}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        Detailed architectural floor plan showing the complete
                        layout, room dimensions, and spatial arrangement of this
                        property.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <button
                        onClick={() => handleImageClick(index)}
                        className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
                      >
                        <Maximize2 className="w-5 h-5" />
                        View in Full Screen
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(image.url, index);
                        }}
                        className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-semibold transition-all"
                      >
                        <Download className="w-5 h-5" />
                        Download Plan
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dot Indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {floorPlanImages.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                currentSlide === index
                  ? "w-8 h-3 bg-purple-600"
                  : "w-3 h-3 bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to floor plan ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImageIndex !== null && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-colors z-10"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Controls Bar */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-3 z-10">
            <button
              onClick={handleZoomOut}
              disabled={zoomLevel <= 0.5}
              className="text-white hover:bg-white/20 p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-5 h-5" />
            </button>

            <span className="text-white font-semibold min-w-[60px] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>

            <button
              onClick={handleZoomIn}
              disabled={zoomLevel >= 3}
              className="text-white hover:bg-white/20 p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-5 h-5" />
            </button>

            <div className="w-px h-6 bg-white/30 mx-2" />

            <button
              onClick={() =>
                handleDownload(
                  floorPlanImages[selectedImageIndex].url,
                  selectedImageIndex
                )
              }
              className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
              aria-label="Download"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md rounded-full px-6 py-2 z-10">
            <span className="text-white font-semibold">
              {selectedImageIndex + 1} / {floorPlanImages.length}
            </span>
          </div>

          {/* Navigation Buttons */}
          {selectedImageIndex > 0 && (
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-4 rounded-full transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {selectedImageIndex < floorPlanImages.length - 1 && (
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-4 rounded-full transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Main Image */}
          <div className="max-w-[90vw] max-h-[85vh] overflow-auto">
            <img
              src={floorPlanImages[selectedImageIndex].url}
              alt={
                floorPlanImages[selectedImageIndex].caption ||
                `Floor Plan ${selectedImageIndex + 1}`
              }
              className="transition-transform duration-300"
              style={{ transform: `scale(${zoomLevel})` }}
            />
          </div>

          {/* Caption */}
          {floorPlanImages[selectedImageIndex].caption && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md rounded-lg px-6 py-3 max-w-2xl">
              <p className="text-white text-center font-medium">
                {floorPlanImages[selectedImageIndex].caption}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
