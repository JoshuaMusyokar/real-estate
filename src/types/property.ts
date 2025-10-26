// ============================================
// PROPERTY MANAGEMENT
// ============================================

export type PropertyType =
  | "RESIDENTIAL"
  | "COMMERCIAL"
  | "LAND"
  | "INDUSTRIAL"
  | "MIXED_USE";

export type PropertySubType =
  | "APARTMENT"
  | "VILLA"
  | "HOUSE"
  | "FLAT"
  | "STUDIO"
  | "PENTHOUSE"
  | "DUPLEX"
  | "TOWNHOUSE"
  | "OFFICE"
  | "SHOP"
  | "WAREHOUSE"
  | "SHOWROOM"
  | "PLOT"
  | "AGRICULTURAL"
  | "INDUSTRIAL_LAND";

export type PropertyStatus =
  | "AVAILABLE"
  | "SOLD"
  | "RENTED"
  | "PENDING"
  | "UNDER_REVIEW"
  | "REJECTED"
  | "DRAFT";

export type PropertyPurpose = "SALE" | "RENT" | "LEASE";

export interface Property {
  id: string;
  title: string;
  description: string;
  propertyType: PropertyType;
  subType: PropertySubType | null;
  purpose: PropertyPurpose;
  status: PropertyStatus;
  price: number;
  priceNegotiable: boolean;
  currency: string;
  address: string;
  city: string;
  locality: string;
  state: string | null;
  country: string | null;
  zipCode: string | null;
  latitude: number | null;
  longitude: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  squareFeet: number | null;
  squareMeters: number | null;
  floors: number | null;
  yearBuilt: number | null;
  furnishingStatus: string | null;
  featured: boolean;
  verified: boolean;
  youtubeVideoUrl: string | null;
  virtualTourUrl: string | null;
  ownerId: string;
  ownerEmail: string;
  ownerPhone: string;
  ownerName: string;
  submittedAt: Date;
  reviewedAt: Date | null;
  reviewedBy: string | null;
  rejectionReason: string | null;
  slug: string;
  metaTitle: string | null;
  metaDescription: string | null;
  viewCount: number;
  inquiryCount: number;
  shareCount: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
  //IMPORTANT! KEEP THIS FOR UI
  images: PropertyImage[];
  documents: PropertyDocument[];
  amenities: PropertyAmenity[];
}

export interface PropertyImage {
  id: string;
  propertyId: string;
  url: string;
  caption: string | null;
  order: number;
  isCover: boolean;
  createdAt: Date;
}

export interface PropertyDocument {
  id: string;
  propertyId: string;
  name: string;
  url: string;
  type: string;
  size: number;
  createdAt: Date;
}

export interface Amenity {
  id: string;
  name: string;
  icon: string | null;
  category: string | null;
  order: number;
  isActive: boolean;
  createdAt: Date;
}
// export interface AmenityUpdateRequest {
//   id: string;
//   name?: string;
//   icon?: string;
//   category?: string;
//   order?: number;
//   isActive?: boolean;
// }

export interface PropertyAmenity {
  id: string;
  propertyId: string;
  amenityId: string;
  amenity: Amenity;
}

export interface PropertyCreateInput {
  title: string;
  description: string;
  propertyType: PropertyType;
  subType?: PropertySubType;
  purpose: PropertyPurpose;
  status?: PropertyStatus;
  price: number;
  priceNegotiable?: boolean;
  currency?: string;
  address: string;
  city: string;
  locality: string;
  state?: string;
  country: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  squareMeters?: number;
  floors?: number;
  yearBuilt?: number;
  furnishingStatus?: string;
  youtubeVideoUrl?: string;
  virtualTourUrl?: string;
  ownerId: string;
  ownerEmail: string;
  ownerPhone: string;
  ownerName: string;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
}
export interface PropertyCreateRequest {
  title: string;
  description: string;
  propertyType: PropertyType;
  subType: PropertySubType | null;
  purpose: PropertyPurpose;
  status: PropertyStatus;
  price: number;
  priceNegotiable: boolean;
  currency: string;
  address: string;
  city: string;
  locality: string;
  state: string | null;
  country: string;
  zipCode: string | null;
  latitude: number | null;
  longitude: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  squareFeet: number | null;
  squareMeters?: number;
  floors: number | null;
  yearBuilt: number | null;
  furnishingStatus: string | null;
  youtubeVideoUrl: string | null;
  virtualTourUrl: string | null;
  amenities: string[] | null; // Array of amenity IDs
  images: PropertyImageInput[] | null;
}

export interface PropertyUpdateRequest {
  title?: string;
  description?: string;
  propertyType?: PropertyType;
  subType?: PropertySubType;
  purpose?: PropertyPurpose;
  status?: PropertyStatus;
  price?: number;
  priceNegotiable?: boolean;
  currency?: string;
  address?: string;
  city?: string;
  locality?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  squareMeters?: number;
  floors?: number;
  yearBuilt?: number;
  furnishingStatus?: string;
  youtubeVideoUrl?: string;
  virtualTourUrl?: string;
  amenities?: string[];
}

export interface PropertyImageInput {
  url: string;
  order?: number;
  isCover?: boolean;
}

export interface PropertyResponse {
  success: boolean;
  data: Property & {
    images?: PropertyImage[];
    documents?: PropertyDocument[];
    amenities?: PropertyAmenity[];
  };
}

export interface PropertiesResponse {
  success: boolean;
  data: Property[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PropertySearchFilters {
  page?: number;
  limit?: number;
  search?: string;
  propertyType?: PropertyType;
  subType?: PropertySubType;
  purpose?: PropertyPurpose;
  status?: PropertyStatus;
  city?: string[];
  locality?: string[];
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number[];
  bathrooms?: number[];
  minSquareFeet?: number;
  maxSquareFeet?: number;
  amenities?: string[];
  featured?: boolean;
  verified?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PropertyStats {
  totalProperties: number;
  availableProperties: number;
  soldProperties: number;
  rentedProperties: number;
  pendingProperties: number;
  totalViews: number;
  totalInquiries: number;
}

export interface PropertyReviewRequest {
  status: PropertyStatus;
  rejectionReason?: string;
}
