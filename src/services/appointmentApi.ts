// services/appointmentApi.ts
import { baseApi } from "./baseApi";
import type {
  AppointmentResponse,
  AppointmentCreateRequest,
  AppointmentUpdateRequest,
  AppointmentFilter,
  AppointmentsResponse,
  CalendarEvent,
  AdminAppointmentsFilter,
  AppointmentStats,
  BuyerAppointmentsFilter,
} from "../types";

// Response wrapper types from your API
interface AppointmentApiResponse {
  success: boolean;
  data: AppointmentResponse;
}

interface AppointmentsApiResponse {
  success: boolean;
  data: AppointmentResponse[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface CalendarEventsApiResponse {
  success: boolean;
  data: CalendarEvent[];
  count?: number;
  role?: string;
}

interface AppointmentStatsApiResponse {
  success: boolean;
  data: AppointmentStats;
}

export const appointmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create appointment
    createAppointment: builder.mutation<
      AppointmentResponse,
      AppointmentCreateRequest
    >({
      query: (appointmentData) => ({
        url: "/appointments",
        method: "POST",
        body: appointmentData,
      }),
      transformResponse: (response: AppointmentApiResponse) => response.data,
      invalidatesTags: ["Appointment", "Lead", "CalendarEvent"],
    }),

    // Get appointment by ID
    getAppointment: builder.query<AppointmentResponse, string>({
      query: (id) => `/appointments/${id}`,
      transformResponse: (response: AppointmentApiResponse) => response.data,
      providesTags: (result, error, id) => [{ type: "Appointment", id }],
    }),

    // Update appointment
    updateAppointment: builder.mutation<
      AppointmentResponse,
      { id: string; data: AppointmentUpdateRequest }
    >({
      query: ({ id, data }) => ({
        url: `/appointments/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: AppointmentApiResponse) => response.data,
      invalidatesTags: (result, error, { id }) => [
        { type: "Appointment", id },
        "CalendarEvent",
      ],
    }),

    // Get appointments with filtering
    getAppointments: builder.query<AppointmentsResponse, AppointmentFilter>({
      query: (filters = {}) => {
        const params = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            params.append(key, value.toString());
          }
        });

        return `/appointments?${params.toString()}`;
      },
      transformResponse: (response: AppointmentsApiResponse) => ({
        data: response.data,
        pagination: response.pagination || {
          page: 1,
          limit: 20,
          total: response.data.length,
          pages: 1,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Appointment" as const,
                id,
              })),
              "Appointment",
            ]
          : ["Appointment"],
    }),

    // Complete appointment
    completeAppointment: builder.mutation<
      AppointmentResponse,
      { id: string; feedback?: string; rating?: number }
    >({
      query: ({ id, ...completionData }) => ({
        url: `/appointments/${id}/complete`,
        method: "POST",
        body: completionData,
      }),
      transformResponse: (response: AppointmentApiResponse) => response.data,
      invalidatesTags: (result, error, { id }) => [
        { type: "Appointment", id },
        "CalendarEvent",
      ],
    }),

    // Cancel appointment
    cancelAppointment: builder.mutation<
      AppointmentResponse,
      { id: string; reason?: string }
    >({
      query: ({ id, reason }) => ({
        url: `/appointments/${id}/cancel`,
        method: "POST",
        body: { reason },
      }),
      transformResponse: (response: AppointmentApiResponse) => response.data,
      invalidatesTags: (result, error, { id }) => [
        { type: "Appointment", id },
        "CalendarEvent",
      ],
    }),

    // Get upcoming appointments for agent
    getUpcomingAppointments: builder.query<
      AppointmentResponse[],
      { agentId: string; days?: number }
    >({
      query: ({ agentId, days = 7 }) =>
        `/appointments/agent/${agentId}/upcoming?days=${days}`,
      transformResponse: (response: AppointmentsApiResponse) => response.data,
      providesTags: (result, error, { agentId }) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Appointment" as const, id })),
              { type: "Appointment", id: `AGENT-${agentId}` },
            ]
          : [{ type: "Appointment", id: `AGENT-${agentId}` }],
    }),

    // Update appointment reminders
    updateAppointmentReminders: builder.mutation<
      AppointmentResponse,
      { id: string; reminders: unknown }
    >({
      query: ({ id, reminders }) => ({
        url: `/appointments/${id}/reminders`,
        method: "PUT",
        body: reminders,
      }),
      transformResponse: (response: AppointmentApiResponse) => response.data,
      invalidatesTags: (result, error, { id }) => [{ type: "Appointment", id }],
    }),

    // Get admin appointments (for calendar display)
    getAdminAppointments: builder.query<
      CalendarEvent[],
      AdminAppointmentsFilter
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

        return `/appointments/admin/appointments?${params.toString()}`;
      },
      transformResponse: (response: CalendarEventsApiResponse) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "CalendarEvent" as const,
                id,
              })),
              "CalendarEvent",
            ]
          : ["CalendarEvent"],
    }),
    // Get buyer appointments by email (for calendar display)
    getBuyerAppointments: builder.query<
      CalendarEvent[],
      { email: string; filters?: BuyerAppointmentsFilter }
    >({
      query: ({ email, filters = {} }) => {
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

        return `/appointments/buyer/${email}/appointments?${params.toString()}`;
      },
      transformResponse: (response: CalendarEventsApiResponse) => response.data,
      providesTags: (result, error, { email }) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "CalendarEvent" as const,
                id,
              })),
              { type: "CalendarEvent", id: `BUYER-${email}` },
            ]
          : [{ type: "CalendarEvent", id: `BUYER-${email}` }],
    }),

    // Get super admin appointments (all appointments for calendar)
    getSuperAdminAppointments: builder.query<
      CalendarEvent[],
      AdminAppointmentsFilter
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

        return `/appointments/super-admin/appointments?${params.toString()}`;
      },
      transformResponse: (response: CalendarEventsApiResponse) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "CalendarEvent" as const,
                id,
              })),
              "CalendarEvent",
            ]
          : ["CalendarEvent"],
    }),

    // Get appointment statistics for dashboard
    getAppointmentStats: builder.query<
      AppointmentStats,
      { startDate?: string; endDate?: string }
    >({
      query: (filters = {}) => {
        const params = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            params.append(key, value.toString());
          }
        });

        return `/appointments/admin/appointments/stats?${params.toString()}`;
      },
      transformResponse: (response: AppointmentStatsApiResponse) =>
        response.data,
      providesTags: ["AppointmentStats"],
    }),

    // Get property owner appointments
    getPropertyOwnerAppointments: builder.query<
      CalendarEvent[],
      { ownerId: string; filters?: AdminAppointmentsFilter }
    >({
      query: ({ ownerId, filters = {} }) => {
        const params = new URLSearchParams();
        params.append("ownerId", ownerId);

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

        return `/appointments/owner/${ownerId}/appointments?${params.toString()}`;
      },
      transformResponse: (response: CalendarEventsApiResponse) => response.data,
      providesTags: (result, error, { ownerId }) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "CalendarEvent" as const,
                id,
              })),
              { type: "CalendarEvent", id: `OWNER-${ownerId}` },
            ]
          : [{ type: "CalendarEvent", id: `OWNER-${ownerId}` }],
    }),
  }),
});

export const {
  useGetBuyerAppointmentsQuery,
  useCreateAppointmentMutation,
  useGetAppointmentQuery,
  useUpdateAppointmentMutation,
  useGetAppointmentsQuery,
  useLazyGetAppointmentsQuery,
  useCompleteAppointmentMutation,
  useCancelAppointmentMutation,
  useGetUpcomingAppointmentsQuery,
  useUpdateAppointmentRemindersMutation,
  useGetAdminAppointmentsQuery,
  useGetSuperAdminAppointmentsQuery,
  useGetAppointmentStatsQuery,
  useGetPropertyOwnerAppointmentsQuery,
} = appointmentApi;
