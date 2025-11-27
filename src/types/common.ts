// ============================================
// COMMON INTERFACES & UTILITY TYPES
// ============================================

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
export type RecordValue = string | number | boolean | null;

export interface SearchFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  [key: string]: any;
}

export type JSONValue = string | number | boolean | null;

export interface JSONContent {
  [key: string]: JSONValue | JSONValue[] | JSONContent;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
export interface BaseResponse {
  success: boolean;
  message: string;
}
export interface ErrorResponse {
  success: false;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface BulkOperationResponse {
  success: boolean;
  message: string;
  count?: number;
}
export type ViewMode = "grid" | "table";
