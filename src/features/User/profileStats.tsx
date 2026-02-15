import { Home, Users, Shield, Clock } from "lucide-react";
import type { UserProfileResponse } from "../../types";
import { Card, CardContent } from "../../components/ui/Card";

interface ProfileStatsProps {
  user: UserProfileResponse;
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({ user }) => {
  const stats = [
    {
      icon: Home,
      label: "Properties",
      value: user.propertyCount || 0,
      color: "blue",
    },
    {
      icon: Users,
      label: "Assigned Leads",
      value: user.assignedLeadsCount || 0,
      color: "green",
    },
    {
      icon: Shield,
      label: "2FA Status",
      value: user.twoFactorEnabled ? "Enabled" : "Disabled",
      color: user.twoFactorEnabled ? "green" : "amber",
    },
    {
      icon: Clock,
      label: "Last Login",
      value: user.lastLoginAt
        ? new Date(user.lastLoginAt).toLocaleDateString()
        : "Never",
      color: "purple",
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
      green:
        "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
      amber:
        "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
      purple:
        "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardContent className="p-3 sm:p-4 md:p-5">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ${getColorClasses(stat.color)}`}
                >
                  <Icon className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white truncate">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                    {stat.label}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
