import React, { useState, useEffect } from "react";
import { X, MapPin, Search, Loader2 } from "lucide-react";
import {
  useCreateCityMutation,
  useUpdateCityMutation,
} from "../../services/locationApi";
import { useLocationAutocomplete } from "../../hooks/useLocationAutocomplete";
import type {
  City,
  CreateCityRequest,
  UpdateCityRequest,
  LocationSuggestion,
} from "../../types";
import { useToast } from "../../hooks/useToast";

interface CityFormProps {
  city?: City | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function CityForm({ city, onClose, onSuccess }: CityFormProps) {
  const [createCity] = useCreateCityMutation();
  const [updateCity] = useUpdateCityMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error: showError } = useToast();

  const [formData, setFormData] = useState<
    CreateCityRequest | UpdateCityRequest
  >({
    name: "",
    state: "",
    country: "",
    latitude: undefined,
    longitude: undefined,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { suggestions, isLoading, searchLocations, clearSuggestions } =
    useLocationAutocomplete();

  useEffect(() => {
    if (city) {
      setFormData({
        name: city.name,
        state: city.state || "",
        country: city.country || "",
        latitude: city.latitude || undefined,
        longitude: city.longitude || undefined,
      });
    }
  }, [city]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.length >= 3) {
        searchLocations(searchQuery);
      } else {
        clearSuggestions();
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, searchLocations, clearSuggestions]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSuggestionSelect = (suggestion: LocationSuggestion) => {
    const address = suggestion.address;

    setFormData({
      name: address.city || suggestion.display_name.split(",")[0],
      state: address.state || "",
      country: address.country || "",
      latitude: parseFloat(suggestion.lat),
      longitude: parseFloat(suggestion.lon),
    });

    setSearchQuery(suggestion.display_name);
    setShowSuggestions(false);
    clearSuggestions();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.latitude === undefined || formData.longitude === undefined) {
      showError(
        "Please search for and select a city location to populate coordinates."
      );
      return;
    }
    if (!formData.name?.trim()) {
      showError("City name is required");
      return;
    }

    setIsSubmitting(true);

    try {
      if (city) {
        await updateCity({
          id: city.id,
          data: formData as UpdateCityRequest,
        }).unwrap();
        success("City updated successfully");
      } else {
        await createCity(formData as CreateCityRequest).unwrap();
        success("City created successfully");
      }
      onSuccess();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : city
          ? "Failed to update city"
          : "Failed to create city";
      showError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-6 border w-full max-w-md shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {city ? "Edit City" : "Add New City"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Location Search */}
          <div className="relative">
            <label
              htmlFor="location-search"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Search Location *
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                id="location-search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Start typing to search for a location..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:text-white sm:text-sm"
              />
              {isLoading && (
                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 animate-spin" />
              )}
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.place_id}
                    type="button"
                    onClick={() => handleSuggestionSelect(suggestion)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                  >
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {suggestion.display_name.split(",")[0]}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {suggestion.display_name
                            .split(",")
                            .slice(1)
                            .join(",")
                            .trim()}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Manual Input Fields */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              City Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="state"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                State/Province
              </label>
              <input
                type="text"
                id="state"
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Country
              </label>
              <input
                type="text"
                id="country"
                value={formData.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="latitude"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Latitude
              </label>
              <input
                type="number"
                step="any"
                id="latitude"
                value={formData.latitude || ""}
                onChange={(e) => handleInputChange("latitude", e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="longitude"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Longitude
              </label>
              <input
                type="number"
                step="any"
                id="longitude"
                value={formData.longitude || ""}
                onChange={(e) => handleInputChange("longitude", e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              {isSubmitting ? "Saving..." : city ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
