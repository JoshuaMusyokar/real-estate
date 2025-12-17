import { AlertCircle, CheckCircle, ChevronDown, XCircle } from "lucide-react";
import { FIELD_METADATA, type FieldMetadata } from "../config/property-form";
import type { PropertyCreateRequest } from "../types";
import { useState } from "react";

interface RenderFieldProps {
  fieldName: string;
  formData: PropertyCreateRequest;
  errors: Record<string, string>;
  onUpdate: (data: Partial<PropertyCreateRequest>) => void;
  onBlur?: (field: string) => void;
}

export const renderField = ({
  fieldName,
  formData,
  errors,
  onUpdate,
  onBlur = () => {},
}: RenderFieldProps) => {
  const fieldMeta = FIELD_METADATA[fieldName as keyof typeof FIELD_METADATA];

  if (!fieldMeta) {
    return renderGenericField(fieldName, formData, errors, onUpdate, onBlur);
  }

  const value = formData[fieldName as keyof PropertyCreateRequest];
  const error = errors[fieldName];

  switch (fieldMeta.type) {
    case "text":
    case "textarea":
    case "number":
      return renderInputField(
        fieldName,
        fieldMeta,
        value,
        error,
        onUpdate,
        onBlur
      );

    case "checkbox":
      return renderCheckboxField(fieldName, fieldMeta, value, onUpdate);

    case "select":
      return renderSelectField(
        fieldName,
        fieldMeta,
        value,
        error,
        onUpdate,
        onBlur
      );

    case "number-with-unit":
      return renderNumberWithUnitField(
        fieldName,
        fieldMeta,
        formData,
        error,
        onUpdate,
        onBlur
      );

    case "date":
      return renderDateField(
        fieldName,
        fieldMeta,
        value,
        error,
        onUpdate,
        onBlur
      );

    default:
      return renderGenericField(fieldName, formData, errors, onUpdate, onBlur);
  }
};

const renderInputField = (
  fieldName: string,
  fieldMeta: any,
  value: any,
  error: string,
  onUpdate: any,
  onBlur: any
) => {
  // Convert value to string safely
  const displayValue = value != null ? String(value) : "";

  return (
    <div key={fieldName} className="space-y-2">
      <label className="block text-sm font-bold text-gray-900">
        {fieldMeta.label} {fieldMeta.required && "*"}
      </label>
      {fieldMeta.type === "textarea" ? (
        <textarea
          value={displayValue}
          onChange={(e) => onUpdate({ [fieldName]: e.target.value })}
          onBlur={() => onBlur(fieldName)}
          rows={4}
          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
            error ? "border-red-500" : "border-gray-200"
          }`}
          placeholder={
            fieldMeta.placeholder || `Enter ${fieldMeta.label.toLowerCase()}...`
          }
        />
      ) : (
        <input
          type={fieldMeta.type === "number" ? "number" : "text"}
          value={displayValue}
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
          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
            error ? "border-red-500" : "border-gray-200"
          }`}
          placeholder={
            fieldMeta.placeholder || `Enter ${fieldMeta.label.toLowerCase()}...`
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
  fieldMeta: any,
  value: any,
  onUpdate: any
) => {
  return (
    <div
      key={fieldName}
      className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl"
    >
      <input
        type="checkbox"
        id={fieldName}
        checked={value || false}
        onChange={(e) => onUpdate({ [fieldName]: e.target.checked })}
        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <label
        htmlFor={fieldName}
        className="text-sm font-semibold text-gray-900 cursor-pointer flex items-center gap-2"
      >
        {fieldMeta.label}
        {value ? (
          <CheckCircle className="w-4 h-4 text-green-600" />
        ) : (
          <XCircle className="w-4 h-4 text-gray-400" />
        )}
      </label>
    </div>
  );
};

const renderSelectField = (
  fieldName: string,
  fieldMeta: any,
  value: any,
  error: string,
  onUpdate: any,
  onBlur: any
) => {
  // Convert value to string safely
  const displayValue = value != null ? String(value) : "";

  return (
    <div key={fieldName} className="space-y-2">
      <label className="block text-sm font-bold text-gray-900">
        {fieldMeta.label} {fieldMeta.required && "*"}
      </label>
      <select
        value={displayValue}
        onChange={(e) => onUpdate({ [fieldName]: e.target.value || null })}
        onBlur={() => onBlur(fieldName)}
        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
          error ? "border-red-500" : "border-gray-200"
        }`}
      >
        <option value="">Select {fieldMeta.label}</option>
        {fieldMeta.options?.map((option: string) => (
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
  fieldMeta: any,
  formData: PropertyCreateRequest,
  error: string,
  onUpdate: any,
  onBlur: any
) => {
  const unitFieldName = `${fieldName}Unit` as keyof PropertyCreateRequest;
  const fieldValue = formData[fieldName as keyof PropertyCreateRequest];
  const unitValue = formData[unitFieldName];

  // Convert value to string or empty string for input
  const displayValue = typeof fieldValue === "number" ? String(fieldValue) : "";
  const displayUnit = typeof unitValue === "string" ? unitValue : "";

  return (
    <div key={fieldName} className="space-y-2">
      <label className="block text-sm font-bold text-gray-900">
        {fieldMeta.label} {fieldMeta.required && "*"}
      </label>
      <div className="flex gap-2">
        <input
          type="number"
          value={displayValue}
          onChange={(e) =>
            onUpdate({ [fieldName]: parseFloat(e.target.value) || null })
          }
          onBlur={() => onBlur(fieldName)}
          className={`flex-1 px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
            error ? "border-red-500" : "border-gray-200"
          }`}
          placeholder="0"
          min="0"
        />
        <select
          value={displayUnit}
          onChange={(e) =>
            onUpdate({ [unitFieldName]: e.target.value || null })
          }
          className="w-32 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
        >
          <option value="">Unit</option>
          {fieldMeta.units?.map((unit: string) => (
            <option key={unit} value={unit}>
              {unit}
            </option>
          ))}
        </select>
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
  fieldMeta: any,
  value: any,
  error: string,
  onUpdate: any,
  onBlur: any
) => {
  const formatDate = (date: any) => {
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
    <div key={fieldName} className="space-y-2">
      <label className="block text-sm font-bold text-gray-900">
        {fieldMeta.label} {fieldMeta.required && "*"}
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
        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
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
  formData: PropertyCreateRequest,
  errors: Record<string, string>,
  onUpdate: any,
  onBlur: any
) => {
  const value = formData[fieldName as keyof PropertyCreateRequest];
  const error = errors[fieldName];
  const label = fieldName
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();

  // Convert value to string safely for generic fields
  const displayValue =
    value != null && typeof value !== "object" ? String(value) : "";

  return (
    <div key={fieldName} className="space-y-2">
      <label className="block text-sm font-bold text-gray-900 capitalize">
        {label}
      </label>
      <input
        type="text"
        value={displayValue}
        onChange={(e) => onUpdate({ [fieldName]: e.target.value })}
        onBlur={() => onBlur(fieldName)}
        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
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
