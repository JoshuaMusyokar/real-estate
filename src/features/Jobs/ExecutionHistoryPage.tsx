// ExecutionHistoryPage  —  /crm/messaging/executions

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  AlertCircle,
  ChevronDown,
  ChevronRight as Chevron,
} from "lucide-react";
import { ExecutionStatusBadge } from "./ExecutionStatusBadge";
import { ExecutionFilters } from "./ExecutionFilters";
import { TriggerBadge } from "./TriggerBadge";
import {
  useGetExecutionsQuery,
  useGetExecutionStatsQuery,
} from "../../services/messagingManagementApi";
import type {
  WorkflowStatus,
  WorkflowExecution,
} from "../../types/messaging-management";

const fmt = (d: string) =>
  new Date(d).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

const duration = (start: string, end?: string | null) => {
  if (!end) return "–";
  const ms = new Date(end).getTime() - new Date(start).getTime();
  return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
};

const DesktopRow: React.FC<{
  exec: WorkflowExecution;
  expanded: boolean;
  onToggle: () => void;
  onNavigate: (id: string) => void;
}> = ({ exec, expanded, onToggle, onNavigate }) => (
  <>
    <tr
      className={`hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors ${exec.status === "failed" ? "bg-red-50/30 dark:bg-red-900/10" : ""}`}
    >
      <td className="px-3 py-2.5 whitespace-nowrap">
        <ExecutionStatusBadge status={exec.status} />
      </td>
      <td className="px-3 py-2.5">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate(exec.workflowId)}
            className="text-xs font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors max-w-[140px] truncate"
          >
            {exec.workflow.name}
          </button>
          <TriggerBadge trigger={exec.workflow.trigger} size="xs" />
        </div>
      </td>
      <td
        className="px-3 py-2.5 font-mono text-[10px] text-gray-400 max-w-[100px] truncate"
        title={exec.leadId ?? ""}
      >
        {exec.leadId ? `…${exec.leadId.slice(-8)}` : "—"}
      </td>
      <td className="px-3 py-2.5 text-[10px] text-gray-400 whitespace-nowrap">
        {fmt(exec.startedAt)}
      </td>
      <td className="px-3 py-2.5 text-[10px] text-gray-400 whitespace-nowrap">
        {duration(exec.startedAt, exec.completedAt)}
      </td>
      <td className="px-3 py-2.5">
        {exec.leadId && (
          <button
            onClick={() => onNavigate(exec.workflowId)}
            className="p-1 text-blue-400 hover:text-blue-600 transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
          </button>
        )}
      </td>
      <td className="px-3 py-2.5">
        {exec.errorLog && (
          <button
            onClick={onToggle}
            className="text-red-400 hover:text-red-600 transition-colors"
          >
            {expanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <Chevron className="w-4 h-4" />
            )}
          </button>
        )}
      </td>
    </tr>
    {expanded && exec.errorLog && (
      <tr>
        <td colSpan={7} className="px-4 py-3 bg-red-50 dark:bg-red-900/10">
          <div className="flex items-start gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
            <pre className="text-[10px] font-mono text-red-700 dark:text-red-400 whitespace-pre-wrap break-all">
              {exec.errorLog}
            </pre>
          </div>
        </td>
      </tr>
    )}
  </>
);

