// ─── Permissions ──────────────────────────────────────────────────────────────

export interface Permission {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
}

export interface ResPermission {
  id: string;
  name: string;
}

// ─── Roles ────────────────────────────────────────────────────────────────────

export interface Role {
  id: string;
  name: string;
  description: string | null;
  permissions: Permission[];
  userCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ResRole {
  id: string;
  name: string;
  permissions: Permission[];
}

// ─── Request shapes ───────────────────────────────────────────────────────────

export interface CreateRoleRequest {
  name: string;
  description?: string;
  permissionIds?: string[];
}

export interface UpdateRoleRequest {
  name?: string;
  description?: string;
}

export interface CreatePermissionRequest {
  name: string;
  description?: string;
}

export interface UpdatePermissionRequest {
  name?: string;
  description?: string;
}

export interface RoleFilter {
  search?: string;
}

export interface PermissionFilter {
  search?: string;
}

// ─── Per-user permission overrides (stored in User.permissions Json) ──────────
// grant  = extra permissions ON TOP of the role
// revoke = permissions stripped FROM the role
export interface UserPermissionOverrides {
  grant?: string[];
  revoke?: string[];
}

// Returned by GET /users/:id/permissions
export interface UserEffectivePermissions {
  fromRole: string[]; // raw names from the assigned role
  granted: string[]; // names in the grant override list
  revoked: string[]; // names in the revoke override list
  effective: string[]; // final resolved set (fromRole + granted - revoked)
}

// ─── Query / response helpers ─────────────────────────────────────────────────

export interface UserWithPermissions {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: {
    id: string;
    name: string;
    permissions: Permission[];
  } | null;
}

export interface RoleStats {
  totalRoles: number;
  totalPermissions: number;
  usersByRole: Array<{
    roleName: string;
    userCount: number;
  }>;
}
