import { useState } from "react";
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Filter,
  Loader2,
  RefreshCw,
  Search,
  X,
  Zap,
} from "lucide-react";
import {
  useGetWebhookLogsQuery,
  useGetWebhookStatsQuery,
} from "../../services/MessagingApi";
import type {
  WebhookLog,
  WebhookStats,
  WebhookLogParams,
} from "../../types/messages";

const SOURCE_LABEL: Record<string, string> = {
  twilio_whatsapp: "WhatsApp",
  twilio_sms: "SMS",
  sendgrid: "Email",
};
const SOURCE_PILL: Record<string, string> = {
  twilio_whatsapp:
    "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
  twilio_sms:
    "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
  sendgrid:
    "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
};
const EVENT_PILL: Record<string, string> = {
  inbound:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  status: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  open: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
  click:
    "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  bounce: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  delivery:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

const fmt = (d: string | Date): string =>
  new Date(d).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

const inp =
  "w-full px-2.5 py-1.5 border border-gray-200 dark:border-gray-700 rounded-xl text-xs bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 outline-none";

// ── Sub-components ─────────────────────────────────────────────────────────

const StatsCards: React.FC<{ stats: WebhookStats | undefined }> = ({
  stats,
}) => (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
    {[
      {
        label: "Total",
        value: stats?.total ?? 0,
        color: "text-gray-900 dark:text-white",
      },
      {
        label: "Verified",
        value: stats?.verified ?? 0,
        color: "text-emerald-600 dark:text-emerald-400",
      },
      {
        label: "Errors",
        value: stats?.errors ?? 0,
        color: "text-red-600 dark:text-red-400",
      },
      {
        label: "Success rate",
        value: `${stats?.successRate ?? 0}%`,
        color: "text-blue-600 dark:text-blue-400",
      },
    ].map(({ label, value, color }) => (
      <div
        key={label}
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-3"
      >
        <p className={`text-base sm:text-xl font-black ${color}`}>{value}</p>
        <p className="text-[10px] sm:text-xs text-gray-400 mt-1">{label}</p>
      </div>
    ))}
  </div>
);

const LogDesktopRow: React.FC<{
  log: WebhookLog;
  expanded: boolean;
  onToggle: () => void;
}> = ({ log, expanded, onToggle }) => (
  <>
    <tr
      className={`hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors ${log.error ? "bg-red-50/40 dark:bg-red-900/10" : ""}`}
    >
      <td className="px-3 py-2.5 text-gray-500 dark:text-gray-400 whitespace-nowrap">
        {fmt(log.createdAt)}
      </td>
      <td className="px-3 py-2.5">
        <span
          className={`px-1.5 py-0.5 rounded border text-[10px] font-bold ${SOURCE_PILL[log.source] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}
        >
          {SOURCE_LABEL[log.source] ?? log.source}
        </span>
      </td>
      <td className="px-3 py-2.5">
        <span
          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${EVENT_PILL[log.event] ?? "bg-gray-100 text-gray-600"}`}
        >
          {log.event}
        </span>
      </td>
      <td className="px-3 py-2.5 text-gray-500 dark:text-gray-400 whitespace-nowrap">
        {log.fromNumber || log.toNumber ? (
          <>
            {log.fromNumber && (
              <span className="text-gray-400">{log.fromNumber}</span>
            )}
            {log.fromNumber && log.toNumber && " → "}
            {log.toNumber}
          </>
        ) : (
          "—"
        )}
      </td>
      <td className="px-3 py-2.5 text-gray-600 dark:text-gray-400">
        {log.status ?? "—"}
      </td>
      <td
        className="px-3 py-2.5 font-mono text-[9px] text-gray-400 max-w-[100px] truncate"
        title={log.externalId ?? ""}
      >
        {log.externalId ?? "—"}
      </td>
      <td className="px-3 py-2.5">
        {log.verified ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        ) : (
          <AlertCircle className="w-4 h-4 text-amber-500" />
        )}
      </td>
      <td className="px-3 py-2.5">
        <button
          onClick={onToggle}
          className="text-blue-500 hover:text-blue-700 transition-colors"
        >
          {expanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
      </td>
    </tr>
    {expanded && (
      <tr>
        <td colSpan={8} className="px-4 py-3 bg-gray-50 dark:bg-gray-800/60">
          {log.error && (
            <div className="mb-2.5 flex items-start gap-1.5 p-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
              <span className="text-[11px] text-red-700 dark:text-red-400 font-mono">
                {log.error}
              </span>
            </div>
          )}
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">
            Raw Payload
          </p>
          <pre className="text-[10px] font-mono bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 overflow-x-auto max-h-52 text-gray-700 dark:text-gray-300">
            {JSON.stringify(log.payload, null, 2)}
          </pre>
        </td>
      </tr>
    )}
  </>
);

const LogMobileCard: React.FC<{
  log: WebhookLog;
  expanded: boolean;
  onToggle: () => void;
}> = ({ log, expanded, onToggle }) => (
  <div className={`p-3 ${log.error ? "bg-red-50/30 dark:bg-red-900/10" : ""}`}>
    <div className="flex items-center justify-between gap-2 mb-1.5">
      <div className="flex items-center gap-1.5 flex-wrap">
        <span
          className={`px-1.5 py-0.5 rounded border text-[10px] font-bold ${SOURCE_PILL[log.source] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}
        >
          {SOURCE_LABEL[log.source] ?? log.source}
        </span>
        <span
          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${EVENT_PILL[log.event] ?? "bg-gray-100 text-gray-600"}`}
        >
          {log.event}
        </span>
        {log.verified ? (
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
        ) : (
          <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
        )}
      </div>
      <span className="text-[10px] text-gray-400 flex-shrink-0">
        {fmt(log.createdAt)}
      </span>
    </div>
    {log.externalId && (
      <p className="text-[10px] font-mono text-gray-400 truncate mb-1">
        {log.externalId}
      </p>
    )}
    {log.error && (
      <p className="text-[10px] text-red-600 dark:text-red-400 font-mono truncate mb-1">
        {log.error}
      </p>
    )}
    <button
      onClick={onToggle}
      className="text-[10px] text-blue-500 flex items-center gap-0.5 mt-1"
    >
      {expanded ? (
        <ChevronDown className="w-3 h-3" />
      ) : (
        <ChevronRight className="w-3 h-3" />
      )}
      {expanded ? "Hide" : "Show"} payload
    </button>
    {expanded && (
      <pre className="mt-2 text-[10px] font-mono bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-2 overflow-x-auto max-h-40 text-gray-700 dark:text-gray-300">
        {JSON.stringify(log.payload, null, 2)}
      </pre>
    )}
  </div>
);

// ── Main page ──────────────────────────────────────────────────────────────

export const WebhookLogsPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [source, setSource] = useState("");
  const [event, setEvent] = useState("");
  const [hasError, setHasError] = useState(false);
  const [verified, setVerified] = useState<"" | "true" | "false">("");
  const [hours, setHours] = useState(24);
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const logParams: WebhookLogParams = {
    source: source || undefined,
    event: event || undefined,
    verified: verified !== "" ? verified === "true" : undefined,
    hasError: hasError || undefined,
    search: search || undefined,
    page,
    limit: 50,
  };

  const statsQ = useGetWebhookStatsQuery({ hours });
  const logsQ = useGetWebhookLogsQuery(logParams, { pollingInterval: 30_000 });

  const stats = statsQ.data?.data;
  const logs = logsQ.data?.data ?? [];
  const pag = logsQ.data?.pagination;

  const activeFilters = [source, event, hasError ? "x" : "", verified].filter(
    Boolean,
  ).length;
  const reset = () => {
    setSource("");
    setEvent("");
    setHasError(false);
    setVerified("");
    setSearch("");
    setPage(1);
  };
  const toggleExpanded = (id: string) =>
    setExpanded((cur) => (cur === id ? null : id));

  return (
    <div className="max-w-full mx-auto space-y-3 sm:space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" /> Webhook Logs
          </h1>
          <p className="text-[11px] sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Monitor all incoming Twilio &amp; SendGrid webhooks
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="px-2.5 py-1.5 border border-gray-200 dark:border-gray-700 rounded-xl text-[11px] sm:text-xs font-semibold bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 outline-none"
          >
            <option value={1}>Last hour</option>
            <option value={6}>Last 6h</option>
            <option value={24}>Last 24h</option>
            <option value={72}>Last 3 days</option>
          </select>
          <button
            onClick={() => logsQ.refetch()}
            className="p-2 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${logsQ.isFetching ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      <StatsCards stats={stats} />

      {/* Source breakdown */}
      {stats?.bySource && Object.keys(stats.bySource).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(stats.bySource).map(([src, count]) => (
            <button
              key={src}
              onClick={() => {
                setSource(source === src ? "" : src);
                setPage(1);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] font-bold transition-all
                ${source === src ? "ring-2 ring-blue-500 ring-offset-1" : ""}
                ${SOURCE_PILL[src] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}
            >
              <Zap className="w-3 h-3" />
              {SOURCE_LABEL[src] ?? src} — {count}
            </button>
          ))}
        </div>
      )}

      {/* Search + filters */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-3 sm:p-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search SID, phone…"
              className="w-full pl-9 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-xs sm:text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`flex items-center gap-1 px-2.5 py-2 rounded-xl border text-[11px] font-bold flex-shrink-0 transition-all
              ${
                showFilters || activeFilters > 0
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
              }`}
          >
            <Filter className="w-3 h-3" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilters > 0 && (
              <span className="w-4 h-4 rounded-full bg-white text-blue-600 text-[9px] font-black flex items-center justify-center">
                {activeFilters}
              </span>
            )}
          </button>
          {activeFilters > 0 && (
            <button
              onClick={reset}
              className="flex items-center gap-1 px-2.5 py-2 rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20 text-red-600 text-[11px] font-bold flex-shrink-0"
            >
              <X className="w-3 h-3" /> Reset
            </button>
          )}
        </div>
        {showFilters && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">
                Source
              </label>
              <select
                value={source}
                onChange={(e) => {
                  setSource(e.target.value);
                  setPage(1);
                }}
                className={`${inp} appearance-none`}
              >
                <option value="">All</option>
                <option value="twilio_whatsapp">WhatsApp</option>
                <option value="twilio_sms">SMS</option>
                <option value="sendgrid">Email</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">
                Event
              </label>
              <select
                value={event}
                onChange={(e) => {
                  setEvent(e.target.value);
                  setPage(1);
                }}
                className={`${inp} appearance-none`}
              >
                <option value="">All</option>
                <option value="inbound">Inbound</option>
                <option value="status">Status</option>
                <option value="open">Email open</option>
                <option value="click">Email click</option>
                <option value="bounce">Bounce</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">
                Verified
              </label>
              <select
                value={verified}
                onChange={(e) => {
                  setVerified(e.target.value as "" | "true" | "false");
                  setPage(1);
                }}
                className={`${inp} appearance-none`}
              >
                <option value="">Any</option>
                <option value="true">Verified</option>
                <option value="false">Unverified</option>
              </select>
            </div>
            <div className="flex items-end pb-0.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasError}
                  onChange={(e) => {
                    setHasError(e.target.checked);
                    setPage(1);
                  }}
                  className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                  Errors only
                </span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Logs table */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
        {logsQ.isLoading ? (
          <div className="flex items-center justify-center py-14">
            <Loader2 className="w-7 h-7 animate-spin text-blue-500" />
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-14">
            <Activity className="w-10 h-10 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              No webhook logs found
            </p>
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    {[
                      "Time",
                      "Source",
                      "Event",
                      "From / To",
                      "Status",
                      "External ID",
                      "Verified",
                      "",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-3 py-2.5 text-left text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {logs.map((log) => (
                    <LogDesktopRow
                      key={log.id}
                      log={log}
                      expanded={expanded === log.id}
                      onToggle={() => toggleExpanded(log.id)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
            <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-800">
              {logs.map((log) => (
                <LogMobileCard
                  key={log.id}
                  log={log}
                  expanded={expanded === log.id}
                  onToggle={() => toggleExpanded(log.id)}
                />
              ))}
            </div>
            {pag && pag.pages > 1 && (
              <div className="px-3 sm:px-4 py-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <span className="text-[11px] text-gray-500 dark:text-gray-400">
                  {(page - 1) * 50 + 1}–{Math.min(page * 50, pag.total)} of{" "}
                  {pag.total.toLocaleString()}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-1.5 border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 px-1">
                    {page} / {pag.pages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(pag.pages, p + 1))}
                    disabled={page >= pag.pages}
                    className="p-1.5 border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
