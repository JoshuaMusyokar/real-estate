import { X, Save, Loader2, Upload, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useUpdateProfileMutation } from "../../services/authApi";
import type { UserProfileResponse } from "../../types";
import { useToast } from "../../hooks/useToast";
import Button from "../../components/ui/button/Button";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfileResponse;
  refetch: () => void;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
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
    avatar: "",
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        avatar: user.avatar || "",
      });
      setAvatarPreview(user.avatar);
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In production, you'd upload to your server/S3 and get URL
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatarPreview(result);
        setFormData((prev) => ({
          ...prev,
          avatar: result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        // avatar: formData.avatar, //TODO: Uncomment when avatar upload is implemented
      }).unwrap();

      success("Profile updated", "Your profile has been updated successfully");
      refetch();
      onClose();
    } catch (err) {
      showError("Update failed", "Failed to update profile. Please try again.");
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
        className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between rounded-t-xl sm:rounded-t-2xl z-10">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              Edit Profile
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5 sm:mt-1">
              Update your personal information
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
          <div className="space-y-4 sm:space-y-5">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center gap-3 sm:gap-4 pb-4 sm:pb-5 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-700">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold">
                      {formData.firstName?.[0] || user.email[0].toUpperCase()}
                    </div>
                  )}
                </div>
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-colors"
                >
                  <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="text-center">
                <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                  Profile Picture
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Click the button to upload
                </p>
              </div>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                  First Name *
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <User className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base"
                    placeholder="Enter first name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                  Last Name *
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <User className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base"
                    placeholder="Enter last name"
                  />
                </div>
              </div>
            </div>

            {/* Email (Disabled) */}
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

            {/* Role & Status (Read-only) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg sm:rounded-xl">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Role
                </label>
                <div className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                  {user.role?.name
                    ?.split("_")
                    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
                    .join(" ") || "User"}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Status
                </label>
                <span
                  className={`inline-flex items-center px-2 sm:px-2.5 py-1 rounded text-xs sm:text-sm font-medium ${
                    user.status === "ACTIVE"
                      ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300"
                  }`}
                >
                  {user.status}
                </span>
              </div>
            </div>

            {/* Account Info */}
            <div className="p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg sm:rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                <div>
                  <div className="text-blue-600 dark:text-blue-400 font-medium mb-0.5">
                    Member Since
                  </div>
                  <div className="text-gray-900 dark:text-white font-semibold">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </div>
                <div>
                  <div className="text-blue-600 dark:text-blue-400 font-medium mb-0.5">
                    Properties
                  </div>
                  <div className="text-gray-900 dark:text-white font-semibold">
                    {user.propertyCount}
                  </div>
                </div>
              </div>
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
