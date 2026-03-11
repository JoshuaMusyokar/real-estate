import type { UserResponse, UserStatus } from "../../types";
import { UserTableRow } from "./UserTableRow";

export const UserTable: React.FC<{
  users: UserResponse[];
  selectedUsers: string[];
  isAllSelected: boolean;
  onViewUser: (user: UserResponse) => void;
  // Optional — parent passes undefined when user lacks the permission
  onSelectUser?: (id: string) => void;
  onSelectAll?: () => void;
  onEditUser?: (user: UserResponse) => void;
  onDeleteUser?: (id: string) => void;
  onStatusUpdate?: (id: string, status: UserStatus) => void;
}> = ({
  users,
  selectedUsers,
  isAllSelected,
  onViewUser,
  onSelectUser,
  onSelectAll,
  onEditUser,
  onDeleteUser,
  onStatusUpdate,
}) => {
  const showCheckbox = !!onSelectUser && !!onSelectAll;
  const showActions = !!onEditUser || !!onDeleteUser || !!onStatusUpdate;

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            {/* Checkbox column — only when selection is enabled */}
            {showCheckbox && (
              <th className="w-12 px-6 py-4">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={onSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
            )}
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              User
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Last Active
            </th>
            {/* Actions column — only when at least one action exists */}
            {showActions && (
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
          {users.map((user) => (
            <UserTableRow
              key={user.id}
              user={user}
              isSelected={selectedUsers.includes(user.id)}
              onView={onViewUser}
              // Pass undefined when handler is absent — UserTableRow hides the element
              onSelect={onSelectUser}
              onEdit={onEditUser}
              onDelete={onDeleteUser}
              onStatusUpdate={onStatusUpdate}
              showActions={showActions}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
