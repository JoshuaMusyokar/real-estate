// ============================================
// ACTIVITY TRACKING
// ============================================

import { type User } from "./user";

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
  metadata?: any;
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
