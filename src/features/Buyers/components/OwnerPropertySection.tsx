// OwnerPropertySection.tsx  (OwnerPropertiesSlider)
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

const formatPrice = (price: number, currency: string) => {
  const sym = getCurrencySymbol(currency);
  if (price >= 1_000_000) return `${sym}${(price / 1_000_000).toFixed(2)}M`;
  if (price >= 1_000) return `${sym}${(price / 1_000).toFixed(0)}K`;
  return `${sym}${price.toLocaleString()}`;
};

export const OwnerPropertiesSlider: React.FC<OwnerPropertiesSectionProps> = ({
  ownerId,
  ownerName,
  currentPropertyId,
}) => {
  const navigate = useNavigate();
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const { data, isLoading, error } = useGetPropertiesByOwnerQuery({
    ownerId,
    limit: 10,
    excludePropertyId: currentPropertyId,
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
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-sm font-black flex-shrink-0 shadow-md shadow-blue-200">
            {ownerName.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">
              More from {ownerName}
            </p>
            <p className="text-[11px] text-gray-400">Loading…</p>
          </div>
        </div>
        <div className="flex justify-center py-6">
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
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-sm font-black flex-shrink-0 shadow-md shadow-blue-200">
            {ownerName.charAt(0)}
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-gray-900">
              More from {ownerName}
            </h2>
            <p className="text-[11px] text-gray-400">
              {data.pagination.total}{" "}
              {data.pagination.total === 1 ? "property" : "properties"}{" "}
              available
            </p>
          </div>
        </div>

        {properties.length > 2 && (
          <div className="flex items-center gap-1">
            {[
              {
                can: canLeft,
                act: () =>
                  sliderRef.current?.scrollBy({
                    left: -280,
                    behavior: "smooth",
                  }),
                Icon: ChevronLeft,
              },
              {
                can: canRight,
                act: () =>
                  sliderRef.current?.scrollBy({
                    left: 280,
                    behavior: "smooth",
                  }),
                Icon: ChevronRight,
              },
            ].map(({ can, act, Icon }, i) => (
              <button
                key={i}
                onClick={act}
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

      {/* Slider */}
      <div className="relative">
        <div
          ref={sliderRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth pb-2 -mx-1 px-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {properties.map((p: Property) => (
            <OwnerCard key={p.id} property={p} />
          ))}
        </div>
        <div className="absolute left-0 top-0 bottom-2 w-6 bg-gradient-to-r from-white to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-2 w-6 bg-gradient-to-l from-white to-transparent pointer-events-none" />
      </div>

      {/* View all */}
      {data.pagination.total > properties.length && (
        <div className="text-center mt-4">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-blue-200 text-blue-600 hover:bg-blue-50 rounded-xl text-xs font-bold transition-colors"
          >
            View All {data.pagination.total} Properties{" "}
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

const OwnerCard = ({ property }: { property: Property }) => (
  <Link
    to={`/property-detail/${property.slug}`}
    className="group flex-shrink-0 w-60 sm:w-72 bg-white border border-gray-100 hover:border-blue-200 hover:shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
  >
    {/* Image */}
    <div className="relative h-36 sm:h-40 bg-blue-50 overflow-hidden">
      {property.images?.length > 0 ? (
        <img
          src={property.images[0].viewableUrl}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Building2 className="w-10 h-10 text-blue-200" />
        </div>
      )}

      {/* Status */}
      <div className="absolute top-2.5 left-2.5 bg-emerald-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm">
        {property.status}
      </div>

      {/* Price */}
      <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded-lg text-[11px] font-black backdrop-blur-sm">
        {formatPrice(property.price, property.currency)}
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

      <div className="flex items-center justify-between pt-2 border-t border-blue-50">
        <span className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">
          View Details
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
      </div>
    </div>
  </Link>
);
