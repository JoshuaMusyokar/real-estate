import { useState } from "react";
import type { AmenityFormData } from "../types";

const initialFormData: AmenityFormData = {
  name: "",
  icon: "",
  category: "",
  order: 0,
  isActive: true,
};

export const useAmenityForm = (initialData = initialFormData) => {
  const [formData, setFormData] = useState<AmenityFormData>(initialData);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const updateFormData = (updates: Partial<AmenityFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setFormErrors({});
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.length < 2) {
      errors.name = "Name must be at least 2 characters";
    } else if (formData.name.length > 50) {
      errors.name = "Name must not exceed 50 characters";
    }

    if (formData.order < 0) {
      errors.order = "Order must be 0 or greater";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return {
    formData,
    formErrors,
    updateFormData,
    resetForm,
    validateForm,
  };
};
