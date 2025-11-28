import React, { useState, useEffect } from "react";
import { X, Loader2, MapPin, Plus, Trash2 } from "lucide-react";
import {
  useCreateLocalityMutation,
  useUpdateLocalityMutation,
  useGetCitiesQuery,
} from "../../services/locationApi";
import type {
  Locality,
  CreateLocalityRequest,
  UpdateLocalityRequest,
  City,
  LocalityHighlight,
} from "../../types";
import { useToast } from "../../hooks/useToast";

interface LocalityFormProps {
  locality?: Locality | null;
  onClose: () => void;
  onSuccess: () => void;
}

// Common highlight types with icons and suggestions
const HIGHLIGHT_TYPES = [
  {
    value: "school",
    label: "School",
    examples: ["Elementary School", "High School", "University"],
  },
  {
    value: "hospital",
    label: "Hospital",
    examples: ["General Hospital", "Clinic", "Medical Center"],
  },
  {
    value: "restaurant",
    label: "Restaurant",
    examples: ["Fine Dining", "Cafe", "Fast Food"],
  },
  {
    value: "shopping",
    label: "Shopping",
    examples: ["Shopping Mall", "Supermarket", "Convenience Store"],
  },
  {
    value: "park",
    label: "Park",
    examples: ["Public Park", "Playground", "Recreation Area"],
  },
  {
    value: "transport",
    label: "Transport",
    examples: ["Bus Station", "Train Station", "Metro Station"],
  },
  {
    value: "worship",
    label: "Worship",
    examples: ["Church", "Mosque", "Temple"],
  },
  { value: "bank", label: "Bank", examples: ["Bank", "ATM", "Credit Union"] },
  {
    value: "entertainment",
    label: "Entertainment",
    examples: ["Cinema", "Theater", "Sports Center"],
  },
  {
    value: "other",
    label: "Other",
    examples: ["Post Office", "Library", "Community Center"],
  },
];

export function LocalityForm({
  locality,
  onClose,
  onSuccess,
}: LocalityFormProps) {
  const [createLocality] = useCreateLocalityMutation();
  const [updateLocality] = useUpdateLocalityMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error: showError } = useToast();

  const [formData, setFormData] = useState<
    CreateLocalityRequest | UpdateLocalityRequest
  >({
    name: "",
    cityId: "",
    highlights: [],
  });

  const [newHighlight, setNewHighlight] = useState<{
    name: string;
    type: string;
    distance_km: number;
  }>({
    name: "",
    type: "",
    distance_km: 0,
  });

  const { data: citiesData, isLoading: isLoadingCities } = useGetCitiesQuery({
    page: 1,
    limit: 100,
  });

  const cities = citiesData?.data || [];

  useEffect(() => {
    if (locality) {
      setFormData({
        name: locality.name,
        cityId: locality.cityId,
        highlights: parseHighlights(locality.highlights),
      });
    }
  }, [locality]);

  function parseHighlights(value: any) {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    try {
      return JSON.parse(value); // <-- convert string → array
    } catch (e) {
      console.log(e);
      return []; // fallback
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleHighlightChange = (field: string, value: string | number) => {
    setNewHighlight((prev) => ({ ...prev, [field]: value }));
  };

  const addHighlight = () => {
    if (
      !newHighlight.name.trim() ||
      !newHighlight.type ||
      newHighlight.distance_km <= 0
    ) {
      showError("Please fill all highlight fields with valid values");
      return;
    }

    const highlight: LocalityHighlight = {
      name: newHighlight.name.trim(),
      type: newHighlight.type,
      distance_km: Number(newHighlight.distance_km),
    };

    setFormData((prev) => ({
      ...prev,
      highlights: [...(prev.highlights || []), highlight],
    }));

    // Reset form
    setNewHighlight({
      name: "",
      type: "",
      distance_km: 0,
    });
  };

  const removeHighlight = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      highlights: prev.highlights?.filter((_, i) => i !== index) || [],
    }));
  };

  const getTypeExamples = (type: string) => {
    return HIGHLIGHT_TYPES.find((t) => t.value === type)?.examples || [];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name?.trim()) {
      showError("Locality name is required");
      return;
    }

    if (!formData.cityId) {
      showError("Please select a city");
      return;
    }

    setIsSubmitting(true);

    try {
      if (locality) {
        await updateLocality({
          id: locality.id,
          data: formData as UpdateLocalityRequest,
        }).unwrap();
        success("Locality updated successfully");
      } else {
        await createLocality(formData as CreateLocalityRequest).unwrap();
        success("Locality created successfully");
      }
      onSuccess();
    } catch (error: unknown) {
      if (error instanceof Error) {
        showError(
          error.message ||
            (locality
              ? "Failed to update locality"
              : "Failed to create locality")
        );
      } else {
        showError(
          locality ? "Failed to update locality" : "Failed to create locality"
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-6 border w-full max-w-2xl shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {locality ? "Edit Locality" : "Add New Locality"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Locality Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                placeholder="Enter locality name"
                required
              />
            </div>

            <div>
              <label
                htmlFor="cityId"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                City *
              </label>
              <select
                id="cityId"
                value={formData.cityId}
                onChange={(e) => handleInputChange("cityId", e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                required
                disabled={isLoadingCities}
              >
                <option value="">Select a city</option>
                {cities.map((city: City) => (
                  <option key={city.id} value={city.id}>
                    {city.name} {city.state && `, ${city.state}`}{" "}
                    {city.country && `, ${city.country}`}
                  </option>
                ))}
              </select>
              {isLoadingCities && (
                <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading cities...
                </div>
              )}
            </div>
          </div>

          {locality && (
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4 mr-2" />
                <span>
                  Currently in: {locality.city.name}
                  {locality.city.state && `, ${locality.city.state}`}
                </span>
              </div>
            </div>
          )}

          {/* Highlights Section */}
          <div className="border-t pt-6">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Nearby Places & Highlights
            </h4>

            {/* Add Highlight Form */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Type
                  </label>
                  <select
                    value={newHighlight.type}
                    onChange={(e) =>
                      handleHighlightChange("type", e.target.value)
                    }
                    className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                  >
                    <option value="">Select type</option>
                    {HIGHLIGHT_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={newHighlight.name}
                    onChange={(e) =>
                      handleHighlightChange("name", e.target.value)
                    }
                    className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                    placeholder="e.g., Green Valley School"
                    list="highlight-suggestions"
                  />
                  {newHighlight.type && (
                    <datalist id="highlight-suggestions">
                      {getTypeExamples(newHighlight.type).map(
                        (example, idx) => (
                          <option key={idx} value={example} />
                        )
                      )}
                    </datalist>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Distance (km)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={newHighlight.distance_km}
                    onChange={(e) =>
                      handleHighlightChange("distance_km", e.target.value)
                    }
                    className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                    placeholder="0.5"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={addHighlight}
                    className="flex items-center gap-1 w-full px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Highlights List */}
            {formData.highlights && formData.highlights.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {formData.highlights.map((highlight, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-sm text-gray-900 dark:text-white">
                          {highlight.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {HIGHLIGHT_TYPES.find(
                            (t) => t.value === highlight.type
                          )?.label || highlight.type}{" "}
                          • {highlight.distance_km}km away
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeHighlight(index)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No highlights added yet</p>
                <p className="text-xs mt-1">
                  Add nearby places to help users understand the area better
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-600">
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
              {isSubmitting ? "Saving..." : locality ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
