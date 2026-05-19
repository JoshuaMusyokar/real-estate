import { baseApi } from "./baseApi";
import type {
  WhatsAppMessage,
  SMSMessage,
  WhatsAppStats,
  SMSStats,
  ThreadMessage,
  LeadMessagingStats,
  MessagingOverview,
  WebhookLog,
  WebhookStats,
  PaginatedResponse,
  SingleResponse,
  ListResponse,
  SendWhatsAppArgs,
  SendSMSArgs,
  SendEmailArgs,
  BroadcastArgs,
  BroadcastResult,
  SendMutationResult,
  MessageListParams,
  WebhookLogParams,
} from "../types/messages";

const toParams = (obj: Record<string, unknown>): string => {
  const p = new URLSearchParams();
  Object.entries(obj).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") p.append(k, String(v));
  });
  return p.toString();
};

export const messagingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── WhatsApp list ──────────────────────────────────────────────────
    getAllWhatsAppMessages: builder.query<
      PaginatedResponse<WhatsAppMessage>,
      MessageListParams
    >({
      query: (params = {}) =>
        `/messaging/whatsapp?${toParams(params as Record<string, unknown>)}`,
      providesTags: ["Message"],
    }),

    // ── WhatsApp stats ─────────────────────────────────────────────────
    getWhatsAppStats: builder.query<
      SingleResponse<WhatsAppStats>,
      { days?: number }
    >({
      query: ({ days = 7 } = {}) => `/messaging/whatsapp/stats?days=${days}`,
      providesTags: ["Message"],
    }),

    // ── SMS list ───────────────────────────────────────────────────────
    getAllSMSMessages: builder.query<
      PaginatedResponse<SMSMessage>,
      MessageListParams
    >({
      query: (params = {}) =>
        `/messaging/sms?${toParams(params as Record<string, unknown>)}`,
      providesTags: ["Message"],
    }),

    // ── SMS stats ──────────────────────────────────────────────────────
    getSMSStats: builder.query<SingleResponse<SMSStats>, { days?: number }>({
      query: ({ days = 7 } = {}) => `/messaging/sms/stats?days=${days}`,
      providesTags: ["Message"],
    }),

    // ── Per-lead conversation thread ───────────────────────────────────
    getLeadConversation: builder.query<ListResponse<ThreadMessage>, string>({
      query: (leadId) => `/messaging/lead/${leadId}/conversation`,
      providesTags: (_, __, leadId) => [
        { type: "Message" as const, id: leadId },
      ],
    }),

    // ── Per-lead messaging stats ───────────────────────────────────────
    getLeadMessagingStats: builder.query<
      SingleResponse<LeadMessagingStats>,
      string
    >({
      query: (leadId) => `/messaging/lead/${leadId}/stats`,
      providesTags: (_, __, leadId) => [
        { type: "Message" as const, id: leadId },
      ],
    }),

    // ── Global 30-day overview ─────────────────────────────────────────
    getMessagingOverview: builder.query<
      SingleResponse<MessagingOverview>,
      { days?: number }
    >({
      query: ({ days = 30 } = {}) => `/messaging/overview?days=${days}`,
      providesTags: ["Message"],
    }),

    // ── Send WhatsApp ──────────────────────────────────────────────────
    sendWhatsApp: builder.mutation<SendMutationResult, SendWhatsAppArgs>({
      query: (body) => ({
        url: "/messaging/whatsapp/send",
        method: "POST",
        body,
      }),
      invalidatesTags: (_, __, { leadId }) => [
        { type: "Message" as const, id: leadId },
      ],
    }),

    // ── Send SMS ───────────────────────────────────────────────────────
    sendSMS: builder.mutation<SendMutationResult, SendSMSArgs>({
      query: (body) => ({ url: "/messaging/sms/send", method: "POST", body }),
      invalidatesTags: (_, __, { leadId }) => [
        { type: "Message" as const, id: leadId },
      ],
    }),

    // ── Send email ─────────────────────────────────────────────────────
    sendEmail: builder.mutation<SendMutationResult, SendEmailArgs>({
      query: (body) => ({ url: "/messaging/email/send", method: "POST", body }),
    }),

    // ── Broadcast WhatsApp ─────────────────────────────────────────────
    broadcastWhatsApp: builder.mutation<BroadcastResult, BroadcastArgs>({
      query: (body) => ({
        url: "/messaging/whatsapp/broadcast",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Message"],
    }),

    // ── Broadcast SMS ──────────────────────────────────────────────────
    broadcastSMS: builder.mutation<
      BroadcastResult,
      { leadIds: string[]; body: string }
    >({
      query: (body) => ({
        url: "/messaging/sms/broadcast",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Message"],
    }),

    // ── Send email campaign ────────────────────────────────────────────
    sendEmailCampaign: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/messaging/campaigns/${id}/send`,
        method: "POST",
      }),
    }),

    // ── Webhook logs list ──────────────────────────────────────────────
    getWebhookLogs: builder.query<
      PaginatedResponse<WebhookLog>,
      WebhookLogParams
    >({
      query: (params = {}) =>
        `/messaging/webhooks/logs?${toParams(params as Record<string, unknown>)}`,
      providesTags: ["WebhookLog"],
    }),

    // ── Single webhook log ─────────────────────────────────────────────
    getWebhookLogById: builder.query<SingleResponse<WebhookLog>, string>({
      query: (id) => `/messaging/webhooks/logs/${id}`,
      providesTags: (_, __, id) => [{ type: "WebhookLog" as const, id }],
    }),

    // ── Webhook stats ──────────────────────────────────────────────────
    getWebhookStats: builder.query<
      SingleResponse<WebhookStats>,
      { hours?: number }
    >({
      query: ({ hours = 24 } = {}) =>
        `/messaging/webhooks/stats?hours=${hours}`,
      providesTags: ["WebhookLog"],
    }),
  }),
});

export const {
  useGetAllWhatsAppMessagesQuery,
  useGetWhatsAppStatsQuery,
  useGetAllSMSMessagesQuery,
  useGetSMSStatsQuery,
  useGetLeadConversationQuery,
  useGetLeadMessagingStatsQuery,
  useGetMessagingOverviewQuery,
  useSendWhatsAppMutation,
  useSendSMSMutation,
  useSendEmailMutation,
  useBroadcastWhatsAppMutation,
  useBroadcastSMSMutation,
  useSendEmailCampaignMutation,
  useGetWebhookLogsQuery,
  useGetWebhookLogByIdQuery,
  useGetWebhookStatsQuery,
} = messagingApi;
