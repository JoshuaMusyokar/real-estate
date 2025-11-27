// ============================================
// APPOINTMENT SCHEDULING
// ============================================

import type { JSONContent } from "./common";
import type { Lead } from "./lead";
import type { City } from "./location";
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
  checklist?: JSONContent;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  lead: Lead;
  agent: User;
  property?: Property;
}
export interface AppointmentResponse {
  id: string;
  leadId: string;
  lead: {
    id: string;
    firstName: string;
    lastName?: string;
    email: string;
    phone: string;
  };
  agentId: string;
  agent: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  propertyId?: string;
  property?: {
    id: string;
    title: string;
    price: number;
    city: City;
    locality: string;
  };
  type: string;
  status: string;
  title: string;
  description?: string;
  location?: string;
  locationLat?: number;
  locationLng?: number;
  scheduledAt: string;
  duration: number;
  completedAt?: string;
  reminder24h: boolean;
  reminderDay: boolean;
  reminder30min: boolean;
  feedbackSent: boolean;
  feedback?: string;
  rating?: number;
  checklist?: JSONContent;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentCreateRequestOld {
  leadId: string;
  agentId: string;
  propertyId?: string;
  type: string;
  title: string;
  description?: string;
  location?: string;
  locationLat?: number;
  locationLng?: number;
  scheduledAt: string;
  duration?: number;
  checklist?: JSONContent;
  notes?: string;
}
export interface AppointmentCreateRequest {
  // Lead-related (optional if appointment triggered from property page)
  leadId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;

  // Agent & Property
  agentId: string | null;
  propertyId?: string;

  // Appointment Details
  type: AppointmentType;
  title?: string;
  description?: string;
  location?: string;
  locationLat?: number;
  locationLng?: number;
  scheduledAt: Date;
  duration?: number;
  checklist?: JSONContent;
  notes?: string;

  // Optional contextual info
  city?: string;
  localities?: string[];
  propertyType?: string;
  purpose?: string;
}

export interface AppointmentUpdateRequest {
  type?: string;
  title?: string;
  description?: string;
  location?: string;
  locationLat?: number;
  locationLng?: number;
  scheduledAt?: string;
  duration?: number;
  status?: string;
  completedAt?: string;
  feedback?: string;
  rating?: number;
  checklist?: JSONContent;
  notes?: string;
}

export interface AppointmentFilter {
  agentId?: string;
  leadId?: string;
  propertyId?: string;
  type?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  upcoming?: boolean;
  page?: number;
  limit?: number;
}

export interface AppointmentsResponse {
  data: AppointmentResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Add these to your existing types

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: AppointmentType;
  status: AppointmentStatus;
  lead?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  agent?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  property?: {
    id: string;
    title: string;
    price: number;
    city: string;
    locality: string;
  };
  location?: string;
  description?: string;
}

export interface BuyerAppointmentsFilter {
  startDate?: Date;
  endDate?: Date;
  status?: AppointmentStatus[];
  type?: AppointmentType[];
}

export interface AdminAppointmentsFilter {
  startDate?: Date;
  endDate?: Date;
  status?: AppointmentStatus[];
  type?: AppointmentType[];
  agentId?: string;
  leadId?: string;
  propertyId?: string;
  includeProperties?: boolean;
}

export interface AppointmentStats {
  total: number;
  scheduled: number;
  confirmed: number;
  completed: number;
  cancelled: number;
}
