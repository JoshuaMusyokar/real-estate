import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageSquare,
  Smartphone,
  Search,
  SlidersHorizontal,
  X,
  Loader2,
  RefreshCw,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ArrowDownLeft,
  ArrowUpRight,
  Image as ImageIcon,
} from "lucide-react";
import {
  useGetAllWhatsAppMessagesQuery,
  useGetAllSMSMessagesQuery,
  useGetWhatsAppStatsQuery,
  useGetSMSStatsQuery,
} from "../../services/MessagingApi";
import type {
  WhatsAppMessage,
  SMSMessage,
  WhatsAppStats,
  SMSStats,
  MessageListParams,
} from "../../types/messages";

interface Props {
  channel: "whatsapp" | "sms";
}

const STATUS_PILL: Record<string, string> = {
  PENDING: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  SENT: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  DELIVERED:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  READ: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
  FAILED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const fmt = (d?: string | Date | null): string =>
  d
    ? new Date(d).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

const inp =
  "w-full px-2.5 py-1.5 border border-gray-200 dark:border-gray-700 rounded-xl text-xs bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 outline-none";

// ── Typed row sub-components ───────────────────────────────────────────────

const WADesktopRow: React.FC<{
  msg: WhatsAppMessage;
  onOpenLead: (id: string) => void;
}> = ({ msg, onOpenLead }) => (
  <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors group">
    <td className="px-3 py-2.5 text-gray-500 dark:text-gray-400 whitespace-nowrap">
      {fmt(msg.createdAt)}
    </td>
    <td className="px-3 py-2.5">
      {msg.lead ? (
        <div>
          <p className="font-semibold text-gray-900 dark:text-white truncate max-w-[130px]">
            {msg.lead.firstName} {msg.lead.lastName}
          </p>
          <p className="text-[10px] text-gray-400">{msg.lead.phone}</p>
        </div>
      ) : (
        <span className="text-gray-400">—</span>
      )}
    </td>
    <td className="px-3 py-2.5 text-gray-500 dark:text-gray-400 whitespace-nowrap">
      {msg.lead?.phone ?? "—"}
    </td>
    <td className="px-3 py-2.5 max-w-[200px]">
      <div className="flex items-start gap-1">
        {msg.mediaUrl && (
          <ImageIcon className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" />
        )}
        <p className="text-gray-700 dark:text-gray-300 line-clamp-2 text-[11px] leading-relaxed">
          {msg.content}
        </p>
      </div>
    </td>
    <td className="px-3 py-2.5 whitespace-nowrap">
      <span
        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${STATUS_PILL[msg.status] ?? STATUS_PILL.PENDING}`}
      >
        {msg.status}
      </span>
    </td>
    <td className="px-3 py-2.5 whitespace-nowrap">
      {msg.direction === "inbound" ? (
        <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 text-[10px] font-semibold">
          <ArrowDownLeft className="w-3 h-3" /> Inbound
        </span>
      ) : (
        <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-[10px] font-semibold">
          <ArrowUpRight className="w-3 h-3" /> Outbound
        </span>
      )}
    </td>
    <td className="px-3 py-2.5 text-[10px] text-gray-400 whitespace-nowrap">
      {fmt(msg.sentAt)}
    </td>
    <td className="px-3 py-2.5 text-[10px] text-gray-400 whitespace-nowrap">
      {fmt(msg.deliveredAt)}
    </td>
    <td className="px-3 py-2.5 text-[10px] text-gray-400 whitespace-nowrap">
      {fmt(msg.readAt)}
    </td>
    <td
      className="px-3 py-2.5 font-mono text-[9px] text-gray-400 max-w-[100px] truncate"
      title={msg.externalId ?? ""}
    >
      {msg.externalId ?? "—"}
    </td>
    <td className="px-3 py-2.5">
      {msg.lead && (
        <button
          onClick={() => onOpenLead(msg.lead!.id)}
          className="opacity-0 group-hover:opacity-100 p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      )}
    </td>
  </tr>
);

const SMSDesktopRow: React.FC<{
  msg: SMSMessage;
  onOpenLead: (id: string) => void;
}> = ({ msg, onOpenLead }) => (
  <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors group">
    <td className="px-3 py-2.5 text-gray-500 dark:text-gray-400 whitespace-nowrap">
      {fmt(msg.createdAt)}
    </td>
    <td className="px-3 py-2.5">
      {msg.lead ? (
        <div>
          <p className="font-semibold text-gray-900 dark:text-white truncate max-w-[130px]">
            {msg.lead.firstName} {msg.lead.lastName}
          </p>
          <p className="text-[10px] text-gray-400">{msg.lead.phone}</p>
        </div>
      ) : (
        <span className="text-gray-400">—</span>
      )}
    </td>
    <td className="px-3 py-2.5 text-gray-500 dark:text-gray-400 whitespace-nowrap">
      {msg.phoneNumber}
    </td>
    <td className="px-3 py-2.5 max-w-[200px]">
      <p className="text-gray-700 dark:text-gray-300 line-clamp-2 text-[11px] leading-relaxed">
        {msg.content}
      </p>
    </td>
    <td className="px-3 py-2.5 whitespace-nowrap">
      <span
        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${STATUS_PILL[msg.status] ?? STATUS_PILL.PENDING}`}
      >
        {msg.status}
      </span>
    </td>
    <td className="px-3 py-2.5 text-[10px] text-gray-400 whitespace-nowrap">
      {fmt(msg.sentAt)}
    </td>
    <td className="px-3 py-2.5 text-[10px] text-gray-400 whitespace-nowrap">
      {fmt(msg.deliveredAt)}
    </td>
    <td
      className="px-3 py-2.5 font-mono text-[9px] text-gray-400 max-w-[100px] truncate"
      title={msg.externalId ?? ""}
    >
      {msg.externalId ?? "—"}
    </td>
    <td className="px-3 py-2.5">
      {msg.lead && (
        <button
          onClick={() => onOpenLead(msg.lead!.id)}
          className="opacity-0 group-hover:opacity-100 p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      )}
    </td>
  </tr>
);

const WAMobileCard: React.FC<{
  msg: WhatsAppMessage;
  onOpenLead: (id: string) => void;
}> = ({ msg, onOpenLead }) => (
  <div className="p-3 sm:p-4">
    <div className="flex items-center justify-between gap-2 mb-2">
      <span className="text-[10px] text-gray-400">{fmt(msg.createdAt)}</span>
      <div className="flex items-center gap-1.5">
        {msg.direction === "inbound" ? (
          <span className="flex items-center gap-0.5 text-amber-600 text-[10px] font-semibold">
            <ArrowDownLeft className="w-3 h-3" /> In
          </span>
        ) : (
          <span className="flex items-center gap-0.5 text-blue-600 text-[10px] font-semibold">
            <ArrowUpRight className="w-3 h-3" /> Out
          </span>
        )}
        <span
          className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${STATUS_PILL[msg.status] ?? STATUS_PILL.PENDING}`}
        >
          {msg.status}
        </span>
      </div>
    </div>
    {msg.lead && (
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
            {msg.lead.firstName} {msg.lead.lastName}
          </p>
          <p className="text-[10px] text-gray-400">{msg.lead.phone}</p>
        </div>
        <button
          onClick={() => onOpenLead(msg.lead!.id)}
          className="flex-shrink-0 p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    )}
    <p className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
      {msg.mediaUrl && (
        <ImageIcon className="w-3 h-3 inline mr-1 text-gray-400" />
      )}
      {msg.content}
    </p>
    <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-gray-400">
      {msg.sentAt && <span>Sent: {fmt(msg.sentAt)}</span>}
      {msg.deliveredAt && <span>Delivered: {fmt(msg.deliveredAt)}</span>}
      {msg.readAt && <span>Read: {fmt(msg.readAt)}</span>}
      {msg.externalId && (
        <span className="font-mono truncate max-w-[140px]">
          {msg.externalId}
        </span>
      )}
    </div>
  </div>
);

const SMSMobileCard: React.FC<{
  msg: SMSMessage;
  onOpenLead: (id: string) => void;
}> = ({ msg, onOpenLead }) => (
  <div className="p-3 sm:p-4">
    <div className="flex items-center justify-between gap-2 mb-2">
      <span className="text-[10px] text-gray-400">{fmt(msg.createdAt)}</span>
      <span
        className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${STATUS_PILL[msg.status] ?? STATUS_PILL.PENDING}`}
      >
        {msg.status}
      </span>
    </div>
    {msg.lead && (
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
            {msg.lead.firstName} {msg.lead.lastName}
          </p>
          <p className="text-[10px] text-gray-400">{msg.phoneNumber}</p>
        </div>
        <button
          onClick={() => onOpenLead(msg.lead!.id)}
          className="flex-shrink-0 p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    )}
    <p className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
      {msg.content}
    </p>
    <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-gray-400">
      {msg.sentAt && <span>Sent: {fmt(msg.sentAt)}</span>}
      {msg.deliveredAt && <span>Delivered: {fmt(msg.deliveredAt)}</span>}
      {msg.externalId && (
        <span className="font-mono truncate max-w-[140px]">
          {msg.externalId}
        </span>
      )}
    </div>
  </div>
);

// ── Stat card helpers ──────────────────────────────────────────────────────

function buildWAStatCards(stats: WhatsAppStats | undefined) {
  return [
    {
      label: "Total",
      value: stats?.total ?? 0,
      color: "text-gray-900 dark:text-white",
    },
    {
      label: "Delivered",
      value: stats?.delivered ?? 0,
      color: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Read",
      value: stats?.read ?? 0,
      color: "text-sky-600 dark:text-sky-400",
    },
    {
      label: "Failed",
      value: stats?.failed ?? 0,
      color: "text-red-600 dark:text-red-400",
    },
    {
      label: "Inbound",
      value: stats?.inbound ?? 0,
      color: "text-amber-600 dark:text-amber-400",
    },
    {
      label: "Delivery %",
      value: `${stats?.deliveryRate ?? 0}%`,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Read %",
      value: `${stats?.readRate ?? 0}%`,
      color: "text-purple-600 dark:text-purple-400",
    },
  ];
}

function buildSMSStatCards(stats: SMSStats | undefined) {
  return [
    {
      label: "Total",
      value: stats?.total ?? 0,
      color: "text-gray-900 dark:text-white",
    },
    {
      label: "Delivered",
      value: stats?.delivered ?? 0,
      color: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Failed",
      value: stats?.failed ?? 0,
      color: "text-red-600 dark:text-red-400",
    },
    {
      label: "Delivery %",
      value: `${stats?.deliveryRate ?? 0}%`,
      color: "text-blue-600 dark:text-blue-400",
    },
  ];
}

// ── Main page ──────────────────────────────────────────────────────────────

export const MessageListPage: React.FC<Props> = ({ channel }) => {
  const navigate = useNavigate();
  const isWA = channel === "whatsapp";

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [direction, setDirection] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [days, setDays] = useState(7);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const listParams: MessageListParams = {
    search: search || undefined,
    status: status || undefined,
    direction: isWA && direction ? direction : undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    page,
    limit: 50,
  };

  const waQ = useGetAllWhatsAppMessagesQuery(listParams, {
    skip: !isWA,
    pollingInterval: 30_000,
  });
  const smsQ = useGetAllSMSMessagesQuery(listParams, {
    skip: isWA,
    pollingInterval: 30_000,
  });
  const waSQ = useGetWhatsAppStatsQuery({ days }, { skip: !isWA });
  const smsSQ = useGetSMSStatsQuery({ days }, { skip: isWA });

  const isFetching = isWA ? waQ.isFetching : smsQ.isFetching;
  const isLoading = isWA ? waQ.isLoading : smsQ.isLoading;
  const pag = isWA ? waQ.data?.pagination : smsQ.data?.pagination;
  const statCards = isWA
    ? buildWAStatCards(waSQ.data?.data)
    : buildSMSStatCards(smsSQ.data?.data);

  const waMessages = waQ.data?.data ?? [];
  const smsMessages = smsQ.data?.data ?? [];

  const activeFilters = [search, status, direction, dateFrom, dateTo].filter(
    Boolean,
  ).length;
  const reset = () => {
    setSearch("");
    setStatus("");
    setDirection("");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  };
  const goToLead = (id: string) => navigate(`/crm/leads/${id}`);

  const WA_HEADERS = [
    "Sent at",
    "Lead",
    "Phone",
    "Message",
    "Status",
    "Direction",
    "Sent",
    "Delivered",
    "Read",
    "SID",
    "",
  ];
  const SMS_HEADERS = [
    "Sent at",
    "Lead",
    "To",
    "Message",
    "Status",
    "Sent",
    "Delivered",
    "SID",
    "",
  ];

  return (
    <div className="max-w-full mx-auto space-y-3 sm:space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            {isWA ? (
              <MessageSquare className="w-5 h-5 text-green-500" />
            ) : (
              <Smartphone className="w-5 h-5 text-purple-500" />
            )}
            {isWA ? "WhatsApp Messages" : "SMS Messages"}
          </h1>
          <p className="text-[11px] sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {pag
              ? `${pag.total.toLocaleString()} total messages`
              : "Track delivery status and metadata"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={days}
            onChange={(e) => {
              setDays(Number(e.target.value));
              setPage(1);
            }}
            className="px-2.5 py-1.5 border border-gray-200 dark:border-gray-700 rounded-xl text-[11px] sm:text-xs font-semibold bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 outline-none"
          >
            <option value={1}>Today</option>
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          <button
            onClick={() => (isWA ? waQ.refetch() : smsQ.refetch())}
            className="p-2 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div
        className={`grid gap-2 sm:gap-3 grid-cols-2 ${isWA ? "sm:grid-cols-4 lg:grid-cols-7" : "sm:grid-cols-4"}`}
      >
        {statCards.map(({ label, value, color }) => (
          <div
            key={label}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-3"
          >
            <p
              className={`text-base sm:text-xl font-black leading-none ${color}`}
            >
              {value}
            </p>
            <p className="text-[10px] sm:text-xs text-gray-400 mt-1">{label}</p>
          </div>
        ))}
      </div>

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
              placeholder="Search lead name, phone, SID…"
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
            <SlidersHorizontal className="w-3 h-3" />
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
                Status
              </label>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                className={`${inp} appearance-none`}
              >
                <option value="">All</option>
                {(isWA
                  ? ["PENDING", "SENT", "DELIVERED", "READ", "FAILED"]
                  : ["PENDING", "SENT", "DELIVERED", "FAILED"]
                ).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            {isWA && (
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">
                  Direction
                </label>
                <select
                  value={direction}
                  onChange={(e) => {
                    setDirection(e.target.value);
                    setPage(1);
                  }}
                  className={`${inp} appearance-none`}
                >
                  <option value="">Both</option>
                  <option value="outbound">Outbound</option>
                  <option value="inbound">Inbound</option>
                </select>
              </div>
            )}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">
                From date
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value);
                  setPage(1);
                }}
                className={inp}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">
                To date
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value);
                  setPage(1);
                }}
                className={inp}
              />
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-14">
            <Loader2 className="w-7 h-7 animate-spin text-blue-500" />
          </div>
        ) : (isWA ? waMessages.length : smsMessages.length) === 0 ? (
          <div className="text-center py-14">
            {isWA ? (
              <MessageSquare className="w-10 h-10 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
            ) : (
              <Smartphone className="w-10 h-10 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
            )}
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              No messages found
            </p>
          </div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    {(isWA ? WA_HEADERS : SMS_HEADERS).map((h) => (
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
                  {isWA
                    ? waMessages.map((msg) => (
                        <WADesktopRow
                          key={msg.id}
                          msg={msg}
                          onOpenLead={goToLead}
                        />
                      ))
                    : smsMessages.map((msg) => (
                        <SMSDesktopRow
                          key={msg.id}
                          msg={msg}
                          onOpenLead={goToLead}
                        />
                      ))}
                </tbody>
              </table>
            </div>
            {/* Mobile */}
            <div className="lg:hidden divide-y divide-gray-100 dark:divide-gray-800">
              {isWA
                ? waMessages.map((msg) => (
                    <WAMobileCard
                      key={msg.id}
                      msg={msg}
                      onOpenLead={goToLead}
                    />
                  ))
                : smsMessages.map((msg) => (
                    <SMSMobileCard
                      key={msg.id}
                      msg={msg}
                      onOpenLead={goToLead}
                    />
                  ))}
            </div>
            {/* Pagination */}
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
