/**
 * The shape our central error handler sends for ALL errors:
 *   { success: false, message: string }
 *   { success: false, message: string, errors: [{ field, message }] }   ← Zod validation
 */
export interface ApiErrorBody {
  success: false;
  message?: string;
  errors?: { field: string; message: string }[];

  // ── Legacy / non-standard shape (raw Zod throw or old handler) ────────────
  // Some endpoints still send this shape before they've been refactored.
  // We normalise it transparently so the UI always gets a clean ParsedApiError.
  error?: string;
  details?: { path: string; message: string }[];
  statusCode?: number;
  stack?: string; // never shown to user, silently ignored
}

export interface ParsedApiError {
  title: string;
  detail: string;
  status: number;
  fieldErrors?: { field: string; message: string }[];
}

const STATUS_TITLES: Record<number, string> = {
  400: "Invalid Request",
  401: "Session Expired",
  403: "Access Denied",
  404: "Not Found",
  409: "Conflict",
  422: "Validation Failed",
  429: "Too Many Requests",
  500: "Server Error",
  503: "Service Unavailable",
};

export function parseApiError(error: unknown): ParsedApiError {
  // ── Network failure ───────────────────────────────────────────────────────
  if (isRtkFetchError(error)) {
    return {
      title: "Network Error",
      detail: "Could not reach the server. Please check your connection.",
      status: 0,
    };
  }

  // ── HTTP error with a response body ──────────────────────────────────────
  if (isRtkHttpError(error)) {
    const status = typeof error.status === "number" ? error.status : 500;
    const body = error.data as ApiErrorBody | undefined;
    const title = STATUS_TITLES[status] ?? "Something went wrong";

    // ── Standard shape: { errors: [{ field, message }] } ─────────────────
    if (body?.errors?.length) {
      const detail = body.errors
        .map((e) =>
          e.field ? `${capitalize(e.field)}: ${e.message}` : e.message,
        )
        .join("\n");
      return { title, detail, status, fieldErrors: body.errors };
    }

    // ── Legacy shape: { details: [{ path, message }] } ───────────────────
    // Produced by raw Zod throws or endpoints not yet on the central handler.
    // Normalise to the same fieldErrors shape so the UI stays consistent.
    if (body?.details?.length) {
      const fieldErrors = body.details.map((d) => ({
        field: d.path,
        message: d.message,
      }));
      const detail = fieldErrors
        .map((e) =>
          e.field ? `${capitalize(e.field)}: ${e.message}` : e.message,
        )
        .join("\n");
      return { title, detail, status, fieldErrors };
    }

    // ── Standard message field ────────────────────────────────────────────
    if (body?.message) {
      return { title, detail: body.message, status };
    }

    // ── Legacy: { error: "..." } instead of { message: "..." } ───────────
    if (body?.error) {
      return { title, detail: body.error, status };
    }

    // ── Unknown body ──────────────────────────────────────────────────────
    return {
      title,
      detail: "An unexpected error occurred. Please try again.",
      status,
    };
  }

  // ── Non-RTK error ─────────────────────────────────────────────────────────
  return {
    title: "Unexpected Error",
    detail:
      error instanceof Error
        ? error.message
        : "Something went wrong. Please try again.",
    status: 0,
  };
}

// ─── Type Guards ──────────────────────────────────────────────────────────────

function isRtkFetchError(
  error: unknown,
): error is { status: "FETCH_ERROR"; error: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    (error as any).status === "FETCH_ERROR"
  );
}

function isRtkHttpError(
  error: unknown,
): error is { status: number; data: unknown } {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof (error as any).status === "number"
  );
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
