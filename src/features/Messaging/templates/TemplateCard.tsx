import { useState } from "react";
import { Edit2, Trash2, Eye, EyeOff, Copy, Lock } from "lucide-react";
import { ChannelBadge } from "./ChannelBadge";
import { CategoryBadge } from "./CategoryBadge";
import { TokenBadge } from "./TokenBadge";
import type { MessageTemplate } from "../../../types/messaging-management";

interface Props {
  template: MessageTemplate;
  onEdit: (t: MessageTemplate) => void;
  onDelete: (t: MessageTemplate) => void;
  onToggle: (id: string) => void;
  onDuplicate?: (t: MessageTemplate) => void;
}

export const TemplateCard: React.FC<Props> = ({
  template,
  onEdit,
  onDelete,
  onToggle,
  onDuplicate,
}) => {
  const [expanded, setExpanded] = useState(false);

  const preview =
    template.content.length > 120 && !expanded
      ? template.content.slice(0, 120) + "…"
      : template.content;

  return (
    <div
      className={`group relative bg-white dark:bg-gray-900 border rounded-2xl p-4 sm:p-5 transition-all duration-200
      hover:shadow-md hover:-translate-y-0.5
      ${
        template.isActive
          ? "border-gray-200 dark:border-gray-800"
          : "border-dashed border-gray-200 dark:border-gray-700 opacity-60"
      }`}
    >
      {/* System lock badge */}
      {template.isSystem && (
        <div className="absolute top-3 right-3">
          <span className="flex items-center gap-1 text-[10px] font-semibold text-gray-400 dark:text-gray-600">
            <Lock className="w-3 h-3" /> System
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-3 mb-3 pr-6">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-black text-gray-900 dark:text-white truncate mb-1.5">
            {template.name}
          </p>
          <div className="flex items-center flex-wrap gap-1.5">
            <ChannelBadge channel={template.channel} size="xs" />
            <CategoryBadge category={template.category} />
            {!template.isActive && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                Inactive
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content preview */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl px-3 py-2.5 mb-3 min-h-[60px]">
        <p className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap break-words">
          {preview}
        </p>
        {template.content.length > 120 && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="text-[10px] text-blue-500 hover:text-blue-700 mt-1 font-semibold"
          >
            {expanded ? "Show less" : "Show more"}
          </button>
        )}
      </div>

      {/* Used variables */}
      {template.variables.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {template.variables.slice(0, 4).map((v) => (
            <TokenBadge key={v} token={v} />
          ))}
          {template.variables.length > 4 && (
            <span className="text-[10px] text-gray-400 self-center">
              +{template.variables.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Footer: char count + actions */}
      <div className="flex items-center justify-between pt-2.5 border-t border-gray-100 dark:border-gray-800">
        <span className="text-[10px] text-gray-400 font-mono">
          {template.content.length} chars
        </span>

        {!template.isSystem ? (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onToggle(template.id)}
              title={template.isActive ? "Deactivate" : "Activate"}
              className="p-1.5 rounded-lg text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
            >
              {template.isActive ? (
                <EyeOff className="w-3.5 h-3.5" />
              ) : (
                <Eye className="w-3.5 h-3.5" />
              )}
            </button>
            {onDuplicate && (
              <button
                onClick={() => onDuplicate(template)}
                title="Duplicate"
                className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => onEdit(template)}
              title="Edit"
              className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(template)}
              title="Delete"
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => onEdit(template)}
            title="View"
            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
