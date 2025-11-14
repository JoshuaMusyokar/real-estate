// Form Submission Types
export interface FormSubmissionResponse {
  id: string;
  landingPageId?: string;
  landingPage?: {
    id: string;
    title: string;
    slug: string;
  };
  formType: string;
  data: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface FormSubmissionCreateRequest {
  landingPageId?: string;
  formType: string;
  data: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export interface FormSubmissionFilter {
  landingPageId?: string;
  formType?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface FormSubmissionsResponse {
  data: FormSubmissionResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface FormSubmissionStats {
  total: number;
  byType: Record<string, number>;
  byDate: any[];
  conversionRate: number;
}