const MobileCard: React.FC<{
  exec: WorkflowExecution;
  expanded: boolean;
  onToggle: () => void;
  onNavigate: (id: string) => void;
}> = ({ exec, expanded, onToggle, onNavigate }) => (
  <div
    className={`p-3 ${exec.status === "failed" ? "bg-red-50/30 dark:bg-red-900/10" : ""}`}
  >
    <div className="flex items-center justify-between gap-2 mb-1.5">
      <ExecutionStatusBadge status={exec.status} />
      <span className="text-[10px] text-gray-400">{fmt(exec.startedAt)}</span>
    </div>
    <div className="flex items-center gap-2 mb-1">
      <button
        onClick={() => onNavigate(exec.workflowId)}
        className="text-xs font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 truncate max-w-[140px]"
      >
        {exec.workflow.name}
      </button>
      <TriggerBadge trigger={exec.workflow.trigger} size="xs" />
    </div>
    {exec.leadId && (
      <p className="text-[10px] font-mono text-gray-400 truncate">
        Lead: …{exec.leadId.slice(-8)}
      </p>
    )}
    {exec.errorLog && (
      <>
        <button
          onClick={onToggle}
          className="text-[10px] text-red-500 flex items-center gap-0.5 mt-1"
        >
          {expanded ? (
            <ChevronDown className="w-3 h-3" />
          ) : (
            <Chevron className="w-3 h-3" />
          )}
          {expanded ? "Hide error" : "Show error"}
        </button>
        {expanded && (
          <pre className="mt-1.5 text-[10px] font-mono text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded-xl whitespace-pre-wrap break-all max-h-32 overflow-auto">
            {exec.errorLog}
          </pre>
        )}
      </>
    )}
  </div>
);

export const ExecutionHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<WorkflowStatus | "">("");
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<string | null>(null);

  const { data, isLoading, isFetching, refetch } = useGetExecutionsQuery(
    {
      status: status || undefined,
      page,
      limit: 50,
    },
    { pollingInterval: 15_000 },
  );

  const { data: statsData } = useGetExecutionStatsQuery({});

  const execs = data?.data ?? [];
  const pag = data?.pagination;
  const stats = statsData?.data;

  const toggle = (id: string) => setExpanded((v) => (v === id ? null : id));

  return (
    <div className="max-w-full mx-auto space-y-4 sm:space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            Execution History
          </h1>
          <p className="text-[11px] sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {pag?.total.toLocaleString() ?? 0} total executions · auto-refreshes
            every 15s
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="p-2 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {[
            {
              label: "Total",
              value: stats.total,
              color: "text-gray-900 dark:text-white",
            },
            {
              label: "Completed",
              value: stats.completed,
              color: "text-emerald-600 dark:text-emerald-400",
            },
            {
              label: "Failed",
              value: stats.failed,
              color: "text-red-600 dark:text-red-400",
            },
            {
              label: "Success rate",
              value: `${stats.successRate}%`,
              color: "text-blue-600 dark:text-blue-400",
            },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-3"
            >
              <p className={`text-base sm:text-xl font-black ${color}`}>
                {value}
              </p>
              <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
                {label}
              </p>
            </div>
          ))}
        </div>
      )}

      <ExecutionFilters
        search={search}
        status={status}
        onSearch={setSearch}
        onStatus={setStatus}
        onReset={() => {
          setSearch("");
          setStatus("");
          setPage(1);
        }}
      />

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-14">
            <Activity className="w-7 h-7 text-blue-400 animate-pulse" />
          </div>
        ) : execs.length === 0 ? (
          <div className="text-center py-14">
            <Activity className="w-10 h-10 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              No executions found
            </p>
          </div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    {[
                      "Status",
                      "Workflow",
                      "Lead ID",
                      "Started",
                      "Duration",
                      "",
                      "",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-3 py-2.5 text-left text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {execs.map((ex) => (
                    <DesktopRow
                      key={ex.id}
                      exec={ex}
                      expanded={expanded === ex.id}
                      onToggle={() => toggle(ex.id)}
                      onNavigate={(wid) =>
                        navigate(`/crm/messaging/workflows/${wid}`)
                      }
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-800">
              {execs.map((ex) => (
                <MobileCard
                  key={ex.id}
                  exec={ex}
                  expanded={expanded === ex.id}
                  onToggle={() => toggle(ex.id)}
                  onNavigate={(wid) =>
                    navigate(`/crm/messaging/workflows/${wid}`)
                  }
                />
              ))}
            </div>

            {/* Pagination */}
            {pag && pag.pages > 1 && (
              <div className="px-3 sm:px-4 py-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <span className="text-[11px] text-gray-500">
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
                    {page}/{pag.pages}
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
