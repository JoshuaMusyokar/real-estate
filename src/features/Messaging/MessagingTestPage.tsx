import { useState } from "react";
import {
  MessageSquare,
  Smartphone,
  Mail,
  Send,
  Loader2,
  CheckCircle2,
  XCircle,
  Trash2,
  Beaker,
  AlertCircle,
} from "lucide-react";
import {
  useTestEmailMutation,
  useTestSMSMutation,
  useTestWhatsAppMutation,
} from "../../services/messagingTestApi";

// ── Types ──────────────────────────────────────────────────────────────────
type Channel = "sms" | "whatsapp" | "email";

interface LogEntry {
  id: number;
  channel: Channel;
  to: string;
  preview: string;
  success: boolean;
  detail: string; // SID, messageId, or error
  sentAt: Date;
}

// ── Shared styles ──────────────────────────────────────────────────────────
const inp =
  "w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all";
const lbl =
  "block text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1";

const CHANNEL_CFG = {
  sms: {
    label: "SMS",
    icon: Smartphone,
    accent: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-600 hover:bg-purple-700",
    light:
      "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800",
  },
  whatsapp: {
    label: "WhatsApp",
    icon: MessageSquare,
    accent: "text-green-600 dark:text-green-400",
    bg: "bg-green-600 hover:bg-green-700",
    light:
      "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
  },
  email: {
    label: "Email",
    icon: Mail,
    accent: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-600 hover:bg-blue-700",
    light:
      "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
  },
} as const;

