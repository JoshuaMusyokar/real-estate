import { Plus, Upload } from "lucide-react";
import type { User } from "../../../types";

interface HeaderProps {
  user: Omit<User, "password" | "twoFactorSecret">;
  onAddAmenity: () => void;
  onBulkImport: () => void;
}

export const Header = ({ user, onAddAmenity, onBulkImport }: HeaderProps) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Title */}
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 leading-tight">
              Amenities
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Manage property amenities
            </p>
          </div>

          {/* Actions */}
          {["ADMIN", "SUPER_ADMIN"].includes(user!.role.name) && (
            <div className="flex items-center gap-2">
              <button
                onClick={onBulkImport}
                className="
                  flex items-center gap-1.5
                  px-3 py-1.5
                  text-xs sm:text-sm
                  border border-gray-200 dark:border-gray-700
                  rounded-md
                  text-gray-700 dark:text-gray-300
                  hover:bg-gray-50 dark:hover:bg-gray-800
                  transition
                "
              >
                <Upload className="w-4 h-4" />
                <span className="hidden xs:inline">Import</span>
              </button>

              <button
                onClick={onAddAmenity}
                className="
                  flex items-center gap-1.5
                  px-3 py-1.5
                  text-xs sm:text-sm
                  bg-blue-600 dark:bg-blue-500
                  text-white
                  rounded-md
                  hover:bg-blue-700 dark:hover:bg-blue-600
                  transition
                "
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
