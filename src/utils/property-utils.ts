import {
  Building,
  Building2,
  BuildingIcon,
  Factory,
  Home,
  MapPin,
  Package,
  Store,
  Warehouse,
} from "lucide-react";
import type { PropertyPurpose } from "../types";

export const PROPERTY_TYPES: string[] = [
  "RESIDENTIAL",
  "COMMERCIAL",
  "LAND",
  "INDUSTRIAL",
  "MIXED_USE",
];

export const PROPERTY_PURPOSES: PropertyPurpose[] = ["SALE", "RENT", "LEASE"];

// Icon mapping for property types and subtypes
export const getIconForPropertyType = (name: string) => {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    RESIDENTIAL: Home,
    COMMERCIAL: Building2,
    INDUSTRIAL: Warehouse,
    LAND: MapPin,
    MIXED_USE: BuildingIcon,
  };
  return iconMap[name] || Building;
};

export const getIconForSubType = (name: string) => {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    OFFICE: Building,
    RETAIL: Store,
    WAREHOUSE: Package,
    SHOWROOM: Building2,
    RESTAURANT: Store,
    SHOP: Store,
    APARTMENT: Home,
    VILLA: Home,
    HOUSE: Home,
    FLAT: Home,
    STUDIO: Home,
    PENTHOUSE: Home,
    DUPLEX: Home,
    TOWNHOUSE: Home,
    PLOT: MapPin,
    AGRICULTURAL: MapPin,
    INDUSTRIAL_LAND: MapPin,
    FACTORY: Factory,
    MANUFACTURING: Factory,
  };
  return iconMap[name] || Building;
};
