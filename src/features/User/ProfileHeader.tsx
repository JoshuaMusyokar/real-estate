import { Edit, Mail, Phone, MapPin } from "lucide-react";
import type { UserProfileResponse } from "../../types";
import { useState } from "react";
import { Card, CardContent } from "../../components/ui/Card";
import Button from "../../components/ui/button/Button";
import { ProfileEditModal } from "./ProfileEditModal";

interface ProfileHeaderProps {
  user: UserProfileResponse;
  refetch: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  refetch,
}) => {
  const [showEditModal, setShowEditModal] = useState(false);

  const getDisplayName = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.email;
  };

  const getRoleDisplay = () => {
    if (user.role?.name) {
      return user.role.name
        .split("_")
        .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
        .join(" ");
    }
    return "User";
  };

  const getLocation = () => {
    if (user.cities && user.cities.length > 0) {
      const firstCity = user.cities[0];
      return firstCity.city;
    }
    return null;
  };

  return (
    <>
      <Card className="overflow-hidden">
        <CardContent className="p-4 sm:p-5 md:p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 overflow-hidden rounded-full border-4 border-white dark:border-gray-800 shadow-lg flex-shrink-0">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={getDisplayName()}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl sm:text-3xl md:text-4xl font-bold">
                  {user.firstName?.[0] || user.email[0].toUpperCase()}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 truncate">
                {getDisplayName()}
              </h1>

              <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2 sm:gap-3 mb-3 sm:mb-4">
                <span className="inline-flex items-center px-2.5 sm:px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-xs sm:text-sm font-medium">
                  {getRoleDisplay()}
                </span>
                <span
                  className={`inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                    user.status === "ACTIVE"
                      ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300"
                  }`}
                >
                  {user.status}
                </span>
              </div>

              {/* Contact Info */}
              <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="truncate max-w-[200px] sm:max-w-none">
                    {user.email}
                  </span>
                </span>
                {user.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    {user.phone}
                  </span>
                )}
                {getLocation() && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    {getLocation()}
                  </span>
                )}
              </div>
            </div>

            {/* Edit Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEditModal(true)}
              startIcon={<Edit className="w-4 h-4" />}
              className="w-full sm:w-auto flex-shrink-0"
            >
              <span className="hidden sm:inline">Edit Profile</span>
              <span className="sm:hidden">Edit</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <ProfileEditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        user={user}
        refetch={refetch}
      />
    </>
  );
};
