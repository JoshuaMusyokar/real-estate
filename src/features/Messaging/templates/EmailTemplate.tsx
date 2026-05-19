// EmailTemplatesPage  —  /crm/messaging/templates/email

import { useState, useCallback } from "react";
import { Mail, Plus, RefreshCw, Search, X } from "lucide-react";
import { EmailTemplateList } from "./EmailTemplateList";
import { EmailEditorModal } from "./EmailEditorModal";
import {
  useGetEmailTemplatesQuery,
  useCreateEmailTemplateMutation,
  useUpdateEmailTemplateMutation,
  useDeleteEmailTemplateMutation,
} from "../../../services/messagingManagementApi";
import type {
  EmailTemplate,
  EmailTemplateInput,
} from "../../../types/messaging-management";
import { useToast } from "../../../hooks/useToast";

// Delete confirm inline (reusing pattern, no separate file needed for email)
const EmailDeleteConfirm: React.FC<{
  template: EmailTemplate | null;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ template, isLoading, onConfirm, onCancel }) => {
  if (!template) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-5 sm:p-6">
        <p className="text-sm font-black text-gray-900 dark:text-white mb-2">
          Delete email template?
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">
          <span className="font-semibold">"{template.name}"</span> will be
          permanently deleted.
          {template._count && template._count.campaigns > 0 && (
            <span className="text-red-500">
              {" "}
              This template is used by {template._count.campaigns} campaign(s)
              and cannot be deleted.
            </span>
          )}
        </p>
        <div className="flex gap-2.5">
          <button
            onClick={onCancel}
            className="flex-1 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading || (template._count?.campaigns ?? 0) > 0}
            className="flex-1 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl text-xs font-bold transition-colors"
          >
            {isLoading ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Preview modal (renders iframe)
const PreviewModal: React.FC<{
  template: EmailTemplate | null;
  onClose: () => void;
}> = ({ template, onClose }) => {
  if (!template) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-gray-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
          <div>
            <p className="text-sm font-black text-gray-900 dark:text-white">
              {template.name}
            </p>
            <p className="text-[11px] text-gray-500">
              Subject: {template.subject}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4">
          <iframe
            srcDoc={template.htmlContent}
            title="Email preview"
            className="w-full min-h-[500px] border border-gray-200 dark:border-gray-700 rounded-xl bg-white"
            sandbox="allow-same-origin"
          />
        </div>
      </div>
    </div>
  );
};

export const EmailTemplatesPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [editing, setEditing] = useState<EmailTemplate | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [deleting, setDeleting] = useState<EmailTemplate | null>(null);
  const [previewing, setPreviewing] = useState<EmailTemplate | null>(null);

  const toast = useToast();

  const { data, isLoading, isFetching, refetch } = useGetEmailTemplatesQuery({
    search: search || undefined,
    category: category || undefined,
    limit: 100,
  });

  const [createTemplate, { isLoading: creating }] =
    useCreateEmailTemplateMutation();
  const [updateTemplate, { isLoading: updating }] =
    useUpdateEmailTemplateMutation();
  const [deleteTemplate, { isLoading: deletingQ }] =
    useDeleteEmailTemplateMutation();

  const templates = data?.data ?? [];

  const handleSave = useCallback(
    async (input: EmailTemplateInput) => {
      try {
        if (editing) {
          await updateTemplate({ id: editing.id, data: input }).unwrap();
          toast.success?.("Template updated");
        } else {
          await createTemplate(input).unwrap();
          toast.success?.("Template created");
        }
        setEditorOpen(false);
        setEditing(null);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to save";
        toast.error?.(msg);
      }
    },
    [editing, createTemplate, updateTemplate, toast],
  );

  const handleDelete = useCallback(async () => {
    if (!deleting) return;
    try {
      await deleteTemplate(deleting.id).unwrap();
      toast.success?.("Template deleted");
      setDeleting(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete";
      toast.error?.(msg);
    }
  }, [deleting, deleteTemplate, toast]);

  const handleDuplicate = useCallback((t: EmailTemplate) => {
    setEditing({ ...t, id: "", name: `${t.name} (copy)` } as EmailTemplate);
    setEditorOpen(true);
  }, []);

  const openCreate = () => {
    setEditing(null);
    setEditorOpen(true);
  };

  const CATS = [
    "",
    "appointment",
    "follow_up",
    "welcome",
    "reminder",
    "campaign",
    "custom",
  ];

  return (
    <div className="max-w-full mx-auto space-y-4 sm:space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-500" />
            Email Templates
          </h1>
          <p className="text-[11px] sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {data?.pagination.total ?? 0} templates · Used in campaigns and
            automation
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            className="p-2 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`}
            />
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Template</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-2.5">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search email templates…"
              className="w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-xs sm:text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          {(search || category) && (
            <button
              onClick={() => {
                setSearch("");
                setCategory("");
              }}
              className="flex items-center gap-1 px-2.5 py-2 rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20 text-red-600 text-[11px] font-bold flex-shrink-0"
            >
              <X className="w-3 h-3" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
        <div
          className="flex gap-1.5 overflow-x-auto pb-0.5"
          style={{ scrollbarWidth: "none" }}
        >
          {CATS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors
                ${
                  category === c
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
            >
              {c === ""
                ? "All"
                : c.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      {/* Template grid */}
      <EmailTemplateList
        templates={templates}
        isLoading={isLoading}
        onEdit={(t) => {
          setEditing(t);
          setEditorOpen(true);
        }}
        onDelete={setDeleting}
        onDuplicate={handleDuplicate}
        onPreview={setPreviewing}
        onCreateNew={openCreate}
      />

      {data && data.pagination.total > 0 && (
        <p className="text-[11px] text-gray-400 text-center">
          Showing {templates.length} of {data.pagination.total} templates
        </p>
      )}

      <EmailEditorModal
        isOpen={editorOpen}
        editing={editing}
        isLoading={creating || updating}
        onSave={handleSave}
        onClose={() => {
          setEditorOpen(false);
          setEditing(null);
        }}
      />

      <EmailDeleteConfirm
        template={deleting}
        isLoading={deletingQ}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />

      <PreviewModal template={previewing} onClose={() => setPreviewing(null)} />
    </div>
  );
};
