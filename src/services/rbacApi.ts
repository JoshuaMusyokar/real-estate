import { baseApi } from "./baseApi";
import type {
  Permission,
  Role,
  CreateRoleRequest,
  UpdateRoleRequest,
  CreatePermissionRequest,
  UserPermissionOverrides,
  UserEffectivePermissions,
  RoleStats,
} from "../types";

// ─── Response shape helpers ───────────────────────────────────────────────────

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface PaginatedRoles {
  roles: Role[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── API ──────────────────────────────────────────────────────────────────────

export const rbacApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── Roles ────────────────────────────────────────────────────────────────

    getRoles: builder.query<PaginatedRoles, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 50 } = {}) =>
        `/rbac/roles?page=${page}&limit=${limit}`,
      transformResponse: (res: PaginatedRoles) => res,
      providesTags: (result) =>
        result
          ? [
              ...result.roles.map(({ id }) => ({ type: "Role" as const, id })),
              { type: "Role", id: "LIST" },
            ]
          : [{ type: "Role", id: "LIST" }],
    }),

    getRole: builder.query<Role, string>({
      query: (id) => `/rbac/roles/${id}`,
      transformResponse: (res: ApiResponse<Role>) => res.data,
      providesTags: (_result, _error, id) => [{ type: "Role", id }],
    }),

    createRole: builder.mutation<Role, CreateRoleRequest>({
      query: (body) => ({ url: "/rbac/roles", method: "POST", body }),
      transformResponse: (res: ApiResponse<Role>) => res.data,
      invalidatesTags: [{ type: "Role", id: "LIST" }],
    }),

    updateRole: builder.mutation<Role, { id: string; data: UpdateRoleRequest }>(
      {
        query: ({ id, data }) => ({
          url: `/rbac/roles/${id}`,
          method: "PATCH",
          body: data,
        }),
        transformResponse: (res: ApiResponse<Role>) => res.data,
        invalidatesTags: (_result, _error, { id }) => [
          { type: "Role", id },
          { type: "Role", id: "LIST" },
        ],
      },
    ),

    deleteRole: builder.mutation<void, string>({
      query: (id) => ({ url: `/rbac/roles/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Role", id },
        { type: "Role", id: "LIST" },
      ],
    }),

    // ── Role ↔ Permission assignment ─────────────────────────────────────────

    // Add specific permissions to a role (additive)
    assignPermissionsToRole: builder.mutation<
      Role,
      { roleId: string; permissionIds: string[] }
    >({
      query: ({ roleId, permissionIds }) => ({
        url: `/rbac/roles/${roleId}/permissions`,
        method: "POST",
        body: { permissionIds },
      }),
      transformResponse: (res: ApiResponse<Role>) => res.data,
      invalidatesTags: (_result, _error, { roleId }) => [
        { type: "Role", id: roleId },
        { type: "Role", id: "LIST" },
      ],
    }),

    // Replace ALL permissions on a role (full sync — use for "save" in a permissions matrix UI)
    syncPermissionsOnRole: builder.mutation<
      Role,
      { roleId: string; permissionIds: string[] }
    >({
      query: ({ roleId, permissionIds }) => ({
        url: `/rbac/roles/${roleId}/permissions`,
        method: "PUT",
        body: { permissionIds },
      }),
      transformResponse: (res: ApiResponse<Role>) => res.data,
      invalidatesTags: (_result, _error, { roleId }) => [
        { type: "Role", id: roleId },
        { type: "Role", id: "LIST" },
      ],
    }),

    // Remove specific permissions from a role
    removePermissionsFromRole: builder.mutation<
      Role,
      { roleId: string; permissionIds: string[] }
    >({
      query: ({ roleId, permissionIds }) => ({
        url: `/rbac/roles/${roleId}/permissions`,
        method: "DELETE",
        body: { permissionIds },
      }),
      transformResponse: (res: ApiResponse<Role>) => res.data,
      invalidatesTags: (_result, _error, { roleId }) => [
        { type: "Role", id: roleId },
        { type: "Role", id: "LIST" },
      ],
    }),

    // ── Permissions ──────────────────────────────────────────────────────────

    getPermissions: builder.query<Permission[], void>({
      query: () => "/rbac/permissions",
      transformResponse: (res: ApiResponse<Permission[]>) => res.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Permission" as const, id })),
              { type: "Permission", id: "LIST" },
            ]
          : [{ type: "Permission", id: "LIST" }],
    }),

    createPermission: builder.mutation<Permission, CreatePermissionRequest>({
      query: (body) => ({ url: "/rbac/permissions", method: "POST", body }),
      transformResponse: (res: ApiResponse<Permission>) => res.data,
      invalidatesTags: [{ type: "Permission", id: "LIST" }],
    }),

    deletePermission: builder.mutation<void, string>({
      query: (id) => ({ url: `/rbac/permissions/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Permission", id },
        { type: "Permission", id: "LIST" },
        // Roles that had this permission need to refetch
        { type: "Role", id: "LIST" },
      ],
    }),

    // ── Per-user permission overrides ────────────────────────────────────────

    // GET  /users/:id/permissions  → resolved effective permissions
    getUserEffectivePermissions: builder.query<
      UserEffectivePermissions,
      string
    >({
      query: (userId) => `/rbac/users/${userId}/permissions`,
      transformResponse: (res: ApiResponse<UserEffectivePermissions>) =>
        res.data,
      providesTags: (_result, _error, userId) => [
        { type: "User", id: `PERMS-${userId}` },
      ],
    }),

    // PUT  /users/:id/permissions  → set grant/revoke overrides
    updateUserPermissionOverrides: builder.mutation<
      { granted: string[]; revoked: string[]; effective: string[] },
      { userId: string; overrides: UserPermissionOverrides }
    >({
      query: ({ userId, overrides }) => ({
        url: `/rbac/users/${userId}/permissions`,
        method: "PUT",
        body: overrides,
      }),
      transformResponse: (
        res: ApiResponse<{
          granted: string[];
          revoked: string[];
          effective: string[];
        }>,
      ) => res.data,
      invalidatesTags: (_result, _error, { userId }) => [
        { type: "User", id: `PERMS-${userId}` },
        { type: "User", id: userId },
      ],
    }),

    // DELETE /users/:id/permissions → clear all overrides (revert to role-only)
    clearUserPermissionOverrides: builder.mutation<void, string>({
      query: (userId) => ({
        url: `/rbac/users/${userId}/permissions`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, userId) => [
        { type: "User", id: `PERMS-${userId}` },
        { type: "User", id: userId },
      ],
    }),

    // ── Stats ────────────────────────────────────────────────────────────────

    getRoleStats: builder.query<RoleStats, void>({
      query: () => "/rbac/roles/stats",
      transformResponse: (res: ApiResponse<RoleStats>) => res.data,
      providesTags: ["Role"],
    }),
  }),
});

export const {
  // Roles
  useGetRolesQuery,
  useGetRoleQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,

  // Role ↔ Permission assignment
  useAssignPermissionsToRoleMutation,
  useSyncPermissionsOnRoleMutation,
  useRemovePermissionsFromRoleMutation,

  // Permissions
  useGetPermissionsQuery,
  useCreatePermissionMutation,
  useDeletePermissionMutation,

  // Per-user overrides
  useGetUserEffectivePermissionsQuery,
  useUpdateUserPermissionOverridesMutation,
  useClearUserPermissionOverridesMutation,

  // Stats
  useGetRoleStatsQuery,
} = rbacApi;
