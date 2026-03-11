import React, { useState } from "react";
import {
  Users,
  Building2,
  UserCircle,
  Plus,
  Search,
  Download,
  ChevronRight,
  Crown,
  Briefcase,
  Home,
} from "lucide-react";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserStatusMutation,
  useBulkUserOperationMutation,
  useGetUserStatsQuery,
} from "../../services/userApi";
import type { UserResponse, UserStatus } from "../../types";
import { UserForm } from "./UserForm";
import { UserDetailsModal } from "./UserDetailModal";
import { BulkActions } from "./BulkAction";
import { UserTable } from "./UserTable";
import { UserTableSkeleton } from "./UserTableSkeleton";
import { Pagination } from "./Pagination";
import { ExportModal } from "./ExportModal";
import { usePermissions } from "../../hooks/usePermissions";

// ─── Tab Configuration ────────────────────────────────────────────────────────

interface TabConfig {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
  roleNames: string[];
  primaryRole: string;
  canAddStaff: boolean;
  groupByManager: boolean;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
}

const TABS: TabConfig[] = [
  {
    id: "superadmin",
    label: "Super Admin & Staff",
    icon: Crown,
    description: "Platform administrators and their support staff",
    roleNames: ["SUPER_ADMIN", "ADMIN"],
    primaryRole: "ADMIN",
    canAddStaff: true,
    groupByManager: false,
    accentColor: "violet",
    badgeBg: "bg-violet-100 dark:bg-violet-900/40",
    badgeText: "text-violet-700 dark:text-violet-300",
  },
  {
    id: "brokers",
    label: "Brokers & Staff",
    icon: Briefcase,
    description: "Brokers/agents and their assigned staff members",
    roleNames: ["AGENT", "AGENT_STAFF", "SALES_AGENT"],
    primaryRole: "AGENT",
    canAddStaff: true,
    groupByManager: true,
    accentColor: "blue",
    badgeBg: "bg-blue-100 dark:bg-blue-900/40",
    badgeText: "text-blue-700 dark:text-blue-300",
  },
  {
    id: "developers",
    label: "Developers & Staff",
    icon: Building2,
    description: "Property developers/builders and their staff",
    roleNames: ["BUILDER", "BUILDER_STAFF"],
    primaryRole: "BUILDER",
    canAddStaff: true,
    groupByManager: true,
    accentColor: "amber",
    badgeBg: "bg-amber-100 dark:bg-amber-900/40",
    badgeText: "text-amber-700 dark:text-amber-300",
  },
  {
    id: "users",
    label: "Users / Buyers / Owners",
    icon: Home,
    description: "End users, property buyers and property owners",
    roleNames: ["BUYER", "OWNER_STAFF", "OWNER", "USER"],
    primaryRole: "BUYER",
    canAddStaff: false,
    groupByManager: false,
    accentColor: "emerald",
    badgeBg: "bg-emerald-100 dark:bg-emerald-900/40",
    badgeText: "text-emerald-700 dark:text-emerald-300",
  },
];

// ─── Role Badge ───────────────────────────────────────────────────────────────

