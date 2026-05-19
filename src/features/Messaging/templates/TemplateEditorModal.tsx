import { useEffect } from "react";
import { X, Save, Plus, Loader2, ChevronDown } from "lucide-react";
import { useTemplateEditor } from "../../../hooks/useTemplateEditor";
import { TemplatePreviewPane } from "./TemplatePreviewPane";
import { TokenHelper } from "./TokenHelper";
import type { MessageTemplate } from "../../../types/messaging-management";

interface Props {
  isOpen: boolean;
  editing: MessageTemplate | null; // null = create mode
  isLoading: boolean;
  onSave: (
    data: ReturnType<ReturnType<typeof useTemplateEditor>["toInput"]>,
  ) => void;
  onClose: () => void;
}

const CATEGORIES = [
  { id: "custom", label: "Custom" },
  { id: "appointment", label: "Appointment" },
  { id: "follow_up", label: "Follow-up" },
  { id: "welcome", label: "Welcome" },
  { id: "reminder", label: "Reminder" },
  { id: "campaign", label: "Campaign" },
];

const inp =
  "w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all";

export const TemplateEditorModal: React.FC<Props> = ({
  isOpen,
  editing,
  isLoading,
  onSave,
  onClose,
}) => {
  const {
    form,
    errors,
    preview,
    usedVars,
    charCount,
    textareaRef,
    update,
    insertToken,
    validate,
    toInput,
    reset,
  } = useTemplateEditor(editing ?? undefined);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (validate()) onSave(toInput());
  };

  const isReadOnly = editing?.isSystem ?? false;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal — full height on mobile, max-h on desktop */}
      <div
        className="relative bg-white dark:bg-gray-950 w-full sm:max-w-4xl sm:rounded-2xl shadow-2xl
        flex flex-col max-h-screen sm:max-h-[92vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-sm sm:text-base font-black text-gray-900 dark:text-white">
                {editing
                  ? isReadOnly
                    ? "View Template"
                    : "Edit Template"
                  : "Create Template"}
              </h2>
              {editing && (
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  {editing.name}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body — split on desktop */}
        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row min-h-0">
          {/* LEFT — Editor */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4 lg:border-r lg:border-gray-200 dark:lg:border-gray-800">
            {/* Name */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
                Template name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update({ name: e.target.value })}
                placeholder="e.g. Appointment Confirmation"
                disabled={isReadOnly}
                className={`${inp} ${errors.name ? "border-red-400 dark:border-red-500" : ""} disabled:opacity-60 disabled:cursor-not-allowed`}
              />
              {errors.name && (
                <p className="text-[10px] text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            {/* Channel + Category row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
                  Channel *
                </label>
                <div className="relative">
                  <select
                    value={form.channel}
                    onChange={(e) =>
                      update({ channel: e.target.value as "whatsapp" | "sms" })
                    }
                    disabled={isReadOnly || !!editing}
                    className={`${inp} appearance-none pr-8 disabled:opacity-60 disabled:cursor-not-allowed`}
                  >
                    <option value="whatsapp">WhatsApp</option>
                    <option value="sms">SMS</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
                  Category
                </label>
                <div className="relative">
                  <select
                    value={form.category}
                    onChange={(e) => update({ category: e.target.value })}
                    disabled={isReadOnly}
                    className={`${inp} appearance-none pr-8 disabled:opacity-60 disabled:cursor-not-allowed`}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Content */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Message content *
                </label>
                <span
                  className={`text-[10px] font-mono ${charCount > 4096 ? "text-red-500" : "text-gray-400"}`}
                >
                  {charCount}/4096
                </span>
              </div>
              <textarea
                ref={textareaRef}
                rows={7}
                value={form.content}
                onChange={(e) => update({ content: e.target.value })}
                placeholder={
                  form.channel === "whatsapp"
                    ? "Hi *{{firstName}}*! 👋\n\nYour appointment is confirmed for {{appointmentDate}} at {{appointmentTime}}.\n\nSee you soon! 🏠"
                    : "Hi {{firstName}}, your appointment is on {{appointmentDate}} at {{appointmentTime}}. Reply STOP to unsubscribe."
                }
                disabled={isReadOnly}
                className={`${inp} resize-none disabled:opacity-60 disabled:cursor-not-allowed ${errors.content ? "border-red-400 dark:border-red-500" : ""}`}
              />
              {errors.content && (
                <p className="text-[10px] text-red-500 mt-1">
                  {errors.content}
                </p>
              )}
              {form.channel === "whatsapp" && !isReadOnly && (
                <p className="text-[10px] text-gray-400 mt-1">
                  Use *text* for bold, _text_ for italic
                </p>
              )}
            </div>

            {/* Token helper */}
            {!isReadOnly && <TokenHelper onInsert={insertToken} />}

            {/* Active toggle */}
            {!isReadOnly && (
              <div className="flex items-center justify-between pt-1">
                <div>
                  <p className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    Active
                  </p>
                  <p className="text-[10px] text-gray-400">
                    Inactive templates won't be used in workflows
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => update({ isActive: e.target.checked })}
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
            )}
          </div>

          {/* RIGHT — Live Preview (hidden on mobile, shown as sheet on tablet+) */}
          <div className="hidden lg:flex lg:w-80 xl:w-96 flex-col px-5 py-4 bg-gray-50 dark:bg-gray-900/50 overflow-y-auto">
            <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              Live Preview
            </p>
            <TemplatePreviewPane
              channel={form.channel}
              preview={preview}
              usedVars={usedVars}
              charCount={charCount}
            />
          </div>
        </div>

        {/* Footer */}
        {!isReadOnly && (
          <div className="flex gap-2.5 px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex-shrink-0 bg-white dark:bg-gray-950">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none sm:w-28 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold text-white transition-colors flex items-center justify-center gap-1.5 disabled:opacity-60
                ${form.channel === "whatsapp" ? "bg-green-600 hover:bg-green-700" : "bg-purple-600 hover:bg-purple-700"}`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving…
                </>
              ) : editing ? (
                <>
                  <Save className="w-3.5 h-3.5" /> Save Changes
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" /> Create Template
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
