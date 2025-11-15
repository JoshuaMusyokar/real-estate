// ============================================
// SYSTEM SETTINGS & CONFIGURATION
// ============================================

import type { User } from "./user";

export type AuditValue = string | number | boolean | null;

export interface AuditChangeSet {
  before?: Record<string, AuditValue>;
  after?: Record<string, AuditValue>;
}

export interface SystemSettings {
  id: string;
  key: string;
  value: string | number;
  description?: string;
  updatedAt: Date;
}

export interface AuditLog {
  id: string;
  userId?: string;
  action: string;
  entity: string;
  entityId: string;
  changes?: AuditChangeSet;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  user?: User;
}
