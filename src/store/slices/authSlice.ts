import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User, TokenPayload } from "../../types";
export interface AuthState {
  token: string | null;
  user: Omit<User, "password" | "twoFactorSecret"> | null;
  isAuthenticated: boolean;
  tokenExpiry: number | null;
}

// Helper function to decode JWT token and get expiration
const decodeToken = (token: string): TokenPayload | null => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload as TokenPayload;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

// Check if token is expired
const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;

  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};

// Get stored token with validation
const getValidatedToken = (): string | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  // Check if token is expired
  if (isTokenExpired(token)) {
    console.warn("Stored token is expired, removing...");
    localStorage.removeItem("token");
    return null;
  }

  return token;
};

const initialState: AuthState = {
  token: getValidatedToken(),
  user: null,
  isAuthenticated: !!getValidatedToken(),
  tokenExpiry: getValidatedToken()
    ? decodeToken(getValidatedToken()!)?.exp || null
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: Omit<User, "password" | "twoFactorSecret">;
        token: string;
      }>
    ) => {
      const { user, token } = action.payload;
      const decoded = decodeToken(token);

      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.tokenExpiry = decoded?.exp || null;

      localStorage.setItem("token", token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.tokenExpiry = null;

      localStorage.removeItem("token");
      sessionStorage.clear();
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.tokenExpiry = null;

      localStorage.removeItem("token");
    },
    validateToken: (state) => {
      if (state.token && isTokenExpired(state.token)) {
        console.warn("Token validation failed - token expired");
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.tokenExpiry = null;
        localStorage.removeItem("token");
      }
    },
  },
});

export const { setCredentials, logout, updateUser, clearAuth, validateToken } =
  authSlice.actions;
export default authSlice.reducer;
