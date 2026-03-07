import React, { useState, useEffect, useMemo } from "react";
import { X, Search, Loader2, ShieldCheck, Save, RotateCcw } from "lucide-react";
import {
  useGetPermissionsQuery,
  useSyncPermissionsOnRoleMutation,
} from "../../services/rbacApi";
import type { Role } from "../../types";

interface RolePermissionsPanelProps {
  role: Role;
  onClose: () => void;
  onToast: (message: string, type: "success" | "error") => void;
}

export const RolePermissionsPanel: React.FC<RolePermissionsPanelProps> = ({
  role,
  onClose,
  onToast,
}) => {
  const { data: allPermissions = [], isLoading: loadingPerms } =
    useGetPermissionsQuery();
  const [syncPermissions, { isLoading: saving }] =
    useSyncPermissionsOnRoleMutation();

  // Local draft — starts from role's current permissions
  const [selected, setSelected] = useState<Set<string>>(
    new Set(role.permissions.map((p) => p.id)),
  );
  const [search, setSearch] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  // Reset draft when role changes
  useEffect(() => {
    setSelected(new Set(role.permissions.map((p) => p.id)));
    setIsDirty(false);
    setSearch("");
  }, [role.id]);

  const filtered = useMemo(
    () =>
      allPermissions.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          (p.description ?? "").toLowerCase().includes(search.toLowerCase()),
      ),
    [allPermissions, search],
  );

  // Group permissions by prefix (e.g. "users", "leads", "properties")
  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    filtered.forEach((p) => {
      const prefix = p.name.includes(":")
        ? p.name.split(":")[0]
        : p.name.includes("_")
          ? p.name.split("_")[0]
          : "other";
      if (!map.has(prefix)) map.set(prefix, []);
      map.get(prefix)!.push(p);
    });
    return map;
  }, [filtered]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    setIsDirty(true);
  };

  const toggleGroup = (ids: string[]) => {
    const allChecked = ids.every((id) => selected.has(id));
    setSelected((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => (allChecked ? next.delete(id) : next.add(id)));
      return next;
    });
    setIsDirty(true);
  };

  const reset = () => {
    setSelected(new Set(role.permissions.map((p) => p.id)));
    setIsDirty(false);
  };

  const handleSave = async () => {
    try {
      await syncPermissions({
        roleId: role.id,
        permissionIds: Array.from(selected),
      }).unwrap();
      onToast("Permissions saved", "success");
      setIsDirty(false);
    } catch (err: any) {
      onToast(err?.data?.message ?? "Failed to save permissions", "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white dark:bg-slate-900 w-full sm:max-w-xl sm:rounded-2xl rounded-t-2xl border border-slate-200 dark:border-slate-700 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Permissions
              </h3>
              <span className="text-sm font-normal text-slate-400">
                — {role.name}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {selected.size} of {allPermissions.length} permissions selected
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search permissions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Permission List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {loadingPerms ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-sm text-slate-400 py-8">
              No permissions match
            </p>
          ) : (
            Array.from(grouped.entries()).map(([group, perms]) => {
              const groupIds = perms.map((p) => p.id);
              const allChecked = groupIds.every((id) => selected.has(id));
              const someChecked = groupIds.some((id) => selected.has(id));

              return (
                <div key={group}>
                  {/* Group header */}
                  <div className="flex items-center gap-3 mb-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={allChecked}
                        ref={(el) => {
                          if (el) el.indeterminate = someChecked && !allChecked;
                        }}
                        onChange={() => toggleGroup(groupIds)}
                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {group}
                      </span>
                    </label>
                    <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
                    <span className="text-xs text-slate-400">
                      {groupIds.filter((id) => selected.has(id)).length}/
                      {groupIds.length}
                    </span>
                  </div>

                  {/* Permissions in group */}
                  <div className="space-y-1 pl-1">
                    {perms.map((perm) => (
                      <label
                        key={perm.id}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                      >
                        <input
                          type="checkbox"
                          checked={selected.has(perm.id)}
                          onChange={() => toggle(perm.id)}
                          className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-mono text-slate-800 dark:text-slate-200">
                            {perm.name}
                          </span>
                          {perm.description && (
                            <p className="text-xs text-slate-400 truncate mt-0.5">
                              {perm.description}
                            </p>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 flex-shrink-0">
          <button
            onClick={reset}
            disabled={!isDirty}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 disabled:opacity-30 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!isDirty || saving}
              className="px-4 py-2 text-sm rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium flex items-center gap-2 disabled:opacity-50 transition-colors"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Permissions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
