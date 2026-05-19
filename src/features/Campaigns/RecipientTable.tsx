import {
  Trash2,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Mail,
  Clock,
  AlertCircle,
  MousePointerClick,
} from "lucide-react";
import type { CampaignRecipient } from "../../types/messaging-management";

interface Props {
  campaignId: string;
  recipients: CampaignRecipient[];
  total: number;
  page: number;
  isLoading: boolean;
  canRemove: boolean; // false when campaign is SENT/SENDING
  onPageChange: (p: number) => void;
  onRemove: (leadId: string) => void;
}

const fmt = (d?: string | null) =>
  d
    ? new Date(d).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

const StatusDot: React.FC<{ recipient: CampaignRecipient }> = ({
  recipient,
}) => {
  if (recipient.bouncedAt)
    return (
      <span
        title="Bounced"
        className="flex items-center gap-1 text-[10px] text-red-500"
      >
        <AlertCircle className="w-3 h-3" /> Bounced
      </span>
    );
  if (recipient.clickedAt)
    return (
      <span
        title="Clicked"
        className="flex items-center gap-1 text-[10px] text-violet-600 dark:text-violet-400"
      >
        <MousePointerClick className="w-3 h-3" /> Clicked
      </span>
    );
  if (recipient.openedAt)
    return (
      <span
        title="Opened"
        className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400"
      >
        <Mail className="w-3 h-3" /> Opened
      </span>
    );
  if (recipient.sentAt)
    return (
      <span
        title="Sent"
        className="flex items-center gap-1 text-[10px] text-blue-600 dark:text-blue-400"
      >
        <CheckCircle2 className="w-3 h-3" /> Sent
      </span>
    );
  return (
    <span
      title="Pending"
      className="flex items-center gap-1 text-[10px] text-gray-400"
    >
      <Clock className="w-3 h-3" /> Pending
    </span>
  );
};

const LIMIT = 50;

export const RecipientTable: React.FC<Props> = ({
  recipients,
  total,
  page,
  isLoading,
  canRemove,
  onPageChange,
  onRemove,
}) => {
  const pages = Math.ceil(total / LIMIT);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-12 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (recipients.length === 0) {
    return (
      <div className="text-center py-10 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
        <Mail className="w-10 h-10 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
          No recipients yet
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Use the filter above to add leads
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <tr>
              {["Lead", "Email", "Stage", "Status", "Sent", "Opened", ""].map(
                (h) => (
                  <th
                    key={h}
                    className="px-3 py-2.5 text-left text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {recipients.map((r) => (
              <tr
                key={r.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors group"
              >
                <td className="px-3 py-2.5 font-semibold text-gray-900 dark:text-white">
                  {r.lead.firstName} {r.lead.lastName}
                </td>
                <td className="px-3 py-2.5 text-gray-500 dark:text-gray-400 max-w-[160px] truncate">
                  {r.lead.email ?? "—"}
                </td>
                <td className="px-3 py-2.5">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                    {r.lead.stage.replace(/_/g, " ")}
                  </span>
                </td>
                <td className="px-3 py-2.5">
                  <StatusDot recipient={r} />
                </td>
                <td className="px-3 py-2.5 text-gray-400">{fmt(r.sentAt)}</td>
                <td className="px-3 py-2.5 text-gray-400">{fmt(r.openedAt)}</td>
                <td className="px-3 py-2.5">
                  {canRemove && !r.sentAt && (
                    <button
                      onClick={() => onRemove(r.leadId)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-2">
        {recipients.map((r) => (
          <div
            key={r.id}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs font-bold text-gray-900 dark:text-white">
                  {r.lead.firstName} {r.lead.lastName}
                </p>
                <p className="text-[10px] text-gray-400 truncate">
                  {r.lead.email}
                </p>
              </div>
              <StatusDot recipient={r} />
            </div>
            {r.sentAt && (
              <p className="text-[10px] text-gray-400 mt-1">
                Sent: {fmt(r.sentAt)}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] text-gray-500">
            {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)} of{" "}
            {total.toLocaleString()}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
              className="p-1.5 border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 px-1">
              {page}/{pages}
            </span>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= pages}
              className="p-1.5 border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
