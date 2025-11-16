import React from "react";
import {
  X,
  Edit,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  UserCheck,
  UserX,
  Clock,
} from "lucide-react";
import type { UserResponse, Role, UserStatus } from "../../types";

interface UserDetailsModalProps {
  user: UserResponse;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (user: UserResponse) => void;
}

export const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  user,
  isOpen,
  onClose,
  onEdit,
}) => {
  const getStatusColor = (status: UserStatus) => {
    const colors = {
      ACTIVE:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      INACTIVE: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
      SUSPENDED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      PENDING_VERIFICATION:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    };
    return colors[status];
  };

  const getRoleColor = (role: Role) => {
    const colors = {
      SUPER_ADMIN:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      ADMIN: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      SALES_MANAGER:
        "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
      SALES_AGENT:
        "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
      MARKETING:
        "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
      VIEWER: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
      PROPERTY_OWNER:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      BUYER: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
      BUILDER: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
      AGENT_EXTERNAL:
        "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
    };
    return colors[role] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "Never";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <img
              className="h-16 w-16 rounded-full object-cover"
              src={
                user.avatar ||
                `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=0D8ABC&color=fff&size=128`
              }
              alt={`${user.firstName} ${user.lastName}`}
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onEdit(user);
                onClose();
              }}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Edit User"
            >
              <Edit size={20} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Status and Role Badges */}
          <div className="flex flex-wrap gap-3">
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                user.status
              )}`}
            >
              {user.status === "ACTIVE" && <UserCheck size={14} />}
              {user.status === "INACTIVE" && <UserX size={14} />}
              {user.status === "SUSPENDED" && <UserX size={14} />}
              {user.status === "PENDING_VERIFICATION" && <Clock size={14} />}
              {user.status.replace("_", " ")}
            </span>
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(
                user.role
              )}`}
            >
              <Shield size={14} />
              {user.role.replace("_", " ")}
            </span>
            {user.twoFactorEnabled && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                <Shield size={14} />
                2FA Enabled
              </span>
            )}
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <Mail className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Email
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {user.email}
                  </p>
                </div>
              </div>

              {user.phone && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <Phone className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Phone
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {user.phone}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Access Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Access Information
            </h3>
            <div className="space-y-4">
              {user.allowedCities.length > 0 && (
                <div className="flex items-start gap-3">
                  <MapPin className="text-gray-400 mt-0.5" size={20} />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Allowed Cities
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {user.allowedCities.map((city) => (
                        <span
                          key={city}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded"
                        >
                          {city}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {user.allowedLocalities.length > 0 && (
                <div className="flex items-start gap-3">
                  <MapPin className="text-gray-400 mt-0.5" size={20} />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Allowed Localities
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {user.allowedLocalities.map((locality) => (
                        <span
                          key={locality}
                          className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm rounded"
                        >
                          {locality}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Activity Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Activity
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <Calendar className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Member Since
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatDate(user.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <Clock className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Last Active
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {user.lastLoginAt ? formatDate(user.lastLoginAt) : "Never"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* System Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              System Information
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">User ID</p>
                  <p className="font-mono text-gray-900 dark:text-white text-xs">
                    {user.id}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Last Updated
                  </p>
                  <p className="text-gray-900 dark:text-white">
                    {formatDate(user.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Agent Performance (if available) */}
          {user.agentPerformance && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Performance Metrics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {user.agentPerformance.totalLeadsClosed}
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Deals Closed
                  </p>
                </div>
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {user.agentPerformance.conversionRate}%
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Conversion Rate
                  </p>
                </div>
                <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    ${user.agentPerformance.totalRevenue.toLocaleString()}
                  </p>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    Total Revenue
                  </p>
                </div>
                <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {user.agentPerformance.appointmentsCompleted}
                  </p>
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    Appointments
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              onEdit(user);
              onClose();
            }}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Edit size={20} />
            Edit User
          </button>
        </div>
      </div>
    </div>
  );
};
