export interface Permission {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}
export interface ResPermission {
  id: string;
  name: string;
}

export interface Role {
  id: string;
  name: string;
  description: string | null;
  permissions: Permission[];
  createdAt: Date;
  updatedAt: Date;
}
export interface ResRole {
  id: string;
  name: string;
}

export interface CreateRoleRequest {
  name: string;
  description?: string;
  permissionIds: string[];
}

export interface UpdateRoleRequest {
  name?: string;
  description?: string;
  permissionIds?: string[];
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
