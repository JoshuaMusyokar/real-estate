// ─── timeAgo ──────────────────────────────────────────────────────────────────

import type { NotificationType } from "../types";

export function timeAgo(dateString: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(dateString).getTime()) / 1000,
  );
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateString).toLocaleDateString();
}

// ─── Type → visual config ─────────────────────────────────────────────────────

export interface NotificationVisual {
  bgClass: string; // icon-ring background
  iconClass: string; // icon stroke colour
  label: string; // tag text (e.g. "Lead")
  tagBg: string; // tag background
  tagText: string; // tag text colour
}

const VISUALS: Record<NotificationType, NotificationVisual> = {
  LEAD_ASSIGNED: {
    bgClass: "bg-blue-50 dark:bg-blue-900/30",
    iconClass: "text-blue-600 dark:text-blue-400",
    label: "Lead",
    tagBg: "bg-blue-50 dark:bg-blue-900/30",
    tagText: "text-blue-600 dark:text-blue-400",
  },
  APPOINTMENT_REMINDER: {
    bgClass: "bg-amber-50 dark:bg-amber-900/30",
    iconClass: "text-amber-600 dark:text-amber-400",
    label: "Appointment",
    tagBg: "bg-amber-50 dark:bg-amber-900/30",
    tagText: "text-amber-600 dark:text-amber-400",
  },
  NEW_PROPERTY_SUBMISSION: {
    bgClass: "bg-emerald-50 dark:bg-emerald-900/30",
    iconClass: "text-emerald-600 dark:text-emerald-400",
    label: "Property",
    tagBg: "bg-emerald-50 dark:bg-emerald-900/30",
    tagText: "text-emerald-600 dark:text-emerald-400",
  },
  PROPERTY_INQUIRY: {
    bgClass: "bg-violet-50 dark:bg-violet-900/30",
    iconClass: "text-violet-600 dark:text-violet-400",
    label: "Inquiry",
    tagBg: "bg-violet-50 dark:bg-violet-900/30",
    tagText: "text-violet-600 dark:text-violet-400",
  },
  SYSTEM_ALERT: {
    bgClass: "bg-gray-100 dark:bg-gray-800",
    iconClass: "text-gray-600 dark:text-gray-300",
    label: "System",
    tagBg: "bg-gray-100 dark:bg-gray-800",
    tagText: "text-gray-600 dark:text-gray-400",
  },
};

export function getNotificationVisual(
  type: NotificationType,
): NotificationVisual {
  return VISUALS[type] ?? VISUALS.SYSTEM_ALERT;
}
