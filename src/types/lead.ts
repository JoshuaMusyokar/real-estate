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
  activities: Activity[];
  appointments: Appointment[];
  notes: Note[];
}

export interface LeadCreateInput {
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  city?: string;
  localities?: string[];
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
  stage?: LeadStage;
  priority?: LeadPriority;
  tags?: string[];
}
