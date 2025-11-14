import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { addToast } from "../store/slices/toastSlice";

export const useToast = () => {
  const dispatch = useDispatch();

  const showToast = useCallback(
    (
      type: "success" | "error" | "warning" | "info",
      title: string,
      message?: string,
      duration?: number
    ) => {
      dispatch(
        addToast({
          type,
          title,
          message,
          duration,
        })
      );
    },
    [dispatch]
  );

  const success = useCallback(
    (title: string, message?: string, duration?: number) => {
      showToast("success", title, message, duration);
    },
    [showToast]
  );

  const error = useCallback(
    (title: string, message?: string, duration?: number) => {
      showToast("error", title, message, duration);
    },
    [showToast]
  );

  const warning = useCallback(
    (title: string, message?: string, duration?: number) => {
      showToast("warning", title, message, duration);
    },
    [showToast]
  );

  const info = useCallback(
    (title: string, message?: string, duration?: number) => {
      showToast("info", title, message, duration);
    },
    [showToast]
  );

  return {
    success,
    error,
    warning,
    info,
    showToast,
  };
};
