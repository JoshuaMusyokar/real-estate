/**
 * usePermissions
 *
 * Resolves a user's effective permissions entirely client-side, using the
 * user object already stored in Redux (set on login / token refresh).
 *
 * Resolution order (mirrors backend hasPermission()):
 *   1. If permission is in revoke overrides → DENY
 *   2. If permission is in grant overrides  → ALLOW
 *   3. If permission is in role.permissions → ALLOW
 *   4. Otherwise                            → DENY
 *
 * SUPER_ADMIN bypasses all checks — always returns true.
 *
 * Usage:
 *   const { can, canAny, canAll, isSuperAdmin, role } = usePermissions();
 *
 *   if (can("amenity.add")) { ... }
 *   if (canAny(["lead.edit", "lead.assign"])) { ... }
 *
 * NOTE: This is for UI visibility only — the backend always enforces its own
 * checks. Never rely on this for security.
 */

import { useMemo } from "react";
import { useAppSelector } from "."; // adjust path to your typed hook

// ─── Types ────────────────────────────────────────────────────────────────────

interface UserPermissionOverrides {
  grant?: string[];
  revoke?: string[];
}

interface UsePermissionsReturn {
  /** True if the user has a specific permission */
  can: (permission: string) => boolean;
  /** True if the user has AT LEAST ONE of the given permissions */
  canAny: (permissions: string[]) => boolean;
  /** True if the user has ALL of the given permissions */
  canAll: (permissions: string[]) => boolean;
  /** Whether the user is a SUPER_ADMIN (bypasses all permission checks) */
  isSuperAdmin: boolean;
  /** The user's role name (e.g. "ADMIN", "SALES_AGENT") */
  role: string | null;
  /** All effective permission names resolved for this user */
  effectivePermissions: string[];
  /** Whether a user is authenticated at all */
  isAuthenticated: boolean;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function usePermissions(): UsePermissionsReturn {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const { isSuperAdmin, role, effectivePermissions } = useMemo(() => {
    if (!user) {
      return {
        isSuperAdmin: false,
        role: null,
        effectivePermissions: [] as string[],
      };
    }

    const roleName = user.role?.name ?? null;

    if (roleName === "SUPER_ADMIN") {
      return {
        isSuperAdmin: true,
        role: roleName,
        effectivePermissions: ["*"], // represents all
      };
    }

    // Role baseline
    const fromRole: string[] = (user.role?.permissions ?? []).map(
      (p) => p.name,
    );

    // Per-user overrides stored as JSON in user.permissions
    const overrides = (user.permissions ?? {}) as UserPermissionOverrides;
    const granted: string[] = overrides.grant ?? [];
    const revoked: string[] = overrides.revoke ?? [];

    // Effective = (fromRole + granted) - revoked, deduplicated
    const effective = Array.from(
      new Set([...fromRole, ...granted].filter((p) => !revoked.includes(p))),
    );

    return {
      isSuperAdmin: false,
      role: roleName,
      effectivePermissions: effective,
    };
  }, [user]);

  const can = useMemo(
    () =>
      (permission: string): boolean => {
        if (!isAuthenticated || !user) return false;
        if (isSuperAdmin) return true;
        return effectivePermissions.includes(permission);
      },
    [isAuthenticated, user, isSuperAdmin, effectivePermissions],
  );

  const canAny = useMemo(
    () =>
      (permissions: string[]): boolean => {
        if (!isAuthenticated || !user) return false;
        if (isSuperAdmin) return true;
        return permissions.some((p) => effectivePermissions.includes(p));
      },
    [isAuthenticated, user, isSuperAdmin, effectivePermissions],
  );

  const canAll = useMemo(
    () =>
      (permissions: string[]): boolean => {
        if (!isAuthenticated || !user) return false;
        if (isSuperAdmin) return true;
        return permissions.every((p) => effectivePermissions.includes(p));
      },
    [isAuthenticated, user, isSuperAdmin, effectivePermissions],
  );

  return {
    can,
    canAny,
    canAll,
    isSuperAdmin,
    role,
    effectivePermissions,
    isAuthenticated,
  };
}
