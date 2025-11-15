// ============================================
// NOTIFICATIONS
// ============================================

import type { User } from "./user";

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
  link?: string;
  metadata?: NotificationMetadata;
  createdAt: Date;
  readAt?: Date;
  user: User;
}
