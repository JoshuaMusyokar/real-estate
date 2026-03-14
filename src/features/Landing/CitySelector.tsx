import React, { useEffect, useRef, useState, useMemo } from "react";
import { MapPin, Search, X, ChevronDown } from "lucide-react";
import type { City } from "../../types";

interface CitySelectorProps {
  cities: City[];
  selectedCityId: string;
  selectedCityName: string;
  onCityChange: (cityId: string, cityName: string) => void;
  variant?: "pill" | "inline";
  maxHeight?: string;
  initialDisplayLimit?: number;
}

export const CitySelector: React.FC<CitySelectorProps> = ({
  cities,
  selectedCityId,
  selectedCityName,
  onCityChange,
  variant = "inline",
  maxHeight,
  initialDisplayLimit = 1000000, //TODO: increase this limit dynamically
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [displayCount, setDisplayCount] = useState(initialDisplayLimit);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Filter cities based on search query
  const filtered = useMemo(() => {
    if (!query.trim()) return cities;

    const searchTerm = query.toLowerCase().trim();
    return cities.filter(
      (c) =>
        c.name.toLowerCase().includes(searchTerm) ||
        (c.state ?? "").toLowerCase().includes(searchTerm) ||
        (c.country ?? "").toLowerCase().includes(searchTerm),
    );
  }, [cities, query]);

  // Sort cities: selected city first, then alphabetically
  const sortedFiltered = useMemo(() => {
    return [...filtered].sort((a, b) => {
      // Selected city first
      if (a.id === selectedCityId) return -1;
      if (b.id === selectedCityId) return 1;
      // Then alphabetically by name
      return a.name.localeCompare(b.name);
    });
  }, [filtered, selectedCityId]);

  // Limit displayed cities for performance, but show all when searching
  const displayedCities = useMemo(() => {
    if (query.trim()) {
      return sortedFiltered; // Show all when searching
    }
    return sortedFiltered.slice(0, displayCount);
  }, [sortedFiltered, displayCount, query]);

  const hasMore = !query.trim() && displayCount < sortedFiltered.length;

  // Focus search input when modal opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setDisplayCount(initialDisplayLimit); // Reset display count when opening
    }
  }, [open, initialDisplayLimit]);

  // Lock body scroll while modal open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      // Add padding to account for scrollbar disappearance
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [open]);

  // Handle scroll for infinite loading
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (hasMore && !query.trim()) {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      if (scrollHeight - scrollTop <= clientHeight * 1.5) {
        setDisplayCount((prev) => Math.min(prev + 50, sortedFiltered.length));
      }
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open]);

  const handleSelect = (city: City) => {
    onCityChange(city.id, city.name);
    setOpen(false);
    setQuery("");
  };

  const handleClose = () => {
    setOpen(false);
    setQuery("");
  };

  // Calculate responsive max height
  const getModalMaxHeight = () => {
    if (maxHeight) return maxHeight;

    // On mobile, use 85% of viewport height
    if (window.innerWidth < 640) {
      return "min(85vh, 600px)";
    }
    // On desktop, use 540px or 80% of viewport height, whichever is smaller
    return "min(540px, 80vh)";
  };

  // ── Trigger button ──────────────────────────────────────────────────────────
  const trigger =
    variant === "pill" ? (
      /* Pill — white bg, blue accents, subtle shadow, smaller on mobile */
      <button
        onClick={() => setOpen(true)}
        className="
          group flex items-center gap-1.5 sm:gap-2
          pl-2.5 sm:pl-3.5 pr-2 sm:pr-3 py-1.5 sm:py-2
          bg-white hover:bg-blue-50
          border border-blue-200 hover:border-blue-400
          rounded-full shadow-sm hover:shadow-md
          text-blue-700 font-semibold
          transition-all duration-200
          touch-manipulation
        "
        aria-label="Select city"
      >
        <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500 flex-shrink-0" />
        <span className="text-xs sm:text-sm max-w-[90px] sm:max-w-[130px] truncate leading-none">
          {selectedCityName || "Select City"}
        </span>
        <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-400 group-hover:text-blue-600 flex-shrink-0 transition-colors" />
      </button>
    ) : (
      /* Inline — sits inside a search bar, matches white/blue palette */
      <button
        onClick={() => setOpen(true)}
        className="
          flex items-center gap-1.5 sm:gap-2
          pl-3 sm:pl-4 pr-2 sm:pr-3 py-3 sm:py-3.5
          bg-blue-50 hover:bg-blue-100
          border-r border-blue-200
          transition-colors
          min-w-[100px] sm:min-w-[140px] flex-shrink-0
          touch-manipulation
        "
        aria-label="Select city"
      >
        <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
        <span className="font-semibold text-blue-700 text-xs sm:text-sm truncate flex-1 text-left">
          {selectedCityName || "City"}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
      </button>
    );

  return (
    <>
      {trigger}

      {/* Full-screen modal overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[9999] flex flex-col sm:items-center sm:justify-center"
          style={{
            background: "rgba(15,23,42,0.6)",
            backdropFilter: "blur(4px)",
          }}
          onClick={handleClose}
        >
          {/* Sheet — bottom on mobile, centered on desktop */}
          <div
            ref={modalRef}
            className="
              mt-auto sm:m-0
              w-full sm:w-[480px] md:w-[540px]
              bg-white
              rounded-t-2xl sm:rounded-2xl
              flex flex-col
              shadow-2xl
              border border-blue-100
              transform transition-transform
              animate-slide-up sm:animate-fade-in
            "
            style={{
              maxHeight: getModalMaxHeight(),
              height: window.innerWidth < 640 ? "auto" : "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header - fixed */}
            <div className="flex items-center justify-between px-4 py-3 sm:py-3.5 border-b border-blue-100 flex-shrink-0 bg-white rounded-t-2xl">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900">
                  Select City
                </h3>
                {filtered.length > 0 && (
                  <span className="text-xs text-gray-400 ml-1">
                    ({filtered.length} cities)
                  </span>
                )}
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 rounded-full hover:bg-blue-50 transition-colors touch-manipulation"
                aria-label="Close"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              </button>
            </div>

            {/* Search - fixed */}
            <div className="px-3 sm:px-4 py-2.5 flex-shrink-0 bg-white border-b border-blue-50">
              <div className="flex items-center gap-2 px-3 py-2 sm:py-2.5 bg-blue-50 border border-blue-200 rounded-xl focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search city, state, or country..."
                  className="flex-1 bg-transparent text-xs sm:text-sm text-gray-900 placeholder-blue-300 focus:outline-none min-w-0"
                  aria-label="Search cities"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="hover:bg-blue-200 rounded-full p-0.5 transition-colors touch-manipulation"
                    aria-label="Clear search"
                  >
                    <X className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-400" />
                  </button>
                )}
              </div>
            </div>

            {/* City list - scrollable */}
            <div
              ref={listRef}
              className="flex-1 overflow-y-auto overscroll-contain px-2 sm:px-3 py-2"
              onScroll={handleScroll}
              style={{
                WebkitOverflowScrolling: "touch",
                maxHeight: "calc(100% - 120px)", // Account for header + search
              }}
            >
              {displayedCities.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="text-sm text-gray-400 mb-2">
                    No cities match "{query}"
                  </div>
                  <button
                    onClick={() => setQuery("")}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                    {displayedCities.map((city) => {
                      const active = city.id === selectedCityId;
                      return (
                        <button
                          key={city.id}
                          onClick={() => handleSelect(city)}
                          className={`
                            flex items-center gap-2 px-3 sm:px-3.5 py-3 sm:py-3
                            rounded-xl text-left transition-all
                            border touch-manipulation
                            ${
                              active
                                ? "bg-blue-50 border-blue-200 shadow-sm"
                                : "border-transparent hover:bg-gray-50 hover:border-gray-200 active:bg-gray-100"
                            }
                          `}
                          aria-current={active ? "true" : undefined}
                        >
                          <MapPin
                            className={`w-4 h-4 flex-shrink-0 ${
                              active ? "text-blue-500" : "text-gray-300"
                            }`}
                          />
                          <div className="min-w-0 flex-1">
                            <div
                              className={`text-sm font-semibold truncate ${
                                active ? "text-blue-600" : "text-gray-800"
                              }`}
                            >
                              {city.name}
                            </div>
                            {(city.state || city.country) && (
                              <div className="text-xs text-gray-400 truncate">
                                {[city.state, city.country]
                                  .filter(Boolean)
                                  .join(", ")}
                              </div>
                            )}
                          </div>
                          {active && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-auto" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Loading more indicator */}
                  {hasMore && (
                    <div className="py-4 text-center">
                      <div className="inline-flex items-center gap-2 text-xs text-gray-400">
                        <div className="w-4 h-4 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
                        Loading more cities...
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer with quick actions */}
            <div className="flex-shrink-0 px-3 sm:px-4 py-2 border-t border-blue-50 bg-gray-50 rounded-b-2xl">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{filtered.length} cities available</span>
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear search
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add animations */}
      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.2s ease-out;
        }
        
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        
        @media (prefers-reduced-motion: reduce) {
          .animate-slide-up,
          .animate-fade-in {
            animation: none;
          }
        }
      `}</style>
    </>
  );
};
