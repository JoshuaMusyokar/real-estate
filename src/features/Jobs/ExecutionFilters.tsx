import { Search, X } from "lucide-react";
import type { WorkflowStatus } from "../../types/messaging-management";

interface Props {
  search: string;
  status: WorkflowStatus | "";
  onSearch: (v: string) => void;
  onStatus: (v: WorkflowStatus | "") => void;
  onReset: () => void;
}

const STATUSES: Array<{ id: WorkflowStatus | ""; label: string }> = [
  { id: "", label: "All" },
  { id: "running", label: "Running" },
  { id: "completed", label: "Completed" },
  { id: "failed", label: "Failed" },
];

export const ExecutionFilters: React.FC<Props> = ({
  search,
  status,
  onSearch,
  onStatus,
  onReset,
}) => {
  const hasFilter = search || status;
  return (
    <div className="space-y-2.5">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search by workflow or lead ID…"
            className="w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-xs sm:text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
        {hasFilter && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 px-2.5 py-2 rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20 text-red-600 text-[11px] font-bold flex-shrink-0"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
      <div
        className="flex gap-1.5 overflow-x-auto pb-0.5"
        style={{ scrollbarWidth: "none" }}
      >
        {STATUSES.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => onStatus(id)}
            className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors
              ${
                status === id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};
