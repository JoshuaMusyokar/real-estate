// ─────────────────────────────────────────────────────────────────────────────
// CampaignDetailPage  —  /crm/messaging/campaigns/:id
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  RefreshCw,
  BookOpen,
  CalendarDays,
  Users,
} from "lucide-react";
import { CampaignStats } from "./CampaignStats";
import { CampaignStatusBadge } from "./CampaignStatusBadge";
import { CampaignActions } from "./CampaignActions";
import { CampaignBuilderModal } from "./CampaignBuilderModal";
import { RecipientFiltersPanel } from "./RecipientFiltersPanel";
import { RecipientTable } from "./RecipientTable";
import {
  useGetCampaignByIdQuery,
  useGetEmailTemplatesQuery,
  useUpdateCampaignMutation,
  useSendCampaignNowMutation,
  usePauseCampaignMutation,
  useCancelCampaignMutation,
  useResumeCampaignMutation,
  useGetCampaignRecipientsQuery,
  useAddCampaignRecipientsMutation,
  useRemoveCampaignRecipientMutation,
} from "../../services/messagingManagementApi";
import type {
  CampaignInput,
  RecipientFilter,
} from "../../types/messaging-management";
import { useToast } from "../../hooks/useToast";

const fmtDate = (d?: string | null) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

