/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Check,
  Loader,
  AlertCircle,
  ChevronDown,
  Lock,
} from "lucide-react";
import {
  useGetRolesQuery,
  useGetPermissionsQuery,
  useGetRoleStatsQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,
} from "../../services/rbacApi";
import type {
  Role,
  Permission,
  CreateRoleRequest,
  UpdateRoleRequest,
  CreatePermissionRequest,
  UpdatePermissionRequest,
} from "../../types";

export default function RBACManagement() {
  const [activeTab, setActiveTab] = useState<"roles" | "permissions">("roles");
  const [searchTerm, setSearchTerm] = useState("");
  const [rolesPage, setRolesPage] = useState(1);
  const [permissionsPage, setPermissionsPage] = useState(1);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedPermission, setSelectedPermission] =
    useState<Permission | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Form states
  const [roleForm, setRoleForm] = useState({
    name: "",
    description: "",
    permissionIds: [] as string[],
  });
  const [permissionForm, setPermissionForm] = useState({
    name: "",
    description: "",
  });

  // RTK Query hooks
  const {
    data: rolesData,
    isLoading: rolesLoading,
    error: rolesError,
  } = useGetRolesQuery({
    page: rolesPage,
    limit: 10,
    search: searchTerm,
  });

  const {
    data: permissionsData,
    isLoading: permissionsLoading,
    error: permissionsError,
  } = useGetPermissionsQuery({
    page: permissionsPage,
    limit: 50,
    search: searchTerm,
  });

  const { data: statsData, isLoading: statsLoading } = useGetRoleStatsQuery();

  // Mutations
  const [createRole, { isLoading: createRoleLoading }] =
    useCreateRoleMutation();
  const [updateRole, { isLoading: updateRoleLoading }] =
    useUpdateRoleMutation();
  const [deleteRole, { isLoading: deleteRoleLoading }] =
    useDeleteRoleMutation();
  const [createPermission, { isLoading: createPermLoading }] =
    useCreatePermissionMutation();
  const [updatePermission, { isLoading: updatePermLoading }] =
    useUpdatePermissionMutation();
  const [deletePermission, { isLoading: deletePermLoading }] =
    useDeletePermissionMutation();

  // Theme classes
  const bgClass =
    "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:bg-slate-950";

  const cardClass =
    "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md dark:shadow-lg";

  const textClass = "text-slate-900 dark:text-slate-100";

  const mutedTextClass = "text-slate-600 dark:text-slate-400";

  const inputClass =
    "bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500";

  const headerBgClass =
    "bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800";

  const modalBgClass = "bg-white dark:bg-slate-900";

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreateRole = async () => {
    if (!roleForm.name.trim()) {
      showToast("Role name is required", "error");
      return;
    }

    try {
      if (selectedRole) {
        await updateRole({
          id: selectedRole.id,
          data: {
            name: roleForm.name,
            description: roleForm.description,
            permissionIds: roleForm.permissionIds,
          } as UpdateRoleRequest,
        }).unwrap();
        showToast("Role updated successfully", "success");
      } else {
        await createRole({
          name: roleForm.name,
          description: roleForm.description,
          permissionIds: roleForm.permissionIds,
        } as CreateRoleRequest).unwrap();
        showToast("Role created successfully", "success");
      }
      setShowRoleModal(false);
      setRoleForm({ name: "", description: "", permissionIds: [] });
      setSelectedRole(null);
    } catch (error: any) {
      showToast(error?.data?.message || "Failed to save role", "error");
    }
  };

  const handleDeleteRole = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      try {
        await deleteRole(id).unwrap();
        showToast("Role deleted successfully", "success");
      } catch (error: any) {
        showToast(error?.data?.message || "Failed to delete role", "error");
      }
    }
  };

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setRoleForm({
      name: role.name,
      description: role.description || "",
      permissionIds: role.permissions.map((p) => p.id),
    });
    setShowRoleModal(true);
  };

  const handleCreatePermission = async () => {
    if (!permissionForm.name.trim()) {
      showToast("Permission name is required", "error");
      return;
    }

    try {
      if (selectedPermission) {
        await updatePermission({
          id: selectedPermission.id,
          data: {
            name: permissionForm.name,
            description: permissionForm.description,
          } as UpdatePermissionRequest,
        }).unwrap();
        showToast("Permission updated successfully", "success");
      } else {
        await createPermission({
          name: permissionForm.name,
          description: permissionForm.description,
        } as CreatePermissionRequest).unwrap();
        showToast("Permission created successfully", "success");
      }
      setShowPermissionModal(false);
      setPermissionForm({ name: "", description: "" });
      setSelectedPermission(null);
    } catch (error: any) {
      showToast(error?.data?.message || "Failed to save permission", "error");
    }
  };

  const handleDeletePermission = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this permission?")) {
      try {
        await deletePermission(id).unwrap();
        showToast("Permission deleted successfully", "success");
      } catch (error: any) {
        showToast(
          error?.data?.message || "Failed to delete permission",
          "error",
        );
      }
    }
  };

  const handleEditPermission = (permission: Permission) => {
    setSelectedPermission(permission);
    setPermissionForm({
      name: permission.name,
      description: permission.description || "",
    });
    setShowPermissionModal(true);
  };

  const roles = rolesData?.data || [];
  const permissions = permissionsData?.data || [];
  const stats = statsData?.data;
  const rolesPagination = rolesData?.pagination;
  const permissionsPagination = permissionsData?.pagination;

  return (
    <>
      {/* Header */}
      <div
        className={`sticky top-0 z-50 ${headerBgClass} border-b backdrop-blur-md`}
      >
        <div className="max-w-full mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Icon + Title */}
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-md bg-gradient-to-br from-indigo-500 to-blue-600 flex-shrink-0">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <h1
                  className={`text-lg sm:text-xl font-semibold ${textClass} truncate`}
                >
                  RBAC Management
                </h1>
                <p className={`text-xs sm:text-sm ${mutedTextClass} truncate`}>
                  Manage roles, permissions, and access control
                </p>
              </div>
            </div>

            {/* Placeholder for any actions/buttons if needed */}
            {/* <div className="flex items-center gap-2">
          <Button>Action</Button>
      </div> */}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg text-white ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {toast.type === "success" ? (
            <Check className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          {toast.message}
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-full mx-auto py-8">
        {/* Stats */}
        {!statsLoading && stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { label: "Total Roles", value: stats.totalRoles, icon: "⚙️" },
              {
                label: "Total Permissions",
                value: stats.totalPermissions,
                icon: "🔒",
              },
              {
                label: "Total Users",
                value: stats.usersByRole.reduce(
                  (sum, r) => sum + r.userCount,
                  0,
                ),
                icon: "👥",
              },
            ].map((stat, idx) => (
              <div
                key={idx}
                className={`${cardClass} rounded-xl p-6 border transition-all`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className={`${mutedTextClass} text-sm font-medium`}>
                      {stat.label}
                    </p>
                    <p className={`${textClass} text-3xl font-bold mt-2`}>
                      {stat.value}
                    </p>
                  </div>
                  <span className="text-3xl">{stat.icon}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div
          className={`${cardClass} rounded-xl border mb-6 overflow-hidden transition-all`}
        >
          <div className="flex border-b border-slate-200 dark:border-slate-800">
            {["roles", "permissions"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab as "roles" | "permissions");
                  setSearchTerm("");
                  if (tab === "roles") {
                    setRolesPage(1);
                  } else {
                    setPermissionsPage(1);
                  }
                }}
                className={`flex-1 px-6 py-4 font-medium text-center transition-all ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-indigo-500 to-blue-600 text-white"
                    : `${mutedTextClass} hover:${textClass}`
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search
                  className={`absolute left-3 top-3 w-5 h-5 ${mutedTextClass}`}
                />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    if (activeTab === "roles") {
                      setRolesPage(1);
                    } else {
                      setPermissionsPage(1);
                    }
                  }}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${inputClass} transition-all`}
                />
              </div>
            </div>

            {/* Roles Tab */}
            {activeTab === "roles" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className={`${textClass} text-lg font-semibold`}>
                    All Roles
                  </h3>
                  <button
                    onClick={() => {
                      setSelectedRole(null);
                      setRoleForm({
                        name: "",
                        description: "",
                        permissionIds: [],
                      });
                      setShowRoleModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    <Plus className="w-5 h-5" />
                    New Role
                  </button>
                </div>

                {rolesError && (
                  <div className="text-red-500 mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
                    Error loading roles
                  </div>
                )}

                {rolesLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader
                      className={`w-6 h-6 ${mutedTextClass} animate-spin`}
                    />
                  </div>
                ) : roles.length === 0 ? (
                  <div className={`text-center py-12 ${mutedTextClass}`}>
                    <p>No roles found</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      {roles.map((role) => (
                        <div
                          key={role.id}
                          className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border-slate-200 dark:border-slate-700 hover:border-indigo-400 transition-all group"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className={`${textClass} font-semibold mb-1`}>
                                {role.name}
                              </h4>
                              <p className={`${mutedTextClass} text-sm mb-3`}>
                                {role.description}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {role.permissions?.slice(0, 3).map((perm) => (
                                  <span
                                    key={perm.id}
                                    className={`text-xs px-2 py-1 rounded bg-indigo-900/50 text-indigo-300 dark:bg-indigo-100 dark:text-indigo-700`}
                                  >
                                    {perm.name}
                                  </span>
                                ))}
                                {role.permissions &&
                                  role.permissions.length > 3 && (
                                    <span
                                      className={`text-xs px-2 py-1 rounded bg-slate-700 text-slate-300 dark:bg-slate-200 dark:text-slate-600`}
                                    >
                                      +{role.permissions.length - 3} more
                                    </span>
                                  )}
                              </div>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleEditRole(role)}
                                className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                              >
                                <Edit2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              </button>
                              <button
                                onClick={() => handleDeleteRole(role.id)}
                                disabled={deleteRoleLoading}
                                className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50"
                              >
                                <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    {rolesPagination && rolesPagination.totalPages > 1 && (
                      <div className="flex justify-center gap-2 mt-6">
                        {Array.from(
                          { length: rolesPagination.totalPages },
                          (_, i) => i + 1,
                        ).map((page) => (
                          <button
                            key={page}
                            onClick={() => setRolesPage(page)}
                            className={`px-3 py-1 rounded-lg transition-all bg-indigo-500 text-white bg-slate-800 hover:bg-slate-700 dark:bg-slate-200 dark:hover:bg-slate-300`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Permissions Tab */}
            {activeTab === "permissions" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className={`${textClass} text-lg font-semibold`}>
                    All Permissions
                  </h3>
                  <button
                    onClick={() => {
                      setSelectedPermission(null);
                      setPermissionForm({ name: "", description: "" });
                      setShowPermissionModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    <Plus className="w-5 h-5" />
                    New Permission
                  </button>
                </div>

                {permissionsError && (
                  <div
                    className={`text-red-500 mb-4 p-3 rounded-lg bg-red-900/20" : dark:bg-red-50`}
                  >
                    Error loading permissions
                  </div>
                )}

                {permissionsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader
                      className={`w-6 h-6 ${mutedTextClass} animate-spin`}
                    />
                  </div>
                ) : permissions.length === 0 ? (
                  <div className={`text-center py-12 ${mutedTextClass}`}>
                    <p>No permissions found</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {permissions.map((perm) => (
                        <div
                          key={perm.id}
                          className="
                          bg-slate-50 dark:bg-slate-800/50
                          rounded-lg p-4
                          border border-slate-200 dark:border-slate-700
                          hover:border-indigo-400
                          transition-all group
                          flex items-start justify-between"
                        >
                          <div className="flex-1">
                            <h4 className={`${textClass} font-semibold`}>
                              {perm.name}
                            </h4>
                            <p className={`${mutedTextClass} text-sm`}>
                              {perm.description}
                            </p>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEditPermission(perm)}
                              className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </button>
                            <button
                              onClick={() => handleDeletePermission(perm.id)}
                              disabled={deletePermLoading}
                              className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50"
                            >
                              <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    {permissionsPagination &&
                      permissionsPagination.totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-6">
                          {Array.from(
                            { length: permissionsPagination.totalPages },
                            (_, i) => i + 1,
                          ).map((page) => (
                            <button
                              key={page}
                              onClick={() => setPermissionsPage(page)}
                              className={`
    px-3 py-1 rounded-lg transition-all
    ${
      permissionsPage === page
        ? "bg-indigo-500 text-white"
        : "bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100"
    }
  `}
                            >
                              {page}
                            </button>
                          ))}
                        </div>
                      )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Role Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className={`${modalBgClass} rounded-xl p-6 max-w-md w-full border dark:border-slate-700 border-slate-200`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-xl font-bold ${textClass}`}>
                {selectedRole ? "Edit Role" : "Create Role"}
              </h3>
              <button
                onClick={() => setShowRoleModal(false)}
                className={`p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  className={`block text-sm font-medium ${mutedTextClass} mb-1`}
                >
                  Role Name
                </label>
                <input
                  type="text"
                  value={roleForm.name}
                  onChange={(e) =>
                    setRoleForm({ ...roleForm, name: e.target.value })
                  }
                  className={`w-full px-3 py-2 rounded-lg border ${inputClass} transition-all`}
                  placeholder="Enter role name"
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium ${mutedTextClass} mb-1`}
                >
                  Description
                </label>
                <textarea
                  value={roleForm.description}
                  onChange={(e) =>
                    setRoleForm({ ...roleForm, description: e.target.value })
                  }
                  className={`w-full px-3 py-2 rounded-lg border ${inputClass} transition-all resize-none`}
                  rows={3}
                  placeholder="Enter role description"
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium ${mutedTextClass} mb-2`}
                >
                  Permissions
                </label>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {permissions.map((perm) => (
                    <label
                      key={perm.id}
                      className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:dark:bg-slate-800 hover:bg-slate-100`}
                    >
                      <input
                        type="checkbox"
                        checked={roleForm.permissionIds.includes(perm.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setRoleForm({
                              ...roleForm,
                              permissionIds: [
                                ...roleForm.permissionIds,
                                perm.id,
                              ],
                            });
                          } else {
                            setRoleForm({
                              ...roleForm,
                              permissionIds: roleForm.permissionIds.filter(
                                (id) => id !== perm.id,
                              ),
                            });
                          }
                        }}
                        className="w-4 h-4"
                      />
                      <span className={`text-sm ${textClass}`}>
                        {perm.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowRoleModal(false)}
                className={`flex-1 px-4 py-2 rounded-lg transition-all bg-slate-800 hover:bg-slate-700 dark:bg-slate-200 dark:hover:bg-slate-300`}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRole}
                disabled={createRoleLoading || updateRoleLoading}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {(createRoleLoading || updateRoleLoading) && (
                  <Loader className="w-4 h-4 animate-spin" />
                )}
                {selectedRole ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Permission Modal */}
      {showPermissionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className={`${modalBgClass} rounded-xl p-6 max-w-md w-full border border-slate-700 dark:border-slate-200`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-xl font-bold ${textClass}`}>
                {selectedPermission ? "Edit Permission" : "Create Permission"}
              </h3>
              <button
                onClick={() => setShowPermissionModal(false)}
                className={`p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  className={`block text-sm font-medium ${mutedTextClass} mb-1`}
                >
                  Permission Name
                </label>
                <input
                  type="text"
                  value={permissionForm.name}
                  onChange={(e) =>
                    setPermissionForm({
                      ...permissionForm,
                      name: e.target.value,
                    })
                  }
                  className={`w-full px-3 py-2 rounded-lg border ${inputClass} transition-all`}
                  placeholder="e.g., users.create"
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium ${mutedTextClass} mb-1`}
                >
                  Description
                </label>
                <textarea
                  value={permissionForm.description}
                  onChange={(e) =>
                    setPermissionForm({
                      ...permissionForm,
                      description: e.target.value,
                    })
                  }
                  className={`w-full px-3 py-2 rounded-lg border ${inputClass} transition-all resize-none`}
                  rows={3}
                  placeholder="Enter permission description"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowPermissionModal(false)}
                className={`flex-1 px-4 py-2 rounded-lg transition-all dark:bg-slate-800 dark:hover:bg-slate-700 bg-slate-200 hover:bg-slate-300`}
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePermission}
                disabled={createPermLoading || updatePermLoading}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {(createPermLoading || updatePermLoading) && (
                  <Loader className="w-4 h-4 animate-spin" />
                )}
                {selectedPermission ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
