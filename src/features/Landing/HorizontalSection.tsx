import React, { useRef } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
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
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -350 : 350;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // if (!properties || properties.length === 0) return null;

  return (
    <section className="py-12 bg-white">
      <div className="max-w-full mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div
              className={`p-4 rounded-2xl bg-gradient-to-r ${color} shadow-lg`}
            >
              {icon}
            </div>
            <div>
              <h2 className="text-3xl font-black text-gray-900">{title}</h2>
              <p className="text-gray-600 mt-1 font-medium">{description}</p>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll("left")}
              className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            {/* TODO: ENABLE LATER */}
            {/* <button className="flex items-center gap-2 px-5 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold transition-colors">
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </button> */}
          </div>
        </div>

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
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

          {/* Ad Banner Card */}
          {adBanner && (
            <div className="flex-shrink-0 w-[340px] bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl overflow-hidden relative group cursor-pointer hover:shadow-2xl transition-all duration-500">
              <div className="absolute inset-0">
                <img
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=600&fit=crop"
                  alt="Ad"
                  className="w-full h-full object-cover opacity-20 group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="relative h-full p-8 flex flex-col justify-center items-center text-center">
                <Sparkles className="w-16 h-16 text-white mb-4" />
                <h3 className="text-2xl font-black text-white mb-2">
                  List Your Property
                </h3>
                <p className="text-white/90 text-sm mb-6">
                  Get premium visibility for your listings
                </p>
                <button className="bg-white text-purple-600 px-6 py-3 rounded-2xl font-black hover:scale-105 transition-transform">
                  Start Now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
// CSS for hiding scrollbar
const styles = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`;
