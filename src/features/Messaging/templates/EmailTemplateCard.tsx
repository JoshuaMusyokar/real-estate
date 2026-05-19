import { Edit2, Trash2, Eye, Copy, BarChart2, BookOpen } from "lucide-react";
import { CategoryBadge } from "./CategoryBadge";
import type { EmailTemplate } from "../../../types/messaging-management";

interface Props {
  template: EmailTemplate;
  onEdit: (t: EmailTemplate) => void;
  onDelete: (t: EmailTemplate) => void;
  onDuplicate: (t: EmailTemplate) => void;
  onPreview: (t: EmailTemplate) => void;
}

export const EmailTemplateCard: React.FC<Props> = ({
  template,
  onEdit,
  onDelete,
  onDuplicate,
  onPreview,
}) => (
  <div
    className={`group bg-white dark:bg-gray-900 border rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5
    ${template.isActive ? "border-gray-200 dark:border-gray-800" : "border-dashed border-gray-200 dark:border-gray-700 opacity-60"}`}
  >
    {/* Coloured top strip */}
    <div className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600" />

    <div className="p-4 sm:p-5">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-black text-gray-900 dark:text-white truncate">
            {template.name}
          </p>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate mt-0.5">
            Subject: {template.subject}
          </p>
        </div>
      </div>

      {/* Badges */}
      <div className="flex items-center flex-wrap gap-1.5 mb-3">
        {template.category && <CategoryBadge category={template.category} />}
        {!template.isActive && (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
            Inactive
          </span>
        )}
        {template._count && template._count.campaigns > 0 && (
          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400">
            <BarChart2 className="w-2.5 h-2.5" />
            {template._count.campaigns} campaign
            {template._count.campaigns > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* HTML preview snippet */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl px-3 py-2 mb-3 text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 min-h-[36px] font-mono">
        {template.htmlContent
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 120)}
        …
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2.5 border-t border-gray-100 dark:border-gray-800">
        <p className="text-[10px] text-gray-400">
          {new Date(template.updatedAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPreview(template)}
            title="Preview"
            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDuplicate(template)}
            title="Duplicate"
            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
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
      </div>
    </div>
  </div>
);
