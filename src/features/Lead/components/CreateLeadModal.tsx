import { Loader2, Plus, X, ChevronDown, MapPin } from "lucide-react";
import { useState } from "react";
import { useGetPropertyTypesQuery } from "../../../services/propertyApi";
import { useGetCitiesQuery } from "../../../services/locationApi";
import { LEAD_SOURCES, PROPERTY_PURPOSES } from "../../../utils";
import type {
  LeadCreateRequest,
  LeadSource,
  PropertyPurpose,
} from "../../../types";
import { useCreateLeadMutation } from "../../../services/leadApi";

interface CreateLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateLeadModal: React.FC<CreateLeadModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [createLead, { isLoading }] = useCreateLeadMutation();
  const [formData, setFormData] = useState<LeadCreateRequest>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    source: "MANUAL_ENTRY",
    cityId: "",
    localities: [],
  });

  // Fetch property types
  const { data: propertyTypesData, isLoading: loadingPropertyTypes } =
    useGetPropertyTypesQuery({ isActive: true }, { skip: !isOpen });

  // Fetch cities
  const { data: citiesData, isLoading: loadingCities } = useGetCitiesQuery(
    { limit: 100 },
    { skip: !isOpen }
  );

  const propertyTypes = propertyTypesData?.data || [];
  const cities = citiesData?.data || [];

  const handleSubmit = async (): Promise<void> => {
    try {
      await createLead(formData).unwrap();
      onSuccess();
      onClose();
      resetForm();
    } catch (error) {
      console.error("Failed to create lead:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      source: "MANUAL_ENTRY",
      cityId: "",
      localities: [],
    });
  };

  const handlePropertyTypeChange = (propertyTypeId: string) => {
    setFormData((prev) => ({
      ...prev,
      propertyTypeId,
      subTypeId: undefined,
    }));
  };

  const handleCityChange = (cityId: string) => {
    setFormData((prev) => ({
      ...prev,
      cityId,
      localities: [], // Reset localities when city changes
    }));
  };

  const getCityDisplayName = (cityId: string) => {
    const city = cities.find((c) => c.id === cityId);
    if (!city) return "Select City";

    if (city.state && city.country) {
      return `${city.name}, ${city.state}, ${city.country}`;
    } else if (city.state) {
      return `${city.name}, ${city.state}`;
    }
    return city.name;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Create New Lead
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                First Name *
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={formData.lastName || ""}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Phone *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Source
              </label>
              <select
                value={formData.source}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    source: e.target.value as LeadSource,
                  })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              >
                {LEAD_SOURCES.map((source) => (
                  <option key={source} value={source}>
                    {source.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                City *
              </label>
              <div className="relative">
                <select
                  value={formData.cityId || ""}
                  onChange={(e) => handleCityChange(e.target.value)}
                  disabled={loadingCities}
                  className={`w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-white appearance-none pr-10 ${
                    loadingCities ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                      {city.state && `, ${city.state}`}
                      {city.country && `, ${city.country}`}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  {loadingCities ? (
                    <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
              {formData.cityId && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {getCityDisplayName(formData.cityId)}
                </p>
              )}
            </div>
          </div>

          {/* Property Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Property Type
              </label>
              <div className="relative">
                <select
                  value={formData.propertyTypeId || ""}
                  onChange={(e) => handlePropertyTypeChange(e.target.value)}
                  disabled={loadingPropertyTypes}
                  className={`w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-white appearance-none pr-10 ${
                    loadingPropertyTypes ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <option value="">Select Property Type</option>
                  {propertyTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.icon && <span className="mr-2">{type.icon}</span>}
                      {type.name.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  {loadingPropertyTypes ? (
                    <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Purpose
              </label>
              <select
                value={formData.purpose || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    purpose: e.target.value as PropertyPurpose,
                  })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              >
                <option value="">Select Purpose</option>
                {PROPERTY_PURPOSES.map((purpose) => (
                  <option key={purpose} value={purpose}>
                    {purpose}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Requirements
            </label>
            <textarea
              value={formData.requirements || ""}
              onChange={(e) =>
                setFormData({ ...formData, requirements: e.target.value })
              }
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-white resize-none"
            />
          </div>

          {/* Loading states */}
          {(loadingCities || loadingPropertyTypes) && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <div className="flex items-center justify-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-blue-800 dark:text-blue-300">
                  Loading data...
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              isLoading ||
              !formData.firstName ||
              !formData.email ||
              !formData.phone ||
              !formData.cityId // Added cityId validation
            }
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Create Lead
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
