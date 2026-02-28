import React, { useState, useEffect, useRef } from "react";
import {
  AlertCircle,
  Check,
  MapPin,
  Search,
  Loader2,
  Building2,
  Globe,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/Card";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";

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
            `limit=5`,
          {
            headers: {
              Accept: "application/json",
            },
          },
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

    setAddressQuery(suggestion.display_name);
    setShowSuggestions(false);

    const cityName = address.city || address.town || "";
    const matchingCity = cities.find(
      (c) => c.name.toLowerCase() === cityName.toLowerCase(),
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
    <div className="space-y-4 sm:space-y-6">
      {/* Address Search Card */}
      <Card>
        <CardHeader className="p-4 sm:p-5 md:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
            <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
            Address & Location
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 md:p-6 pt-0 space-y-4 sm:space-y-5">
          {/* Address with Autocomplete */}
          <div ref={wrapperRef}>
            <Label>Address *</Label>
            <div className="relative">
              <Input
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
                placeholder="Start typing an address..."
                error={touched.address && !!errors.address}
                className="pr-10"
              />
              <div className="absolute right-3 top-3 pointer-events-none">
                {isSearching ? (
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-brand-600 animate-spin" />
                ) : (
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                )}
              </div>
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl shadow-lg max-h-48 sm:max-h-64 overflow-y-auto">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.place_id}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                  >
                    <div className="flex items-start gap-2 sm:gap-3">
                      <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5 sm:mt-1" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">
                          {suggestion.address.road ||
                            suggestion.address.suburb ||
                            "Unknown road"}
                        </div>
                        <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 truncate">
                          {suggestion.display_name}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {touched.address && errors.address && (
              <p className="mt-1.5 text-xs text-error-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.address}
              </p>
            )}

            {addressQuery.length > 0 && addressQuery.length < 3 && (
              <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                Type at least 3 characters to search for addresses
              </p>
            )}
          </div>

          {/* Complex Name */}
          <div>
            <Label>Building/Complex Name</Label>
            <Input
              type="text"
              value={formData.complexName || ""}
              onChange={(e) =>
                onUpdate({ complexName: e.target.value || null })
              }
              placeholder="e.g., Sunset Apartments, Tech Park"
            />
          </div>

          {/* Pro Tip */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg sm:rounded-xl p-3 sm:p-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-blue-800 dark:text-blue-300">
                <strong>Pro tip:</strong> Start typing in the address field for
                automatic suggestions from OpenStreetMap. This will auto-fill
                location details and coordinates.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location Details Card */}
      <Card>
        <CardHeader className="p-4 sm:p-5 md:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
            <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
            Location Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 md:p-6 pt-0 space-y-4 sm:space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {/* City */}
            <div>
              <Label>City *</Label>
              <div className="relative">
                <select
                  value={formData.cityId}
                  onChange={(e) => handleCityChange(e.target.value)}
                  onBlur={() => onBlur("city")}
                  disabled={isLoadingCities}
                  className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 ${
                    touched.city && errors.city
                      ? "border-error-500 focus:border-error-300 focus:ring-error-500/20"
                      : "bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700"
                  } ${isLoadingCities ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <option value="">Select a city</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name} {city.state && `, ${city.state}`}
                    </option>
                  ))}
                </select>
                {isLoadingCities && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-brand-600 animate-spin" />
                  </div>
                )}
              </div>
              {touched.city && errors.city && (
                <p className="mt-1.5 text-xs text-error-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.city}
                </p>
              )}
            </div>

            {/* Locality */}
            <div>
              <Label>Locality/Neighborhood *</Label>
              <div className="relative">
                <select
                  value={formData.locality}
                  onChange={(e) => onUpdate({ locality: e.target.value })}
                  onBlur={() => onBlur("locality")}
                  disabled={!formData.cityId || isLoadingLocalities}
                  className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 ${
                    touched.locality && errors.locality
                      ? "border-error-500 focus:border-error-300 focus:ring-error-500/20"
                      : "bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700"
                  } ${
                    !formData.cityId || isLoadingLocalities
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  <option value="">
                    {!formData.cityId
                      ? "Select a city first"
                      : "Select a locality"}
                  </option>
                  {localities.map((locality) => (
                    <option key={locality.id} value={locality.name}>
                      {locality.name}
                    </option>
                  ))}
                </select>
                {isLoadingLocalities && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-brand-600 animate-spin" />
                  </div>
                )}
              </div>
              {touched.locality && errors.locality && (
                <p className="mt-1.5 text-xs text-error-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.locality}
                </p>
              )}
            </div>

            {/* State */}
            <div>
              <Label>State/Province</Label>
              <Input
                type="text"
                value={formData.state || ""}
                onChange={(e) => onUpdate({ state: e.target.value || null })}
                placeholder="Auto-filled or enter manually"
              />
            </div>

            {/* Country */}
            <div>
              <Label>Country *</Label>
              <Input
                type="text"
                value={formData.country}
                onChange={(e) => onUpdate({ country: e.target.value })}
                placeholder="Auto-filled or enter manually"
                error={touched.country && !!errors.country}
                hint={touched.country ? errors.country : undefined}
              />
            </div>

            {/* Zip Code */}
            <div>
              <Label>Zip/Postal Code</Label>
              <Input
                type="text"
                value={formData.zipCode || ""}
                onChange={(e) => onUpdate({ zipCode: e.target.value || null })}
                placeholder="Enter zip code"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coordinates Card */}
      <Card>
        <CardHeader className="p-4 sm:p-5 md:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
            <Globe className="w-5 h-5 sm:w-6 sm:h-6" />
            GPS Coordinates
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 md:p-6 pt-0 space-y-4 sm:space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {/* Latitude */}
            <div>
              <Label>Latitude</Label>
              <Input
                type="number"
                step={0.01}
                value={formData.latitude || ""}
                onChange={(e) =>
                  onUpdate({
                    latitude: e.target.value
                      ? parseFloat(e.target.value)
                      : null,
                  })
                }
                placeholder="Auto-filled or enter manually"
              />
            </div>

            {/* Longitude */}
            <div>
              <Label>Longitude</Label>
              <Input
                type="number"
                step={0.01}
                value={formData.longitude || ""}
                onChange={(e) =>
                  onUpdate({
                    longitude: e.target.value
                      ? parseFloat(e.target.value)
                      : null,
                  })
                }
                placeholder="Auto-filled or enter manually"
              />
            </div>
          </div>

          {/* Success Message */}
          {formData.latitude && formData.longitude && (
            <div className="bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-lg sm:rounded-xl p-3 sm:p-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-success-600 dark:text-success-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-success-800 dark:text-success-300">
                  <strong>Location coordinates set!</strong> Your property will
                  appear correctly on the map at ({formData.latitude.toFixed(6)}
                  , {formData.longitude.toFixed(6)}).
                </div>
              </div>
            </div>
          )}

          {/* Info Message */}
          {(!formData.latitude || !formData.longitude) && (
            <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl p-3 sm:p-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  Coordinates are automatically set when you select an address
                  from the suggestions. You can also enter them manually if
                  needed.
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
