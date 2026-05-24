// src/utils/logger.ts
// Production-safe logger that sends errors to console AND a remote endpoint (optional)

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: unknown;
  timestamp: string;
  url: string;
  userAgent: string;
}

const isDev = import.meta.env.MODE === "development"; // Vite
// const isDev = process.env.NODE_ENV === 'development'; // CRA — swap if needed

function createEntry(
  level: LogLevel,
  message: string,
  data?: unknown,
): LogEntry {
  return {
    level,
    message,
    data,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
  };
}

function send(entry: LogEntry) {
  // ─── Console output ──────────────────────────────────────────────────────
  const style = {
    debug: "color: #888",
    info: "color: #4fc3f7",
    warn: "color: #ffb74d",
    error: "color: #ef5350; font-weight: bold",
  }[entry.level];

  if (isDev || entry.level === "error" || entry.level === "warn") {
    console[entry.level === "debug" ? "log" : entry.level](
      `%c[${entry.level.toUpperCase()}] ${entry.timestamp}`,
      style,
      "\n",
      entry.message,
      entry.data !== undefined ? "\nData:" : "",
      entry.data ?? "",
    );
  }

  // ─── Optional: send errors to a remote endpoint ───────────────────────────
  // Uncomment and set VITE_LOG_ENDPOINT in your .env.production to enable
  /*
  if (entry.level === 'error') {
    const endpoint = import.meta.env.VITE_LOG_ENDPOINT;
    if (endpoint) {
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
        keepalive: true, // survives page unload
      }).catch(() => {}); // swallow network errors from the logger itself
    }
  }
  */
}

export const logger = {
  debug: (message: string, data?: unknown) =>
    send(createEntry("debug", message, data)),
  info: (message: string, data?: unknown) =>
    send(createEntry("info", message, data)),
  warn: (message: string, data?: unknown) =>
    send(createEntry("warn", message, data)),
  error: (message: string, data?: unknown) =>
    send(createEntry("error", message, data)),
};