const RoleBadge: React.FC<{ role: string; tab: TabConfig }> = ({
  role,
  tab,
}) => (
  <span
    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${tab.badgeBg} ${tab.badgeText}`}
  >
    {role}
  </span>
);

// ─── Tab Panel ────────────────────────────────────────────────────────────────

interface TabPanelProps {
  tab: TabConfig;
}

const TabPanel: React.FC<TabPanelProps> = ({ tab }) => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserResponse | null>(null);
  const [viewingUser, setViewingUser] = useState<UserResponse | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const limit = 10;

  // ── Permissions ─────────────────────────────────────────────────────────────
  const { can } = usePermissions();
  const canAdd = can("user.add");
  const canEdit = can("user.edit");
  const canDelete = can("user.delete");
  const canExport = can("user.export");
  const canBulk = can("user.bulk_action");

  // ── Data ────────────────────────────────────────────────────────────────────
  const { data: usersData, isLoading } = useGetUsersQuery({
    roleNames: tab.roleNames,
    search: searchQuery || undefined,
    page,
    limit,
  });

  const [deleteUser] = useDeleteUserMutation();
  const [updateUserStatus] = useUpdateUserStatusMutation();
  const [bulkOperation] = useBulkUserOperationMutation();

  const users = usersData?.users || [];
  const totalPages = usersData?.totalPages || 1;
  const total = usersData?.total || 0;
  const isAllSelected =
    selectedUsers.length === users.length && users.length > 0;

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleSelectAll = () => {
    setSelectedUsers(isAllSelected ? [] : users.map((u) => u.id));
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await deleteUser(userId).unwrap();
      setSelectedUsers((prev) => prev.filter((id) => id !== userId));
    }
  };

  const handleStatusUpdate = async (userId: string, status: UserStatus) => {
    await updateUserStatus({ id: userId, status }).unwrap();
  };

  const handleBulkAction = async (
    operation: "activate" | "deactivate" | "delete",
  ) => {
    if (!selectedUsers.length) return;
    await bulkOperation({ userIds: selectedUsers, operation }).unwrap();
    setSelectedUsers([]);
  };

  const handleEditUser = (user: UserResponse) => {
    setEditingUser(user);
    setIsUserFormOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {tab.description}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {total} {total === 1 ? "member" : "members"}
            </span>
            <span className="text-gray-300 dark:text-gray-600">·</span>
            <div className="flex gap-1">
              {tab.roleNames.map((r) => (
                <RoleBadge key={r} role={r} tab={tab} />
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Export — hidden without user.export */}
          {canExport && (
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Download size={16} />
              <span className="hidden sm:block">Export</span>
            </button>
          )}

          {/* Add — hidden without user.add */}
          {canAdd && (
            <button
              onClick={() => {
                setEditingUser(null);
                setIsUserFormOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              Add {tab.id === "users" ? "User" : "Member"}
            </button>
          )}
        </div>
      </div>

      {/* Search — always visible (read access) */}
      <div className="relative max-w-md">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={16}
        />
        <input
          type="text"
          placeholder={`Search ${tab.label.toLowerCase()}...`}
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      {/* Bulk Actions — only shown when user has bulk permission AND rows are selected */}
      {canBulk && selectedUsers.length > 0 && (
        <BulkActions
          selectedCount={selectedUsers.length}
          onBulkAction={handleBulkAction}
          onClearSelection={() => setSelectedUsers([])}
        />
      )}

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {isLoading ? (
          <UserTableSkeleton />
        ) : (
          <UserTable
            users={users}
            selectedUsers={selectedUsers}
            // Checkbox column only appears when user can bulk-act or delete
            onSelectUser={canBulk || canDelete ? handleSelectUser : undefined}
            onSelectAll={canBulk || canDelete ? handleSelectAll : undefined}
            isAllSelected={isAllSelected}
            onViewUser={setViewingUser}
            onEditUser={canEdit ? handleEditUser : undefined}
            onDeleteUser={canDelete ? handleDeleteUser : undefined}
            onStatusUpdate={canEdit ? handleStatusUpdate : undefined}
          />
        )}
      </div>

      {/* Pagination — always shown */}
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      {/* Modals — only mounted when user has the corresponding permission */}
      {(canAdd || canEdit) && (
        <UserForm
          isOpen={isUserFormOpen}
          onClose={() => {
            setIsUserFormOpen(false);
            setEditingUser(null);
          }}
          user={editingUser}
        />
      )}

      {viewingUser && (
        <UserDetailsModal
          user={viewingUser}
          isOpen={!!viewingUser}
          onClose={() => setViewingUser(null)}
          onEdit={canEdit ? handleEditUser : undefined}
        />
      )}

      {canExport && (
        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          filters={{ roleNames: tab.roleNames }}
        />
      )}
    </div>
  );
};

// ─── Summary Stats Strip ──────────────────────────────────────────────────────

const TabStatsStrip: React.FC = () => {
  const { data: statsData } = useGetUserStatsQuery();
  const stats = statsData?.data;
  if (!stats) return null;

  const strips = [
    {
      label: "Total Users",
      value: stats.total,
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Active Today",
      value: stats.activeToday,
      icon: UserCircle,
      color: "text-emerald-600 dark:text-emerald-400",
    },
  ];

  return (
    <div className="flex gap-4 mb-6">
      {strips.map(({ label, value, icon: Icon, color }) => (
        <div
          key={label}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <Icon size={16} className={color} />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {label}:
          </span>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {value}
          </span>
        </div>
      ))}
    </div>
  );
};

// ─── Management Page ──────────────────────────────────────────────────────────

export const Management: React.FC = () => {
  const [activeTabId, setActiveTabId] = useState(TABS[0].id);
  const activeTab = TABS.find((t) => t.id === activeTabId)!;

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 rounded-xl px-6 py-5 mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
          <span>Dashboard</span>
          <ChevronRight size={14} />
          <span className="text-gray-900 dark:text-white font-medium">
            Management
          </span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          User Management
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage all users, roles and access across the platform
        </p>
      </div>

      <TabStatsStrip />

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Tab Bar */}
        <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          <nav className="flex min-w-max" aria-label="Management tabs">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = tab.id === activeTabId;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                  className={`
                    relative flex items-center gap-2.5 px-5 py-4 text-sm font-medium whitespace-nowrap
                    transition-colors border-b-2 focus:outline-none
                    ${
                      isActive
                        ? "border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-900/10"
                        : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    }
                  `}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon
                    size={16}
                    className={
                      isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-400"
                    }
                  />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          <TabPanel key={activeTabId} tab={activeTab} />
        </div>
      </div>
    </div>
  );
};

export default Management;
