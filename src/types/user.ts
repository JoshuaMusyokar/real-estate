export type Role =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "SALES_MANAGER"
  | "SALES_AGENT"
  | "MARKETING"
  | "VIEWER"
  | "PROPERTY_OWNER"
  | "BUYER"
  | "AGENT_EXTERNAL";

export type UserStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "SUSPENDED"
  | "PENDING_VERIFICATION";

export interface User {
  id: string;
  email: string;
  phone: string | null;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
  status: UserStatus;
  avatar: string | null;
  permissions: any | null;
  allowedCities: string[];
  allowedLocalities: string[];
  twoFactorEnabled: boolean;
  twoFactorSecret: string | null;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCreateInput {
  email: string;
  phone?: string | null;
  password: string;
  firstName: string;
  lastName: string;
  role: Role | null;
  status: UserStatus | null;
  avatar: string | null;
  permissions?: any;
  allowedCities: string[] | null;
  allowedLocalities?: string[];
}

export interface UserUpdateInput {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  role?: Role;
  status?: UserStatus;
  avatar?: string;
  permissions?: any;
  allowedCities?: string[];
  allowedLocalities?: string[];
  lastLoginAt?: Date;
}
