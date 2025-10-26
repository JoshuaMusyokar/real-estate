/* eslint-disable @typescript-eslint/no-unused-vars */

import { baseApi } from "./baseApi";
import type {
  // Property,
  PropertyCreateRequest,
  PropertyUpdateRequest,
  PropertySearchFilters,
  PropertyResponse,
  PropertiesResponse,
  PropertyStats,
  PropertyImage,
} from "../types";

export const propertyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create property
    createProperty: builder.mutation<PropertyResponse, PropertyCreateRequest>({
      query: (propertyData) => ({
        url: "/properties",
        method: "POST",
        body: propertyData,
      }),
      invalidatesTags: ["Property"],
    }),

    // Get property by ID
    getProperty: builder.query<PropertyResponse, string>({
      query: (id) => `/properties/${id}`,
      providesTags: (result, error, id) => [{ type: "Property", id }],
    }),

    // Get property by slug
    getPropertyBySlug: builder.query<PropertyResponse, string>({
      query: (slug) => `/properties/slug/${slug}`,
      providesTags: (result, error, slug) => [
        { type: "Property", id: result?.data.id },
      ],
    }),

    // Update property
    updateProperty: builder.mutation<
      PropertyResponse,
      { id: string; data: PropertyUpdateRequest }
    >({
      query: ({ id, data }) => ({
        url: `/properties/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Property", id }],
    }),

    // Delete property
    deleteProperty: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/properties/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Property"],
    }),

    // Search properties
    searchProperties: builder.query<PropertiesResponse, PropertySearchFilters>({
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

        return `/properties/search?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Property" as const,
                id,
              })),
              "Property",
            ]
          : ["Property"],
    }),

    // Get user properties
    getUserProperties: builder.query<
      PropertiesResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 20 } = {}) =>
        `/properties/user/my-properties?page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Property" as const,
                id,
              })),
              "Property",
            ]
          : ["Property"],
    }),

    // Get property stats
    getPropertyStats: builder.query<
      { success: boolean; data: PropertyStats },
      void
    >({
      query: () => "/properties/stats/overview",
      providesTags: ["Property"],
    }),

    // Add property image
    addPropertyImage: builder.mutation<
      PropertyResponse,
      {
        propertyId: string;
        imageData: Omit<PropertyImage, "id" | "propertyId" | "createdAt">;
      }
    >({
      query: ({ propertyId, imageData }) => ({
        url: `/properties/${propertyId}/images`,
        method: "POST",
        body: imageData,
      }),
      invalidatesTags: (result, error, { propertyId }) => [
        { type: "Property", id: propertyId },
      ],
    }),

    // Update property image
    updatePropertyImage: builder.mutation<
      PropertyResponse,
      {
        imageId: string;
        updates: Partial<
          Omit<PropertyImage, "id" | "propertyId" | "createdAt">
        >;
      }
    >({
      query: ({ imageId, updates }) => ({
        url: `/properties/images/${imageId}`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: (result) =>
        result ? [{ type: "Property", id: result.data.id }] : ["Property"],
    }),

    // Delete property image
    deletePropertyImage: builder.mutation<PropertyResponse, string>({
      query: (imageId) => ({
        url: `/properties/images/${imageId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result) =>
        result ? [{ type: "Property", id: result.data.id }] : ["Property"],
    }),

    // Review property (admin only)
    reviewProperty: builder.mutation<
      PropertyResponse,
      { id: string; status: string; rejectionReason?: string }
    >({
      query: ({ id, ...reviewData }) => ({
        url: `/properties/${id}/review`,
        method: "PATCH",
        body: reviewData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Property", id }],
    }),
  }),
});

export const {
  useCreatePropertyMutation,
  useGetPropertyQuery,
  useGetPropertyBySlugQuery,
  useUpdatePropertyMutation,
  useDeletePropertyMutation,
  useSearchPropertiesQuery,
  useLazySearchPropertiesQuery,
  useGetUserPropertiesQuery,
  useGetPropertyStatsQuery,
  useAddPropertyImageMutation,
  useUpdatePropertyImageMutation,
  useDeletePropertyImageMutation,
  useReviewPropertyMutation,
} = propertyApi;
