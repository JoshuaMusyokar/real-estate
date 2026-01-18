import { baseApi } from "./baseApi";
import type {
  Media,
  CreateMediaRequest,
  Content,
  CreateContentRequest,
  UpdateContentRequest,
  ContentSearchFilters,
  ContentCategory,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  ApiResponse,
  PaginatedResponse,
} from "../types";

export const cmsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ========== MEDIA ENDPOINTS ==========

    // Upload media
    uploadMedia: builder.mutation<ApiResponse<Media>, CreateMediaRequest>({
      query: (mediaData) => {
        const formData = new FormData();
        formData.append("file", mediaData.file);
        if (mediaData.folder) formData.append("folder", mediaData.folder);
        if (mediaData.altText) formData.append("altText", mediaData.altText);

        return {
          url: "/cms/upload",
          method: "POST",
          body: formData,
          headers: {
            // Let the browser set content-type for form data
          },
        };
      },
      invalidatesTags: ["Media"],
    }),

    // Delete media
    deleteMedia: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/cms/media/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Media", id }],
    }),

    // Get media by ID
    getMedia: builder.query<ApiResponse<Media>, string>({
      query: (id) => `/cms/media/${id}`,
      providesTags: (result, error, id) => [{ type: "Media", id }],
    }),

    // ========== CONTENT ENDPOINTS ==========

    // Create content
    createContent: builder.mutation<ApiResponse<Content>, CreateContentRequest>(
      {
        query: (contentData) => ({
          url: "/cms/content",
          method: "POST",
          body: contentData,
        }),
        invalidatesTags: ["Content"],
      }
    ),

    // Get content by ID
    getContent: builder.query<ApiResponse<Content>, string>({
      query: (id) => `/cms/content/${id}`,
      providesTags: (result, error, id) => [{ type: "Content", id }],
    }),

    // Get content by slug (public)
    getContentBySlug: builder.query<ApiResponse<Content>, string>({
      query: (slug) => `/cms/content/slug/${slug}`,
      providesTags: (result, error, slug) => [{ type: "Content", slug }],
    }),

    // Update content
    updateContent: builder.mutation<
      ApiResponse<Content>,
      { id: string; data: UpdateContentRequest }
    >({
      query: ({ id, data }) => ({
        url: `/cms/content/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Content", id }],
    }),

    // Delete content
    deleteContent: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/cms/content/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Content", id }],
    }),

    // Search contents
    searchContents: builder.query<
      PaginatedResponse<Content>,
      ContentSearchFilters
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

        return `/cms/content?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Content" as const,
                id,
              })),
              "Content",
            ]
          : ["Content"],
    }),

    // Get published contents (public)
    getPublishedContents: builder.query<
      PaginatedResponse<Content>,
      { type?: string }
    >({
      query: ({ type } = {}) => {
        const params = new URLSearchParams();
        if (type) params.append("type", type);
        return `/cms/content/published?${params.toString()}`;
      },
      providesTags: ["Content"],
    }),

    // Get menu items (public)
    getMenuItems: builder.query<ApiResponse<Content[]>, void>({
      query: () => "/cms/menu",
      providesTags: ["Content"],
    }),

    // Get featured content (public)
    getFeaturedContent: builder.query<
      ApiResponse<Content[]>,
      { type?: string; limit?: number }
    >({
      query: ({ type, limit = 5 } = {}) => {
        const params = new URLSearchParams();
        if (type) params.append("type", type);
        params.append("limit", limit.toString());
        return `/cms/featured?${params.toString()}`;
      },
      providesTags: ["Content"],
    }),

    // Update content order
    updateContentOrder: builder.mutation<
      ApiResponse<Content>,
      { id: string; order: number }
    >({
      query: ({ id, order }) => ({
        url: `/cms/content/${id}/order`,
        method: "PATCH",
        body: { order },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Content", id }],
    }),

    // Bulk update content orders
    bulkUpdateContentOrders: builder.mutation<
      PaginatedResponse<Content>,
      { updates: Array<{ id: string; order: number }> }
    >({
      query: ({ updates }) => ({
        url: "/cms/content/bulk/orders",
        method: "PUT",
        body: { updates },
      }),
      invalidatesTags: ["Content"],
    }),

    // Toggle content status
    toggleContentStatus: builder.mutation<ApiResponse<Content>, string>({
      query: (id) => ({
        url: `/cms/content/${id}/toggle-status`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Content", id }],
    }),

    // Toggle featured status
    toggleFeaturedStatus: builder.mutation<ApiResponse<Content>, string>({
      query: (id) => ({
        url: `/cms/content/${id}/toggle-featured`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Content", id }],
    }),

    // Schedule content
    scheduleContent: builder.mutation<
      ApiResponse<Content>,
      { id: string; publishedAt: Date }
    >({
      query: ({ id, publishedAt }) => ({
        url: `/cms/content/${id}/schedule`,
        method: "PATCH",
        body: { publishedAt },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Content", id }],
    }),

    // ========== CATEGORY ENDPOINTS ==========

    // Create category
    createCategory: builder.mutation<
      ApiResponse<ContentCategory>,
      CreateCategoryRequest
    >({
      query: (categoryData) => ({
        url: "/cms/categories",
        method: "POST",
        body: categoryData,
      }),
      invalidatesTags: ["Category"],
    }),

    // Get category by ID
    getCategory: builder.query<ApiResponse<ContentCategory>, string>({
      query: (id) => `/cms/categories/${id}`,
      providesTags: (result, error, id) => [{ type: "Category", id }],
    }),

    // Update category
    updateCategory: builder.mutation<
      ApiResponse<ContentCategory>,
      { id: string; data: UpdateCategoryRequest }
    >({
      query: ({ id, data }) => ({
        url: `/cms/categories/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Category", id }],
    }),

    // Delete category
    deleteCategory: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/cms/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Category", id }],
    }),

    // Get all categories
    getAllCategories: builder.query<
      ApiResponse<ContentCategory[]>,
      { activeOnly?: boolean }
    >({
      query: ({ activeOnly = true } = {}) =>
        `/cms/categories/all?activeOnly=${activeOnly}`,
      providesTags: ["Category"],
    }),

    // Get active categories (public)
    getCategories: builder.query<ApiResponse<ContentCategory[]>, void>({
      query: () => "/cms/categories",
      providesTags: ["Category"],
    }),

    // Toggle category status
    toggleCategoryStatus: builder.mutation<
      ApiResponse<ContentCategory>,
      string
    >({
      query: (id) => ({
        url: `/cms/categories/${id}/toggle-status`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Category", id }],
    }),

    // ========== UTILITY ENDPOINTS ==========

    // Get content types
    getContentTypes: builder.query<
      { success: boolean; data: { value: string; label: string }[] },
      void
    >({
      query: () => "/cms/content-types",
      providesTags: ["Content"],
    }),

    // Get content statuses
    getContentStatuses: builder.query<
      { success: boolean; data: { value: string; label: string }[] },
      void
    >({
      query: () => "/cms/content-statuses",
      providesTags: ["Content"],
    }),

    // Get content statistics
    getContentStats: builder.query<
      {
        success: boolean;
        data: {
          total: number;
          published: number;
          drafts: number;
          scheduled: number;
          byType: Record<string, number>;
        };
      },
      void
    >({
      query: () => "/cms/statistics",
      providesTags: ["Content"],
    }),

    // Duplicate content
    duplicateContent: builder.mutation<ApiResponse<Content>, string>({
      query: (id) => ({
        url: `/cms/content/${id}/duplicate`,
        method: "POST",
      }),
      invalidatesTags: ["Content"],
    }),

    // Import content from URL
    importContent: builder.mutation<
      ApiResponse<Content>,
      { url: string; type: string }
    >({
      query: ({ url, type }) => ({
        url: "/cms/import",
        method: "POST",
        body: { url, type },
      }),
      invalidatesTags: ["Content"],
    }),

    // Export content
    exportContent: builder.query<
      { success: boolean; data: string },
      { ids?: string[]; format?: "json" | "csv" }
    >({
      query: ({ ids, format = "json" } = {}) => {
        const params = new URLSearchParams();
        if (ids) ids.forEach((id) => params.append("ids", id));
        params.append("format", format);
        return `/cms/export?${params.toString()}`;
      },
      providesTags: ["Content"],
    }),
  }),
});

export const {
  // Media
  useUploadMediaMutation,
  useDeleteMediaMutation,
  useGetMediaQuery,
  useLazyGetMediaQuery,

  // Content
  useCreateContentMutation,
  useGetContentQuery,
  useLazyGetContentQuery,
  useGetContentBySlugQuery,
  useLazyGetContentBySlugQuery,
  useUpdateContentMutation,
  useDeleteContentMutation,
  useSearchContentsQuery,
  useLazySearchContentsQuery,
  useGetPublishedContentsQuery,
  useLazyGetPublishedContentsQuery,
  useGetMenuItemsQuery,
  useLazyGetMenuItemsQuery,
  useGetFeaturedContentQuery,
  useLazyGetFeaturedContentQuery,
  useUpdateContentOrderMutation,
  useBulkUpdateContentOrdersMutation,
  useToggleContentStatusMutation,
  useToggleFeaturedStatusMutation,
  useScheduleContentMutation,

  // Categories
  useCreateCategoryMutation,
  useGetCategoryQuery,
  useLazyGetCategoryQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetAllCategoriesQuery,
  useLazyGetAllCategoriesQuery,
  useGetCategoriesQuery,
  useLazyGetCategoriesQuery,
  useToggleCategoryStatusMutation,

  // Utility
  useGetContentTypesQuery,
  useGetContentStatusesQuery,
  useGetContentStatsQuery,
  useDuplicateContentMutation,
  useImportContentMutation,
  useExportContentQuery,
  useLazyExportContentQuery,
} = cmsApi;
