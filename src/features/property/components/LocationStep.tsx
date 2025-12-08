import { AlertCircle, Check, MapPin } from "lucide-react";
import type { PropertyCreateRequest } from "../../../types";

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
  const handleCityChange = (cityId: string) => {
    const selectedCity = cities.find((c) => c.id === cityId);

    onUpdate({
      cityId,
      // city: selectedCity?.name || "",
      state: selectedCity?.state || null,
      country: selectedCity?.country || "",
      locality: "",
      // Update coordinates from city data
      latitude: selectedCity?.latitude || null,
      longitude: selectedCity?.longitude || null,
    });
  };

  return (
    <div className="space-y-6">
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
              value={formData.cityId}
              onChange={(e) => handleCityChange(e.target.value)}
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
            readOnly
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
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50 ${
              touched.country && errors.country
                ? "border-red-500"
                : "border-gray-200"
            }`}
            placeholder="Auto-filled from city selection"
            readOnly
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
            placeholder="Enter zip code"
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
            placeholder="Auto-filled from city selection"
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
            placeholder="Auto-filled from city selection"
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

      {/* Info Message */}
      {formData.cityId && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <strong>Location coordinates automatically set</strong> based on the
            selected city. The property will be shown at the city's center on
            the map.
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
