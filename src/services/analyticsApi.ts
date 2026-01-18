import { baseApi } from "./baseApi";
import type {
  // Analytics Filter Types
  PropertyAnalyticsFilter,
  LeadAnalyticsFilter,

  // Metrics Types
  PerformanceMetrics,

  // Data Structure Types
  TimeSeriesData,

  // Response Types
  AnalyticsResponse,
  DashboardSummary,

  // Export Types
  ExportFormat,
  ReportType,

  // Pagination
  AnalyticsQueryParams,
  ConversionMetricsResponse,
  AgentPerformanceResponse,
  TopPropertiesResponse,
  TopCitiesResponse,
  TrafficByLocationResponse,
  RevenueMetricsResponse,
  PropertyTypeDistributionResponse,
} from "../types";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

// ============================================
// REQUEST TYPES
// ============================================

export interface ExportReportRequest {
  format: ExportFormat;
  type: ReportType;
  filters: Partial<PropertyAnalyticsFilter | LeadAnalyticsFilter>;
}

// ============================================
// RESPONSE TYPES
// ============================================

export interface PropertyOverviewResponse {
  total: PerformanceMetrics;
  active: PerformanceMetrics;
  pending: PerformanceMetrics;
  rejected: PerformanceMetrics;
  featured: PerformanceMetrics;
}

export interface LeadOverviewResponse {
  total: PerformanceMetrics;
  newLeads: PerformanceMetrics;
  contacted: PerformanceMetrics;
  qualified: PerformanceMetrics;
  closed: PerformanceMetrics;
  conversionRate: {
    rate: number;
    change?: number;
  };
}

export interface LeadSourcesResponse {
  [key: string]: PerformanceMetrics;
}

// ============================================
// ANALYTICS API
// ============================================

