/* eslint-disable @typescript-eslint/no-unused-vars */

import { baseApi } from "./baseApi";
import type {
  Amenity,
  AmenityCreateRequest,
  AmenityUpdateRequest,
  AmenitySearchFilters,
  AmenityResponse,
  AmenitiesResponse,
  PropertyAmenityRequest,
  PropertyAmenityResponse,
} from "../types";

export const amenityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create amenity
    createAmenity: builder.mutation<AmenityResponse, AmenityCreateRequest>({
      query: (amenityData) => ({
        url: "/amenities",
        method: "POST",
        body: amenityData,
      }),
      invalidatesTags: ["Amenity"],
    }),

    // Bulk create amenities
    bulkCreateAmenities: builder.mutation<
      AmenitiesResponse,
      AmenityCreateRequest[]
    >({
      query: (amenities) => ({
        url: "/amenities/bulk",
        method: "POST",
        body: amenities,
      }),
      invalidatesTags: ["Amenity"],
    }),

    // Get amenity by ID
    getAmenity: builder.query<AmenityResponse, string>({
      query: (id) => `/amenities/${id}`,
      providesTags: (result, error, id) => [{ type: "Amenity", id }],
    }),

    // Update amenity
    updateAmenity: builder.mutation<
      AmenityResponse,
      { id: string; data: AmenityUpdateRequest }
    >({
      query: ({ id, data }) => ({
        url: `/amenities/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Amenity", id }],
    }),

    // Delete amenity
    deleteAmenity: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/amenities/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Amenity"],
    }),

    // Search amenities
    searchAmenities: builder.query<AmenitiesResponse, AmenitySearchFilters>({
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

        return `/amenities?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Amenity" as const,
                id,
              })),
              "Amenity",
            ]
          : ["Amenity"],
    }),

    // Get amenity categories
    getAmenityCategories: builder.query<
      { success: boolean; data: string[] },
      void
    >({
      query: () => "/amenities/categories",
      providesTags: ["Amenity"],
    }),

    // Get popular amenities
    getPopularAmenities: builder.query<AmenitiesResponse, { limit?: number }>({
      query: ({ limit = 10 } = {}) => `/amenities/popular?limit=${limit}`,
      providesTags: ["Amenity"],
    }),

    // Update amenity order
    updateAmenityOrder: builder.mutation<
      AmenityResponse,
      { id: string; order: number }
    >({
      query: ({ id, order }) => ({
        url: `/amenities/${id}/order`,
        method: "PATCH",
        body: { order },
      }),
      invalidatesTags: ["Amenity"],
    }),

    // Bulk update amenity orders
    bulkUpdateAmenityOrders: builder.mutation<
      AmenitiesResponse,
      { updates: Array<{ id: string; order: number }> }
    >({
      query: ({ updates }) => ({
        url: "/amenities/bulk/orders",
        method: "PUT",
        body: { updates },
      }),
      invalidatesTags: ["Amenity"],
    }),

    // Add amenities to property
    addAmenitiesToProperty: builder.mutation<
      PropertyAmenityResponse,
      { propertyId: string; data: PropertyAmenityRequest }
    >({
      query: ({ propertyId, data }) => ({
        url: `/amenities/property/${propertyId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Property", "Amenity"],
    }),

    // Get property amenities
    getPropertyAmenities: builder.query<AmenitiesResponse, string>({
      query: (propertyId) => `/amenities/property/${propertyId}`,
      providesTags: (result, error, propertyId) => [
        { type: "Property", id: propertyId },
        "Amenity",
      ],
    }),

    // Toggle amenity status
    toggleAmenityStatus: builder.mutation<AmenityResponse, string>({
      query: (id) => ({
        url: `/amenities/${id}/toggle-status`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Amenity", id }],
    }),
  }),
});

export const {
  useCreateAmenityMutation,
  useBulkCreateAmenitiesMutation,
  useGetAmenityQuery,
  useUpdateAmenityMutation,
  useDeleteAmenityMutation,
  useSearchAmenitiesQuery,
  useLazySearchAmenitiesQuery,
  useGetAmenityCategoriesQuery,
  useGetPopularAmenitiesQuery,
  useUpdateAmenityOrderMutation,
  useBulkUpdateAmenityOrdersMutation,
  useAddAmenitiesToPropertyMutation,
  useGetPropertyAmenitiesQuery,
  useToggleAmenityStatusMutation,
} = amenityApi;
