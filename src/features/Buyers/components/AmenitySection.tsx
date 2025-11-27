import { useState, useRef, useEffect } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { Amenity } from "../../../types";

interface AmenitiesSectionProps {
  amenities: Amenity[];
}

export const AmenitiesSection = ({ amenities }: AmenitiesSectionProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Carousel configuration
  const ITEMS_PER_VIEW = 8;
  const totalSlides = Math.ceil(amenities.length / ITEMS_PER_VIEW);
  const canScroll = amenities.length > ITEMS_PER_VIEW;

  // Group amenities into slides
  const slides = [];
  for (let i = 0; i < amenities.length; i += ITEMS_PER_VIEW) {
    slides.push(amenities.slice(i, i + ITEMS_PER_VIEW));
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Auto-advance carousel
  useEffect(() => {
    if (!canScroll) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [canScroll, totalSlides]);

  if (showAll) {
    return (
      <div className="bg-gradient-to-br from-white to-blue-50/30 border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">All Amenities</h2>
              <p className="text-sm text-gray-600">
                {amenities.length} features
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAll(false)}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ChevronUp className="w-4 h-4" />
            <span className="text-sm font-medium">Show Less</span>
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {amenities.map((amenity) => (
            <CompactAmenityCard key={amenity.id} amenity={amenity} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-blue-50/30 border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Amenities</h2>
            <p className="text-sm text-gray-600">
              {amenities.length} features • Slide {currentIndex + 1}/
              {totalSlides}
            </p>
          </div>
        </div>

        {/* Navigation */}
        {canScroll && (
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={nextSlide}
              className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        )}
      </div>

      {/* Carousel */}
      <div className="relative">
        <div
          ref={carouselRef}
          className="grid grid-cols-4 gap-3 transition-transform duration-500 ease-out"
        >
          {slides[currentIndex]?.map((amenity) => (
            <CompactAmenityCard key={amenity.id} amenity={amenity} />
          ))}
        </div>

        {/* Progress Dots */}
        {canScroll && totalSlides > 1 && (
          <div className="flex justify-center gap-1.5 mt-4">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-blue-600 w-6"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Show All Button */}
      {amenities.length > ITEMS_PER_VIEW && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowAll(true)}
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors group"
          >
            <span>View All {amenities.length} Amenities</span>
            <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
};

/* ULTRA-COMPACT AMENITY CARD */
const CompactAmenityCard = ({ amenity }: { amenity: Amenity }) => {
  const isImageIcon =
    amenity.icon?.startsWith("/") || amenity.icon?.startsWith("http");

  return (
    <div className="group relative bg-white rounded-lg p-2 border border-gray-100 hover:border-blue-300 hover:shadow-md transition-all duration-300 text-center">
      {/* Icon */}
      <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
        {amenity.icon ? (
          isImageIcon ? (
            <img
              src={amenity.icon}
              alt={amenity.name}
              className="w-4 h-4 object-contain"
            />
          ) : (
            <span className="text-lg">{amenity.icon}</span>
          )
        ) : (
          <Check className="w-4 h-4 text-blue-600" />
        )}
      </div>

      {/* Name */}
      <span className="text-xs font-medium text-gray-700 leading-tight line-clamp-2 group-hover:text-gray-900 transition-colors">
        {amenity.name}
      </span>

      {/* Active Indicator */}
      <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};
