import { AlertCircle, Check } from "lucide-react";
import type { Amenity, PropertyCreateRequest } from "../../../types";

interface AmenitiesStepProps {
  formData: PropertyCreateRequest;
  amenities: Amenity[];
  categories: string[];
  errors: Record<string, string>;
  onUpdate: (data: Partial<PropertyCreateRequest>) => void;
}

export const AmenitiesStep: React.FC<AmenitiesStepProps> = ({
  formData,
  amenities,
  categories,
  errors,
  onUpdate,
}) => {
  const handleAmenityToggle = (amenityId: string) => {
    const current = formData.amenities || [];
    const isSelected = current.includes(amenityId);
    const updated = isSelected
      ? current.filter((id) => id !== amenityId)
      : [...current, amenityId];
    onUpdate({ amenities: updated });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          Select Amenities *
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Choose all amenities available in your property
        </p>
      </div>

      {errors.amenities && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-800">{errors.amenities}</p>
        </div>
      )}

      {categories.length > 0 ? (
        categories.map((category) => {
          const categoryAmenities = amenities.filter(
            (a) => a.category === category
          );
          if (categoryAmenities.length === 0) return null;

          return (
            <div key={category} className="bg-gray-50 rounded-xl p-6">
              <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">
                {category}
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {categoryAmenities.map((amenity) => {
                  const isSelected = formData.amenities?.includes(amenity.id);
                  return (
                    <button
                      key={amenity.id}
                      type="button"
                      onClick={() => handleAmenityToggle(amenity.id)}
                      className={`p-3 rounded-xl text-sm font-medium transition-all text-left ${
                        isSelected
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      <Check
                        className={`w-4 h-4 inline mr-2 ${
                          isSelected ? "opacity-100" : "opacity-0"
                        }`}
                      />
                      {amenity.name}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {amenities.map((amenity) => {
            const isSelected = formData.amenities?.includes(amenity.id);
            return (
              <button
                key={amenity.id}
                type="button"
                onClick={() => handleAmenityToggle(amenity.id)}
                className={`p-3 rounded-xl text-sm font-medium transition-all ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                <Check
                  className={`w-4 h-4 inline mr-2 ${
                    isSelected ? "opacity-100" : "opacity-0"
                  }`}
                />
                {amenity.name}
              </button>
            );
          })}
        </div>
      )}

      <div
        className={`border rounded-xl p-4 flex items-start gap-3 ${
          formData.amenities && formData.amenities.length > 0
            ? "bg-blue-50 border-blue-200"
            : "bg-gray-50 border-gray-200"
        }`}
      >
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
            formData.amenities && formData.amenities.length > 0
              ? "bg-blue-600 text-white"
              : "bg-gray-300 text-gray-600"
          }`}
        >
          <Check className="w-5 h-5" />
        </div>
        <div>
          <div
            className={`font-semibold mb-1 ${
              formData.amenities && formData.amenities.length > 0
                ? "text-blue-900"
                : "text-gray-700"
            }`}
          >
            {formData.amenities?.length || 0} Amenities Selected
          </div>
          <div
            className={`text-sm ${
              formData.amenities && formData.amenities.length > 0
                ? "text-blue-700"
                : "text-gray-600"
            }`}
          >
            More amenities increase property appeal and search visibility
          </div>
        </div>
      </div>
    </div>
  );
};
