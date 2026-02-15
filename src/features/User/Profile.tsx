import { useGetProfileQuery } from "../../services/authApi";
import { Loader2, AlertCircle } from "lucide-react";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileStats } from "./profileStats";
import { PersonalInfoCard } from "./PersonalInfoCard";
import { LocationCard } from "./LocationCard";
import { TeamCard } from "./TeamsCard";
import { SecurityCard } from "./SecurityCard";

export const UserProfile: React.FC = () => {
  const { data, isLoading, isError, refetch } = useGetProfileQuery();

  const handleRefetch = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 animate-spin text-blue-600 mx-auto mb-3 sm:mb-4" />
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-red-500 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Failed to load profile
          </h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Please try refreshing the page
          </p>
        </div>
      </div>
    );
  }

  const user = data.data;

  return (
    <>
      <div className="max-w-7xl mx-auto">
        <div className="space-y-4 sm:space-y-6">
          {/* Profile Header */}
          <ProfileHeader user={user} refetch={handleRefetch} />

          {/* Stats */}
          <ProfileStats user={user} />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Left Column - Personal Info & Location */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              <PersonalInfoCard user={user} refetch={handleRefetch} />
              <LocationCard user={user} />
            </div>

            {/* Right Column - Team & Security */}
            <div className="space-y-4 sm:space-y-6">
              <TeamCard user={user} />
              <SecurityCard user={user} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
