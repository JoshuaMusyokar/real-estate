// ============================================
// MARKETING AUTOMATION

// ============================================

export type MetadataValue = string | number | boolean | null;

export interface MetadataContent {
  [key: string]: MetadataValue | MetadataValue[] | MetadataContent;
}

export interface LandingPage {
  id: string;
  title: string;
  slug: string;
  templateId?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords: string[];
  content: MetadataContent;
  isPublished: boolean;
  isActive: boolean;
  viewCount: number;
  conversionCount: number;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  submissions: FormSubmission[];
}

export interface FormSubmission {
  id: string;
  landingPageId?: string;
  formType: string;
  data: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}
