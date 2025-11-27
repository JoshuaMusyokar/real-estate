// hooks/usePropertyValidation.ts
import { useState } from "react";
import type { PropertyCreateRequest } from "../types";
import type { PropertyImageFile } from "../types";

export const usePropertyValidation = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (fieldName: string, value: any): string => {
    switch (fieldName) {
      case "title":
        if (!value || !value.trim()) return "Title is required";
        if (value.trim().length < 10)
          return "Title must be at least 10 characters";
        if (value.trim().length > 200)
          return "Title must not exceed 200 characters";
        break;

      case "description":
        if (!value || !value.trim()) return "Description is required";
        if (value.trim().length < 50)
          return "Description must be at least 50 characters";
        if (value.trim().length > 5000)
          return "Description must not exceed 5000 characters";
        break;

      case "price":
        if (!value || value <= 0) return "Price must be greater than 0";
        if (value > 1000000000) return "Price seems unrealistic";
        break;

      case "address":
        if (!value || !value.trim()) return "Address is required";
        if (value.trim().length < 5)
          return "Address must be at least 5 characters";
        break;

      case "city":
        if (!value || !value.trim()) return "City is required";
        break;

      case "locality":
        if (!value || !value.trim()) return "Locality is required";
        break;

      case "country":
        if (!value || !value.trim()) return "Country is required";
        break;

      case "bedrooms":
        if (value !== null && value !== undefined && value < 0)
          return "Bedrooms cannot be negative";
        if (value > 50) return "Number of bedrooms seems unrealistic";
        break;

      case "bathrooms":
        if (value !== null && value !== undefined && value < 0)
          return "Bathrooms cannot be negative";
        if (value > 50) return "Number of bathrooms seems unrealistic";
        break;

      case "squareFeet":
        if (value !== null && value !== undefined) {
          if (value < 50) return "Square feet seems too small";
          if (value > 1000000) return "Square feet seems too large";
        }
        break;

      case "yearBuilt": {
        const currentYear = new Date().getFullYear();
        if (value !== null && value !== undefined) {
          if (value < 1800) return "Year built seems too old";
          if (value > currentYear + 5)
            return "Year built cannot be more than 5 years in future";
        }
        break;
      }

      case "youtubeVideoUrl":
        if (value && value.trim()) {
          const youtubeRegex =
            /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
          if (!youtubeRegex.test(value)) return "Invalid YouTube URL";
        }
        break;

      case "virtualTourUrl":
        if (value && value.trim()) {
          try {
            new URL(value);
          } catch {
            return "Invalid URL format";
          }
        }
        break;
    }
    return "";
  };

  const validateStep = (
    step: number,
    formData: PropertyCreateRequest,
    imageFiles: PropertyImageFile[]
  ): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 0: // Basic Info
        ["title", "description", "price"].forEach((field) => {
          const error = validateField(
            field,
            formData[field as keyof typeof formData]
          );
          if (error) newErrors[field] = error;
        });
        break;

      case 1: // Location
        ["address", "city", "locality", "country"].forEach((field) => {
          const error = validateField(
            field,
            formData[field as keyof typeof formData]
          );
          if (error) newErrors[field] = error;
        });
        if (!formData.latitude || !formData.longitude) {
          newErrors.location =
            "Please select a location from search to get coordinates";
        }
        break;

      case 2: // Details
        ["bedrooms", "bathrooms", "squareFeet", "yearBuilt"].forEach(
          (field) => {
            const error = validateField(
              field,
              formData[field as keyof typeof formData]
            );
            if (error) newErrors[field] = error;
          }
        );
        ["youtubeVideoUrl", "virtualTourUrl"].forEach((field) => {
          const error = validateField(
            field,
            formData[field as keyof typeof formData]
          );
          if (error) newErrors[field] = error;
        });
        break;

      case 3: // Amenities
        if (!formData.amenities || formData.amenities.length === 0) {
          newErrors.amenities = "Please select at least one amenity";
        }
        break;

      case 4: {
        // Images
        if (imageFiles.length === 0) {
          newErrors.images = "Please upload at least one image";
        } else if (imageFiles.length < 3) {
          newErrors.images =
            "Please upload at least 3 images for better visibility";
        }
        const hasCover = imageFiles.some((img) => img.isCover);
        if (!hasCover && imageFiles.length > 0) {
          newErrors.images = "Please mark one image as cover";
        }
        break;
      }
      case 5: // Documents (optional)
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (fieldName: string) => {
    setTouched({ ...touched, [fieldName]: true });
  };

  return {
    errors,
    touched,
    validateStep,
    validateField,
    handleBlur,
    setErrors,
    setTouched,
  };
};
