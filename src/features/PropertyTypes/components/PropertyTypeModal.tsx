import React, { useState, useEffect } from "react";
import { X, Save, Home } from "lucide-react";
import {
  useCreatePropertyTypeMutation,
  useUpdatePropertyTypeMutation,
} from "../../../services/propertyApi";
import type {
  PropertyType,
  CreatePropertyTypeRequest,
  UpdatePropertyTypeRequest,
} from "../../../types";
import { useToast } from "../../../hooks/useToast";

interface PropertyTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyType?: PropertyType | null;
  onSuccess: () => void;
}

const PropertyTypeModal: React.FC<PropertyTypeModalProps> = ({
  isOpen,
  onClose,
  propertyType,
  onSuccess,
}) => {
  const [createPropertyType, { isLoading: isCreating }] =
    useCreatePropertyTypeMutation();
  const [updatePropertyType, { isLoading: isUpdating }] =
    useUpdatePropertyTypeMutation();

  const [formData, setFormData] = useState<
    CreatePropertyTypeRequest | UpdatePropertyTypeRequest
  >({
    name: "",
    description: "",
    icon: "",
    order: 0,
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const { success, error: showError } = useToast();

  useEffect(() => {
    if (propertyType) {
      setFormData({
        name: propertyType.name,
        description: propertyType.description || "",
        icon: propertyType.icon || "",
        order: propertyType.order,
        isActive: propertyType.isActive,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        icon: "",
        order: 0,
        isActive: true,
      });
    }
    setErrors({});
  }, [propertyType, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.name && !formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name && formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (formData.order && formData.order < 0) {
      newErrors.order = "Order must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (propertyType) {
        await updatePropertyType({
          id: propertyType.id,
          data: formData as UpdatePropertyTypeRequest,
        }).unwrap();
        success("Property type updated successfully");
      } else {
        await createPropertyType(
          formData as CreatePropertyTypeRequest
        ).unwrap();
        success("Property type created successfully");
      }
      onSuccess();
    } catch (error: unknown) {
      if (error instanceof Error) {
        showError(
          error.message ||
            (propertyType
              ? "Failed to update property type"
              : "Failed to create property type")
        );
      } else {
        showError(
          propertyType
            ? "Failed to update property type"
            : "Failed to create property type"
        );
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
          ? Number(value)
          : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                    <Home className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {propertyType
                      ? "Edit Property Type"
                      : "Create Property Type"}
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
                {propertyType
                  ? "Update existing property type"
                  : "Add a new property type to the system"}
              </p>
            </div>

            {/* Body */}
            <div className="px-6 py-4 space-y-4">
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
                  placeholder="e.g., RESIDENTIAL, COMMERCIAL"
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
                  placeholder="Brief description of the property type..."
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
                    placeholder="Icon emoji or class (🏠, home, building)"
                  />
                  {formData.icon && (
                    <div className="flex items-center justify-center w-10 h-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
                      <span className="text-xl">{formData.icon}</span>
                    </div>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Use an emoji or icon class from your icon library
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleChange}
                    min="0"
                    className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors ${
                      errors.order
                        ? "border-red-300 dark:border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  />
                  {errors.order && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.order}
                    </p>
                  )}
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
                  className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isCreating || isUpdating
                    ? "Saving..."
                    : propertyType
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

export default PropertyTypeModal;
