import { BaseModal } from "./BaseModal";
import { AmenityForm } from "./AmenityForm";
import type { AmenityCreateRequest } from "../../../types";
import { useCreateAmenityMutation } from "../../../services/AmenityApi";
import { useToast } from "../../../hooks/useToast";
import { useAmenityForm } from "../../../hooks/useAmenityForm";
import { Loader2, Plus } from "lucide-react";

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  onSuccess: () => void;
}

export const CreateModal = ({
  isOpen,
  onClose,
  categories,
  onSuccess,
}: CreateModalProps) => {
  const { formData, formErrors, updateFormData, resetForm, validateForm } =
    useAmenityForm();
  const [createAmenity, { isLoading }] = useCreateAmenityMutation();
  const { error: showError } = useToast();

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleCreate = async () => {
    if (!validateForm()) return;
    try {
      await createAmenity(formData as AmenityCreateRequest).unwrap();
      onSuccess();
      resetForm();
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      showError(err?.data?.message || "Failed to create amenity");
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={handleClose}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm sm:text-base font-black text-gray-900 dark:text-white">
          Create Amenity
        </h2>
      </div>

      <AmenityForm
        formData={formData}
        formErrors={formErrors}
        categories={categories}
        onFormDataChange={updateFormData}
      />

      <div className="flex gap-2.5 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleClose}
          className="flex-1 py-2 sm:py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-xs sm:text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleCreate}
          disabled={isLoading}
          className="flex-1 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-1.5"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Creating…
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" /> Create
            </>
          )}
        </button>
      </div>
    </BaseModal>
  );
};
