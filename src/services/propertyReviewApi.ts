import { baseApi } from "./baseApi";
import type {
  PropertyReview,
  PropertyReviewStats,
  CreatePropertyReviewRequest,
  UpdatePropertyReviewRequest,
  ApiResponse,
} from "../types";

export const propertyReviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new property review
    createPropertyReview: builder.mutation<
      ApiResponse<PropertyReview>,
      CreatePropertyReviewRequest
    >({
      query: (data) => ({
        url: "/properties/reviews",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_result, _error, { propertyId }) => [
        { type: "PropertyReview", id: propertyId },
        { type: "PropertyReviewStats", id: propertyId },
        { type: "Property", id: propertyId },
      ],
    }),

    // Update a property review
    updatePropertyReview: builder.mutation<
      ApiResponse<PropertyReview>,
      {
        id: string;
        data: UpdatePropertyReviewRequest;
      }
    >({
      query: ({ id, data }) => ({
        url: `/properties/reviews/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result) =>
        result?.data
          ? [
              { type: "PropertyReview", id: result.data.propertyId },
              { type: "PropertyReviewStats", id: result.data.propertyId },
              { type: "Property", id: result.data.propertyId },
            ]
          : [],
    }),

    // Delete a property review
    deletePropertyReview: builder.mutation<
      ApiResponse<void>,
      { id: string; propertyId: string }
    >({
      query: ({ id }) => ({
        url: `/properties/reviews/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { propertyId }) => [
        { type: "PropertyReview", id: propertyId },
        { type: "PropertyReviewStats", id: propertyId },
        { type: "Property", id: propertyId },
      ],
    }),

    // Get all reviews for a property
    getPropertyReviews: builder.query<
      ApiResponse<PropertyReview[]>,
      {
        propertyId: string;
        limit?: number;
        offset?: number;
        sortBy?: "createdAt" | "rating";
        sortOrder?: "asc" | "desc";
      }
    >({
      query: ({ propertyId, limit, offset, sortBy, sortOrder }) => ({
        url: `/properties/${propertyId}/reviews`,
        method: "GET",
        params: {
          limit,
          offset,
          sortBy,
          sortOrder,
        },
      }),
      providesTags: (_result, _error, { propertyId }) => [
        { type: "PropertyReview", id: propertyId },
      ],
    }),

    // Get user's review for a specific property
    getUserPropertyReview: builder.query<
      ApiResponse<PropertyReview | null>,
      {
        propertyId: string;
        userId: string;
      }
    >({
      query: ({ propertyId, userId }) => ({
        url: `/properties/${propertyId}/reviews/user/${userId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, { propertyId, userId }) => [
        { type: "PropertyReview", id: `${propertyId}-${userId}` },
      ],
    }),

    // Get property review statistics
    getPropertyReviewStats: builder.query<
      ApiResponse<PropertyReviewStats>,
      string
    >({
      query: (propertyId) => ({
        url: `/properties/${propertyId}/reviews/stats`,
        method: "GET",
      }),
      providesTags: (_result, _error, propertyId) => [
        { type: "PropertyReviewStats", id: propertyId },
      ],
    }),

    // Get all reviews by a user
    getUserReviews: builder.query<
      ApiResponse<PropertyReview[]>,
      {
        userId: string;
        limit?: number;
        offset?: number;
      }
    >({
      query: ({ userId, limit, offset }) => ({
        url: `/users/${userId}/reviews`,
        method: "GET",
        params: {
          limit,
          offset,
        },
      }),
      providesTags: (_result, _error, { userId }) => [
        { type: "UserReviews", id: userId },
      ],
    }),

    // Check if user can review a property
    canReviewProperty: builder.query<
      ApiResponse<{ canReview: boolean; reason?: string }>,
      string
    >({
      query: (propertyId) => ({
        url: `/properties/${propertyId}/reviews/can-review`,
        method: "GET",
      }),
    }),

    // Get top-rated properties
    getTopRatedProperties: builder.query<
      ApiResponse<any[]>,
      {
        limit?: number;
      }
    >({
      query: ({ limit = 10 }) => ({
        url: `/properties/top-rated`,
        method: "GET",
        params: {
          limit,
        },
      }),
      providesTags: ["TopRatedProperties"],
    }),
  }),
});

export const {
  // Mutations
  useCreatePropertyReviewMutation,
  useUpdatePropertyReviewMutation,
  useDeletePropertyReviewMutation,

  // Queries
  useGetPropertyReviewsQuery,
  useGetUserPropertyReviewQuery,
  useGetPropertyReviewStatsQuery,
  useGetUserReviewsQuery,
  useCanReviewPropertyQuery,
  useGetTopRatedPropertiesQuery,

  // Lazy Queries
  useLazyGetPropertyReviewsQuery,
  useLazyGetUserPropertyReviewQuery,
  useLazyGetPropertyReviewStatsQuery,
  useLazyGetUserReviewsQuery,
  useLazyCanReviewPropertyQuery,
  useLazyGetTopRatedPropertiesQuery,
} = propertyReviewApi;
