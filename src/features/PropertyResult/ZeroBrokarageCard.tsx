// components/ZeroBrokerageCard.tsx

import React from "react";
import { MapPin, Building2, Phone } from "lucide-react";

export interface ZeroBrokerageProperty {
  id: string;
  priceRange: string;
  title: string;
  propertyDetails: string; // e.g., "3, 4 BHK Flats"
  location: string; // e.g., "Sector 23 Rohini, N..."
  coverImageUrl: string;
  developerName: string;
  developerLogo: string;
  distanceKm: string;
  link: string;
}

interface ZeroBrokerageCardProps {
  property: ZeroBrokerageProperty;
}

export const ZeroBrokerageCard: React.FC<ZeroBrokerageCardProps> = ({
  property,
}) => {
  const {
    priceRange,
    title,
    propertyDetails,
    location,
    coverImageUrl,
    developerName,
    developerLogo,
    distanceKm,
    link,
  } = property;

  return (
    <div className="w-[300px] flex-shrink-0 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 relative">
      {/* Property Image */}
      <div className="relative h-48 bg-gray-100">
        <img
          src={coverImageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
        {/* Distance Badge */}
        <div className="absolute top-3 left-3 bg-gray-900/70 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
          {distanceKm} from
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Price Range */}
        <p className="text-xl font-bold text-gray-900 leading-tight">
          {priceRange}
        </p>

        {/* Title and Developer */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 truncate">
            {title}
          </h3>
          <p className="text-sm text-gray-500">{developerName}</p>
        </div>

        {/* Details */}
        <div className="flex items-center gap-4 text-xs text-gray-600 border-t border-gray-100 pt-3">
          <div className="flex items-center gap-1">
            <Building2 className="w-3 h-3 text-purple-600" />
            <span>{propertyDetails}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-purple-600" />
            <span className="truncate">{location}</span>
          </div>
        </div>

        {/* Developer Info and Contact Button */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-yellow-500 text-white font-bold text-sm flex-shrink-0">
              {/* Using first letters for logo substitute */}
              {developerLogo}
            </div>
            <span className="text-sm text-gray-700 font-medium hidden md:inline">
              {developerName}
            </span>
          </div>
          <a
            href={link}
            className="flex items-center gap-1 px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600 transition-colors shadow-md"
          >
            <Phone className="w-4 h-4" />
            Contact
          </a>
        </div>
      </div>
    </div>
  );
};
