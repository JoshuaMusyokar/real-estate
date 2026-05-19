// ── Shared pagination ──────────────────────────────────────────────────────
export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// ── Lead summary (embedded in messages) ────────────────────────────────────
export interface MessageLeadSummary {
  id: string;
  firstName: string;
  lastName: string | null;
  phone: string | null;
  email: string | null;
  stage: string;
}

// ── WhatsApp message ────────────────────────────────────────────────────────
export type MessageStatus =
  | "PENDING"
  | "SENT"
  | "DELIVERED"
  | "READ"
  | "FAILED"
  | "UNDELIVERED";

export type MessageDirection = "inbound" | "outbound";
export type MessageChannel = "whatsapp" | "sms" | "email";

export interface WhatsAppMessage {
  id: string;
  leadId: string;
  direction: MessageDirection;
  content: string;
  status: MessageStatus;
  mediaUrl: string | null;
  externalId: string | null;
  errorMessage: string | null;
  sentAt: string | null;
  deliveredAt: string | null;
  readAt: string | null;
  createdAt: string;
  lead: MessageLeadSummary | null;
}

// ── SMS message ────────────────────────────────────────────────────────────
export interface SMSMessage {
  id: string;
  leadId: string;
  phoneNumber: string;
  content: string;
  status: MessageStatus;
  externalId: string | null;
  errorMessage: string | null;
  sentAt: string | null;
  deliveredAt: string | null;
  createdAt: string;
  lead: MessageLeadSummary | null;
}

// ── Unified thread message (merged WA + SMS for per-lead view) ─────────────
export interface ThreadMessage {
  id: string;
  channel: MessageChannel;
  direction: MessageDirection;
  content: string;
  status: MessageStatus;
  mediaUrl: string | undefined;
  externalId: string | undefined;
  sentAt: string | null | Date;
  deliveredAt: string | null | Date;
  readAt: string | null | Date | undefined;
  createdAt: string | Date;
}

// ── WhatsApp stats ─────────────────────────────────────────────────────────
export interface WhatsAppStats {
  total: number;
  sent: number;
  delivered: number;
  read: number;
  failed: number;
  inbound: number;
  deliveryRate: number;
  readRate: number;
  period: number;
}

// ── SMS stats ──────────────────────────────────────────────────────────────
export interface SMSStats {
  total: number;
  sent: number;
  delivered: number;
  failed: number;
  deliveryRate: number;
  period: number;
}

// ── Webhook log ────────────────────────────────────────────────────────────
export type WebhookSource = "twilio_whatsapp" | "twilio_sms" | "sendgrid";
export type WebhookEvent =
  | "inbound"
  | "status"
  | "open"
  | "click"
  | "bounce"
  | "delivery"
  | string;

export interface WebhookLog {
  id: string;
  source: WebhookSource;
  event: WebhookEvent;
  externalId: string | null;
  fromNumber: string | null;
  toNumber: string | null;
  status: string | null;
  payload: Record<string, unknown>;
  verified: boolean;
  error: string | null;
  processedAt: string | null;
  createdAt: string;
}

// ── Webhook stats ──────────────────────────────────────────────────────────
export interface WebhookStats {
  total: number;
  verified: number;
  errors: number;
  successRate: number;
  bySource: Record<string, number>;
  period: { hours: number; from: string; to: string };
}

// ── Messaging overview (30-day global) ────────────────────────────────────
export interface MessagingOverview {
  whatsapp: {
    sent: number;
    delivered: number;
    read: number;
    failed: number;
    inbound: number;
    deliveryRate: number;
    readRate: number;
  };
  sms: {
    sent: number;
    delivered: number;
    failed: number;
    deliveryRate: number;
  };
  period: { from: string; to: string };
}

// ── Per-lead stats ─────────────────────────────────────────────────────────
export interface LeadMessagingStats {
  whatsapp: { sent: number; delivered: number; read: number };
  sms: { sent: number; delivered: number };
  inbound: number;
}

// ── API response wrappers ──────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: Pagination;
}

export interface SingleResponse<T> {
  success: boolean;
  data: T;
}

export interface ListResponse<T> {
  success: boolean;
  data: T[];
  count: number;
}

// ── Send mutation args ─────────────────────────────────────────────────────
export interface SendWhatsAppArgs {
  leadId: string;
  body?: string;
  templateName?: string;
  mediaUrl?: string;
}

export interface SendSMSArgs {
  leadId: string;
  body?: string;
  templateName?: string;
}

export interface SendEmailArgs {
  leadId: string;
  subject?: string;
  htmlBody?: string;
  templateName?: string;
}

export interface BroadcastArgs {
  leadIds: string[];
  body?: string;
  templateName?: string;
}

export interface SendMutationResult {
  success: boolean;
  externalId?: string;
  error?: string;
}

export interface BroadcastResult {
  success: boolean;
  sent: number;
  failed: number;
  total: number;
}

// ── Query filter shapes ────────────────────────────────────────────────────
export interface MessageListParams {
  search?: string;
  status?: string;
  direction?: string;
  leadId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface WebhookLogParams {
  source?: string;
  event?: string;
  verified?: boolean;
  hasError?: boolean;
  search?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}
