// types/landingPage.ts

export type LandingPageCreateRequest = {
  title: string;
  slug: string;
  templateId?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  content: Record<string, any>;
  isPublished?: boolean;
  isActive?: boolean;
};

export type LandingPageUpdateRequest = {
  title?: string;
  slug?: string;
  templateId?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  content?: Record<string, any>;
  isPublished?: boolean;
  isActive?: boolean;
};

export type LandingPageSearchFilters = {
  isPublished?: boolean;
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
};

export type LandingPageResponse = {
  success: boolean;
  data: {
    id: string;
    title: string;
    slug: string;
    templateId: string | null;
    metaTitle: string | null;
    metaDescription: string | null;
    metaKeywords: string[];
    content: Record<string, any>;
    isPublished: boolean;
    isActive: boolean;
    viewCount: number;
    conversionCount: number;
    publishedAt: string | null;
    createdAt: string;
    updatedAt: string;
  };
  error?: string;
};

export type LandingPagesResponse = {
  success: boolean;
  data: Array<{
    id: string;
    title: string;
    slug: string;
    templateId: string | null;
    metaTitle: string | null;
    metaDescription: string | null;
    metaKeywords: string[];
    content: Record<string, any>;
    isPublished: boolean;
    isActive: boolean;
    viewCount: number;
    conversionCount: number;
    publishedAt: string | null;
    createdAt: string;
    updatedAt: string;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: string;
};

export type SlugAvailabilityResponse = {
  success: boolean;
  available: boolean;
  error?: string;
};
