import { X, Save, Plus, Loader2 } from "lucide-react";
import { TriggerBadge } from "./TriggerBadge";
import type {
  Workflow,
  WorkflowTrigger,
} from "../../types/messaging-management";
import type {
  WorkflowFormState,
  WorkflowFormErrors,
} from "../../hooks/useWorkflowBuilder";

interface Props {
  isOpen: boolean;
  editing: Workflow | null;
  form: WorkflowFormState;
  errors: WorkflowFormErrors;
  isLoading: boolean;
  onUpdate: (patch: Partial<WorkflowFormState>) => void;
  onSave: () => void;
  onClose: () => void;
}

const TRIGGERS: WorkflowTrigger[] = [
  "LEAD_CREATED",
  "FORM_SUBMISSION",
  "LEAD_STAGE_CHANGED",
  "APPOINTMENT_SCHEDULED",
  "APPOINTMENT_COMPLETED",
  "PROPERTY_INQUIRY",
  "NO_RESPONSE_TIMEOUT",
  "LEAD_INACTIVE",
];

const inp =
  "w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all";

export const WorkflowBuilderModal: React.FC<Props> = ({
  isOpen,
  editing,
  form,
  errors,
  isLoading,
  onUpdate,
  onSave,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-gray-950 w-full sm:max-w-lg sm:rounded-2xl shadow-2xl flex flex-col max-h-screen sm:max-h-[85vh] overflow-hidden">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
          <h2 className="text-sm sm:text-base font-black text-gray-900 dark:text-white">
            {editing ? "Edit Workflow" : "New Workflow"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
              Name *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              placeholder="e.g. Welcome new lead"
              className={`${inp} ${errors.name ? "border-red-400 dark:border-red-500" : ""}`}
            />
            {errors.name && (
              <p className="text-[10px] text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
              Description (optional)
            </label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => onUpdate({ description: e.target.value })}
              placeholder="What does this workflow do?"
              className={`${inp} resize-none`}
            />
          </div>

          {/* Trigger */}
          <div>
            <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
              Trigger *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {TRIGGERS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => onUpdate({ trigger: t })}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all
                    ${
                      form.trigger === t
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500"
                        : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700"
                    }`}
                >
                  <TriggerBadge trigger={t} size="xs" />
                </button>
              ))}
            </div>
            {errors.trigger && (
              <p className="text-[10px] text-red-500 mt-1">{errors.trigger}</p>
            )}
          </div>

          {/* Active toggle */}
          <div className="flex items-center justify-between pt-1">
            <div>
              <p className="text-xs font-bold text-gray-700 dark:text-gray-300">
                Start active
              </p>
              <p className="text-[10px] text-gray-400">
                Add actions first if you want to activate later
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => onUpdate({ isActive: e.target.checked })}
                className="sr-only peer"
              />
              <div
                className="w-10 h-5 bg-gray-200 dark:bg-gray-700 peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full
                peer peer-checked:after:translate-x-full peer-checked:after:border-white
                after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                after:bg-white after:border-gray-300 after:border after:rounded-full
                after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"
              />
            </label>
          </div>
        </div>

        <div className="flex gap-2.5 px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex-shrink-0 bg-white dark:bg-gray-950">
          <button
            onClick={onClose}
            className="flex-1 sm:flex-none sm:w-24 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={isLoading}
            className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving…
              </>
            ) : editing ? (
              <>
                <Save className="w-3.5 h-3.5" /> Save
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" /> Create
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
