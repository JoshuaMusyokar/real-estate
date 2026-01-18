// import type { ApiResponse, PaginatedResponse } from "./common";

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Media extends BaseEntity {
  filename: string;
  originalName: string;
  url: string;
  path: string;
  mimeType: string;
}

export interface ContentMedia {
  id: string;
  contentId: string;
  mediaId: string;
  media: Media;
  order: number;
  caption?: string;
}

export interface ContentCategory extends BaseEntity {
  name: string;
  description?: string;
  isActive: boolean;
}

export type ContentType =
  | "ARTICLE"
  | "PAGE"
  | "TOOL"
  | "WEB_STORY"
  | "PODCAST"
  | "VIDEO"
  | "MENU_ITEM"
  | "BANNER"
  | "FAQ"
  | "TESTIMONIAL"
  | "PROMOTION";

export type ContentStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED" | "SCHEDULED";

export interface Content extends BaseEntity {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  type: ContentType;
  status: ContentStatus;

  featuredImageId?: string;
  featuredImage?: Media;
  videoUrl?: string;
  audioUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords: string[];

  metadata: Record<string, any>;
  authorId?: string;
  order: number;
  isFeatured: boolean;
  showInMenu: boolean;
  publishedAt?: Date;

  categories: ContentCategory[];
  gallery: ContentMedia[];
  contentMedia: ContentMedia[];
}

// Request Types
export interface CreateMediaRequest {
  file: File;
  folder?: string;
  altText?: string;
}

export interface UpdateMediaRequest {
  altText?: string;
  filename?: string;
}

export interface CreateContentRequest {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  type: ContentType;
  status?: ContentStatus;
  featuredImageId?: string;
  videoUrl?: string;
  audioUrl?: string;
  mediaIds?: string[];
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  metadata?: Record<string, any>;
  order?: number;
  isFeatured?: boolean;
  showInMenu?: boolean;
  categoryIds?: string[];
  publishedAt?: Date;
}

export interface UpdateContentRequest {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  status?: ContentStatus;
  videoUrl?: string;
  audioUrl?: string;
  featuredImageId?: string | null;
  mediaIds?: string[];
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  metadata?: Record<string, any>;
  order?: number;
  isFeatured?: boolean;
  showInMenu?: boolean;
  categoryIds?: string[];
  publishedAt?: Date | null;
}

export interface ContentSearchFilters {
  type?: ContentType;
  status?: ContentStatus;
  categoryId?: string;
  authorId?: string;
  isFeatured?: boolean;
  showInMenu?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
  orderBy?: "createdAt" | "updatedAt" | "publishedAt" | "title" | "order";
  orderDirection?: "asc" | "desc";
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  isActive?: boolean;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  isActive?: boolean;
}

// // Response Types
// export interface ApiResponse<T = any> {
//   success: boolean;
//   data?: T;
//   error?: string;
//   message?: string;
// }

// export interface PaginatedResponse<T> extends ApiResponse<T[]> {
//   pagination: {
//     total: number;
//     limit: number;
//     offset: number;
//     hasMore: boolean;
//   };
// }

export interface ArticleCard {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  featuredImage?: {
    url: string;
    alt?: string;
  };
  category?: string;
  author?: string;
  publishedAt: Date;
  readTime?: string;
  type: string;
}

export interface FeaturedArticle extends ArticleCard {
  isFeatured: true;
}

export interface CategoryFilter {
  id: string;
  name: string;
  count?: number;
  isActive: boolean;
}

export interface SearchParams {
  query?: string;
  type?: string;
  category?: string;
  limit?: number;
  offset?: number;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}
