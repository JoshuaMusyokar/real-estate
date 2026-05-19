export type TemplateChannel = "whatsapp" | "sms" | "email";
export type TemplateCategory =
  | "appointment"
  | "follow_up"
  | "welcome"
  | "reminder"
  | "campaign"
  | "custom";

export type CampaignStatus =
  | "DRAFT"
  | "SCHEDULED"
  | "SENDING"
  | "SENT"
  | "PAUSED"
  | "CANCELLED";

export type WorkflowTrigger =
  | "FORM_SUBMISSION"
  | "LEAD_CREATED"
  | "LEAD_STAGE_CHANGED"
  | "APPOINTMENT_SCHEDULED"
  | "APPOINTMENT_COMPLETED"
  | "PROPERTY_INQUIRY"
  | "NO_RESPONSE_TIMEOUT"
  | "LEAD_INACTIVE";

export type WorkflowActionType =
  | "SEND_EMAIL"
  | "SEND_WHATSAPP"
  | "SEND_SMS"
  | "CREATE_TASK"
  | "UPDATE_LEAD_STAGE"
  | "ASSIGN_LEAD"
  | "ADD_TAG"
  | "WAIT_DELAY";

export type WorkflowStatus = "running" | "completed" | "failed";
export type AppointmentStatus =
  | "SCHEDULED"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW"
  | "RESCHEDULED";
export type AppointmentType =
  | "PROPERTY_VIEWING"
  | "CONSULTATION"
  | "NEGOTIATION"
  | "DOCUMENTATION"
  | "CLOSING"
  | "FOLLOW_UP";
export type ReminderStage =
  | "confirmation"
  | "reminder_24h"
  | "reminder_morning"
  | "reminder_30min";

// ── Shared pagination ──────────────────────────────────────────────────────
export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: Pagination;
}

export interface SingleResponse<T> {
  success: boolean;
  data: T;
}

export interface MutationResult {
  success: boolean;
  message?: string;
}

export interface DeleteResult {
  success: boolean;
  deleted: boolean;
}

// ══════════════════════════════════════════════════════════════════════════
// MESSAGE TEMPLATES (WhatsApp + SMS)
// ══════════════════════════════════════════════════════════════════════════

export interface MessageTemplate {
  id: string;
  name: string;
  channel: TemplateChannel;
  category: TemplateCategory | string;
  subject: string | null; // email only
  content: string;
  variables: string[]; // extracted {{token}} names
  isActive: boolean;
  isSystem: boolean; // system templates can't be deleted
  createdAt: string;
  updatedAt: string;
}

export interface MessageTemplatePreview {
  id: string;
  name: string;
  channel: TemplateChannel;
  preview: string; // rendered with context values
  variables: string[];
}

export interface MessageTemplateInput {
  name: string;
  channel: "whatsapp" | "sms";
  category?: string;
  content: string;
  isActive?: boolean;
}

export interface MessageTemplateListParams {
  channel?: "whatsapp" | "sms";
  category?: string;
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

// ══════════════════════════════════════════════════════════════════════════
// EMAIL TEMPLATES
// ══════════════════════════════════════════════════════════════════════════

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string | null;
  category: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: { campaigns: number };
}

export interface EmailTemplateSummary {
  id: string;
  name: string;
  subject: string;
}

export interface EmailTemplateWithCampaigns extends EmailTemplate {
  campaigns: Array<{
    id: string;
    name: string;
    status: CampaignStatus;
  }>;
}

export interface EmailTemplatePreview {
  id: string;
  name: string;
  subject: string;
  htmlPreview: string;
  textPreview: string | null;
}

export interface EmailTemplateInput {
  name: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
  category?: string;
  isActive?: boolean;
}

