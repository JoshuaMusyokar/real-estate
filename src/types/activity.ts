// ============================================
// ACTIVITY TRACKING
// ============================================

import type { MetadataContent } from "./marketing";
import type { User } from "./user";

export type ActivityType =
  | "CALL"
  | "EMAIL"
  | "WHATSAPP"
  | "SMS"
  | "MEETING"
  | "PROPERTY_VIEWING"
  | "NOTE"
  | "STATUS_CHANGE"
  | "LEAD_ASSIGNED"
  | "LEAD_TRANSFERRED"
  | "APPOINTMENT_SCHEDULED"
  | "APPOINTMENT_COMPLETED"
  | "APPOINTMENT_CANCELLED";

export interface Activity {
  id: string;
  leadId: string;
  userId: string;
  type: ActivityType;
  title: string;
  description?: string;
  duration?: number;
  metadata?: MetadataContent;
  createdAt: Date;
  user: User;
}

export interface Note {
  id: string;
  leadId: string;
  userId: string;
  content: string;
  isInternal: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: User;
}
export interface CreateActivityInput {
  leadId: string;
  type: ActivityType;
  title: string;
  description?: string;
  duration?: number;
  metadata?: MetadataContent;
}
export interface ActivityResponse {
  id: string;
  leadId: string;
  userId: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  type: ActivityType;
  title: string;
  description?: string;
  duration?: number;
  metadata?: MetadataContent;
  createdAt: Date;
}
export interface ActivityCreateRequest {
  leadId: string;
  type: string;
  title: string;
  description?: string;
  duration?: number;
  metadata?: MetadataContent;
}

export interface CreateNoteInput {
  leadId: string;
  content: string;
  isInternal?: boolean;
}

export interface NoteResponse {
  id: string;
  leadId: string;
  userId: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  content: string;
  isInternal: boolean;
  createdAt: Date;
  updatedAt: Date;
}
// Removed duplicate NoteResponse interface with conflicting types

export interface NoteCreateRequest {
  leadId: string;
  content: string;
  isInternal?: boolean;
}
export interface NoteUpdateRequest {
  content: string;
}
