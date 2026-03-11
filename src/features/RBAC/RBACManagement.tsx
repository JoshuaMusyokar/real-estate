import React, { useState } from "react";
import { Lock, ShieldCheck, Key, CheckCircle, AlertCircle } from "lucide-react";
import {
  useGetRolesQuery,
  useGetPermissionsQuery,
} from "../../services/rbacApi";
import type { Role } from "../../types";
import { RoleList } from "./RoleList";
import { RoleModal } from "./RoleModal";
import { RolePermissionsPanel } from "./Rolepermissionpanel";
import { PermissionList } from "./Permissionlist";
import { usePermissions } from "../../hooks/usePermissions";

// ─── Toast ────────────────────────────────────────────────────────────────────

interface ToastState {
  message: string;
  type: "success" | "error";
  id: number;
}

const Toast: React.FC<{ toast: ToastState }> = ({ toast }) => (
  <div
    className={`fixed top-5 right-5 z-[9999] flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-white text-sm font-medium transition-all animate-in slide-in-from-right-8 ${toast.type === "success" ? "bg-emerald-600" : "bg-red-600"}`}
  >
    {toast.type === "success" ? (
      <CheckCircle className="w-4 h-4 flex-shrink-0" />
    ) : (
      <AlertCircle className="w-4 h-4 flex-shrink-0" />
    )}
    {toast.message}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export default function RBACManagement() {
  const [activeTab, setActiveTab] = useState<"roles" | "permissions">("roles");
  const [rolesPage, setRolesPage] = useState(1);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [permissionsPanelRole, setPermissionsPanelRole] = useState<Role | null>(
    null,
  );
  const [toast, setToast] = useState<ToastState | null>(null);

  // ── Permissions ─────────────────────────────────────────────────────────────
  const { can } = usePermissions();
  const canAddRole = can("role.add");
  const canEditRole = can("role.edit");
  const canDeleteRole = can("role.delete");
  const canAssignPerms = can("role.assign_permissions");
  const canAddPermission = can("permission.add");
  const canEditPermission = can("permission.edit");
  const canDeletePermission = can("permission.delete");

  // ── Data ─────────────────────────────────────────────────────────────────────
  const showToast = (message: string, type: "success" | "error") => {
    const id = Date.now();
    setToast({ message, type, id });
    setTimeout(() => setToast((t) => (t?.id === id ? null : t)), 3500);
  };

  const { data: rolesData, isLoading: rolesLoading } = useGetRolesQuery({
    page: rolesPage,
    limit: 15,
  });
  const { data: permissions = [], isLoading: permsLoading } =
    useGetPermissionsQuery();

  const roles = rolesData?.roles ?? [];
  const totalPages = rolesData?.totalPages ?? 1;

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleRoleSaved = (saved: Role) => {
    // After creating a new role, open permissions panel immediately (if allowed)
    if (!editingRole && canAssignPerms) setPermissionsPanelRole(saved);
    setEditingRole(null);
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setRoleModalOpen(true);
  };

  const handleManagePermissions = (role: Role) => {
    const fresh = roles.find((r) => r.id === role.id) ?? role;
    setPermissionsPanelRole(fresh);
  };

  const TABS = [
    { id: "roles" as const, label: "Roles", icon: ShieldCheck },
    { id: "permissions" as const, label: "Permissions", icon: Key },
  ];

  return (
    <div className="min-h-screen">
      {toast && <Toast toast={toast} />}

      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 rounded-xl px-6 py-5 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Access Control
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Manage roles, permissions, and what each role can do
            </p>
          </div>
        </div>
      </div>

      {/* Tab nav + content */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        {/* Tab bar */}
        <div className="flex border-b border-slate-200 dark:border-slate-800">
          {TABS.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  active
                    ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
                    : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {/* ── Roles tab ─────────────────────────────────────────────────── */}
          {activeTab === "roles" && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  All Roles
                </h3>
                {/* New Role — hidden without role.add */}
                {canAddRole && (
                  <button
                    onClick={() => {
                      setEditingRole(null);
                      setRoleModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                  >
                    + New Role
                  </button>
                )}
              </div>

              <RoleList
                roles={roles}
                isLoading={rolesLoading}
                onToast={showToast}
                // Empty-state "Create" button — only if allowed
                onCreateRole={
                  canAddRole
                    ? () => {
                        setEditingRole(null);
                        setRoleModalOpen(true);
                      }
                    : undefined
                }
                // Edit pencil — only if allowed
                onEditRole={canEditRole ? handleEditRole : undefined}
                // Permissions panel trigger — only if allowed
                onManagePermissions={
                  canAssignPerms ? handleManagePermissions : undefined
                }
                // Delete trash — RoleList gates each row's button on this flag
                canDelete={canDeleteRole}
              />

              {totalPages > 1 && (
                <div className="flex justify-center gap-1.5 mt-6">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <button
                        key={p}
                        onClick={() => setRolesPage(p)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                          p === rolesPage
                            ? "bg-indigo-600 text-white"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        {p}
                      </button>
                    ),
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── Permissions tab ───────────────────────────────────────────── */}
          {activeTab === "permissions" && (
            <div>
              <div className="mb-5">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  System Permissions
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Define granular actions that can be assigned to roles
                </p>
              </div>

              <PermissionList
                permissions={permissions}
                isLoading={permsLoading}
                onToast={showToast}
                // PermissionList gates add/edit/delete buttons on these flags
                canAdd={canAddPermission}
                canEdit={canEditPermission}
                canDelete={canDeletePermission}
              />
            </div>
          )}
        </div>
      </div>

      {/* Role modal — only mounted when user can add or edit */}
      {(canAddRole || canEditRole) && (
        <RoleModal
          isOpen={roleModalOpen}
          role={editingRole}
          onClose={() => {
            setRoleModalOpen(false);
            setEditingRole(null);
          }}
          onToast={showToast}
          onSaved={handleRoleSaved}
        />
      )}

      {/* Permissions panel — only mounted when user can assign permissions */}
      {canAssignPerms && permissionsPanelRole && (
        <RolePermissionsPanel
          role={permissionsPanelRole}
          onClose={() => setPermissionsPanelRole(null)}
          onToast={showToast}
        />
      )}
    </div>
  );
}
