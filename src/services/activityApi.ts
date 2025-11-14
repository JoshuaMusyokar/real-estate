// services/activityApi.ts
import { baseApi } from "./baseApi";
import type { ActivityResponse, ActivityCreateRequest } from "../types";

// Response wrapper type from your API
interface ActivityApiResponse {
  success: boolean;
  data: ActivityResponse[];
}

interface SingleActivityApiResponse {
  success: boolean;
  data: ActivityResponse;
}

export const activityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create activity
    createActivity: builder.mutation<ActivityResponse, ActivityCreateRequest>({
      query: (activityData) => ({
        url: "/leads/activities",
        method: "POST",
        body: activityData,
      }),
      transformResponse: (response: SingleActivityApiResponse) => response.data,
      invalidatesTags: ["Activity", "Lead"],
    }),

    // Get activities for a lead
    getLeadActivities: builder.query<ActivityResponse[], string>({
      query: (leadId) => `/leads/activities/lead/${leadId}`,
      transformResponse: (response: ActivityApiResponse) => response.data,
      providesTags: (result, error, leadId) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Activity" as const, id })),
              { type: "Activity", id: `LEAD-${leadId}` },
            ]
          : [{ type: "Activity", id: `LEAD-${leadId}` }],
    }),

    // Get activity by ID
    getActivity: builder.query<ActivityResponse, string>({
      query: (id) => `/leads/activities/${id}`,
      transformResponse: (response: SingleActivityApiResponse) => response.data,
      providesTags: (result, error, id) => [{ type: "Activity", id }],
    }),
  }),
});

export const {
  useCreateActivityMutation,
  useGetLeadActivitiesQuery,
  useGetActivityQuery,
} = activityApi;
