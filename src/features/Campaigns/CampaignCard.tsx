import { useNavigate } from "react-router-dom";
import { Users, CalendarDays, BookOpen, ChevronRight } from "lucide-react";
import { CampaignStatusBadge } from "./CampaignStatusBadge";
import { CampaignActions } from "./CampaignActions";
import type { Campaign } from "../../types/messaging-management";

interface Props {
  campaign: Campaign;
  onSend: (id: string) => void;
  onPause: (id: string) => void;
  onCancel: (id: string) => void;
  onResume: (id: string) => void;
  onEdit: (c: Campaign) => void;
  onDelete: (c: Campaign) => void;
  isActing?: boolean;
}

const fmtDate = (d?: string | null) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

export const CampaignCard: React.FC<Props> = ({
  campaign,
  onSend,
  onPause,
  onCancel,
  onResume,
  onEdit,
  onDelete,
  isActing,
}) => {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden
      hover:shadow-md transition-all duration-200 group"
    >
      {/* Coloured status strip */}
      <div
        className={`h-1 ${
          campaign.status === "SENT"
            ? "bg-emerald-500"
            : campaign.status === "SENDING"
              ? "bg-amber-500 animate-pulse"
              : campaign.status === "SCHEDULED"
                ? "bg-blue-500"
                : campaign.status === "PAUSED"
                  ? "bg-violet-500"
                  : campaign.status === "CANCELLED"
                    ? "bg-red-400"
                    : "bg-gray-200 dark:bg-gray-700"
        }`}
      />

      <div className="p-4 sm:p-5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <button
                onClick={() =>
                  navigate(`/crm/messaging/campaigns/${campaign.id}`)
                }
                className="text-sm font-black text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate max-w-[200px] sm:max-w-none text-left"
              >
                {campaign.name}
              </button>
              <CampaignStatusBadge status={campaign.status} size="xs" />
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
              Subject: {campaign.subject}
            </p>
          </div>
          <button
            onClick={() => navigate(`/crm/messaging/campaigns/${campaign.id}`)}
            className="p-1.5 rounded-xl text-gray-300 dark:text-gray-600 group-hover:text-blue-500 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-all flex-shrink-0"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-4 text-[11px] text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            {campaign.template.name}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {campaign._count.recipients.toLocaleString()} recipients
          </span>
          {campaign.scheduledAt && (
            <span className="flex items-center gap-1">
              <CalendarDays className="w-3 h-3" />
              {fmtDate(campaign.scheduledAt)}
            </span>
          )}
          {campaign.sentAt && (
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              Sent {fmtDate(campaign.sentAt)}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
          <CampaignActions
            status={campaign.status}
            isLoading={isActing}
            onSend={() => onSend(campaign.id)}
            onPause={() => onPause(campaign.id)}
            onCancel={() => onCancel(campaign.id)}
            onResume={() => onResume(campaign.id)}
            onEdit={() => onEdit(campaign)}
            onDelete={() => onDelete(campaign)}
          />
        </div>
      </div>
    </div>
  );
};
