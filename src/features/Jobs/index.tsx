// WorkflowsPage  —  /crm/messaging/workflows

import { useState, useCallback } from "react";
import { Zap, Plus, RefreshCw, Search, X } from "lucide-react";
import { WorkflowCard } from "./WorkflowCard";
import { WorkflowBuilderModal } from "./WorkflowBuilderModal";
import { useWorkflowBuilder } from "../../hooks/useWorkflowBuilder";
import {
  useGetWorkflowsQuery,
  useCreateWorkflowMutation,
  useToggleWorkflowMutation,
  useGetExecutionStatsQuery,
} from "../../services/messagingManagementApi";
import { useToast } from "../../hooks/useToast";

const SkeletonCard = () => (
  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden animate-pulse">
    <div className="h-1 bg-gray-200 dark:bg-gray-700" />
    <div className="p-4 sm:p-5 space-y-3">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
      <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded-full" />
      <div className="flex gap-1.5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-lg"
          />
        ))}
      </div>
      <div className="h-px bg-gray-100 dark:bg-gray-800" />
      <div className="flex justify-between">
        <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-xl" />
      </div>
    </div>
  </div>
);

export const WorkflowsPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [filterActive, setFilterActive] = useState<boolean | undefined>(
    undefined,
  );
  const [builderOpen, setBuilderOpen] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const toast = useToast();

  const { data, isLoading, isFetching, refetch } = useGetWorkflowsQuery({
    search: search || undefined,
    isActive: filterActive,
    limit: 50,
  });

  const { data: statsData } = useGetExecutionStatsQuery({});

  const {
    form,
    formErrors,
    updateForm,
    validateForm,
    toWorkflowInput,
    resetForm,
  } = useWorkflowBuilder();

  const [createWorkflow, { isLoading: creating }] = useCreateWorkflowMutation();
  const [toggleWorkflow] = useToggleWorkflowMutation();

  const workflows = data?.data ?? [];
  const stats = statsData?.data;

  const handleCreate = useCallback(async () => {
    if (!validateForm()) return;
    try {
      await createWorkflow(toWorkflowInput()).unwrap();
      toast.success?.("Workflow created");
      setBuilderOpen(false);
      resetForm();
    } catch (err: unknown) {
      toast.error?.(err instanceof Error ? err.message : "Failed to create");
    }
  }, [validateForm, createWorkflow, toWorkflowInput, resetForm, toast]);

  const handleToggle = useCallback(
    async (id: string) => {
      setTogglingId(id);
      try {
        await toggleWorkflow(id).unwrap();
      } catch (err: unknown) {
        toast.error?.(err instanceof Error ? err.message : "Failed to toggle");
      } finally {
        setTogglingId(null);
      }
    },
    [toggleWorkflow, toast],
  );

  const active = workflows.filter((w) => w.isActive).length;
  const inactive = workflows.filter((w) => !w.isActive).length;

  return (
    <div className="max-w-full mx-auto space-y-4 sm:space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            Automation Workflows
          </h1>
          <p className="text-[11px] sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {data?.pagination.total ?? 0} workflows · {active} active
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            className="p-2 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`}
            />
          </button>
          <button
            onClick={() => {
              resetForm();
              setBuilderOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Workflow</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>
      </div>

      {/* Stats cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {[
            {
              label: "Total runs",
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

      {/* Search + filter */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search workflows…"
            className="w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-xs sm:text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
        <div className="flex gap-1.5">
          {([undefined, true, false] as const).map((v, i) => (
            <button
              key={i}
              onClick={() => setFilterActive(v)}
              className={`px-2.5 py-2 rounded-xl border text-[11px] font-bold transition-colors
                ${
                  filterActive === v
                    ? "bg-amber-500 border-amber-500 text-white"
                    : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
                }`}
            >
              {v === undefined
                ? "All"
                : v
                  ? `Active (${active})`
                  : `Inactive (${inactive})`}
            </button>
          ))}
        </div>
        {(search || filterActive !== undefined) && (
          <button
            onClick={() => {
              setSearch("");
              setFilterActive(undefined);
            }}
            className="flex items-center gap-1 px-2.5 py-2 rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20 text-red-600 text-[11px] font-bold flex-shrink-0"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : workflows.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 rounded-2xl border-2 border-dashed border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-900/10">
          <Zap className="w-12 h-12 text-amber-400 mb-4" />
          <p className="text-sm font-black text-gray-900 dark:text-white mb-1">
            No workflows yet
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-5 text-center max-w-xs">
            Automate your follow-ups, lead assignments, and messages
          </p>
          <button
            onClick={() => {
              resetForm();
              setBuilderOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 rounded-xl text-xs font-bold text-white transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Create Workflow
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          {workflows.map((w) => (
            <WorkflowCard
              key={w.id}
              workflow={w}
              onToggle={handleToggle}
              isToggling={togglingId === w.id}
            />
          ))}
        </div>
      )}

      <WorkflowBuilderModal
        isOpen={builderOpen}
        editing={null}
        form={form}
        errors={formErrors}
        isLoading={creating}
        onUpdate={updateForm}
        onSave={handleCreate}
        onClose={() => {
          setBuilderOpen(false);
          resetForm();
        }}
      />
    </div>
  );
};
