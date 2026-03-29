import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store/store";
import { logout } from "../store/slices/authSlice";
import { addToast } from "../store/slices/toastSlice";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query";
import { parseApiError } from "../utils/Apierror";

const baseQuery = fetchBaseQuery({
  // baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1",
  baseUrl:
    import.meta.env.VITE_API_BASE_URL ||
    "https://api.property4india.com/api/v1",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    // Do NOT set content-type globally — multipart/form-data needs to set
    // its own boundary and will break if we force application/json here.
    return headers;
  },
  credentials: "include",
});

/**
 * Extra options supported by our base query.
 *
 * @example
 * // Suppress all error toasts for this call (component handles errors itself)
 * useGetSomethingQuery(arg, { suppressErrorToast: true })
 *
 * @example
 * // Only suppress the toast when the server returns 404
 * useGetSomethingQuery(arg, { suppressStatusCodes: [404] })
 */
export interface BaseQueryExtraOptions {
  suppressErrorToast?: boolean;
  suppressStatusCodes?: number[];
}

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  BaseQueryExtraOptions,
  FetchBaseQueryMeta
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    const parsed = parseApiError(result.error);

    // ── 401: session expired — log out + warn user ───────────────────────────
    if (parsed.status === 401) {
      api.dispatch(logout());
      api.dispatch(
        addToast({
          type: "warning",
          title: "Session Expired",
          // Use the backend's own message if it differs from the default,
          // otherwise fall back to a friendly prompt.
          message:
            parsed.detail !== "Session Expired"
              ? parsed.detail
              : "Please sign in again to continue.",
        }),
      );
      return result;
    }

    // ── 403: forbidden — back-end message already explains why ───────────────
    // Do NOT log out: a 403 means the token is valid but the action isn't
    // permitted (e.g. role restriction). The user should stay logged in and
    // see the reason. Only log out on 401 (token invalid/expired).
    if (parsed.status === 403) {
      if (!extraOptions?.suppressErrorToast) {
        api.dispatch(
          addToast({
            type: "error",
            title: parsed.title, // "Access Denied"
            message: parsed.detail, // backend's ForbiddenError message
          }),
        );
      }
      return result;
    }

    // ── Component opted out of automatic toast ───────────────────────────────
    if (extraOptions?.suppressErrorToast) return result;
    if (extraOptions?.suppressStatusCodes?.includes(parsed.status))
      return result;

    // ── Everything else: show automatic toast ────────────────────────────────
    api.dispatch(
      addToast({
        type: parsed.status >= 500 ? "error" : "warning",
        title: parsed.title,
        message: parsed.detail,
      }),
    );
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  tagTypes: [
    "Auth",
    "User",
    "Property",
    "Amenity",
    "Lead",
    "Appointment",
    "Category",
    "Notification",
    "Activity",
    "Note",
    "Workflow",
    "FormSubmission",
    "Favorite",
    "AppointmentStats",
    "CalendarEvent",
    "UserStats",
    "Agent",
    "LandingPage",
    "Role",
    "Permission",
    "Location",
    "City",
    "Locality",
    "LocalityRating",
    "LocalityStats",
    "PropertyReview",
    "PropertyReviewStats",
    "UserReviews",
    "TopRatedProperties",
    "PropertyStats",
    "PropertySubType",
    "PropertyType",
    "Content",
    "Media",
    "PropertyAnalytics",
    "LeadAnalytics",
    "ConversionAnalytics",
    "RevenueAnalytics",
    "PerformanceAnalytics",
    "TopLists",
    "TrafficAnalytics",
    "Export",
    "Dashboard",
    "Comparison",
  ],
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});
