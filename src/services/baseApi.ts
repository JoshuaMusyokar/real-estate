import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store/store";
import { logout } from "../store/slices/authSlice";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query";

const baseQuery = fetchBaseQuery({
  // baseUrl:
  //   import.meta.env.VITE_API_BASE_URL ||
  //   "https://api.bengalproperty.com/api/v1",
  baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    headers.set("content-type", "application/json");
    return headers;
  },
  credentials: "include",
});

// Enhanced base query with token refresh and auto logout
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  object,
  FetchBaseQueryMeta
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  // Check for 401 Unauthorized or 403 Forbidden errors
  if (
    result.error &&
    (result.error.status === 401 || result.error.status === 403)
  ) {
    console.warn("Token expired or invalid, logging out...");
    api.dispatch(logout());

    // if (typeof window !== "undefined") {
    //   window.location.href = "/signin?session=expired";
    // }

    return result;
  }

  // Handle other common errors
  if (result.error) {
    const errorData = result.error.data as { message?: string; error?: string };
    if (
      errorData?.message?.includes("token") ||
      errorData?.error?.includes("token")
    ) {
      console.warn("Token validation failed, logging out...");
      api.dispatch(logout());

      // if (typeof window !== "undefined") {
      //   window.location.href = "/signin?session=invalid";
      // }
    }
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
    "Appointment",
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
