// SchedulePage  —  /crm/messaging/schedule
// Combined view: appointment reminders + scheduled campaigns
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarClock,
  RefreshCw,
  Bell,
  Mail,
  CheckCircle2,
  Clock,
  Send,
  ChevronRight,
} from "lucide-react";
import { ResendReminderModal } from "./ResendReminderModal";
import {
  useGetScheduleOverviewQuery,
  useResendReminderMutation,
} from "../../services/messagingManagementApi";
import type {
  UpcomingReminder,
  ScheduledCampaignSummary,
  ReminderStage,
} from "../../types/messaging-management";
import { useToast } from "../../hooks/useToast";
import { CampaignStatusBadge } from "../Campaigns/CampaignStatusBadge";

const fmt = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

const fmtRelative = (d: string) => {
  const diff = new Date(d).getTime() - Date.now();
  const h = diff / (1000 * 60 * 60);
  if (h < 1) return `in ${Math.round(diff / 60000)}m`;
  if (h < 24) return `in ${Math.round(h)}h`;
  return `in ${Math.round(h / 24)}d`;
};

// ── Reminder flag dots ────────────────────────────────────────────────────
const ReminderDots: React.FC<{ flags: UpcomingReminder["reminders"] }> = ({
  flags,
}) => (
  <div className="flex items-center gap-1">
    {(
      [
        { key: "confirmation", label: "Conf" },
        { key: "reminder24h", label: "24h" },
        { key: "reminderDay", label: "AM" },
        { key: "reminder30min", label: "30m" },
      ] as const
    ).map(({ key, label }) => (
      <span
        key={key}
        title={`${label}: ${flags[key] ? "sent" : "pending"}`}
        className={`text-[9px] font-bold px-1 py-0.5 rounded
          ${
            flags[key]
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
              : "bg-gray-100 text-gray-400 dark:bg-gray-800"
          }`}
      >
        {label}
      </span>
    ))}
  </div>
);

