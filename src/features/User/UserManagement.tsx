/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useMemo } from "react";
import { Plus, Search, Download, Upload } from "lucide-react";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserStatusMutation,
  useBulkUserOperationMutation,
  useGetUserStatsQuery,
  useCreateUserMutation,
} from "../../services/userApi";
import type {
  UserResponse,
  UserFilter,
  Role,
  UserStatus,
  CreateUserRequest,
} from "../../types";
import { UserForm } from "./UserForm";
import { UserDetailsModal } from "./UserDetailModal";
import { BulkActions } from "./BulkAction";
import { ExportModal } from "./ExportModal";
// import { ImportModal } from "../components/users/ImportModal";
import { StatsGrid } from "./StatGrid";
import { FilterDropdown } from "./FilterDropdown";
import { UserTable } from "./UserTable";
import { UserTableSkeleton } from "./UserTableSkeleton";
import { Pagination } from "./Pagination";
import { roles, userStatuses } from "../../utils/user-utils";

export const UserManagement: React.FC = () => {
  const [filters, setFilters] = useState<UserFilter>({});
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserResponse | null>(null);
  const [viewingUser, setViewingUser] = useState<UserResponse | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const limit = 10;

  // RTK Queries
  const {
    data: usersData,
    isLoading,
    error,
    refetch,
  } = useGetUsersQuery({
    ...filters,
    search: searchQuery || undefined,
    page,
    limit,
  });

  const { data: statsData } = useGetUserStatsQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUserStatus] = useUpdateUserStatusMutation();
  const [bulkOperation] = useBulkUserOperationMutation();
  const [createUser] = useCreateUserMutation();

  const users = usersData?.users || [];
  const totalUsers = usersData?.total || 0;
  const totalPages = usersData?.totalPages || 1;

  // Memoized computed values
  const stats = useMemo(() => statsData?.data, [statsData]);
  const isAllSelected =
    selectedUsers.length === users.length && users.length > 0;

  // Handlers
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  const handleFilterChange = (newFilters: Partial<UserFilter>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1);
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    setSelectedUsers(isAllSelected ? [] : users.map((user) => user.id));
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(userId).unwrap();
        setSelectedUsers((prev) => prev.filter((id) => id !== userId));
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    }
  };

  const handleStatusUpdate = async (userId: string, status: UserStatus) => {
    try {
      await updateUserStatus({ id: userId, status }).unwrap();
    } catch (error) {
      console.error("Failed to update user status:", error);
    }
  };

  const handleBulkAction = async (
    operation: "activate" | "deactivate" | "delete"
  ) => {
    if (selectedUsers.length === 0) return;

    try {
      await bulkOperation({
        userIds: selectedUsers,
        operation,
      }).unwrap();
      setSelectedUsers([]);
    } catch (error) {
      console.error("Bulk operation failed:", error);
    }
  };

  const handleCreateUser = async (data: CreateUserRequest) => {
    try {
      await createUser(data).unwrap();
      setIsUserFormOpen(false);
      refetch();
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  const handleEditUser = (user: UserResponse) => {
    setEditingUser(user);
    setIsUserFormOpen(true);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Unable to load users
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Please check your connection and try again.
          </p>
          <button
            onClick={refetch}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 rounded-xl px-2 mb-2">
        <div className="max-w-full mx-auto">
          {/* <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8"> */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-6">
            <div className="flex items-center justify-between sm:block">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  User Management
                </h1>
              </div>
              <button
                onClick={() => setIsUserFormOpen(true)}
                className="sm:hidden bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>

            <div className="flex items-center gap-3 mt-4 sm:mt-0">
              {/* <button
                onClick={() => setIsImportModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Upload size={20} />
                <span className="hidden sm:block">Import</span>
              </button> */}
              <button
                onClick={() => setIsExportModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Download size={20} />
                <span className="hidden sm:block">Export</span>
              </button>
              <button
                onClick={() => setIsUserFormOpen(true)}
                className="hidden sm:flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
                Add User
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto">
        {/* Stats Grid */}
        {stats && <StatsGrid stats={stats} />}

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md w-full">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search users by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <FilterDropdown
                label="Role"
                options={roles}
                value={filters.role}
                onChange={(value) =>
                  handleFilterChange({ role: value as Role[] })
                }
              />
              <FilterDropdown
                label="Status"
                options={userStatuses}
                value={filters.status}
                onChange={(value) =>
                  handleFilterChange({ status: value as UserStatus[] })
                }
              />
              <button
                onClick={() => {
                  setFilters({});
                  setSearchQuery("");
                }}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <BulkActions
            selectedCount={selectedUsers.length}
            onBulkAction={handleBulkAction}
            onClearSelection={() => setSelectedUsers([])}
          />
        )}

        {/* Users Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {isLoading ? (
            <UserTableSkeleton />
          ) : (
            <UserTable
              users={users}
              selectedUsers={selectedUsers}
              onSelectUser={handleSelectUser}
              onSelectAll={handleSelectAll}
              isAllSelected={isAllSelected}
              onViewUser={setViewingUser}
              onEditUser={handleEditUser}
              onDeleteUser={handleDeleteUser}
              onStatusUpdate={handleStatusUpdate}
            />
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </div>

      {/* Modals */}
      <UserForm
        isOpen={isUserFormOpen}
        onClose={() => {
          setIsUserFormOpen(false);
          setEditingUser(null);
        }}
        user={editingUser}
        onSubmit={handleCreateUser}
      />

      {viewingUser && (
        <UserDetailsModal
          user={viewingUser}
          isOpen={!!viewingUser}
          onClose={() => setViewingUser(null)}
          onEdit={handleEditUser}
        />
      )}

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        filters={filters}
      />

      {/* <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSuccess={refetch}
      /> */}
    </div>
  );
};
