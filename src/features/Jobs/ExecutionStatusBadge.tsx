import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import type { WorkflowStatus } from "../../types/messaging-management";

const CFG: Record<
  WorkflowStatus,
  { icon: typeof Loader2; cls: string; label: string }
> = {
  running: {
    icon: Loader2,
    cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    label: "Running",
  },
  completed: {
    icon: CheckCircle2,
    cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    label: "Completed",
  },
  failed: {
    icon: XCircle,
    cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
    label: "Failed",
  },
};

export const ExecutionStatusBadge: React.FC<{
  status: WorkflowStatus | string;
}> = ({ status }) => {
  const cfg = CFG[status as WorkflowStatus] ?? CFG.completed;
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${cfg.cls}`}
    >
      <Icon
        className={`w-3 h-3 ${status === "running" ? "animate-spin" : ""}`}
      />
      {cfg.label}
    </span>
  );
};
