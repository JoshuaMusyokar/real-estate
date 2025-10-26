import type { Role, User } from "./user";

// types/auth.types.ts
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
  role: Role;
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
  permissions?: any;
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
