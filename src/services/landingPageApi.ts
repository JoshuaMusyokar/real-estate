/* eslint-disable @typescript-eslint/no-unused-vars */

import { baseApi } from "./baseApi";
import type {
  LandingPage,
  LandingPageCreateRequest,
  LandingPageUpdateRequest,
  LandingPageSearchFilters,
  LandingPageResponse,
  LandingPagesResponse,
  SlugAvailabilityResponse,
} from "../types";

export const landingPageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create landing page
    createLandingPage: builder.mutation<
      LandingPageResponse,
      LandingPageCreateRequest
    >({
      query: (landingPageData) => ({
        url: "/landing",
        method: "POST",
        body: landingPageData,
      }),
      invalidatesTags: ["LandingPage"],
    }),

    // Get landing page by ID
    getLandingPage: builder.query<LandingPageResponse, string>({
      query: (id) => `/landing/${id}`,
      providesTags: (result, error, id) => [{ type: "LandingPage", id }],
    }),

    // Get landing page by slug (public)
    getLandingPageBySlug: builder.query<LandingPageResponse, string>({
      query: (slug) => `/landing/slug/${slug}`,
      providesTags: (result) =>
        result?.data ? [{ type: "LandingPage", id: result.data.id }] : [],
    }),

    // Update landing page
    updateLandingPage: builder.mutation<
      LandingPageResponse,
      { id: string; data: LandingPageUpdateRequest }
    >({
      query: ({ id, data }) => ({
        url: `/landing/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "LandingPage", id },
        "LandingPage",
      ],
    }),

    // Delete landing page
    deleteLandingPage: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/landing/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["LandingPage"],
    }),

    // Search landing pages
    searchLandingPages: builder.query<
      LandingPagesResponse,
      LandingPageSearchFilters
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

        return `/landing?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "LandingPage" as const,
                id,
              })),
              "LandingPage",
            ]
          : ["LandingPage"],
    }),

    // Get published landing pages (public)
    getPublishedLandingPages: builder.query<
      LandingPagesResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 } = {}) =>
        `/landing/published?page=${page}&limit=${limit}`,
      providesTags: ["LandingPage"],
    }),

    // Check slug availability
    checkSlugAvailability: builder.query<
      SlugAvailabilityResponse,
      { slug: string; excludeId?: string }
    >({
      query: ({ slug, excludeId }) => {
        const params = new URLSearchParams();
        if (excludeId) params.append("excludeId", excludeId);
        return `/landing/check-slug/${slug}?${params.toString()}`;
      },
    }),

    // Increment conversion count
    incrementConversion: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/landing/${id}/conversion`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [{ type: "LandingPage", id }],
    }),

    // Publish landing page
    publishLandingPage: builder.mutation<LandingPageResponse, string>({
      query: (id) => ({
        url: `/landing/${id}`,
        method: "PUT",
        body: { isPublished: true },
      }),
      invalidatesTags: (result, error, id) => [
        { type: "LandingPage", id },
        "LandingPage",
      ],
    }),

    // Unpublish landing page
    unpublishLandingPage: builder.mutation<LandingPageResponse, string>({
      query: (id) => ({
        url: `/landing/${id}`,
        method: "PUT",
        body: { isPublished: false },
      }),
      invalidatesTags: (result, error, id) => [
        { type: "LandingPage", id },
        "LandingPage",
      ],
    }),

    // Toggle landing page status
    toggleLandingPageStatus: builder.mutation<
      LandingPageResponse,
      { id: string; isActive: boolean }
    >({
      query: ({ id, isActive }) => ({
        url: `/landing/${id}`,
        method: "PUT",
        body: { isActive },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "LandingPage", id },
        "LandingPage",
      ],
    }),

    // Duplicate landing page
    duplicateLandingPage: builder.mutation<
      LandingPageResponse,
      { id: string; newSlug: string; newTitle: string }
    >({
      query: ({ id }) => ({
        url: `/landing/${id}`,
        method: "GET",
      }),
      transformResponse: async (response: LandingPageResponse, meta, arg) => {
        // This will be handled on the client side to create a new landing page
        return response;
      },
      invalidatesTags: ["LandingPage"],
    }),
  }),
});

export const {
  useCreateLandingPageMutation,
  useGetLandingPageQuery,
  useGetLandingPageBySlugQuery,
  useLazyGetLandingPageBySlugQuery,
  useUpdateLandingPageMutation,
  useDeleteLandingPageMutation,
  useSearchLandingPagesQuery,
  useLazySearchLandingPagesQuery,
  useGetPublishedLandingPagesQuery,
  useCheckSlugAvailabilityQuery,
  useLazyCheckSlugAvailabilityQuery,
  useIncrementConversionMutation,
  usePublishLandingPageMutation,
  useUnpublishLandingPageMutation,
  useToggleLandingPageStatusMutation,
  useDuplicateLandingPageMutation,
} = landingPageApi;
