import { useState, useEffect } from "react";
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

  const ITEMS_PER_VIEW = 8;
  const totalSlides = Math.ceil(amenities.length / ITEMS_PER_VIEW);
  const canScroll = amenities.length > ITEMS_PER_VIEW;

  const slides: Amenity[][] = [];
  for (let i = 0; i < amenities.length; i += ITEMS_PER_VIEW)
    slides.push(amenities.slice(i, i + ITEMS_PER_VIEW));

  const nextSlide = () => setCurrentIndex((p) => (p + 1) % totalSlides);
  const prevSlide = () =>
    setCurrentIndex((p) => (p - 1 + totalSlides) % totalSlides);

  useEffect(() => {
    if (!canScroll) return;
    const t = setInterval(nextSlide, 5000);
    return () => clearInterval(t);
  }, [canScroll, totalSlides]);

  const Header = ({ showAllMode }: { showAllMode: boolean }) => (
    <div className="flex items-center justify-between mb-4 sm:mb-5">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-200 flex-shrink-0">
          <Sparkles className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
        </div>
        <div>
          <h2 className="text-sm sm:text-base font-bold text-gray-900">
            {showAllMode ? "All Amenities" : "Amenities"}
          </h2>
          <p className="text-[11px] text-gray-400">
            {amenities.length} features
            {!showAllMode && canScroll
              ? ` · ${currentIndex + 1}/${totalSlides}`
              : ""}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {!showAllMode && canScroll && (
          <>
            <button
              onClick={prevSlide}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border border-blue-100 flex items-center justify-center hover:bg-blue-50 transition-colors shadow-sm"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-blue-500" />
            </button>
            <button
              onClick={nextSlide}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border border-blue-100 flex items-center justify-center hover:bg-blue-50 transition-colors shadow-sm"
            >
              <ChevronRight className="w-3.5 h-3.5 text-blue-500" />
            </button>
          </>
        )}
        <button
          onClick={() => setShowAll((s) => !s)}
          className="flex items-center gap-1 px-2.5 py-1.5 text-blue-600 hover:text-blue-700 text-[11px] font-semibold transition-colors rounded-lg hover:bg-blue-50"
        >
          {showAllMode ? (
            <>
              <ChevronUp className="w-3 h-3" /> Less
            </>
          ) : (
            <>
              <ChevronDown className="w-3 h-3" /> All
            </>
          )}
        </button>
      </div>
    </div>
  );

  if (showAll) {
    return (
      <div className="bg-white border border-blue-100 rounded-xl p-4 sm:p-5">
        <Header showAllMode />
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-2.5">
          {amenities.map((a) => (
            <AmenityCard key={a.id} amenity={a} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-blue-100 rounded-xl p-4 sm:p-5">
      <Header showAllMode={false} />

      {/* Carousel slide */}
      <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-2 sm:gap-2.5">
        {slides[currentIndex]?.map((a) => (
          <AmenityCard key={a.id} amenity={a} />
        ))}
      </div>

      {/* Dots */}
      {canScroll && totalSlides > 1 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? "w-5 bg-blue-600" : "w-1.5 bg-gray-200 hover:bg-blue-300"}`}
            />
          ))}
        </div>
      )}

      {amenities.length > ITEMS_PER_VIEW && (
        <div className="mt-3 text-center">
          <button
            onClick={() => setShowAll(true)}
            className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-1 transition-colors"
          >
            View all {amenities.length} amenities{" "}
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};

const AmenityCard = ({ amenity }: { amenity: Amenity }) => {
  const isImage =
    amenity.icon?.startsWith("/") || amenity.icon?.startsWith("http");
  return (
    <div className="group flex flex-col items-center p-2 sm:p-2.5 bg-blue-50/60 hover:bg-blue-100/60 border border-blue-100 hover:border-blue-300 rounded-xl transition-all duration-200 text-center cursor-default">
      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white border border-blue-100 rounded-lg flex items-center justify-center mb-1.5 group-hover:shadow-sm transition-shadow flex-shrink-0">
        {amenity.icon ? (
          isImage ? (
            <img
              src={amenity.icon}
              alt={amenity.name}
              className="w-4 h-4 object-contain"
            />
          ) : (
            <span className="text-base">{amenity.icon}</span>
          )
        ) : (
          <Check className="w-3.5 h-3.5 text-blue-600" />
        )}
      </div>
      <span className="text-[10px] sm:text-[11px] font-medium text-gray-700 leading-tight line-clamp-2">
        {amenity.name}
      </span>
    </div>
  );
};
