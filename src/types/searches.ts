// ============================================
// SAVED SEARCHES & PROPERTIES
// ============================================

import type { Property } from "./property";
import type { User } from "./user";

export type FilterValue = string | number | boolean | null;

export interface SavedSearchFilters {
  [key: string]: FilterValue | FilterValue[] | SavedSearchFilters;
}

export interface SavedSearch {
  id: string;
  userId: string;
  name?: string;
  filters: SavedSearchFilters;
  notifyOnNew: boolean;
  createdAt: Date;
  user: User;
}

export interface SavedProperty {
  id: string;
  userId: string;
  propertyId: string;
  notes?: string;
  createdAt: Date;
  user: User;
  property: Property;
}