// ── Log entry card ─────────────────────────────────────────────────────────
const LogCard: React.FC<{ entry: LogEntry }> = ({ entry }) => {
  const cfg = CHANNEL_CFG[entry.channel];
  const Icon = cfg.icon;
  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-xl border text-xs ${
        entry.success
          ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800"
          : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
      }`}
    >
      <Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${cfg.accent}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <span className="font-bold text-gray-900 dark:text-white">
            {cfg.label} → {entry.to}
          </span>
          <div className="flex items-center gap-1 flex-shrink-0">
            {entry.success ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                  Sent
                </span>
              </>
            ) : (
              <>
                <XCircle className="w-3.5 h-3.5 text-red-500" />
                <span className="text-red-700 dark:text-red-400 font-semibold">
                  Failed
                </span>
              </>
            )}
          </div>
        </div>
        <p className="text-gray-500 dark:text-gray-400 truncate">
          "{entry.preview}"
        </p>
        <p className="font-mono text-[10px] text-gray-400 mt-0.5 truncate">
          {entry.detail}
        </p>
        <p className="text-[10px] text-gray-400 mt-0.5">
          {entry.sentAt.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
};

// ── Main page ──────────────────────────────────────────────────────────────
export const MessagingTestPage: React.FC = () => {
  const [logId, setLogId] = useState(0);
  const [log, setLog] = useState<LogEntry[]>([]);

  // SMS state
  const [smsTo, setSmsTo] = useState("");
  const [smsBody, setSmsBody] = useState("");

  // WhatsApp state
  const [waTo, setWaTo] = useState("");
  const [waBody, setWaBody] = useState("");
  const [waMedia, setWaMedia] = useState("");

  // Email state
  const [emailTo, setEmailTo] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");

  const [sendSMS, { isLoading: ls }] = useTestSMSMutation();
  const [sendWA, { isLoading: lw }] = useTestWhatsAppMutation();
  const [sendEmail, { isLoading: le }] = useTestEmailMutation();

  const addLog = (entry: Omit<LogEntry, "id">) =>
    setLog((p) => [{ ...entry, id: logId + 1 }, ...p].slice(0, 30));

  const handleSMS = async () => {
    try {
      const r = await sendSMS({ to: smsTo, body: smsBody }).unwrap();
      addLog({
        channel: "sms",
        to: smsTo,
        preview: smsBody.slice(0, 60),
        success: true,
        detail: `SID: ${r.sid} · ${r.status}`,
        sentAt: new Date(),
      });
      setSmsBody("");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed";
      addLog({
        channel: "sms",
        to: smsTo,
        preview: smsBody.slice(0, 60),
        success: false,
        detail: msg,
        sentAt: new Date(),
      });
    }
    setLogId((n) => n + 1);
  };

  const handleWA = async () => {
    try {
      const r = await sendWA({
        to: waTo,
        body: waBody,
        ...(waMedia ? { mediaUrl: waMedia } : {}),
      }).unwrap();
      addLog({
        channel: "whatsapp",
        to: waTo,
        preview: waBody.slice(0, 60),
        success: true,
        detail: `SID: ${r.sid} · ${r.status}`,
        sentAt: new Date(),
      });
      setWaBody("");
      setWaMedia("");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed";
      addLog({
        channel: "whatsapp",
        to: waTo,
        preview: waBody.slice(0, 60),
        success: false,
        detail: msg,
        sentAt: new Date(),
      });
    }
    setLogId((n) => n + 1);
  };

  const handleEmail = async () => {
    try {
      const r = await sendEmail({
        to: emailTo,
        subject: emailSubject,
        body: emailBody,
      }).unwrap();
      addLog({
        channel: "email",
        to: emailTo,
        preview: emailSubject,
        success: true,
        detail: `ID: ${r.messageId ?? "sent"}`,
        sentAt: new Date(),
      });
      setEmailBody("");
      setEmailSubject("");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed";
      addLog({
        channel: "email",
        to: emailTo,
        preview: emailSubject,
        success: false,
        detail: msg,
        sentAt: new Date(),
      });
    }
    setLogId((n) => n + 1);
  };

  return (
    <div className="max-w-full mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
          <Beaker className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
            Messaging Test Console
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Send real messages directly to any number or email — no lead
            required
          </p>
        </div>
      </div>

      {/* Warning */}
      <div className="flex items-start gap-2.5 p-3.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl">
        <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-300">
          <span className="font-bold">
            Real messages are sent and may incur Twilio/SendGrid charges.
          </span>{" "}
          WhatsApp sandbox only reaches numbers that have joined your sandbox.
          Use your own phone number and email for testing.
        </p>
      </div>

      {/* Three panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* ── SMS ─────────────────────────────────────────────────────── */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-purple-500" />
            <h2 className="text-sm font-black text-gray-900 dark:text-white">
              SMS
            </h2>
          </div>
          <div>
            <label className={lbl}>To (phone number)</label>
            <input
              type="tel"
              value={smsTo}
              onChange={(e) => setSmsTo(e.target.value)}
              placeholder="+254 7XX XXX XXX"
              className={inp}
            />
          </div>
          <div>
            <label className={lbl}>
              Message
              {smsBody.length > 0 && (
                <span
                  className={`ml-2 normal-case font-normal ${smsBody.length > 160 ? "text-amber-500" : "text-gray-400"}`}
                >
                  {smsBody.length}/160
                  {smsBody.length > 160 &&
                    ` (${Math.ceil(smsBody.length / 160)} seg)`}
                </span>
              )}
            </label>
            <textarea
              rows={4}
              value={smsBody}
              onChange={(e) => setSmsBody(e.target.value)}
              placeholder="Type your SMS message…"
              className={`${inp} resize-none`}
            />
          </div>
          <button
            onClick={handleSMS}
            disabled={ls || !smsTo.trim() || !smsBody.trim()}
            className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            {ls ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Sending…
              </>
            ) : (
              <>
                <Send className="w-4 h-4" /> Send SMS
              </>
            )}
          </button>
        </div>

        {/* ── WhatsApp ─────────────────────────────────────────────────── */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-green-500" />
            <h2 className="text-sm font-black text-gray-900 dark:text-white">
              WhatsApp
            </h2>
          </div>
          <div>
            <label className={lbl}>To (phone number)</label>
            <input
              type="tel"
              value={waTo}
              onChange={(e) => setWaTo(e.target.value)}
              placeholder="+254 7XX XXX XXX"
              className={inp}
            />
          </div>
          <div>
            <label className={lbl}>Message</label>
            <textarea
              rows={4}
              value={waBody}
              onChange={(e) => setWaBody(e.target.value)}
              placeholder={"Hi *John*!\n\nYour appointment is confirmed. 🏠"}
              className={`${inp} resize-none`}
            />
            <p className="text-[10px] text-gray-400 mt-1">
              Supports *bold*, _italic_, line breaks
            </p>
          </div>
          <div>
            <label className={lbl}>Media URL (optional)</label>
            <input
              type="url"
              value={waMedia}
              onChange={(e) => setWaMedia(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className={inp}
            />
          </div>
          <button
            onClick={handleWA}
            disabled={lw || !waTo.trim() || !waBody.trim()}
            className="w-full py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            {lw ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Sending…
              </>
            ) : (
              <>
                <Send className="w-4 h-4" /> Send WhatsApp
              </>
            )}
          </button>
        </div>

        {/* ── Email ────────────────────────────────────────────────────── */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-blue-500" />
            <h2 className="text-sm font-black text-gray-900 dark:text-white">
              Email
            </h2>
          </div>
          <div>
            <label className={lbl}>To (email address)</label>
            <input
              type="email"
              value={emailTo}
              onChange={(e) => setEmailTo(e.target.value)}
              placeholder="test@example.com"
              className={inp}
            />
          </div>
          <div>
            <label className={lbl}>Subject</label>
            <input
              type="text"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              placeholder="Test email from Property4India"
              className={inp}
            />
          </div>
          <div>
            <label className={lbl}>Body</label>
            <textarea
              rows={4}
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              placeholder="Hi there,&#10;&#10;This is a test email…"
              className={`${inp} resize-none`}
            />
            <p className="text-[10px] text-gray-400 mt-1">
              Plain text. New lines become line breaks in the email.
            </p>
          </div>
          <button
            onClick={handleEmail}
            disabled={
              le || !emailTo.trim() || !emailSubject.trim() || !emailBody.trim()
            }
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            {le ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Sending…
              </>
            ) : (
              <>
                <Send className="w-4 h-4" /> Send Email
              </>
            )}
          </button>
        </div>
      </div>

      {/* Send log */}
      {log.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-[11px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">
              Send log ({log.length})
            </h2>
            <button
              onClick={() => setLog([])}
              className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-red-500 transition-colors font-semibold"
            >
              <Trash2 className="w-3 h-3" /> Clear
            </button>
          </div>
          <div className="space-y-2">
            {log.map((entry) => (
              <LogCard key={entry.id} entry={entry} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
