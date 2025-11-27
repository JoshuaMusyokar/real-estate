/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useRef, useEffect } from "react";
import {
  Building2,
  ChevronRight,
  ChevronLeft,
  Bed,
  Bath,
  Maximize,
  Loader2,
} from "lucide-react";
import { useGetPropertiesByOwnerQuery } from "../../../services/propertyApi";
import { Link, useNavigate } from "react-router-dom";
import type { Property } from "../../../types";
import { getCurrencySymbol } from "../../../utils/currency-utils";

interface OwnerPropertiesSectionProps {
  ownerId: string;
  ownerName: string;
  currentPropertyId: string;
}

export const OwnerPropertiesSlider: React.FC<OwnerPropertiesSectionProps> = ({
  ownerId,
  ownerName,
  currentPropertyId,
}) => {
  const navigate = useNavigate();
  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const { data, isLoading, error } = useGetPropertiesByOwnerQuery({
    ownerId,
    limit: 10,
    excludePropertyId: currentPropertyId,
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
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
              {ownerName.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                More from {ownerName}
              </h2>
              <p className="text-sm text-gray-600">Loading properties...</p>
            </div>
          </div>
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
      return `$${(price / 1000000).toFixed(2)}M`;
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
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
            {ownerName.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              More from {ownerName}
            </h2>
            <p className="text-sm text-gray-600">
              {data.pagination.total}{" "}
              {data.pagination.total === 1 ? "property" : "properties"}{" "}
              available
            </p>
          </div>
        </div>

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

      {/* Horizontal Slider */}
      <div className="relative">
        <div
          ref={sliderRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4 -mx-2 px-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {properties.map((property: Property) => (
            <PropertyCard
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

      {/* View All Button */}
      {data.pagination.total > properties.length && (
        <div className="text-center mt-6">
          <button
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all hover:shadow-md"
            onClick={() => navigate("/")}
          >
            <span>View All {data.pagination.total} Properties</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

/* HORIZONTAL PROPERTY CARD */
const PropertyCard = ({
  property,
  formatPrice,
}: {
  property: Property;
  formatPrice: (price: number, currency: string) => string;
}) => {
  return (
    <Link
      to={`/property-detail/${property.id}`}
      className="group flex-shrink-0 w-80 bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image Section */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        {property.images && property.images.length > 0 ? (
          <img
            src={property.images[0].viewableUrl}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
            <Building2 className="w-12 h-12 text-gray-400" />
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-semibold shadow-lg">
          {property.status}
        </div>

        {/* Price Overlay */}
        <div className="absolute bottom-3 left-3 bg-black/70 text-white px-3 py-1.5 rounded-lg text-sm font-bold backdrop-blur-sm">
          {formatPrice(property.price, property.currency)}
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
