import type { UserResponse, UserStatus } from "../../types";
import { UserTableRow } from "./UserTableRow";

export const UserTable: React.FC<{
  users: UserResponse[];
  selectedUsers: string[];
  onSelectUser: (id: string) => void;
  onSelectAll: () => void;
  isAllSelected: boolean;
  onViewUser: (user: UserResponse) => void;
  onEditUser: (user: UserResponse) => void;
  onDeleteUser: (id: string) => void;
  onStatusUpdate: (id: string, status: UserStatus) => void;
}> = ({
  users,
  selectedUsers,
  onSelectUser,
  onSelectAll,
  isAllSelected,
  onViewUser,
  onEditUser,
  onDeleteUser,
  onStatusUpdate,
}) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="bg-gray-50 dark:bg-gray-700">
        <tr>
          <th className="w-12 px-6 py-4">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={onSelectAll}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </th>
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
          <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
        {users.map((user) => (
          <UserTableRow
            key={user.id}
            user={user}
            isSelected={selectedUsers.includes(user.id)}
            onSelect={onSelectUser}
            onView={onViewUser}
            onEdit={onEditUser}
            onDelete={onDeleteUser}
            onStatusUpdate={onStatusUpdate}
          />
        ))}
      </tbody>
    </table>
  </div>
);
