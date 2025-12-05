/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState, useEffect } from "react";
import { X, Save, Layers } from "lucide-react";

import {
  useCreatePropertySubTypeMutation,
  useUpdatePropertySubTypeMutation,
  useGetPropertyTypesQuery,
} from "../../../services/propertyApi";
import type {
  PropertySubType,
  PropertyType,
  CreatePropertySubTypeRequest,
  UpdatePropertySubTypeRequest,
} from "../../../types";
import { useToast } from "../../../hooks/useToast";

interface PropertySubTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertySubType?: PropertySubType | null;
  onSuccess: () => void;
}

const PropertySubTypeModal: React.FC<PropertySubTypeModalProps> = ({
  isOpen,
  onClose,
  propertySubType,
  onSuccess,
}) => {
  const { data: propertyTypesData } = useGetPropertyTypesQuery({
    isActive: true,
  });
  const [createPropertySubType, { isLoading: isCreating }] =
    useCreatePropertySubTypeMutation();
  const [updatePropertySubType, { isLoading: isUpdating }] =
    useUpdatePropertySubTypeMutation();
  const { success, error: showError } = useToast();

  const propertyTypes = propertyTypesData?.data || [];

  const [formData, setFormData] = useState<CreatePropertySubTypeRequest>({
    propertyTypeId: "",
    name: "",
    description: "",
    icon: "",
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (propertySubType) {
      setFormData({
        propertyTypeId: propertySubType.propertyTypeId,
        name: propertySubType.name,
        description: propertySubType.description || "",
        icon: propertySubType.icon || "",
        isActive: propertySubType.isActive,
      });
    } else {
      setFormData({
        propertyTypeId: propertyTypes[0]?.id || "",
        name: "",
        description: "",
        icon: "",
        isActive: true,
      });
    }
    setErrors({});
  }, [propertySubType, propertyTypes, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.propertyTypeId) {
      newErrors.propertyTypeId = "Property type is required";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (propertySubType) {
        const { propertyTypeId, ...updateData } = formData;

        await updatePropertySubType({
          id: propertySubType.id,
          data: updateData as UpdatePropertySubTypeRequest,
        }).unwrap();

        success("Property subtype updated successfully");
      } else {
        await createPropertySubType(formData).unwrap();
        success("Property subtype created successfully");
      }

      onSuccess();
    } catch (error: unknown) {
      if (error instanceof Error) {
        showError(
          error.message ||
            (propertySubType
              ? "Failed to update subtype"
              : "Failed to create subtype")
        );
      } else {
        showError(
          propertySubType
            ? "Failed to update subtype"
            : "Failed to create subtype"
        );
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center mr-3">
                    <Layers className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {propertySubType
                      ? "Edit Property SubType"
                      : "Create Property SubType"}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {propertySubType
                  ? "Update existing property subtype"
                  : "Add a new property subtype"}
              </p>
            </div>

            {/* Body */}
            <div className="px-6 py-4 space-y-4">
              {/* Property Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Property Type *
                </label>
                <select
                  name="propertyTypeId"
                  value={formData.propertyTypeId}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors ${
                    errors.propertyTypeId
                      ? "border-red-300 dark:border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  disabled={!!propertySubType}
                >
                  <option value="">Select a property type</option>
                  {propertyTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
                {errors.propertyTypeId && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.propertyTypeId}
                  </p>
                )}
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors ${
                    errors.name
                      ? "border-red-300 dark:border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder="e.g., APARTMENT, VILLA, OFFICE"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description || ""}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                  placeholder="Brief description of the property subtype..."
                />
              </div>

              {/* Icon */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Icon
                </label>
                <div className="flex space-x-4">
                  <input
                    type="text"
                    name="icon"
                    value={formData.icon || ""}
                    onChange={handleChange}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                    placeholder="Icon emoji or class (🏢, apartment, villa)"
                  />
                  {formData.icon && (
                    <div className="flex items-center justify-center w-10 h-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
                      <span className="text-xl">{formData.icon}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  name="isActive"
                  value={formData.isActive ? "true" : "false"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isActive: e.target.value === "true",
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-3 sm:mt-0 w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isCreating || isUpdating
                    ? "Saving..."
                    : propertySubType
                    ? "Update"
                    : "Create"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PropertySubTypeModal;
