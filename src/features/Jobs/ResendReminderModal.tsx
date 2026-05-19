import { useState } from "react";
import { X, Send, Loader2 } from "lucide-react";
import type {
  UpcomingReminder,
  ReminderStage,
} from "../../types/messaging-management";

interface Props {
  reminder: UpcomingReminder | null;
  isLoading: boolean;
  onSend: (appointmentId: string, stage: ReminderStage) => void;
  onClose: () => void;
}

const STAGES: Array<{ id: ReminderStage; label: string; desc: string }> = [
  {
    id: "confirmation",
    label: "Confirmation",
    desc: "WhatsApp + SMS + Email with calendar invite",
  },
  {
    id: "reminder_24h",
    label: "24h Reminder",
    desc: "WhatsApp + Email — sent day before",
  },
  {
    id: "reminder_morning",
    label: "Morning Reminder",
    desc: "WhatsApp — sent morning of appointment",
  },
  {
    id: "reminder_30min",
    label: "30-min Reminder",
    desc: "SMS only — sent 30 mins before",
  },
];

export const ResendReminderModal: React.FC<Props> = ({
  reminder,
  isLoading,
  onSend,
  onClose,
}) => {
  const [stage, setStage] = useState<ReminderStage>("confirmation");
  if (!reminder) return null;

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-sm font-black text-gray-900 dark:text-white">
            Resend Reminder
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Appointment summary */}
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <p className="text-xs font-bold text-gray-900 dark:text-white">
              {reminder.lead.firstName} {reminder.lead.lastName}
            </p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
              {reminder.type.replace(/_/g, " ")} ·{" "}
              {fmtDate(reminder.scheduledAt)}
            </p>
            {reminder.property && (
              <p className="text-[11px] text-blue-600 dark:text-blue-400 mt-0.5">
                {reminder.property.title}
              </p>
            )}
          </div>

          {/* Stage selection */}
          <div className="space-y-2">
            <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Select reminder stage
            </p>
            {STAGES.map(({ id, label, desc }) => (
              <button
                key={id}
                type="button"
                onClick={() => setStage(id)}
                className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all
                  ${
                    stage === id
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500"
                      : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700"
                  }`}
              >
                <div
                  className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 transition-all
                  ${stage === id ? "border-blue-600 bg-blue-600" : "border-gray-300 dark:border-gray-600"}`}
                />
                <div>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">
                    {label}
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                    {desc}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2.5 px-4 py-3 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={onClose}
            className="flex-1 sm:flex-none sm:w-24 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSend(reminder.id, stage)}
            disabled={isLoading}
            className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Sending…
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" /> Send Reminder
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
