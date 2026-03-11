import type { PropertyPurpose } from "./property";

export interface SearchParams {
  cityId?: string;
  cityName?: string;
  localityId?: string | string[];
  localityName?: string | string[];
  searchText?: string;
  propertyType?: string;
  propertyPurpose?: string;
}

export interface SuggestionItem {
  id: string;
  type: "city" | "locality" | "project" | "builder" | "landmark" | "popular";
  name: string;
  displayName: string;
  cityId?: string;
  cityName?: string;
}

export interface SearchComponentProps {
  variant?: "default" | "compact";
  onSearch?: (params: SearchParams) => void;
  initialCity?: string;
  onPurposeChange?: (purpose: PropertyPurpose) => void;
  initialPurpose?: PropertyPurpose;
  onPropertyTypeChange?: (propertyType: string) => void;
  onPropertyPurposeChange?: (propertyPurpose: PropertyPurpose) => void;
  /** Bubble up city changes so the parent (and PublicHeader) stay in sync. */
  onCityChange?: (cityId: string, cityName: string) => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const PURPOSE_OPTIONS = [
  { value: "buy", label: "Buy", propertyType: "RESIDENTIAL" },
  { value: "rent", label: "Rent", propertyType: "RESIDENTIAL" },
  { value: "commercial", label: "Commercial", propertyType: "COMMERCIAL" },
  { value: "pg", label: "PG/Co-living", propertyType: "RESIDENTIAL" },
  { value: "plots", label: "Plots", propertyType: "LAND" },
] as const;

export const COMMERCIAL_SUB_PURPOSES = [
  { value: "buy", label: "Buy" },
  { value: "lease", label: "Lease" },
] as const;

export const POPULAR_SEARCHES = [
  "Apartments",
  "Villas",
  "Builder Floors",
  "Studio Apartments",
  "Premium Apartments",
  "Ready to Move",
  "New Launch",
  "Under Construction",
];

// ─── Pure helpers ─────────────────────────────────────────────────────────────

export function getPropertyTypeFromPurpose(purpose: string): string {
  switch (purpose) {
    case "commercial":
      return "COMMERCIAL";
    case "plots":
      return "LAND";
    default:
      return "RESIDENTIAL";
  }
}

export function getPropertyPurposeFromPurpose(
  purpose: string,
  commercialSub?: string,
): PropertyPurpose {
  if (purpose === "commercial") {
    return (commercialSub === "lease" ? "LEASE" : "SALE") as PropertyPurpose;
  }
  if (purpose === "rent" || purpose === "pg") return "RENT" as PropertyPurpose;
  return "SALE" as PropertyPurpose;
}
