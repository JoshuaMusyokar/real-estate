// ============================================
// ANALYTICS & REPORTING
// ============================================

import type { User } from "./user";

export interface AgentPerformance {
  id: string;
  userId: string;
  totalLeadsAssigned: number;
  totalLeadsClosed: number;
  activeLeads: number;
  conversionRate: number;
  averageResponseTime: number;
  appointmentsScheduled: number;
  appointmentsCompleted: number;
  noShowRate: number;
  totalRevenue: number;
  averageDealSize: number;
  averageSalesCycle: number;
  lastCalculatedAt: Date;
  user: User;
}

export interface PageView {
  id: string;
  propertyId?: string;
  pageUrl: string;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
  sessionId?: string;
  userId?: string;
  createdAt: Date;
}
// ANALYTICS=======================
export interface TimeRangeFilter {
  startDate: Date | string;
  endDate: Date | string;
  period?: "today" | "7d" | "30d" | "90d" | "1y" | "custom";
}

export interface LocationFilter {
  cityIds?: string[];
  localityIds?: string[];
}

// ============================================
// ANALYTICS FILTER TYPES
// ============================================

export interface PropertyAnalyticsFilter
  extends TimeRangeFilter, LocationFilter {
  status?: string[];
  propertyType?: string[];
  subType?: string[];
  featured?: boolean;
}

export interface LeadAnalyticsFilter extends TimeRangeFilter, LocationFilter {
  sources?: string[];
  stages?: string[];
  assignedTo?: string[];
}

// ============================================
// METRICS TYPES
// ============================================

export interface PerformanceMetrics {
  total: number;
  change?: number;
  trend?: "up" | "down" | "stable";
}

export interface PropertyStatusMetrics {
  total: PerformanceMetrics;
  active: PerformanceMetrics;
  pending: PerformanceMetrics;
  rejected: PerformanceMetrics;
  featured: PerformanceMetrics;
}

export interface LeadSourceMetrics {
  [key: string]: PerformanceMetrics;
}

export interface ConversionMetrics {
  leads: PerformanceMetrics;
  appointments: PerformanceMetrics;
  closed: PerformanceMetrics;
  conversionRates: {
    leadToAppointment: number;
    appointmentToClosed: number;
    leadToClosed: number;
  };
}

export interface RevenueMetrics {
  total: PerformanceMetrics;
  averageDealSize: PerformanceMetrics;
  dealsClosed: PerformanceMetrics;
}

// ============================================
// DATA STRUCTURE TYPES
// ============================================

export interface TimeSeriesData {
  date: string;
  value: number;
}

export interface TopItem {
  id: string;
  name: string;
  value: number;
  change?: number;
  location?: string;
}

export interface AgentPerformance {
  agentId: string;
  agentName: string;
  leadsAssigned: number;
  leadsConverted: number;
  conversionRate: number;
  appointmentsScheduled: number;
  appointmentsCompleted: number;
  averageResponseTime: number;
  revenue: number;
}

// ============================================
// RESPONSE TYPES
// ============================================

export interface AnalyticsResponse<T> {
  data: T;
  meta: {
    period: string;
    total: number;
    filters?: {
      startDate: Date;
      endDate: Date;
      cityIds?: string[];
      localityIds?: string[];
      [key: string]: any;
    };
  };
}

// ============================================
// USER
// ============================================

export interface UserCity {
  id: string;
  userId: string;
  cityId: string;
  city?: {
    id: string;
    name: string;
  };
}

export interface UserLocality {
  id: string;
  userId: string;
  localityId: string;
  locality?: {
    id: string;
    name: string;
  };
}

// ============================================
// EXPORT TYPES
// ============================================

export type ExportFormat = "csv" | "excel" | "pdf" | "json";
export type ReportType = "properties" | "leads" | "performance";

export interface ExportAnalyticsRequest {
  format: ExportFormat;
  type: ReportType;
  filters: PropertyAnalyticsFilter | LeadAnalyticsFilter;
}

// ============================================
// DASHBOARD TYPES
// ============================================

export interface DashboardSummary {
  properties: PropertyStatusMetrics;
  leads: {
    total: PerformanceMetrics;
    newLeads: PerformanceMetrics;
    contacted: PerformanceMetrics;
    qualified?: PerformanceMetrics;
    closed: PerformanceMetrics;
    conversionRate: {
      rate: number;
      change?: number;
    };
  };
  conversions: ConversionMetrics;
  revenue: RevenueMetrics;
  topProperties: TopItem[];
}

// ============================================
// TRAFFIC & ENGAGEMENT TYPES
// ============================================

export interface TrafficByLocation {
  city: string;
  properties: number;
  views: number;
  inquiries: number;
}

export interface PropertyTypeDistribution {
  type: string;
  count: number;
}

// ============================================
// COMPARISON TYPES
// ============================================

export interface PeriodComparison {
  current: number;
  previous: number;
  change: number;
  trend: "up" | "down" | "stable";
}

// ============================================
// FILTER VALIDATION TYPES
// ============================================

export interface FilterValidation {
  isValid: boolean;
  errors?: string[];
}

// ============================================
// PAGINATION TYPES
// ============================================

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// export interface PaginatedResponse<T> {
//   data: T[];
//   pagination: {
//     page: number;
//     limit: number;
//     total: number;
//     totalPages: number;
//   };
// }
// ============================================
// REQUEST TYPES
// ============================================

export interface AnalyticsQueryParams
  extends Partial<TimeRangeFilter>, Partial<LocationFilter> {
  period?: AnalyticsPeriod;
  interval?: "daily" | "weekly" | "monthly";
  limit?: number;
  by?: "views" | "inquiries" | "favorites";
  sources?: string[];
  stages?: string[];
  assignedTo?: string[];
  status?: string[];
  propertyType?: string[];
  subType?: string[];
  featured?: boolean;
  startDate?: string; // ISO string for custom period
  endDate?: string; // ISO string for custom period
  cityIds?: string[];
  localityIds?: string[];
}

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

export type AnalyticsPeriod = "today" | "7d" | "30d" | "90d" | "1y" | "custom";
export type AnalyticsInterval = "monthly" | "daily" | "weekly";

export type ConversionMetricsResponse = ConversionMetrics;
export type RevenueMetricsResponse = RevenueMetrics;
export type AgentPerformanceResponse = AgentPerformance;
export type TopPropertiesResponse = TopItem;
export type TopCitiesResponse = TopItem;
export type TrafficByLocationResponse = TrafficByLocation;
export type PropertyTypeDistributionResponse = PropertyTypeDistribution;
