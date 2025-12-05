/* eslint-disable @typescript-eslint/no-unused-vars */
// ============================================
// CRM - LEAD MANAGEMENT
// ============================================

import type { Activity, Note } from "./activity";
import type { Appointment } from "./appointments";
import type { Property, PropertyPurpose, PropertyType } from "./property";
import type { User } from "./user";

export type LeadSource =
  | "WEBSITE_INQUIRY"
  | "PROPERTY_INQUIRY"
  | "CALL_BACK_REQUEST"
  | "SCHEDULE_VIEWING"
  | "NEWSLETTER"
  | "LANDING_PAGE"
  | "MANUAL_ENTRY"
  | "PHONE_CALL"
  | "WALK_IN"
  | "IMPORT"
  | "REFERRAL"
  | "SOCIAL_MEDIA";

export type LeadStage =
  | "NEW_LEAD"
  | "CONTACTED"
  | "QUALIFIED"
  | "VIEWING_SCHEDULED"
  | "NEGOTIATION"
  | "DEAL_CLOSED_WON"
  | "DEAL_CLOSED_LOST";

export type LeadPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface Lead {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  city?: string;
  localities: string[];

  propertyTypeId?: string;
  propertyType?: PropertyType;
  purpose?: PropertyPurpose;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: string;
  requirements?: string;
  source: LeadSource;
  sourcePage?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  stage: LeadStage;
  priority: LeadPriority;
  score: number;
  tags: string[];
  assignedToId?: string;
  assignedAt?: Date;
  isActive: boolean;
  lastContactedAt?: Date;
  nextFollowUpAt?: Date;
  dealValue?: number;
  dealClosedAt?: Date;
  lostReason?: string;
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: User;
  interestedProperties: Property[];
  // activities: Activity[];
  // appointments: Appointment[];
  // notes: Note[];
}

export interface LeadCreateInput {
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  city?: string;
  localities?: string[];
  propertyTypeId?: string;
  purpose?: PropertyPurpose;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: string;
  requirements?: string;
  source: LeadSource;
  sourcePage?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  stage?: LeadStage;
  priority?: LeadPriority;
  tags?: string[];
}

export interface CreateLeadInput {
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  city?: string;
  localities?: string[];
  propertyTypeId?: string;
  purpose?: PropertyPurpose;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: string;
  requirements?: string;
  source: LeadSource;
  sourcePage?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  interestedProperties?: string[];
  tags?: string[];
}

export interface UpdateLeadInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  alternatePhone?: string;
  city?: string;
  localities?: string[];
  propertyTypeId?: string;
  purpose?: PropertyPurpose;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: string;
  requirements?: string;
  stage?: LeadStage;
  priority?: LeadPriority;
  score?: number;
  tags?: string[];
  assignedToId?: string;
  isActive?: boolean;
  lastContactedAt?: Date;
  nextFollowUpAt?: Date;
  dealValue?: number;
  dealClosedAt?: Date;
  lostReason?: string;
}
export interface LeadResponseWithData {
  sucess: boolean;
  data: LeadResponse;
}
export interface LeadResponse {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  city?: string;
  localities: string[];
  propertyTypeId?: string;
  propertyType?: PropertyType;
  purpose?: PropertyPurpose;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: string;
  requirements?: string;
  source: LeadSource;
  sourcePage?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  stage: LeadStage;
  priority: LeadPriority;
  score: number;
  tags: string[];
  assignedToId?: string;
  assignedTo?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  isActive: boolean;
  lastContactedAt?: Date;
  nextFollowUpAt?: Date;
  dealValue?: number;
  dealClosedAt?: Date;
  lostReason?: string;
  interestedProperties: Array<{
    id: string;
    title: string;
    price: number;
    city: string;
    locality: string;
  }>;
  activitiesCount: number;
  appointmentsCount: number;
  createdAt: Date;
  updatedAt: Date;
}
// TODO: UPDATE THIS PROPERTY TYPE
export interface LeadFilter {
  search?: string;
  stage?: LeadStage;
  priority?: LeadPriority;
  source?: LeadSource;
  assignedToId?: string;
  city?: string;
  locality?: string;
  propertyType?: string;
  minScore?: number;
  maxScore?: number;
  isActive?: boolean;
  dateFrom?: Date;
  dateTo?: Date;
}
export interface LeadStats {
  total: number;
  byStage: Record<LeadStage, number>;
  byPriority: Record<LeadPriority, number>;
  bySource: Record<LeadSource, number>;
  conversionRate: number;
  averageScore: number;
  recentActivities: number;
}
export interface LeadCreateRequest {
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  cityId?: string;
  localities?: string[];
  propertyTypeId?: string;
  purpose?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: string;
  requirements?: string;
  source: string;
  sourcePage?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  interestedProperties?: string[];
  tags?: string[];
}
export interface LeadUpdateRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  alternatePhone?: string;
  cityId?: string;
  localities?: string[];
  propertyTypeId?: string;
  purpose?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: string;
  requirements?: string;
  stage?: string;
  priority?: string;
  score?: number;
  tags?: string[];
  assignedToId?: string;
  isActive?: boolean;
  lastContactedAt?: Date;
  nextFollowUpAt?: Date;
  dealValue?: number;
  dealClosedAt?: Date;
  lostReason?: string;
}

export interface LeadsResponse {
  data: LeadResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
