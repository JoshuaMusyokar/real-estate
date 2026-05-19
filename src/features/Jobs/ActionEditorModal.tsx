import { X, Save, Plus, ChevronDown } from "lucide-react";
import { ActionTypeIcon } from "./ActionTypeIcon";
import type { WorkflowActionType } from "../../types/messaging-management";
import type { ActionEditorState } from "../../hooks/useWorkflowBuilder";

interface Props {
  isOpen: boolean;
  isEditing: boolean; // true = edit, false = new
  state: ActionEditorState;
  isLoading: boolean;
  onUpdate: (patch: Partial<ActionEditorState>) => void;
  onSave: () => void;
  onClose: () => void;
}

const ACTION_TYPES: WorkflowActionType[] = [
  "SEND_WHATSAPP",
  "SEND_SMS",
  "SEND_EMAIL",
  "WAIT_DELAY",
  "UPDATE_LEAD_STAGE",
  "ADD_TAG",
  "ASSIGN_LEAD",
  "CREATE_TASK",
];

const STAGES = [
  "NEW_LEAD",
  "CONTACTED",
  "QUALIFIED",
  "VIEWING_SCHEDULED",
  "NEGOTIATION",
  "DEAL_CLOSED_WON",
  "DEAL_CLOSED_LOST",
];

const inp =
  "w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all";
const lbl =
  "block text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5";
const ta = `${inp} resize-none`;

export const ActionEditorModal: React.FC<Props> = ({
  isOpen,
  isEditing,
  state,
  isLoading,
  onUpdate,
  onSave,
  onClose,
}) => {
  if (!isOpen) return null;

  const { actionType, config, delayMinutes } = state;

  const setConfig = (key: string, val: string) =>
    onUpdate({ config: { ...config, [key]: val } });

  const renderConfigFields = () => {
    switch (actionType) {
      case "SEND_WHATSAPP":
      case "SEND_SMS":
        return (
          <>
            <div>
              <label className={lbl}>Template name (optional)</label>
              <input
                type="text"
                value={config.templateName ?? ""}
                onChange={(e) => setConfig("templateName", e.target.value)}
                placeholder="e.g. welcome_lead, appointment_confirmation"
                className={inp}
              />
              <p className="text-[10px] text-gray-400 mt-1">
                Leave blank to use a custom message body below
              </p>
            </div>
            <div>
              <label className={lbl}>
                Custom message body (if no template)
              </label>
              <textarea
                rows={3}
                value={config.body ?? ""}
                onChange={(e) => setConfig("body", e.target.value)}
                placeholder="Hi {{firstName}}, your appointment is confirmed…"
                className={ta}
              />
            </div>
          </>
        );

      case "SEND_EMAIL":
        return (
          <>
            <div>
              <label className={lbl}>Template name (optional)</label>
              <input
                type="text"
                value={config.templateName ?? ""}
                onChange={(e) => setConfig("templateName", e.target.value)}
                placeholder="e.g. appointment_confirmation"
                className={inp}
              />
            </div>
            <div>
              <label className={lbl}>Subject (if no template)</label>
              <input
                type="text"
                value={config.subject ?? ""}
                onChange={(e) => setConfig("subject", e.target.value)}
                placeholder="e.g. Your appointment details"
                className={inp}
              />
            </div>
            <div>
              <label className={lbl}>HTML body (if no template)</label>
              <textarea
                rows={4}
                value={config.htmlBody ?? ""}
                onChange={(e) => setConfig("htmlBody", e.target.value)}
                placeholder="<p>Hi {{firstName}},</p>"
                className={`${ta} font-mono text-xs`}
              />
            </div>
          </>
        );

      case "WAIT_DELAY":
        return (
          <div>
            <label className={lbl}>Delay (minutes)</label>
            <input
              type="number"
              min={1}
              value={delayMinutes}
              onChange={(e) => onUpdate({ delayMinutes: e.target.value })}
              placeholder="e.g. 60 for 1 hour, 1440 for 1 day"
              className={inp}
            />
            {delayMinutes && (
              <p className="text-[10px] text-blue-500 mt-1">
                ={" "}
                {Number(delayMinutes) >= 1440
                  ? `${(Number(delayMinutes) / 1440).toFixed(1)} days`
                  : Number(delayMinutes) >= 60
                    ? `${(Number(delayMinutes) / 60).toFixed(1)} hours`
                    : `${delayMinutes} minutes`}
              </p>
            )}
          </div>
        );

      case "UPDATE_LEAD_STAGE":
        return (
          <div>
            <label className={lbl}>New stage</label>
            <div className="relative">
              <select
                value={config.stage ?? ""}
                onChange={(e) => setConfig("stage", e.target.value)}
                className={`${inp} appearance-none pr-8`}
              >
                <option value="">Select stage…</option>
                {STAGES.map((s) => (
                  <option key={s} value={s}>
                    {s
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        );

      case "ADD_TAG":
        return (
          <div>
            <label className={lbl}>Tag name</label>
            <input
              type="text"
              value={config.tag ?? ""}
              onChange={(e) => setConfig("tag", e.target.value)}
              placeholder="e.g. hot-lead, vip, reengaged"
              className={inp}
            />
          </div>
        );

      case "ASSIGN_LEAD":
        return (
          <div>
            <label className={lbl}>Agent ID</label>
            <input
              type="text"
              value={config.agentId ?? ""}
              onChange={(e) => setConfig("agentId", e.target.value)}
              placeholder="Paste agent UUID"
              className={inp}
            />
            <p className="text-[10px] text-gray-400 mt-1">
              Find agent UUIDs in CRM → Agent Network
            </p>
          </div>
        );

      case "CREATE_TASK":
        return (
          <>
            <div>
              <label className={lbl}>Task title</label>
              <input
                type="text"
                value={config.title ?? ""}
                onChange={(e) => setConfig("title", e.target.value)}
                placeholder="e.g. Follow up with {{firstName}}"
                className={inp}
              />
            </div>
            <div>
              <label className={lbl}>Description (optional)</label>
              <textarea
                rows={2}
                value={config.description ?? ""}
                onChange={(e) => setConfig("description", e.target.value)}
                placeholder="Task details…"
                className={ta}
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-gray-950 w-full sm:max-w-md sm:rounded-2xl shadow-2xl flex flex-col max-h-screen sm:max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
          <h3 className="text-sm font-black text-gray-900 dark:text-white">
            {isEditing ? "Edit Action" : "Add Action"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-4">
          {/* Action type selector */}
          <div>
            <label className={lbl}>Action type *</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ACTION_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() =>
                    onUpdate({ actionType: t, config: {}, delayMinutes: "" })
                  }
                  className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border text-center transition-all
                    ${
                      actionType === t
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500"
                        : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700"
                    }`}
                >
                  <ActionTypeIcon type={t} size="sm" />
                  <span className="text-[9px] font-bold text-gray-600 dark:text-gray-400 leading-tight">
                    {t
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Config fields */}
          {actionType && (
            <div className="space-y-3 pt-1 border-t border-gray-100 dark:border-gray-800">
              {renderConfigFields()}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-2.5 px-4 sm:px-5 py-4 border-t border-gray-200 dark:border-gray-800 flex-shrink-0 bg-white dark:bg-gray-950">
          <button
            onClick={onClose}
            className="flex-1 sm:flex-none sm:w-24 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={isLoading || !actionType}
            className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            {isEditing ? (
              <>
                <Save className="w-3.5 h-3.5" /> Save
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" /> Add Action
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