// ── Progress bar for delivery rate ────────────────────────────────────────
const DeliveryProgress: React.FC<{ sent: number; total: number }> = ({
  sent,
  total,
}) => {
  const pct = total > 0 ? Math.round((sent / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Delivery Progress
        </span>
        <span className="text-[11px] font-black text-gray-900 dark:text-white">
          {pct}%
        </span>
      </div>
      <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-[10px] text-gray-400 mt-1">
        {sent.toLocaleString()} of {total.toLocaleString()} sent
      </p>
    </div>
  );
};

export const CampaignDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const [editorOpen, setEditorOpen] = useState(false);
  const [recipPage, setRecipPage] = useState(1);
  const [isActing, setIsActing] = useState(false);

  const { data, isLoading, refetch } = useGetCampaignByIdQuery(id!, {
    skip: !id,
  });
  const { data: templatesData } = useGetEmailTemplatesQuery({
    isActive: true,
    limit: 100,
  });
  const { data: recipData, isLoading: recipLoading } =
    useGetCampaignRecipientsQuery(
      { id: id!, page: recipPage, limit: 50 },
      { skip: !id },
    );

  const [updateCampaign, { isLoading: updating }] = useUpdateCampaignMutation();
  const [sendCampaign] = useSendCampaignNowMutation();
  const [pauseCampaign] = usePauseCampaignMutation();
  const [cancelCampaign] = useCancelCampaignMutation();
  const [resumeCampaign] = useResumeCampaignMutation();
  const [addRecipients, { isLoading: addingRecip }] =
    useAddCampaignRecipientsMutation();
  const [removeRecipient] = useRemoveCampaignRecipientMutation();

  const campaign = data?.data;
  const recipients = recipData?.data ?? [];
  const recipTotal = recipData?.pagination.total ?? 0;
  const templates = templatesData?.data ?? [];

  const act = useCallback(
    async (fn: () => Promise<unknown>, msg: string) => {
      setIsActing(true);
      try {
        await fn();
        toast.success?.(msg);
      } catch (err: unknown) {
        toast.error?.(err instanceof Error ? err.message : "Action failed");
      } finally {
        setIsActing(false);
      }
    },
    [toast],
  );

  const handleUpdate = useCallback(
    async (input: CampaignInput) => {
      if (!id) return;
      try {
        await updateCampaign({ id, data: input }).unwrap();
        toast.success?.("Campaign updated");
        setEditorOpen(false);
      } catch (err: unknown) {
        toast.error?.(err instanceof Error ? err.message : "Failed to save");
      }
    },
    [id, updateCampaign, toast],
  );

  const handleAddRecipients = useCallback(
    async (filter: RecipientFilter) => {
      if (!id) return;
      try {
        const result = await addRecipients({ id, filter }).unwrap();
        toast.success?.(
          `Added ${result.added} leads (${result.skipped} already added)`,
        );
      } catch (err: unknown) {
        toast.error?.(
          err instanceof Error ? err.message : "Failed to add recipients",
        );
      }
    },
    [id, addRecipients, toast],
  );

  const handleRemove = useCallback(
    async (leadId: string) => {
      if (!id) return;
      try {
        await removeRecipient({ campaignId: id, leadId }).unwrap();
      } catch {
        //
      }
    },
    [id, removeRecipient],
  );

  if (isLoading) {
    return (
      <div className="max-w-full mx-auto space-y-4">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-20 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="text-center py-20">
        <p className="text-sm font-semibold text-gray-500">
          Campaign not found
        </p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-xs text-blue-500 hover:underline"
        >
          Go back
        </button>
      </div>
    );
  }

  const canEdit = ["DRAFT", "SCHEDULED"].includes(campaign.status);
  const canAddRecip = canEdit;

  return (
    <div className="max-w-full mx-auto space-y-4 sm:space-y-5">
      {/* ── Back + Header ─────────────────────────────────────────────── */}
      <div className="flex items-start gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 mt-0.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-lg sm:text-2xl font-black text-gray-900 dark:text-white truncate">
              {campaign.name}
            </h1>
            <CampaignStatusBadge status={campaign.status} />
          </div>
          <p className="text-[11px] sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate">
            Subject: {campaign.subject}
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="p-2 mt-0.5 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ── Stats cards ──────────────────────────────────────────────── */}
      <CampaignStats stats={campaign.stats} />

      {/* ── Two column layout on lg ───────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        {/* LEFT — Campaign info + actions */}
        <div className="space-y-4">
          {/* Campaign info card */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 sm:p-5">
            <h2 className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4">
              Campaign Details
            </h2>
            <div className="space-y-3">
              {[
                {
                  label: "Template",
                  icon: BookOpen,
                  value: campaign.template.name,
                },
                {
                  label: "Recipients",
                  icon: Users,
                  value: `${campaign._count.recipients.toLocaleString()} leads`,
                },
                {
                  label: "Created",
                  icon: CalendarDays,
                  value: fmtDate(campaign.createdAt),
                },
                ...(campaign.scheduledAt
                  ? [
                      {
                        label: "Scheduled",
                        icon: CalendarDays,
                        value: fmtDate(campaign.scheduledAt),
                      },
                    ]
                  : []),
                ...(campaign.sentAt
                  ? [
                      {
                        label: "Sent",
                        icon: CalendarDays,
                        value: fmtDate(campaign.sentAt),
                      },
                    ]
                  : []),
              ].map(({ label, icon: Icon, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide font-bold">
                      {label}
                    </p>
                    <p className="text-xs font-semibold text-gray-900 dark:text-white mt-0.5">
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery progress */}
          {campaign.stats.total > 0 && (
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 sm:p-5">
              <DeliveryProgress
                sent={campaign.stats.sent}
                total={campaign.stats.total}
              />
            </div>
          )}

          {/* Actions */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 sm:p-5">
            <h2 className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">
              Actions
            </h2>
            <CampaignActions
              status={campaign.status}
              isLoading={isActing || updating}
              layout="column"
              onSend={() =>
                act(
                  () => sendCampaign(campaign.id).unwrap(),
                  "Campaign sending started",
                )
              }
              onPause={() =>
                act(
                  () => pauseCampaign(campaign.id).unwrap(),
                  "Campaign paused",
                )
              }
              onCancel={() =>
                act(
                  () => cancelCampaign(campaign.id).unwrap(),
                  "Campaign cancelled",
                )
              }
              onResume={() =>
                act(
                  () => resumeCampaign(campaign.id).unwrap(),
                  "Campaign resumed",
                )
              }
              onEdit={canEdit ? () => setEditorOpen(true) : undefined}
            />
          </div>
        </div>

        {/* RIGHT — Recipients */}
        <div className="lg:col-span-2 space-y-4">
          {/* Add recipients panel */}
          {canAddRecip && (
            <RecipientFiltersPanel
              campaignId={campaign.id}
              isLoading={addingRecip}
              onAdd={handleAddRecipients}
            />
          )}

          {/* Recipients table */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-widest">
                Recipients
                {recipTotal > 0 && (
                  <span className="ml-2 text-[10px] font-black px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    {recipTotal.toLocaleString()}
                  </span>
                )}
              </h2>
            </div>
            <div className="p-4 sm:p-5">
              <RecipientTable
                campaignId={campaign.id}
                recipients={recipients}
                total={recipTotal}
                page={recipPage}
                isLoading={recipLoading}
                canRemove={canAddRecip}
                onPageChange={setRecipPage}
                onRemove={handleRemove}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Edit modal */}
      <CampaignBuilderModal
        isOpen={editorOpen}
        editing={campaign}
        templates={templates}
        isLoading={updating}
        onSave={handleUpdate}
        onClose={() => setEditorOpen(false)}
      />
    </div>
  );
};
