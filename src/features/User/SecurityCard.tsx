/* eslint-disable @typescript-eslint/no-unused-vars */
import { Shield, Key, Clock } from "lucide-react";

import type { UserProfileResponse } from "../../types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import Button from "../../components/ui/button/Button";

interface SecurityCardProps {
  user: UserProfileResponse;
}

export const SecurityCard: React.FC<SecurityCardProps> = ({ user }) => {
  return (
    <Card>
      <CardHeader className="p-4 sm:p-5 md:p-6">
        <CardTitle className="text-base sm:text-lg md:text-xl font-bold">
          Security
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-5 md:p-6 pt-0 space-y-3 sm:space-y-4">
        {/* 2FA Status */}
        {/* <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <Shield
                className={`w-4 h-4 sm:w-5 sm:h-5 ${
                  user.twoFactorEnabled
                    ? "text-green-600 dark:text-green-400"
                    : "text-gray-400"
                }`}
              />
              <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
                Two-Factor Auth
              </span>
            </div>
            <span
              className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded text-xs sm:text-sm font-medium ${
                user.twoFactorEnabled
                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              }`}
            >
              {user.twoFactorEnabled ? "Enabled" : "Disabled"}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs sm:text-sm"
          >
            {user.twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
          </Button>
        </div> */}

        {/* Change Password */}
        {/* <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Key className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
              Password
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs sm:text-sm"
          >
            Change Password
          </Button>
        </div> */}

        {/* Last Login */}
        {user.lastLoginAt && (
          <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <div>
                <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Last Login
                </div>
                <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                  {new Date(user.lastLoginAt).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
