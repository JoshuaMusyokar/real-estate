/* eslint-disable @typescript-eslint/no-unused-vars */
import { Edit, MapPin, Map } from "lucide-react";

import type { UserProfileResponse } from "../../types";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import Button from "../../components/ui/button/Button";

interface LocationCardProps {
  user: UserProfileResponse;
}

export const LocationCard: React.FC<LocationCardProps> = ({ user }) => {
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-5 md:p-6">
        <CardTitle className="text-base sm:text-lg md:text-xl font-bold">
          Locations & Coverage
        </CardTitle>
        {/* <Button
          variant="outline"
          size="sm"
          onClick={() => setShowEditModal(true)}
          startIcon={<Edit className="w-4 h-4" />}
          className="flex-shrink-0"
        >
          <span className="hidden sm:inline">Edit</span>
        </Button> */}
      </CardHeader>
      <CardContent className="p-4 sm:p-5 md:p-6 pt-0">
        {user.cities && user.cities.length > 0 ? (
          <div className="space-y-3 sm:space-y-4">
            {user.cities.map((city, index) => (
              <div
                key={index}
                className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start gap-2 sm:gap-3 mb-2">
                  <Map className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                      {city.city}
                    </div>
                  </div>
                </div>
                {city.localities.length > 0 && (
                  <div className="ml-6 sm:ml-8 flex flex-wrap gap-1.5 sm:gap-2">
                    {city.localities.map((locality, localityIndex) => (
                      <span
                        key={localityIndex}
                        className="inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-xs sm:text-sm text-gray-700 dark:text-gray-300"
                      >
                        <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                        {locality}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12">
            <MapPin className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-2 sm:mb-3" />
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              No locations assigned
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
