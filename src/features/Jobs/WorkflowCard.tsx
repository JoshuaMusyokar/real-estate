import { useNavigate } from "react-router-dom";
import { Pause, ChevronRight, Zap, CheckCircle2 } from "lucide-react";
import { TriggerBadge } from "./TriggerBadge";
import { ActionTypeIcon } from "./ActionTypeIcon";
import type { Workflow } from "../../types/messaging-management";

interface Props {
  workflow: Workflow;
  onToggle: (id: string) => void;
  isToggling: boolean;
}

export const WorkflowCard: React.FC<Props> = ({
  workflow,
  onToggle,
  isToggling,
}) => {
  const navigate = useNavigate();

  return (
    <div
      className={`group bg-white dark:bg-gray-900 border rounded-2xl overflow-hidden
      hover:shadow-md transition-all duration-200
      ${
        workflow.isActive
          ? "border-gray-200 dark:border-gray-800"
          : "border-dashed border-gray-200 dark:border-gray-700 opacity-70"
      }`}
    >
      {/* Active indicator strip */}
      <div
        className={`h-1 transition-all ${workflow.isActive ? "bg-gradient-to-r from-emerald-500 to-teal-500" : "bg-gray-200 dark:bg-gray-700"}`}
      />

      <div className="p-4 sm:p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <button
              onClick={() =>
                navigate(`/crm/messaging/workflows/${workflow.id}`)
              }
              className="text-sm font-black text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left line-clamp-1"
            >
              {workflow.name}
            </button>
            {workflow.description && (
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                {workflow.description}
              </p>
            )}
          </div>
          <button
            onClick={() => navigate(`/crm/messaging/workflows/${workflow.id}`)}
            className="p-1.5 rounded-xl text-gray-300 dark:text-gray-600 group-hover:text-blue-500 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-all flex-shrink-0"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Trigger */}
        <div className="mb-3">
          <TriggerBadge trigger={workflow.trigger} size="xs" />
        </div>

        {/* Action pills */}
        {workflow.actions.length > 0 && (
          <div className="flex items-center gap-1.5 mb-4 flex-wrap">
            {workflow.actions.slice(0, 4).map((action, i) => (
              <div key={action.id} className="flex items-center gap-1">
                {i > 0 && (
                  <span className="text-gray-300 dark:text-gray-600 text-[10px]">
                    →
                  </span>
                )}
                <ActionTypeIcon type={action.actionType} size="sm" />
              </div>
            ))}
            {workflow.actions.length > 4 && (
              <span className="text-[10px] text-gray-400">
                +{workflow.actions.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            {/* Execution count */}
            <span className="flex items-center gap-1 text-[10px] text-gray-400">
              <Zap className="w-3 h-3" />
              {workflow._count.executions.toLocaleString()} runs
            </span>
            {/* Action count */}
            <span className="flex items-center gap-1 text-[10px] text-gray-400">
              {workflow.actions.length} action
              {workflow.actions.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Toggle active */}
          <button
            onClick={() => onToggle(workflow.id)}
            disabled={isToggling}
            title={
              workflow.isActive ? "Deactivate workflow" : "Activate workflow"
            }
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-colors disabled:opacity-50
              ${
                workflow.isActive
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50"
                  : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
          >
            {workflow.isActive ? (
              <>
                <CheckCircle2 className="w-3 h-3" /> Active
              </>
            ) : (
              <>
                <Pause className="w-3 h-3" /> Inactive
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
