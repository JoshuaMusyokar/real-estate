import { baseApi } from "./baseApi";
import type {
  WorkflowResponse,
  WorkflowCreateRequest,
  WorkflowUpdateRequest,
  WorkflowFilter,
  WorkflowsResponse,
  ExecuteWorkflowRequest,
  BaseResponse,
} from "../types";

export const workflowApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create workflow
    createWorkflow: builder.mutation<WorkflowResponse, WorkflowCreateRequest>({
      query: (workflowData) => ({
        url: "/workflows",
        method: "POST",
        body: workflowData,
      }),
      invalidatesTags: ["Workflow"],
    }),

    // Get workflow by ID
    getWorkflow: builder.query<WorkflowResponse, string>({
      query: (id) => `/workflows/${id}`,
      providesTags: (result, error, id) => [{ type: "Workflow", id }],
    }),

    // Update workflow
    updateWorkflow: builder.mutation<
      WorkflowResponse,
      { id: string; data: WorkflowUpdateRequest }
    >({
      query: ({ id, data }) => ({
        url: `/workflows/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Workflow", id }],
    }),

    // Delete workflow
    deleteWorkflow: builder.mutation<BaseResponse, string>({
      query: (id) => ({
        url: `/workflows/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Workflow"],
    }),

    // Get workflows with filtering
    getWorkflows: builder.query<WorkflowsResponse, WorkflowFilter>({
      query: (filters = {}) => {
        const params = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            params.append(key, value.toString());
          }
        });

        return `/workflows?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Workflow" as const,
                id,
              })),
              "Workflow",
            ]
          : ["Workflow"],
    }),

    // Execute workflow
    executeWorkflow: builder.mutation<
      BaseResponse,
      { id: string; data: ExecuteWorkflowRequest }
    >({
      query: ({ id, data }) => ({
        url: `/workflows/${id}/execute`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Workflow"],
    }),
  }),
});

export const {
  useCreateWorkflowMutation,
  useGetWorkflowQuery,
  useUpdateWorkflowMutation,
  useDeleteWorkflowMutation,
  useGetWorkflowsQuery,
  useLazyGetWorkflowsQuery,
  useExecuteWorkflowMutation,
} = workflowApi;
