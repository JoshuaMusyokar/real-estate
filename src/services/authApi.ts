
import { baseApi } from "./baseApi";
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RefreshTokenRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  User,
} from "../types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),

    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Auth"],
    }),

    refreshToken: builder.mutation<
      { token: string; refreshToken: string },
      RefreshTokenRequest
    >({
      query: (refreshToken) => ({
        url: "/auth/refresh-token",
        method: "POST",
        body: refreshToken,
      }),
    }),

    forgotPassword: builder.mutation<
      { success: boolean; message: string },
      ForgotPasswordRequest
    >({
      query: (email) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: email,
      }),
    }),

    resetPassword: builder.mutation<
      { success: boolean; message: string },
      ResetPasswordRequest
    >({
      query: (resetData) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: resetData,
      }),
    }),

    getProfile: builder.query<{ success: boolean; data: User }, void>({
      query: () => "/auth/profile",
      providesTags: ["User"],
    }),

    updateProfile: builder.mutation<
      { success: boolean; data: User },
      Partial<User>
    >({
      query: (profileData) => ({
        url: "/auth/profile",
        method: "PUT",
        body: profileData,
      }),
      invalidatesTags: ["User"],
    }),

    changePassword: builder.mutation<
      { success: boolean; message: string },
      { currentPassword: string; newPassword: string }
    >({
      query: (passwordData) => ({
        url: "/auth/change-password",
        method: "POST",
        body: passwordData,
      }),
    }),

    setupTwoFactor: builder.mutation<
      { success: boolean; data: { secret: string; qrCodeUrl: string } },
      void
    >({
      query: () => ({
        url: "/auth/2fa/setup",
        method: "POST",
      }),
    }),

    verifyTwoFactor: builder.mutation<
      { success: boolean; message: string },
      { code: string }
    >({
      query: (verificationData) => ({
        url: "/auth/2fa/verify",
        method: "POST",
        body: verificationData,
      }),
    }),

    disableTwoFactor: builder.mutation<
      { success: boolean; message: string },
      { code: string }
    >({
      query: (verificationData) => ({
        url: "/auth/2fa/disable",
        method: "POST",
        body: verificationData,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshTokenMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useSetupTwoFactorMutation,
  useVerifyTwoFactorMutation,
  useDisableTwoFactorMutation,
} = authApi;
