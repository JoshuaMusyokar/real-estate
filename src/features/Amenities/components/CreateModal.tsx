import { BaseModal } from "./BaseModal";
import { AmenityForm } from "./AmenityForm";
import type { AmenityCreateRequest } from "../../../types";
import { useCreateAmenityMutation } from "../../../services/AmenityApi";
import { useToast } from "../../../hooks/useToast";
import { useAmenityForm } from "../../../hooks/useAmenityForm";

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

  // Create Amenity
  const handleCreate = async () => {
    if (!validateForm()) return;

    try {
      await createAmenity(formData as AmenityCreateRequest).unwrap();
      onSuccess(); //TODO ON SUCCESS USE TOAST
      resetForm();
      //   refetch();
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      showError(err?.data?.message || "Failed to create amenity");
    }
  };
  return (
    <BaseModal isOpen={isOpen} onClose={handleClose}>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Create Amenity
      </h2>

      <AmenityForm
        formData={formData}
        formErrors={formErrors}
        categories={categories}
        onFormDataChange={updateFormData}
      />

      <div className="flex items-center gap-3 mt-6">
        <button
          onClick={handleClose}
          className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleCreate}
          disabled={isLoading}
          className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Creating..." : "Create"}
        </button>
      </div>
    </BaseModal>
  );
};
