// MessageTemplatesPage  —  /crm/messaging/templates/messages
// Tabbed page for WhatsApp and SMS templates.

import { useState, useCallback } from "react";
import { MessageSquare, Smartphone, Plus, RefreshCw } from "lucide-react";
import { TemplateList } from "./TemplateList";
import { TemplateFilters } from "./TemplateFilters";
import { TemplateEditorModal } from "./TemplateEditorModal";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import {
  useGetMessageTemplatesQuery,
  useCreateMessageTemplateMutation,
  useUpdateMessageTemplateMutation,
  useDeleteMessageTemplateMutation,
  useToggleMessageTemplateMutation,
} from "../../../services/messagingManagementApi";
import type {
  MessageTemplate,
  MessageTemplateInput,
} from "../../../types/messaging-management";
import { useToast } from "../../../hooks/useToast";

type Tab = "whatsapp" | "sms";

const TAB_CFG = {
  whatsapp: {
    label: "WhatsApp",
    icon: MessageSquare,
    color: "text-green-600 dark:text-green-400",
    active: "border-green-600 text-green-700 dark:text-green-400",
    bg: "bg-green-600 hover:bg-green-700",
  },
  sms: {
    label: "SMS",
    icon: Smartphone,
    color: "text-purple-600 dark:text-purple-400",
    active: "border-purple-600 text-purple-700 dark:text-purple-400",
    bg: "bg-purple-600 hover:bg-purple-700",
  },
} as const;

export const MessageTemplatesPage: React.FC = () => {
  const [tab, setTab] = useState<Tab>("whatsapp");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const [editing, setEditing] = useState<MessageTemplate | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [deleting, setDeleting] = useState<MessageTemplate | null>(null);

  const toast = useToast();

  const { data, isLoading, isFetching, refetch } = useGetMessageTemplatesQuery({
    channel: tab,
    search: search || undefined,
    category: category || undefined,
    isActive: showInactive ? undefined : true,
    limit: 100,
  });

  const [createTemplate, { isLoading: creating }] =
    useCreateMessageTemplateMutation();
  const [updateTemplate, { isLoading: updating }] =
    useUpdateMessageTemplateMutation();
  const [deleteTemplate, { isLoading: deletingQ }] =
    useDeleteMessageTemplateMutation();
  const [toggleTemplate] = useToggleMessageTemplateMutation();

  const templates = data?.data ?? [];

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleSave = useCallback(
    async (input: MessageTemplateInput) => {
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
        const msg =
          err instanceof Error ? err.message : "Failed to save template";
        toast.error?.(msg);
      }
    },
    [editing, createTemplate, updateTemplate, toast],
  );

  const handleEdit = useCallback((t: MessageTemplate) => {
    setEditing(t);
    setEditorOpen(true);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!deleting) return;
    try {
      await deleteTemplate(deleting.id).unwrap();
      toast.success?.("Template deleted");
      setDeleting(null);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to delete template";
      toast.error?.(msg);
    }
  }, [deleting, deleteTemplate, toast]);

  const handleToggle = useCallback(
    async (id: string) => {
      try {
        await toggleTemplate(id).unwrap();
      } catch {
        //
      }
    },
    [toggleTemplate],
  );

  const handleDuplicate = useCallback((t: MessageTemplate) => {
    setEditing({
      ...t,
      id: "",
      name: `${t.name} (copy)`,
      isSystem: false,
    } as MessageTemplate);
    setEditorOpen(true);
  }, []);

  const resetFilters = () => {
    setSearch("");
    setCategory("");
    setShowInactive(false);
  };
  const openCreate = () => {
    setEditing(null);
    setEditorOpen(true);
  };

  const cfg = TAB_CFG[tab];

  return (
    <div className="max-w-full mx-auto space-y-4 sm:space-y-5">
      {/* ── Page header ─────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <cfg.icon className={`w-5 h-5 ${cfg.color}`} />
            Message Templates
          </h1>
          <p className="text-[11px] sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {data?.pagination.total ?? 0} templates · WhatsApp & SMS
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
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white transition-colors ${cfg.bg}`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Template</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>
      </div>

      {/* ── Tabs ────────────────────────────────────────────────────── */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-t-2xl overflow-hidden">
        {(["whatsapp", "sms"] as Tab[]).map((t) => {
          const c = TAB_CFG[t];
          return (
            <button
              key={t}
              onClick={() => {
                setTab(t);
                setSearch("");
                setCategory("");
              }}
              className={`flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all
                ${tab === t ? c.active + " border-b-2" : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}
            >
              <c.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {c.label}
              {data && (
                <span
                  className={`text-[10px] font-black px-1.5 py-0.5 rounded-full
                  ${
                    tab === t
                      ? t === "whatsapp"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30"
                        : "bg-purple-100 text-purple-700 dark:bg-purple-900/30"
                      : "bg-gray-100 text-gray-500 dark:bg-gray-800"
                  }`}
                >
                  {templates.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Filters ─────────────────────────────────────────────────── */}
      <TemplateFilters
        search={search}
        category={category}
        showInactive={showInactive}
        onSearch={setSearch}
        onCategory={setCategory}
        onToggleInactive={() => setShowInactive((v) => !v)}
        onReset={resetFilters}
      />

      {/* ── Template grid ───────────────────────────────────────────── */}
      <TemplateList
        templates={templates}
        isLoading={isLoading}
        channel={tab}
        onEdit={handleEdit}
        onDelete={setDeleting}
        onToggle={handleToggle}
        onDuplicate={handleDuplicate}
        onCreateNew={openCreate}
      />

      {/* ── Pagination info ─────────────────────────────────────────── */}
      {data && data.pagination.total > 0 && (
        <p className="text-[11px] text-gray-400 text-center">
          Showing {templates.length} of {data.pagination.total} templates
        </p>
      )}

      {/* ── Editor modal ─────────────────────────────────────────────── */}
      <TemplateEditorModal
        isOpen={editorOpen}
        editing={editing}
        isLoading={creating || updating}
        onSave={handleSave}
        onClose={() => {
          setEditorOpen(false);
          setEditing(null);
        }}
      />

      {/* ── Delete confirm ───────────────────────────────────────────── */}
      <DeleteConfirmModal
        template={deleting}
        isOpen={!!deleting}
        isLoading={deletingQ}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
};
