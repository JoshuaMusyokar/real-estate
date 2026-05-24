import { logger } from "./logger";

export function setupGlobalErrorHandlers() {
  // ── Uncaught synchronous JS errors ──────────────────────────────────────
  window.addEventListener("error", (event) => {
    logger.error("Uncaught global error", {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack,
    });
  });

  // ── Unhandled promise rejections ─────────────────────────────────────────
  window.addEventListener("unhandledrejection", (event) => {
    logger.error("Unhandled promise rejection", {
      reason:
        event.reason instanceof Error
          ? { message: event.reason.message, stack: event.reason.stack }
          : event.reason,
    });
  });

  // ── Log env info on boot (helps confirm which build is running) ──────────
  logger.info("App booted", {
    mode: import.meta.env.MODE,
    base: import.meta.env.BASE_URL,
    buildTime: import.meta.env.VITE_BUILD_TIME ?? "not set",
  });
}
