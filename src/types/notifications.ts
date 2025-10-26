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

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  metadata?: any;
  createdAt: Date;
  readAt?: Date;
  user: User;
}
