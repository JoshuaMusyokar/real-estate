/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useRef, useEffect } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Bed,
  Bath,
  Maximize,
  Heart,
  Loader2,
} from "lucide-react";
import { useGetSimilarPropertiesQuery } from "../../../services/propertyApi";
import { Link } from "react-router-dom";
import type { ResCity, SimilarPropertiesResponse } from "../../../types";
import {
  formatCurrency,
  getCurrencySymbol,
} from "../../../utils/currency-utils";

interface SimilarPropertiesSectionProps {
  propertyId: string;
  currentPropertyTitle: string;
}

export const SimilarPropertiesSection: React.FC<
  SimilarPropertiesSectionProps
> = ({ propertyId, currentPropertyTitle }) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const { data, isLoading, error } = useGetSimilarPropertiesQuery({
    propertyId,
    limit: 10,
  });

  const updateScrollButtons = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener("scroll", updateScrollButtons);
      updateScrollButtons();
      return () => slider.removeEventListener("scroll", updateScrollButtons);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Similar Properties
          </h2>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !data?.data || data.data.length === 0) {
    return null;
  }

  const formatPrice = (price: number, currency: string): string => {
    if (price >= 1000000) {
      return `${getCurrencySymbol(currency)}${(price / 1000000).toFixed(2)}M`;
    }
    if (price >= 1000) {
      return `${getCurrencySymbol(currency)}${(price / 1000).toFixed(0)}K`;
    }
    return `${getCurrencySymbol(currency)}${price.toLocaleString()}`;
  };

  const properties = data.data;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
      {/* Header with Navigation */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Similar Properties
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Properties similar to "{currentPropertyTitle}"
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1 transition-colors"
          >
            View All
            <ChevronRight className="w-4 h-4" />
          </Link>

          {/* Navigation Arrows */}
          {properties.length > 2 && (
            <div className="flex items-center gap-2">
              <button
                onClick={scrollLeft}
                disabled={!canScrollLeft}
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                  canScrollLeft
                    ? "border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-600 hover:text-blue-600"
                    : "border-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={scrollRight}
                disabled={!canScrollRight}
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                  canScrollRight
                    ? "border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-600 hover:text-blue-600"
                    : "border-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Horizontal Slider */}
      <div className="relative">
        <div
          ref={sliderRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4 -mx-2 px-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {properties.map((property) => (
            <SimilarPropertyCard
              key={property.id}
              property={property}
              formatPrice={formatPrice}
            />
          ))}
        </div>

        {/* Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none" />
      </div>
    </div>
  );
};

/* SIMILAR PROPERTY CARD WITH POSTER ROLE PILL */
const SimilarPropertyCard = ({
  property,
  formatPrice,
}: {
  property: {
    id: string;
    title: string;
    price: number;
    city: ResCity;
    locality: string;
    propertyType: string;
    posterRole?: string;
    currency: string;
    purpose: string;
    bedrooms?: number;
    bathrooms?: number;
    squareFeet?: number;
    coverImage?: string;
    viewableCoverImage?: string;
    amenities: string[];
    isSaved: boolean;
  };
  formatPrice: (price: number, currency: string) => string;
}) => {
  // Determine poster role and styling
  const getPosterRole = () => {
    const role = property.posterRole?.toLowerCase() || "owner";
    const roleConfig = {
      owner: { label: "Owner", bg: "bg-green-100", text: "text-green-700" },
      agent: { label: "Agent", bg: "bg-blue-100", text: "text-blue-700" },
      builder: {
        label: "Builder",
        bg: "bg-purple-100",
        text: "text-purple-700",
      },
    };

    return roleConfig[role as keyof typeof roleConfig] || roleConfig.owner;
  };

  const posterRole = getPosterRole();

  return (
    <Link
      to={`/property-detail/${property.id}`}
      className="group flex-shrink-0 w-80 bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image Section */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        {property.coverImage ? (
          <img
            src={property.viewableCoverImage}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
            <span className="text-gray-400 font-semibold">No Image</span>
          </div>
        )}

        {/* Favorite Button */}
        <button
          className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all"
          onClick={(e) => {
            e.preventDefault();
            // Handle favorite toggle
          }}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              property.isSaved
                ? "fill-red-500 text-red-500"
                : "text-gray-600 hover:text-red-500"
            }`}
          />
        </button>

        {/* Price Badge */}
        <div className="absolute bottom-3 left-3 bg-black/70 text-white px-3 py-1.5 rounded-lg text-sm font-bold backdrop-blur-sm">
          {formatPrice(property.price, property.currency)}
        </div>

        {/* Poster Role Pill */}
        <div
          className={`absolute top-3 left-3 ${posterRole.bg} ${posterRole.text} px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border border-white/20`}
        >
          {posterRole.label}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
          {property.title}
        </h3>

        <p className="text-sm text-gray-600 mb-3 line-clamp-1">
          {property.locality}, {property.city.name}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-700 mb-3">
          {property.bedrooms && (
            <div className="flex items-center gap-1.5">
              <Bed className="w-4 h-4 text-gray-500" />
              <span className="font-medium">{property.bedrooms}</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center gap-1.5">
              <Bath className="w-4 h-4 text-gray-500" />
              <span className="font-medium">{property.bathrooms}</span>
            </div>
          )}
          {property.squareFeet && (
            <div className="flex items-center gap-1.5">
              <Maximize className="w-4 h-4 text-gray-500" />
              <span className="font-medium">
                {property.squareFeet.toLocaleString()} ft²
              </span>
            </div>
          )}
        </div>

        {/* Amenities Pills */}
        {property.amenities && property.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {property.amenities
              .slice(0, 2)
              .map((amenity: string, index: number) => (
                <span
                  key={index}
                  className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full border border-gray-200"
                >
                  {amenity}
                </span>
              ))}
            {property.amenities.length > 2 && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold border border-blue-200">
                +{property.amenities.length - 2}
              </span>
            )}
          </div>
        )}

        {/* CTA Arrow */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
            View Details
          </span>
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </Link>
  );
};

// Add this CSS to your global styles for hiding scrollbar
const scrollbarHide = `
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`;
