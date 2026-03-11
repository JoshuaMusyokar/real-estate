// HorizontalScrollSection.tsx
import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CategorizedProperty } from "../../types";

interface HorizontalScrollSectionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  properties: CategorizedProperty[];
  CardComponent: React.ComponentType<any>;
  color: string;
  adBanner?: boolean;
}

export const HorizontalScrollSection: React.FC<
  HorizontalScrollSectionProps
> = ({
  title,
  description,
  icon,
  properties,
  CardComponent,
  color,
  adBanner,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    // On mobile cards are ~260px, on desktop ~300px; scroll by ~1.2 cards
    const amount = direction === "left" ? -300 : 300;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section className="py-6 sm:py-10 bg-white border-b border-blue-50">
      <div className="max-w-full mx-auto px-3 sm:px-5 lg:px-8">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
            {/* Gradient icon badge — smaller on mobile */}
            <div
              className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-r ${color} shadow-md flex-shrink-0`}
            >
              {icon}
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-xl lg:text-2xl font-black text-gray-900 leading-tight truncate">
                {title}
              </h2>
              {/* Description hidden on mobile — saves space */}
              <p className="text-xs sm:text-sm text-gray-400 mt-0.5 font-medium hidden sm:block truncate">
                {description}
              </p>
            </div>
          </div>

          {/* Scroll nav buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 ml-3">
            <button
              onClick={() => scroll("left")}
              className="p-1.5 sm:p-2.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 text-blue-600 rounded-lg sm:rounded-xl transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-1.5 sm:p-2.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 text-blue-600 rounded-lg sm:rounded-xl transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* ── Scroll container ────────────────────────────────────────────── */}
        <div
          ref={scrollRef}
          className="flex gap-3 sm:gap-4 overflow-x-auto pb-3 sm:pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {properties.map((property, index) => (
            <CardComponent
              key={property.id}
              property={property}
              index={index}
              color={color}
            />
          ))}
        </div>
      </div>

      <style>{`.no-sb::-webkit-scrollbar{display:none}`}</style>
    </section>
  );
};