// ── Single reminder row ────────────────────────────────────────────────────
const ReminderRow: React.FC<{
  reminder: UpcomingReminder;
  onResend: (r: UpcomingReminder) => void;
}> = ({ reminder, onResend }) => {
  const isUrgent =
    new Date(reminder.scheduledAt).getTime() - Date.now() < 2 * 60 * 60 * 1000;

  return (
    <div
      className={`flex items-start sm:items-center gap-3 p-3 sm:p-4 rounded-xl border transition-all hover:shadow-sm
      ${
        isUrgent
          ? "border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10"
          : "border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900"
      }`}
    >
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 text-xs font-black text-blue-700 dark:text-blue-400">
        {reminder.lead.firstName?.[0] ?? "?"}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mb-1">
          <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
            {reminder.lead.firstName} {reminder.lead.lastName}
          </p>
          <span
            className={`text-[10px] font-bold ${isUrgent ? "text-amber-600 dark:text-amber-400" : "text-gray-400"}`}
          >
            {fmtRelative(reminder.scheduledAt)}
          </span>
        </div>
        <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
          {reminder.type.replace(/_/g, " ")} · {fmt(reminder.scheduledAt)}
        </p>
        {reminder.property && (
          <p className="text-[10px] text-blue-600 dark:text-blue-400 truncate mt-0.5">
            {reminder.property.title}
          </p>
        )}
        <div className="mt-1.5">
          <ReminderDots flags={reminder.reminders} />
        </div>
      </div>

      {/* Action */}
      <button
        onClick={() => onResend(reminder)}
        title="Resend reminder"
        className="flex-shrink-0 p-1.5 rounded-xl text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
      >
        <Send className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

// ── Scheduled campaign row ─────────────────────────────────────────────────
const CampaignRow: React.FC<{
  campaign: ScheduledCampaignSummary;
  onView: (id: string) => void;
}> = ({ campaign, onView }) => (
  <div className="flex items-center gap-3 p-3 sm:p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-sm transition-all">
    <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
      <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
        {campaign.name}
      </p>
      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
        {campaign._count.recipients} recipients ·{" "}
        {campaign.scheduledAt ? fmt(campaign.scheduledAt) : "—"}
      </p>
    </div>
    <div className="flex items-center gap-2 flex-shrink-0">
      <CampaignStatusBadge status={campaign.status} size="xs" />
      <button
        onClick={() => onView(campaign.id)}
        className="p-1.5 rounded-xl text-gray-300 dark:text-gray-600 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
);

// ── Main page ──────────────────────────────────────────────────────────────
export const SchedulePage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [days, setDays] = useState(7);
  const [resending, setResending] = useState<UpcomingReminder | null>(null);

  const { data, isLoading, isFetching, refetch } = useGetScheduleOverviewQuery(
    { days },
    { pollingInterval: 60_000 },
  );

  const [resendReminder, { isLoading: sending }] = useResendReminderMutation();

  const overview = data?.data;
  const reminders = overview?.reminders.items ?? [];
  const campaigns = overview?.campaigns.items ?? [];

  const handleResend = useCallback(
    async (appointmentId: string, stage: ReminderStage) => {
      try {
        const result = await resendReminder({ appointmentId, stage }).unwrap();
        toast.success?.(`Sent: ${result.data.results.join(", ")}`);
        setResending(null);
      } catch (err: unknown) {
        toast.error?.(err instanceof Error ? err.message : "Failed to send");
      }
    },
    [resendReminder, toast],
  );

  const pendingCount = overview
    ? overview.reminders.pending24h +
      overview.reminders.pendingDay +
      overview.reminders.pending30min
    : 0;

  return (
    <div className="max-w-full mx-auto space-y-4 sm:space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-blue-500" />
            Schedule
          </h1>
          <p className="text-[11px] sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Upcoming reminders and scheduled campaigns · auto-refreshes every
            minute
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="px-2.5 py-1.5 border border-gray-200 dark:border-gray-700 rounded-xl text-[11px] sm:text-xs font-semibold bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 outline-none"
          >
            <option value={1}>Today</option>
            <option value={3}>Next 3 days</option>
            <option value={7}>Next 7 days</option>
            <option value={14}>Next 14 days</option>
          </select>
          <button
            onClick={() => refetch()}
            className="p-2 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Summary stat row */}
      {overview && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {[
            {
              label: "Total appointments",
              value: overview.reminders.total,
              color: "text-gray-900 dark:text-white",
              icon: CalendarClock,
            },
            {
              label: "Pending reminders",
              value: pendingCount,
              color:
                pendingCount > 0
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-emerald-600 dark:text-emerald-400",
              icon: Bell,
            },
            {
              label: "Scheduled campaigns",
              value: overview.campaigns.total,
              color: "text-blue-600 dark:text-blue-400",
              icon: Mail,
            },
            {
              label: "24h pending",
              value: overview.reminders.pending24h,
              color:
                overview.reminders.pending24h > 0
                  ? "text-red-600 dark:text-red-400"
                  : "text-emerald-600 dark:text-emerald-400",
              icon: Clock,
            },
          ].map(({ label, value, color, icon: Icon }) => (
            <div
              key={label}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-3"
            >
              <div className="flex items-start justify-between gap-1">
                <p className={`text-base sm:text-xl font-black ${color}`}>
                  {value}
                </p>
                <Icon
                  className={`w-3.5 h-3.5 ${color} opacity-60 mt-0.5 flex-shrink-0`}
                />
              </div>
              <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
                {label}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Two-column layout on lg */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        {/* Appointment reminders */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-widest flex items-center gap-2">
              <Bell className="w-3.5 h-3.5 text-amber-500" />
              Appointment Reminders
              {overview && overview.reminders.total > 0 && (
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                  {overview.reminders.total}
                </span>
              )}
            </h2>
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-20 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : reminders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mb-3" />
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                All clear!
              </p>
              <p className="text-xs text-gray-400 mt-1">
                No upcoming appointments in this period
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {reminders.map((r) => (
                <ReminderRow key={r.id} reminder={r} onResend={setResending} />
              ))}
            </div>
          )}
        </div>

        {/* Scheduled campaigns */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-widest flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-blue-500" />
              Scheduled Campaigns
              {overview && overview.campaigns.total > 0 && (
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  {overview.campaigns.total}
                </span>
              )}
            </h2>
            <button
              onClick={() => navigate("/crm/messaging/campaigns")}
              className="text-[11px] text-blue-500 hover:text-blue-700 font-semibold flex items-center gap-0.5"
            >
              View all <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : campaigns.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
              <Mail className="w-10 h-10 text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                No scheduled campaigns
              </p>
              <button
                onClick={() => navigate("/crm/messaging/campaigns")}
                className="mt-3 text-xs text-blue-500 hover:underline"
              >
                Go to campaigns →
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {campaigns.map((c) => (
                <CampaignRow
                  key={c.id}
                  campaign={c}
                  onView={(id) => navigate(`/crm/messaging/campaigns/${id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Resend modal */}
      <ResendReminderModal
        reminder={resending}
        isLoading={sending}
        onSend={handleResend}
        onClose={() => setResending(null)}
      />
    </div>
  );
};
