// ============================================
// APPOINTMENT SCHEDULING
// ============================================

import type { Lead } from "./lead";
import type { Property } from "./property";
import type { User } from "./user";

export type AppointmentType =
  | "PROPERTY_VIEWING"
  | "CONSULTATION"
  | "NEGOTIATION"
  | "DOCUMENTATION"
  | "CLOSING"
  | "FOLLOW_UP";

export type AppointmentStatus =
  | "SCHEDULED"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW"
  | "RESCHEDULED";

export interface Appointment {
  id: string;
  leadId: string;
  agentId: string;
  propertyId?: string;
  type: AppointmentType;
  status: AppointmentStatus;
  title: string;
  description?: string;
  location?: string;
  locationLat?: number;
  locationLng?: number;
  scheduledAt: Date;
  duration: number;
  completedAt?: Date;
  reminder24h: boolean;
  reminderDay: boolean;
  reminder30min: boolean;
  feedbackSent: boolean;
  feedback?: string;
  rating?: number;
  checklist?: any;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  lead: Lead;
  agent: User;
  property?: Property;
}
