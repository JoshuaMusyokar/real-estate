import { baseApi } from "./baseApi";
import type {
  UserResponse,
  CreateUserRequest,
  UpdateUserRequest,
  UserFilter,
  UsersResponse,
  BulkUserOperation,
  UserStats,
  ExportConfig,
  Activity,
} from "../types";
interface UsersApiResponse {
  success: boolean;
  data: UserResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all users with filtering and pagination
    getUsers: builder.query<
      UsersResponse,
      UserFilter & { page?: number; limit?: number }
    >({
      query: (filters = {}) => {
        const params = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            if (Array.isArray(value)) {
              value.forEach((v) => params.append(key, v.toString()));
            } else if (value instanceof Date) {
              params.append(key, value.toISOString());
            } else {
              params.append(key, value.toString());
            }
          }
        });

        return `/users?${params.toString()}`;
      },
      transformResponse: (response: UsersApiResponse): UsersResponse => ({
        users: response.data,
        total: response.pagination.total,
        page: response.pagination.page,
        limit: response.pagination.limit,
        totalPages: response.pagination.totalPages,
      }),

      providesTags: (result) =>
        result
          ? [
              ...result.users.map(({ id }) => ({ type: "User" as const, id })),
              { type: "User", id: "LIST" },
            ]
          : [{ type: "User", id: "LIST" }],
    }),

    // Get user by ID
    getUser: builder.query<{ success: boolean; data: UserResponse }, string>({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),

    // Create new user
    createUser: builder.mutation<
      { success: boolean; data: UserResponse; message: string },
      CreateUserRequest
    >({
      query: (userData) => ({
        url: "/users",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }, "UserStats"],
    }),

    // Update user
    updateUser: builder.mutation<
      { success: boolean; data: UserResponse; message: string },
      { id: string; data: UpdateUserRequest }
    >({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
        "UserStats",
      ],
    }),

    // Delete user
    deleteUser: builder.mutation<{ success: boolean; message: string }, string>(
      {
        query: (id) => ({
          url: `/users/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: (result, error, id) => [
          { type: "User", id },
          { type: "User", id: "LIST" },
          "UserStats",
        ],
      }
    ),

    // Update user status
    updateUserStatus: builder.mutation<
      { success: boolean; data: UserResponse; message: string },
      { id: string; status: string }
    >({
      query: ({ id, status }) => ({
        url: `/users/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
        "UserStats",
      ],
    }),

    // Update user role
    updateUserRole: builder.mutation<
      { success: boolean; data: UserResponse; message: string },
      { id: string; role: string }
    >({
      query: ({ id, role }) => ({
        url: `/users/${id}/role`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
        "UserStats",
      ],
    }),

    // Bulk user operations
    bulkUserOperation: builder.mutation<
      {
        success: boolean;
        data: { processed: number; message: string };
        message: string;
      },
      BulkUserOperation
    >({
      query: (operation) => ({
        url: "/users/bulk",
        method: "POST",
        body: operation,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }, "UserStats"],
    }),

    // Get user statistics
    getUserStats: builder.query<{ success: boolean; data: UserStats }, void>({
      query: () => "/users/stats",
      providesTags: ["UserStats"],
    }),

    // Search users
    searchUsers: builder.query<
      UsersResponse,
      { query: string; role?: string[]; status?: string[] }
    >({
      query: ({ query, role, status }) => {
        const params = new URLSearchParams({ search: query });

        if (role?.length) {
          role.forEach((r) => params.append("role", r));
        }

        if (status?.length) {
          status.forEach((s) => params.append("status", s));
        }

        return `/users?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.users.map(({ id }) => ({ type: "User" as const, id })),
              { type: "User", id: "SEARCH" },
            ]
          : [{ type: "User", id: "SEARCH" }],
    }),

    // Get users by role
    getUsersByRole: builder.query<
      UsersResponse,
      { role: string; page?: number; limit?: number }
    >({
      query: ({ role, page = 1, limit = 10 }) =>
        `/users?role=${role}&page=${page}&limit=${limit}`,
      providesTags: (result, error, { role }) =>
        result
          ? [
              ...result.users.map(({ id }) => ({ type: "User" as const, id })),
              { type: "User", id: `ROLE-${role}` },
            ]
          : [{ type: "User", id: `ROLE-${role}` }],
    }),

    exportUsers: builder.mutation<
      Blob, // Return blob for file download
      { filters?: UserFilter; config: ExportConfig }
    >({
      query: ({ filters = {}, config }) => {
        const params = new URLSearchParams();

        // Add filters to params if needed, or send in body
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            if (Array.isArray(value)) {
              value.forEach((v) => params.append(key, v.toString()));
            } else if (value instanceof Date) {
              params.append(key, value.toISOString());
            } else {
              params.append(key, value.toString());
            }
          }
        });

        return {
          url: `/users/export?${params.toString()}`,
          method: "POST",
          body: { filters, config },
          responseHandler: (response) => response.blob(),
        };
      },
      invalidatesTags: ["User"],
    }),

    // Add template download
    downloadExportTemplate: builder.mutation<Blob, void>({
      query: () => ({
        url: "/users/export/template",
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
    }),

    // Add formats query
    getExportFormats: builder.query<
      {
        success: boolean;
        data: Array<{ value: string; label: string; description: string }>;
      },
      void
    >({
      query: () => "/users/export/formats",
    }),

    // Import users
    importUsers: builder.mutation<
      {
        success: boolean;
        data: { processed: number; errors: string[] };
        message: string;
      },
      FormData
    >({
      query: (formData) => ({
        url: "/users/import",
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }, "UserStats"],
    }),

    // Send welcome email to user
    sendWelcomeEmail: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (userId) => ({
        url: `/users/${userId}/welcome-email`,
        method: "POST",
      }),
    }),

    // Resend verification email
    resendVerification: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (userId) => ({
        url: `/users/${userId}/resend-verification`,
        method: "POST",
      }),
    }),

    //TODO: ** Have a look at response Get user activity log
    getUserActivity: builder.query<
      { success: boolean; data: Activity[] },
      { userId: string; page?: number; limit?: number }
    >({
      query: ({ userId, page = 1, limit = 20 }) =>
        `/users/${userId}/activity?page=${page}&limit=${limit}`,
      providesTags: (result, error, { userId }) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Activity" as const,
                id,
              })),
              { type: "Activity", id: `USER-${userId}` },
            ]
          : [{ type: "Activity", id: `USER-${userId}` }],
    }),
  }),
});

export const {
  useDownloadExportTemplateMutation,
  useGetExportFormatsQuery,
  useGetUsersQuery,
  useLazyGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useUpdateUserStatusMutation,
  useUpdateUserRoleMutation,
  useBulkUserOperationMutation,
  useGetUserStatsQuery,
  useSearchUsersQuery,
  useLazySearchUsersQuery,
  useGetUsersByRoleQuery,
  useLazyGetUsersByRoleQuery,
  useExportUsersMutation,
  useImportUsersMutation,
  useSendWelcomeEmailMutation,
  useResendVerificationMutation,
  useGetUserActivityQuery,
} = userApi;
