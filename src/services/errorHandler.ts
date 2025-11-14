/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  isRejectedWithValue,
  type Middleware,
  type MiddlewareAPI,
} from "@reduxjs/toolkit";
import { addToast } from "../store/slices/toastSlice";
import type { RootState } from "../store/store";

export function rtkQueryErrorLogger(api: MiddlewareAPI) {
  return (next: any) => (action: any) => {
    if (isRejectedWithValue(action)) {
      const error = action.payload as {
        data?: { error?: string; message?: string };
        status?: number;
      };

      let errorMessage = "An unexpected error occurred";

      if (typeof error?.data?.error === "string") {
        errorMessage = error.data.error;
      } else if (typeof error?.data?.message === "string") {
        errorMessage = error.data.message;
      } else if (error?.status === 401) {
        errorMessage = "Please log in to continue";
      } else if (error?.status === 403) {
        errorMessage = "You do not have permission to perform this action";
      } else if (error?.status === 404) {
        errorMessage = "The requested resource was not found";
      } else if (error?.status === 500) {
        errorMessage = "Internal server error";
      }

      api.dispatch(
        addToast({
          type: "error",
          title: "Error",
          message: errorMessage,
          duration: 7000,
        })
      );
    }

    return next(action);
  };
}
