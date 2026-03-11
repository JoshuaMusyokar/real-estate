import React, { useState } from "react";
import { Plus, Trash2, Lock, Loader2, X } from "lucide-react";
import {
  useCreatePermissionMutation,
  useDeletePermissionMutation,
} from "../../services/rbacApi";
import type { Permission } from "../../types";
import { parseApiError } from "../../utils/Apierror";

interface PermissionListProps {
  permissions: Permission[];
  isLoading: boolean;
  onToast: (message: string, type: "success" | "error") => void;
  // Optional — parent passes false/undefined when user lacks the permission
  canAdd?: boolean;
  canEdit?: boolean; // reserved for future inline-edit UI
  canDelete?: boolean;
}

export const PermissionList: React.FC<PermissionListProps> = ({
  permissions,
  isLoading,
  onToast,
  canAdd = false,
  canDelete = false,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");

  const [createPermission, { isLoading: creating }] =
    useCreatePermissionMutation();
  const [deletePermission, { isLoading: deleting }] =
    useDeletePermissionMutation();

  const filtered = permissions.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  // Group by prefix (dot → primary separator to match "user.add" style,
  // fall back to colon then underscore for legacy names)
  const grouped = filtered.reduce(
    (acc, p) => {
      const prefix = p.name.includes(".")
        ? p.name.split(".")[0]
        : p.name.includes(":")
          ? p.name.split(":")[0]
          : p.name.includes("_")
            ? p.name.split("_")[0]
            : "other";
      if (!acc[prefix]) acc[prefix] = [];
      acc[prefix].push(p);
      return acc;
    },
    {} as Record<string, Permission[]>,
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    try {
      await createPermission({ name, description }).unwrap();
      onToast("Permission created", "success");
      setName("");
      setDescription("");
      setShowForm(false);
    } catch (err: unknown) {
      const parsed = parseApiError(err);
      if (parsed.fieldErrors) {
        setFieldErrors(
          parsed.fieldErrors.reduce(
            (acc, e) => ({ ...acc, [e.field]: e.message }),
            {} as Record<string, string>,
          ),
        );
      } else {
        onToast(parsed.detail ?? "Failed to create permission", "error");
      }
    }
  };

  const handleDelete = async (perm: Permission) => {
    if (
      !window.confirm(
        `Delete permission "${perm.name}"? Any roles using it will lose it.`,
      )
    )
      return;
    try {
      await deletePermission(perm.id).unwrap();
      onToast("Permission deleted", "success");
    } catch {
      onToast("Failed to delete permission", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-14 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search permissions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-3 pr-4 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        {/* New Permission button — hidden without permission.add */}
        {canAdd && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            New Permission
          </button>
        )}
      </div>

      {/* Inline create form — only mounted when canAdd */}
      {canAdd && showForm && (
        <div className="mb-5 p-4 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-900/20">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-indigo-800 dark:text-indigo-300">
              New Permission
            </h4>
            <button
              onClick={() => {
                setShowForm(false);
                setFieldErrors({});
              }}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleCreate} className="space-y-3">
            <div>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setFieldErrors((p) => ({ ...p, name: "" }));
                }}
                placeholder="e.g. user.create or property.approve"
                className={`w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono ${
                  fieldErrors.name
                    ? "border-red-400"
                    : "border-slate-300 dark:border-slate-600"
                }`}
              />
              {fieldErrors.name && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>
              )}
              <p className="mt-1 text-xs text-slate-400">
                Lowercase letters, dots, underscores, or colons only.
              </p>
            </div>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this permission allow?"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creating}
                className="flex-1 px-3 py-1.5 text-sm rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
              >
                {creating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Create
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
          <Lock className="w-10 h-10 mb-3 opacity-30" />
          <p className="text-sm">No permissions found.</p>
        </div>
      )}

      {/* Grouped list */}
      <div className="space-y-5">
        {Object.entries(grouped).map(([group, perms]) => (
          <div key={group}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {group}
              </span>
              <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
              <span className="text-xs text-slate-400">{perms.length}</span>
            </div>

            <div className="space-y-1">
              {perms.map((perm) => (
                <div
                  key={perm.id}
                  className="group flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-mono text-slate-800 dark:text-slate-200">
                      {perm.name}
                    </span>
                    {perm.description && (
                      <p className="text-xs text-slate-400 mt-0.5 truncate">
                        {perm.description}
                      </p>
                    )}
                  </div>
                  {/* Delete button — hidden without permission.delete */}
                  {canDelete && (
                    <button
                      onClick={() => handleDelete(perm)}
                      disabled={deleting}
                      className="ml-3 p-1.5 rounded-lg text-slate-300 dark:text-slate-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 opacity-0 group-hover:opacity-100 transition-all disabled:opacity-30"
                      title="Delete permission"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
