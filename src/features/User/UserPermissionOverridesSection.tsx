/**
 * UserPermissionOverridesSection
 *
 * A self-contained form section that lets an admin configure per-user
 * permission overrides (grant / revoke on top of a role).
 *
 * Used inside:
 *   - UserForm (create & edit)
 *   - Any future modal that needs override editing
 *
 * Props:
 *   value        – current UserPermissionOverrides ({ grant?, revoke? })
 *   onChange     – called with the new overrides whenever the user toggles something
 *   roleName     – optional, shown in the "from role" column header
 *   rolePermissions – permission names already given by the user's role
 *                     (so we can show which ones are baseline vs extra)
 */

import React, { useMemo, useState } from "react";
import {
  ShieldPlus,
  ShieldX,
  ShieldCheck,
  RotateCcw,
  Search,
  Info,
} from "lucide-react";
import { useGetPermissionsQuery } from "../../services/rbacApi";
import type { UserPermissionOverrides } from "../../types";

interface UserPermissionOverridesSectionProps {
  value: UserPermissionOverrides;
  onChange: (overrides: UserPermissionOverrides) => void;
  roleName?: string;
  rolePermissions?: string[]; // names coming from the selected role
  disabled?: boolean;
}

type OverrideState = "grant" | "revoke" | null;

// ─── Small pill showing current state ────────────────────────────────────────

const StatePill: React.FC<{ state: OverrideState; fromRole: boolean }> = ({
  state,
  fromRole,
}) => {
  if (state === "grant")
    return (
      <span className="inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 font-medium">
        <ShieldPlus className="w-3 h-3" /> Granted
      </span>
    );
  if (state === "revoke")
    return (
      <span className="inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 font-medium line-through">
        <ShieldX className="w-3 h-3" /> Revoked
      </span>
    );
  if (fromRole)
    return (
      <span className="inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
        <ShieldCheck className="w-3 h-3" /> Role
      </span>
    );
  return null;
};

// ─── Main component ───────────────────────────────────────────────────────────

export const UserPermissionOverridesSection: React.FC<
  UserPermissionOverridesSectionProps
