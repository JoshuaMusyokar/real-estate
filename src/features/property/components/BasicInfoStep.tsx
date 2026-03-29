import {
  AlertCircle,
  DollarSign,
  Loader2,
  Info,
  Home,
  Building2,
  FileText,
  User,
  Phone,
  Mail,
  Plus,
  Trash2,
  CheckCircle2,
  EyeOff,
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
import { formatToIndianUnits } from "../../../utils/formatter";

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
  // { code: "USD", symbol: "$" },
  // { code: "EUR", symbol: "€" },
  // { code: "GBP", symbol: "£" },
  // { code: "KES", symbol: "KSh" },
  { code: "INR", symbol: "₹" },
  // { code: "AED", symbol: "د.إ" },
  // { code: "SAR", symbol: "﷼" },
  // { code: "AUD", symbol: "A$" },
  // { code: "CAD", symbol: "C$" },
  // { code: "JPY", symbol: "¥" },
  // { code: "ZAR", symbol: "R" },
];

const MAX_PHONES = 5;
const isValidPhone = (v: string) => /^[+]?[\d\s\-().]{7,15}$/.test(v.trim());
const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

const inputCls = (hasErr: boolean) =>
  `h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs
   focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90
   ${
     hasErr
       ? "border-error-500 focus:border-error-300 focus:ring-error-500/20"
       : "bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700"
   }`;