export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ============================================
    // PROPERTY ANALYTICS
    // ============================================

    /**
     * Get property overview statistics
     */
    getPropertyOverview: builder.query<
      AnalyticsResponse<PropertyOverviewResponse>,
      AnalyticsQueryParams
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            if (Array.isArray(value)) {
              value.forEach((v) => queryParams.append(key, v.toString()));
            } else if (typeof value === "boolean") {
              queryParams.append(key, value.toString());
            } else {
              queryParams.append(key, value.toString());
            }
          }
        });

        return `/analytics/properties/overview?${queryParams.toString()}`;
      },
      providesTags: ["PropertyAnalytics"],
    }),

    /**
     * Get property trends over time
     */
    getPropertiesOverTime: builder.query<
      AnalyticsResponse<TimeSeriesData[]>,
      AnalyticsQueryParams & { interval: "daily" | "weekly" | "monthly" }
    >({
      query: (params) => {
        const { interval, ...filters } = params;
        const queryParams = new URLSearchParams();

        queryParams.append("interval", interval);
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            if (Array.isArray(value)) {
              value.forEach((v) => queryParams.append(key, v.toString()));
            } else {
              queryParams.append(key, value.toString());
            }
          }
        });

        return `/analytics/properties/over-time?${queryParams.toString()}`;
      },
      providesTags: ["PropertyAnalytics"],
    }),

    /**
     * Get distribution of property types
     */
    getPropertyTypeDistribution: builder.query<
      AnalyticsResponse<PropertyTypeDistributionResponse[]>,
      AnalyticsQueryParams
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            if (Array.isArray(value)) {
              value.forEach((v) => queryParams.append(key, v.toString()));
            } else {
              queryParams.append(key, value.toString());
            }
          }
        });

        return `/analytics/properties/type-distribution?${queryParams.toString()}`;
      },
      providesTags: ["PropertyAnalytics"],
    }),

    // ============================================
    // LEAD ANALYTICS
    // ============================================

    /**
     * Get lead overview statistics
     */
    getLeadOverview: builder.query<
      AnalyticsResponse<LeadOverviewResponse>,
      AnalyticsQueryParams
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            if (Array.isArray(value)) {
              value.forEach((v) => queryParams.append(key, v.toString()));
            } else {
              queryParams.append(key, value.toString());
            }
          }
        });

        return `/analytics/leads/overview?${queryParams.toString()}`;
      },
      providesTags: ["LeadAnalytics"],
    }),

    /**
     * Get lead breakdown by source
     */
    getLeadSources: builder.query<
      AnalyticsResponse<LeadSourcesResponse>,
      AnalyticsQueryParams
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            if (Array.isArray(value)) {
              value.forEach((v) => queryParams.append(key, v.toString()));
            } else {
              queryParams.append(key, value.toString());
            }
          }
        });

        return `/analytics/leads/sources?${queryParams.toString()}`;
      },
      providesTags: ["LeadAnalytics"],
    }),

    /**
     * Get lead trends over time
     */
    getLeadsOverTime: builder.query<
      AnalyticsResponse<TimeSeriesData[]>,
      AnalyticsQueryParams & { interval: "daily" | "weekly" | "monthly" }
    >({
      query: (params) => {
        const { interval, ...filters } = params;
        const queryParams = new URLSearchParams();

        queryParams.append("interval", interval);
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            if (Array.isArray(value)) {
              value.forEach((v) => queryParams.append(key, v.toString()));
            } else {
              queryParams.append(key, value.toString());
            }
          }
        });

        return `/analytics/leads/over-time?${queryParams.toString()}`;
      },
      providesTags: ["LeadAnalytics"],
    }),

    // ============================================
    // CONVERSION ANALYTICS
    // ============================================

    /**
     * Get conversion metrics
     */
    getConversionMetrics: builder.query<
      AnalyticsResponse<ConversionMetricsResponse>,
      AnalyticsQueryParams
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            if (Array.isArray(value)) {
              value.forEach((v) => queryParams.append(key, v.toString()));
            } else {
              queryParams.append(key, value.toString());
            }
          }
        });

        return `/analytics/conversions?${queryParams.toString()}`;
      },
      providesTags: ["ConversionAnalytics"],
    }),

    // ============================================
    // REVENUE ANALYTICS
    // ============================================

    /**
     * Get revenue metrics
     */
    getRevenueMetrics: builder.query<
      AnalyticsResponse<RevenueMetricsResponse>,
      AnalyticsQueryParams
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            if (Array.isArray(value)) {
              value.forEach((v) => queryParams.append(key, v.toString()));
            } else {
              queryParams.append(key, value.toString());
            }
          }
        });

        return `/analytics/revenue?${queryParams.toString()}`;
      },
      providesTags: ["RevenueAnalytics"],
    }),

    // ============================================
    // PERFORMANCE ANALYTICS
    // ============================================

    /**
     * Get agent performance metrics
     */
    getAgentPerformance: builder.query<
      AnalyticsResponse<AgentPerformanceResponse[]>,
      AnalyticsQueryParams & { limit?: number }
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        const { limit = 10, ...filters } = params;

        queryParams.append("limit", limit.toString());
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            if (Array.isArray(value)) {
              value.forEach((v) => queryParams.append(key, v.toString()));
            } else {
              queryParams.append(key, value.toString());
            }
          }
        });

        return `/analytics/performance/agents?${queryParams.toString()}`;
      },
      providesTags: ["PerformanceAnalytics"],
    }),

    // ============================================
    // TOP LISTS
    // ============================================

    /**
     * Get top performing properties
     */
    getTopProperties: builder.query<
      AnalyticsResponse<TopPropertiesResponse[]>,
      AnalyticsQueryParams & {
        limit?: number;
        by?: "views" | "inquiries" | "favorites";
      }
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        const { limit = 10, by = "views", ...filters } = params;

        queryParams.append("limit", limit.toString());
        queryParams.append("by", by);

        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            if (Array.isArray(value)) {
              value.forEach((v) => queryParams.append(key, v.toString()));
            } else {
              queryParams.append(key, value.toString());
            }
          }
        });

        return `/analytics/top/properties?${queryParams.toString()}`;
      },
      providesTags: ["TopLists"],
    }),

    /**
     * Get top cities by property activity
     */
    getTopCities: builder.query<
      AnalyticsResponse<TopCitiesResponse[]>,
      AnalyticsQueryParams & { limit?: number }
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        const { limit = 10, ...filters } = params;

        queryParams.append("limit", limit.toString());
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            if (Array.isArray(value)) {
              value.forEach((v) => queryParams.append(key, v.toString()));
            } else {
              queryParams.append(key, value.toString());
            }
          }
        });

        return `/analytics/top/cities?${queryParams.toString()}`;
      },
      providesTags: ["TopLists"],
    }),

    // ============================================
    // TRAFFIC & ENGAGEMENT
    // ============================================

    /**
     * Get traffic breakdown by location
     */
    getTrafficByLocation: builder.query<
      AnalyticsResponse<TrafficByLocationResponse[]>,
      AnalyticsQueryParams
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            if (Array.isArray(value)) {
              value.forEach((v) => queryParams.append(key, v.toString()));
            } else {
              queryParams.append(key, value.toString());
            }
          }
        });

        return `/analytics/traffic/location?${queryParams.toString()}`;
      },
      providesTags: ["TrafficAnalytics"],
    }),

    // ============================================
    // EXPORT
    // ============================================

    /**
     * Export analytics data
     */
    exportAnalyticsReport: builder.mutation<Blob, ExportReportRequest>({
      query: (exportRequest) => {
        const { format, type, filters } = exportRequest;
        const queryParams = new URLSearchParams();

        queryParams.append("format", format);
        queryParams.append("type", type);

        // Add filter parameters
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            if (Array.isArray(value)) {
              queryParams.append(key, value.join(","));
            } else if (typeof value === "boolean") {
              queryParams.append(key, value.toString());
            } else if (value instanceof Date) {
              queryParams.append(key, value.toISOString());
            } else {
              queryParams.append(key, value.toString());
            }
          }
        });

        return {
          url: `/analytics/export?${queryParams.toString()}`,
          method: "GET",
          responseHandler: (response) => response.blob(),
          cache: "no-cache",
        };
      },
      invalidatesTags: ["Export"],
    }),

    // ============================================
    // DASHBOARD
    // ============================================

    /**
     * Get comprehensive dashboard summary
     */
    getDashboardSummary: builder.query<
      AnalyticsResponse<DashboardSummary>,
      AnalyticsQueryParams
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            if (Array.isArray(value)) {
              value.forEach((v) => queryParams.append(key, v.toString()));
            } else {
              queryParams.append(key, value.toString());
            }
          }
        });

        return `/analytics/dashboard?${queryParams.toString()}`;
      },
      providesTags: ["Dashboard"],
    }),

    // ============================================
    // COMPARISON ANALYTICS
    // ============================================

    /**
     * Compare analytics between two periods
     */
    comparePeriods: builder.query<
      {
        current: AnalyticsResponse<any>;
        previous: AnalyticsResponse<any>;
        comparison: {
          change: number;
          trend: "up" | "down" | "stable";
        };
      },
      {
        type: "properties" | "leads" | "revenue" | "conversions";
        currentPeriod: AnalyticsQueryParams;
        previousPeriod: AnalyticsQueryParams;
      }
    >({
      queryFn: async (arg, _queryApi, _extraOptions, baseQuery) => {
        const [currentResult, previousResult] = await Promise.all([
          baseQuery({
            url: getEndpointByType(arg.type),
            params: arg.currentPeriod,
          }),
          baseQuery({
            url: getEndpointByType(arg.type),
            params: arg.previousPeriod,
          }),
        ]);

        if (currentResult.error || previousResult.error) {
          return {
            error: (currentResult.error ??
              previousResult.error) as FetchBaseQueryError,
          };
        }

        const current = currentResult.data as AnalyticsResponse<any>;
        const previous = previousResult.data as AnalyticsResponse<any>;

        const currentValue = getTotalValue(current);
        const previousValue = getTotalValue(previous);

        const change =
          previousValue !== 0
            ? ((currentValue - previousValue) / previousValue) * 100
            : currentValue > 0
              ? 100
              : 0;

        return {
          data: {
            current,
            previous,
            comparison: {
              change,
              trend: change > 0 ? "up" : change < 0 ? "down" : "stable",
            },
          },
        };
      },

      providesTags: ["Comparison"],
    }),
  }),
});

