import {
  Clock,
  Loader2,
  CheckCircle2,
  PauseCircle,
  XCircle,
  CalendarClock,
} from "lucide-react";
import type { CampaignStatus } from "../../types/messaging-management";

interface Props {
  status: CampaignStatus;
  size?: "xs" | "sm";
}

const CFG: Record<
  CampaignStatus,
  {
    label: string;
    icon: typeof Clock;
    cls: string;
  }
> = {
  DRAFT: {
    label: "Draft",
    icon: Clock,
    cls: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700",
  },
  SCHEDULED: {
    label: "Scheduled",
    icon: CalendarClock,
    cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  },
  SENDING: {
    label: "Sending",
    icon: Loader2,
    cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  },
  SENT: {
    label: "Sent",
    icon: CheckCircle2,
    cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  },
  PAUSED: {
    label: "Paused",
    icon: PauseCircle,
    cls: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 border-violet-200 dark:border-violet-800",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: XCircle,
    cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
  },
};

export const CampaignStatusBadge: React.FC<Props> = ({
  status,
  size = "sm",
}) => {
  const { label, icon: Icon, cls } = CFG[status] ?? CFG.DRAFT;
  const isSending = status === "SENDING";
  const sz =
    size === "xs"
      ? "text-[10px] px-1.5 py-0.5 gap-0.5"
      : "text-[11px] px-2 py-0.5 gap-1";
  const ic = size === "xs" ? "w-2.5 h-2.5" : "w-3 h-3";
  return (
    <span
      className={`inline-flex items-center font-bold rounded-full border ${cls} ${sz}`}
    >
      <Icon className={`${ic} ${isSending ? "animate-spin" : ""}`} />
      {label}
    </span>
  );
};
