import { useEffect } from "react";
import { BaseModal } from "./BaseModal";
import { useAmenityForm } from "../../../hooks/useAmenityForm";
import { AmenityForm } from "./AmenityForm";
import type { Amenity, AmenityFormData } from "../../../types";
import { useUpdateAmenityMutation } from "../../../services/AmenityApi";
import { useToast } from "../../../hooks/useToast";
import { Loader2, Save } from "lucide-react";

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
  }, [amenity]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleUpdate = async () => {
    if (!validateForm() || !amenity) return;
    try {
      await updateAmenity({ id: amenity.id, data: formData }).unwrap();
      onSuccess();
      resetForm();
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      showError(err?.data?.message || "Failed to update amenity");
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={handleClose}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm sm:text-base font-black text-gray-900 dark:text-white">
          Edit Amenity
        </h2>
      </div>

      <AmenityForm
        formData={formData}
        formErrors={formErrors}
        categories={categories}
        onFormDataChange={(u: Partial<AmenityFormData>) => updateFormData(u)}
      />

      <div className="flex gap-2.5 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleClose}
          className="flex-1 py-2 sm:py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-xs sm:text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleUpdate}
          disabled={isLoading}
          className="flex-1 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-1.5"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Updating…
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" /> Update
            </>
          )}
        </button>
      </div>
    </BaseModal>
  );
};
