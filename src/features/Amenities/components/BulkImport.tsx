import { useState } from "react";
import { BaseModal } from "./BaseModal";
import { useToast } from "../../../hooks/useToast";
import { useBulkCreateAmenitiesMutation } from "../../../services/AmenityApi";

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const BulkImportModal = ({
  isOpen,
  onClose,
  onSuccess,
}: BulkImportModalProps) => {
  const [bulkCreate, { isLoading }] = useBulkCreateAmenitiesMutation();
  const [bulkText, setBulkText] = useState("");
  const { error: showError } = useToast();

  const handleClose = () => {
    setBulkText("");
    onClose();
  };

  const handleBulkCreate = async () => {
    const lines = bulkText.split("\n").filter((l) => l.trim());
    if (lines.length === 0) {
      showError("Please enter amenities (one per line)");
      return;
    }

    const amenities = lines.map((line, idx) => ({
      name: line.trim(),
      order: idx,
      isActive: true,
    }));
    try {
      await bulkCreate(amenities).unwrap();
      onSuccess();
      setBulkText("");
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      showError(err?.data?.message || "Failed to bulk create amenity");
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={handleClose} size="lg">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Bulk Import Amenities
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Enter amenity names (one per line). They will be created with default
        settings.
      </p>
      <textarea
        value={bulkText}
        onChange={(e) => setBulkText(e.target.value)}
        rows={12}
        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
        placeholder={`Swimming Pool\nGym\nParking\n24/7 Security\nBalcony\nGarden\nElevator`}
      />
      <div className="flex items-center gap-3 mt-6">
        <button
          onClick={handleClose}
          className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleBulkCreate}
          disabled={isLoading}
          className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Importing..." : "Import Amenities"}
        </button>
      </div>
    </BaseModal>
  );
};
