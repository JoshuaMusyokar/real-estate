import { X, Save, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useUpdateProfileMutation } from "../../services/authApi";
import type { UserProfileResponse } from "../../types";
import { useToast } from "../../hooks/useToast";
import Button from "../../components/ui/button/Button";

interface PersonalInfoEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfileResponse;
  refetch: () => void;
}

export const PersonalInfoEditModal: React.FC<PersonalInfoEditModalProps> = ({
  isOpen,
  onClose,
  user,
  refetch,
}) => {
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const { success, error: showError } = useToast();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      }).unwrap();

      success(
        "Profile updated",
        "Your information has been updated successfully",
      );
      refetch();
      onClose();
    } catch (err) {
      showError(
        "Update failed",
        "Failed to update information. Please try again.",
      );
      console.error("Failed to update profile:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl max-w-lg w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              Edit Personal Information
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5">
              Update your basic details
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6">
          <div className="space-y-4">
            {/* First Name */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base"
                placeholder="Enter first name"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base"
                placeholder="Enter last name"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 rounded-lg sm:rounded-xl text-sm sm:text-base cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                Email cannot be changed
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isLoading || !formData.firstName || !formData.lastName}
              startIcon={
                isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )
              }
              className="w-full sm:w-auto"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
