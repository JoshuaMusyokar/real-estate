import { AlertCircle, DollarSign } from "lucide-react";
import type {
  PropertyCreateRequest,
  PropertyPurpose,
  PropertyStatus,
  PropertySubType,
  PropertyType,
} from "../../../types";

interface BasicInfoStepProps {
  formData: PropertyCreateRequest;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  mode: "create" | "edit";
  onUpdate: (data: Partial<PropertyCreateRequest>) => void;
  onBlur: (field: string) => void;
}

const propertyTypes: PropertyType[] = [
  "RESIDENTIAL",
  "COMMERCIAL",
  "LAND",
  "INDUSTRIAL",
  "MIXED_USE",
];

const subTypes: PropertySubType[] = [
  "APARTMENT",
  "VILLA",
  "HOUSE",
  "FLAT",
  "STUDIO",
  "PENTHOUSE",
  "DUPLEX",
  "TOWNHOUSE",
  "OFFICE",
  "SHOP",
  "WAREHOUSE",
  "SHOWROOM",
  "PLOT",
  "AGRICULTURAL",
  "INDUSTRIAL_LAND",
];

const purposes: PropertyPurpose[] = ["SALE", "RENT", "LEASE"];

const statuses: PropertyStatus[] = [
  "DRAFT",
  "UNDER_REVIEW",
  "AVAILABLE",
  "SOLD",
  "RENTED",
];

export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  formData,
  errors,
  touched,
  mode,
  onUpdate,
  onBlur,
}) => {
  const displayStatuses =
    mode === "edit" ? statuses : ["DRAFT", "UNDER_REVIEW"];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">
          Property Title *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          onBlur={() => onBlur("title")}
          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
            touched.title && errors.title ? "border-red-500" : "border-gray-200"
          }`}
          placeholder="e.g., Luxury 3 Bedroom Apartment in Downtown"
        />
        {touched.title && errors.title && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.title}
          </p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          {formData.title.length}/200 characters (min: 10)
        </p>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">
          Description *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          onBlur={() => onBlur("description")}
          rows={6}
          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all resize-none ${
            touched.description && errors.description
              ? "border-red-500"
              : "border-gray-200"
          }`}
          placeholder="Describe your property in detail... (minimum 50 characters)"
        />
        {touched.description && errors.description && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.description}
          </p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          {formData.description.length}/5000 characters (min: 50)
        </p>
      </div>

      {/* Property Type Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">
            Property Type *
          </label>
          <select
            value={formData.propertyType}
            onChange={(e) =>
              onUpdate({ propertyType: e.target.value as PropertyType })
            }
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
          >
            {propertyTypes.map((type) => (
              <option key={type} value={type}>
                {type.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">
            Sub Type
          </label>
          <select
            value={formData.subType || ""}
            onChange={(e) =>
              onUpdate({
                subType: (e.target.value as PropertySubType) || null,
              })
            }
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option value="">Select Sub Type</option>
            {subTypes.map((type) => (
              <option key={type} value={type}>
                {type.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">
            Purpose *
          </label>
          <div className="flex gap-3">
            {purposes.map((purpose) => (
              <button
                key={purpose}
                type="button"
                onClick={() => onUpdate({ purpose })}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                  formData.purpose === purpose
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {purpose}
              </button>
            ))}
          </div>
        </div>

        {mode === "edit" && (
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                onUpdate({ status: e.target.value as PropertyStatus })
              }
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
            >
              {displayStatuses.map((status) => (
                <option key={status} value={status}>
                  {status.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {mode === "create" && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> All new properties are automatically set to{" "}
            <strong>UNDER_REVIEW</strong> status and will be reviewed by
            administrators before becoming public.
          </p>
        </div>
      )}

      {/* Price */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-gray-900 mb-2">
            Price * ({formData.currency})
          </label>
          <div className="relative">
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="number"
              value={formData.price || ""}
              onChange={(e) =>
                onUpdate({ price: parseFloat(e.target.value) || 0 })
              }
              onBlur={() => onBlur("price")}
              className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
                touched.price && errors.price
                  ? "border-red-500"
                  : "border-gray-200"
              }`}
              placeholder="0.00"
            />
          </div>
          {touched.price && errors.price && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.price}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">
            Currency
          </label>
          <select
            value={formData.currency}
            onChange={(e) => onUpdate({ currency: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="KES">KES - Kenyan Shilling</option>
            <option value="INR">INR - Indian Rupee</option>
            <option value="AED">AED - UAE Dirham</option>
            <option value="SAR">SAR - Saudi Riyal</option>
            <option value="AUD">AUD - Australian Dollar</option>
            <option value="CAD">CAD - Canadian Dollar</option>
            <option value="JPY">JPY - Japanese Yen</option>
            <option value="ZAR">ZAR - South African Rand</option>
          </select>
        </div>
      </div>

      {/* Price Negotiable */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.priceNegotiable}
            onChange={(e) => onUpdate({ priceNegotiable: e.target.checked })}
            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm font-semibold text-gray-900">
            Price is negotiable
          </span>
        </label>
      </div>

      {/* Builder Name */}
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">
          Builder / Developer Name
        </label>
        <input
          type="text"
          value={formData.builderName || ""}
          onChange={(e) => onUpdate({ builderName: e.target.value })}
          onBlur={() => onBlur("builderName")}
          placeholder="e.g., Emaar Properties / Prestige Group"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl
               focus:ring-2 focus:ring-blue-500 transition-all"
        />
        {touched.builderName && errors.builderName && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.builderName}
          </p>
        )}
      </div>

      {/* RERA Number */}
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">
          RERA Registration Number
        </label>
        <input
          type="text"
          value={formData.reraNumber || ""}
          onChange={(e) => onUpdate({ reraNumber: e.target.value })}
          onBlur={() => onBlur("reraNumber")}
          placeholder="e.g., PR/KN/12345/004567"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl
               focus:ring-2 focus:ring-blue-500 transition-all"
        />
        {touched.reraNumber && errors.reraNumber && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.reraNumber}
          </p>
        )}
      </div>

      {/* Has Balcony */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.hasBalcony || false}
            onChange={(e) => onUpdate({ hasBalcony: e.target.checked })}
            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm font-semibold text-gray-900">
            Has Balcony
          </span>
        </label>
      </div>
    </div>
  );
};
