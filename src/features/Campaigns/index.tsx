// CampaignsPage  —  /crm/messaging/campaigns

import { useState, useCallback } from "react";
import { Mail, Plus, RefreshCw, Search, X } from "lucide-react";
import { CampaignCard } from "./CampaignCard";
import { CampaignBuilderModal } from "./CampaignBuilderModal";
import {
  useGetCampaignsQuery,
  useGetEmailTemplatesQuery,
  useCreateCampaignMutation,
  useUpdateCampaignMutation,
  useDeleteCampaignMutation,
  useSendCampaignNowMutation,
  usePauseCampaignMutation,
  useCancelCampaignMutation,
  useResumeCampaignMutation,
} from "../../services/messagingManagementApi";
import type {
  Campaign,
  CampaignInput,
  CampaignStatus,
} from "../../types/messaging-management";
import { useToast } from "../../hooks/useToast";

const STATUS_FILTERS: Array<{ id: CampaignStatus | ""; label: string }> = [
  { id: "", label: "All" },
  { id: "DRAFT", label: "Draft" },
  { id: "SCHEDULED", label: "Scheduled" },
  { id: "SENDING", label: "Sending" },
  { id: "SENT", label: "Sent" },
  { id: "PAUSED", label: "Paused" },
  { id: "CANCELLED", label: "Cancelled" },
];

const SkeletonCard = () => (
  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden animate-pulse">
    <div className="h-1 bg-gray-200 dark:bg-gray-700" />
    <div className="p-4 sm:p-5 space-y-3">
      <div className="flex gap-3">
        <div className="flex-1 space-y-1.5">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        </div>
      </div>
      <div className="flex gap-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded"
          />
        ))}
      </div>
      <div className="h-px bg-gray-100 dark:bg-gray-800" />
      <div className="flex gap-2">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-7 w-20 bg-gray-200 dark:bg-gray-700 rounded-xl"
          />
        ))}
      </div>
    </div>
  </div>
);

export const CampaignsPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<CampaignStatus | "">("");
  const [builderOpen, setBuilderOpen] = useState(false);
  const [editing, setEditing] = useState<Campaign | null>(null);
  const [actingId, setActingId] = useState<string | null>(null);

  const toast = useToast();

  const { data, isLoading, isFetching, refetch } = useGetCampaignsQuery({
    search: search || undefined,
    status: status || undefined,
    limit: 50,
  });

  const { data: templatesData } = useGetEmailTemplatesQuery({
    isActive: true,
    limit: 100,
  });

  const [createCampaign, { isLoading: creating }] = useCreateCampaignMutation();
  const [updateCampaign, { isLoading: updating }] = useUpdateCampaignMutation();
  const [deleteCampaign] = useDeleteCampaignMutation();
  const [sendCampaign] = useSendCampaignNowMutation();
  const [pauseCampaign] = usePauseCampaignMutation();
  const [cancelCampaign] = useCancelCampaignMutation();
  const [resumeCampaign] = useResumeCampaignMutation();

  const campaigns = data?.data ?? [];
  const templates = templatesData?.data ?? [];

  const act = useCallback(
    async (id: string, fn: () => Promise<unknown>, msg: string) => {
      setActingId(id);
      try {
        await fn();
        toast.success?.(msg);
      } catch (err: unknown) {
        const m = err instanceof Error ? err.message : "Action failed";
        toast.error?.(m);
      } finally {
        setActingId(null);
      }
    },
    [toast],
  );

  const handleSave = useCallback(
    async (input: CampaignInput) => {
      try {
        if (editing) {
          await updateCampaign({ id: editing.id, data: input }).unwrap();
          toast.success?.("Campaign updated");
        } else {
          await createCampaign(input).unwrap();
          toast.success?.("Campaign created");
        }
        setBuilderOpen(false);
        setEditing(null);
      } catch (err: unknown) {
        const m = err instanceof Error ? err.message : "Failed to save";
        toast.error?.(m);
      }
    },
    [editing, createCampaign, updateCampaign, toast],
  );

  const handleDelete = useCallback(
    async (c: Campaign) => {
      if (!window.confirm(`Delete "${c.name}"? This cannot be undone.`)) return;
      await act(c.id, () => deleteCampaign(c.id).unwrap(), "Campaign deleted");
    },
    [act, deleteCampaign],
  );

  const openCreate = () => {
    setEditing(null);
    setBuilderOpen(true);
  };

  // Count by status for tab badges
  const countByStatus = campaigns.reduce<Record<string, number>>((acc, c) => {
    acc[c.status] = (acc[c.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="max-w-full mx-auto space-y-4 sm:space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-500" />
            Email Campaigns
          </h1>
          <p className="text-[11px] sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {data?.pagination.total ?? 0} campaigns total
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
            <span className="hidden sm:inline">New Campaign</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search campaigns…"
            className="w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-xs sm:text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
        {(search || status) && (
          <button
            onClick={() => {
              setSearch("");
              setStatus("");
            }}
            className="flex items-center gap-1 px-2.5 py-2 rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20 text-red-600 text-[11px] font-bold flex-shrink-0"
          >
            <X className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        )}
      </div>

      {/* Status filter chips */}
      <div
        className="flex gap-1.5 overflow-x-auto pb-0.5"
        style={{ scrollbarWidth: "none" }}
      >
        {STATUS_FILTERS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setStatus(id)}
            className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors
              ${
                status === id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
          >
            {label}
            {id && countByStatus[id] ? (
              <span
                className={`text-[9px] font-black px-1 py-0.5 rounded-full
                ${status === id ? "bg-white/20 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"}`}
              >
                {countByStatus[id]}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {/* Campaign grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : campaigns.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 rounded-2xl border-2 border-dashed border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/10">
          <Mail className="w-12 h-12 text-blue-400 mb-4" />
          <p className="text-sm font-black text-gray-900 dark:text-white mb-1">
            {status || search
              ? "No campaigns match your filters"
              : "No campaigns yet"}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-5 text-center max-w-xs">
            Create your first email campaign to reach your leads at scale
          </p>
          {!status && !search && (
            <button
              onClick={openCreate}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-xs font-bold text-white transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Create Campaign
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          {campaigns.map((c) => (
            <CampaignCard
              key={c.id}
              campaign={c}
              isActing={actingId === c.id}
              onSend={(id) =>
                act(
                  id,
                  () => sendCampaign(id).unwrap(),
                  "Campaign sending started",
                )
              }
              onPause={(id) =>
                act(id, () => pauseCampaign(id).unwrap(), "Campaign paused")
              }
              onCancel={(id) =>
                act(id, () => cancelCampaign(id).unwrap(), "Campaign cancelled")
              }
              onResume={(id) =>
                act(id, () => resumeCampaign(id).unwrap(), "Campaign resumed")
              }
              onEdit={(camp) => {
                setEditing(camp);
                setBuilderOpen(true);
              }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <CampaignBuilderModal
        isOpen={builderOpen}
        editing={editing}
        templates={templates}
        isLoading={creating || updating}
        onSave={handleSave}
        onClose={() => {
          setBuilderOpen(false);
          setEditing(null);
        }}
      />
    </div>
  );
};
