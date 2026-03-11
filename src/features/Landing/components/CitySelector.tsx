import React, { useEffect, useRef, useState } from "react";
import { MapPin, Search, X, ChevronDown } from "lucide-react";
import type { City } from "../../../types";

interface CitySelectorProps {
  cities: City[];
  selectedCityId: string;
  selectedCityName: string;
  onCityChange: (cityId: string, cityName: string) => void;
  /** "pill" = Housing.com style standalone button on mobile hero */
  variant?: "pill" | "inline";
}

export const CitySelector: React.FC<CitySelectorProps> = ({
  cities,
  selectedCityId,
  selectedCityName,
  onCityChange,
  variant = "inline",
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = cities
    .filter(
      (c) =>
        query === "" ||
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        (c.state ?? "").toLowerCase().includes(query.toLowerCase()),
    )
    .slice(0, 30);

  // Focus search input when modal opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  // Lock body scroll while modal open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleSelect = (city: City) => {
    onCityChange(city.id, city.name);
    setOpen(false);
    setQuery("");
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
        "
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
          min-w-[110px] sm:min-w-[150px] flex-shrink-0
        "
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

      {/* Full-screen modal overlay — no z-index conflicts */}
      {open && (
        <div
          className="fixed inset-0 z-[9999] flex flex-col"
          style={{ background: "rgba(15,23,42,0.45)" }}
        >
          {/* Sheet — bottom on mobile, centered on desktop */}
          <div className="mt-auto sm:m-auto w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl flex flex-col max-h-[80vh] sm:max-h-[540px] shadow-2xl border border-blue-100">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 sm:py-3.5 border-b border-blue-100 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900">
                  Select City
                </h3>
              </div>
              <button
                onClick={() => {
                  setOpen(false);
                  setQuery("");
                }}
                className="p-1.5 rounded-full hover:bg-blue-50 transition-colors"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              </button>
            </div>

            {/* Search */}
            <div className="px-3 sm:px-4 py-2.5 flex-shrink-0">
              <div className="flex items-center gap-2 px-3 py-2 sm:py-2.5 bg-blue-50 border border-blue-200 rounded-xl focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search city or state…"
                  className="flex-1 bg-transparent text-xs sm:text-sm text-gray-900 placeholder-blue-300 focus:outline-none"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-400" />
                  </button>
                )}
              </div>
            </div>

            {/* City list */}
            <div className="flex-1 overflow-y-auto px-2 sm:px-3 pb-4">
              {filtered.length === 0 ? (
                <div className="py-10 text-center text-sm text-gray-400">
                  No cities match "{query}"
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-1">
                  {filtered.map((city) => {
                    const active = city.id === selectedCityId;
                    return (
                      <button
                        key={city.id}
                        onClick={() => handleSelect(city)}
                        className={`flex items-center gap-2 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-xl text-left transition-colors border ${
                          active
                            ? "bg-blue-50 border-blue-200"
                            : "border-transparent hover:bg-gray-50 hover:border-gray-100"
                        }`}
                      >
                        <MapPin
                          className={`w-3.5 h-3.5 flex-shrink-0 ${active ? "text-blue-500" : "text-gray-300"}`}
                        />
                        <div className="min-w-0 flex-1">
                          <div
                            className={`text-xs sm:text-sm font-semibold truncate ${active ? "text-blue-600" : "text-gray-800"}`}
                          >
                            {city.name}
                          </div>
                          {city.state && (
                            <div className="text-[10px] sm:text-xs text-gray-400 truncate">
                              {city.state}
                            </div>
                          )}
                        </div>
                        {active && (
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0 ml-auto" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
