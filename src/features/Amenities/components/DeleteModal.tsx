import { BaseModal } from "./BaseModal";
import { Trash2 } from "lucide-react";
import type { Amenity } from "../../../types";
import { useDeleteAmenityMutation } from "../../../services/AmenityApi";
import { useToast } from "../../../hooks/useToast";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  amenity: Amenity | null;
  onSuccess: () => void;
}

export const DeleteModal = ({
  isOpen,
  onClose,
  amenity,
  onSuccess,
}: DeleteModalProps) => {
  const [deleteAmenity, { isLoading }] = useDeleteAmenityMutation();
  const { error: showError } = useToast();

  const handleDelete = async () => {
    if (!amenity) return;
    try {
      await deleteAmenity(amenity.id).unwrap();
      onSuccess();
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      showError(err?.data?.message || "Failed to delete amenity");
    }
  };

  if (!amenity) return null;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
        <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
        Delete Amenity
      </h2>
      <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
        Are you sure you want to delete{" "}
        <span className="font-semibold text-gray-900 dark:text-white">
          {amenity.name}
        </span>
        ? This action cannot be undone.
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          disabled={isLoading}
          className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </BaseModal>
  );
};
