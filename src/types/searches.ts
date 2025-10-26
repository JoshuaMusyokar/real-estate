// ============================================
// SAVED SEARCHES & PROPERTIES
// ============================================

import type { Property } from "./property";
import type { User } from "./user";

export interface SavedSearch {
  id: string;
  userId: string;
  name?: string;
  filters: any;
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
