import { useEffect, useCallback } from "react";
import {
  X,
  Save,
  Plus,
  Loader2,
  CalendarClock,
  Send,
  ChevronDown,
} from "lucide-react";
import { useCampaignBuilder } from "../../hooks/useCampaignBuilder";
import type { Campaign, EmailTemplate } from "../../types/messaging-management";
import DateTimePicker from "../../components/form/input/DateTimePicker";

interface Props {
  isOpen: boolean;
  editing: Campaign | null;
  templates: EmailTemplate[];
  isLoading: boolean;
  onSave: (
    input: ReturnType<ReturnType<typeof useCampaignBuilder>["toInput"]>,
  ) => void;
  onClose: () => void;
}

const inp =
  "w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all";

// Defined outside component — plain value, not a hook
const getMinDate = () => new Date(Date.now() + 5 * 60_000);

export const CampaignBuilderModal: React.FC<Props> = ({
  isOpen,
  editing,
  templates,
  isLoading,
  onSave,
  onClose,
}) => {
  const { form, errors, update, validate, toInput, reset } = useCampaignBuilder(
    editing ?? undefined,
  );

  // ── ALL hooks before any conditional return ────────────────────────────

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  const handleSave = useCallback(() => {
    if (validate()) onSave(toInput());
  }, [validate, onSave, toInput]);

  const handleTemplateChange = useCallback(
    (templateId: string) => {
      update({ templateId });
      const tmpl = templates.find((t) => t.id === templateId);
      if (tmpl && !form.subject) update({ subject: tmpl.subject });
    },
    [update, templates, form.subject],
  );

  const handleDateChange = useCallback(
    (dates: Date[]) => {
      const selected = dates[0];
      if (!selected) return;
      update({ scheduledAt: selected.toISOString() });
    },
    [update],
  );

  // ── Early return AFTER all hooks ───────────────────────────────────────
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
      <div className="relative bg-white dark:bg-gray-950 w-full sm:max-w-lg sm:rounded-2xl shadow-2xl flex flex-col max-h-screen sm:max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
          <div>
            <h2 className="text-sm sm:text-base font-black text-gray-900 dark:text-white">
              {editing ? "Edit Campaign" : "New Campaign"}
            </h2>
            {editing && (
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                {editing.name}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
              Campaign name *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => update({ name: e.target.value })}
              placeholder="e.g. April Viewing Reminder"
              className={`${inp} ${errors.name ? "border-red-400 dark:border-red-500" : ""}`}
            />
            {errors.name && (
              <p className="text-[10px] text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Template */}
          <div>
            <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
              Email template *
            </label>
            <div className="relative">
              <select
                value={form.templateId}
                onChange={(e) => handleTemplateChange(e.target.value)}
                className={`${inp} appearance-none pr-8 ${errors.templateId ? "border-red-400 dark:border-red-500" : ""}`}
              >
                <option value="">Select a template…</option>
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            </div>
            {errors.templateId && (
              <p className="text-[10px] text-red-500 mt-1">
                {errors.templateId}
              </p>
            )}
          </div>

          {/* Subject */}
          <div>
            <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
              Subject line *
            </label>
            <input
              type="text"
              value={form.subject}
              onChange={(e) => update({ subject: e.target.value })}
              placeholder="e.g. Don't miss your property viewing this week"
              className={`${inp} ${errors.subject ? "border-red-400 dark:border-red-500" : ""}`}
            />
            {errors.subject && (
              <p className="text-[10px] text-red-500 mt-1">{errors.subject}</p>
            )}
          </div>

          {/* Schedule */}
          <div>
            <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
              Send time
            </label>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {(["now", "later"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => update({ scheduleMode: mode })}
                  className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-bold transition-all
                    ${
                      form.scheduleMode === mode
                        ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                        : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                >
                  {mode === "now" ? (
                    <>
                      <Send className="w-3.5 h-3.5" /> Send immediately
                    </>
                  ) : (
                    <>
                      <CalendarClock className="w-3.5 h-3.5" /> Schedule for
                      later
                    </>
                  )}
                </button>
              ))}
            </div>

            {form.scheduleMode === "later" && (
              <div>
                <DateTimePicker
                  id="campaign-scheduled-at"
                  placeholder="Pick a date and time…"
                  minDate={getMinDate()}
                  enableTime
                  time24hr={false}
                  minuteIncrement={15}
                  defaultDate={
                    form.scheduledAt ? new Date(form.scheduledAt) : undefined
                  }
                  onChange={handleDateChange}
                />
                {errors.scheduledAt && (
                  <p className="text-[10px] text-red-500 mt-1">
                    {errors.scheduledAt}
                  </p>
                )}
                {form.scheduledAt && (
                  <p className="text-[11px] text-blue-600 dark:text-blue-400 mt-1.5 flex items-center gap-1">
                    <CalendarClock className="w-3 h-3" />
                    Will send:{" "}
                    {new Date(form.scheduledAt).toLocaleString("en-IN", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Info note */}
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
            <p className="text-[11px] text-blue-700 dark:text-blue-400">
              <span className="font-bold">After creating:</span> Add recipients
              using the filter panel on the campaign detail page before sending.
            </p>
          </div>
        </div>

        {/* Footer */}
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
            className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
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
                <Plus className="w-3.5 h-3.5" /> Create Campaign
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
