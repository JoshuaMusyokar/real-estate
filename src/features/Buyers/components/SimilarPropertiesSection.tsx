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
import type { PropertyType, ResCity } from "../../../types";
import { getCurrencySymbol } from "../../../utils/currency-utils";

interface SimilarPropertiesSectionProps {
  propertyId: string;
  currentPropertyTitle: string;
}

const formatPrice = (price: number, currency: string) => {
  const sym = getCurrencySymbol(currency);
  if (price >= 1_000_000) return `${sym}${(price / 1_000_000).toFixed(2)}M`;
  if (price >= 1_000) return `${sym}${(price / 1_000).toFixed(0)}K`;
  return `${sym}${price.toLocaleString()}`;
};

export const SimilarPropertiesSection: React.FC<
  SimilarPropertiesSectionProps
> = ({ propertyId, currentPropertyTitle }) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const { data, isLoading, error } = useGetSimilarPropertiesQuery({
    propertyId,
    limit: 10,
  });

  const updateScroll = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setCanLeft(scrollLeft > 0);
    setCanRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScroll);
    updateScroll();
    return () => el.removeEventListener("scroll", updateScroll);
  }, [data]);

  if (isLoading)
    return (
      <div className="bg-white border border-blue-100 rounded-xl p-4 sm:p-5">
        <div className="text-sm font-bold text-gray-900 mb-4">
          Similar Properties
        </div>
        <div className="flex justify-center py-8">
          <div className="w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );

  if (error || !data?.data?.length) return null;

  const properties = data.data;

  return (
    <div className="bg-white border border-blue-100 rounded-xl p-4 sm:p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-gray-900">
            Similar Properties
          </h2>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Similar to "{currentPropertyTitle}"
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
          >
            View All <ChevronRight className="w-3 h-3" />
          </Link>
          {properties.length > 2 && (
            <div className="flex items-center gap-1">
              {[
                {
                  dir: "left",
                  can: canLeft,
                  action: () =>
                    sliderRef.current?.scrollBy({
                      left: -280,
                      behavior: "smooth",
                    }),
                  Icon: ChevronLeft,
                },
                {
                  dir: "right",
                  can: canRight,
                  action: () =>
                    sliderRef.current?.scrollBy({
                      left: 280,
                      behavior: "smooth",
                    }),
                  Icon: ChevronRight,
                },
              ].map(({ dir, can, action, Icon }) => (
                <button
                  key={dir}
                  onClick={action}
                  disabled={!can}
                  className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all
                      ${can ? "border-blue-200 hover:border-blue-400 hover:bg-blue-50 text-blue-500" : "border-gray-100 text-gray-300 cursor-not-allowed"}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Slider */}
      <div className="relative">
        <div
          ref={sliderRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth pb-2 -mx-1 px-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {properties.map((p) => (
            <SimilarCard key={p.id} property={p} />
          ))}
        </div>
        <div className="absolute left-0 top-0 bottom-2 w-6 bg-gradient-to-r from-white to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-2 w-6 bg-gradient-to-l from-white to-transparent pointer-events-none" />
      </div>
    </div>
  );
};

const POSTER_ROLE: Record<string, { label: string; cls: string }> = {
  owner: {
    label: "Owner",
    cls: "bg-emerald-50 text-emerald-700 border-emerald-100",
  },
  agent: { label: "Agent", cls: "bg-blue-50 text-blue-700 border-blue-100" },
  builder: {
    label: "Builder",
    cls: "bg-indigo-50 text-indigo-700 border-indigo-100",
  },
};

const SimilarCard = ({
  property,
}: {
  property: {
    id: string;
    title: string;
    price: number;
    city: ResCity;
    locality: string;
    propertyType: PropertyType;
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
}) => {
  const role =
    POSTER_ROLE[(property.posterRole || "owner").toLowerCase()] ||
    POSTER_ROLE.owner;

  return (
    <Link
      to={`/property-detail/${property.id}`}
      className="group flex-shrink-0 w-60 sm:w-72 bg-white border border-gray-100 hover:border-blue-200 hover:shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
    >
      {/* Image */}
      <div className="relative h-36 sm:h-40 bg-blue-50 overflow-hidden">
        {property.coverImage ? (
          <img
            src={property.viewableCoverImage}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-blue-200 text-xs font-semibold">
            No Image
          </div>
        )}

        {/* Heart */}
        <button
          className="absolute top-2.5 right-2.5 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
          onClick={(e) => e.preventDefault()}
        >
          <Heart
            className={`w-3.5 h-3.5 ${property.isSaved ? "fill-red-500 text-red-500" : "text-gray-400"}`}
          />
        </button>

        {/* Price */}
        <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded-lg text-[11px] font-black backdrop-blur-sm">
          {formatPrice(property.price, property.currency)}
        </div>

        {/* Role badge */}
        <div
          className={`absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${role.cls}`}
        >
          {role.label}
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight mb-1.5">
          {property.title}
        </h3>
        <p className="text-[11px] text-gray-400 mb-2 truncate">
          {property.locality}, {property.city.name}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-3 text-[11px] text-gray-600 mb-2">
          {property.bedrooms && (
            <span className="flex items-center gap-1">
              <Bed className="w-3 h-3 text-blue-400" /> {property.bedrooms}
            </span>
          )}
          {property.bathrooms && (
            <span className="flex items-center gap-1">
              <Bath className="w-3 h-3 text-blue-400" /> {property.bathrooms}
            </span>
          )}
          {property.squareFeet && (
            <span className="flex items-center gap-1">
              <Maximize className="w-3 h-3 text-blue-400" />{" "}
              {property.squareFeet.toLocaleString()}ft²
            </span>
          )}
        </div>

        {/* Amenity chips */}
        {property.amenities?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {property.amenities.slice(0, 2).map((a: string, i: number) => (
              <span
                key={i}
                className="text-[10px] bg-blue-50 text-blue-600 border border-blue-100 px-1.5 py-0.5 rounded-full"
              >
                {a}
              </span>
            ))}
            {property.amenities.length > 2 && (
              <span className="text-[10px] bg-gray-50 text-gray-500 border border-gray-200 px-1.5 py-0.5 rounded-full">
                +{property.amenities.length - 2}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-blue-50">
          <span className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">
            View Details
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </Link>
  );
};
