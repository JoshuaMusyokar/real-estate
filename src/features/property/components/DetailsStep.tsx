/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState, useRef, type ReactNode } from "react";
import {
  Building2,
  CheckCircle,
  AlertCircle,
  Home,
  Square,
  Building,
  Landmark,
  Factory,
  Car,
  DollarSign,
  MapPin,
  Zap,
  Wrench,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type {
  NearbyPlace,
  PropertyCreateRequest,
  PropertyImageInput,
} from "../../../types";
import {
  PROPERTY_FIELD_CONFIG,
  FIELD_METADATA,
  type FieldMetadata,
  getRequiredFields,
  CONDITIONAL_FIELDS,
} from "../../../config/property-form";
import { useAppSelector } from "../../../hooks";
import type { RootState } from "../../../store/store";

interface DetailsStepProps {
  formData: PropertyCreateRequest;
  errors: Record<string, string>;
  onUpdate: (data: Partial<PropertyCreateRequest>) => void;
  onBlur: (field: string) => void;
}

type FieldValue =
  | string
  | number
  | boolean
  | Date
  | null
  | undefined
  | string[]
  | NearbyPlace[]
  | PropertyImageInput[];

export const DetailsStep: React.FC<DetailsStepProps> = ({
  formData,
  errors,
  onUpdate,
  onBlur,
}) => {
  const { propertyTypeName, subTypeName } = useAppSelector(
    (state: RootState) => state.propertyForm
  );
  const [availableFields, setAvailableFields] = useState<string[]>([]);

  // Section visibility states
  const [parkingEnabled, setParkingEnabled] = useState(false);
  const [washroomsEnabled, setWashroomsEnabled] = useState(false);
  const [liftsEnabled, setLiftsEnabled] = useState(false);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});

  // Multi-select dropdown state
  const [officeTypeDropdownOpen, setOfficeTypeDropdownOpen] = useState(false);

  // Auto-calculate price per unit
  useEffect(() => {
    if (formData.price && formData.carpetArea) {
      const pricePerUnit = formData.price / formData.carpetArea;
      onUpdate({ pricePerUnit });
    }
  }, [formData.price, formData.carpetArea]);

  // Initialize section states based on existing data
  useEffect(() => {
    if (
      formData.coveredParking ||
      formData.openParking ||
      formData.publicParking
    ) {
      setParkingEnabled(true);
    }
    if (formData.privateWashrooms || formData.publicWashrooms) {
      setWashroomsEnabled(true);
    }
    if (formData.passengerLifts || formData.serviceLifts) {
      setLiftsEnabled(true);
    }
  }, []);

  useEffect(() => {
    if (propertyTypeName && subTypeName) {
      try {
        const propertyTypeKey = propertyTypeName
          .toUpperCase()
          .replace(/ /g, "_") as keyof typeof PROPERTY_FIELD_CONFIG;

        const typeSpecificFields = getRequiredFields(
          propertyTypeKey,
          subTypeName.toUpperCase().replace(/ /g, "_")
        );

        const basicInfoFields = [
          "title",
          "description",
          "purpose",
          "price",
          "currency",
          "priceNegotiable",
          "address",
          "cityId",
          "locality",
          "state",
          "country",
          "zipCode",
          "complexName",
          "propertyTypeId",
          "subTypeId",
          "status",
          "builderName",
          "reraNumber",
          "hasBalcony",
        ];

        const detailsFields = typeSpecificFields.filter(
          (field) => !basicInfoFields.includes(field)
        );

        setAvailableFields(detailsFields);
      } catch (error) {
        console.error("Error getting required fields:", error);
        setAvailableFields([]);
      }
    } else {
      setAvailableFields([]);
    }
  }, [propertyTypeName, subTypeName]);

  // Check if field should be displayed based on conditional logic
  const shouldShowField = (fieldName: string): boolean => {
    const conditionalRule =
      CONDITIONAL_FIELDS[fieldName as keyof typeof CONDITIONAL_FIELDS];

    if (!conditionalRule) return true;

    const dependentValue =
      formData[conditionalRule.dependsOn as keyof PropertyCreateRequest];
    return conditionalRule.showWhen(dependentValue as string);
  };

  // Group fields by category with enhanced organization
  const groupFieldsByCategory = () => {
    const categories: Record<
      string,
      { icon: ReactNode; fields: string[]; collapsible?: boolean }
    > = {
      "Room Details": {
        icon: <Home className="w-5 h-5" />,
        fields: [
          "bedrooms",
          "bathrooms",
          "balconies",
          "floorNumber",
          "totalFloors",
          "totalFlats",
          "totalBuildings",
          "floors",
          "furnishingStatus",
        ],
        collapsible: true,
      },
      "Area Measurements": {
        icon: <Square className="w-5 h-5" />,
        fields: [
          "carpetArea",
          "builtUpArea",
          "superBuiltArea",
          "plotArea",
          "squareFeet",
          "squareMeters",
          "plotDimensions",
          "coveredArea",
          "openArea",
        ],
        collapsible: true,
      },
      "Commercial Details": {
        icon: <Building className="w-5 h-5" />,
        fields: [
          "projectName",
          "locatedWithin",
          "officeType",
          "officesPerFloor",
          "officesInProject",
          "buildingsInProject",
          "cabins",
          "seats",
          "conferenceRooms",
          "receptionArea",
          "meetingRooms",
          "pantryType",
          "preRented",
          "nocCertified",
          "occupancyCertified",
          "developerName",
          "projectReraNumber",
        ],
        collapsible: true,
      },
      "Land Details": {
        icon: <Landmark className="w-5 h-5" />,
        fields: [
          "boundaryWall",
          "cornerPlot",
          "facingDirection",
          "zoningType",
          "clearTitle",
          "developmentStatus",
          "roadWidth",
          "electricityAvailable",
          "waterConnection",
          "sewageConnection",
        ],
        collapsible: true,
      },
      "Industrial Details": {
        icon: <Factory className="w-5 h-5" />,
        fields: ["ceilingHeight", "loadingDocks", "powerLoad", "flooringType"],
        collapsible: true,
      },
      "Financial Details": {
        icon: <DollarSign className="w-5 h-5" />,
        fields: [
          "monthlyRent",
          "leasePeriod",
          "availabilityStatus",
          "availabilityType",
          "maintenanceCharges",
          "securityDeposit",
          "pricePerUnit",
        ],
        collapsible: true,
      },
      "General Details": {
        icon: <Wrench className="w-5 h-5" />,
        fields: ["yearBuilt", "possessionStatus", "possessionDate"],
        collapsible: true,
      },
      "Features & Media": {
        icon: <MapPin className="w-5 h-5" />,
        fields: ["youtubeVideoUrl", "virtualTourUrl", "nearbyPlaces"],
        collapsible: true,
      },
    };

    const result: Record<
      string,
      { icon: ReactNode; fields: string[]; collapsible?: boolean }
    > = {};

    Object.entries(categories).forEach(
      ([category, { icon, fields, collapsible }]) => {
        const categoryFields = fields.filter(
          (field) => availableFields.includes(field) && shouldShowField(field)
        );
        if (categoryFields.length > 0) {
          result[category] = { icon, fields: categoryFields, collapsible };
        }
      }
    );

    // Handle parking as optional section
    const parkingFields = [
      "coveredParking",
      "openParking",
      "publicParking",
    ].filter((field) => availableFields.includes(field));
    if (parkingFields.length > 0) {
      result["Parking Facilities"] = {
        icon: <Car className="w-5 h-5" />,
        fields: parkingFields,
      };
    }

    // Handle washrooms as optional section
    const washroomFields = ["privateWashrooms", "publicWashrooms"].filter(
      (field) => availableFields.includes(field)
    );
    if (washroomFields.length > 0) {
      result["Washroom Facilities"] = {
        icon: <Building className="w-5 h-5" />,
        fields: washroomFields,
      };
    }

    // Handle lifts as optional section
    const liftFields = ["passengerLifts", "serviceLifts"].filter((field) =>
      availableFields.includes(field)
    );
    if (liftFields.length > 0) {
      result["Lift Facilities"] = {
        icon: <Building2 className="w-5 h-5" />,
        fields: liftFields,
      };
    }

    return result;
  };

  const fieldCategories = groupFieldsByCategory();

  const toggleSection = (category: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // Multi-select handler for office type
  const handleOfficeTypeChange = (value: string) => {
    const currentValues = formData.officeType
      ? formData.officeType
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean)
      : [];
    const index = currentValues.indexOf(value);

    let newValues: string[];
    if (index > -1) {
      newValues = currentValues.filter((_, i) => i !== index);
    } else {
      newValues = [...currentValues, value];
    }

    onUpdate({ officeType: newValues.join(", ") });
  };

  const removeOfficeType = (option: string) => {
    const currentValues = formData.officeType
      ? formData.officeType
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean)
      : [];
    const newValues = currentValues.filter((v) => v !== option);
    onUpdate({ officeType: newValues.join(", ") });
  };

  // Handle field rendering
  const renderField = (fieldName: string) => {
    const fieldMeta = FIELD_METADATA[fieldName as keyof typeof FIELD_METADATA];
    const value: FieldValue =
      formData[fieldName as keyof PropertyCreateRequest];
    const error = errors[fieldName];

    if (!fieldMeta) {
      return renderGenericField(fieldName, value, error);
    }

    // Special handling for office type
    if (fieldName === "officeType") {
      return renderMultiSelectField(
        fieldName,
        fieldMeta,
        value as string | undefined,
        error
      );
    }

    switch (fieldMeta.type) {
      case "text":
      case "textarea":
      case "number":
        return renderInputField(fieldName, fieldMeta, value, error);

      case "checkbox":
        return renderCheckboxField(
          fieldName,
          fieldMeta,
          value as boolean | undefined
        );

      case "select":
        return renderSelectField(
          fieldName,
          fieldMeta,
          value as string | undefined,
          error
        );

      case "number-with-unit":
        return renderNumberWithUnitField(fieldName, fieldMeta, error);

      case "date":
        return renderDateField(
          fieldName,
          fieldMeta,
          value as Date | string | null | undefined,
          error
        );

      case "multi-tag":
      case "multi-select":
        if (fieldName === "nearbyPlaces" || fieldName === "amenities") {
          return <></>;
        }
        return renderGenericField(fieldName, value, error);

      case "file-upload":
        return <></>;

      default:
        return renderGenericField(fieldName, value, error);
    }
  };

  const renderMultiSelectField = (
    fieldName: string,
    fieldMeta: FieldMetadata,
    value: string | undefined,
    error: string | undefined
  ) => {
    const selectedValues = value
      ? value
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean)
      : [];

    return (
      <div className="space-y-2">
        <label className="block text-sm font-bold text-gray-900">
          {fieldMeta.label}{" "}
          {fieldMeta.required && <span className="text-red-500">*</span>}
        </label>

        <div className="relative">
          {/* Selected values display */}
          <div
            onClick={() => setOfficeTypeDropdownOpen(!officeTypeDropdownOpen)}
            className={`w-full min-h-[48px] px-4 py-2 border-2 rounded-xl cursor-pointer transition-all ${
              error
                ? "border-red-500"
                : officeTypeDropdownOpen
                ? "border-blue-500 ring-2 ring-blue-500"
                : "border-gray-200"
            } ${selectedValues.length > 0 ? "bg-white" : "bg-gray-50"}`}
          >
            {selectedValues.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {selectedValues.map((val) => (
                  <span
                    key={val}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg"
                  >
                    {val}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeOfficeType(val);
                      }}
                      className="hover:text-blue-900"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-gray-500">Select office types...</span>
            )}
            <ChevronDown
              className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-transform ${
                officeTypeDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </div>

          {/* Dropdown options */}
          {officeTypeDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setOfficeTypeDropdownOpen(false)}
              />
              <div className="absolute z-20 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto">
                {fieldMeta.options?.map((option) => {
                  const isSelected = selectedValues.includes(option);
                  return (
                    <label
                      key={option}
                      className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                        isSelected ? "bg-blue-50" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleOfficeTypeChange(option)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span
                        className={`text-sm ${
                          isSelected
                            ? "font-semibold text-blue-900"
                            : "text-gray-900"
                        }`}
                      >
                        {option}
                      </span>
                      {isSelected && (
                        <CheckCircle className="w-4 h-4 text-blue-600 ml-auto" />
                      )}
                    </label>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {selectedValues.length > 0 && (
          <p className="text-xs text-gray-600">
            {selectedValues.length} office type
            {selectedValues.length !== 1 ? "s" : ""} selected
          </p>
        )}

        {error && (
          <p className="text-xs text-red-600 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {error}
          </p>
        )}
      </div>
    );
  };

  const renderInputField = (
    fieldName: string,
    fieldMeta: FieldMetadata,
    value: FieldValue,
    error: string | undefined
  ) => {
    // Special handling for pricePerUnit - read-only
    if (fieldName === "pricePerUnit") {
      return (
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            {fieldMeta.label}
          </label>
          <div className="relative">
            <input
              type="text"
              value={value ? `${Number(value).toFixed(2)}` : "Auto-calculated"}
              readOnly
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500">
              per {formData.carpetAreaUnit || "sqft"}
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Automatically calculated from price and carpet area
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <label className="block text-sm font-bold text-gray-900">
          {fieldMeta.label}{" "}
          {fieldMeta.required && <span className="text-red-500">*</span>}
        </label>
        {fieldMeta.type === "textarea" ? (
          <textarea
            value={(value as string) || ""}
            onChange={(e) => onUpdate({ [fieldName]: e.target.value })}
            onBlur={() => onBlur(fieldName)}
            rows={3}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
              error ? "border-red-500" : "border-gray-200"
            }`}
            placeholder={
              fieldMeta.placeholder ||
              `Enter ${fieldMeta.label.toLowerCase()}...`
            }
          />
        ) : (
          <input
            type={fieldMeta.type === "number" ? "number" : "text"}
            value={(value as string | number) || ""}
            onChange={(e) => {
              if (fieldMeta.type === "number") {
                const numValue =
                  e.target.value === "" ? null : parseFloat(e.target.value);
                onUpdate({ [fieldName]: numValue });
              } else {
                onUpdate({ [fieldName]: e.target.value });
              }
            }}
            onBlur={() => onBlur(fieldName)}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
              error ? "border-red-500" : "border-gray-200"
            }`}
            placeholder={
              fieldMeta.placeholder ||
              `Enter ${fieldMeta.label.toLowerCase()}...`
            }
            min={fieldMeta.min}
          />
        )}
        {error && (
          <p className="text-xs text-red-600 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {error}
          </p>
        )}
      </div>
    );
  };

  const renderCheckboxField = (
    fieldName: string,
    fieldMeta: FieldMetadata,
    value: boolean | undefined
  ) => {
    return (
      <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
        <input
          type="checkbox"
          id={fieldName}
          checked={value || false}
          onChange={(e) => onUpdate({ [fieldName]: e.target.checked })}
          className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="text-sm font-semibold text-gray-900">
          {fieldMeta.label}
        </span>
        {value && <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />}
      </label>
    );
  };

  const renderSelectField = (
    fieldName: string,
    fieldMeta: FieldMetadata,
    value: string | undefined,
    error: string | undefined
  ) => {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-bold text-gray-900">
          {fieldMeta.label}{" "}
          {fieldMeta.required && <span className="text-red-500">*</span>}
        </label>
        <select
          value={value || ""}
          onChange={(e) => onUpdate({ [fieldName]: e.target.value || null })}
          onBlur={() => onBlur(fieldName)}
          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
            error ? "border-red-500" : "border-gray-200"
          }`}
        >
          <option value="">Select {fieldMeta.label}</option>
          {fieldMeta.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {error && (
          <p className="text-xs text-red-600 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {error}
          </p>
        )}
      </div>
    );
  };

  const renderNumberWithUnitField = (
    fieldName: string,
    fieldMeta: FieldMetadata,
    error: string | undefined
  ) => {
    const unitFieldName = `${fieldName}Unit` as keyof PropertyCreateRequest;
    const unitValue = formData[unitFieldName] as string | undefined;
    const numberValue = formData[fieldName as keyof PropertyCreateRequest] as
      | number
      | null
      | undefined;

    const unitFieldMeta =
      FIELD_METADATA[unitFieldName as keyof typeof FIELD_METADATA];

    return (
      <div className="space-y-2">
        <label className="block text-sm font-bold text-gray-900">
          {fieldMeta.label}{" "}
          {fieldMeta.required && <span className="text-red-500">*</span>}
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={numberValue || ""}
            onChange={(e) =>
              onUpdate({ [fieldName]: parseFloat(e.target.value) || null })
            }
            onBlur={() => onBlur(fieldName)}
            className={`flex-1 px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
              error ? "border-red-500" : "border-gray-200"
            }`}
            placeholder="0"
            min="0"
            step="0.01"
          />
          {(fieldMeta.units || unitFieldMeta) && (
            <select
              value={unitValue || ""}
              onChange={(e) =>
                onUpdate({ [unitFieldName]: e.target.value || null })
              }
              className="w-24 sm:w-32 px-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
            >
              <option value="">Unit</option>
              {(fieldMeta.units || unitFieldMeta?.options)?.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          )}
        </div>
        {error && (
          <p className="text-xs text-red-600 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {error}
          </p>
        )}
      </div>
    );
  };

  const renderDateField = (
    fieldName: string,
    fieldMeta: FieldMetadata,
    value: Date | string | null | undefined,
    error: string | undefined
  ) => {
    const formatDate = (date: Date | string | null | undefined): string => {
      if (!date) return "";
      if (date instanceof Date) {
        return date.toISOString().split("T")[0];
      }
      if (typeof date === "string") {
        return date.split("T")[0];
      }
      return "";
    };

    return (
      <div className="space-y-2">
        <label className="block text-sm font-bold text-gray-900">
          {fieldMeta.label}{" "}
          {fieldMeta.required && <span className="text-red-500">*</span>}
        </label>
        <input
          type="date"
          value={formatDate(value)}
          onChange={(e) =>
            onUpdate({
              [fieldName]: e.target.value ? new Date(e.target.value) : null,
            })
          }
          onBlur={() => onBlur(fieldName)}
          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
            error ? "border-red-500" : "border-gray-200"
          }`}
        />
        {error && (
          <p className="text-xs text-red-600 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {error}
          </p>
        )}
      </div>
    );
  };

  const renderGenericField = (
    fieldName: string,
    value: FieldValue,
    error: string | undefined
  ) => {
    const label = fieldName
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();

    return (
      <div className="space-y-2">
        <label className="block text-sm font-bold text-gray-900 capitalize">
          {label}
        </label>
        <input
          type="text"
          value={(value as string) || ""}
          onChange={(e) => onUpdate({ [fieldName]: e.target.value })}
          onBlur={() => onBlur(fieldName)}
          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
            error ? "border-red-500" : "border-gray-200"
          }`}
          placeholder={`Enter ${label.toLowerCase()}...`}
        />
        {error && (
          <p className="text-xs text-red-600 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {error}
          </p>
        )}
      </div>
    );
  };

  // Render optional facility section
  const renderOptionalSection = (
    title: string,
    icon: ReactNode,
    fields: string[],
    enabled: boolean,
    setEnabled: (value: boolean) => void
  ) => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-3">
            {icon}
            <div>
              <h3 className="text-base font-bold text-gray-900">{title}</h3>
              <p className="text-xs text-gray-600">
                Optional - Enable if applicable
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setEnabled(!enabled);
              if (enabled) {
                // Clear values when disabled
                const clearData: any = {};
                fields.forEach((field) => {
                  clearData[field] = null;
                });
                onUpdate(clearData);
              }
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              enabled
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {enabled ? "Enabled" : "Enable"}
          </button>
        </div>

        {enabled && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pl-4">
            {fields.map((field) => (
              <div key={field}>{renderField(field)}</div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (!propertyTypeName || !subTypeName) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Building2 className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          Select Property Type First
        </h3>
        <p className="text-gray-600">
          Please go back to Basic Info step and select a property type and
          subtype to see relevant details.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Property Type Info */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-sm text-blue-800 font-medium mb-1">
              Configuring details for:
            </p>
            <p className="text-lg md:text-xl font-bold text-blue-900 capitalize">
              {propertyTypeName.toLowerCase()} - {subTypeName.toLowerCase()}
            </p>
          </div>
          <div className="text-sm font-semibold text-blue-700 bg-blue-100 px-4 py-2 rounded-full w-fit">
            {availableFields.length} fields
          </div>
        </div>
      </div>

      {/* Conditional possession date notice */}
      {formData.possessionStatus === "Under Construction" &&
        shouldShowField("possessionDate") && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-800">
                Since possession status is "Under Construction", please provide
                the expected possession date.
              </p>
            </div>
          </div>
        )}

      {/* Render fields by category */}
      <div className="space-y-6 md:space-y-8">
        {Object.entries(fieldCategories).map(
          ([category, { icon, fields, collapsible }]) => {
            // Handle optional sections
            if (category === "Parking Facilities") {
              return (
                <div key={category}>
                  {renderOptionalSection(
                    category,
                    icon,
                    fields,
                    parkingEnabled,
                    setParkingEnabled
                  )}
                </div>
              );
            }

            if (category === "Washroom Facilities") {
              return (
                <div key={category}>
                  {renderOptionalSection(
                    category,
                    icon,
                    fields,
                    washroomsEnabled,
                    setWashroomsEnabled
                  )}
                </div>
              );
            }

            if (category === "Lift Facilities") {
              return (
                <div key={category}>
                  {renderOptionalSection(
                    category,
                    icon,
                    fields,
                    liftsEnabled,
                    setLiftsEnabled
                  )}
                </div>
              );
            }

            const isExpanded = expandedSections[category] !== false;

            return (
              <div
                key={category}
                className="bg-white border-2 border-gray-100 rounded-2xl p-4 md:p-6 hover:border-gray-200 transition-colors"
              >
                {collapsible ? (
                  <button
                    type="button"
                    onClick={() => toggleSection(category)}
                    className="w-full flex items-center justify-between mb-4 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                        {icon}
                      </div>
                      <h3 className="text-base md:text-lg font-bold text-gray-900">
                        {category}
                      </h3>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                ) : (
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-50 rounded-lg">{icon}</div>
                    <h3 className="text-base md:text-lg font-bold text-gray-900">
                      {category}
                    </h3>
                  </div>
                )}

                {(!collapsible || isExpanded) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                    {fields.map((field) => (
                      <div
                        key={field}
                        className={
                          field === "description" ||
                          field === "youtubeVideoUrl" ||
                          field === "virtualTourUrl"
                            ? "md:col-span-2 xl:col-span-3"
                            : ""
                        }
                      >
                        {renderField(field)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          }
        )}
      </div>

      {/* No fields message */}
      {availableFields.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-2xl">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            No Additional Details Required
          </h3>
          <p className="text-gray-600">
            This property type doesn't require additional details. You can
            proceed to the next step.
          </p>
        </div>
      )}
    </div>
  );
};
