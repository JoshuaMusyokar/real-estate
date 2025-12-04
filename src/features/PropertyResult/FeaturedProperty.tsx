/* eslint-disable @typescript-eslint/no-unused-vars */

import React from "react";
import { Link } from "react-router-dom";
import { MapPin, BedDouble, Bath, Square, Star } from "lucide-react";
import type { Property } from "../../types/property";
import { formatPrice } from "../../utils/formatter";

interface CompactFeaturedPropertyCardProps {
  property: Property;
  showFavorite?: boolean;
  showBadges?: boolean;
  imageHeight?: string;
}

export const CompactFeaturedPropertyCard: React.FC<
  CompactFeaturedPropertyCardProps
> = ({
  property,
  showFavorite = false,
  showBadges = true,
  imageHeight = "h-40",
}) => {
  const {
    id,
    title,
    price,
    currency,
    priceNegotiable,
    propertyType,
    bedrooms,
    bathrooms,
    squareFeet,
    locality,
    city,
    featured,
    verified,
    images,
    slug,
  } = property;

  const formattedPrice = formatPrice(price, currency);
  const coverImage = images?.[0]?.viewableUrl;

  return (
    <Link
      to={`/property-detail/${id}`}
      className="block group w-full"
      target="_blank"
    >
      <div className="relative bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200">
        {/* Image Container - Ultra Compact */}
        <div className={`relative ${imageHeight} overflow-hidden`}>
          {coverImage ? (
            <img
              src={coverImage}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
            </div>
          )}

          {/* Compact Badges */}
          {showBadges && (
            <div className="absolute top-1 left-1 flex gap-1">
              {featured && (
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                  ⭐
                </div>
              )}
              {verified && (
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                  ✓
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content - Ultra Compact */}
        <div className="p-2 space-y-1.5">
          {/* Price Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-gray-900">
                {formattedPrice.split(" ")[0]}
              </span>
              <span className="text-[10px] text-gray-500">
                {formattedPrice.split(" ").slice(1).join(" ")}
              </span>
            </div>
            {priceNegotiable && (
              <span className="text-[10px] text-green-600 font-medium bg-green-50 px-1 py-0.5 rounded">
                Negotiable
              </span>
            )}
          </div>

          {/* Title - Single Line */}
          <h3 className="text-xs font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
            {title}
          </h3>

          {/* Location - Compact */}
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
            <span className="text-[11px] text-gray-600 truncate">
              {locality.split(",")[0]}
            </span>
          </div>

          {/* Specs - Minimal */}
          <div className="flex items-center gap-3 pt-1">
            {bedrooms && (
              <div className="flex items-center gap-1">
                <BedDouble className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-700 font-medium">
                  {bedrooms}
                </span>
              </div>
            )}
            {bathrooms && (
              <div className="flex items-center gap-1">
                <Bath className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-700 font-medium">
                  {bathrooms}
                </span>
              </div>
            )}
            {squareFeet && (
              <div className="flex items-center gap-1">
                <Square className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-700 font-medium">
                  {squareFeet > 1000
                    ? `${(squareFeet / 1000).toFixed(0)}k`
                    : squareFeet}
                </span>
              </div>
            )}
          </div>

          {/* Property Type Tag */}
          <div className="pt-1">
            <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {propertyType.charAt(0) + propertyType.slice(1).toLowerCase()}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

// Ultra Thin Carousel Container
export const FeaturedPropertiesCarousel: React.FC<{
  properties: Property[];
  title?: string;
  showControls?: boolean;
}> = ({ properties, title, showControls = false }) => {
  return (
    <div className="py-1 px-0">
      {title && (
        <div className="mb-2 px-2">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
            {title}
          </h3>
        </div>
      )}

      <div className="relative">
        <div className="flex gap-2 overflow-x-auto pb-1 px-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {properties.map((property) => (
            <div key={property.id} className="flex-shrink-0 w-48">
              <CompactFeaturedPropertyCard
                property={property}
                imageHeight="h-32"
                showBadges={true}
              />
            </div>
          ))}
        </div>

        {showControls && properties.length > 3 && (
          <div className="flex justify-center gap-1 mt-2">
            <button className="p-1 text-gray-400 hover:text-gray-600">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button className="p-1 text-gray-400 hover:text-gray-600">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Even More Minimal Grid Version
export const CompactFeaturedGrid: React.FC<{
  properties: Property[];
  columns?: 2 | 3 | 4;
}> = ({ properties, columns = 3 }) => {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-2 p-1`}>
      {properties.map((property) => (
        <CompactFeaturedPropertyCard
          key={property.id}
          property={property}
          imageHeight="h-28"
          showBadges={false}
        />
      ))}
    </div>
  );
};

// Horizontal Scroll List (for very tight spaces)
export const CompactFeaturedList: React.FC<{
  properties: Property[];
}> = ({ properties }) => {
  return (
    <div className="space-y-1">
      {properties.map((property) => (
        <Link
          key={property.id}
          to={`/property/${property.slug}`}
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
        >
          <div className="flex-shrink-0 w-12 h-12 rounded overflow-hidden">
            {property.images?.[0]?.url ? (
              <img
                src={property.images[0].url}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 rounded"></div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-semibold text-gray-900 truncate">
                {formatPrice(property.price, property.currency).split(" ")[0]}
              </span>
              <span className="text-xs text-gray-500">
                {property.propertyType.charAt(0)}
              </span>
            </div>
            <div className="text-xs text-gray-600 truncate">
              {property.locality}
            </div>
          </div>

          {property.featured && (
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
          )}
        </Link>
      ))}
    </div>
  );
};
