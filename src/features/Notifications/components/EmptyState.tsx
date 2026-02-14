// ─── EmptyState ───────────────────────────────────────────────────────────────

import type { NotificationType } from "../../../types";
import { Icons } from "../../../utils/ntf-icons-utils";

type FilterId = "ALL" | "UNREAD" | NotificationType;

export function EmptyState({ filter }: { filter: FilterId }) {
  const copy: Record<string, { title: string; sub: string }> = {
    ALL: { title: "You're all caught up", sub: "No notifications to show" },
    UNREAD: {
      title: "Nothing unread",
      sub: "All your notifications have been read",
    },
    LEAD_ASSIGNED: {
      title: "No lead notifications",
      sub: "Lead assignment updates will appear here",
    },
    PROPERTY_INQUIRY: {
      title: "No inquiries",
      sub: "Property inquiry updates will appear here",
    },
    NEW_PROPERTY_SUBMISSION: {
      title: "No property updates",
      sub: "Property submission updates will appear here",
    },
    APPOINTMENT_REMINDER: {
      title: "No appointments",
      sub: "Appointment reminders will appear here",
    },
    SYSTEM_ALERT: {
      title: "No system alerts",
      sub: "System notifications will appear here",
    },
  };
  const { title, sub } = copy[filter] ?? copy.ALL;

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
        <Icons.EmptyBell className="text-gray-300 dark:text-gray-600" />
      </div>
      <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300">
        {title}
      </h3>
      <p className="text-sm text-gray-400 dark:text-gray-500 mt-1 max-w-xs">
        {sub}
      </p>
    </div>
  );
}