> = ({ value, onChange, roleName, rolePermissions = [], disabled = false }) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "grant" | "revoke" | "role">(
    "all",
  );

  const { data: allPermissions = [], isLoading } = useGetPermissionsQuery();

  // Build a quick lookup
  const grantSet = useMemo(() => new Set(value.grant ?? []), [value.grant]);
  const revokeSet = useMemo(() => new Set(value.revoke ?? []), [value.revoke]);
  const roleSet = useMemo(() => new Set(rolePermissions), [rolePermissions]);

  const getState = (name: string): OverrideState => {
    if (grantSet.has(name)) return "grant";
    if (revokeSet.has(name)) return "revoke";
    return null;
  };

  const setOverride = (name: string, next: OverrideState) => {
    const grant = new Set(value.grant ?? []);
    const revoke = new Set(value.revoke ?? []);
    // Clear both first
    grant.delete(name);
    revoke.delete(name);
    if (next === "grant") grant.add(name);
    if (next === "revoke") revoke.add(name);
    onChange({
      grant: Array.from(grant),
      revoke: Array.from(revoke),
    });
  };

  // Filter + search
  const visible = useMemo(() => {
    let perms = allPermissions;
    if (search.trim())
      perms = perms.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          (p.description ?? "").toLowerCase().includes(search.toLowerCase()),
      );
    if (filter === "grant") perms = perms.filter((p) => grantSet.has(p.name));
    if (filter === "revoke") perms = perms.filter((p) => revokeSet.has(p.name));
    if (filter === "role") perms = perms.filter((p) => roleSet.has(p.name));
    return perms;
  }, [allPermissions, search, filter, grantSet, revokeSet, roleSet]);

  // Group by prefix
  const grouped = useMemo(() => {
    const map = new Map<string, typeof visible>();
    visible.forEach((p) => {
      const prefix = p.name.includes(":")
        ? p.name.split(":")[0]
        : p.name.includes("_")
          ? p.name.split("_")[0]
          : "other";
      if (!map.has(prefix)) map.set(prefix, []);
      map.get(prefix)!.push(p);
    });
    return map;
  }, [visible]);

  const grantCount = grantSet.size;
  const revokeCount = revokeSet.size;
  const hasOverrides = grantCount > 0 || revokeCount > 0;

  return (
    <div className="space-y-3">
      {/* Header info */}
      <div className="flex items-start gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
        <Info className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {roleName ? (
            <>
              Permissions from{" "}
              <span className="font-mono font-medium text-slate-700 dark:text-slate-300">
                {roleName}
              </span>{" "}
              are shown as baseline. Use{" "}
              <span className="text-emerald-600 font-medium">Grant</span> to add
              extra permissions, or{" "}
              <span className="text-red-500 font-medium">Revoke</span> to block
              role permissions for this user specifically.
            </>
          ) : (
            <>
              Select a role above first to see which permissions are already
              included in the role.
            </>
          )}
        </p>
      </div>

      {/* Summary badges */}
      {hasOverrides && (
        <div className="flex items-center gap-3 flex-wrap">
          {grantCount > 0 && (
            <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-700">
              <ShieldPlus className="w-3 h-3" />
              {grantCount} granted
            </span>
          )}
          {revokeCount > 0 && (
            <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-700">
              <ShieldX className="w-3 h-3" />
              {revokeCount} revoked
            </span>
          )}
          <button
            type="button"
            onClick={() => onChange({ grant: [], revoke: [] })}
            disabled={disabled}
            className="ml-auto text-xs text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors disabled:opacity-40"
          >
            <RotateCcw className="w-3 h-3" /> Clear all overrides
          </button>
        </div>
      )}

      {/* Search + filter tabs */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search permissions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={disabled}
            className="w-full pl-8 pr-3 py-1.5 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
          />
        </div>

        <div className="flex gap-0 text-xs border-b border-slate-200 dark:border-slate-700">
          {(
            [
              { id: "all", label: `All (${allPermissions.length})` },
              { id: "role", label: `Role (${roleSet.size})` },
              { id: "grant", label: `Grant (${grantCount})` },
              { id: "revoke", label: `Revoke (${revokeCount})` },
            ] as const
          ).map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              className={`px-3 py-1.5 border-b-2 transition-colors
                ${
                  filter === id
                    ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 font-medium"
                    : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Permission list */}
      <div className="max-h-64 overflow-y-auto rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40">
        {isLoading ? (
          <div className="flex items-center justify-center py-8 text-slate-400 text-sm">
            Loading permissions...
          </div>
        ) : visible.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-slate-400 text-sm">
            No permissions match
          </div>
        ) : (
          Array.from(grouped.entries()).map(([group, perms]) => (
            <div key={group}>
              {/* Group header */}
              <div className="sticky top-0 flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  {group}
                </span>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                <span className="text-xs text-slate-400">{perms.length}</span>
              </div>

              {perms.map((perm) => {
                const state = getState(perm.name);
                const fromRole = roleSet.has(perm.name);

                return (
                  <div
                    key={perm.id}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 border-b border-slate-50 dark:border-slate-800 last:border-0"
                  >
                    {/* Name */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-xs font-mono ${
                            state === "revoke"
                              ? "line-through text-slate-400"
                              : "text-slate-800 dark:text-slate-200"
                          }`}
                        >
                          {perm.name}
                        </span>
                        <StatePill state={state} fromRole={fromRole} />
                      </div>
                      {perm.description && (
                        <p className="text-xs text-slate-400 truncate mt-0.5">
                          {perm.description}
                        </p>
                      )}
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      <button
                        type="button"
                        disabled={disabled || state === "grant"}
                        onClick={() => setOverride(perm.name, "grant")}
                        title="Grant this permission"
                        className={`p-1.5 rounded-md transition-colors ${
                          state === "grant"
                            ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 cursor-default"
                            : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 disabled:opacity-30"
                        }`}
                      >
                        <ShieldPlus className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        disabled={disabled || state === "revoke"}
                        onClick={() => setOverride(perm.name, "revoke")}
                        title="Revoke this permission"
                        className={`p-1.5 rounded-md transition-colors ${
                          state === "revoke"
                            ? "bg-red-100 dark:bg-red-900/40 text-red-500 cursor-default"
                            : "text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 disabled:opacity-30"
                        }`}
                      >
                        <ShieldX className="w-3.5 h-3.5" />
                      </button>

                      {state !== null && (
                        <button
                          type="button"
                          disabled={disabled}
                          onClick={() => setOverride(perm.name, null)}
                          title="Reset to role default"
                          className="p-1.5 rounded-md text-slate-300 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-30"
                        >
                          <RotateCcw className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
