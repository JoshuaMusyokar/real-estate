import type { AgentPerformance } from "./analytics";
import type { ResCity, ResLocality } from "./location";
import type { Permission, ResRole, Role } from "./rbac";

// export type Role =
//   | "SUPER_ADMIN"
//   | "ADMIN"
//   | "SALES_MANAGER"
//   | "SALES_AGENT"
//   | "MARKETING"
//   | "VIEWER"
//   | "PROPERTY_OWNER" // Maps to "Owner"
//   | "BUYER"
//   | "AGENT_EXTERNAL" // Maps to "Broker"
//   | "BUILDER"; // New role for "Builder"

export type UserStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "SUSPENDED"
  | "PENDING_VERIFICATION";

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export interface User {
  id: string;
  email: string;
  phone: string | null;
  password: string;
  firstName: string;
  lastName: string;
  roleId: string;
  role: ResRole;
  status: UserStatus;
  companyName: string | null;
  reraNumber: string | null;
  gstNumber: string | null;
  avatar: string | null;
  permissions: Permission | null;
  allowedCities: string[];
  allowedLocalities: string[];
  twoFactorEnabled: boolean;
  twoFactorSecret: string | null;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
export interface CreateUserRequest {
  email: string;
  phone?: string;
  companyName?: string;
  reraNumber?: string;
  gstNumber?: string;
  password: string;
  firstName: string;
  lastName: string;
  roleId: string;
  status?: UserStatus;
  avatar?: string;
  permissions?: Permission;
  cities: string[] | null;
  localities?: string[];
}

export interface UpdateUserRequest {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  reraNumber?: string;
  gstNumber?: string;
  roleId?: string;
  status?: UserStatus;
  avatar?: string;
  permissions?: Permission;
  cities: string[] | null;
  localities?: string[];
}

export interface UserFilter {
  roleId?: string[];
  roleNames?: string[];
  status?: UserStatus[];
  search?: string;
  city?: string;
  locality?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface UsersResponse {
  users: UserResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export interface Manager {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface UserCreateInput {
  email: string;
  phone?: string | null;
  password: string;
  firstName: string;
  lastName: string;
  companyName: string | null;
  reraNumber: string | null;
  gstNumber: string | null;
  managerId: string | null;
  role: Role | null;
  status: UserStatus | null;
  avatar: string | null;
  permissions?: Permission;
  allowedCities: string[] | null;
  allowedLocalities?: string[];
}

export interface UserUpdateInput {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  managerId: string | null;
  companyName: string | null;
  reraNumber: string | null;
  gstNumber: string | null;
  role?: Role;
  status?: UserStatus;
  avatar?: string;
  permissions?: Permission;
  allowedCities?: string[];
  allowedLocalities?: string[];
  lastLoginAt?: Date;
}

// Add to your existing types
export interface UserResponse {
  id: string;
  email: string;
  phone: string | null;
  firstName: string;
  lastName: string;
  roleId: string;
  role: ResRole;
  companyName: string | null;
  reraNumber: string | null;
  gstNumber: string | null;
  status: UserStatus;
  managerId: string | null;
  manager?: Manager;
  avatar: string | null;
  permissions?: Permission;
  cities: ResCity[];
  localities: ResLocality[];
  twoFactorEnabled: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  agentPerformance?: AgentPerformance;
}

// export interface User {
//   id: string;
//   email: string;
//   phone: string | null;
//   password: string;
//   firstName: string;
//   lastName: string;
//   role: Role;
//   status: UserStatus;
//   avatar: string | null;
//   permissions: Permission | null;
//   allowedCities: string[];
//   allowedLocalities: string[];
//   twoFactorEnabled: boolean;
//   twoFactorSecret: string | null;
//   lastLoginAt: Date | null;
//   createdAt: Date;
//   updatedAt: Date;
// }

export interface UserCreateInput {
  email: string;
  phone?: string | null;
  password: string;
  firstName: string;
  lastName: string;
  role: Role | null;
  companyName: string | null;
  reraNumber: string | null;
  gstNumber: string | null;
  managerId: string | null;
  status: UserStatus | null;
  avatar: string | null;
  permissions?: Permission;
  allowedCities: string[] | null;
  allowedLocalities?: string[];
}

export interface UserUpdateInput {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  managerId: string | null;
  companyName: string | null;
  reraNumber: string | null;
  gstNumber: string | null;
  role?: Role;
  status?: UserStatus;
  avatar?: string;
  permissions?: Permission;
  allowedCities?: string[];
  allowedLocalities?: string[];
  lastLoginAt?: Date;
}
// Add these to your existing types

export interface UserStats {
  total: number;
  byRole: Record<string, number>;
  byStatus: Record<UserStatus, number>;
  activeToday: number;
  newThisWeek: number;
  verified: number;
  withTwoFactor: number;
}

export interface BulkUserOperation {
  userIds: string[];
  operation:
    | "activate"
    | "deactivate"
    | "delete"
    | "change-role"
    | "resend-verification";
  role?: Role;
}

// ✅ Common structure for all activity metadata
export interface BaseChange<T> {
  previous?: Partial<T>;
  current?: Partial<T>;
  changedFields?: (keyof T)[];
}

// ✅ Typed entity references
export type EntityType =
  | "user"
  | "property"
  | "listing"
  | "transaction"
  | "settings"
  | "role"
  | "permission"
  | "city"
  | "locality"
  | "system";

// ✅ Context information (always typed)
export interface ActivityContext {
  entityType?: EntityType;
  entityId?: string;
  ipAddress?: string;
  userAgent?: string;
  location?: string; // optional, e.g., for geo info
  device?: string; // e.g., "iPhone 15", "MacBook Pro"
}

export interface ActivityMetadata<T = unknown> extends ActivityContext {
  change?: BaseChange<T>;
  extra?: Record<string, string | number | boolean | null | undefined>;
}

export interface UserActivity<T = unknown> {
  id: string;
  userId: string;
  action:
    | "CREATE"
    | "UPDATE"
    | "DELETE"
    | "LOGIN"
    | "LOGOUT"
    | "ASSIGN_ROLE"
    | "RESET_PASSWORD"
    | "OTHER";
  description?: string;
  metadata?: ActivityMetadata<T>;
  createdAt: string; // ISO timestamp
}
// export interface UserActivity {
//   id: string;
//   action: string;
//   description: string;
//   ipAddress?: string;
//   userAgent?: string;
//   createdAt: Date;
//   metadata?: any;
// }

export interface ImportResult {
  processed: number;
  successful: number;
  errors: string[];
  failedRows: number[];
}
export interface ExportConfig {
  format: "csv" | "excel" | "json";
  fields: {
    basic: boolean;
    contact: boolean;
    role: boolean;
    status: boolean;
    dates: boolean;
    permissions: boolean;
  };
}

export interface ExportRequest {
  filters?: UserFilter;
  config: ExportConfig;
}
