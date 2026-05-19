import { Mail, Plus } from "lucide-react";
import { EmailTemplateCard } from "./EmailTemplateCard";
import type { EmailTemplate } from "../../../types/messaging-management";

interface Props {
  templates: EmailTemplate[];
  isLoading: boolean;
  onEdit: (t: EmailTemplate) => void;
  onDelete: (t: EmailTemplate) => void;
  onDuplicate: (t: EmailTemplate) => void;
  onPreview: (t: EmailTemplate) => void;
  onCreateNew: () => void;
}

const SkeletonCard: React.FC = () => (
  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden animate-pulse">
    <div className="h-1.5 bg-gray-200 dark:bg-gray-700" />
    <div className="p-4 sm:p-5 space-y-3">
      <div className="flex gap-3">
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-1.5">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        </div>
      </div>
      <div className="flex gap-1.5">
        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
      </div>
      <div className="h-9 bg-gray-100 dark:bg-gray-800 rounded-xl" />
      <div className="flex justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
        <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="flex gap-1">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-lg"
            />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const EmailTemplateList: React.FC<Props> = ({
  templates,
  isLoading,
  onEdit,
  onDelete,
  onDuplicate,
  onPreview,
  onCreateNew,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }
  if (templates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 rounded-2xl border-2 border-dashed border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/10">
        <Mail className="w-12 h-12 text-blue-400 mb-4" />
        <p className="text-sm font-black text-gray-900 dark:text-white mb-1">
          No email templates yet
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-5 text-center max-w-xs">
          Create branded email templates to use in campaigns and automated
          workflows
        </p>
        <button
          onClick={onCreateNew}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-xs font-bold text-white transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Create Email Template
        </button>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
      {templates.map((t) => (
        <EmailTemplateCard
          key={t.id}
          template={t}
          onEdit={onEdit}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
          onPreview={onPreview}
        />
      ))}
    </div>
  );
};
