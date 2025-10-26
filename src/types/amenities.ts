import type { Amenity, PropertyAmenity } from "./property";

export interface AmenityCreateRequest {
  name: string;
  icon?: string;
  category?: string;
  order?: number;
  isActive?: boolean;
}

export interface AmenityUpdateRequest {
  name?: string;
  icon?: string;
  category?: string;
  order?: number;
  isActive?: boolean;
}

export interface AmenityResponse {
  success: boolean;
  data: Amenity;
}

export interface AmenitiesResponse {
  success: boolean;
  data: Amenity[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AmenitySearchFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string[];
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PropertyAmenityRequest {
  amenityIds: string[];
}

export interface PropertyAmenityResponse {
  success: boolean;
  data: PropertyAmenity[];
}
