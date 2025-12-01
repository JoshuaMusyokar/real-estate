import { AlertCircle, Check, MapPin, Search } from "lucide-react";
import type { PropertyCreateRequest } from "../../../types";

interface City {
  id: string;
  name: string;
  state?: string;
  country?: string;
}

interface Locality {
  id: string;
  name: string;
}

interface LocationSuggestion {
  display_name: string;
  lat: string;
  lon: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
}

interface LocationStepProps {
  formData: PropertyCreateRequest;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  cities: City[];
  localities: Locality[];
  isLoadingCities: boolean;
  isLoadingLocalities: boolean;
  locationSearch: string;
  locationSuggestions: LocationSuggestion[];
  showSuggestions: boolean;
  isSearchingLocation: boolean;
  onUpdate: (data: Partial<PropertyCreateRequest>) => void;
  onBlur: (field: string) => void;
  onLocationSearchChange: (value: string) => void;
  onLocationSelect: (location: LocationSuggestion) => void;
  onSearchFocus: () => void;
}

export const LocationStep: React.FC<LocationStepProps> = ({
  formData,
  errors,
  touched,
  cities,
  localities,
  isLoadingCities,
  isLoadingLocalities,
  locationSearch,
  locationSuggestions,
  showSuggestions,
  isSearchingLocation,
  onUpdate,
  onBlur,
  onLocationSearchChange,
  onLocationSelect,
  onSearchFocus,
}) => {
  return (
    <div className="space-y-6">
      {/* Location Search */}
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">
          Search Location *
        </label>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={locationSearch}
            onChange={(e) => onLocationSearchChange(e.target.value)}
            onFocus={onSearchFocus}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Search for address, city, or area..."
          />
          {isSearchingLocation && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {showSuggestions && locationSuggestions.length > 0 && (
          <div className="mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
            {locationSuggestions.map((suggestion, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onLocationSelect(suggestion)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-start gap-3"
              >
                <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <div className="font-medium text-gray-900">
                    {suggestion.display_name}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {errors.location && (
          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.location}
          </p>
        )}
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">
          Address *
        </label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) => onUpdate({ address: e.target.value })}
          onBlur={() => onBlur("address")}
          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
            touched.address && errors.address
              ? "border-red-500"
              : "border-gray-200"
          }`}
          placeholder="Street address"
        />
        {touched.address && errors.address && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.address}
          </p>
        )}
      </div>

      {/* City and Locality */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">
            City *
          </label>
          <div className="relative">
            <select
              value={formData.cityId || ""}
              onChange={(e) => {
                const cityId = e.target.value;
                const selectedCity = cities.find((c) => c.id === cityId);
                onUpdate({
                  cityId,
                  city: selectedCity?.name || "",
                  state: selectedCity?.state || null,
                  country: selectedCity?.country || "",
                  locality: "",
                });
              }}
              onBlur={() => onBlur("city")}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all appearance-none ${
                touched.city && errors.city
                  ? "border-red-500"
                  : "border-gray-200"
              } ${isLoadingCities ? "bg-gray-100" : ""}`}
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
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
          {touched.city && errors.city && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.city}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">
            Locality/Neighborhood *
          </label>
          <div className="relative">
            <select
              value={formData.locality}
              onChange={(e) => onUpdate({ locality: e.target.value })}
              onBlur={() => onBlur("locality")}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all appearance-none ${
                touched.locality && errors.locality
                  ? "border-red-500"
                  : "border-gray-200"
              } ${
                !formData.cityId || isLoadingLocalities ? "bg-gray-100" : ""
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
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
          {touched.locality && errors.locality && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.locality}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">
            State/Province
          </label>
          <input
            type="text"
            value={formData.state || ""}
            onChange={(e) => onUpdate({ state: e.target.value || null })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50"
            placeholder="Auto-filled from city selection"
            // readOnly
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">
            Country *
          </label>
          <input
            type="text"
            value={formData.country}
            onChange={(e) => onUpdate({ country: e.target.value })}
            onBlur={() => onBlur("country")}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
              touched.country && errors.country
                ? "border-red-500"
                : "border-gray-200"
            }`}
            placeholder="Country"
          />
          {touched.country && errors.country && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.country}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">
            Zip/Postal Code
          </label>
          <input
            type="text"
            value={formData.zipCode || ""}
            onChange={(e) => onUpdate({ zipCode: e.target.value || null })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Zip code"
          />
        </div>
      </div>

      {/* Coordinates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">
            Latitude
          </label>
          <input
            type="number"
            step="any"
            value={formData.latitude || ""}
            readOnly
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50"
            placeholder="Auto-filled from location search"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">
            Longitude
          </label>
          <input
            type="number"
            step="any"
            value={formData.longitude || ""}
            readOnly
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50"
            placeholder="Auto-filled from location search"
          />
        </div>
      </div>

      {/* Success Message */}
      {formData.latitude && formData.longitude && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
          <div className="text-sm text-green-800">
            <strong>Location coordinates set!</strong> Your property will appear
            correctly on the map.
          </div>
        </div>
      )}

      {/* Loading States */}
      {isLoadingCities && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <div className="text-sm text-blue-800">
            Loading available cities...
          </div>
        </div>
      )}

      {formData.cityId && isLoadingLocalities && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <div className="text-sm text-blue-800">
            Loading localities for selected city...
          </div>
        </div>
      )}
    </div>
  );
};
