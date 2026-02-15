import { Users } from "lucide-react";
import type { UserProfileResponse } from "../../types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";

interface TeamCardProps {
  user: UserProfileResponse;
}

export const TeamCard: React.FC<TeamCardProps> = ({ user }) => {
  return (
    <Card>
      <CardHeader className="p-4 sm:p-5 md:p-6">
        <CardTitle className="text-base sm:text-lg md:text-xl font-bold">
          Team
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-5 md:p-6 pt-0">
        <div className="space-y-3 sm:space-y-4">
          {/* Manager */}
          {user.manager && (
            <div className="space-y-2">
              <div className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                Manager
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs sm:text-sm font-bold flex-shrink-0">
                    {user.manager.firstName[0]}
                    {user.manager.lastName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate">
                      {user.manager.firstName} {user.manager.lastName}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                      {user.manager.email}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Managed Users */}
          {user.managedUsers && user.managedUsers.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                Managed Users ({user.managedUsers.length})
              </div>
              <div className="space-y-2">
                {user.managedUsers.map((managedUser) => (
                  <div
                    key={managedUser.id}
                    className="p-2.5 sm:p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {managedUser.firstName[0]}
                        {managedUser.lastName[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">
                          {managedUser.firstName} {managedUser.lastName}
                        </div>
                        <div className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 truncate">
                          {managedUser.email}
                        </div>
                      </div>
                      <span
                        className={`px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs font-medium flex-shrink-0 ${
                          managedUser.status === "ACTIVE"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {managedUser.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!user.manager &&
            (!user.managedUsers || user.managedUsers.length === 0) && (
              <div className="text-center py-6 sm:py-8">
                <Users className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 mx-auto mb-2" />
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  No team members
                </p>
              </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
};
