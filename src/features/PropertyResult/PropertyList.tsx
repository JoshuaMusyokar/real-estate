/* eslint-disable @typescript-eslint/no-unused-vars */
// components/PropertyList.tsx
import React from "react";
import { Home } from "lucide-react";
import type { PropertySearchFilters, Property } from "../../types";
import { PropertyCard } from "./PropertyResultCard";
import { AdCard } from "./AdCard";
import { zeroBrokerageData } from "../../constants";
import { ZeroBrokerageCard } from "./ZeroBrokarageCard";
import { FeaturedPropertiesCarousel } from "./FeaturedProperty";

interface PropertyListProps {
  filters: PropertySearchFilters;
  setFilters: React.Dispatch<React.SetStateAction<PropertySearchFilters>>;
  properties: Property[];
  isLoading: boolean;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  searchInput: string;
  favPropertiesIds: string[];
  onToggleFavorite: (propertyId: string) => void;
  onPageChange: (page: number) => void;
}

const sortOptions = [
  { value: "featured-desc", label: "Relevance" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "createdAt-desc", label: "Newest First" },
  { value: "viewCount-desc", label: "Most Popular" },
];

export const PropertyList: React.FC<PropertyListProps> = ({
  filters,
  setFilters,
  properties,
  isLoading,
  totalCount,
  currentPage,
  totalPages,
  searchInput,
  favPropertiesIds,
  onToggleFavorite,
  onPageChange,
}) => {
  const featuredProperties = properties.filter((p) => p.featured === true);
  return (
    <div className="w-full">
      {/* Results Header */}
      <div className="w-full bg-white border-b border-gray-200 sticky top-[120px] z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {filters.purpose === "SALE"
                  ? "Flats for Sale"
                  : filters.purpose === "RENT"
                  ? "Flats for Rent"
                  : "Properties"}
                {searchInput && ` in ${searchInput}`}
              </h1>
              <p className="text-gray-600">
                Showing{" "}
                {isLoading
                  ? "..."
                  : `${(currentPage - 1) * 30 + 1} - ${Math.min(
                      currentPage * 30,
                      totalCount
                    )}`}{" "}
                of {totalCount}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split("-");
                  setFilters((prev) => ({
                    ...prev,
                    sortBy,
                    sortOrder: sortOrder as "asc" | "desc",
                  }));
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area with 2 Columns */}
      <div className="max-w-full mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Properties List */}
          <div className="flex-1 lg:w-[70%]">
            {/* ⭐️ NEW: Zero Brokerage Section */}
            {/* {zeroBrokerageData.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-extrabold text-gray-900 mb-4">
                  Zero Commission Projects around {searchInput || "your area"}
                </h2>
                <div className="flex overflow-x-scroll gap-4 pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {zeroBrokerageData.map((property) => (
                    <ZeroBrokerageCard key={property.id} property={property} />
                  ))}
                </div>
              </div>
            )} */}
            {/* {featuredProperties.length > 0 && (
              <div className="mb-8">
                <div className="flex overflow-x-scroll gap-4 pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  <FeaturedPropertiesCarousel
                    properties={featuredProperties}
                    title="Featured Properties"
                  />
                </div>
              </div>
            )} */}
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse"
                  >
                    <div className="flex">
                      <div className="w-64 h-48 bg-gray-200 flex-shrink-0" />
                      <div className="flex-1 p-4 space-y-3">
                        <div className="h-6 bg-gray-200 rounded w-1/4" />
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : properties.length > 0 ? (
              <div className="space-y-4">
                {properties.map((property, index) => (
                  <div
                    key={property.id}
                    className="animate-fadeIn"
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animationFillMode: "backwards",
                    }}
                  >
                    <PropertyCard
                      property={property}
                      isFavorite={favPropertiesIds.includes(property.id)}
                      onToggleFavorite={onToggleFavorite}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
                <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  No Properties Found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters to see more results
                </p>
                <button
                  onClick={() =>
                    setFilters({
                      status: "AVAILABLE",
                      sortBy: "createdAt",
                      sortOrder: "desc",
                    })
                  }
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all transform hover:scale-105"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {properties.length > 0 && totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-md"
                >
                  Previous
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange(pageNum)}
                      className={`px-4 py-2 rounded-lg transition-all hover:shadow-md transform hover:scale-105 ${
                        pageNum === currentPage
                          ? "bg-purple-600 text-white shadow-lg"
                          : "border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-md"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Right Column - Sticky Ad Section */}
          <div className="lg:w-[30%] hidden lg:block">
            <div className="sticky top-[180px] space-y-6">
              {/* Main Ad Card */}
              <div className="animate-slideInRight">
                <AdCard position={0} />
              </div>

              {/* Secondary Ad Card with delay */}
              <div
                className="animate-slideInRight"
                style={{
                  animationDelay: "200ms",
                  animationFillMode: "backwards",
                }}
              >
                <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 rounded-lg p-6 text-center shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                  <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Home className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    Find Your Dream Home
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Get personalized property recommendations
                  </p>
                  <button className="w-full px-6 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-all transform hover:scale-105 shadow-md">
                    Get Started
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-slideInRight {
          animation: slideInRight 0.6s ease-out;
        }
        .scrollbar-thin {
          scrollbar-width: thin;
          scrollbar-color: #d1d5db #f3f4f6;
        }
        .scrollbar-thin::-webkit-scrollbar {
          height: 8px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 10px;
          border: 2px solid #f3f4f6;
        }
      `}</style>
    </div>
  );
};
