import type { LeadPriority, LeadSource, LeadStage } from "../types";

export const LEAD_SOURCES: LeadSource[] = [
  "WEBSITE_INQUIRY",
  "PROPERTY_INQUIRY",
  "CALL_BACK_REQUEST",
  "SCHEDULE_VIEWING",
  "NEWSLETTER",
  "LANDING_PAGE",
  "MANUAL_ENTRY",
  "PHONE_CALL",
  "WALK_IN",
  "IMPORT",
  "REFERRAL",
  "SOCIAL_MEDIA",
];
export const LEAD_STAGES: LeadStage[] = [
  "NEW_LEAD",
  "CONTACTED",
  "QUALIFIED",
  "VIEWING_SCHEDULED",
  "NEGOTIATION",
  "DEAL_CLOSED_WON",
  "DEAL_CLOSED_LOST",
];
export const LEAD_PRIORITIES: LeadPriority[] = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "URGENT",
];

export const getStageColor = (stage: LeadStage): string => {
  const colors: Record<LeadStage, string> = {
    NEW_LEAD: "bg-blue-100 text-blue-700",
    CONTACTED: "bg-purple-100 text-purple-700",
    QUALIFIED: "bg-cyan-100 text-cyan-700",
    VIEWING_SCHEDULED: "bg-amber-100 text-amber-700",
    NEGOTIATION: "bg-orange-100 text-orange-700",
    DEAL_CLOSED_WON: "bg-green-100 text-green-700",
    DEAL_CLOSED_LOST: "bg-red-100 text-red-700",
  };
  return colors[stage] || "bg-gray-100 text-gray-700";
};

export const getPriorityColor = (priority: LeadPriority): string => {
  const colors: Record<LeadPriority, string> = {
    LOW: "bg-gray-100 text-gray-700",
    MEDIUM: "bg-blue-100 text-blue-700",
    HIGH: "bg-orange-100 text-orange-700",
    URGENT: "bg-red-100 text-red-700",
  };
  return colors[priority];
};

export const STAGES: { value: LeadStage; label: string; color: string }[] = [
  { value: "NEW_LEAD", label: "New Lead", color: "bg-blue-500" },
  { value: "CONTACTED", label: "Contacted", color: "bg-purple-500" },
  { value: "QUALIFIED", label: "Qualified", color: "bg-cyan-500" },
  {
    value: "VIEWING_SCHEDULED",
    label: "Viewing Scheduled",
    color: "bg-amber-500",
  },
  { value: "NEGOTIATION", label: "Negotiation", color: "bg-orange-500" },
  { value: "DEAL_CLOSED_WON", label: "Won", color: "bg-green-500" },
  { value: "DEAL_CLOSED_LOST", label: "Lost", color: "bg-red-500" },
];
