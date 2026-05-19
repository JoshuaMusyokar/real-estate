import {
  Send,
  Pause,
  X,
  RotateCcw,
  Loader2,
  Pencil,
  Trash2,
} from "lucide-react";
import type { CampaignStatus } from "../../types/messaging-management";

interface Props {
  status: CampaignStatus;
  onSend?: () => void;
  onPause?: () => void;
  onCancel?: () => void;
  onResume?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isLoading?: boolean;
  layout?: "row" | "column";
}

export const CampaignActions: React.FC<Props> = ({
  status,
  onSend,
  onPause,
  onCancel,
  onResume,
  onEdit,
  onDelete,
  isLoading,
  layout = "row",
}) => {
  const flex = layout === "column" ? "flex-col" : "flex-wrap";

  return (
    <div className={`flex ${flex} gap-2`}>
      {/* Send Now — DRAFT or SCHEDULED */}
      {(status === "DRAFT" || status === "SCHEDULED") && onSend && (
        <button
          onClick={onSend}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl text-xs font-bold transition-colors"
        >
          {isLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Send className="w-3.5 h-3.5" />
          )}
          Send Now
        </button>
      )}

      {/* Pause — SENDING or SCHEDULED */}
      {(status === "SENDING" || status === "SCHEDULED") && onPause && (
        <button
          onClick={onPause}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-2 bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/30 dark:hover:bg-amber-900/50 text-amber-700 dark:text-amber-400 rounded-xl text-xs font-bold transition-colors"
        >
          <Pause className="w-3.5 h-3.5" /> Pause
        </button>
      )}

      {/* Resume — PAUSED */}
      {status === "PAUSED" && onResume && (
        <button
          onClick={onResume}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-2 bg-violet-100 hover:bg-violet-200 dark:bg-violet-900/30 dark:hover:bg-violet-900/50 text-violet-700 dark:text-violet-400 rounded-xl text-xs font-bold transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Resume
        </button>
      )}

      {/* Edit — DRAFT or SCHEDULED */}
      {(status === "DRAFT" || status === "SCHEDULED") && onEdit && (
        <button
          onClick={onEdit}
          className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold transition-colors"
        >
          <Pencil className="w-3.5 h-3.5" /> Edit
        </button>
      )}

      {/* Cancel — not SENT or CANCELLED */}
      {!["SENT", "CANCELLED"].includes(status) && onCancel && (
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-xs font-bold transition-colors"
        >
          <X className="w-3.5 h-3.5" /> Cancel
        </button>
      )}

      {/* Delete — DRAFT only */}
      {status === "DRAFT" && onDelete && (
        <button
          onClick={onDelete}
          className="flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-xs font-bold transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" /> Delete
        </button>
      )}
    </div>
  );
};
