// ============================================
// CATEGORIES & CONFIGURATION
// ============================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  subCategories: SubCategory[];
}

export interface SubCategory {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Location {
  id: string;
  city: string;
  state?: string;
  country: string;
  locality: string;
  isActive: boolean;
  createdAt: Date;
}
