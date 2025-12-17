/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { AlertCircle, Check, MapPin, Search, Loader2 } from "lucide-react";

interface PropertyCreateRequest {
  address: string;
  cityId: string;
  locality: string;
  state: string | null;
  country: string;
  zipCode: string | null;
  latitude: number | null;
  longitude: number | null;
  complexName?: string | null;
}

interface City {
  id: string;
  name: string;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}

interface Locality {
  id: string;
  name: string;
}

interface LocationStepProps {
  formData: PropertyCreateRequest;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  cities: City[];
  localities: Locality[];
  isLoadingCities: boolean;
  isLoadingLocalities: boolean;
  onUpdate: (data: Partial<PropertyCreateRequest>) => void;
  onBlur: (field: string) => void;
}

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address: {
    road?: string;
    suburb?: string;
    city?: string;
    state?: string;
    country?: string;
    postcode?: string;
    neighbourhood?: string;
    town?: string;
  };
}

export const LocationStep: React.FC<LocationStepProps> = ({
  formData,
  errors,
  touched,
  cities,
  localities,
  isLoadingCities,
  isLoadingLocalities,
  onUpdate,
  onBlur,
}) => {
  const [addressQuery, setAddressQuery] = useState(formData.address || "");
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (addressQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsSearching(true);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?` +
            `q=${encodeURIComponent(addressQuery)}&` +
            `format=json&` +
            `addressdetails=1&` +
            `limit=5&`,
          // `countrycodes=ke`, // Restrict to Kenya, remove or change as needed
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (response.ok) {
          const data: NominatimResult[] = await response.json();
          setSuggestions(data);
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error("Error fetching address suggestions:", error);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [addressQuery]);

  const handleCityChange = (cityId: string) => {
    const selectedCity = cities.find((c) => c.id === cityId);

    onUpdate({
      cityId,
      state: selectedCity?.state || null,
      country: selectedCity?.country || "",
      locality: "",
      latitude: selectedCity?.latitude || null,
      longitude: selectedCity?.longitude || null,
    });
  };

  const handleSuggestionClick = (suggestion: NominatimResult) => {
    const address = suggestion.address;
    const roadName = address.road || address.suburb || "";

    setAddressQuery(suggestion.display_name);
    setShowSuggestions(false);

    // Try to find matching city in your database
    const cityName = address.city || address.town || "";
    const matchingCity = cities.find(
      (c) => c.name.toLowerCase() === cityName.toLowerCase()
    );

    onUpdate({
      address: suggestion.display_name,
      locality: address.neighbourhood || address.suburb || "",
      state: address.state || null,
      country: address.country || "",
      zipCode: address.postcode || null,
      latitude: parseFloat(suggestion.lat),
      longitude: parseFloat(suggestion.lon),
      ...(matchingCity && { cityId: matchingCity.id }),
    });
  };

  return (
    <div className="space-y-6">
      {/* Address with Autocomplete */}
      <div ref={wrapperRef}>
        <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
          Address *
        </label>
        <div className="relative">
          <input
            type="text"
            value={addressQuery}
            onChange={(e) => setAddressQuery(e.target.value)}
            onBlur={() => {
              onBlur("address");
              onUpdate({ address: addressQuery });
            }}
            onFocus={() => {
              if (suggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
            className={`w-full px-4 py-3 pr-10 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white transition-all ${
              touched.address && errors.address
                ? "border-red-500"
                : "border-gray-200 dark:border-gray-700"
            }`}
            placeholder="Start typing an address..."
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {isSearching ? (
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
            ) : (
              <Search className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-64 overflow-y-auto">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.place_id}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
              >
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {suggestion.address.road ||
                        suggestion.address.suburb ||
                        "Unknown road"}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {suggestion.display_name}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {touched.address && errors.address && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.address}
          </p>
        )}

        {addressQuery.length > 0 && addressQuery.length < 3 && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Type at least 3 characters to search for addresses
          </p>
        )}
      </div>

      {/* Complex Name */}
      <div>
        <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
          Building/Complex Name
        </label>
        <input
          type="text"
          value={formData.complexName || ""}
          onChange={(e) => onUpdate({ complexName: e.target.value || null })}
          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
          placeholder="e.g., Sunset Apartments, Tech Park"
        />
      </div>

      {/* City and Locality */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
            City *
          </label>
          <div className="relative">
            <select
              value={formData.cityId}
              onChange={(e) => handleCityChange(e.target.value)}
              onBlur={() => onBlur("city")}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white transition-all appearance-none ${
                touched.city && errors.city
                  ? "border-red-500"
                  : "border-gray-200 dark:border-gray-700"
              } ${isLoadingCities ? "bg-gray-100 dark:bg-gray-900" : ""}`}
              disabled={isLoadingCities}
            >
              <option value="">Select a city</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name} {city.state && `, ${city.state}`}
                </option>
              ))}
            </select>
            {isLoadingCities && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
              </div>
            )}
          </div>
          {touched.city && errors.city && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.city}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
            Locality/Neighborhood *
          </label>
          <div className="relative">
            <select
              value={formData.locality}
              onChange={(e) => onUpdate({ locality: e.target.value })}
              onBlur={() => onBlur("locality")}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white transition-all appearance-none ${
                touched.locality && errors.locality
                  ? "border-red-500"
                  : "border-gray-200 dark:border-gray-700"
              } ${
                !formData.cityId || isLoadingLocalities
                  ? "bg-gray-100 dark:bg-gray-900"
                  : ""
              }`}
              disabled={!formData.cityId || isLoadingLocalities}
            >
              <option value="">
                {!formData.cityId ? "Select a city first" : "Select a locality"}
              </option>
              {localities.map((locality) => (
                <option key={locality.id} value={locality.name}>
                  {locality.name}
                </option>
              ))}
            </select>
            {isLoadingLocalities && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
              </div>
            )}
          </div>
          {touched.locality && errors.locality && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.locality}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
            State/Province
          </label>
          <input
            type="text"
            value={formData.state || ""}
            onChange={(e) => onUpdate({ state: e.target.value || null })}
            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Auto-filled or enter manually"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
            Country *
          </label>
          <input
            type="text"
            value={formData.country}
            onChange={(e) => onUpdate({ country: e.target.value })}
            onBlur={() => onBlur("country")}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white transition-all ${
              touched.country && errors.country
                ? "border-red-500"
                : "border-gray-200 dark:border-gray-700"
            }`}
            placeholder="Auto-filled or enter manually"
          />
          {touched.country && errors.country && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.country}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
            Zip/Postal Code
          </label>
          <input
            type="text"
            value={formData.zipCode || ""}
            onChange={(e) => onUpdate({ zipCode: e.target.value || null })}
            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Enter zip code"
          />
        </div>
      </div>

      {/* Coordinates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
            Latitude
          </label>
          <input
            type="number"
            step="any"
            value={formData.latitude || ""}
            onChange={(e) =>
              onUpdate({
                latitude: e.target.value ? parseFloat(e.target.value) : null,
              })
            }
            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Auto-filled or enter manually"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
            Longitude
          </label>
          <input
            type="number"
            step="any"
            value={formData.longitude || ""}
            onChange={(e) =>
              onUpdate({
                longitude: e.target.value ? parseFloat(e.target.value) : null,
              })
            }
            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Auto-filled or enter manually"
          />
        </div>
      </div>

      {/* Success Message */}
      {formData.latitude && formData.longitude && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-center gap-3">
          <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
          <div className="text-sm text-green-800 dark:text-green-300">
            <strong>Location coordinates set!</strong> Your property will appear
            correctly on the map at ({formData.latitude.toFixed(6)},{" "}
            {formData.longitude.toFixed(6)}).
          </div>
        </div>
      )}

      {/* Info Message */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex items-start gap-3">
        <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800 dark:text-blue-300">
          <strong>Pro tip:</strong> Start typing in the address field for
          automatic suggestions from OpenStreetMap. This will auto-fill location
          details and coordinates.
        </div>
      </div>
    </div>
  );
};