// Helper functions for comparePeriods
function getEndpointByType(type: string): string {
  const endpoints = {
    properties: "/analytics/properties/overview",
    leads: "/analytics/leads/overview",
    revenue: "/analytics/revenue",
    conversions: "/analytics/conversions",
  };
  return endpoints[type as keyof typeof endpoints] || endpoints.properties;
}

function getTotalValue(data: AnalyticsResponse<any>): number {
  // Extract total value based on response structure
  if (data.data && typeof data.data === "object") {
    if (
      "total" in data.data &&
      typeof data.data.total === "object" &&
      "total" in data.data.total
    ) {
      return data.data.total.total || 0;
    }
    if ("total" in data.data) {
      return typeof data.data.total === "number" ? data.data.total : 0;
    }
  }
  return data.meta?.total || 0;
}

// ============================================
// EXPORT HOOKS
// ============================================

export const {
  // Property Analytics
  useGetPropertyOverviewQuery,
  useLazyGetPropertyOverviewQuery,
  useGetPropertiesOverTimeQuery,
  useLazyGetPropertiesOverTimeQuery,
  useGetPropertyTypeDistributionQuery,
  useLazyGetPropertyTypeDistributionQuery,

  // Lead Analytics
  useGetLeadOverviewQuery,
  useLazyGetLeadOverviewQuery,
  useGetLeadSourcesQuery,
  useLazyGetLeadSourcesQuery,
  useGetLeadsOverTimeQuery,
  useLazyGetLeadsOverTimeQuery,

  // Conversion Analytics
  useGetConversionMetricsQuery,
  useLazyGetConversionMetricsQuery,

  // Revenue Analytics
  useGetRevenueMetricsQuery,
  useLazyGetRevenueMetricsQuery,

  // Performance Analytics
  useGetAgentPerformanceQuery,
  useLazyGetAgentPerformanceQuery,

  // Top Lists
  useGetTopPropertiesQuery,
  useLazyGetTopPropertiesQuery,
  useGetTopCitiesQuery,
  useLazyGetTopCitiesQuery,

  // Traffic & Engagement
  useGetTrafficByLocationQuery,
  useLazyGetTrafficByLocationQuery,

  // Export
  useExportAnalyticsReportMutation,

  // Dashboard
  useGetDashboardSummaryQuery,
  useLazyGetDashboardSummaryQuery,

  // Comparison
  useComparePeriodsQuery,
  useLazyComparePeriodsQuery,
} = analyticsApi;
