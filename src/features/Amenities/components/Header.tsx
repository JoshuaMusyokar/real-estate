/* eslint-disable @typescript-eslint/no-unused-vars */
import { Plus, Download, Upload } from "lucide-react";
import type { User } from "../../../types";

interface HeaderProps {
  user: Omit<User, "password" | "twoFactorSecret">;
  onAddAmenity: () => void;
  onBulkImport: () => void;
}

export const Header = ({ user, onAddAmenity, onBulkImport }: HeaderProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Amenities Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your property amenities and features
            </p>
          </div>
          <div className="flex items-center gap-3">
            {["ADMIN", "SUPER_ADMIN"].includes(user!.role.name) && (
              <>
                <button
                  onClick={onBulkImport}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Bulk Import
                </button>
                <button
                  onClick={onAddAmenity}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  Add Amenity
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
