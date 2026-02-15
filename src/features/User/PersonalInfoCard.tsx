import { Edit, User, Mail, Phone, Calendar } from "lucide-react";
import type { UserProfileResponse } from "../../types";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import Button from "../../components/ui/button/Button";
import { PersonalInfoEditModal } from "./PersonalInfoEditModal";

interface PersonalInfoCardProps {
  user: UserProfileResponse;
  refetch: () => void;
}

export const PersonalInfoCard: React.FC<PersonalInfoCardProps> = ({
  user,
  refetch,
}) => {
  const [showEditModal, setShowEditModal] = useState(false);

  const infoItems = [
    {
      icon: User,
      label: "First Name",
      value: user.firstName || "Not set",
    },
    {
      icon: User,
      label: "Last Name",
      value: user.lastName || "Not set",
    },
    {
      icon: Mail,
      label: "Email",
      value: user.email,
    },
    {
      icon: Phone,
      label: "Phone",
      value: user.phone || "Not set",
    },
    {
      icon: Calendar,
      label: "Member Since",
      value: new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
    },
    {
      icon: Calendar,
      label: "Last Updated",
      value: new Date(user.updatedAt).toLocaleDateString(),
    },
  ];

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-5 md:p-6">
          <CardTitle className="text-base sm:text-lg md:text-xl font-bold">
            Personal Information
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowEditModal(true)}
            startIcon={<Edit className="w-4 h-4" />}
            className="flex-shrink-0"
          >
            <span className="hidden sm:inline">Edit</span>
          </Button>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 md:p-6 pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
            {infoItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    {item.label}
                  </div>
                  <div className="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate">
                    {item.value}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <PersonalInfoEditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        user={user}
        refetch={refetch}
      />
    </>
  );
};
