import React, { useState, useEffect } from "react";
import { X, Loader2, User, Home, AlertCircle, TrendingUp } from "lucide-react";
import { useUpdateLeadMutation } from "../../../services/leadApi";
import { useGetPropertyTypesQuery } from "../../../services/propertyApi";
import type {
  LeadResponse,
  UpdateLeadInput,
  LeadStage,
  LeadPriority,
  PropertyPurpose,
} from "../../../types";
import { LEAD_STAGES, LEAD_PRIORITIES } from "../../../utils";

// Validation functions
const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validatePhone = (phone: string): boolean => {
  return /^\+?[1-9]\d{1,14}$/.test(phone.replace(/[\s-]/g, ""));
};

interface UpdateLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: LeadResponse;
  onSuccess: () => void;
}

export const UpdateLeadModal: React.FC<UpdateLeadModalProps> = ({
  isOpen,
  onClose,
  lead,
  onSuccess,
}) => {
  const [updateLead, { isLoading }] = useUpdateLeadMutation();
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch property types
  const { data: propertyTypesData, isLoading: loadingPropertyTypes } =
    useGetPropertyTypesQuery({ isActive: true }, { skip: !isOpen });

  const [formData, setFormData] = useState<UpdateLeadInput>({
    firstName: lead.firstName,
    lastName: lead.lastName,
    email: lead.email,
    phone: lead.phone,
    alternatePhone: lead.alternatePhone,
    city: lead.city,
    localities: lead.localities,
    propertyTypeId: lead.propertyTypeId,
    purpose: lead.purpose as PropertyPurpose,
    minPrice: lead.minPrice,
    maxPrice: lead.maxPrice,
    bedrooms: lead.bedrooms,
    requirements: lead.requirements,
    stage: lead.stage,
    priority: lead.priority,
    tags: lead.tags,
  });

  const propertyTypes = propertyTypesData?.data || [];

  useEffect(() => {
    if (isOpen) {
      setFormData({
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        phone: lead.phone,
        alternatePhone: lead.alternatePhone,
        city: lead.city,
        localities: lead.localities,
        propertyTypeId: lead.propertyTypeId,
        purpose: lead.purpose as PropertyPurpose,
        minPrice: lead.minPrice,
        maxPrice: lead.maxPrice,
        bedrooms: lead.bedrooms,
        requirements: lead.requirements,
        stage: lead.stage,
        priority: lead.priority,
        tags: lead.tags,
      });
      setErrors({});
    }
  }, [isOpen, lead]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName?.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phone?.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Invalid phone format";
    }

    if (formData.alternatePhone && !validatePhone(formData.alternatePhone)) {
      newErrors.alternatePhone = "Invalid phone format";
    }

    if (
      formData.minPrice &&
      formData.maxPrice &&
      formData.minPrice > formData.maxPrice
    ) {
      newErrors.maxPrice = "Max price must be greater than min price";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await updateLead({ id: lead.id, data: formData }).unwrap();
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to update lead:", error);
      setErrors({ submit: "Failed to update lead. Please try again." });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center z-60 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Update Lead
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Edit lead information and preferences
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {errors.submit && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <span className="text-red-700 dark:text-red-300">
                {errors.submit}
              </span>
            </div>
          )}

          {/* Personal Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.firstName || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-white ${
                    errors.firstName
                      ? "border-red-500 dark:border-red-400"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.lastName || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-white ${
                    errors.email
                      ? "border-red-500 dark:border-red-400"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  value={formData.phone || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-white ${
                    errors.phone
                      ? "border-red-500 dark:border-red-400"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Alternate Phone
                </label>
                <input
                  type="tel"
                  value={formData.alternatePhone || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, alternatePhone: e.target.value })
                  }
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-white ${
                    errors.alternatePhone
                      ? "border-red-500 dark:border-red-400"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                />
                {errors.alternatePhone && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.alternatePhone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Property Preferences */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Home className="w-5 h-5" />
              Property Preferences
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Property Type
                </label>
                <div className="relative">
                  <select
                    value={formData.propertyTypeId || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        propertyTypeId: e.target.value,
                      })
                    }
                    disabled={loadingPropertyTypes}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-white appearance-none"
                  >
                    <option value="">Select property type</option>
                    {propertyTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.icon && <span className="mr-2">{type.icon}</span>}
                        {type.name.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                  {loadingPropertyTypes && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Purpose
                </label>
                <select
                  value={formData.purpose || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      purpose: e.target.value as PropertyPurpose,
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                >
                  <option value="">Select purpose</option>
                  <option value="SALE">Sale</option>
                  <option value="RENT">Rent</option>
                  <option value="LEASE">Lease</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Min Price
                </label>
                <input
                  type="number"
                  value={formData.minPrice || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      minPrice: Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Max Price
                </label>
                <input
                  type="number"
                  value={formData.maxPrice || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxPrice: Number(e.target.value),
                    })
                  }
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-white ${
                    errors.maxPrice
                      ? "border-red-500 dark:border-red-400"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                />
                {errors.maxPrice && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.maxPrice}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bedrooms
                </label>
                <input
                  type="text"
                  value={formData.bedrooms || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, bedrooms: e.target.value })
                  }
                  placeholder="e.g., 2-3"
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={formData.city || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Requirements
              </label>
              <textarea
                value={formData.requirements || ""}
                onChange={(e) =>
                  setFormData({ ...formData, requirements: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                placeholder="Additional requirements..."
              />
            </div>
          </div>

          {/* Lead Status */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Lead Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Stage
                </label>
                <select
                  value={formData.stage}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stage: e.target.value as LeadStage,
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                >
                  {LEAD_STAGES.map((stage) => (
                    <option key={stage} value={stage}>
                      {stage.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      priority: e.target.value as LeadPriority,
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                >
                  {LEAD_PRIORITIES.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Lead"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
