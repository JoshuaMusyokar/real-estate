import { Bath, Bed, Building2, Calendar, Square } from "lucide-react";
import type { PropertyCreateRequest } from "../../../types";

interface DetailsStepProps {
  formData: PropertyCreateRequest;
  errors: Record<string, string>;
  onUpdate: (data: Partial<PropertyCreateRequest>) => void;
  onBlur: (field: string) => void;
}

export const DetailsStep: React.FC<DetailsStepProps> = ({
  formData,
  errors,
  onUpdate,
  onBlur,
}) => {
  return (
    <div className="space-y-6">
      {/* Room Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">
            <Bed className="w-4 h-4 inline mr-1" />
            Bedrooms
          </label>
          <input
            type="number"
            value={formData.bedrooms || ""}
            onChange={(e) =>
              onUpdate({ bedrooms: parseInt(e.target.value) || null })
            }
            onBlur={() => onBlur("bedrooms")}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
              errors.bedrooms ? "border-red-500" : "border-gray-200"
            }`}
            placeholder="0"
            min="0"
          />
          {errors.bedrooms && (
            <p className="mt-1 text-xs text-red-600">{errors.bedrooms}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">
            <Bath className="w-4 h-4 inline mr-1" />
            Bathrooms
          </label>
          <input
            type="number"
            value={formData.bathrooms || ""}
            onChange={(e) =>
              onUpdate({ bathrooms: parseInt(e.target.value) || null })
            }
            onBlur={() => onBlur("bathrooms")}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
              errors.bathrooms ? "border-red-500" : "border-gray-200"
            }`}
            placeholder="0"
            min="0"
          />
          {errors.bathrooms && (
            <p className="mt-1 text-xs text-red-600">{errors.bathrooms}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">
            <Building2 className="w-4 h-4 inline mr-1" />
            Floors
          </label>
          <input
            type="number"
            value={formData.floors || ""}
            onChange={(e) =>
              onUpdate({ floors: parseInt(e.target.value) || null })
            }
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="0"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            Year Built
          </label>
          <input
            type="number"
            value={formData.yearBuilt || ""}
            onChange={(e) =>
              onUpdate({ yearBuilt: parseInt(e.target.value) || null })
            }
            onBlur={() => onBlur("yearBuilt")}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
              errors.yearBuilt ? "border-red-500" : "border-gray-200"
            }`}
            placeholder="2024"
            min="1800"
          />
          {errors.yearBuilt && (
            <p className="mt-1 text-xs text-red-600">{errors.yearBuilt}</p>
          )}
        </div>
      </div>

      {/* Area Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">
            <Square className="w-4 h-4 inline mr-1" />
            Square Feet
          </label>
          <input
            type="number"
            value={formData.squareFeet || ""}
            onChange={(e) =>
              onUpdate({ squareFeet: parseInt(e.target.value) || null })
            }
            onBlur={() => onBlur("squareFeet")}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
              errors.squareFeet ? "border-red-500" : "border-gray-200"
            }`}
            placeholder="0"
            min="0"
          />
          {errors.squareFeet && (
            <p className="mt-1 text-sm text-red-600">{errors.squareFeet}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">
            Square Meters
          </label>
          <input
            type="number"
            value={formData.squareMeters || ""}
            onChange={(e) =>
              onUpdate({ squareMeters: parseInt(e.target.value) || undefined })
            }
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="0"
            min="0"
          />
        </div>
      </div>

      {/* Furnishing Status */}
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">
          Furnishing Status
        </label>
        <select
          value={formData.furnishingStatus || ""}
          onChange={(e) =>
            onUpdate({ furnishingStatus: e.target.value || null })
          }
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
        >
          <option value="">Select Furnishing Status</option>
          <option value="Furnished">Furnished</option>
          <option value="Semi-Furnished">Semi-Furnished</option>
          <option value="Unfurnished">Unfurnished</option>
        </select>
      </div>

      {/* YouTube Video URL */}
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">
          YouTube Video URL
        </label>
        <input
          type="url"
          value={formData.youtubeVideoUrl || ""}
          onChange={(e) =>
            onUpdate({ youtubeVideoUrl: e.target.value || null })
          }
          onBlur={() => onBlur("youtubeVideoUrl")}
          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
            errors.youtubeVideoUrl ? "border-red-500" : "border-gray-200"
          }`}
          placeholder="https://youtube.com/watch?v=..."
        />
        {errors.youtubeVideoUrl && (
          <p className="mt-1 text-sm text-red-600">{errors.youtubeVideoUrl}</p>
        )}
      </div>

      {/* Virtual Tour URL */}
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">
          Virtual Tour URL
        </label>
        <input
          type="url"
          value={formData.virtualTourUrl || ""}
          onChange={(e) => onUpdate({ virtualTourUrl: e.target.value || null })}
          onBlur={() => onBlur("virtualTourUrl")}
          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
            errors.virtualTourUrl ? "border-red-500" : "border-gray-200"
          }`}
          placeholder="https://virtualtour.com/..."
        />
        {errors.virtualTourUrl && (
          <p className="mt-1 text-sm text-red-600">{errors.virtualTourUrl}</p>
        )}
      </div>
    </div>
  );
};
