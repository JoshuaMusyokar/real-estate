import { baseApi } from "./baseApi";
import type {
  Notification,
  ApiResponse,
  PaginatedResponse,
  NotificationSearchFilters,
  NotificationRes,
} from "../types";

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ========== NOTIFICATION ENDPOINTS ==========

    // Get notifications (paginated, supports unreadOnly filter)
    getNotifications: builder.query<
      ApiResponse<NotificationRes> & { unreadCount: number },
      NotificationSearchFilters
    >({
      query: (filters) => {
        const params = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            if (Array.isArray(value)) {
              value.forEach((v) => params.append(key, v.toString()));
            } else {
              params.append(key, value.toString());
            }
          }
        });

        return `/notifications?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...(result.data?.notifications?.map(({ id }) => ({
                type: "Notification" as const,
                id,
              })) || []),
              "Notification",
            ]
          : ["Notification"],
    }),

    // Get dropdown notifications (lightweight — latest N only)
    getDropdownNotifications: builder.query<
      ApiResponse<NotificationRes> & { unreadCount: number },
      void
    >({
      query: () => `/notifications?limit=8&offset=0`,
      providesTags: ["Notification"],
    }),

    // Get unread count only (for badge polling)
    getUnreadCount: builder.query<ApiResponse<{ count: number }>, void>({
      query: () => "/notifications/unread-count",
      providesTags: ["Notification"],
    }),

    // Mark single notification as read
    markNotificationAsRead: builder.mutation<
      ApiResponse<void>,
      string // notificationId
    >({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Notification", id },
        "Notification",
      ],
    }),

    // Mark multiple notifications as read
    markMultipleAsRead: builder.mutation<
      ApiResponse<void>,
      string[] // notificationIds
    >({
      query: (notificationIds) => ({
        url: "/notifications/mark-multiple-read",
        method: "PUT",
        body: { notificationIds },
      }),
      invalidatesTags: ["Notification"],
    }),

    // Mark all notifications as read for the current user
    markAllNotificationsAsRead: builder.mutation<ApiResponse<void>, void>({
      query: () => ({
        url: "/notifications/mark-all-read",
        method: "PUT",
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const {
  // Queries
  useGetNotificationsQuery,
  useLazyGetNotificationsQuery,
  useGetDropdownNotificationsQuery,
  useLazyGetDropdownNotificationsQuery,
  useGetUnreadCountQuery,
  useLazyGetUnreadCountQuery,

  // Mutations
  useMarkNotificationAsReadMutation,
  useMarkMultipleAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} = notificationApi;
