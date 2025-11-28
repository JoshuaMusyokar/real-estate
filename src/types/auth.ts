import type { Permission, Role } from "./rbac";
import type { User } from "./user";

export interface LoginRequest {
  email: string;
  password: string;
  twoFactorCode?: string;
}

export interface RegisterRequest {
  email: string;
  phone: string | null;
  password: string;
  firstName: string;
  lastName: string;
  roleName: string;
}

export interface AuthResponse {
  success: boolean;
  user: Omit<User, "password" | "twoFactorSecret">;
  token: string;
  refreshToken: string;
  requiresTwoFactor?: boolean;
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: Role;
  permissions?: Permission;
  exp: number;
  iat: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface TwoFactorSetupResponse {
  secret: string;
  qrCodeUrl: string;
}

export interface TwoFactorVerifyRequest {
  code: string;
}
