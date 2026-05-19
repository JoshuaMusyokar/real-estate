import { baseApi } from "./baseApi";

// ── Inline RTK mutations (direct send — no leadId) ─────────────────────────
const testApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    testSMS: b.mutation<
      { success: boolean; sid: string; status: string; to: string },
      { to: string; body: string }
    >({
      query: (body) => ({ url: "/messaging/test/sms", method: "POST", body }),
    }),

    testWhatsApp: b.mutation<
      { success: boolean; sid: string; status: string; to: string },
      { to: string; body: string; mediaUrl?: string }
    >({
      query: (body) => ({
        url: "/messaging/test/whatsapp",
        method: "POST",
        body,
      }),
    }),

    testEmail: b.mutation<
      { success: boolean; messageId?: string; to: string; subject: string },
      { to: string; subject: string; body: string }
    >({
      query: (body) => ({ url: "/messaging/test/email", method: "POST", body }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useTestSMSMutation,
  useTestWhatsAppMutation,
  useTestEmailMutation,
} = testApi;
