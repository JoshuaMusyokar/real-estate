import type { ResCity, ResLocality } from "./location";
import type { ResRole } from "./rbac";
import type { UserStatus } from "./user";

// Add to your existing typestype
export interface AgentForAssignment {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: ResRole | null;
  status: UserStatus;
  cities: ResCity[];
  localities: ResLocality[];
  // Performance metrics
  activeLeadsCount: number;
  totalLeadsClosed: number;
  conversionRate: number;
  averageResponseTime: number;
  managerId?: string;
  // Property relationships
  ownedPropertiesCount: number;
  assignedAppointmentsCount: number;
  // Availability indicators
  isAvailable?: boolean;
  currentWorkload: "low" | "medium" | "high";
  lastActive?: Date;
}

export interface AgentResponse<T> {
  success: boolean;
  data: T;
}

export interface AgentsFilter {
  city?: string;
  locality?: string;
  propertyTypeId?: string;
  includePerformance?: boolean;
  onlyAvailable?: boolean;
  search?: string;
  leadCityId?: string;
}
