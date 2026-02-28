import {
  AlertCircle,
  DollarSign,
  Loader2,
  Info,
  Home,
  Building2,
  FileText,
} from "lucide-react";
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
} from "../../../types";
import {
  setPropertyType,
  setSubType,
} from "../../../store/slices/propertyFormSlice";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/Card";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import TextArea from "../../../components/form/input/TextArea";
import Checkbox from "../../../components/form/input/Checkbox";

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

const currencies = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ" },
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "ZAR", name: "South African Rand", symbol: "R" },
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

  const { data: propertyTypesData, isLoading: loadingPropertyTypes } =
    useGetPropertyTypesQuery({ isActive: true });

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

    if (!subtypesData) return;

    const filtered = allSubTypes.filter(
      (st) => st.propertyTypeId === formData.propertyTypeId,
    );

    setLocalSubTypes(filtered);

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
        }),
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
        }),
      );
    } else {
      dispatch(setSubType(null));
    }

    onUpdate({ subTypeId });
  };

  const getCurrencySymbol = () => {
    return currencies.find((c) => c.code === formData.currency)?.symbol || "$";
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Basic Information Card */}
      <Card>
        <CardHeader className="p-4 sm:p-5 md:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 md:p-6 pt-0 space-y-4 sm:space-y-5">
          {/* Title */}
          <div>
            <Label>Property Title *</Label>
            <Input
              type="text"
              value={formData.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              placeholder="e.g., Luxury 3 Bedroom Apartment in Downtown"
              error={touched.title && !!errors.title}
              hint={
                touched.title && errors.title
                  ? errors.title
                  : `${formData.title.length}/200 characters (min: 10)`
              }
            />
          </div>

          {/* Complex Name */}
          <div>
            <Label>Complex Name</Label>
            <Input
              type="text"
              value={formData.complexName || ""}
              onChange={(e) => onUpdate({ complexName: e.target.value })}
              placeholder="e.g., Palm Grove Residency"
              error={touched.complexName && !!errors.complexName}
              hint={touched.complexName ? errors.complexName : undefined}
            />
          </div>

          {/* Description */}
          <div>
            <Label>Description *</Label>
            <TextArea
              value={formData.description}
              onChange={(value) => onUpdate({ description: value })}
              placeholder="Describe your property in detail... (minimum 50 characters)"
              rows={5}
              error={touched.description && !!errors.description}
              hint={
                touched.description && errors.description
                  ? errors.description
                  : `${formData.description.length}/5000 characters (min: 50)`
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Property Type & Classification Card */}
      <Card>
        <CardHeader className="p-4 sm:p-5 md:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
            <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
            Property Classification
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 md:p-6 pt-0 space-y-4 sm:space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {/* Property Type */}
            <div>
              <Label>Property Type *</Label>
              <div className="relative">
                <select
                  value={formData.propertyTypeId || ""}
                  onChange={(e) => handlePropertyTypeChange(e.target.value)}
                  onBlur={() => onBlur("propertyTypeId")}
                  disabled={loadingPropertyTypes}
                  className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 ${
                    touched.propertyTypeId && errors.propertyTypeId
                      ? "border-error-500 focus:border-error-300 focus:ring-error-500/20"
                      : "bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700"
                  } ${loadingPropertyTypes ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <option value="">Select Property Type</option>
                  {propertyTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name.replace("_", " ")}
                    </option>
                  ))}
                </select>
                {loadingPropertyTypes && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-gray-400" />
                  </div>
                )}
              </div>
              {touched.propertyTypeId && errors.propertyTypeId && (
                <p className="mt-1.5 text-xs text-error-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.propertyTypeId}
                </p>
              )}
            </div>

            {/* Sub Type */}
            <div>
              <Label>Sub Type</Label>
              <div className="relative">
                <select
                  value={formData.subTypeId || ""}
                  onChange={(e) => handleSubTypeChange(e.target.value || null)}
                  onBlur={() => onBlur("subTypeId")}
                  disabled={!formData.propertyTypeId || loadingSubTypes}
                  className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 ${
                    touched.subTypeId && errors.subTypeId
                      ? "border-error-500 focus:border-error-300 focus:ring-error-500/20"
                      : "bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700"
                  } ${!formData.propertyTypeId ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <option value="">Select Sub Type</option>
                  {localSubTypes.map((subType) => (
                    <option key={subType.id} value={subType.id}>
                      {subType.name.replace("_", " ")}
                      {!subType.isActive && " (Inactive)"}
                    </option>
                  ))}
                </select>
                {loadingSubTypes && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-gray-400" />
                  </div>
                )}
              </div>
              {touched.subTypeId && errors.subTypeId && (
                <p className="mt-1.5 text-xs text-error-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.subTypeId}
                </p>
              )}
              {!formData.propertyTypeId && (
                <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                  Select a property type first
                </p>
              )}
            </div>
          </div>

          {/* Purpose */}
          <div>
            <Label>Purpose *</Label>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {purposes.map((purpose) => (
                <button
                  key={purpose}
                  type="button"
                  onClick={() => onUpdate({ purpose })}
                  className={`py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all text-sm sm:text-base ${
                    formData.purpose === purpose
                      ? "bg-brand-500 text-white shadow-lg"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
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
              <Label>Status</Label>
              <select
                value={formData.status}
                onChange={(e) =>
                  onUpdate({ status: e.target.value as PropertyStatus })
                }
                className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              >
                {displayStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>
          )}

          {mode === "create" && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg sm:rounded-xl p-3 sm:p-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-300">
                  <strong>Note:</strong> All new properties are automatically
                  set to <strong>UNDER_REVIEW</strong> status and will be
                  reviewed by administrators before becoming public.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Financial Details Card */}
      <Card>
        <CardHeader className="p-4 sm:p-5 md:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
            <DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />
            Financial Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 md:p-6 pt-0 space-y-4 sm:space-y-5">
          {/* Price and Currency */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            <div className="sm:col-span-2">
              <Label>Price * ({getCurrencySymbol()})</Label>
              <div className="relative">
                <Input
                  type="number"
                  value={formData.price || ""}
                  onChange={(e) =>
                    onUpdate({ price: parseFloat(e.target.value) || 0 })
                  }
                  placeholder="0.00"
                  min="0"
                  step={0.01}
                  className="pl-10"
                  error={touched.price && !!errors.price}
                  hint={touched.price ? errors.price : undefined}
                />
                <span className="absolute left-3 sm:left-4 top-3 text-gray-400 dark:text-gray-500 text-sm font-medium">
                  {getCurrencySymbol()}
                </span>
              </div>
            </div>

            <div>
              <Label>Currency</Label>
              <select
                value={formData.currency}
                onChange={(e) => onUpdate({ currency: e.target.value })}
                className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              >
                {currencies.map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.code}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
              <Checkbox
                label="Price is negotiable"
                checked={formData.priceNegotiable}
                onChange={(checked) => onUpdate({ priceNegotiable: checked })}
              />
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1 ml-8">
                Buyers/renters can negotiate
              </p>
            </div>

            <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
              <Checkbox
                label="Stamp duty excluded"
                checked={formData.stampDutyExcluded || false}
                onChange={(checked) => onUpdate({ stampDutyExcluded: checked })}
              />
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1 ml-8">
                Buyer pays separately
              </p>
            </div>
          </div>

          {/* Additional Financial Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <Label>Monthly Maintenance ({getCurrencySymbol()})</Label>
              <div className="relative">
                <Input
                  type="number"
                  value={formData.maintenanceCharges || ""}
                  onChange={(e) =>
                    onUpdate({
                      maintenanceCharges: parseFloat(e.target.value) || null,
                    })
                  }
                  placeholder="0.00"
                  min="0"
                  step={0.01}
                  className="pl-10"
                />
                <span className="absolute left-3 sm:left-4 top-3 text-gray-400 dark:text-gray-500 text-sm">
                  {getCurrencySymbol()}
                </span>
              </div>
            </div>

            <div>
              <Label>Security Deposit ({getCurrencySymbol()})</Label>
              <div className="relative">
                <Input
                  type="number"
                  value={formData.securityDeposit || ""}
                  onChange={(e) =>
                    onUpdate({
                      securityDeposit: parseFloat(e.target.value) || null,
                    })
                  }
                  placeholder="0.00"
                  min="0"
                  step={0.01}
                  className="pl-10"
                />
                <span className="absolute left-3 sm:left-4 top-3 text-gray-400 dark:text-gray-500 text-sm">
                  {getCurrencySymbol()}
                </span>
              </div>
            </div>

            {/* Conditional Rent Fields */}
            {formData.purpose === "RENT" && (
              <>
                <div>
                  <Label>Monthly Rent ({getCurrencySymbol()})</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      value={formData.monthlyRent || ""}
                      onChange={(e) =>
                        onUpdate({
                          monthlyRent: parseFloat(e.target.value) || null,
                        })
                      }
                      placeholder="0.00"
                      min="0"
                      step={0.01}
                      className="pl-10"
                    />
                    <span className="absolute left-3 sm:left-4 top-3 text-gray-400 dark:text-gray-500 text-sm">
                      {getCurrencySymbol()}
                    </span>
                  </div>
                </div>

                <div>
                  <Label>Lease Period</Label>
                  <Input
                    type="text"
                    value={formData.leasePeriod || ""}
                    onChange={(e) =>
                      onUpdate({ leasePeriod: e.target.value || null })
                    }
                    placeholder="e.g., 12 months"
                  />
                </div>
              </>
            )}
          </div>

          {/* Financial Info Note */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg sm:rounded-xl p-3 sm:p-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1.5 sm:space-y-2">
                <p className="text-xs sm:text-sm font-medium text-blue-800 dark:text-blue-300">
                  Financial Terms Information
                </p>
                <ul className="text-[10px] sm:text-xs text-blue-700 dark:text-blue-400 space-y-0.5 sm:space-y-1">
                  <li>• Price is total sale price for SALE/LEASE</li>
                  <li>• Monthly Rent is recurring for RENT purpose</li>
                  <li>• Security deposit is typically refundable</li>
                  <li>• Maintenance fees cover common facilities</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Property Information Card */}
      <Card>
        <CardHeader className="p-4 sm:p-5 md:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
            <Home className="w-5 h-5 sm:w-6 sm:h-6" />
            Property Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 md:p-6 pt-0 space-y-4 sm:space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <Label>Builder / Developer Name</Label>
              <Input
                type="text"
                value={formData.builderName || ""}
                onChange={(e) => onUpdate({ builderName: e.target.value })}
                placeholder="e.g., Emaar Properties"
              />
            </div>

            <div>
              <Label>RERA Registration Number</Label>
              <Input
                type="text"
                value={formData.reraNumber || ""}
                onChange={(e) => onUpdate({ reraNumber: e.target.value })}
                placeholder="e.g., PR/KN/12345/004567"
              />
            </div>
          </div>

          <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <Checkbox
              label="Has Balcony"
              checked={formData.hasBalcony || false}
              onChange={(checked) => onUpdate({ hasBalcony: checked })}
            />
            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1 ml-8">
              Property includes a balcony or terrace
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loadingPropertyTypes && (
        <div className="flex items-center justify-center p-4 sm:p-6 bg-gray-50 dark:bg-gray-800 rounded-lg sm:rounded-xl">
          <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin text-brand-600 mr-2 sm:mr-3" />
          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Loading property types...
          </span>
        </div>
      )}
    </div>
  );
};
