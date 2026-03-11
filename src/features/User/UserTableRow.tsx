import { useState } from "react";
import type { UserResponse, UserStatus } from "../../types";
import {
  Edit,
  Eye,
  Mail,
  MoreVertical,
  Trash2,
  UserCheck,
  UserX,
} from "lucide-react";
import { userStatuses } from "../../utils/user-utils";

export const UserTableRow: React.FC<{
  user: UserResponse;
  isSelected: boolean;
  showActions: boolean; // passed from UserTable — controls actions <td> rendering
  onView: (user: UserResponse) => void;
  // Optional — parent passes undefined when user lacks the permission
  onSelect?: (id: string) => void;
  onEdit?: (user: UserResponse) => void;
  onDelete?: (id: string) => void;
  onStatusUpdate?: (id: string, status: UserStatus) => void;
}> = ({
  user,
  isSelected,
  showActions,
  onView,
  onSelect,
  onEdit,
  onDelete,
  onStatusUpdate,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const getUserRole = () => user.role;

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

  const getRoleColor = (roleName: string) => {
    const colors: Record<string, string> = {
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
    return colors[roleName] || "bg-gray-100 text-gray-800";
  };

  const currentRole = getUserRole();
  // Three-dot menu has content when at least one mutable action exists
  const hasMenuActions = !!onStatusUpdate || !!onDelete;

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
      {/* Checkbox — only rendered when selection is enabled */}
      {onSelect && (
        <td className="px-6 py-4">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(user.id)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </td>
      )}

      {/* User info — always shown */}
      <td className="px-6 py-4">
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            <img
              className="h-10 w-10 rounded-full object-cover"
              src={
                user.avatar ||
                `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=0D8ABC&color=fff`
              }
              alt=""
            />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {user.firstName} {user.lastName}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {user.email}
            </div>
            {user.manager && (
              <span className="inline-flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                <UserCheck size={12} className="mr-1 text-blue-500" />
                Manager: {user.manager.firstName} {user.manager.lastName}
              </span>
            )}
          </div>
        </div>
      </td>

      {/* Role — always shown */}
      <td className="px-6 py-4">
        {user.roleId && (
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(currentRole.name)}`}
          >
            {currentRole.name}
          </span>
        )}
      </td>

      {/* Status — editable dropdown when canEdit, read-only badge otherwise */}
      <td className="px-6 py-4">
        {onStatusUpdate ? (
          <select
            value={user.status}
            onChange={(e) =>
              onStatusUpdate(user.id, e.target.value as UserStatus)
            }
            className={`text-xs font-semibold px-2 py-1 rounded-full border-0 focus:ring-2 focus:ring-blue-500 ${getStatusColor(user.status)}`}
          >
            {userStatuses.map((status) => (
              <option key={status} value={status}>
                {status.replace("_", " ")}
              </option>
            ))}
          </select>
        ) : (
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}
          >
            {user.status.replace("_", " ")}
          </span>
        )}
      </td>

      {/* Last active — always shown */}
      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
        {user.lastLoginAt
          ? new Date(user.lastLoginAt).toLocaleDateString()
          : "Never"}
      </td>

      {/* Actions cell — only rendered when showActions=true (col count must match header) */}
      {showActions && (
        <td className="px-6 py-4 text-right text-sm font-medium">
          <div className="flex justify-end items-center space-x-2">
            {/* View — always shown in actions cell */}
            <button
              onClick={() => onView(user)}
              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              title="View"
            >
              <Eye size={16} />
            </button>

            {/* Edit — only when handler present */}
            {onEdit && (
              <button
                onClick={() => onEdit(user)}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                title="Edit"
              >
                <Edit size={16} />
              </button>
            )}

            {/* Three-dot menu — only when at least one mutable action exists */}
            {hasMenuActions && (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                  title="More"
                >
                  <MoreVertical size={16} />
                </button>

                {showMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowMenu(false)}
                    />
                    <div className="absolute right-0 top-6 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20">
                      <div className="py-1">
                        {/* Activate / Deactivate */}
                        {onStatusUpdate && (
                          <button
                            onClick={() => {
                              onStatusUpdate(
                                user.id,
                                user.status === "ACTIVE"
                                  ? "INACTIVE"
                                  : "ACTIVE",
                              );
                              setShowMenu(false);
                            }}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            {user.status === "ACTIVE" ? (
                              <UserX size={16} />
                            ) : (
                              <UserCheck size={16} />
                            )}
                            {user.status === "ACTIVE"
                              ? "Deactivate"
                              : "Activate"}
                          </button>
                        )}

                        {/* Send Email — informational, no permission needed */}
                        <button
                          onClick={() => setShowMenu(false)}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <Mail size={16} />
                          Send Email
                        </button>

                        {/* Delete */}
                        {onDelete && (
                          <>
                            <div className="border-t border-gray-100 dark:border-gray-700 my-1" />
                            <button
                              onClick={() => {
                                onDelete(user.id);
                                setShowMenu(false);
                              }}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </td>
      )}
    </tr>
  );
};