export interface EmailTemplateListParams {
  category?: string;
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

// ── Available tokens ───────────────────────────────────────────────────────
export interface AvailableTokens {
  lead: string[];
  property: string[];
  appointment: string[];
  agent: string[];
  company: string[];
}

// ══════════════════════════════════════════════════════════════════════════
// CAMPAIGNS
// ══════════════════════════════════════════════════════════════════════════

export interface Campaign {
  id: string;
  name: string;
  templateId: string;
  subject: string;
  status: CampaignStatus;
  scheduledAt: string | null;
  sentAt: string | null;
  createdAt: string;
  updatedAt: string;
  template: EmailTemplateSummary;
  _count: { recipients: number };
}

export interface CampaignStats {
  total: number;
  sent: number;
  opened: number;
  clicked: number;
  bounced: number;
  pending: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
}

export interface CampaignDetail extends Campaign {
  stats: CampaignStats;
  recipients: CampaignRecipientRow[];
}

export interface CampaignRecipient {
  id: string;
  campaignId: string;
  leadId: string;
  sentAt: string | null;
  openedAt: string | null;
  clickedAt: string | null;
  bouncedAt: string | null;
  errorMessage: string | null;
  lead: {
    id: string;
    firstName: string;
    lastName: string | null;
    email: string | null;
    stage: string;
  };
}

// Alias for detail page rows
export type CampaignRecipientRow = CampaignRecipient;

export interface CampaignInput {
  name: string;
  templateId: string;
  subject: string;
  scheduledAt?: string;
}

export interface CampaignListParams {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface RecipientFilter {
  stage?: string;
  cityId?: string;
  source?: string;
  minScore?: number;
  tags?: string[];
  leadIds?: string[];
}

export interface AddRecipientsResult {
  success: boolean;
  added: number;
  skipped: number;
}

// ══════════════════════════════════════════════════════════════════════════
// WORKFLOWS
// ══════════════════════════════════════════════════════════════════════════

export interface WorkflowAction {
  id: string;
  workflowId: string;
  order: number;
  actionType: WorkflowActionType;
  config: WorkflowActionConfig;
  delayMinutes: number | null;
  createdAt: string;
}

// Discriminated union for type-safe action config
export type WorkflowActionConfig =
  | SendMessageConfig
  | UpdateStageConfig
  | AddTagConfig
  | AssignLeadConfig
  | CreateTaskConfig
  | WaitDelayConfig;

export interface SendMessageConfig {
  templateName?: string;
  body?: string;
  subject?: string;
}

export interface UpdateStageConfig {
  stage: string;
}

export interface AddTagConfig {
  tag: string;
}

export interface AssignLeadConfig {
  agentId: string;
}

export interface CreateTaskConfig {
  title: string;
  description?: string;
}

export interface WaitDelayConfig {
  minutes: number;
}

export interface Workflow {
  id: string;
  name: string;
  description: string | null;
  trigger: WorkflowTrigger;
  conditions: Record<string, unknown> | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  actions: WorkflowAction[];
  _count: { executions: number };
}

export interface WorkflowWithExecutions extends Workflow {
  executions: WorkflowExecutionSummary[];
}

export interface WorkflowInput {
  name: string;
  description?: string;
  trigger: WorkflowTrigger;
  conditions?: Record<string, unknown>;
  isActive?: boolean;
}

export interface WorkflowActionInput {
  order: number;
  actionType: WorkflowActionType;
  config: WorkflowActionConfig;
  delayMinutes?: number;
}

export interface WorkflowListParams {
  trigger?: WorkflowTrigger | string;
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

// ── Executions ─────────────────────────────────────────────────────────────
export interface WorkflowExecution {
  id: string;
  workflowId: string;
  leadId: string | null;
  status: WorkflowStatus;
  startedAt: string;
  completedAt: string | null;
  errorLog: string | null;
  workflow: {
    id: string;
    name: string;
    trigger: WorkflowTrigger;
  };
}

export type WorkflowExecutionSummary = Omit<WorkflowExecution, "workflow">;

export interface ExecutionStats {
  total: number;
  completed: number;
  failed: number;
  running: number;
  successRate: number;
}

export interface ExecutionListParams {
  workflowId?: string;
  leadId?: string;
  status?: WorkflowStatus | string;
  page?: number;
  limit?: number;
}

export interface TestTriggerResult {
  triggered: boolean;
  workflowId: string;
  leadId: string;
  trigger: WorkflowTrigger;
}

// ══════════════════════════════════════════════════════════════════════════
// SCHEDULE / REMINDERS
// ══════════════════════════════════════════════════════════════════════════

export interface ReminderFlags {
  confirmation: boolean;
  reminder24h: boolean;
  reminderDay: boolean;
  reminder30min: boolean;
}

export interface UpcomingReminder {
  id: string;
  lead: {
    id: string;
    firstName: string;
    lastName: string | null;
    phone: string | null;
    email: string | null;
  };
  agent: {
    id: string;
    firstName: string;
    lastName: string | null;
    phone: string | null;
  } | null;
  property: {
    id: string;
    title: string;
    locality: string;
  } | null;
  scheduledAt: string;
  type: AppointmentType;
  status: AppointmentStatus;
  location: string | null;
  reminders: ReminderFlags;
}

export interface AppointmentMessageRow {
  id: string;
  content: string;
  status: string;
  sentAt: string | null;
  createdAt: string;
}

export interface AppointmentReminderHistory {
  appointment: {
    id: string;
    scheduledAt: string;
    type: AppointmentType;
    status: AppointmentStatus;
    reminders: Omit<ReminderFlags, "confirmation">;
  };
  lead: {
    id: string;
    firstName: string;
    lastName: string | null;
    phone: string | null;
    email: string | null;
  };
  messages: {
    whatsapp: AppointmentMessageRow[];
    sms: AppointmentMessageRow[];
  };
}

export interface ResendReminderResult {
  appointmentId: string;
  stage: ReminderStage;
  results: string[];
}

export interface ScheduledCampaignSummary {
  id: string;
  name: string;
  status: CampaignStatus;
  scheduledAt: string | null;
  template: EmailTemplateSummary;
  _count: { recipients: number };
}

export interface ScheduleOverview {
  reminders: {
    total: number;
    pending24h: number;
    pendingDay: number;
    pending30min: number;
    items: UpcomingReminder[];
  };
  campaigns: {
    total: number;
    items: ScheduledCampaignSummary[];
  };
}
