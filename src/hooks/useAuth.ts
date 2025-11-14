/* eslint-disable @typescript-eslint/no-unused-vars */
// src/hooks/useAuth.ts
import { useDispatch, useSelector } from "react-redux";
import {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
} from "../services/authApi";
import {
  setCredentials,
  logout,
  updateUser,
  validateToken,
} from "../store/slices/authSlice";
import { type RootState } from "../store/store";
import { tokenService } from "../services/tokenService";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import type {
  User,
  Role,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from "../types";

interface UseAuthReturn {
  // State
  user: Omit<User, "password" | "twoFactorSecret"> | null;
  token: string | null;
  isAuthenticated: boolean;

  // Actions
  login: (credentials: LoginRequest) => Promise<AuthResponse>;
  register: (userData: RegisterRequest) => Promise<AuthResponse>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  refetchProfile: () => void;

  // Token management
  isTokenValid: () => boolean;

  // Permission checks
  hasRole: (role: Role) => boolean;
  hasAnyRole: (roles: Role[]) => boolean;
  canAccess: (requiredRole?: Role) => boolean;

  // Loading states
  isLoading: boolean;
  error: unknown;
}

export const useAuth = (): UseAuthReturn => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authState = useSelector((state: RootState) => state.auth);

  const [login, loginResult] = useLoginMutation();
  const [register, registerResult] = useRegisterMutation();
  const {
    data: profile,
    refetch: refetchProfile,
    error: profileError,
  } = useGetProfileQuery(undefined, {
    skip: !authState.isAuthenticated,
  });

  // Handle token validation on mount
  useEffect(() => {
    dispatch(validateToken());
  }, [dispatch]);

  useEffect(() => {
    console.log("user", authState);
  }, [authState]);

  // Handle profile fetch errors (likely token issues)
  useEffect(() => {
    if (profileError) {
      console.error("Profile fetch failed, likely token issue:", profileError);
      handleAutoLogout();
    }
  }, [profileError]);

  const handleAutoLogout = (): void => {
    dispatch(logout());
    tokenService.triggerLogout();
    navigate("/signin?session=expired");
  };

  const handleLogin = async (
    credentials: LoginRequest
  ): Promise<AuthResponse> => {
    try {
      const result = await login(credentials).unwrap();
      if (result.success) {
        dispatch(setCredentials({ user: result.user, token: result.token }));
      }
      return result;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const handleRegister = async (
    userData: RegisterRequest
  ): Promise<AuthResponse> => {
    try {
      const result = await register(userData).unwrap();
      if (result.success) {
        dispatch(setCredentials({ user: result.user, token: result.token }));
      }
      return result;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const handleLogout = (): void => {
    dispatch(logout());
    tokenService.triggerLogout();
    navigate("/signin");
  };

  const handleUpdateUser = (userData: Partial<User>): void => {
    dispatch(updateUser(userData));
  };

  // Permission checking functions
  const hasRole = (role: Role): boolean => {
    return authState.user?.role === role;
  };

  const hasAnyRole = (roles: Role[]): boolean => {
    return !!authState.user?.role && roles.includes(authState.user.role);
  };

  const canAccess = (requiredRole?: Role): boolean => {
    if (!requiredRole) return true;
    return authState.user?.role === requiredRole;
  };

  // Token validation
  const isTokenValid = (): boolean => {
    return tokenService.isTokenValid(authState.token);
  };

  return {
    // State
    user: authState.user,
    token: authState.token,
    isAuthenticated: authState.isAuthenticated && isTokenValid(),

    // Actions
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    updateUser: handleUpdateUser,
    refetchProfile,

    // Token management
    isTokenValid,

    // Permission checks
    hasRole,
    hasAnyRole,
    canAccess,

    // Loading states
    isLoading: loginResult.isLoading || registerResult.isLoading,
    error: loginResult.error || registerResult.error,
  };
};
