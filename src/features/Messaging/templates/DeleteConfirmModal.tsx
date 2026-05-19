import { AlertTriangle, Loader2 } from "lucide-react";
import type { MessageTemplate } from "../../../types/messaging-management";

interface Props {
  template: MessageTemplate | null;
  isOpen: boolean;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmModal: React.FC<Props> = ({
  template,
  isOpen,
  isLoading,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen || !template) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-gray-900 dark:text-white mb-1">
              Delete template?
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                "{template.name}"
              </span>{" "}
              will be permanently deleted. This cannot be undone.
            </p>
          </div>
        </div>
        <div className="flex gap-2.5 mt-5">
          <button
            onClick={onCancel}
            className="flex-1 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Deleting…
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
