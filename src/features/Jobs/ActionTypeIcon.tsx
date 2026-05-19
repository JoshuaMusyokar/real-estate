import {
  MessageSquare,
  Smartphone,
  Mail,
  Tag,
  UserCheck,
  ListTodo,
  Clock,
  TrendingUp,
} from "lucide-react";
import type { WorkflowActionType } from "../../types/messaging-management";

const CFG: Record<
  WorkflowActionType,
  {
    icon: typeof MessageSquare;
    label: string;
    color: string;
    bg: string;
  }
> = {
  SEND_WHATSAPP: {
    icon: MessageSquare,
    label: "WhatsApp",
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-100 dark:bg-green-900/30",
  },
  SEND_SMS: {
    icon: Smartphone,
    label: "SMS",
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-100 dark:bg-purple-900/30",
  },
  SEND_EMAIL: {
    icon: Mail,
    label: "Email",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-900/30",
  },
  ADD_TAG: {
    icon: Tag,
    label: "Add Tag",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/30",
  },
  ASSIGN_LEAD: {
    icon: UserCheck,
    label: "Assign Lead",
    color: "text-teal-600 dark:text-teal-400",
    bg: "bg-teal-100 dark:bg-teal-900/30",
  },
  CREATE_TASK: {
    icon: ListTodo,
    label: "Create Task",
    color: "text-gray-600 dark:text-gray-400",
    bg: "bg-gray-100 dark:bg-gray-800",
  },
  WAIT_DELAY: {
    icon: Clock,
    label: "Wait",
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-100 dark:bg-orange-900/30",
  },
  UPDATE_LEAD_STAGE: {
    icon: TrendingUp,
    label: "Update Stage",
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-100 dark:bg-violet-900/30",
  },
};

interface Props {
  type: WorkflowActionType;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export const ActionTypeIcon: React.FC<Props> = ({
  type,
  size = "sm",
  showLabel,
}) => {
  const { icon: Icon, label, color, bg } = CFG[type] ?? CFG.CREATE_TASK;
  const sz =
    size === "sm" ? "w-6 h-6" : size === "md" ? "w-8 h-8" : "w-10 h-10";
  const ic = size === "sm" ? "w-3 h-3" : size === "md" ? "w-4 h-4" : "w-5 h-5";
  return (
    <div className="flex items-center gap-1.5">
      <div
        className={`${sz} rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}
      >
        <Icon className={`${ic} ${color}`} />
      </div>
      {showLabel && (
        <span className={`text-[11px] font-bold ${color}`}>{label}</span>
      )}
    </div>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export { CFG as ACTION_CFG };
