import { baseApi } from "./baseApi";
import type {
  // Message templates
  MessageTemplate,
  MessageTemplatePreview,
  MessageTemplateInput,
  MessageTemplateListParams,
  AvailableTokens,
  // Email templates
  EmailTemplate,
  EmailTemplateWithCampaigns,
  EmailTemplatePreview,
  EmailTemplateInput,
  EmailTemplateListParams,
  // Campaigns
  Campaign,
  CampaignDetail,
  CampaignRecipient,
  CampaignInput,
  CampaignListParams,
  RecipientFilter,
  AddRecipientsResult,
  // Workflows
  Workflow,
  WorkflowWithExecutions,
  WorkflowAction,
  WorkflowInput,
  WorkflowActionInput,
  WorkflowListParams,
  WorkflowExecution,
  ExecutionStats,
  ExecutionListParams,
  TestTriggerResult,
  // Schedule
  UpcomingReminder,
  AppointmentReminderHistory,
  ResendReminderResult,
  ScheduleOverview,
  // Shared
  PaginatedResponse,
  SingleResponse,
  MutationResult,
  DeleteResult,
  ReminderStage,
} from "../types/messaging-management";

const toParams = (obj: Record<string, unknown>): string => {
  const p = new URLSearchParams();
  Object.entries(obj).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") p.append(k, String(v));
  });
  return p.toString();
};

