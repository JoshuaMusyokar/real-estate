import { useEffect, useState, type ReactNode } from "react";
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
import { PlotDimensionsInput } from "../../../components/form/PlotDimensionsInput";
import { MultiSelectTags } from "../../../components/form/MultiSelectTags";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import TextArea from "../../../components/form/input/TextArea";
import Checkbox from "../../../components/form/input/Checkbox";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/Card";

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
    (state: RootState) => state.propertyForm,
  );

  const [availableFields, setAvailableFields] = useState<string[]>([]);
  const [parkingEnabled, setParkingEnabled] = useState(false);
  const [washroomsEnabled, setWashroomsEnabled] = useState(false);
  const [liftsEnabled, setLiftsEnabled] = useState(false);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});
  const [officeTypeDropdownOpen, setOfficeTypeDropdownOpen] = useState(false);

  // Auto-calculate price per unit
  useEffect(() => {
    const area = formData.carpetArea ?? formData.plotArea;
    if (formData.price && area && area > 0) {
      const pricePerUnit = formData.price / area;
      onUpdate({ pricePerUnit });
    }
  }, [formData.price, formData.carpetArea, formData.plotArea]);

  // Initialize section states
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
          subTypeName.toUpperCase().replace(/ /g, "_"),
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
          (field) => !basicInfoFields.includes(field),
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

  const shouldShowField = (fieldName: string): boolean => {
    const comprehensiveFormdata = { ...formData, subTypeName };
    const conditionalRule =
      CONDITIONAL_FIELDS[fieldName as keyof typeof CONDITIONAL_FIELDS];
    if (!conditionalRule) return true;
    const dependentValue =
      comprehensiveFormdata[
        conditionalRule.dependsOn as keyof PropertyCreateRequest
      ];
    return conditionalRule.showWhen(dependentValue as string);
  };

  const groupFieldsByCategory = () => {
    const categories: Record<
      string,
      { icon: ReactNode; fields: string[]; collapsible?: boolean }
    > = {
      "Property Details": {
        icon: <Home className="w-4 h-4 sm:w-5 sm:h-5" />,
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
      "Retail & Commercial Features": {
        icon: <Building className="w-4 h-4 sm:w-5 sm:h-5" />,
        fields: [
          "storageType",
          "industryType",
          "cornerLocation",
          "locatedIn",
          "frontageWidth",
          "mainRoadFacing",
          "displayWindows",
          "idealFor",
          "fireSafetyApproved",
          "projectName",
          "openSides",
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
      "Financial Details": {
        icon: <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />,
        fields: [
          "monthlyRent",
          "leasePeriod",
          "maintenanceCharges",
          "securityDeposit",
          "pricePerUnit",
        ],
        collapsible: true,
      },
      "Legal & Ownership": {
        icon: <Landmark className="w-4 h-4 sm:w-5 sm:h-5" />,
        fields: [
          "ownershipType",
          "approvedBy",
          "legalDispute",
          "encumbranceFree",
        ],
        collapsible: true,
      },
      "Area Measurements": {
        icon: <Square className="w-4 h-4 sm:w-5 sm:h-5" />,
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
          "openSides",
        ],
        collapsible: true,
      },
      "Tenancy Details": {
        icon: <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />,
        fields: ["preferredTenants", "rentEscalation"],
        collapsible: true,
      },
      "Media & Documentation": {
        icon: <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />,
        fields: [
          "brochureAvailable",
          "floorPlanAvailable",
          "youtubeVideoUrl",
          "virtualTourUrl",
        ],
        collapsible: true,
      },
      "Land Details": {
        icon: <Landmark className="w-4 h-4 sm:w-5 sm:h-5" />,
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
        icon: <Factory className="w-4 h-4 sm:w-5 sm:h-5" />,
        fields: ["ceilingHeight", "loadingDocks", "powerLoad", "flooringType"],
        collapsible: true,
      },
      "General Details": {
        icon: <Wrench className="w-4 h-4 sm:w-5 sm:h-5" />,
        fields: ["yearBuilt", "possessionStatus", "possessionDate"],
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
          (field) => availableFields.includes(field) && shouldShowField(field),
        );
        if (categoryFields.length > 0) {
          result[category] = { icon, fields: categoryFields, collapsible };
        }
      },
    );

    // Handle parking, washrooms, lifts as optional sections
    const parkingFields = [
      "coveredParking",
      "openParking",
      "publicParking",
    ].filter((field) => availableFields.includes(field));
    if (parkingFields.length > 0) {
      result["Parking Facilities"] = {
        icon: <Car className="w-4 h-4 sm:w-5 sm:h-5" />,
        fields: parkingFields,
      };
    }

    const washroomFields = ["privateWashrooms", "publicWashrooms"].filter(
      (field) => availableFields.includes(field),
    );
    if (washroomFields.length > 0) {
      result["Washroom Facilities"] = {
        icon: <Building className="w-4 h-4 sm:w-5 sm:h-5" />,
        fields: washroomFields,
      };
    }

    const liftFields = ["passengerLifts", "serviceLifts"].filter((field) =>
      availableFields.includes(field),
    );
    if (liftFields.length > 0) {
      result["Lift Facilities"] = {
        icon: <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />,
        fields: liftFields,
      };
    }

    return result;
  };

  const fieldCategories = groupFieldsByCategory();

  const toggleSection = (category: string) => {
    setExpandedSections((prev) => ({ ...prev, [category]: !prev[category] }));
  };

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

  const renderField = (fieldName: string) => {
    const fieldMeta = FIELD_METADATA[fieldName as keyof typeof FIELD_METADATA];
    const value: FieldValue =
      formData[fieldName as keyof PropertyCreateRequest];
    const error = errors[fieldName];

    if (!fieldMeta) {
      return renderGenericField(fieldName, value, error);
    }

    if (fieldName === "officeType") {
      return renderMultiSelectField(
        fieldName,
        fieldMeta,
        value as string | undefined,
        error,
      );
    }
    if (fieldName === "plotDimensions") {
      return (
        <PlotDimensionsInput
          value={value as string | null | undefined}
          onChange={(newValue) => onUpdate({ [fieldName]: newValue })}
          onBlur={() => onBlur(fieldName)}
          error={error}
          label={fieldMeta.label}
          required={fieldMeta.required}
        />
      );
    }
    if (fieldName === "preferredTenants" || fieldName === "idealFor") {
      return renderMultiSelectTags(
        fieldName,
        fieldMeta,
        value as string[] | undefined,
        error,
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
          value as boolean | undefined,
        );
      case "select":
        return renderSelectField(
          fieldName,
          fieldMeta,
          value as string | undefined,
          error,
        );
      case "number-with-unit":
        return renderNumberWithUnitField(fieldName, fieldMeta, error);
      case "date":
        return renderDateField(
          fieldName,
          fieldMeta,
          value as Date | string | null | undefined,
          error,
        );
      case "multi-tag":
      case "multi-select":
        if (fieldName === "preferredTenants" || fieldName === "idealFor") {
          return renderMultiSelectTags(
            fieldName,
            fieldMeta,
            value as string[] | undefined,
            error,
          );
        }
        return renderGenericField(fieldName, value, error);
      case "plot-dimensions":
        return (
          <PlotDimensionsInput
            value={value as string | null | undefined}
            onChange={(newValue) => onUpdate({ [fieldName]: newValue })}
            onBlur={() => onBlur(fieldName)}
            error={error}
            label={fieldMeta.label}
            required={fieldMeta.required}
          />
        );
      case "file-upload":
        return <></>;
      default:
        return renderGenericField(fieldName, value, error);
    }
  };

  const renderMultiSelectTags = (
    fieldName: string,
    fieldMeta: FieldMetadata,
    value: string[] | undefined,
    error: string | undefined,
  ) => {
    return (
      <MultiSelectTags
        fieldName={fieldName}
        label={fieldMeta.label}
        options={fieldMeta.options || []}
        value={value}
        error={error}
        required={fieldMeta.required}
        onChange={(field, newValue) => onUpdate({ [field]: newValue })}
      />
    );
  };

  const renderMultiSelectField = (
    fieldName: string,
    fieldMeta: FieldMetadata,
    value: string | undefined,
    error: string | undefined,
  ) => {
    const selectedValues = value
      ? value
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean)
      : [];

    return (
      <div>
        <Label>
          {fieldMeta.label} {fieldMeta.required && "*"}
        </Label>
        <div className="relative">
          <div
            onClick={() => setOfficeTypeDropdownOpen(!officeTypeDropdownOpen)}
            className={`w-full min-h-[44px] px-3 sm:px-4 py-2 sm:py-2.5 border-2 rounded-lg sm:rounded-xl cursor-pointer transition-all ${
              error
                ? "border-error-500"
                : officeTypeDropdownOpen
                  ? "border-brand-500 ring-2 ring-brand-500/20"
                  : "border-gray-300 dark:border-gray-700"
            } ${selectedValues.length > 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"}`}
          >
            {selectedValues.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {selectedValues.map((val) => (
                  <span
                    key={val}
                    className="inline-flex items-center gap-1 px-2 py-0.5 sm:py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-medium rounded-lg"
                  >
                    {val}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeOfficeType(val);
                      }}
                      className="hover:text-blue-900 dark:hover:text-blue-100"
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
              <span className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                Select office types...
              </span>
            )}
            <ChevronDown
              className={`absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-transform ${
                officeTypeDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </div>

          {officeTypeDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setOfficeTypeDropdownOpen(false)}
              />
              <div className="absolute z-20 w-full mt-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl shadow-lg max-h-48 sm:max-h-60 overflow-auto">
                {fieldMeta.options?.map((option) => {
                  const isSelected = selectedValues.includes(option);
                  return (
                    <label
                      key={option}
                      className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                        isSelected ? "bg-blue-50 dark:bg-blue-900/20" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleOfficeTypeChange(option)}
                        className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
                      />
                      <span
                        className={`text-xs sm:text-sm ${
                          isSelected
                            ? "font-semibold text-blue-900 dark:text-blue-100"
                            : "text-gray-900 dark:text-gray-100"
                        }`}
                      >
                        {option}
                      </span>
                      {isSelected && (
                        <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400 ml-auto" />
                      )}
                    </label>
                  );
                })}
              </div>
            </>
          )}
        </div>
        {selectedValues.length > 0 && (
          <p className="mt-1.5 text-xs text-gray-600 dark:text-gray-400">
            {selectedValues.length} office type
            {selectedValues.length !== 1 ? "s" : ""} selected
          </p>
        )}
        {error && (
          <p className="mt-1.5 text-xs text-error-500 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
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
    error: string | undefined,
  ) => {
    if (fieldName === "pricePerUnit") {
      return (
        <div>
          <Label>{fieldMeta.label}</Label>
          <div className="relative">
            <Input
              type="text"
              value={value ? `${Number(value).toFixed(2)}` : "Auto-calculated"}
              disabled
              className="pr-20"
            />
            <span className="absolute right-3 sm:right-4 top-3 text-xs text-gray-500 dark:text-gray-400">
              per {formData.carpetAreaUnit || formData.plotAreaUnit || "sqft"}
            </span>
          </div>
          <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
            Automatically calculated from price and area
          </p>
        </div>
      );
    }

    return (
      <div>
        <Label>
          {fieldMeta.label} {fieldMeta.required && "*"}
        </Label>
        {fieldMeta.type === "textarea" ? (
          <TextArea
            value={(value as string) || ""}
            onChange={(val) => onUpdate({ [fieldName]: val })}
            rows={3}
            error={!!error}
            hint={error}
            placeholder={
              fieldMeta.placeholder ||
              `Enter ${fieldMeta.label.toLowerCase()}...`
            }
          />
        ) : (
          <Input
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
            error={!!error}
            hint={error}
            placeholder={
              fieldMeta.placeholder ||
              `Enter ${fieldMeta.label.toLowerCase()}...`
            }
            min={fieldMeta.min?.toString()}
          />
        )}
      </div>
    );
  };

  const renderCheckboxField = (
    fieldName: string,
    fieldMeta: FieldMetadata,
    value: boolean | undefined,
  ) => {
    return (
      <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
        <Checkbox
          label={fieldMeta.label}
          checked={value || false}
          onChange={(checked) => onUpdate({ [fieldName]: checked })}
        />
      </div>
    );
  };

  const renderSelectField = (
    fieldName: string,
    fieldMeta: FieldMetadata,
    value: string | undefined,
    error: string | undefined,
  ) => {
    return (
      <div>
        <Label>
          {fieldMeta.label} {fieldMeta.required && "*"}
        </Label>
        <select
          value={value || ""}
          onChange={(e) => onUpdate({ [fieldName]: e.target.value || null })}
          onBlur={() => onBlur(fieldName)}
          className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 ${
            error
              ? "border-error-500 focus:border-error-300 focus:ring-error-500/20"
              : "bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700"
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
          <p className="mt-1.5 text-xs text-error-500 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {error}
          </p>
        )}
      </div>
    );
  };

  const renderNumberWithUnitField = (
    fieldName: string,
    fieldMeta: FieldMetadata,
    error: string | undefined,
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
      <div>
        <Label>
          {fieldMeta.label} {fieldMeta.required && "*"}
        </Label>
        <div className="flex gap-2">
          <Input
            type="number"
            value={numberValue || ""}
            onChange={(e) =>
              onUpdate({ [fieldName]: parseFloat(e.target.value) || null })
            }
            placeholder="0"
            min="0"
            step={0.01}
            error={!!error}
            className="flex-1"
          />
          {(fieldMeta.units || unitFieldMeta) && (
            <select
              value={unitValue || ""}
              onChange={(e) =>
                onUpdate({ [unitFieldName]: e.target.value || null })
              }
              className="w-20 sm:w-24 px-2 sm:px-3 py-2.5 border-2 border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all text-xs sm:text-sm dark:bg-gray-900 dark:text-white"
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
          <p className="mt-1.5 text-xs text-error-500 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
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
    error: string | undefined,
  ) => {
    const formatDate = (date: Date | string | null | undefined): string => {
      if (!date) return "";
      if (date instanceof Date) return date.toISOString().split("T")[0];
      if (typeof date === "string") return date.split("T")[0];
      return "";
    };

    return (
      <div>
        <Label>
          {fieldMeta.label} {fieldMeta.required && "*"}
        </Label>
        <Input
          type="date"
          value={formatDate(value)}
          onChange={(e) =>
            onUpdate({
              [fieldName]: e.target.value ? new Date(e.target.value) : null,
            })
          }
          error={!!error}
          hint={error}
        />
      </div>
    );
  };

  const renderGenericField = (
    fieldName: string,
    value: FieldValue,
    error: string | undefined,
  ) => {
    const label = fieldName
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();

    return (
      <div>
        <Label>{label}</Label>
        <Input
          type="text"
          value={(value as string) || ""}
          onChange={(e) => onUpdate({ [fieldName]: e.target.value })}
          placeholder={`Enter ${label.toLowerCase()}...`}
          error={!!error}
          hint={error}
        />
      </div>
    );
  };

  const renderOptionalSection = (
    title: string,
    icon: ReactNode,
    fields: string[],
    enabled: boolean,
    setEnabled: (value: boolean) => void,
  ) => {
    return (
      <Card>
        <CardContent className="p-4 sm:p-5 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                {icon}
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                  {title}
                </h3>
                <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
                  Optional - Enable if applicable
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setEnabled(!enabled);
                if (enabled) {
                  const clearData: any = {};
                  fields.forEach((field) => {
                    clearData[field] = null;
                  });
                  onUpdate(clearData);
                }
              }}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-all text-xs sm:text-sm ${
                enabled
                  ? "bg-brand-600 text-white hover:bg-brand-700"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {enabled ? "Enabled" : "Enable"}
            </button>
          </div>

          {enabled && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {fields.map((field) => (
                <div key={field}>{renderField(field)}</div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (!propertyTypeName || !subTypeName) {
    return (
      <Card>
        <CardContent className="text-center py-8 sm:py-12">
          <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-3 sm:mb-4">
            <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2">
            Select Property Type First
          </h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Please go back to Basic Info step and select a property type and
            subtype.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Property Type Info */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-3 sm:p-4 md:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
            <div>
              <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-300 font-medium mb-0.5 sm:mb-1">
                Configuring details for:
              </p>
              <p className="text-base sm:text-lg md:text-xl font-bold text-blue-900 dark:text-blue-100 capitalize">
                {propertyTypeName.toLowerCase()} - {subTypeName.toLowerCase()}
              </p>
            </div>
            <div className="text-xs sm:text-sm font-semibold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 px-3 py-1.5 rounded-full w-fit">
              {availableFields.length} fields
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Possession Date Notice */}
      {formData.possessionStatus === "Under Construction" &&
        shouldShowField("possessionDate") && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600 rounded-lg p-3 sm:p-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-yellow-800 dark:text-yellow-300">
                Since possession status is "Under Construction", please provide
                the expected possession date.
              </p>
            </div>
          </div>
        )}

      {/* Field Categories */}
      {Object.entries(fieldCategories).map(
        ([category, { icon, fields, collapsible }]) => {
          if (category === "Parking Facilities") {
            return (
              <div key={category}>
                {renderOptionalSection(
                  category,
                  icon,
                  fields,
                  parkingEnabled,
                  setParkingEnabled,
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
                  setWashroomsEnabled,
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
                  setLiftsEnabled,
                )}
              </div>
            );
          }

          const isExpanded = expandedSections[category] !== false;

          return (
            <Card key={category}>
              <CardHeader className="p-4 sm:p-5 md:p-6">
                {collapsible ? (
                  <button
                    type="button"
                    onClick={() => toggleSection(category)}
                    className="w-full flex items-center justify-between group"
                  >
                    <CardTitle className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base md:text-lg">
                      <div className="p-1.5 sm:p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                        {icon}
                      </div>
                      {category}
                    </CardTitle>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                    )}
                  </button>
                ) : (
                  <CardTitle className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base md:text-lg">
                    <div className="p-1.5 sm:p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      {icon}
                    </div>
                    {category}
                  </CardTitle>
                )}
              </CardHeader>

              {(!collapsible || isExpanded) && (
                <CardContent className="p-4 sm:p-5 md:p-6 pt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
                    {fields.map((field) => (
                      <div
                        key={field}
                        className={
                          field === "description" ||
                          field === "youtubeVideoUrl" ||
                          field === "virtualTourUrl"
                            ? "sm:col-span-2 lg:col-span-3"
                            : ""
                        }
                      >
                        {renderField(field)}
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        },
      )}

      {/* No Fields Message */}
      {availableFields.length === 0 && (
        <Card>
          <CardContent className="text-center py-8 sm:py-12 bg-gray-50 dark:bg-gray-800/50">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3 sm:mb-4">
              <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2">
              No Additional Details Required
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              This property type doesn't require additional details. You can
              proceed to the next step.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
