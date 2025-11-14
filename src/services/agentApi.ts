import { baseApi } from "./baseApi";
import type { AgentForAssignment, AgentResponse, AgentsFilter } from "../types";

export const agentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get agents for assignment
    getAgentsForAssignment: builder.query<
      AgentResponse<AgentForAssignment[]>,
      AgentsFilter
    >({
      query: (filters = {}) => {
        const params = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            params.append(key, value.toString());
          }
        });

        return `/agents/assignment?${params.toString()}`;
      },
      providesTags: ["Agent"],
    }),

    // Get agent by ID for assignment
    getAgentForAssignment: builder.query<
      AgentResponse<AgentForAssignment>,
      string
    >({
      query: (id) => `/agents/assignment/${id}`,
      providesTags: (result, error, id) => [{ type: "Agent", id }],
    }),

    // Get agents matching a property
    getAgentsByPropertyMatch: builder.query<
      AgentResponse<AgentForAssignment[]>,
      string
    >({
      query: (propertyId) => `/agents/property/${propertyId}/match`,
      providesTags: ["Agent"],
    }),

    // Get agents matching a lead
    getAgentsByLeadMatch: builder.query<
      AgentResponse<AgentForAssignment[]>,
      string
    >({
      query: (leadId) => `/agents/lead/${leadId}/match`,
      providesTags: ["Agent"],
    }),

    // Get top agents
    getTopAgents: builder.query<
      AgentResponse<AgentForAssignment[]>,
      { limit?: number }
    >({
      query: ({ limit = 5 } = {}) => `/agents/top?limit=${limit}`,
      providesTags: ["Agent"],
    }),
  }),
});

export const {
  useGetAgentsForAssignmentQuery,
  useLazyGetAgentsForAssignmentQuery,
  useGetAgentForAssignmentQuery,
  useGetAgentsByPropertyMatchQuery,
  useLazyGetAgentsByPropertyMatchQuery,
  useGetAgentsByLeadMatchQuery,
  useLazyGetAgentsByLeadMatchQuery,
  useGetTopAgentsQuery,
} = agentApi;
