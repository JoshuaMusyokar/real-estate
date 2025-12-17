// BasicInfoStep.tsx - Updated with financial details
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AlertCircle, DollarSign, Loader2, Info, Landmark } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  useGetPropertyTypesQuery,
  useGetSubTypesByPropertyTypeIdQuery,
} from "../../../services/propertyApi";
import type {
  PropertyCreateRequest,
  PropertyPurpose,
  PropertyStatus,
  PropertySubType,
  PropertyType,
} from "../../../types";
import {
  setPropertyType,
  setSubType,
} from "../../../store/slices/propertyFormSlice";

interface BasicInfoStepProps {
  formData: PropertyCreateRequest;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  mode: "create" | "edit";
  onUpdate: (data: Partial<PropertyCreateRequest>) => void;
  onBlur: (field: string) => void;
}

const purposes: PropertyPurpose[] = ["SALE", "RENT", "PG"];

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
  const [localSubTypes, setLocalSubTypes] = useState<PropertySubType[]>([]);
  const dispatch = useDispatch();

  // Fetch property types
  const { data: propertyTypesData, isLoading: loadingPropertyTypes } =
    useGetPropertyTypesQuery({ isActive: true });

  // Fetch subtypes when property type is selected
  const { data: subtypesData, isLoading: loadingSubTypes } =
    useGetSubTypesByPropertyTypeIdQuery(formData.propertyTypeId, {
      skip: !formData.propertyTypeId,
    });

  const propertyTypes = propertyTypesData?.data || [];
  const allSubTypes = subtypesData?.data || [];

  useEffect(() => {
    if (!formData.propertyTypeId) {
      setLocalSubTypes([]);
      return;
    }

    // Wait until subtypes are actually loaded
    if (!subtypesData) return;

    const filtered = allSubTypes.filter(
      (st) => st.propertyTypeId === formData.propertyTypeId
    );

    setLocalSubTypes(filtered);

    // Now safely validate subtype
    if (
      formData.subTypeId &&
      !filtered.some((st) => st.id === formData.subTypeId)
    ) {
      handleSubTypeChange(null);
    }
  }, [formData.propertyTypeId, formData.subTypeId, allSubTypes, subtypesData]);

  const displayStatuses =
    mode === "edit" ? statuses : ["DRAFT", "UNDER_REVIEW"];

  const handlePropertyTypeChange = (typeId: string) => {
    const selectedType = propertyTypes.find((type) => type.id === typeId);

    if (selectedType) {
      dispatch(
        setPropertyType({
          id: typeId,
          name: selectedType.name,
        })
      );
    }

    onUpdate({
      propertyTypeId: typeId,
      subTypeId: null,
    });
  };

  const handleSubTypeChange = (subTypeId: string | null) => {
    const selectedSubType = localSubTypes.find((st) => st.id === subTypeId);

    if (selectedSubType) {
      dispatch(
        setSubType({
          id: subTypeId!,
          name: selectedSubType.name,
        })
      );
    } else {
      dispatch(setSubType(null));
    }

    onUpdate({ subTypeId });
  };

  // Handle currency change
  const handleCurrencyChange = (currency: string) => {
    onUpdate({ currency });
  };

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

      {/* Complex Name */}
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">
          Complex Name
        </label>
        <input
          type="text"
          value={formData.complexName || ""}
          onChange={(e) => onUpdate({ complexName: e.target.value })}
          onBlur={() => onBlur("complexName")}
          placeholder="e.g., Palm Grove Residency"
          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
            touched.complexName && errors.complexName
              ? "border-red-500"
              : "border-gray-200"
          }`}
        />
        {touched.complexName && errors.complexName && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.complexName}
          </p>
        )}
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
        {/* Property Type */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">
            Property Type *
          </label>
          <div className="relative">
            <select
              value={formData.propertyTypeId || ""}
              onChange={(e) => handlePropertyTypeChange(e.target.value)}
              onBlur={() => onBlur("propertyTypeId")}
              disabled={loadingPropertyTypes}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all appearance-none ${
                touched.propertyTypeId && errors.propertyTypeId
                  ? "border-red-500"
                  : "border-gray-200"
              } ${loadingPropertyTypes ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <option value="">Select Property Type</option>
              {propertyTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.icon && <span className="mr-2">{type.icon}</span>}
                  {type.name.replace("_", " ")}
                </option>
              ))}
            </select>
            {loadingPropertyTypes && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
              </div>
            )}
          </div>
          {touched.propertyTypeId && errors.propertyTypeId && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.propertyTypeId}
            </p>
          )}
        </div>

        {/* Sub Type */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">
            Sub Type
          </label>
          <div className="relative">
            <select
              value={formData.subTypeId || ""}
              onChange={(e) => handleSubTypeChange(e.target.value || null)}
              onBlur={() => onBlur("subTypeId")}
              disabled={!formData.propertyTypeId || loadingSubTypes}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all appearance-none ${
                touched.subTypeId && errors.subTypeId
                  ? "border-red-500"
                  : "border-gray-200"
              } ${
                !formData.propertyTypeId ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <option value="">Select Sub Type</option>
              {localSubTypes.map((subType) => (
                <option key={subType.id} value={subType.id}>
                  {subType.icon && <span className="mr-2">{subType.icon}</span>}
                  {subType.name.replace("_", " ")}
                  {!subType.isActive && " (Inactive)"}
                </option>
              ))}
            </select>
            {loadingSubTypes && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
              </div>
            )}
          </div>
          {touched.subTypeId && errors.subTypeId && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.subTypeId}
            </p>
          )}
          {!formData.propertyTypeId && (
            <p className="mt-1 text-xs text-gray-500">
              Select a property type first
            </p>
          )}
        </div>

        {/* Purpose */}
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

        {/* Status (Edit mode only) */}
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

      {/* Financial Details Section */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Financial Details
        </h3>

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
                min="0"
                step="0.01"
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
              onChange={(e) => handleCurrencyChange(e.target.value)}
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

        {/* Price Negotiable and Stamp Duty Excluded */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div>
            <label className="flex items-center gap-3 cursor-pointer p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                checked={formData.priceNegotiable}
                onChange={(e) =>
                  onUpdate({ priceNegotiable: e.target.checked })
                }
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="text-sm font-semibold text-gray-900">
                  Price is negotiable
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  Buyers/renters can negotiate the price
                </p>
              </div>
            </label>
          </div>

          <div>
            <label className="flex items-center gap-3 cursor-pointer p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                checked={formData.stampDutyExcluded || false}
                onChange={(e) =>
                  onUpdate({ stampDutyExcluded: e.target.checked })
                }
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="text-sm font-semibold text-gray-900">
                  Stamp duty excluded
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  Buyer pays stamp duty separately
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Additional Financial Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Maintenance Charges */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Monthly Maintenance Charges ({formData.currency})
            </label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={formData.maintenanceCharges || ""}
                onChange={(e) =>
                  onUpdate({
                    maintenanceCharges: parseFloat(e.target.value) || null,
                  })
                }
                onBlur={() => onBlur("maintenanceCharges")}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            {touched.maintenanceCharges && errors.maintenanceCharges && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.maintenanceCharges}
              </p>
            )}
          </div>

          {/* Security Deposit */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Security Deposit ({formData.currency})
            </label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={formData.securityDeposit || ""}
                onChange={(e) =>
                  onUpdate({
                    securityDeposit: parseFloat(e.target.value) || null,
                  })
                }
                onBlur={() => onBlur("securityDeposit")}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            {touched.securityDeposit && errors.securityDeposit && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.securityDeposit}
              </p>
            )}
          </div>

          {/* Monthly Rent (conditional based on purpose) */}
          {formData.purpose === "RENT" && (
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Monthly Rent ({formData.currency})
              </label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={formData.monthlyRent || ""}
                  onChange={(e) =>
                    onUpdate({
                      monthlyRent: parseFloat(e.target.value) || null,
                    })
                  }
                  onBlur={() => onBlur("monthlyRent")}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              {touched.monthlyRent && errors.monthlyRent && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.monthlyRent}
                </p>
              )}
            </div>
          )}

          {/* Lease Period (conditional based on purpose) */}
          {formData.purpose === "RENT" && (
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Lease Period
              </label>
              <input
                type="text"
                value={formData.leasePeriod || ""}
                onChange={(e) =>
                  onUpdate({ leasePeriod: e.target.value || null })
                }
                onBlur={() => onBlur("leasePeriod")}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="e.g., 12 months, 24 months"
              />
              {touched.leasePeriod && errors.leasePeriod && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.leasePeriod}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Financial Information Note */}
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="space-y-2">
              <p className="text-sm font-medium text-blue-800">
                Financial Terms Information
              </p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>
                  • Price is the total sale price for SALE or LEASE purposes
                </li>
                <li>
                  • For RENT purpose, Monthly Rent is the recurring amount
                </li>
                <li>
                  • Security deposit is typically refundable at the end of lease
                </li>
                <li>
                  • Maintenance charges are monthly fees for common facilities
                </li>
                <li>
                  • Stamp duty is a government tax on property transactions
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Property Information Section */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Property Information
        </h3>

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
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
          />
          {touched.builderName && errors.builderName && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.builderName}
            </p>
          )}
        </div>

        {/* RERA Number */}
        <div className="mt-4">
          <label className="block text-sm font-bold text-gray-900 mb-2">
            RERA Registration Number
          </label>
          <input
            type="text"
            value={formData.reraNumber || ""}
            onChange={(e) => onUpdate({ reraNumber: e.target.value })}
            onBlur={() => onBlur("reraNumber")}
            placeholder="e.g., PR/KN/12345/004567"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
          />
          {touched.reraNumber && errors.reraNumber && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.reraNumber}
            </p>
          )}
        </div>

        {/* Has Balcony */}
        <div className="mt-4">
          <label className="flex items-center gap-3 cursor-pointer p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <input
              type="checkbox"
              checked={formData.hasBalcony || false}
              onChange={(e) => onUpdate({ hasBalcony: e.target.checked })}
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="text-sm font-semibold text-gray-900">
                Has Balcony
              </span>
              <p className="text-xs text-gray-500 mt-1">
                Property includes a balcony or terrace
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Loading States */}
      {loadingPropertyTypes && (
        <div className="flex items-center justify-center p-4 bg-gray-50 rounded-xl">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="ml-2 text-sm text-gray-600">
            Loading property types...
          </span>
        </div>
      )}
    </div>
  );
};
