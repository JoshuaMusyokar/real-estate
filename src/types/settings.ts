// ============================================
// SYSTEM SETTINGS & CONFIGURATION
// ============================================

import type { User } from "./user";

export interface SystemSettings {
  id: string;
  key: string;
  value: any;
  description?: string;
  updatedAt: Date;
}

export interface AuditLog {
  id: string;
  userId?: string;
  action: string;
  entity: string;
  entityId: string;
  changes?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  user?: User;
}
