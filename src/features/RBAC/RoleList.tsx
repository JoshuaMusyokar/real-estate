import React from "react";
import { Edit2, Trash2, Users, ShieldCheck } from "lucide-react";
import { useDeleteRoleMutation } from "../../services/rbacApi";
import type { Role } from "../../types";

interface RoleListProps {
  roles: Role[];
  isLoading: boolean;
  onCreateRole: () => void;
  onEditRole: (role: Role) => void;
  onManagePermissions: (role: Role) => void;
  onToast: (message: string, type: "success" | "error") => void;
}

export const RoleList: React.FC<RoleListProps> = ({
  roles,
  isLoading,
  onCreateRole,
  onEditRole,
  onManagePermissions,
  onToast,
}) => {
  const [deleteRole, { isLoading: deleteLoading }] = useDeleteRoleMutation();

  const handleDelete = async (role: Role) => {
    if (role.userCount > 0) {
      onToast(
        `Cannot delete "${role.name}" — ${role.userCount} user(s) assigned`,
        "error",
      );
      return;
    }
    if (!window.confirm(`Delete role "${role.name}"? This cannot be undone.`))
      return;
    try {
      await deleteRole(role.id).unwrap();
      onToast("Role deleted", "success");
    } catch (err: any) {
      onToast(err?.data?.message ?? "Failed to delete role", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (roles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-400">
        <ShieldCheck className="w-12 h-12 mb-3 opacity-30" />
        <p className="text-sm">No roles yet.</p>
        <button
          onClick={onCreateRole}
          className="mt-4 text-sm text-indigo-500 hover:text-indigo-400 underline underline-offset-2"
        >
          Create the first role
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {roles.map((role) => (
        <div
          key={role.id}
          className="group relative rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 p-4 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all"
        >
          <div className="flex items-start justify-between gap-4">
            {/* Left — name, description, permission pills */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {role.name}
                </h4>
                {role.userCount > 0 && (
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 flex-shrink-0">
                    <Users className="w-3 h-3" />
                    {role.userCount}
                  </span>
                )}
              </div>

              {role.description && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 truncate">
                  {role.description}
                </p>
              )}

              {/* Permission pills */}
              <div className="flex flex-wrap gap-1.5">
                {role.permissions.slice(0, 5).map((perm) => (
                  <span
                    key={perm.id}
                    className="text-xs px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-mono"
                  >
                    {perm.name}
                  </span>
                ))}
                {role.permissions.length > 5 && (
                  <button
                    onClick={() => onManagePermissions(role)}
                    className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 transition-colors"
                  >
                    +{role.permissions.length - 5} more
                  </button>
                )}
                {role.permissions.length === 0 && (
                  <span className="text-xs text-slate-400 italic">
                    No permissions assigned
                  </span>
                )}
              </div>
            </div>

            {/* Right — action buttons (always visible on mobile, hover on desktop) */}
            <div className="flex items-center gap-1 flex-shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onManagePermissions(role)}
                title="Manage permissions"
                className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400 transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
              </button>
              <button
                onClick={() => onEditRole(role)}
                title="Edit role"
                className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(role)}
                disabled={deleteLoading}
                title="Delete role"
                className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-colors disabled:opacity-40"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
