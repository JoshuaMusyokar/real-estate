/* eslint-disable @typescript-eslint/no-unused-vars */

import { baseApi } from "./baseApi";
import type {
  PropertyResponse,
  PropertiesResponse,
  PropertyStats,
  BaseResponse,
  FavoriteProperty,
  CategorizedPropertiesResponse,
  SimilarPropertiesResponse,
  FavoritesResponse,
  FavoriteStatusResponse,
  UserFavoritesResponse,
  PropertySearchFilters,
  PropertyUpdateRequest,
  ApiResponse,
  CategorizedPropertiesFilters,
} from "../types";

export const propertyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create property - accepts FormData with images and documents
    createProperty: builder.mutation<PropertyResponse, FormData>({
      query: (formData) => ({
        url: "/properties",
        method: "POST",
        body: formData,
        // Don't set Content-Type - browser will set it automatically with boundary
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

    // Update property - accepts FormData for file uploads
    updateProperty: builder.mutation<
      PropertyResponse,
      { id: string; data: FormData | PropertyUpdateRequest }
    >({
      query: ({ id, data }) => {
        const isForm = data instanceof FormData;
        console.log("fasdfsd", data instanceof FormData, data);

        return {
          url: `/properties/${id}`,
          method: "PUT",
          body: data,
          // body: isForm ? data : JSON.stringify(data),
          // ...(!isForm && {
          //   headers: { "Content-Type": "application/json" },
          // }),
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "Property", id },
        "Property",
      ],
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

    // Get properties by owner
    getPropertiesByOwner: builder.query<
      PropertiesResponse,
      { ownerId: string; limit?: number; excludePropertyId?: string }
    >({
      query: ({ ownerId, limit = 5, excludePropertyId }) => {
        const params = new URLSearchParams();
        params.append("ownerId", ownerId);
        params.append("limit", limit.toString());
        if (excludePropertyId) {
          params.append("excludePropertyId", excludePropertyId);
        }
        return `/properties/by-owner?${params.toString()}`;
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
      { page?: number; limit?: number; status?: string }
    >({
      query: ({ page = 1, limit = 20, status } = {}) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());
        if (status) params.append("status", status);
        return `/properties/user/my-properties?${params.toString()}`;
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

    // Get property stats
    getPropertyStats: builder.query<
      { success: boolean; data: PropertyStats },
      void
    >({
      query: () => "/properties/stats/overview",
      providesTags: ["Property"],
    }),

    // Get similar properties for property details page
    getSimilarProperties: builder.query<
      SimilarPropertiesResponse,
      { propertyId: string; limit?: number }
    >({
      query: ({ propertyId, limit = 6 }) =>
        `/properties/similar/${propertyId}?limit=${limit}`,
      providesTags: (result, error, { propertyId }) =>
        result
          ? [{ type: "Property", id: `SIMILAR-${propertyId}` }]
          : ["Property"],
    }),

    // Get categorized properties for home page
    getCategorizedProperties: builder.query<
      ApiResponse<CategorizedPropertiesResponse>,
      CategorizedPropertiesFilters
    >({
      query: (filters) => {
        const params = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            params.append(key, value.toString());
          }
        });

        return `/properties/cat/categorized?${params.toString()}`;
      },
      providesTags: ["Property"],
    }),

    // Add property to favorites
    addToFavorites: builder.mutation<
      { success: boolean; data: FavoriteProperty; message: string },
      { propertyId: string }
    >({
      query: ({ propertyId }) => ({
        url: "/properties/fav/favorites",
        method: "POST",
        body: { propertyId },
      }),
      invalidatesTags: ["Property", "Favorite"],
    }),

    // Remove property from favorites
    removeFromFavorites: builder.mutation<BaseResponse, { propertyId: string }>(
      {
        query: ({ propertyId }) => ({
          url: `/properties/fav/favorites/${propertyId}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Property", "Favorite"],
      }
    ),

    // Get user's favorite properties
    getFavoriteProperties: builder.query<
      FavoritesResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 20 } = {}) =>
        `/properties/fav/favorites?page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Favorite" as const,
                id,
              })),
              "Favorite",
            ]
          : ["Favorite"],
    }),

    // Check favorite status for multiple properties
    checkFavoriteStatus: builder.mutation<
      FavoriteStatusResponse,
      { propertyIds: string[] }
    >({
      query: ({ propertyIds }) => ({
        url: "/properties/fav/favorites/check",
        method: "POST",
        body: { propertyIds },
      }),
      invalidatesTags: ["Favorite"],
    }),

    // Get user favorites (simple list of property IDs)
    getUserFavorites: builder.query<UserFavoritesResponse, void>({
      query: () => `/properties/fav/user/favorites`,
      providesTags: ["Favorite"],
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
      invalidatesTags: (result, error, { id }) => [
        { type: "Property", id },
        "Property",
      ],
    }),

    // Add property image (for edit mode)
    addPropertyImage: builder.mutation<
      PropertyResponse,
      { propertyId: string; formData: FormData }
    >({
      query: ({ propertyId, formData }) => ({
        url: `/properties/${propertyId}/images`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, { propertyId }) => [
        { type: "Property", id: propertyId },
      ],
    }),

    // Delete property image
    deletePropertyImage: builder.mutation<
      PropertyResponse,
      { propertyId: string; imageId: string }
    >({
      query: ({ propertyId, imageId }) => ({
        url: `/properties/${propertyId}/images/${imageId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { propertyId }) => [
        { type: "Property", id: propertyId },
      ],
    }),

    // Add property document (for edit mode)
    addPropertyDocument: builder.mutation<
      PropertyResponse,
      { propertyId: string; formData: FormData }
    >({
      query: ({ propertyId, formData }) => ({
        url: `/properties/${propertyId}/documents`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, { propertyId }) => [
        { type: "Property", id: propertyId },
      ],
    }),
    // Admin only: Toggle featured status
    toggleFeatured: builder.mutation<PropertyResponse, { propertyId: string }>({
      query: ({ propertyId }) => ({
        url: `/featured/${propertyId}/toggle`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, { propertyId }) => [
        { type: "Property", id: propertyId },
        "Property",
      ],
    }),

    // Admin only: Add to featured
    addToFeatured: builder.mutation<PropertyResponse, { propertyId: string }>({
      query: ({ propertyId }) => ({
        url: `/featured/${propertyId}`,
        method: "POST",
      }),
      invalidatesTags: (result, error, { propertyId }) => [
        { type: "Property", id: propertyId },
        "Property",
      ],
    }),

    // Admin only: Remove from featured
    removeFromFeatured: builder.mutation<
      PropertyResponse,
      { propertyId: string }
    >({
      query: ({ propertyId }) => ({
        url: `/featured/${propertyId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { propertyId }) => [
        { type: "Property", id: propertyId },
        "Property",
      ],
    }),

    // Admin only: Get featured properties
    getFeaturedProperties: builder.query<
      PropertiesResponse,
      { page?: number; limit?: number; search?: string }
    >({
      query: ({ page = 1, limit = 20, search } = {}) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());
        if (search) params.append("search", search);
        return `/featured?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Property" as const,
                id,
              })),
              { type: "Property", id: "FEATURED_LIST" },
            ]
          : [{ type: "Property", id: "FEATURED_LIST" }],
    }),

    // Admin only: Get featured stats
    getFeaturedStats: builder.query<
      {
        success: boolean;
        data: {
          total: number;
          byType: Array<{ propertyType: string; count: number }>;
          byStatus: Array<{ status: string; count: number }>;
          byCity: Array<{ cityId: string; cityName: string; count: number }>;
        };
      },
      void
    >({
      query: () => "/featured/stats",
      providesTags: ["PropertyStats"],
    }),

    // Delete property document
    deletePropertyDocument: builder.mutation<
      PropertyResponse,
      { propertyId: string; documentId: string }
    >({
      query: ({ propertyId, documentId }) => ({
        url: `/properties/${propertyId}/documents/${documentId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { propertyId }) => [
        { type: "Property", id: propertyId },
      ],
    }),
  }),
});

export const {
  useAddToFeaturedMutation,
  useGetFeaturedPropertiesQuery,
  useGetFeaturedStatsQuery,
  useToggleFeaturedMutation,
  useRemoveFromFeaturedMutation,
  useGetPropertiesByOwnerQuery,
  useGetCategorizedPropertiesQuery,
  useAddToFavoritesMutation,
  useCheckFavoriteStatusMutation,
  useGetFavoritePropertiesQuery,
  useGetSimilarPropertiesQuery,
  useRemoveFromFavoritesMutation,
  useGetUserFavoritesQuery,
  useCreatePropertyMutation,
  useGetPropertyQuery,
  useGetPropertyBySlugQuery,
  useUpdatePropertyMutation,
  useDeletePropertyMutation,
  useSearchPropertiesQuery,
  useLazySearchPropertiesQuery,
  useGetUserPropertiesQuery,
  useGetPropertyStatsQuery,
  useReviewPropertyMutation,
  useAddPropertyImageMutation,
  useDeletePropertyImageMutation,
  useAddPropertyDocumentMutation,
  useDeletePropertyDocumentMutation,
} = propertyApi;