// ─────────────────────────────────────────────────────────────────────────────
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

  const phones: string[] = formData.ownerPhones?.length
    ? formData.ownerPhones
    : [""];

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
    )
      handleSubTypeChange(null);
  }, [formData.propertyTypeId, formData.subTypeId, allSubTypes, subtypesData]);

  const displayStatuses =
    mode === "edit" ? statuses : ["DRAFT", "UNDER_REVIEW"];

  const handlePropertyTypeChange = (typeId: string) => {
    const sel = propertyTypes.find((t) => t.id === typeId);
    if (sel) dispatch(setPropertyType({ id: typeId, name: sel.name }));
    onUpdate({ propertyTypeId: typeId, subTypeId: null });
  };

  const handleSubTypeChange = (subTypeId: string | null) => {
    const sel = localSubTypes.find((st) => st.id === subTypeId);
    if (sel) dispatch(setSubType({ id: subTypeId!, name: sel.name }));
    else dispatch(setSubType(null));
    onUpdate({ subTypeId });
  };

  const getCurrencySymbol = () =>
    currencies.find((c) => c.code === formData.currency)?.symbol || "$";

  const setPhone = (index: number, value: string) => {
    const next = [...phones];
    next[index] = value;
    onUpdate({ ownerPhones: next, ownerPhone: next[0] || "" });
  };

  const addPhone = () => {
    if (phones.length >= MAX_PHONES) return;
    onUpdate({ ownerPhones: [...phones, ""] });
  };

  const removePhone = (index: number) => {
    if (index === 0) return;
    const next = phones.filter((_, i) => i !== index);
    onUpdate({ ownerPhones: next, ownerPhone: next[0] || "" });
  };

  const nameComplete = (formData.ownerName || "").trim().length >= 2;
  const emailComplete = isValidEmail(formData.ownerEmail || "");
  const phonesComplete = phones.length > 0 && isValidPhone(phones[0] || "");

  const nameErr = touched.ownerName && !!errors.ownerName;
  const emailErr = touched.ownerEmail && !!errors.ownerEmail;
  const phonesErr = Object.keys(errors).some(
    (k) => k.startsWith("ownerPhones") && touched[k],
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* ── Basic Information ─────────────────────────────────────────────── */}
      <Card>
        <CardHeader className="p-4 sm:p-5 md:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6" /> Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 md:p-6 pt-0 space-y-4 sm:space-y-5">
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

      {/* ── Property Classification ───────────────────────────────────────── */}
      <Card>
        <CardHeader className="p-4 sm:p-5 md:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
            <Building2 className="w-5 h-5 sm:w-6 sm:h-6" /> Property
            Classification
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 md:p-6 pt-0 space-y-4 sm:space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <Label>Property Type *</Label>
              <div className="relative">
                <select
                  value={formData.propertyTypeId || ""}
                  onChange={(e) => handlePropertyTypeChange(e.target.value)}
                  onBlur={() => onBlur("propertyTypeId")}
                  disabled={loadingPropertyTypes}
                  className={`${inputCls(touched.propertyTypeId && !!errors.propertyTypeId)} ${loadingPropertyTypes ? "opacity-50 cursor-not-allowed" : ""}`}
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
                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                  </div>
                )}
              </div>
              {touched.propertyTypeId && errors.propertyTypeId && (
                <p className="mt-1.5 text-xs text-error-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />{" "}
                  {errors.propertyTypeId}
                </p>
              )}
            </div>
            <div>
              <Label>Sub Type</Label>
              <div className="relative">
                <select
                  value={formData.subTypeId || ""}
                  onChange={(e) => handleSubTypeChange(e.target.value || null)}
                  onBlur={() => onBlur("subTypeId")}
                  disabled={!formData.propertyTypeId || loadingSubTypes}
                  className={`${inputCls(touched.subTypeId && !!errors.subTypeId)} ${!formData.propertyTypeId ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <option value="">Select Sub Type</option>
                  {localSubTypes.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name.replace("_", " ")}
                      {!st.isActive && " (Inactive)"}
                    </option>
                  ))}
                </select>
                {loadingSubTypes && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                  </div>
                )}
              </div>
              {touched.subTypeId && errors.subTypeId && (
                <p className="mt-1.5 text-xs text-error-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.subTypeId}
                </p>
              )}
              {!formData.propertyTypeId && (
                <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                  Select a property type first
                </p>
              )}
            </div>
          </div>

          <div>
            <Label>Purpose *</Label>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {purposes.map((purpose) => (
                <button
                  key={purpose}
                  type="button"
                  onClick={() => onUpdate({ purpose })}
                  className={`py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all text-sm sm:text-base
                    ${
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

          {mode === "edit" && (
            <div>
              <Label>Status</Label>
              <select
                value={formData.status}
                onChange={(e) =>
                  onUpdate({ status: e.target.value as PropertyStatus })
                }
                className={inputCls(false)}
              >
                {displayStatuses.map((s) => (
                  <option key={s} value={s}>
                    {s.replace("_", " ")}
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
                  set to <strong>UNDER_REVIEW</strong> and will be reviewed
                  before going public.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Financial Details ─────────────────────────────────────────────── */}
      <Card>
        <CardHeader className="p-4 sm:p-5 md:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
            <DollarSign className="w-5 h-5 sm:w-6 sm:h-6" /> Financial Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 md:p-6 pt-0 space-y-4 sm:space-y-5">
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
              {formData.price > 0 && (
                <p className="mt-1 text-xs text-gray-500">
                  ≈ {formatToIndianUnits(formData.price)}
                </p>
              )}
            </div>
            <div>
              <Label>Currency</Label>
              <select
                value={formData.currency}
                onChange={(e) => onUpdate({ currency: e.target.value })}
                className={inputCls(false)}
              >
                {currencies.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code}
                  </option>
                ))}
              </select>
            </div>
          </div>

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

      {/* ── Property Information ──────────────────────────────────────────── */}
      <Card>
        <CardHeader className="p-4 sm:p-5 md:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
            <Home className="w-5 h-5 sm:w-6 sm:h-6" /> Property Information
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

      {/* ── Owner Contact Details ─────────────────────────────────────────── */}
      <Card>
        <CardHeader className="p-4 sm:p-5 md:p-6 pb-3">
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
              <User className="w-5 h-5 sm:w-6 sm:h-6" /> Owner Contact Details
            </CardTitle>
            <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 px-2.5 py-1 rounded-full flex-shrink-0">
              <EyeOff className="w-3 h-3" />
              <span className="text-[10px] sm:text-xs font-semibold">
                Hidden from public
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-5 md:p-6 pt-0 space-y-5">
          {/* ── Owner Name ──────────────────────────────────────────────── */}
          <div>
            <Label className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-gray-400" /> Owner Full Name
            </Label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={formData.ownerName || ""}
                onChange={(e) => onUpdate({ ownerName: e.target.value })}
                onBlur={() => onBlur("ownerName")}
                placeholder="e.g., Rajesh Kumar"
                autoComplete="off"
                className={`${inputCls(nameErr)} pl-10`}
              />
            </div>
            {nameErr && (
              <p className="mt-1.5 text-xs text-error-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.ownerName}
              </p>
            )}
            {nameComplete && !nameErr && (
              <p className="mt-1.5 text-xs text-success-500 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Saved
              </p>
            )}
          </div>

          {/* ── Phone Numbers ───────────────────────────────────────────── */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="flex items-center gap-1.5 mb-0">
                <Phone className="w-3.5 h-3.5 text-gray-400" /> Owner Phone
                Number{phones.length > 1 ? "s" : ""}
              </Label>
              {phones.length < MAX_PHONES && (
                <button
                  type="button"
                  onClick={addPhone}
                  className="flex items-center gap-1 text-[11px] text-brand-600 hover:text-brand-700 font-semibold transition-colors"
                >
                  <Plus className="w-3 h-3" /> Add Number
                </button>
              )}
            </div>

            <div className="space-y-2.5">
              {phones.map((phone, index) => (
                <div key={index}>
                  <div className="flex items-center gap-2">
                    {/* Primary / extra badge */}
                    <span
                      className={`text-[10px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full flex-shrink-0
                      ${
                        index === 0
                          ? "bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-500"
                      }`}
                    >
                      {index === 0 ? "Primary" : `#${index + 1}`}
                    </span>

                    <div className="relative flex-1">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(index, e.target.value)}
                        onBlur={() => onBlur(`ownerPhones_${index}`)}
                        placeholder={
                          index === 0 ? "Primary number" : "Additional number"
                        }
                        autoComplete="off"
                        className={`${inputCls(!!errors[`ownerPhones_${index}`] && !!touched[`ownerPhones_${index}`])} pl-10`}
                      />
                    </div>

                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removePhone(index)}
                        className="w-9 h-9 flex items-center justify-center rounded-lg text-error-400 hover:bg-error-50 dark:hover:bg-error-900/20 hover:text-error-600 transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {errors[`ownerPhones_${index}`] &&
                    touched[`ownerPhones_${index}`] && (
                      <p className="mt-1 ml-16 text-xs text-error-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />{" "}
                        {errors[`ownerPhones_${index}`]}
                      </p>
                    )}
                  {phone && isValidPhone(phone) && (
                    <p className="mt-1 ml-16 text-xs text-success-500 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Valid
                    </p>
                  )}
                </div>
              ))}
            </div>

            {phones.length >= MAX_PHONES && (
              <p className="mt-2 text-[11px] text-gray-400">
                Maximum {MAX_PHONES} numbers reached.
              </p>
            )}
          </div>

          {/* ── Email ───────────────────────────────────────────────────── */}
          <div>
            <Label className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-gray-400" /> Owner Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="email"
                value={formData.ownerEmail || ""}
                onChange={(e) => onUpdate({ ownerEmail: e.target.value })}
                onBlur={() => onBlur("ownerEmail")}
                placeholder="e.g., owner@example.com"
                autoComplete="off"
                className={`${inputCls(emailErr)} pl-10`}
              />
            </div>
            {emailErr && (
              <p className="mt-1.5 text-xs text-error-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.ownerEmail}
              </p>
            )}
            {emailComplete && !emailErr && (
              <p className="mt-1.5 text-xs text-success-500 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Saved
              </p>
            )}
          </div>

          {/* ── Completion summary ───────────────────────────────────────── */}
          <div className="flex items-center gap-4 flex-wrap pt-1 border-t border-gray-100 dark:border-gray-700">
            {[
              { label: "Name", done: nameComplete },
              { label: "Phone", done: phonesComplete },
              { label: "Email", done: emailComplete },
            ].map(({ label, done }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div
                  className={`w-2 h-2 rounded-full ${done ? "bg-success-500" : "bg-gray-300 dark:bg-gray-600"}`}
                />
                <span
                  className={`text-[11px] font-medium ${done ? "text-success-600 dark:text-success-400" : "text-gray-400"}`}
                >
                  {label}
                </span>
              </div>
            ))}
            <span className="text-[10px] text-gray-400 ml-auto">
              {
                [nameComplete, phonesComplete, emailComplete].filter(Boolean)
                  .length
              }
              /3 completed
            </span>
          </div>
        </CardContent>
      </Card>

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
