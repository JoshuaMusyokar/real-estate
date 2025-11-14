import { baseApi } from "./baseApi";
import type {
  LeadResponse,
  LeadCreateRequest,
  LeadUpdateRequest,
  LeadFilter,
  LeadsResponse,
  LeadStats,
  LeadResponseWithData,
  //   BaseResponse,
} from "../types";

export const leadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create lead
    createLead: builder.mutation<LeadResponse, LeadCreateRequest>({
      query: (leadData) => ({
        url: "/leads",
        method: "POST",
        body: leadData,
      }),
      invalidatesTags: ["Lead"],
    }),

    // Get lead by ID
    getLead: builder.query<LeadResponseWithData, string>({
      query: (id) => `/leads/${id}`,
      providesTags: (result, error, id) => [{ type: "Lead", id }],
    }),

    // Update lead
    updateLead: builder.mutation<
      LeadResponse,
      { id: string; data: LeadUpdateRequest }
    >({
      query: ({ id, data }) => ({
        url: `/leads/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Lead", id }],
    }),

    // Delete lead (soft delete)
    deleteLead: builder.mutation<LeadResponse, string>({
      query: (id) => ({
        url: `/leads/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Lead"],
    }),

    // Get all leads with filtering
    getLeads: builder.query<LeadsResponse, LeadFilter>({
      query: (filters = {}) => {
        const params = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            params.append(key, value.toString());
          }
        });

        return `/leads?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Lead" as const,
                id,
              })),
              "Lead",
            ]
          : ["Lead"],
    }),

    // Assign lead to agent
    assignLead: builder.mutation<LeadResponse, { id: string; agentId: string }>(
      {
        query: ({ id, agentId }) => ({
          url: `/leads/${id}/assign`,
          method: "POST",
          body: { agentId },
        }),
        invalidatesTags: (result, error, { id }) => [{ type: "Lead", id }],
      }
    ),

    // Get lead statistics
    getLeadStats: builder.query<{ success: boolean; data: LeadStats }, void>({
      query: () => "/leads/stats",
      providesTags: ["Lead"],
    }),

    // Calculate lead score
    calculateLeadScore: builder.mutation<
      { success: boolean; data: { score: number } },
      string
    >({
      query: (id) => ({
        url: `/leads/${id}/calculate-score`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Lead", id }],
    }),
  }),
});

export const {
  useCreateLeadMutation,
  useGetLeadQuery,
  useUpdateLeadMutation,
  useDeleteLeadMutation,
  useGetLeadsQuery,
  useLazyGetLeadsQuery,
  useAssignLeadMutation,
  useGetLeadStatsQuery,
  useCalculateLeadScoreMutation,
} = leadApi;
