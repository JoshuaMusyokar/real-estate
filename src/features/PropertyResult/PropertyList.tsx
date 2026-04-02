import React from "react";
import { Home } from "lucide-react";
import type { PropertySearchFilters, Property } from "../../types";
import { PropertyCard } from "./PropertyResultCard";
import { AdCard } from "./AdCard";

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

export const PropertyList: React.FC<PropertyListProps> = ({
  setFilters,
  properties,
  isLoading,
  totalCount,
  currentPage,
  totalPages,
  favPropertiesIds,
  onPageChange,
}) => {
  const totalLabel = isLoading
    ? "Loading…"
    : `${totalCount} result${totalCount !== 1 ? "s" : ""}`;

  return (
    <div className="w-full">
      {/* ── Main content ───────────────────────────────────────────────── */}
      <div className="max-w-full mx-auto px-3 sm:px-5 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Left — property list */}
          <div className="flex-1 lg:w-[70%] min-w-0">
            {/* Result count */}
            <p className="text-[10px] sm:text-xs text-gray-400 font-medium mb-2 sm:mb-3">
              {totalLabel}
            </p>

            {/* Loading skeletons */}
            {isLoading ? (
              <div className="space-y-3 sm:space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="bg-white border border-blue-100 rounded-xl sm:rounded-2xl overflow-hidden animate-pulse"
                  >
                    <div className="flex">
                      <div className="w-24 sm:w-56 lg:w-64 h-32 sm:h-48 bg-blue-50 flex-shrink-0" />
                      <div className="flex-1 p-3 sm:p-4 space-y-2 sm:space-y-3">
                        <div className="h-4 sm:h-5 bg-blue-100 rounded w-1/4" />
                        <div className="h-3 sm:h-4 bg-blue-50 rounded w-3/4" />
                        <div className="h-3 bg-blue-50 rounded w-1/2" />
                        <div className="flex gap-2 mt-2">
                          {[1, 2, 3].map((j) => (
                            <div
                              key={j}
                              className="w-14 h-5 bg-blue-50 rounded-md"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : /* Properties */
            properties.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {properties.map((property, index) => (
                  <div
                    key={property.id}
                    className="animate-fadeIn"
                    style={{
                      animationDelay: `${index * 40}ms`,
                      animationFillMode: "backwards",
                    }}
                  >
                    <PropertyCard
                      property={property}
                      isFavorite={favPropertiesIds.includes(property.id)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              /* Empty state */
              <div className="text-center py-16 sm:py-24 bg-white rounded-xl sm:rounded-2xl border border-blue-100">
                <div className="w-14 h-14 sm:w-20 sm:h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Home className="w-7 h-7 sm:w-10 sm:h-10 text-blue-300" />
                </div>
                <h3 className="text-base sm:text-xl font-black text-gray-900 mb-2">
                  No Properties Found
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 mb-5 sm:mb-6">
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
                  className="px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-lg sm:rounded-xl transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {properties.length > 0 && totalPages > 1 && (
              <div className="flex justify-center items-center gap-1.5 sm:gap-2 mt-6 sm:mt-8">
                <button
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-semibold"
                >
                  ← Prev
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let p: number;
                  if (totalPages <= 5) p = i + 1;
                  else if (currentPage <= 3) p = i + 1;
                  else if (currentPage >= totalPages - 2)
                    p = totalPages - 4 + i;
                  else p = currentPage - 2 + i;
                  return (
                    <button
                      key={p}
                      onClick={() => onPageChange(p)}
                      className={`
                        w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-xs sm:text-sm font-bold transition-colors
                        ${
                          p === currentPage
                            ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                            : "border border-blue-200 text-blue-600 hover:bg-blue-50"
                        }
                      `}
                    >
                      {p}
                    </button>
                  );
                })}

                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-semibold"
                >
                  Next →
                </button>
              </div>
            )}
          </div>

          {/* Right — sticky sidebar */}
          <div className="lg:w-[30%] hidden lg:block flex-shrink-0">
            <div className="sticky top-4 md:top-[160px] space-y-4">
              <AdCard position={0} />

              {/* Secondary promo card */}
              <div className="rounded-2xl bg-white border border-blue-100 p-5 shadow-sm">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mb-3">
                  <Home className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-black text-gray-900 text-sm mb-1">
                  Get Personalised Picks
                </h3>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                  Tell us what you're looking for and we'll send matching
                  properties straight to you.
                </p>
                <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors">
                  Find My Match
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
      `}</style>
    </div>
  );
};
