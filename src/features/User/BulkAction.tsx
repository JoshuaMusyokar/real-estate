import React from "react";
import { UserCheck, UserX, Trash2, X } from "lucide-react";

interface BulkActionsProps {
  selectedCount: number;
  onBulkAction: (operation: "activate" | "deactivate" | "delete") => void;
  onClearSelection: () => void;
}

export const BulkActions: React.FC<BulkActionsProps> = ({
  selectedCount,
  onBulkAction,
  onClearSelection,
}) => (
  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="text-blue-800 dark:text-blue-200 font-medium">
          {selectedCount} user{selectedCount !== 1 ? "s" : ""} selected
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onBulkAction("activate")}
          className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
        >
          <UserCheck size={16} />
          Activate
        </button>
        <button
          onClick={() => onBulkAction("deactivate")}
          className="flex items-center gap-2 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
        >
          <UserX size={16} />
          Deactivate
        </button>
        <button
          onClick={() => onBulkAction("delete")}
          className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
        >
          <Trash2 size={16} />
          Delete
        </button>
        <button
          onClick={onClearSelection}
          className="flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
        >
          <X size={16} />
          Clear
        </button>
      </div>
    </div>
  </div>
);
