import { baseApi } from "./baseApi";
import type {
  Permission,
  Role,
  CreateRoleRequest,
  UpdateRoleRequest,
  CreatePermissionRequest,
  UpdatePermissionRequest,
  RoleFilter,
  PermissionFilter,
  UserWithPermissions,
  RoleStats,
  ApiResponse,
  PaginatedResponse,
  BulkOperationResponse,
} from "../types";

export const roleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Permission endpoints
    createPermission: builder.mutation<
      ApiResponse<Permission>,
      CreatePermissionRequest
    >({
      query: (data) => ({
        url: "/rbac/permissions",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Permission"],
    }),

    getPermissions: builder.query<
      PaginatedResponse<Permission>,
      {
        search?: string;
        page?: number;
        limit?: number;
      }
    >({
      query: (params = {}) => ({
        url: "/rbac/permissions",
        method: "GET",
        params: {
          page: params.page || 1,
          limit: params.limit || 50,
          search: params.search,
        },
      }),
      providesTags: ["Permission"],
    }),

    getPermission: builder.query<ApiResponse<Permission>, string>({
      query: (id) => `/rbac/permissions/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Permission", id }],
    }),

    updatePermission: builder.mutation<
      ApiResponse<Permission>,
      { id: string; data: UpdatePermissionRequest }
    >({
      query: ({ id, data }) => ({
        url: `/rbac/permissions/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Permission", id },
        "Permission",
      ],
    }),

    deletePermission: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/rbac/permissions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Permission"],
    }),

    // Role endpoints
    createRole: builder.mutation<ApiResponse<Role>, CreateRoleRequest>({
      query: (data) => ({
        url: "/rbac/roles",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Role"],
    }),

    getRoles: builder.query<
      PaginatedResponse<Role>,
      {
        search?: string;
        page?: number;
        limit?: number;
      }
    >({
      query: (params = {}) => ({
        url: "/rbac/roles",
        method: "GET",
        params: {
          page: params.page || 1,
          limit: params.limit || 20,
          search: params.search,
        },
      }),
      providesTags: ["Role"],
    }),

    getRole: builder.query<ApiResponse<Role>, string>({
      query: (id) => `/rbac/roles/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Role", id }],
    }),

    updateRole: builder.mutation<
      ApiResponse<Role>,
      { id: string; data: UpdateRoleRequest }
    >({
      query: ({ id, data }) => ({
        url: `/rbac/roles/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Role", id },
        "Role",
      ],
    }),

    deleteRole: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/rbac/roles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Role"],
    }),

    // User permission endpoints
    getUserPermissions: builder.query<ApiResponse<UserWithPermissions>, string>(
      {
        query: (userId) => `/rbac/users/${userId}/permissions`,
        providesTags: (_result, _error, userId) => [
          { type: "User", id: userId },
        ],
      }
    ),

    checkUserPermission: builder.mutation<
      ApiResponse<{ hasPermission: boolean }>,
      {
        userId: string;
        permissionName: string;
      }
    >({
      query: (data) => ({
        url: "/rbac/permissions/check",
        method: "POST",
        body: data,
      }),
    }),

    assignRoleToUser: builder.mutation<
      ApiResponse<void>,
      {
        userId: string;
        roleId: string;
      }
    >({
      query: (data) => ({
        url: "/rbac/users/assign-role",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_result, _error, { userId }) => [
        { type: "User", id: userId },
        "User",
      ],
    }),

    removeRoleFromUser: builder.mutation<ApiResponse<void>, string>({
      query: (userId) => ({
        url: `/rbac/users/${userId}/role`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, userId) => [
        { type: "User", id: userId },
        "User",
      ],
    }),

    // Bulk operations
    bulkRoleOperation: builder.mutation<
      BulkOperationResponse,
      {
        roleIds: string[];
        operation: "delete";
      }
    >({
      query: (data) => ({
        url: "/rbac/roles/bulk",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Role"],
    }),

    // Stats
    getRoleStats: builder.query<ApiResponse<RoleStats>, void>({
      query: () => "/rbac/roles/st/stats",
      providesTags: ["Role"],
    }),
  }),
});

export const {
  // Permission hooks
  useCreatePermissionMutation,
  useGetPermissionsQuery,
  useGetPermissionQuery,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,

  // Role hooks
  useCreateRoleMutation,
  useGetRolesQuery,
  useGetRoleQuery,
  useUpdateRoleMutation,
  useDeleteRoleMutation,

  // User permission hooks
  useGetUserPermissionsQuery,
  useCheckUserPermissionMutation,
  useAssignRoleToUserMutation,
  useRemoveRoleFromUserMutation,

  // Bulk operations
  useBulkRoleOperationMutation,

  // Stats
  useGetRoleStatsQuery,
} = roleApi;
