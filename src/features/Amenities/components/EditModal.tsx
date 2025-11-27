import { useEffect } from "react";
import { BaseModal } from "./BaseModal";
import { useAmenityForm } from "../../../hooks/useAmenityForm";
import { AmenityForm } from "./AmenityForm";
import type { Amenity, AmenityFormData } from "../../../types";
import { useUpdateAmenityMutation } from "../../../services/AmenityApi";
import { useToast } from "../../../hooks/useToast";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  amenity: Amenity | null;
  categories: string[];
  onSuccess: () => void;
}

export const EditModal = ({
  isOpen,
  onClose,
  amenity,
  categories,
  onSuccess,
}: EditModalProps) => {
  const { formData, formErrors, updateFormData, resetForm, validateForm } =
    useAmenityForm();

  const [updateAmenity, { isLoading }] = useUpdateAmenityMutation();
  const { error: showError } = useToast();

  useEffect(() => {
    if (amenity) {
      updateFormData({
        name: amenity.name,
        icon: amenity.icon || "",
        category: amenity.category || "",
        order: amenity.order,
        isActive: amenity.isActive,
      });
    }
  }, [amenity]); // Remove updateFormData from dependencies to avoid infinite loop

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleUpdate = async () => {
    if (!validateForm() || !amenity) return;

    try {
      await updateAmenity({
        id: amenity.id,
        data: formData,
      }).unwrap();
      onSuccess();
      resetForm();
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      showError(err?.data?.message || "Failed to update amenity");
    }
  };

  // Wrapper function to match the expected signature
  const handleFormDataChange = (updates: Partial<AmenityFormData>) => {
    updateFormData(updates);
  };

  return (
    <BaseModal isOpen={isOpen} onClose={handleClose}>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Edit Amenity
      </h2>

      <AmenityForm
        formData={formData}
        formErrors={formErrors}
        categories={categories}
        onFormDataChange={handleFormDataChange}
      />

      <div className="flex items-center gap-3 mt-6">
        <button
          onClick={handleClose}
          className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleUpdate}
          disabled={isLoading}
          className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Updating..." : "Update"}
        </button>
      </div>
    </BaseModal>
  );
};
