// ============================================
// NOTIFICATIONS
// ============================================

export type NotificationType =
  | "LEAD_ASSIGNED"
  | "APPOINTMENT_REMINDER"
  | "NEW_PROPERTY_SUBMISSION"
  | "PROPERTY_INQUIRY"
  | "SYSTEM_ALERT";

export type NotificationMetadataValue = string | number | boolean | null;

export interface NotificationMetadata {
  [key: string]:
    | NotificationMetadataValue
    | NotificationMetadataValue[]
    | NotificationMetadata;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  link: string | null;
  metadata: NotificationMetadata | null;
  createdAt: string; // ISO string from the wire
  readAt: string | null;
}

export interface NotificationRes {
  notifications: Notification[];
  total: number;
  unreadCount: number;
}

export interface NotificationSearchFilters {
  limit?: number;
  offset?: number;
  unreadOnly?: boolean;
  type?: NotificationType; // optional single-type filter
}
