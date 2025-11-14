import { baseApi } from "./baseApi";
import type {
  FormSubmissionResponse,
  FormSubmissionCreateRequest,
  FormSubmissionFilter,
  FormSubmissionsResponse,
  FormSubmissionStats,
} from "../types";

export const formSubmissionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create form submission
    createFormSubmission: builder.mutation<
      FormSubmissionResponse,
      FormSubmissionCreateRequest
    >({
      query: (submissionData) => ({
        url: "/form-submissions",
        method: "POST",
        body: submissionData,
      }),
      invalidatesTags: ["FormSubmission", "Lead"],
    }),

    // Get form submission by ID
    getFormSubmission: builder.query<FormSubmissionResponse, string>({
      query: (id) => `/form-submissions/${id}`,
      providesTags: (result, error, id) => [{ type: "FormSubmission", id }],
    }),

    // Get form submissions with filtering
    getFormSubmissions: builder.query<
      FormSubmissionsResponse,
      FormSubmissionFilter
    >({
      query: (filters = {}) => {
        const params = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            params.append(key, value.toString());
          }
        });

        return `/form-submissions?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "FormSubmission" as const,
                id,
              })),
              "FormSubmission",
            ]
          : ["FormSubmission"],
    }),

    // Get form submission statistics
    getFormSubmissionStats: builder.query<
      { success: boolean; data: FormSubmissionStats },
      string | undefined
    >({
      query: (landingPageId) =>
        landingPageId
          ? `/form-submissions/stats?landingPageId=${landingPageId}`
          : "/form-submissions/stats",
      providesTags: ["FormSubmission"],
    }),
  }),
});

export const {
  useCreateFormSubmissionMutation,
  useGetFormSubmissionQuery,
  useGetFormSubmissionsQuery,
  useLazyGetFormSubmissionsQuery,
  useGetFormSubmissionStatsQuery,
} = formSubmissionApi;
