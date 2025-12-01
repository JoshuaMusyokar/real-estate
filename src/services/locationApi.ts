import { baseApi } from "./baseApi";
import type {
  City,
  Locality,
  CreateCityRequest,
  UpdateCityRequest,
  CreateLocalityRequest,
  UpdateLocalityRequest,
  UserCityAssignment,
  UserLocalityAssignment,
  LocationStats,
  ApiResponse,
  PaginatedResponse,
  LocalityRatingStats,
  LocalityRating,
  CreateLocalityRatingRequest,
  UpdateLocalityRatingRequest,
} from "../types";

export const locationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // City endpoints
    createCity: builder.mutation<ApiResponse<City>, CreateCityRequest>({
      query: (data) => ({
        url: "/locations/cities",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["City"],
    }),

    getCities: builder.query<
      PaginatedResponse<City>,
      {
        search?: string;
        state?: string;
        country?: string;
        hasLocality?: boolean;
        page?: number;
        limit?: number;
      }
    >({
      query: (params = {}) => ({
        url: "/locations/cities",
        method: "GET",
        params: {
          page: params.page || 1,
          limit: params.limit || 50,
          search: params.search,
          state: params.state,
          country: params.country,
          hasLocality: params.hasLocality,
        },
      }),
      providesTags: ["City"],
    }),

    getCity: builder.query<ApiResponse<City>, string>({
      query: (id) => `/locations/cities/${id}`,
      providesTags: (_result, _error, id) => [{ type: "City", id }],
    }),

    updateCity: builder.mutation<
      ApiResponse<City>,
      { id: string; data: UpdateCityRequest }
    >({
      query: ({ id, data }) => ({
        url: `/locations/cities/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "City", id },
        "City",
      ],
    }),

    deleteCity: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/locations/cities/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["City"],
    }),

    // Locality endpoints
    createLocality: builder.mutation<
      ApiResponse<Locality>,
      CreateLocalityRequest
    >({
      query: (data) => ({
        url: "/locations/localities",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Locality"],
    }),

    getLocalities: builder.query<
      PaginatedResponse<Locality>,
      {
        search?: string;
        cityId?: string;
        cityName?: string;
        page?: number;
        limit?: number;
      }
    >({
      query: (params = {}) => ({
        url: "/locations/localities",
        method: "GET",
        params: {
          page: params.page || 1,
          limit: params.limit || 500,
          search: params.search,
          cityId: params.cityId,
          cityName: params.cityName,
        },
      }),
      providesTags: ["Locality"],
    }),

    getLocality: builder.query<ApiResponse<Locality>, string>({
      query: (id) => `/locations/localities/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Locality", id }],
    }),

    updateLocality: builder.mutation<
      ApiResponse<Locality>,
      { id: string; data: UpdateLocalityRequest }
    >({
      query: ({ id, data }) => ({
        url: `/locations/localities/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Locality", id },
        "Locality",
      ],
    }),

    deleteLocality: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/locations/localities/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Locality"],
    }),

    // User assignment endpoints
    assignCitiesToUser: builder.mutation<ApiResponse<void>, UserCityAssignment>(
      {
        query: (data) => ({
          url: "/locations/users/assign-cities",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["User", "City"],
      }
    ),

    assignLocalitiesToUser: builder.mutation<
      ApiResponse<void>,
      UserLocalityAssignment
    >({
      query: (data) => ({
        url: "/locations/users/assign-localities",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User", "Locality"],
    }),

    getUserCities: builder.query<ApiResponse<City[]>, string>({
      query: (userId) => `/locations/users/${userId}/cities`,
      providesTags: (_result, _error, userId) => [{ type: "User", id: userId }],
    }),

    getUserLocalities: builder.query<ApiResponse<Locality[]>, string>({
      query: (userId) => `/locations/users/${userId}/localities`,
      providesTags: (_result, _error, userId) => [{ type: "User", id: userId }],
    }),

    getLocalityByName: builder.query<
      ApiResponse<Locality>,
      {
        name: string;
        cityId: string;
      }
    >({
      query: ({ name, cityId }) => ({
        url: `/locations/localities/by-name`,
        method: "GET",
        params: { name, cityId },
      }),
      providesTags: ["Locality"],
    }),

    // Stats
    getLocationStats: builder.query<ApiResponse<LocationStats>, void>({
      query: () => "/locations/stats",
      providesTags: ["Location"],
    }),

    // Bulk operations
    bulkCreateCities: builder.mutation<
      ApiResponse<City[]>,
      CreateCityRequest[]
    >({
      query: (data) => ({
        url: "/locations/cities/bulk",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["City"],
    }),

    createLocalityRating: builder.mutation<
      ApiResponse<LocalityRating>,
      CreateLocalityRatingRequest
    >({
      query: (data) => ({
        url: "/locations/locality-ratings",
        method: "POST",
        body: data,
      }),
    }),
    updateLocalityRating: builder.mutation<
      ApiResponse<LocalityRating>,
      {
        id: string;
        data: UpdateLocalityRatingRequest;
      }
    >({
      query: ({ id, data }) => ({
        url: `/locations/locality-ratings/${id}`,
        method: "PUT",
        body: data,
      }),
    }),

    deleteLocalityRating: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/locations/locality-ratings/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "LocalityRating", id },
        "LocalityStats",
      ],
    }),

    getLocalityRatings: builder.query<ApiResponse<LocalityRating[]>, string>({
      query: (localityId) => `/locations/localities/${localityId}/ratings`,
      providesTags: (_result, _error, localityId) => [
        { type: "LocalityRating", id: localityId },
      ],
    }),

    getUserLocalityRating: builder.query<
      ApiResponse<LocalityRating | null>,
      {
        localityId: string;
        userId: string;
      }
    >({
      query: ({ localityId, userId }) =>
        `/locations/localities/${localityId}/user-rating/${userId}`,
      providesTags: (_result, _error, { localityId, userId }) => [
        { type: "LocalityRating", id: `${localityId}-${userId}` },
      ],
    }),

    getLocalityRatingStats: builder.query<
      ApiResponse<LocalityRatingStats>,
      string
    >({
      query: (localityId) => `/locations/localities/${localityId}/rating-stats`,
      providesTags: (_result, _error, localityId) => [
        { type: "LocalityStats", id: localityId },
      ],
    }),

    // // Updated localities query with ratings
    // getLocalities: builder.query<
    //   PaginatedResponse<Locality>,
    //   {
    //     search?: string;
    //     cityId?: string;
    //     cityName?: string;
    //     page?: number;
    //     limit?: number;
    //   }
    // >({
    //   query: (params = {}) => ({
    //     url: "/locations/localities",
    //     method: "GET",
    //     params: {
    //       page: params.page || 1,
    //       limit: params.limit || 50,
    //       search: params.search,
    //       cityId: params.cityId,
    //       cityName: params.cityName,
    //     },
    //   }),
    //   providesTags: ["Locality"],
    // }),

    bulkCreateLocalities: builder.mutation<
      ApiResponse<Locality[]>,
      CreateLocalityRequest[]
    >({
      query: (data) => ({
        url: "/locations/localities/bulk",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Locality"],
    }),
  }),
});

export const {
  // City hooks
  useCreateCityMutation,
  useGetCitiesQuery,
  useGetCityQuery,
  useUpdateCityMutation,
  useDeleteCityMutation,

  // Locality hooks
  useCreateLocalityMutation,
  useGetLocalitiesQuery,
  useGetLocalityQuery,
  useUpdateLocalityMutation,
  useDeleteLocalityMutation,
  useGetLocalityByNameQuery,

  // User assignment hooks
  useAssignCitiesToUserMutation,
  useAssignLocalitiesToUserMutation,
  useGetUserCitiesQuery,
  useGetUserLocalitiesQuery,

  // Stats
  useGetLocationStatsQuery,

  // Bulk operations
  useBulkCreateCitiesMutation,
  useBulkCreateLocalitiesMutation,

  //locality rating hooks
  useCreateLocalityRatingMutation,
  useUpdateLocalityRatingMutation,
  useDeleteLocalityRatingMutation,
  useGetLocalityRatingsQuery,
  useGetUserLocalityRatingQuery,
  useGetLocalityRatingStatsQuery,
} = locationApi;
