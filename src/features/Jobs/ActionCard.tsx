/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  GripVertical,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Clock,
} from "lucide-react";
import { ActionTypeIcon } from "./ActionTypeIcon";
import type { WorkflowAction } from "../../types/messaging-management";

interface Props {
  action: WorkflowAction;
  index: number;
  total: number;
  canEdit: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

const CONFIG_SUMMARY: Partial<
  Record<string, (c: Record<string, unknown>) => string>
> = {
  SEND_WHATSAPP: (c) =>
    c.templateName
      ? `Template: ${c.templateName}`
      : (c.body as string)?.slice(0, 50) + "…" || "No message set",
  SEND_SMS: (c) =>
    c.templateName
      ? `Template: ${c.templateName}`
      : (c.body as string)?.slice(0, 50) + "…" || "No message set",
  SEND_EMAIL: (c) =>
    c.templateName
      ? `Template: ${c.templateName}`
      : (c.subject as string) || "No subject set",
  WAIT_DELAY: (_) => "",
  UPDATE_LEAD_STAGE: (c) =>
    c.stage ? `→ ${String(c.stage).replace(/_/g, " ")}` : "No stage set",
  ADD_TAG: (c) => (c.tag ? `"${c.tag}"` : "No tag set"),
  ASSIGN_LEAD: (c) =>
    c.agentId ? `Agent: ${String(c.agentId).slice(0, 8)}…` : "No agent set",
  CREATE_TASK: (c) => (c.title as string) || "No title set",
};

export const ActionCard: React.FC<Props> = ({
  action,
  index,
  total,
  canEdit,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
}) => {
  const summary =
    CONFIG_SUMMARY[action.actionType]?.(
      action.config as Record<string, unknown>,
    ) ?? "";

  return (
    <div className="group flex items-center gap-2 sm:gap-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-3 sm:p-4 hover:shadow-sm transition-all">
      {/* Drag handle (visual only) */}
      <div className="cursor-grab text-gray-300 dark:text-gray-600 hover:text-gray-400 flex-shrink-0">
        <GripVertical className="w-4 h-4" />
      </div>

      {/* Step number */}
      <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-[11px] font-black flex items-center justify-center flex-shrink-0">
        {index + 1}
      </div>

      {/* Icon */}
      <ActionTypeIcon type={action.actionType} size="md" />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-gray-900 dark:text-white">
          {action.actionType
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase())}
        </p>
        {summary && (
          <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate mt-0.5">
            {summary}
          </p>
        )}
        {action.delayMinutes && (
          <span className="inline-flex items-center gap-0.5 text-[10px] text-orange-600 dark:text-orange-400 mt-0.5">
            <Clock className="w-2.5 h-2.5" />
            {action.delayMinutes >= 1440
              ? `${(action.delayMinutes / 1440).toFixed(1)}d delay`
              : action.delayMinutes >= 60
                ? `${(action.delayMinutes / 60).toFixed(1)}h delay`
                : `${action.delayMinutes}m delay`}
          </span>
        )}
      </div>

      {/* Controls */}
      {canEdit && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button
            onClick={onMoveUp}
            disabled={index === 0}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 transition-colors"
          >
            <ArrowUp className="w-3 h-3" />
          </button>
          <button
            onClick={onMoveDown}
            disabled={index === total - 1}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 transition-colors"
          >
            <ArrowDown className="w-3 h-3" />
          </button>
          <button
            onClick={onEdit}
            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          >
            <Edit2 className="w-3 h-3" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};