export const messagingManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ══════════════════════════════════════════════════════════════════
    // MESSAGE TEMPLATES (WhatsApp + SMS)
    // ══════════════════════════════════════════════════════════════════

    getMessageTemplates: builder.query<
      PaginatedResponse<MessageTemplate>,
      MessageTemplateListParams
    >({
      query: (params = {}) =>
        `/jobs/messaging/templates/messages?${toParams(params as Record<string, unknown>)}`,
      providesTags: ["MessageTemplate"],
    }),

    getMessageTemplateById: builder.query<
      SingleResponse<MessageTemplate>,
      string
    >({
      query: (id) => `/jobs/messaging/templates/messages/${id}`,
      providesTags: (_, __, id) => [{ type: "MessageTemplate" as const, id }],
    }),

    createMessageTemplate: builder.mutation<
      SingleResponse<MessageTemplate>,
      MessageTemplateInput
    >({
      query: (body) => ({
        url: "/jobs/messaging/templates/messages",
        method: "POST",
        body,
      }),
      invalidatesTags: ["MessageTemplate"],
    }),

    updateMessageTemplate: builder.mutation<
      SingleResponse<MessageTemplate>,
      { id: string; data: Partial<MessageTemplateInput> }
    >({
      query: ({ id, data }) => ({
        url: `/jobs/messaging/templates/messages/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        "MessageTemplate",
        { type: "MessageTemplate" as const, id },
      ],
    }),

    deleteMessageTemplate: builder.mutation<DeleteResult, string>({
      query: (id) => ({
        url: `/jobs/messaging/templates/messages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["MessageTemplate"],
    }),

    toggleMessageTemplate: builder.mutation<
      SingleResponse<MessageTemplate>,
      string
    >({
      query: (id) => ({
        url: `/jobs/messaging/templates/messages/${id}/toggle`,
        method: "PATCH",
      }),
      invalidatesTags: (_, __, id) => [
        "MessageTemplate",
        { type: "MessageTemplate" as const, id },
      ],
    }),

    previewMessageTemplate: builder.mutation<
      SingleResponse<MessageTemplatePreview>,
      { id: string; context: Record<string, string> }
    >({
      query: ({ id, context }) => ({
        url: `/jobs/messaging/templates/messages/${id}/preview`,
        method: "POST",
        body: { context },
      }),
    }),

    getAvailableTokens: builder.query<SingleResponse<AvailableTokens>, void>({
      query: () => "/jobs/messaging/templates/tokens",
    }),

    // ══════════════════════════════════════════════════════════════════
    // EMAIL TEMPLATES
    // ══════════════════════════════════════════════════════════════════

    getEmailTemplates: builder.query<
      PaginatedResponse<EmailTemplate>,
      EmailTemplateListParams
    >({
      query: (params = {}) =>
        `/jobs/messaging/templates/email?${toParams(params as Record<string, unknown>)}`,
      providesTags: ["EmailTemplate"],
    }),

    getEmailTemplateById: builder.query<
      SingleResponse<EmailTemplateWithCampaigns>,
      string
    >({
      query: (id) => `/jobs/messaging/templates/email/${id}`,
      providesTags: (_, __, id) => [{ type: "EmailTemplate" as const, id }],
    }),

    createEmailTemplate: builder.mutation<
      SingleResponse<EmailTemplate>,
      EmailTemplateInput
    >({
      query: (body) => ({
        url: "/jobs/messaging/templates/email",
        method: "POST",
        body,
      }),
      invalidatesTags: ["EmailTemplate"],
    }),

    updateEmailTemplate: builder.mutation<
      SingleResponse<EmailTemplate>,
      { id: string; data: Partial<EmailTemplateInput> }
    >({
      query: ({ id, data }) => ({
        url: `/jobs/messaging/templates/email/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        "EmailTemplate",
        { type: "EmailTemplate" as const, id },
      ],
    }),

    deleteEmailTemplate: builder.mutation<DeleteResult, string>({
      query: (id) => ({
        url: `/jobs/messaging/templates/email/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["EmailTemplate"],
    }),

    previewEmailTemplate: builder.mutation<
      SingleResponse<EmailTemplatePreview>,
      { id: string; context: Record<string, string> }
    >({
      query: ({ id, context }) => ({
        url: `/jobs/messaging/templates/email/${id}/preview`,
        method: "POST",
        body: { context },
      }),
    }),

    // ══════════════════════════════════════════════════════════════════
    // CAMPAIGNS
    // ══════════════════════════════════════════════════════════════════

    getCampaigns: builder.query<
      PaginatedResponse<Campaign>,
      CampaignListParams
    >({
      query: (params = {}) =>
        `/jobs/messaging/campaigns?${toParams(params as Record<string, unknown>)}`,
      providesTags: ["Campaign"],
    }),

    getCampaignById: builder.query<SingleResponse<CampaignDetail>, string>({
      query: (id) => `/jobs/messaging/campaigns/${id}`,
      providesTags: (_, __, id) => [{ type: "Campaign" as const, id }],
    }),

    createCampaign: builder.mutation<SingleResponse<Campaign>, CampaignInput>({
      query: (body) => ({
        url: "/jobs/messaging/campaigns",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Campaign"],
    }),

    updateCampaign: builder.mutation<
      SingleResponse<Campaign>,
      { id: string; data: Partial<CampaignInput> }
    >({
      query: ({ id, data }) => ({
        url: `/jobs/messaging/campaigns/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        "Campaign",
        { type: "Campaign" as const, id },
      ],
    }),

    deleteCampaign: builder.mutation<DeleteResult, string>({
      query: (id) => ({
        url: `/jobs/messaging/campaigns/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Campaign"],
    }),

    sendCampaignNow: builder.mutation<MutationResult, string>({
      query: (id) => ({
        url: `/jobs/messaging/campaigns/${id}/send`,
        method: "POST",
      }),
      invalidatesTags: (_, __, id) => [{ type: "Campaign" as const, id }],
    }),

    pauseCampaign: builder.mutation<SingleResponse<Campaign>, string>({
      query: (id) => ({
        url: `/jobs/messaging/campaigns/${id}/pause`,
        method: "POST",
      }),
      invalidatesTags: (_, __, id) => [
        "Campaign",
        { type: "Campaign" as const, id },
      ],
    }),

    cancelCampaign: builder.mutation<SingleResponse<Campaign>, string>({
      query: (id) => ({
        url: `/jobs/messaging/campaigns/${id}/cancel`,
        method: "POST",
      }),
      invalidatesTags: (_, __, id) => [
        "Campaign",
        { type: "Campaign" as const, id },
      ],
    }),

    resumeCampaign: builder.mutation<SingleResponse<Campaign>, string>({
      query: (id) => ({
        url: `/jobs/messaging/campaigns/${id}/resume`,
        method: "POST",
      }),
      invalidatesTags: (_, __, id) => [
        "Campaign",
        { type: "Campaign" as const, id },
      ],
    }),

    getCampaignRecipients: builder.query<
      PaginatedResponse<CampaignRecipient>,
      { id: string; page?: number; limit?: number }
    >({
      query: ({ id, page = 1, limit = 50 }) =>
        `/jobs/messaging/campaigns/${id}/recipients?page=${page}&limit=${limit}`,
      providesTags: (_, __, { id }) => [{ type: "Campaign" as const, id }],
    }),

    addCampaignRecipients: builder.mutation<
      AddRecipientsResult,
      { id: string; filter: RecipientFilter }
    >({
      query: ({ id, filter }) => ({
        url: `/jobs/messaging/campaigns/${id}/recipients`,
        method: "POST",
        body: filter,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: "Campaign" as const, id }],
    }),

    removeCampaignRecipient: builder.mutation<
      DeleteResult,
      { campaignId: string; leadId: string }
    >({
      query: ({ campaignId, leadId }) => ({
        url: `/jobs/messaging/campaigns/${campaignId}/recipients/${leadId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, { campaignId }) => [
        { type: "Campaign" as const, id: campaignId },
      ],
    }),

    // ══════════════════════════════════════════════════════════════════
    // WORKFLOWS
    // ══════════════════════════════════════════════════════════════════

    getWorkflows: builder.query<
      PaginatedResponse<Workflow>,
      WorkflowListParams
    >({
      query: (params = {}) =>
        `/jobs/messaging/workflows?${toParams(params as Record<string, unknown>)}`,
      providesTags: ["Workflow"],
    }),

    getWorkflowById: builder.query<
      SingleResponse<WorkflowWithExecutions>,
      string
    >({
      query: (id) => `/jobs/messaging/workflows/${id}`,
      providesTags: (_, __, id) => [{ type: "Workflow" as const, id }],
    }),

    createWorkflow: builder.mutation<SingleResponse<Workflow>, WorkflowInput>({
      query: (body) => ({
        url: "/jobs/messaging/workflows",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Workflow"],
    }),

    updateWorkflow: builder.mutation<
      SingleResponse<Workflow>,
      { id: string; data: Partial<WorkflowInput> }
    >({
      query: ({ id, data }) => ({
        url: `/jobs/messaging/workflows/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        "Workflow",
        { type: "Workflow" as const, id },
      ],
    }),

    deleteWorkflow: builder.mutation<DeleteResult, string>({
      query: (id) => ({
        url: `/jobs/messaging/workflows/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Workflow"],
    }),

    toggleWorkflow: builder.mutation<SingleResponse<Workflow>, string>({
      query: (id) => ({
        url: `/jobs/messaging/workflows/${id}/toggle`,
        method: "PATCH",
      }),
      invalidatesTags: (_, __, id) => [
        "Workflow",
        { type: "Workflow" as const, id },
      ],
    }),

    testTriggerWorkflow: builder.mutation<
      SingleResponse<TestTriggerResult>,
      { id: string; leadId: string }
    >({
      query: ({ id, leadId }) => ({
        url: `/jobs/messaging/workflows/${id}/test`,
        method: "POST",
        body: { leadId },
      }),
    }),

    addWorkflowAction: builder.mutation<
      SingleResponse<WorkflowAction>,
      { workflowId: string; data: WorkflowActionInput }
    >({
      query: ({ workflowId, data }) => ({
        url: `/jobs/messaging/workflows/${workflowId}/actions`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_, __, { workflowId }) => [
        { type: "Workflow" as const, id: workflowId },
      ],
    }),

    updateWorkflowAction: builder.mutation<
      SingleResponse<WorkflowAction>,
      {
        workflowId: string;
        actionId: string;
        data: Partial<WorkflowActionInput>;
      }
    >({
      query: ({ workflowId, actionId, data }) => ({
        url: `/jobs/messaging/workflows/${workflowId}/actions/${actionId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_, __, { workflowId }) => [
        { type: "Workflow" as const, id: workflowId },
      ],
    }),

    deleteWorkflowAction: builder.mutation<
      DeleteResult,
      { workflowId: string; actionId: string }
    >({
      query: ({ workflowId, actionId }) => ({
        url: `/jobs/messaging/workflows/${workflowId}/actions/${actionId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, { workflowId }) => [
        { type: "Workflow" as const, id: workflowId },
      ],
    }),

    reorderWorkflowActions: builder.mutation<
      SingleResponse<Workflow>,
      { workflowId: string; orderedIds: string[] }
    >({
      query: ({ workflowId, orderedIds }) => ({
        url: `/jobs/messaging/workflows/${workflowId}/actions/reorder`,
        method: "PUT",
        body: { orderedIds },
      }),
      invalidatesTags: (_, __, { workflowId }) => [
        { type: "Workflow" as const, id: workflowId },
      ],
    }),

    // ── Executions ─────────────────────────────────────────────────────
    getExecutions: builder.query<
      PaginatedResponse<WorkflowExecution>,
      ExecutionListParams
    >({
      query: (params = {}) =>
        `/jobs/messaging/executions?${toParams(params as Record<string, unknown>)}`,
      providesTags: ["Execution"],
    }),

    getExecutionStats: builder.query<
      SingleResponse<ExecutionStats>,
      { workflowId?: string }
    >({
      query: ({ workflowId } = {}) =>
        `/jobs/messaging/executions/stats${workflowId ? `?workflowId=${workflowId}` : ""}`,
      providesTags: ["Execution"],
    }),

    // ══════════════════════════════════════════════════════════════════
    // SCHEDULE / REMINDERS
    // ══════════════════════════════════════════════════════════════════

    getScheduleOverview: builder.query<
      SingleResponse<ScheduleOverview>,
      { days?: number }
    >({
      query: ({ days = 7 } = {}) => `/jobs/messaging/schedule?days=${days}`,
      providesTags: ["Schedule"],
    }),

    getUpcomingReminders: builder.query<
      SingleResponse<UpcomingReminder[]>,
      { days?: number }
    >({
      query: ({ days = 7 } = {}) =>
        `/jobs/messaging/schedule/reminders?days=${days}`,
      providesTags: ["Schedule"],
    }),

    getAppointmentReminderHistory: builder.query<
      SingleResponse<AppointmentReminderHistory>,
      string // appointmentId
    >({
      query: (appointmentId) =>
        `/jobs/messaging/schedule/appointments/${appointmentId}/history`,
      providesTags: (_, __, id) => [{ type: "Schedule" as const, id }],
    }),

    resendReminder: builder.mutation<
      SingleResponse<ResendReminderResult>,
      { appointmentId: string; stage: ReminderStage }
    >({
      query: ({ appointmentId, stage }) => ({
        url: `/jobs/messaging/schedule/appointments/${appointmentId}/resend`,
        method: "POST",
        body: { stage },
      }),
      invalidatesTags: ["Schedule"],
    }),
  }),
});

export const {
  // Message templates
  useGetMessageTemplatesQuery,
  useGetMessageTemplateByIdQuery,
  useCreateMessageTemplateMutation,
  useUpdateMessageTemplateMutation,
  useDeleteMessageTemplateMutation,
  useToggleMessageTemplateMutation,
  usePreviewMessageTemplateMutation,
  useGetAvailableTokensQuery,
  // Email templates
  useGetEmailTemplatesQuery,
  useGetEmailTemplateByIdQuery,
  useCreateEmailTemplateMutation,
  useUpdateEmailTemplateMutation,
  useDeleteEmailTemplateMutation,
  usePreviewEmailTemplateMutation,
  // Campaigns
  useGetCampaignsQuery,
  useGetCampaignByIdQuery,
  useCreateCampaignMutation,
  useUpdateCampaignMutation,
  useDeleteCampaignMutation,
  useSendCampaignNowMutation,
  usePauseCampaignMutation,
  useCancelCampaignMutation,
  useResumeCampaignMutation,
  useGetCampaignRecipientsQuery,
  useAddCampaignRecipientsMutation,
  useRemoveCampaignRecipientMutation,
  // Workflows
  useGetWorkflowsQuery,
  useGetWorkflowByIdQuery,
  useCreateWorkflowMutation,
  useUpdateWorkflowMutation,
  useDeleteWorkflowMutation,
  useToggleWorkflowMutation,
  useTestTriggerWorkflowMutation,
  useAddWorkflowActionMutation,
  useUpdateWorkflowActionMutation,
  useDeleteWorkflowActionMutation,
  useReorderWorkflowActionsMutation,
  // Executions
  useGetExecutionsQuery,
  useGetExecutionStatsQuery,
  // Schedule
  useGetScheduleOverviewQuery,
  useGetUpcomingRemindersQuery,
  useGetAppointmentReminderHistoryQuery,
  useResendReminderMutation,
} = messagingManagementApi;
