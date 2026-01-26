// ============================================
// PROPERTY MANAGEMENT
// ============================================

import type { City, ResCity } from "./location";

export type PropertyTypeold =
  | "RESIDENTIAL"
  | "COMMERCIAL"
  | "LAND"
  | "INDUSTRIAL"
  | "MIXED_USE";

export type PropertySubTypeold =
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
export type OwnershipType =
  | "FREEHOLD"
  | "LEASEHOLD"
  | "CO_OPERATIVE"
  | "POWER_OF_ATTORNEY";
export type StorageType = "COLD_STORAGE" | "WAREHOUSE";

export type IndustryType = "FACTORY" | "MANUFACTURING";
export interface PropertyType {
  id: string;
  name: string; // e.g., "RESIDENTIAL", "COMMERCIAL", "LAND", "INDUSTRIAL", "MIXED_USE"
  description: string | null;
  icon: string | null;
  subTypes?: PropertySubType[];
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PropertySubType {
  id: string;
  propertyTypeId: string;
  propertyType: PropertyType;
  name: string; // e.g., "APARTMENT", "VILLA", "HOUSE", "OFFICE", "SHOP", "PLOT"
  description: string | null;
  icon: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type PropertyPurpose = "SALE" | "RENT" | "LEASE" | "PG";
// TODO: edit the city type to match the location service

export interface NearbyPlace {
  name: string;
  distance: string; // e.g., "500m", "1.2km"
  category: string; // e.g., "School", "Hospital", "Mall", "Metro"
  icon: string | null;
}
export interface Property {
  // Basic Information
  id: string;
  title: string;
  description: string;
  propertyTypeId: string;
  propertyType: PropertyType;
  subTypeId: string | null;
  subType: PropertySubType | null;
  purpose: PropertyPurpose;
  status: PropertyStatus;
  builderName: string | null;
  hasBalcony: boolean;
  reraNumber: string | null;

  // Pricing
  price: number;
  priceNegotiable: boolean;
  currency: string;
  stampDutyExcluded: boolean;
  pricePerUnit: number | null; // Auto-calculated
  maintenanceCharges: number | null;
  securityDeposit: number | null;
  monthlyRent: number | null;
  leasePeriod: string | null;

  // Location
  address: string;
  complexName: string | null;
  cityId: string;
  city: ResCity;
  locality: string;
  state: string | null;
  country: string;
  zipCode: string | null;
  latitude: number | null;
  longitude: number | null;

  // Area Measurements (with units)
  carpetArea: number | null;
  carpetAreaUnit: string | null;
  builtUpArea: number | null;
  builtUpAreaUnit: string | null;
  superBuiltArea: number | null;
  superBuiltAreaUnit: string | null;
  plotArea: number | null;
  plotAreaUnit: string | null;

  // Legacy area fields
  squareFeet: number | null;
  squareMeters: number | null;

  // Residential Details
  bedrooms: number | null;
  bathrooms: number | null;
  balconies: number | null;
  furnishingStatus: string | null;
  floorNumber: number | null; // Which floor
  totalFloors: number | null; // Total floors in building
  floors: number | null; // Floors in this property (villa/house)
  totalFlats: number | null;
  totalBuildings: number | null;
  yearBuilt: number | null;

  // Possession
  possessionStatus: string | null;
  possessionDate: Date | null;

  // Parking & Lifts
  coveredParking: number | null;
  openParking: number | null;
  publicParking: number | null;
  passengerLifts: number | null;
  serviceLifts: number | null;

  // Commercial Office Specific
  projectName: string | null;
  locatedWithin: string | null;
  officeType: string | null;
  officesPerFloor: number | null;
  officesInProject: number | null;
  buildingsInProject: number | null;
  cabins: number | null;
  seats: number | null;
  privateWashrooms: number | null;
  publicWashrooms: number | null;
  conferenceRooms: boolean;
  receptionArea: boolean;
  meetingRooms: number | null;
  pantryType: string | null;
  preRented: boolean;
  nocCertified: boolean;
  occupancyCertified: boolean;

  // Land/Plot Specific
  plotDimensions: string | null;
  boundaryWall: boolean;
  cornerPlot: boolean;
  facingDirection: string | null;
  zoningType: string | null;
  clearTitle: boolean;
  developmentStatus: string | null;
  roadWidth: string | null;
  electricityAvailable: boolean;
  waterConnection: boolean;
  sewageConnection: boolean;

  // Warehouse/Industrial Specific
  ceilingHeight: string | null;
  loadingDocks: number | null;
  powerLoad: string | null;
  flooringType: string | null;
  coveredArea: number | null;
  openArea: number | null;

  // Features & Media
  featured: boolean;
  verified: boolean;
  youtubeVideoUrl: string | null;
  virtualTourUrl: string | null;
  nearbyPlaces: NearbyPlace[] | null; // Array of nearby places

  // Owner Information
  ownerId: string;
  ownerEmail: string;
  ownerPhone: string;
  ownerName: string;

  // Advertiser Information
  postedBy: string; // "OWNER", "AGENT", "DEVELOPER"
  advertiserName: string | null;
  advertiserReraNumber: string | null;
  advertiserGstNumber: string | null;
  postedDate: Date;

  // Review Information
  submittedAt: Date;
  reviewedAt: Date | null;
  reviewedBy: string | null;
  rejectionReason: string | null;

  // SEO
  slug: string;
  metaTitle: string | null;
  metaDescription: string | null;

  // Statistics
  viewCount: number;
  inquiryCount: number;
  shareCount: number;
  // Legal & Ownership
  ownershipType: OwnershipType | null;
  approvedBy: string | null;
  legalDispute: boolean;
  encumbranceFree: boolean;

  // Rent / Tenancy
  preferredTenants: string[] | null;
  rentEscalation: number | null;

  // Media
  brochureAvailable: boolean;
  floorPlanAvailable: boolean;

  // Retail / Commercial
  cornerLocation: boolean;
  locatedIn: string | null;
  frontageWidth: number | null;
  mainRoadFacing: boolean;
  displayWindows: boolean;
  idealFor: string[] | null;
  fireSafetyApproved: boolean;
  industryType: IndustryType | null;

  // Structural / Industrial
  dockHeight: number | null;
  openSides: number | null;
  storageType: StorageType | null;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;

  // Optional Relations (when included)
  images: PropertyImage[];
  documents?: PropertyDocument[];
  amenities?: PropertyAmenity[];
}

export interface PropertyImage {
  id: string;
  propertyId: string;
  url: string;
  caption: string | null;
  key: string | null;
  isFloorPlan: boolean | null;
  order: number;
  isCover: boolean;
  viewableUrl: string;
  createdAt: Date;
}

export interface PropertyDocument {
  id: string;
  propertyId: string;
  name: string;
  url: string;
  type: string;
  size: number;
  viewableUrl: string;
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

export interface PropertyCreateRequest {
  // Basic Information
  title: string;
  description: string;
  propertyTypeId: string;
  subTypeId: string | null;
  purpose: PropertyPurpose;
  status?: PropertyStatus; // Optional, defaults to UNDER_REVIEW
  builderName: string | null;
  hasBalcony: boolean;
  reraNumber: string | null;

  // Pricing
  price: number;
  priceNegotiable: boolean;
  currency?: string; // Optional, defaults to USD
  stampDutyExcluded?: boolean;
  maintenanceCharges: number | null;
  securityDeposit: number | null;
  monthlyRent: number | null;
  pricePerUnit: number | null;
  leasePeriod: string | null;

  // Location
  address: string;
  cityId: string;
  locality: string;
  complexName: string | null;
  state: string | null;
  country: string;
  zipCode: string | null;
  latitude: number | null;
  longitude: number | null;

  // Area Measurements
  carpetArea: number | null;
  carpetAreaUnit: string | null;
  builtUpArea: number | null;
  builtUpAreaUnit: string | null;
  superBuiltArea: number | null;
  superBuiltAreaUnit: string | null;
  plotArea: number | null;
  plotAreaUnit: string | null;
  squareFeet: number | null;
  squareMeters: number | null;

  // Residential Details
  bedrooms: number | null;
  bathrooms: number | null;
  balconies: number | null;
  furnishingStatus: string | null;
  floorNumber: number | null;
  totalFloors: number | null;
  floors: number | null;
  totalFlats: number | null;
  totalBuildings: number | null;
  yearBuilt: number | null;

  // Possession
  possessionStatus: string | null;
  possessionDate: Date | null;

  // Parking & Lifts
  coveredParking: number | null;
  openParking: number | null;
  publicParking: number | null;
  passengerLifts: number | null;
  serviceLifts: number | null;

  // Commercial Office Specific
  projectName: string | null;
  locatedWithin: string | null;
  officeType: string | null;
  officesPerFloor: number | null;
  officesInProject: number | null;
  buildingsInProject: number | null;
  cabins: number | null;
  seats: number | null;
  privateWashrooms: number | null;
  publicWashrooms: number | null;
  conferenceRooms?: boolean;
  receptionArea?: boolean;
  meetingRooms: number | null;
  pantryType: string | null;
  preRented?: boolean;
  nocCertified?: boolean;
  occupancyCertified?: boolean;

  // Land/Plot Specific
  plotDimensions: string | null;
  boundaryWall?: boolean;
  cornerPlot?: boolean;
  facingDirection: string | null;
  zoningType: string | null;
  clearTitle?: boolean;
  developmentStatus: string | null;
  roadWidth: string | null;
  electricityAvailable?: boolean;
  waterConnection?: boolean;
  sewageConnection?: boolean;

  // Warehouse/Industrial Specific
  ceilingHeight: string | null;
  loadingDocks: number | null;
  powerLoad: string | null;
  flooringType: string | null;
  coveredArea: number | null;
  openArea: number | null;

  // Legal & Ownership
  ownershipType: OwnershipType | null;
  approvedBy: string | null;
  legalDispute: boolean;
  encumbranceFree: boolean;

  // Rent / Tenancy
  preferredTenants: string[] | null;
  rentEscalation: number | null;

  // Media
  brochureAvailable: boolean;
  floorPlanAvailable: boolean;

  // Retail / Commercial
  cornerLocation: boolean;
  locatedIn: string | null;
  frontageWidth: number | null;
  mainRoadFacing: boolean;
  displayWindows: boolean;
  idealFor: string[] | null;
  fireSafetyApproved: boolean;
  industryType: IndustryType | null;

  // Structural / Industrial
  dockHeight: number | null;
  openSides: number | null;
  storageType: StorageType | null;

  // Features & Media
  youtubeVideoUrl: string | null;
  virtualTourUrl: string | null;
  nearbyPlaces: NearbyPlace[] | null;

  // Related Data
  amenities: string[] | null; // Array of amenity IDs
  images: PropertyImageInput[] | null;
}

export interface PropertyUpdateRequest {
  // All fields optional for updates
  title?: string;
  description?: string;
  propertyTypeId?: string;
  subTypeId?: string | null;
  purpose?: PropertyPurpose;
  status?: PropertyStatus;
  builderName?: string | null;
  hasBalcony?: boolean;
  reraNumber?: string | null;
  pricePerUnit?: number | null;

  // Pricing
  price?: number;
  priceNegotiable?: boolean;
  currency?: string;
  stampDutyExcluded?: boolean;
  maintenanceCharges?: number | null;
  securityDeposit?: number | null;
  monthlyRent?: number | null;
  leasePeriod?: string | null;

  // Location
  address?: string;
  cityId?: string;
  locality?: string;
  complexName?: string | null;
  state?: string | null;
  country?: string;
  zipCode?: string | null;
  latitude?: number | null;
  longitude?: number | null;

  // Area Measurements
  carpetArea?: number | null;
  carpetAreaUnit?: string | null;
  builtUpArea?: number | null;
  builtUpAreaUnit?: string | null;
  superBuiltArea?: number | null;
  superBuiltAreaUnit?: string | null;
  plotArea?: number | null;
  plotAreaUnit?: string | null;
  squareFeet?: number | null;
  squareMeters?: number | null;

  // Residential Details
  bedrooms?: number | null;
  bathrooms?: number | null;
  balconies?: number | null;
  furnishingStatus?: string | null;
  floorNumber?: number | null;
  totalFloors?: number | null;
  floors?: number | null;
  totalFlats?: number | null;
  totalBuildings?: number | null;
  yearBuilt?: number | null;

  // Possession
  possessionStatus?: string | null;
  possessionDate?: Date | null;

  // Parking & Lifts
  coveredParking?: number | null;
  openParking?: number | null;
  publicParking?: number | null;
  passengerLifts?: number | null;
  serviceLifts?: number | null;

  // Commercial Office Specific
  projectName?: string | null;
  locatedWithin?: string | null;
  officeType?: string | null;
  officesPerFloor?: number | null;
  officesInProject?: number | null;
  buildingsInProject?: number | null;
  cabins?: number | null;
  seats?: number | null;
  privateWashrooms?: number | null;
  publicWashrooms?: number | null;
  conferenceRooms?: boolean;
  receptionArea?: boolean;
  meetingRooms?: number | null;
  pantryType?: string | null;
  preRented?: boolean;
  nocCertified?: boolean;
  occupancyCertified?: boolean;

  // Land/Plot Specific
  plotDimensions?: string | null;
  boundaryWall?: boolean;
  cornerPlot?: boolean;
  facingDirection?: string | null;
  zoningType?: string | null;
  clearTitle?: boolean;
  developmentStatus?: string | null;
  roadWidth?: string | null;
  electricityAvailable?: boolean;
  waterConnection?: boolean;
  sewageConnection?: boolean;

  // Warehouse/Industrial Specific
  ceilingHeight?: string | null;
  loadingDocks?: number | null;
  powerLoad?: string | null;
  flooringType?: string | null;
  coveredArea?: number | null;
  openArea?: number | null;
  industryType: IndustryType | null;
  // Legal & Ownership
  ownershipType?: OwnershipType | null;
  approvedBy?: string | null;
  legalDispute?: boolean;
  encumbranceFree?: boolean;

  // Rent / Tenancy
  preferredTenants?: string[] | null;
  rentEscalation?: number | null;

  // Media
  brochureAvailable?: boolean;
  floorPlanAvailable?: boolean;

  // Retail / Commercial
  cornerLocation?: boolean;
  locatedIn?: string | null;
  frontageWidth?: number | null;
  mainRoadFacing?: boolean;
  displayWindows?: boolean;
  idealFor?: string[] | null;
  fireSafetyApproved?: boolean;

  // Structural / Industrial
  dockHeight?: number | null;
  openSides?: number | null;
  storageType?: StorageType | null;

  // Features & Media
  youtubeVideoUrl?: string | null;
  virtualTourUrl?: string | null;
  nearbyPlaces?: NearbyPlace[] | null;

  // Related Data
  amenities: string[] | null;
  images: PropertyImageInput[] | null;
}

export interface PropertyImageInput {
  url: string;
  order: number | null;
  caption: string | null;
  isFloorPlan: boolean | null;
  key: string | null;
  isCover: boolean | null;
}

export interface PropertyResponse {
  success: boolean;
  data: Property & {
    images?: PropertyImage[];
    documents?: PropertyDocument[];
    amenities?: PropertyAmenity[];
    owner?: OwnerInfo;
  };
}
export interface OwnerInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
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
  propertyType?: string | string[]; // Can be enum string or PropertyTypeModel ID
  propertyTypeId?: string | string[]; // Explicit ID filter
  subType?: string | string[]; // Can be enum string or PropertySubTypeModel ID
  subTypeId?: string | string[]; // Explicit ID filter
  purpose?: PropertyPurpose;
  possessionStatus?: string;
  status?: PropertyStatus;
  cityId?: string;
  city?: string[];
  locality?: string[];
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number[];
  bathrooms?: number[];
  minSquareFeet?: number;
  maxSquareFeet?: number;
  listingSource?: string | string[];
  amenities?: string[];
  featured?: boolean;
  localityId?: string;
  hasBalcony?: boolean;
  verified?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";

  // New fields for commercial properties
  furnishingStatus?: string; // "FURNISHED", "SEMI_FURNISHED", "UNFURNISHED"
  facingDirection?: string; // "NORTH", "SOUTH", "EAST", "WEST", etc.
}
// export interface PropertySearchFilters {
//   page?: number;
//   limit?: number;
//   search?: string;
//   propertyType?: string | string[]; // Can be enum string or PropertyTypeModel ID
//   propertyTypeId?: string | string[]; // Explicit ID filter
//   subType?: string | string[]; // Can be enum string or PropertySubTypeModel ID
//   subTypeId?: string | string[]; // Explicit ID filter
//   purpose?: PropertyPurpose;
//   possessionStatus?: string;
//   status?: PropertyStatus;
//   cityId?: string;
//   city?: string[];
//   locality?: string[];
//   minPrice?: number;
//   maxPrice?: number;
//   bedrooms?: number[];
//   bathrooms?: number[];
//   minSquareFeet?: number;
//   maxSquareFeet?: number;
//   listingSource?: string[];
//   amenities?: string[];
//   featured?: boolean;
//   localityId?: string;
//   hasBalcony?: boolean;
//   verified?: boolean;
//   sortBy?: string;
//   sortOrder?: "asc" | "desc";
// }

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
// New types for property enhancements
export interface SimilarPropertiesResponse {
  data: Array<{
    id: string;
    title: string;
    price: number;
    city: ResCity;
    currency: string;
    locality: string;
    propertyType: PropertyType;
    purpose: string;
    bedrooms?: number;
    bathrooms?: number;
    squareFeet?: number;
    propertyOwnerRole?: string;
    coverImage?: string;
    viewableCoverImage?: string;
    amenities: string[];
    isSaved: boolean;
  }>;
}
export interface CategorizedProperty {
  id: string;
  title: string;
  price: number;
  city: City;
  locality: string;
  slug: string;
  propertyType: PropertyType;
  purpose: "SALE" | "RENT" | "LEASE" | string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  featured: boolean;
  coverImage: string;
  viewableCoverImage: string;
  amenities: string[];
  createdAt: string;
  coveredParking: number | null;
  openParking: number | null;
  publicParking: number | null;
  passengerLifts: number | null;
  serviceLifts: number | null;
  postedBy: string; // "OWNER", "AGENT", "DEVELOPER"
  advertiserName: string | null;
  advertiserReraNumber: string | null;
  advertiserGstNumber: string | null;

  postedDate: Date;
}
export interface CategorizedPropertiesResponse {
  top: CategorizedProperty[];
  featuredBuilders: CategorizedProperty[];
  featuredOwners: CategorizedProperty[];
  featuredAgents: CategorizedProperty[];
  recentlyAdded: CategorizedProperty[];
}

export interface CategorizedPropertiesFilters {
  limit?: number;
  cityId?: string;
  city?: string;
  purpose?: PropertyPurpose;
  propertyTypeId?: string; // NEW: Use ID instead of enum
  propertyTypeName?: string;
}
export interface PropertyImageFile {
  file: File | null;
  url: string | null;
  caption: string | null;
  isFloorPlan: boolean | null;
  key: string | null;
  order: number;
  isCover: boolean;
  preview: string | null;
}

// export interface FavoriteProperty {
//   id: string;
//   property: {
//     id: string;
//     title: string;
//     price: number;
//     city: string;
//     locality: string;
//     coverImage?: string;
//   };
//   savedAt: string;
// }
export interface FavoriteProperty {
  id: string;
  title: string;
  price: string;
  city: string;
  locality: string;
  propertyType: PropertyType;
  purpose: PropertyStatus;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  coverImage: string;
  amenities: string[];
  savedAt: string;
}

export interface FavoritesResponse {
  data: FavoriteProperty[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface FavoriteStatus {
  propertyId: string;
  isFavorite: boolean;
}

export interface FavoriteStatusResponse {
  data: FavoriteStatus[];
}
export interface UserFavoritesResponse {
  data: string[];
}
// Property Type Types

export interface CreatePropertyTypeRequest {
  name: string;
  description?: string;
  icon?: string;
  order?: number;
  isActive?: boolean;
}

export interface UpdatePropertyTypeRequest {
  name?: string;
  description?: string | null;
  icon?: string | null;
  order?: number;
  isActive?: boolean;
}

export interface PropertyTypeResponse {
  success: boolean;
  data: PropertyType;
}

export interface PropertyTypesResponse {
  success: boolean;
  data: PropertyType[];
}

// Property SubType Types
export interface CreatePropertySubTypeRequest {
  propertyTypeId: string;
  name: string;
  description: string | null;
  icon: string | null;
  isActive?: boolean;
}

export interface UpdatePropertySubTypeRequest {
  name?: string;
  description?: string | null;
  icon?: string | null;
  isActive?: boolean;
}

export interface PropertySubTypeResponse {
  success: boolean;
  data: PropertySubType;
}

export interface PropertySubTypesResponse {
  success: boolean;
  data: PropertySubType[];
}
