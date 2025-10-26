// ============================================
// EMAIL AUTOMATION
// ============================================

import type { Lead } from "./lead";

export type EmailCampaignStatus =
  | "DRAFT"
  | "SCHEDULED"
  | "SENDING"
  | "SENT"
  | "PAUSED"
  | "CANCELLED";

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
  category?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailCampaign {
  id: string;
  name: string;
  templateId: string;
  subject: string;
  status: EmailCampaignStatus;
  scheduledAt?: Date;
  sentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  template: EmailTemplate;
  recipients: EmailCampaignRecipient[];
}

export interface EmailCampaignRecipient {
  id: string;
  campaignId: string;
  leadId: string;
  sentAt?: Date;
  openedAt?: Date;
  clickedAt?: Date;
  bouncedAt?: Date;
  errorMessage?: string;
  lead: Lead;
}
