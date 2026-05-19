import { useState, useEffect, useCallback } from "react";
import { X, Save, Plus, Loader2, ChevronDown, Eye, Code2 } from "lucide-react";
import { TokenHelper } from "./TokenHelper";
import type {
  EmailTemplate,
  EmailTemplateInput,
} from "../../../types/messaging-management";

interface Props {
  isOpen: boolean;
  editing: EmailTemplate | null;
  isLoading: boolean;
  onSave: (data: EmailTemplateInput) => void;
  onClose: () => void;
}

interface FormState {
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  category: string;
  isActive: boolean;
}

interface FormErrors {
  name?: string;
  subject?: string;
  htmlContent?: string;
}

const CATEGORIES = [
  "custom",
  "appointment",
  "follow_up",
  "welcome",
  "reminder",
  "campaign",
];

const inp =
  "w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all";

const INITIAL: FormState = {
  name: "",
  subject: "",
  htmlContent: "",
  textContent: "",
  category: "custom",
  isActive: true,
};

export const EmailEditorModal: React.FC<Props> = ({
  isOpen,
  editing,
  isLoading,
  onSave,
  onClose,
}) => {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<FormErrors>({});
  const [mobileTab, setMobileTab] = useState<"editor" | "preview">("editor");

  useEffect(() => {
    if (isOpen && editing) {
      setForm({
        name: editing.name,
        subject: editing.subject,
        htmlContent: editing.htmlContent,
        textContent: editing.textContent ?? "",
        category: editing.category ?? "custom",
        isActive: editing.isActive,
      });
    } else if (!isOpen) {
      setForm(INITIAL);
      setErrors({});
    }
  }, [isOpen, editing]);

  const update = (patch: Partial<FormState>) =>
    setForm((p) => ({ ...p, ...patch }));

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.subject.trim()) e.subject = "Subject is required";
    if (!form.htmlContent.trim()) e.htmlContent = "HTML content is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({
      name: form.name.trim(),
      subject: form.subject.trim(),
      htmlContent: form.htmlContent.trim(),
      textContent: form.textContent.trim() || undefined,
      category: form.category,
      isActive: form.isActive,
    });
  };

  const insertToken = useCallback(
    (token: string) => {
      update({ subject: form.subject + token });
    },
    [form.subject],
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className="relative bg-white dark:bg-gray-950 w-full sm:max-w-5xl sm:rounded-2xl shadow-2xl
        flex flex-col max-h-screen sm:max-h-[92vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
          <div>
            <h2 className="text-sm sm:text-base font-black text-gray-900 dark:text-white">
              {editing ? "Edit Email Template" : "Create Email Template"}
            </h2>
            {editing && (
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                {editing.name}
              </p>
            )}
          </div>
          {/* Mobile tabs */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-0.5">
              <button
                onClick={() => setMobileTab("editor")}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all
                  ${mobileTab === "editor" ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white" : "text-gray-500"}`}
              >
                <Code2 className="w-3 h-3" /> Edit
              </button>
              <button
                onClick={() => setMobileTab("preview")}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all
                  ${mobileTab === "preview" ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white" : "text-gray-500"}`}
              >
                <Eye className="w-3 h-3" /> Preview
              </button>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors lg:ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row min-h-0">
          {/* LEFT — Form */}
          <div
            className={`flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4 lg:border-r lg:border-gray-200 dark:lg:border-gray-800
            ${mobileTab === "preview" ? "hidden lg:block" : ""}`}
          >
            {/* Name + Category row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
                  Template Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => update({ name: e.target.value })}
                  placeholder="e.g. Welcome Email"
                  className={`${inp} ${errors.name ? "border-red-400 dark:border-red-500" : ""}`}
                />
                {errors.name && (
                  <p className="text-[10px] text-red-500 mt-1">{errors.name}</p>
                )}
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
                  Category
                </label>
                <div className="relative">
                  <select
                    value={form.category}
                    onChange={(e) => update({ category: e.target.value })}
                    className={`${inp} appearance-none pr-8`}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
                Subject Line *
              </label>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => update({ subject: e.target.value })}
                placeholder="e.g. Your appointment is confirmed — {{appointmentDate}}"
                className={`${inp} ${errors.subject ? "border-red-400 dark:border-red-500" : ""}`}
              />
              {errors.subject && (
                <p className="text-[10px] text-red-500 mt-1">
                  {errors.subject}
                </p>
              )}
              <p className="text-[10px] text-gray-400 mt-1">
                Tokens like {"{{firstName}}"} work in subject lines too
              </p>
            </div>

            {/* HTML Content */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  HTML Content *
                </label>
                <span className="text-[10px] font-mono text-gray-400">
                  {form.htmlContent.length} chars
                </span>
              </div>
              <textarea
                rows={10}
                value={form.htmlContent}
                onChange={(e) => update({ htmlContent: e.target.value })}
                placeholder={
                  '<div style="font-family:Arial,sans-serif">\n  <h1>Hi {{firstName}},</h1>\n  <p>Your message here...</p>\n</div>'
                }
                className={`${inp} resize-none font-mono text-xs ${errors.htmlContent ? "border-red-400 dark:border-red-500" : ""}`}
              />
              {errors.htmlContent && (
                <p className="text-[10px] text-red-500 mt-1">
                  {errors.htmlContent}
                </p>
              )}
            </div>

            {/* Plain text fallback */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
                Plain Text (optional — auto-generated if empty)
              </label>
              <textarea
                rows={3}
                value={form.textContent}
                onChange={(e) => update({ textContent: e.target.value })}
                placeholder="Plain text version for email clients that don't support HTML…"
                className={`${inp} resize-none text-xs`}
              />
            </div>

            {/* Token helper */}
            <TokenHelper onInsert={insertToken} />

            {/* Active toggle */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <p className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  Active
                </p>
                <p className="text-[10px] text-gray-400">
                  Inactive templates won't appear in campaign builder
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
          </div>

          {/* RIGHT — HTML Preview */}
          <div
            className={`lg:w-96 xl:w-[480px] flex-shrink-0 flex flex-col bg-gray-50 dark:bg-gray-900/50 overflow-hidden
            ${mobileTab === "editor" ? "hidden lg:flex" : "flex"}`}
          >
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
              <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Email Preview
              </p>
              {form.subject && (
                <p className="text-xs text-gray-700 dark:text-gray-300 mt-0.5 font-semibold truncate">
                  Subject:{" "}
                  {form.subject.replace(/\{\{(\w+)\}\}/g, (_, k) => `[${k}]`)}
                </p>
              )}
            </div>
            <div className="flex-1 overflow-auto p-3">
              {form.htmlContent ? (
                <iframe
                  srcDoc={form.htmlContent}
                  title="Email preview"
                  className="w-full min-h-[400px] rounded-xl border border-gray-200 dark:border-gray-700 bg-white"
                  sandbox="allow-same-origin"
                />
              ) : (
                <div className="flex items-center justify-center h-48 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-400 italic">
                    Start adding HTML to see preview…
                  </p>
                </div>
              )}
            </div>
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
                <Plus className="w-3.5 h-3.5" /> Create Template
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
