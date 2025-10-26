// ============================================
// MESSAGING
// ============================================

import type { Lead } from "./lead";

export type MessageStatus =
  | "PENDING"
  | "SENT"
  | "DELIVERED"
  | "READ"
  | "FAILED";

export interface WhatsAppTemplate {
  id: string;
  name: string;
  content: string;
  category?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WhatsAppMessage {
  id: string;
  leadId: string;
  direction: string;
  content: string;
  status: MessageStatus;
  mediaUrl?: string;
  externalId?: string;
  errorMessage?: string;
  sentAt?: Date;
  deliveredAt?: Date;
  readAt?: Date;
  createdAt: Date;
  lead: Lead;
}

export interface SMSMessage {
  id: string;
  leadId: string;
  phoneNumber: string;
  content: string;
  status: MessageStatus;
  externalId?: string;
  errorMessage?: string;
  sentAt?: Date;
  deliveredAt?: Date;
  createdAt: Date;
  lead: Lead;
}
