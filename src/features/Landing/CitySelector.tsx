import React, { useState, useEffect, useRef } from "react";
import {
  MapPin,
  ChevronDown,
  Search,
  X,
  TrendingUp,
  Navigation,
} from "lucide-react";
import { useGetCitiesQuery } from "../../services/locationApi";

interface CitySelectorProps {
  selectedCityId?: string;
  onCityChange: (cityId: string) => void;
  theme?: "light" | "dark" | "vibrant" | "clean";
}

export const CitySelector: React.FC<CitySelectorProps> = ({
  selectedCityId,
  onCityChange,
  theme = "light",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: citiesData, isLoading } = useGetCitiesQuery({
    page: 1,
    limit: 100,
  });

  const cities = citiesData?.data || [];
  const selectedCity = cities.find((city) => city.id === selectedCityId);

  // Filter cities based on search
  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Theme-based styling
  const getThemeStyles = () => {
    switch (theme) {
      case "dark":
        return {
          button: "bg-gray-800 hover:bg-gray-700 text-white border-gray-700",
          dropdown: "bg-gray-900 border-gray-800",
          search: "bg-gray-800 border-gray-700 text-white placeholder-gray-500",
          item: "hover:bg-gray-800 text-gray-300",
          selectedItem: "bg-gray-800 text-white",
        };
      case "vibrant":
        return {
          button:
            "bg-white/95 backdrop-blur-md hover:bg-white text-gray-900 border-gray-200 shadow-lg",
          dropdown: "bg-white border-gray-200 shadow-2xl",
          search:
            "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400",
          item: "hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 text-gray-700",
          selectedItem:
            "bg-gradient-to-r from-blue-500 to-indigo-600 text-white",
        };
      default:
        return {
          button: "bg-white hover:bg-gray-50 text-gray-900 border-gray-200",
          dropdown: "bg-white border-gray-200 shadow-xl",
          search:
            "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400",
          item: "hover:bg-blue-50 text-gray-700",
          selectedItem: "bg-blue-500 text-white",
        };
    }
  };

  const styles = getThemeStyles();

  const handleCitySelect = (cityId: string) => {
    onCityChange(cityId);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group flex items-center gap-2.5 px-4 py-2.5 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${styles.button}`}
      >
        <div className="relative">
          <MapPin className="w-5 h-5 text-blue-500 transition-transform group-hover:scale-110" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        </div>

        <div className="flex flex-col items-start min-w-[100px]">
          <span className="text-[10px] font-semibold opacity-70 uppercase tracking-wider">
            Location
          </span>
          <span className="text-sm font-bold truncate max-w-[120px]">
            {selectedCity?.name || "Select City"}
          </span>
        </div>

        <ChevronDown
          className={`w-4 h-4 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          className={`absolute top-full left-0 mt-2 w-[400px] rounded-2xl border-2 overflow-hidden z-50 animate-slide-down ${styles.dropdown}`}
        >
          {/* Search Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search cities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-10 py-2.5 rounded-lg border-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${styles.search}`}
                autoFocus
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Cities List */}
          <div className="max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 font-medium">
                  Loading cities...
                </p>
              </div>
            ) : filteredCities.length === 0 ? (
              <div className="p-8 text-center">
                <MapPin className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">
                  No cities found
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  Try a different search term
                </p>
              </div>
            ) : (
              <div className="p-2">
                {filteredCities.map((city, index) => {
                  const isSelected = city.id === selectedCityId;
                  const propertyCount = city._count?.properties || 0;

                  return (
                    <button
                      key={city.id}
                      onClick={() => handleCitySelect(city.id)}
                      className={`w-full p-3 rounded-xl transition-all duration-200 group flex items-center justify-between ${
                        isSelected ? styles.selectedItem : styles.item
                      }`}
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg transition-colors ${
                            isSelected
                              ? "bg-white/20"
                              : "bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50"
                          }`}
                        >
                          <MapPin
                            className={`w-4 h-4 ${
                              isSelected
                                ? "text-white"
                                : "text-blue-600 dark:text-blue-400"
                            }`}
                          />
                        </div>

                        <div className="text-left">
                          <div
                            className={`font-bold text-sm ${
                              isSelected
                                ? "text-white"
                                : "text-gray-900 dark:text-gray-100"
                            }`}
                          >
                            {city.name}
                          </div>
                          {(city.state || city.country) && (
                            <div
                              className={`text-xs mt-0.5 ${
                                isSelected
                                  ? "text-white/80"
                                  : "text-gray-500 dark:text-gray-400"
                              }`}
                            >
                              {[city.state, city.country]
                                .filter(Boolean)
                                .join(", ")}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {propertyCount > 0 && (
                          <div
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                              isSelected
                                ? "bg-white/20 text-white"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                            }`}
                          >
                            <TrendingUp className="w-3 h-3" />
                            {propertyCount}
                          </div>
                        )}

                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {filteredCities.length > 0 && (
            <div className="p-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400 font-medium">
                  {filteredCities.length}{" "}
                  {filteredCities.length === 1 ? "city" : "cities"} available
                </span>
                <button className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold transition-colors">
                  <Navigation className="w-3 h-3" />
                  Use my location
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-down {
          animation: slide-down 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};
