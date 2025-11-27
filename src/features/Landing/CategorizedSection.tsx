import { useState } from "react";
import { ChevronRight, Star, Sparkles, Crown, TrendingUp } from "lucide-react";
import type { CategorizedProperty } from "../../types";
import { CategorizedPropertyCard } from "./CategorizedPropertyCard";

interface CategorizedProperties {
  featured: CategorizedProperty[];
  recent: CategorizedProperty[];
  luxury: CategorizedProperty[];
  affordable: CategorizedProperty[];
}
interface CategorizedPropertySectionProps {
  categorizedProperties: CategorizedProperties;
  isLoading?: boolean;
}

const categoryConfig = {
  featured: {
    title: "⭐ Featured Properties",
    icon: Sparkles,
    gradient: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-50 to-pink-50",
    description: "Hand-picked exclusive listings",
  },
  luxury: {
    title: "Luxury Collection",
    icon: Crown,
    gradient: "from-amber-500 to-orange-500",
    bgGradient: "from-amber-50 to-orange-50",
    description: "Premium high-end properties",
  },
  recent: {
    title: "Recently Added",
    icon: TrendingUp,
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-50 to-cyan-50",
    description: "Fresh market entries",
  },
  affordable: {
    title: "Great Value",
    icon: Star,
    gradient: "from-green-500 to-emerald-500",
    bgGradient: "from-green-50 to-emerald-50",
    description: "Budget-friendly options",
  },
};

export const CategorizedPropertySection = ({
  categorizedProperties,
  isLoading = false,
}: CategorizedPropertySectionProps) => {
  const [activeCategory, setActiveCategory] =
    useState<keyof CategorizedProperties>("featured");

  if (isLoading) {
    return <CategorizedPropertiesSkeleton />;
  }

  // Check if we have any properties to show
  const hasProperties = Object.values(categorizedProperties).some(
    (category) => category && category.length > 0
  );

  if (!hasProperties) {
    return null;
  }

  return (
    <section className="py-6 bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
            Explore handpicked properties tailored to different needs and
            preferences
          </p>
        </div>

        {/* Category Navigation */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {(
            Object.keys(categoryConfig) as Array<keyof CategorizedProperties>
          ).map((category) => {
            const config = categoryConfig[category];
            const properties = categorizedProperties[category];

            if (!properties || properties.length === 0) return null;

            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`relative group px-6 py-4 rounded-2xl font-bold transition-all duration-500 ${
                  activeCategory === category
                    ? `bg-gradient-to-r ${config.gradient} text-white shadow-2xl scale-105`
                    : "bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-xl border-2 border-gray-200 hover:border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <config.icon
                    className={`w-5 h-5 ${
                      activeCategory === category
                        ? "text-white"
                        : `text-${config.gradient.split("-")[1]}-500`
                    }`}
                  />
                  <span>{config.title}</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-black ${
                      activeCategory === category
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {properties.length}
                  </span>
                </div>

                {/* Active indicator */}
                {activeCategory === category && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-current rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Category Section */}
        {(
          Object.keys(categorizedProperties) as Array<
            keyof CategorizedProperties
          >
        ).map((category) => {
          // const config = categoryConfig[category];
          const properties = categorizedProperties[category];

          if (
            !properties ||
            properties.length === 0 ||
            activeCategory !== category
          )
            return null;

          return (
            <div key={category} className="animate-fade-in">
              {/* Category Header */}
              <div className="flex items-center justify-between mb-8">
                <button className="group flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 font-bold hover:gap-3 transition-all">
                  View All
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Properties Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {properties.slice(0, 8).map((property, index) => (
                  <CategorizedPropertyCard
                    key={property.id}
                    property={property}
                    category={category}
                    index={index}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

// Skeleton Loader
const CategorizedPropertiesSkeleton = () => (
  <section className="py-16 bg-gradient-to-br from-slate-50 via-white to-blue-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <div className="inline-flex px-4 py-2 bg-gray-200 rounded-2xl mb-6 animate-pulse w-32 h-8 mx-auto" />
        <div className="h-12 bg-gray-200 rounded-xl mb-4 max-w-md mx-auto animate-pulse" />
        <div className="h-6 bg-gray-200 rounded-lg max-w-lg mx-auto animate-pulse" />
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-32 h-12 bg-gray-200 rounded-2xl animate-pulse"
          />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="bg-white rounded-3xl border-2 border-gray-200 overflow-hidden animate-pulse"
          >
            <div className="h-48 bg-gray-200" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-6 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
