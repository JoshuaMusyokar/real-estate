// ============================================
// ANALYTICS & REPORTING
// ============================================

import type { User } from "./user";

export interface AgentPerformance {
  id: string;
  userId: string;
  totalLeadsAssigned: number;
  totalLeadsClosed: number;
  activeLeads: number;
  conversionRate: number;
  averageResponseTime: number;
  appointmentsScheduled: number;
  appointmentsCompleted: number;
  noShowRate: number;
  totalRevenue: number;
  averageDealSize: number;
  averageSalesCycle: number;
  lastCalculatedAt: Date;
  user: User;
}

export interface PageView {
  id: string;
  propertyId?: string;
  pageUrl: string;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
  sessionId?: string;
  userId?: string;
  createdAt: Date;
}
