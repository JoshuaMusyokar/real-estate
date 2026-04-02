import type { AgentForAssignment } from "../types";

export const workloadColor = (w: string) =>
  ({
    low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    medium:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    high: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800",
  })[w] ??
  "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700";

export const statusColor = (s: string) =>
  ({
    ACTIVE:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    INACTIVE: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  })[s] ?? "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";

export const roleColor = (r?: string) =>
  ({
    AGENT:
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
    AGENT_STAFF:
      "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400",
    BUILDER:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400",
    BUILDER_STAFF:
      "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400",
    SALES_MANAGER:
      "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400",
    SALES_AGENT:
      "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/20 dark:text-violet-400",
  })[r ?? ""] ??
  "bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400";

export const roleLabel = (r?: string) =>
  ({
    AGENT: "Agent",
    AGENT_STAFF: "Agent Staff",
    BUILDER: "Builder",
    BUILDER_STAFF: "Builder Staff",
    SALES_MANAGER: "Sales Mgr",
    SALES_AGENT: "Sales Agent",
  })[r ?? ""] ??
  r ??
  "";

export function performanceScore(a: AgentForAssignment): number {
  return Math.round(
    a.conversionRate * 40 +
      Math.min(a.totalLeadsClosed / 100, 1) * 30 +
      (a.currentWorkload === "low"
        ? 20
        : a.currentWorkload === "medium"
          ? 10
          : 0) +
      Math.min(a.ownedPropertiesCount / 20, 1) * 10,
  );
}

export function agentInitials(a: AgentForAssignment): string {
  return `${a.firstName[0]}${a.lastName?.[0] ?? ""}`.toUpperCase();
}
